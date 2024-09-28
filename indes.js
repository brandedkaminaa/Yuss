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
const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

// YouTube player variable
let player;
let videoId = '';

// Function to load YouTube Iframe API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video', {
        height: '180',
        width: '320',
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Event listener for when the player is ready
function onPlayerReady(event) {
    if (videoId) {
        player.loadVideoById(videoId);
    }
}

// Function to send a chat message
function sendMessage(e) {
  e.preventDefault();

  // Get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Clear the input box
  messageInput.value = "";

  // Auto-scroll to the bottom
  document.getElementById("messages").scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });

  // Create db collection and send the data
  db.ref("messages/" + timestamp).set({
    username,
    message,
  }).then(() => {
    limitMessages(); // Call the function to limit messages after sending a new one
  });
}

// Fetch chat messages
const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${messages.username}: </span>${messages.message}</li>`;

  // Append the message to the page
  document.getElementById("messages").innerHTML += message;
});

// Function to limit messages to the last 10
function limitMessages() {
  const messagesRef = db.ref("messages");
  messagesRef.once("value", (snapshot) => {
    const messages = snapshot.val();
    const messageKeys = Object.keys(messages);
    
    // If there are more than 10 messages, delete the oldest ones
    if (messageKeys.length > 10) {
      const keysToDelete = messageKeys.sort().slice(0, messageKeys.length - 10);
      keysToDelete.forEach(key => {
        messagesRef.child(key).remove();
      });
    }
  });
}

// YouTube Controls
document.getElementById('load-video').addEventListener('click', () => {
    const url = document.getElementById('video-url').value;
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/);
    if (videoIdMatch) {
        videoId = videoIdMatch[1];
        player.loadVideoById(videoId);
        db.ref('videos/current').set({ videoId });
    }
});

document.getElementById('play').addEventListener('click', () => {
    player.playVideo();
    db.ref('videos/current').set({ state: 'playing', videoId }, { merge: true });
});

document.getElementById('pause').addEventListener('click', () => {
    player.pauseVideo();
    db.ref('videos/current').set({ state: 'paused', videoId }, { merge: true });
});

// Syncing video state
db.ref('videos/current').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.videoId && data.videoId !== videoId) {
        videoId = data.videoId;
        player.loadVideoById(videoId);
    }
    if (data && data.state === 'playing') {
        player.playVideo();
    } else if (data && data.state === 'paused') {
        player.pauseVideo();
    }
});

// Load the YouTube Iframe API
const script = document.createElement('script');
script.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(script);
