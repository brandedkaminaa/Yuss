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
const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

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
  });
}
// Function to clear chat history from Firebase and the frontend
function clearChatHistory() {
    if (confirm("Are you sure you want to clear the chat history? This cannot be undone.")) {
        // Clear messages from Firebase
        messagesRef.remove()
            .then(() => {
                console.log("Chat history cleared from Firebase.");
                // Clear messages from the frontend
                const messagesList = document.getElementById('messages');
                while (messagesList.firstChild) {
                    messagesList.removeChild(messagesList.firstChild);
                }
            })
            .catch((error) => {
                console.error("Error clearing chat history: ", error);
            });
    }
}

// Fetch messages from Firebase and display them
messagesRef.on('child_added', function (snapshot) {
    displayMessage(snapshot); // Pass the snapshot directly
});
                   
// Fetch chat messages
// Fetch chat messages
const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const verifiedImagePath = "https://raw.githubusercontent.com/brandedkaminaa/Yuss/main/images (31).jpeg"; // Replace with your image path
  const message = `<li class=${username === messages.username ? "sent" : "receive"}>
                    <span>
                      ${messages.username}
                      <img src="${verifiedImagePath}" alt="Verified" class="verified-icon" />
                    </span>: ${messages.message}
                  </li>`;
  
  // Append the message to the page
  document.getElementById("messages").innerHTML += message;
});
