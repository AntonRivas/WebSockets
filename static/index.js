

document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  //Chooses what to display, either a form to submit your username or the chatroom
    if (!localStorage.getItem('displayname')){
        let display = document.querySelector('#display');
        document.querySelector('#heading').innerHTML = 'Welcome to Chatter!';
        document.getElementById("create_channel").disabled = true;
        document.getElementById("select_channel").disabled = true;
        formFill(display);
        }
    else if(!localStorage.getItem('last_channel')){
      document.querySelector('#heading').innerHTML = 'Welcome: ' + localStorage.getItem('displayname') + "!";
      let display = document.querySelector('#display');
      display.innerHTML = 'No channels currently exist'
    }

    else{
        let display = document.querySelector('#display');
        document.querySelector('#heading').innerHTML = localStorage.getItem('last_channel');
        document.getElementById("select_channel").disabled = false;
        chatFill(display);
    }

  socket.on('connect', (data) => {
    localStorage.setItem("messages", data);
  })
  //receiving and displaying messages in real time
  socket.on('display message', message => {
          console.log(message);
          channel_current = localStorage.getItem('last_channel');
          const div = document.createElement('div');
          const hr = document.createElement('hr');
          div.innerHTML = message["name"] + " : " + message["message"];
          div.className = 'message'
          chatlog = localStorage.getItem(channel_current);
          chatlog = chatlog ? chatlog.split(',') : [];
          console.log(JSON.stringify(chatlog));
          chatlog.push(message);
          localStorage.setItem(channel_current, chatlog);
          document.querySelector('#messages').appendChild(div);
          document.querySelector('#messages').appendChild(hr);
      });

    if (!localStorage.getItem('channel_list')){
      localStorage.setItem('channel_list', [])
    }

//creating channel list
    document.getElementById("select_channel").onclick = () => {

      list = document.getElementById("list");
      document.getElementById("select_channel").disabled = true;
      channel_list = localStorage.getItem('channel_list');
      channel_list = channel_list ? channel_list.split(',') : [] ;
      channel_length = channel_list.length;
      for (var i = 0; i < channel_length; i++){
        div = document.createElement('div');
        div.innerHTML = channel_list[i];
        div.id = channel_list[i];
        div.className = 'channel_selection';

        chatFill(document.querySelector('#display'));
        document.getElementById("list").appendChild(div);
      }
    }

  //creating new channels
    document.getElementById("create_channel").onclick = () => {
      console.log("Created Channel")
      back = document.createElement('button');
      back.innerHTML = 'Go back';
      back.id = 'back_button'
      back.onclick = () =>  {
        document.getElementById("menu").removeChild(back);
        document.getElementById("menu").removeChild(channel);
        document.getElementById("create_channel").disabled = false;
        document.getElementById("select_channel").disabled = false;
        console.log("removed child");
      }
      channel = document.createElement('form');
      channel.id = 'channel_form';
      channel_name = document.createElement('input');
      channel_name.type = 'text';
      channel_submit = document.createElement('input');
      channel_submit.type = 'submit';
      channel_name.id = 'channel_name';
      channel_submit.value = 'Add New Channel';
      channel_name.placeholder = 'Enter Channel Name';
      document.getElementById("menu").appendChild(channel);
      document.getElementById("menu").appendChild(back);
      channel.appendChild(channel_name);
      channel.appendChild(channel_submit);
      document.getElementById("create_channel").disabled = true;
      document.getElementById("select_channel").disabled = true;
      createChannel();
  }

//clears the localStorage
  document.getElementById('clear').onclick = () => {
      let display = document.querySelector('#display');
      messsages = document.getElementById('messages');
      while (messages.childNodes[0]){
        messages.removeChild(messages.childNodes[0])
      }
      document.getElementById("create_channel").disabled = true;
      document.getElementById("select_channel").disabled = true;
      formFill(display);
      localStorage.clear();
  }

})

//Creates form to enter username
function formFill (element){
  document.querySelector('#heading').innerHTML = 'Welcome to Chatter!';
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

//processes and sets up the channel
function createChannel(){
  document.querySelector("#channel_form").addEventListener("submit", (e) => {
        e.preventDefault();
        let name = document.querySelector('#channel_name').value;
        channel_list = localStorage.getItem('channel_list');
        channel_list = channel_list ? channel_list.split(',') : [];
        channel_list.push(name);
        localStorage.setItem('channel_list', channel_list);
        localStorage.setItem("last_channel", name);
        localStorage.setItem(name, [{"name": "user", "log": "channel created"}]);
        let display = document.querySelector('#display');
        document.getElementById("menu").removeChild(document.querySelector('#channel_form'));
        document.getElementById("menu").removeChild(document.querySelector('#back_button'));
        document.getElementById("create_channel").disabled = false;
        document.getElementById("select_channel").disabled = false;
        console.log("Added channel");
        chatFill(display);
        while (document.querySelector('#messages').firstChild){
          document.querySelector('#messages').removeChild(document.querySelector('#messages').firstChild);
        }
        return false;
  })
}

//loads up the channel and chatlog
function chatFill (element){
  if (element.firstChild){
    element.removeChild(element.firstChild);
  }
  channel_name = localStorage.getItem("last_channel");
  chat = document.createElement('form');
  chat.id = 'chat';
  chat_input = document.createElement('input');
  chat_input.type = 'text';
  chat_input.id = 'message';
  chat.className = 'forms';
  chat_input.placeholder = 'Type a message';
  chat_submit = document.createElement('input');
  chat.appendChild(chat_input);
  document.querySelector('#heading').innerHTML = channel_name;
  element.appendChild(chat);
  chatSubmit();
}

function formSubmit(){
//processes when a user submits a displayname and sets it to local storage
  document.querySelector("#form").addEventListener("submit", (e) => {
        e.preventDefault();
        let displayname = document.querySelector('#displayname').value;
        localStorage.setItem('displayname', displayname);
        document.querySelector('#heading').innerHTML = 'Welcome ' + localStorage.getItem('displayname') + '!';
        let display = document.querySelector('#display')
        if(!localStorage.getItem('last_channel')){
          let display = document.querySelector('#display');
          display.innerHTML = 'No channels currently exist'
        }
        else{
          chatFill(display);
        }
        document.getElementById("create_channel").disabled = false;
        document.getElementById("select_channel").disabled = false;
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
