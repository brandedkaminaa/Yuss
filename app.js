// Firebase Configuration
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
// app.js

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-box');

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  const username = localStorage.getItem('username') || 'Anonymous'; // Get stored username or use 'Anonymous'

  if (message) {
    // Push message to Firebase
    chatRef.push({
      username: username,
      message: message,
      timestamp: Date.now()
    });

    // Clear the input field
    messageInput.value = '';
  }
}

// Listen for new messages and display them in the chat box
chatRef.on('child_added', snapshot => {
  const data = snapshot.val();
  displayMessage(data.username, data.message);
});

// Function to display message in the chat box
function displayMessage(username, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(username === localStorage.getItem('username') ? 'user' : 'others');
  messageElement.textContent = `${username}: ${message}`;

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}
