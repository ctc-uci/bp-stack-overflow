import os

from flask import Flask

app = Flask(__name__)

#look mom, here's some important backend!

x = 0
@app.route('/api')
def hello_world():
    global x
    x += 1
    return str(f"Clicked {x} times.")

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
