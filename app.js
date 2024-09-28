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
const chatBox = document.getElementById('chat-box');
const username = localStorage.getItem('username');

// Function to send a message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        // Add the message to Firebase with a timestamp
        chatRef.push({
            username: username,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });

        // Clear input field
        input.value = '';
    }
}

// Retrieve the last 500 messages from Firebase and listen for new ones
chatRef.limitToLast(500).on('child_added', snapshot => {
    const data = snapshot.val();
    addMessageToChatBox(data.username, data.message);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat
});

// Automatically delete messages if the count exceeds 500
chatRef.on('value', snapshot => {
    if (snapshot.numChildren() > 500) {
        let messageList = snapshot.val();
        let oldestMessage = Object.keys(messageList)[0]; // Get the key of the oldest message

        // Delete the oldest message
        chatRef.child(oldestMessage).remove();
    }
});

// Function to display message in the chat box
function addMessageToChatBox(username, message) {
    const newMessage = document.createElement('div');
    newMessage.textContent = `${username}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
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
