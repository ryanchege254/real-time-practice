var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require ('socket.io').listen(server);
var path = require('path');
var mysql = require('mysql');
var session = require('express-session');//determine wheather  the user is logged in
var bodyParser = require('body-parser');//extract form data from login.html
app.use(express.static(path.join(__dirname, 'css')));


users=[];
connections = [];
server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('',function(reg,res){
	res.sendFile(__dirname + '/index.html');
});
/*app.get('/login',function(reg,res){
	res.sendFile(__dirname + '/login.html');
});*/

// indicate when a user is connected
io.sockets.on('connection', function(socket){
	 connections.push(socket);
	 console.log('Connected: %s sockets connected',connections.length);


	 //diconnect
	 socket.on('disconnect', function(data){
	 	if(!socket.username)return;
	 	users.splice(users.indexOf(socket.username),1);
	 	updateUsernames();
	 	 connections. splice(connections.indexOf(socket),1)
	 console.log('Disconnected: %s sockets connected',connections.lenghth);
	 });
	
	//send message 
	socket.on('send message',function(data){
		io.sockets.emit('new message', {msg:data, user:socket.username});
	});

	//new user
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username=data;

		users.push(socket.username);
		updateUsernames();


	});
});
	function updateUsernames(){
		io.sockets.emit('get users',users);
	}
  