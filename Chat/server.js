const path = require("path");
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = "ChitChatBot";

//Run when client connects
io.on('connection', socket => {	
	socket.on('joinRoom',function({username,room}){
		
		const user = userJoin(socket.id,username,room);
		
		socket.join(user.room);
		
		//Welcome current user
		socket.emit('message',formatMessage(botName,'Welcome to ChitChat'));

		//Writing a broadcast message
		socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));
		
		//Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
			
			
		});
		
		
	});
	
	
	
	
	//Listen for chat message
	socket.on('chatMessage',function(msg){
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message',formatMessage(user.username,msg));		
	});
	
	//Runs when client disconnects
	socket.on('disconnect',function(){
		const user = userLeave(socket.id);
		
		if (user){
			io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
				
			io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		
		});
			
			
		}
		
		
		
		
	});
	
	
	
	
});


server.listen(3000,function(){
	console.log("server has started");
});