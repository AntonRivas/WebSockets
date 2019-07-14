

document.addEventListener('DOMContentLoaded', () => {

  let form = "<form id = 'form'>\
                <input type = 'text' id = 'displayname' placeholder = 'Add a display name'><br>  \
                <input type = 'submit' value ='Submit'>    \
              </form>";

  let feed = "Welcome to chat! Please start typing  \
              <ul id = 'messages'>\
              </ul>\
              <form id = 'chat'>\
                <input type = 'text' id = 'message' placeholder = 'Type a message'>   \
                <input type = 'submit' value ='Post message'> \
              </form>";

  document.getElementById('clear').onclick = () => {
      document.querySelector('#display').innerHTML = form;
      localStorage.clear();
  }

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

//Chooses what to display, either a form to submit your username or the chatroom
  if (!localStorage.getItem('displayname')){
      document.querySelector('#display').innerHTML = form;
      }
  else{
    document.querySelector('#display').innerHTML = feed;
  }

//processes when a user submits a displayname and sets it to local storage
  document.querySelector("#form").addEventListener("submit", () => {
        let displayname = document.querySelector('#displayname').value;
        localStorage.setItem('displayname', displayname);
        document.querySelector('#display').innerHTML = feed;
        return false;
  })

//implementing messaging abilities to the chat form
  socket.on('connect', () => {
    document.querySelector("#chat").onsubmit = () => {
      console.log("message submitted")
      let message = document.getElementById('message').value ;
      socket.emit('submit message', {'message': message});

    };
  });

//receiving and displaying messages in real time
  socket.on('display message', message => {
        const li = document.createElement('li');
        li.innerHTML = message;
        document.querySelector('#messages').append(li);
    });
})
