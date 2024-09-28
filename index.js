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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const messagesRef = database.ref('messages');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameInput = document.getElementById('usernameInput');

// Listen for new messages
messagesRef.on('child_added', (data) => {
    const message = data.val();
    displayMessage(message);
});

// Send message on button click
sendButton.addEventListener('click', () => {
    const messageText = messageInput.value;
    const username = usernameInput.value || "Anonymous"; // Default to Anonymous if no username provided
    if (messageText) {
        messagesRef.push({ text: messageText, username: username });
        messageInput.value = ''; // Clear input
    }
});

// Function to display message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Check if the message is sent by the current user
    if (message.username === usernameInput.value) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }
    
    messageElement.textContent = `${message.username}: ${message.text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
}
