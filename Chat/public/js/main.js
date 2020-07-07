const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const{username,room} = Qs.parse(location.search , {
	ignoreQueryPrefix: true
});


//AT THIS POINT WE HAVE THE USERNAME AND PASS, IN ACTUAL VERSION, WE MUST DO STH ELSE TO GET USERNAME AND PASS
console.log(username,room);

//Join chatroom
socket.emit('joinRoom', {username,room});


//Get room users
socket.on('roomUsers', function ({room,users}){
	outputRoomName(room);
	outputUsers(users);
})

//Message from server
socket.on('message',function(message){
	console.log(message);
	OutputMessage(message);
	
	//We need to scroll down every time we get a message
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Listening for text in chatform, e is event parameter
chatForm.addEventListener('submit', function(e){
	
	//Prevent default action
	e.preventDefault();
	
	//Grab input text
	const msg = e.target.elements.msg.value;
	
	//Send input text to server
	socket.emit('chatMessage',msg)
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
	
	
});

function OutputMessage(message) {
	const div = document.createElement('div');
	
	div.classList.add('message');
	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
	
	document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room){
	roomName.innerText = room;
}

function outputUsers(users){
	userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

//THis is emoji-code
  const button = document.querySelector('#emoji-button');
  
  const picker = new EmojiButton({
	  autoHide: false
  });

  picker.on('emoji', emoji => {
    document.querySelector('input').value += emoji;
  });

  button.addEventListener('click', () => {
     picker.pickerVisible ? picker.hidePicker() : picker.showPicker(button);
  });


