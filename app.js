const socket = io(); // Assuming you're using Socket.io for real-time communication
const username = localStorage.getItem('username');
const chatBox = document.getElementById('chat-box');
const player = document.getElementById('youtube-player');

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('message', { username, message });
        input.value = '';
    }
}

socket.on('message', data => {
    const { username, message } = data;
    const newMessage = document.createElement('div');
    newMessage.textContent = `${username}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Handle commands
    if (message.startsWith('/play ')) {
        const url = message.split('/play ')[1];
        playSong(url);
    } else if (message === '/stop') {
        stopSong();
    }
});

function playSong(url) {
    const videoId = url.split('v=')[1];
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    player.style.width = '560px';
    player.style.height = '315px';
    document.querySelector('.player-container').style.display = 'block';
}

function stopSong() {
    player.src = '';
    player.style.width = '0';
    player.style.height = '0';
    document.querySelector('.player-container').style.display = 'none';
}
