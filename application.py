import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

# in case you forget $env:FLASK_APP ='application.py'
#                    $env:FLASK_ENV ='development'

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = []
@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("submit message")
def chat(message):
    emit("display message", {"message": message}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
