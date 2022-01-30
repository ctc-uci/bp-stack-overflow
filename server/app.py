import os

from flask import Flask, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "ctcoverflow",
})

db = firestore.client()




app = Flask(__name__)

#look mom, here's some important backend!

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

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
