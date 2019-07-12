

document.addEventListener('DOMContentLoaded', () => {
  let form = "<form id = 'form'>\
                <input type = 'text' name = 'displayname' id = 'displayname' placeholder = 'Add a display name'><br>  \
                <input type = 'submit' value ='Submit'>    \
              </form>";

  let feed = "Welcome to chat! Please start typing  \
              <ul id = 'messages'>\
              </ul>\
              <form id = 'chat'>\
                <input type = 'text' name = 'message' placeholder = 'Type a message'>   \
                <input type = 'submit' value ='Post message'> \
              </form>";

  document.getElementById('clear').onclick = () => {
      document.querySelector('#display').innerHTML = form;
      localStorage.clear();

  }
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  if (!localStorage.getItem('displayname')){
      document.querySelector('#display').innerHTML = form;
      }
  else{
    document.querySelector('#display').innerHTML = feed;
  }
  document.querySelector("form").addEventListener("submit", () => {
        let displayname = document.querySelector('#displayname').value;
        localStorage.setItem('displayname', displayname);
        document.querySelector('#display').innerHTML = feed;
        return false;
  })
  socket.on('connect', () => {
  // Each button should emit a "submit vote" event
    document.getElementById('chat').onsubmit = () => {
      console.log("message submitted")
      let message = document.getElementById('chat').value ;
      socket.emit('submit message', {'message': message});

    };
  });
  socket.on('display message', message => {
        const li = document.createElement('li');
        li.innerHTML = message;
        document.querySelector('#messages').append(li);
    });
})
