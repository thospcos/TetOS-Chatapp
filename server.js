const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static(path.join(__dirname, 'public')));


io.on('connection', (socket) => {
console.log('a user connected:', socket.id);


// Join with a username
socket.on('join', (username) => {
socket.username = username || 'Anonymous';
socket.broadcast.emit('system', `${socket.username} joined the chat`);
});


// Receive chat messages
socket.on('message', (msg) => {
const payload = {
id: socket.id,
username: socket.username || 'Anonymous',
text: msg,
time: new Date().toISOString(),
};
io.emit('message', payload);
});


socket.on('disconnect', () => {
console.log('user disconnected:', socket.id);
if (socket.username) {
socket.broadcast.emit('system', `${socket.username} left the chat`);
}
});
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
