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
const fetchChat = db.ref("messages/");
const messageLimit = 10; // Limit for the number of messages to display
const messagesRef = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const messageKey = snapshot.key; // Get the unique key for the message
  const verifiedImagePath = "path/to/your/verified-image.png"; // Replace with your image path

  const messageHTML = `<li class=${username === messages.username ? "sent" : "receive"} data-key="${messageKey}">
                        <span>
                          ${messages.username}
                          <img src="${verifiedImagePath}" alt="Verified" class="verified-icon" />
                        </span>: ${messages.message}
                      </li>`;
  
  // Append the message to the page
  document.getElementById("messages").innerHTML += messageHTML;

  // Check the number of messages and delete the oldest if necessary
  messagesRef.once("value", (snapshot) => {
    const messageCount = snapshot.numChildren(); // Get the total number of messages

    if (messageCount > messageLimit) {
      // Get the oldest message's key (first child in the snapshot)
      let oldestKey;
      snapshot.forEach((childSnapshot) => {
        oldestKey = childSnapshot.key; // This will hold the key of the first message
      });

      // Delete the oldest message from Firebase
      deleteMessage(oldestKey);
      
      // Remove the oldest message from the display (the first child)
      const firstChild = document.getElementById("messages").firstChild;
      if (firstChild) {
        firstChild.remove();
      }
    }
  });
});

// Ensure you still have the deleteMessage function
function deleteMessage(messageKey) {
  db.ref("messages/" + messageKey).remove()
    .then(() => {
      console.log("Message deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting message: ", error);
    });
}
