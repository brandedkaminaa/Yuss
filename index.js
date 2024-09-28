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

// Fetch chat messages
const messageLimit = 10; // Limit the number of messages to display
let messageCount = 0; // Counter for messages

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const messageKey = snapshot.key; // Get the unique key for the message
  const verifiedImagePath = "path/to/your/verified-image.png"; // Replace with your image path
  
  const message = `<li class=${username === messages.username ? "sent" : "receive"}>
                    <span>
                      ${messages.username}
                      <img src="${verifiedImagePath}" alt="Verified" class="verified-icon" />
                    </span>: ${messages.message}
                  </li>`;
  
  // Append the message to the page
  document.getElementById("messages").innerHTML += message;
  messageCount++;

  // Check if the number of messages exceeds the limit
  if (messageCount > messageLimit) {
    // Get the first message (oldest)
    const firstMessageKey = document.getElementById("messages").firstChild.dataset.key; // Use data-key attribute
    deleteMessage(firstMessageKey); // Delete the message from the database
    document.getElementById("messages").firstChild.remove(); // Remove the message from the page
    messageCount--; // Decrease the message count
  }
});
