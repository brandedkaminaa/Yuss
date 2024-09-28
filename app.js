// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCphoH9_NPxSzgnh6kjXvPTlQdHOGkFGgQ",
  authDomain: "simple-project-de502.firebaseapp.com",
  databaseURL: "https://simple-project-de502-default-rtdb.firebaseio.com",
  projectId: "simple-project-de502",
  storageBucket: "simple-project-de502.appspot.com",
  messagingSenderId: "194813539682",
  appId: "1:194813539682:web:f5260ae96cde439c0f683b",
  measurementId: "G-HG982T31BL"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const chatRef = database.ref('chats');

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    const username = localStorage.getItem('username');
    if (message) {
        // Add the message to the chat box immediately
        addMessageToChatBox(username, message);

        // Save the message to Firebase
        chatRef.push({
            username,
            message
        });

        // Clear the input field
        input.value = '';
    }
}

// Listen for new messages from Firebase and update chat
chatRef.on('child_added', snapshot => {
    const data = snapshot.val();
    addMessageToChatBox(data.username, data.message);

    // Handle play/stop commands
    if (data.message.startsWith('/play ')) {
        const url = data.message.split('/play ')[1];
        playSong(url);
    } else if (data.message === '/stop') {
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
