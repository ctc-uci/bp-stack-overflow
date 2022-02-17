import os

from flask import Flask, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore,auth
from datetime import datetime

#Initialize important resources
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "ctcoverflow",
})

db = firestore.client()

app = Flask(__name__)

users = db.collection('users')
posts = db.collection('posts')


# Helper functions!!

def uid_to_email(uid):
    return auth.get_user(uid).email #Todo: instead of being lazy, handle the case where we have bad uid explicitly!

def user_from_email(addr):
    res = list(users.where('username','==',addr).stream())
    if not len(res):
        users.add({"username":addr,"helpPoints":0,"status":[]})
    res = list(users.where('username','==',addr).stream()) # we may have created a new object for this user if none found, so search again.
    return res[0]

def commend(addr,message):
    ref = user_from_email(addr)
    r2 = ref.to_dict()
    r2['helpPoints'] += 1
    r2['status'].append(message)
    users.document(ref.id).set(r2)

@app.route('/api/commend',methods=['POST'])
def commendMethod():
    uid = uid_to_email(request.json['uid'])
    commend(request.json['id'],request.json['message'])
    return "OK",200

@app.route('/api/makePost',methods=['POST'])
def makePost():
    addr = uid_to_email(request.json['uid'])
    json = {"author":addr, 'voters':[], 'title': request.json['title'], 'body': request.json['body'], 'date':  datetime.now().strftime("%m/%d/%Y"), 'answers': []}
    posts.add(json)
    return "OK",200


@app.route('/api/makeComment',methods=['POST'])
def makeComment():
    parent = request.json['parent']
    addr = uid_to_email(request.json['uid'])
    pdoc = posts.document(parent).get().to_dict()
    newComment = {'author': addr, 'body': request.json['body'], 'parent': request.json['parent'],"voters":[]}
    pdoc['answers'].append(newComment)
    posts.document(parent).set(pdoc)
    return "OK",200

def makeDict(reference):
    r2 = reference.to_dict()
    r2['id'] = reference.id
    return r2

@app.route('/api/searchPosts',methods=['GET'])
def searchPosts():
    if 'answered' in request.args:
        if request.args['answered'] == 'false':
            q = posts.where('answers', '==', []).order_by('date')
        else:
            q = posts.order_by('answers').where('answers', '!=', []).order_by('date')
    else:
        q = posts.order_by('date')
    resCount = 10
    q = q.limit(resCount).offset(int(request.args['page'])*resCount)
    results = [makeDict(i) for i in q.stream()]
    return {'result': results}

@app.route('/api/like',methods=['POST'])
def like():
    addr = uid_to_email(request.json['uid'])
    parent = request.json['id']
    target = int(request.json['index'])
    pdoc = posts.document(parent).get().to_dict()
    tochange = pdoc
    if target > 0:
        tochange = pdoc['answers'][target-1]
    if addr not in tochange['voters']:
        tochange['voters'].append(addr)
        msg = f'{addr} liked your post or comment!'
        commend(tochange['author'],msg)
    posts.document(parent).set(pdoc)
    return "OK",200

@app.route('/api/leaderboard',methods=['GET'])
def leaderboard():
    def makeSummary(user):
        return {"points": user.get('helpPoints'), 'id': user.get('username')}
    return {"result": [makeSummary(i) for i in users.order_by('helpPoints', direction=firestore.Query.DESCENDING).stream()] }

@app.route('/api/submitRequest', methods=['POST'])
def submitRequest():
    #TODO
    #user = request.json['id']
    print("TODO")

@app.route('/api/status', methods=['GET'])
def status():
    #TODO: fail more safely.
    addr = uid_to_email(request.args['uid'])
    you = user_from_email(addr)
    return {"result": you.get('status'), "points": you.get('helpPoints')}


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
