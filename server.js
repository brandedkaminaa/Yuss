const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public')); // Serve static files (HTML, CSS, JS)

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('message', (data) => {
        io.emit('message', data); // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
