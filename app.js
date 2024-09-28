const socket = io();
const username = localStorage.getItem('username');
const chatBox = document.getElementById('chat-box');
const player = document.getElementById('youtube-player');

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        // Display the message in the chat box immediately
        addMessageToChatBox(username, message);

        // Send the message to the server
        socket.emit('message', { username, message });
        
        // Clear the input field
        input.value = '';
    }
}

// Listen for incoming messages and update chat
socket.on('message', data => {
    const { username, message } = data;
    addMessageToChatBox(username, message);

    // Handle play/stop commands
    if (message.startsWith('/play ')) {
        const url = message.split('/play ')[1];
        playSong(url);
    } else if (message === '/stop') {
        stopSong();
    }
});

function addMessageToChatBox(username, message) {
    const newMessage = document.createElement('div');
    newMessage.textContent = `${username}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
}

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
