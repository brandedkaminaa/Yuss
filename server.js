const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let users = []; // Keep track of online users

app.use(express.static(__dirname + '/public')); // Serve static files (HTML, CSS, JS)

io.on('connection', socket => {
    console.log('A user connected');

    // Handle when a user joins
    socket.on('userJoined', (username) => {
        users.push(username);
        io.emit('userList', users); // Send updated user list to all clients
        io.emit('message', { username: 'Server', message: `${username} has joined the chat.` });
    });

    // Handle message event
    socket.on('message', (data) => {
        io.emit('message', data); // Broadcast message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.find(user => user.socketId === socket.id);
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('message', { username: 'Server', message: `${username} has left the chat.` });
        io.emit('userList', users); // Update user list
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
