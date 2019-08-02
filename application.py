import os


from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

# in case you forget $env:FLASK_APP ='application.py'
#                    $env:FLASK_ENV ='development'

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = []

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == 'POST':
        chatlog = request.get("chatlog")
        channel_name = request.get("channel_name")
        return "completed post"
    else:
        return render_template("index.html")

@socketio.on("connect")
def message():
    emit("connect", {"messages": messages}, broadcast = True )

@socketio.on("submit message")
def chat(data):
    messages.append(data)
    message = data["message"]
    name = data["name"]
    emit("display message", {"message": message, "name": name}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
