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

// Clear chat history
function clearChatHistory() {
  if (confirm("Are you sure you want to delete all chat history?")) {
    db.ref("messages").remove()
      .then(() => {
        console.log("Chat history deleted successfully.");
        document.getElementById("messages").innerHTML = ""; // Clear chat from UI
      })
      .catch((error) => {
        console.error("Error deleting chat history: ", error);
      });
  }
}
// Function to detect YouTube link and display thumbnail
function detectYouTubeLink(message) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = message.match(youtubeRegex);
  
  if (match && match[1]) {
    const videoId = match[1];
    return `
      <div class="video">
        <img src="https://img.youtube.com/vi/${videoId}/default.jpg" class="video-thumb" onclick="openPopup('${videoId}')">
      </div>
    `;
  }
  return null;
}

// Fetch and display messages
database.ref("messages").on("child_added", function (snapshot) {
  var messages = snapshot.val();
  let messageContent = `<span>${messages.username}</span>: ${messages.message}`;

  // Check if message contains YouTube link
  const youtubeThumbnail = detectYouTubeLink(messages.message);
  if (youtubeThumbnail) {
    messageContent = `<span>${messages.username}</span>: ${youtubeThumbnail}`;
  }

  const message = `<li class="${messages.username === "User" ? "sent" : "receive"}">${messageContent}</li>`;
  document.getElementById("messages").innerHTML += message;
});

// Function to open YouTube popup
function openPopup(videoId) {
  var popup = document.getElementById("popup");
  var iframe = document.getElementById("popup-iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  popup.classList.remove("hidden");
}

// Function to close YouTube popup
function closePopup() {
  var popup = document.getElementById("popup");
  var iframe = document.getElementById("popup-iframe");
  iframe.src = "";
  popup.classList.add("hidden");
}

// Dragging the popup (updated for both mouse and touch events)
var popup = document.getElementById("popup");
var dragHandle = document.getElementById("drag-handle");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Handle mouse down/touch start
dragHandle.addEventListener('mousedown', startDrag);
dragHandle.addEventListener('touchstart', startDrag, { passive: false });

function startDrag(e) {
  e.preventDefault();
  
  isDragging = true;

  // Get initial touch/mouse position
  const startX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;
  const startY = (e.type === 'touchstart') ? e.touches[0].clientY : e.clientY;

  // Get the current position of the popup
  offsetX = popup.offsetLeft - startX;
  offsetY = popup.offsetTop - startY;

  // Add listeners for dragging
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag, { passive: false });

  // Add listeners for stopping the drag
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

// Handle the dragging motion
function drag(e) {
  if (isDragging) {
    e.preventDefault();

    // Get new mouse/touch position
    const currentX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
    const currentY = (e.type === 'touchmove') ? e.touches[0].clientY : e.clientY;

    // Set the new position of the popup
    popup.style.left = (currentX + offsetX) + 'px';
    popup.style.top = (currentY + offsetY) + 'px';
  }
}

// Stop dragging
function stopDrag() {
  isDragging = false;

  // Remove event listeners when drag stops
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('touchmove', drag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}
