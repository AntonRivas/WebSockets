

document.addEventListener('DOMContentLoaded', () => {

//clears the displayname
  document.getElementById('clear').onclick = () => {
      let display = document.querySelector('#display');
      formFill(display);
      localStorage.clear();
  }

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

//Chooses what to display, either a form to submit your username or the chatroom
  if (!localStorage.getItem('displayname')){
      let display = document.querySelector('#display');
      formFill(display);
      }
  else{
      let display = document.querySelector('#display');
      chatFill(display);

  }

socket.on('connect', (data) => {
  localStorage.setItem("messages", data);
})
//receiving and displaying messages in real time
  socket.on('display message', message => {
        console.log(message);
        let messagelist = localStorage.getItem("messages");
        const li = document.createElement('li');
        user = message["name"];
        li.innerHTML = user + " : " + message["message"];
        document.querySelector('#messages').append(li);
    });
})

//Creates form to enter username
function formFill (element){
  if (element.childNodes[0]){
    element.removeChild(element.childNodes[0]);
  }
  form = document.createElement('form');
  form.id = 'form';
  form_input = document.createElement('input');
  form_input.type = 'text';
  form_input.id = 'displayname'
  form_input.placeholder = 'Add a display name';
  form_submit = document.createElement('input');
  form_submit.type = 'submit';
  form_submit.value = 'Submit';
  form.appendChild(form_input);
  form.appendChild(form_submit);
  element.appendChild(form);

  formSubmit();
}

function chatFill (element){
  if (element.firstChild){
    element.removeChild(element.firstChild);
  }
  chat = document.createElement('form');
  chat.id = 'chat';
  chat_input = document.createElement('input');
  chat_input.type = 'text';
  chat_input.id = 'message'
  chat_input.placeholder = 'Type a message';
  chat_submit = document.createElement('input');
  chat_submit.type = 'submit';
  chat_submit.value = 'Submit Message';
  chat.appendChild(chat_input);
  chat.appendChild(chat_submit);
  element.appendChild(chat);
  chatSubmit();
}

function formSubmit(){
//processes when a user submits a displayname and sets it to local storage
  document.querySelector("#form").addEventListener("submit", (e) => {
        e.preventDefault();
        let displayname = document.querySelector('#displayname').value;
        localStorage.setItem('displayname', displayname);
        let display = document.querySelector('#display')
        chatFill(display);
        return false;
  })
}

function chatSubmit(){
//sends out message to server and implement event listener to the chat form
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    document.querySelector("#chat").addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("message submitted");
      let message = document.getElementById('message').value ;
      let name = localStorage.getItem('displayname');
      socket.emit('submit message', {'message': message, "name":name});
      document.getElementById('message').value = ''
      return false;
  });
}
