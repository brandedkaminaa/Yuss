// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

function sendMessage(e) {
  e.preventDefault();

  // Get values to be submitted
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
  db.ref("messages").push({
    username,
    message,
  }).then(() => {
    clearMessages(); // Call the function to clear all messages after sending a new one
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

// Function to clear all messages
function clearMessages() {
  db.ref("messages").remove() // This will delete all messages in the "messages" node
    .then(() => {
      console.log("All messages cleared.");
      document.getElementById("messages").innerHTML = ""; // Clear the messages displayed on the page
    })
    .catch((error) => {
      console.error("Error clearing messages:", error);
    });
}
