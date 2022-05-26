import json
import os
from datetime import datetime
from urllib.parse import urlencode

import firebase_admin
import requests
from dotenv import dotenv_values
from firebase_admin import auth, credentials, firestore
from flask import Flask, request
from flask_cors import CORS

config = dotenv_values('.env')

#Initialize important resources
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "ctcoverflow",
})

db = firestore.client()

app = Flask(__name__)
CORS(app)

users = db.collection('users')
posts = db.collection('posts')
messages = db.collection('messages')


# Helper functions!!

def uid_to_email(uid):
    return auth.get_user(uid).email #Todo: instead of being lazy, handle the case where we have bad uid explicitly!

def user_from_email(addr):
    res = list(users.where('username','==',addr).stream())
    if not len(res):
        users.add({"username":addr,"helpPoints":0,"status":[],'saved':[]})
    res = list(users.where('username','==',addr).stream()) # we may have created a new object for this user if none found, so search again.
    return res[0]

def commend(addr,message,delta=1):
    ref = user_from_email(addr)
    r2 = ref.to_dict()
    r2['helpPoints'] += delta
    r2['status'].append(message)
    users.document(ref.id).set(r2)

@app.route('/api/commend',methods=['POST'])
def commendMethod():
    uid = uid_to_email(request.json['uid'])
    commend(request.json['id'],request.json['message'])
    return "OK",200

@app.route('/api/editPost', methods=['POST'])
def editPost():
    uid = uid_to_email(request.json['uid'])
    document_id = request.json['document_id']
    assert posts.document(document_id).get().to_dict()['author'] == uid
    posts.document(document_id).update({u'body': request.json['body']})
    return "OK",200

@app.route('/api/deletePost', methods=['POST'])
def deletePost():
    uid = uid_to_email(request.json['uid'])
    document_id = request.json['document_id']
    assert posts.document(document_id).get().to_dict()['author'] == uid
    posts.document(document_id).delete()
    return "OK",200

@app.route('/api/editComment',methods=['POST'])
def editComment():
    uid = uid_to_email(request.json['uid'])
    parent = request.json['document_id']
    index = int(request.json['index'])
    pdoc = posts.document(parent).get().to_dict()
    assert pdoc['answers'][index]['author'] == uid
    pdoc['answers'][index]['body'] = request.json['body']
    posts.document(parent).set(pdoc)
    return "OK",200

@app.route('/api/deleteComment',methods=['POST'])
def deleteComment():
    uid = uid_to_email(request.json['uid'])
    parent = request.json['document_id']
    index = int(request.json['index'])
    pdoc = posts.document(parent).get().to_dict()
    assert pdoc['answers'][index]['author'] == uid
    pdoc['answers'].pop(index)
    posts.document(parent).set(pdoc)
    return "OK",200

@app.route('/api/makePost',methods=['POST'])
def makePost():
    addr = uid_to_email(request.json['uid'])
    json = {"author":addr, 'voters':[], 'title': request.json['title'], 'body': request.json['body'], 'date':  datetime.now().strftime("%m/%d/%Y"), 'answers': [], 'tags': request.json['tags']}
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

@app.route('/api/algoliaSearch', methods=['POST'])
def algoliaSearch():
    url = 'https://UWK1WLGVN7.algolia.net/1/indexes/postsIndex/query'
    headers = {
        'X-Algolia-Application-Id': config['ALGOLIA_APP_ID'],
        'X-Algolia-API-Key': config['ALGOLIA_API_KEY']
    }
    payload = {'params': urlencode({'query': request.json['query']})}
    return requests.post(url, data=json.dumps(payload), headers=headers).json()

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

@app.route('/api/unlike',methods=['POST'])
def unlike():
    addr = uid_to_email(request.json['uid'])
    parent = request.json['id']
    target = int(request.json['index'])
    pdoc = posts.document(parent).get().to_dict()
    tochange = pdoc
    if target > 0:
        tochange = pdoc['answers'][target-1]
    if addr in tochange['voters']:
        tochange['voters'].remove(addr)
        msg = f'{addr} unliked your post or comment...'
        commend(tochange['author'],msg,delta=-1)
    posts.document(parent).set(pdoc)
    return "OK",200

@app.route('/api/leaderboard',methods=['GET'])
def leaderboard():
    def makeSummary(user):
        uRecord = auth.get_user_by_email(user.get('username'))
        return {"points": user.get('helpPoints'), 'id': user.get('username'), 'photo_url': uRecord.photo_url}
    return {"result": [makeSummary(i) for i in users.order_by('helpPoints', direction=firestore.Query.DESCENDING).stream()] }

@app.route('/api/submitRequest', methods=['POST'])
def submitRequest():
    messages.add({'body':request.json['body'],'title':request.json['title'], 'sender': request.json['email']})
    return 'OK',200

@app.route('/api/savePost',methods=['POST'])
def savePost():
    addr = uid_to_email(request.json['uid'])
    ref = user_from_email(addr)
    r2 = ref.to_dict()
    r2['saved'].append(request.json['id'])
    users.document(ref.id).set(r2)
    return 'OK',200


@app.route('/api/unsavePost',methods=['POST'])
def unsavePost():
    addr = uid_to_email(request.json['uid'])
    ref = user_from_email(addr)
    r2 = ref.to_dict()
    if request.json['id'] in r2['saved']:
        r2['saved'].remove(request.json['id'])
    users.document(ref.id).set(r2)
    return 'OK',200


@app.route('/api/status', methods=['GET'])
def status():
    #TODO: fail more safely.
    addr = uid_to_email(request.args['uid'])
    you = user_from_email(addr)
    return {"result": you.get('status'), "points": you.get('helpPoints'),'saved': you.get('saved')}

@app.route('/api/getPost', methods=['GET'])
def getPost():
    return posts.document(request.args['post_id']).get().to_dict()

@app.route('/api/getSaved', methods=['POST'])
def getSaved():
    email = uid_to_email(request.json['uid'])
    user = user_from_email(email)
    user_doc = user.to_dict()
    return json.dumps(user_doc['saved'])

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
