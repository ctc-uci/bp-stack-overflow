import os

from flask import Flask, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "ctcoverflow",
})

db = firestore.client()




app = Flask(__name__)

#look mom, here's some important backend!
users = db.collection('users')
posts = db.collection('posts')
comments = db.collection('comments')

x = 0
@app.route('/api/inc')
def hello_world():
    global x
    x += 1
    return str(f"Clicked {x} times.")

@app.route('/api/add',methods=['POST'])
def add():
    db.collection('posts').add({"body": request.form['body']})
    return "HTTP OK",200

@app.route('/api/read',methods=['GET'])
def read():
    return ",\n".join(i.to_dict()["body"] for i in db.collection('posts').stream())

def commend(user):
    users[user]['helpPoints'] += 1
    print("Would commend",user)

@app.route('/api/makePost',methods=['POST'])
def makePost():
    json = {"author":request.json['id'], 'points':0, 'title': request.json['title'], 'body': request.json['body'], 'date':  datetime.now().strftime("%m/%d/%Y"), 'answers': []}
    posts.add(json)
    return "OK",200


@app.route('/api/makeComment',methods=['POST'])
def makeComment():
    parent = request.json['parent']
    pdoc = posts.document(parent).get().to_dict()
    newComment = {'author': request.json['author'], 'body': request.json['body'], 'parent': request.json['parent'],"points":0}
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
    parent = request.json['id']
    target = int(request.json['index'])
    pdoc = posts.document(parent).get().to_dict()
    tochange = pdoc
    if target > 0:
        tochange = pdoc['answers'][target-1]
    tochange['points'] += 1
    commend(tochange['author'])
    posts.document(parent).set(pdoc)
    return "OK",200

@app.route('/api/leaderboard',methods=['GET'])
def leaderboard():
    userdict = {}
    pointLeaderboard = {}
    for x in users:
        userdict[x['username']] = x['helpPoints']
    count = 0;
    for i in userdict.items().sort(key=lambda y: y[1],reverse=True):
        count += 1
        pointLeaderboard[count] = i
    return {results: pointLeaderboard}

@app.route('/api/submitRequest', methods=['POST'])
def submitRequest():
    #TODO
    user = request.json['id']

@app.route('/api/status', methods=['GET'])
def status():
    #TODO
    user = request.json['id']

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
