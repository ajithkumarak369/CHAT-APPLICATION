const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname, 'Public')));


io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);

    
    socket.emit('message', {
      username: 'ChatCord Bot',
      text: `Welcome to ChatCord!`,
      time: getTime()
    });

    
    socket.broadcast.to(room).emit('message', {
      username: 'ChatCord Bot',
      text: `${username} has joined the chat`,
      time: getTime()
    });
  });

  
  socket.on('chatMessage', msg => {
    io.emit('message', {
      username: 'User',
      text: msg,
      time: getTime()
    });
  });
});

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

server.listen(3000, () => console.log('Server running on port 3000'));
