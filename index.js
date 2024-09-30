const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


// Prompt user for their name
const username = prompt("Please Tell Us Your Name");

// Send message to Firebase
function sendMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Clear the input box and auto-scroll
  messageInput.value = "";
  document.getElementById("messages").scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });

  // Create database entry for message
  db.ref("messages/" + timestamp).set({
    username,
    message,
  });
}

// Detect YouTube link and display thumbnail
function detectYouTubeLink(message) {
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
  let match;
  let youtubeThumbnails = '';

  while ((match = youtubeRegex.exec(message)) !== null) {
    const videoId = match[1];
    youtubeThumbnails += `
      <div class="video">
        <img src="https://img.youtube.com/vi/${videoId}/default.jpg" class="video-thumb" onclick="openPopup('${videoId}')">
      </div>`;
  }

  return youtubeThumbnails || null;
}

// Store the maximum number of visible messages 
const MAX_VISIBLE_MESSAGES = 15;
// Fetch and display messages from Firebase
db.ref("messages").on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const verifiedImagePath = "https://raw.githubusercontent.com/brandedkaminaa/Yuss/main/images (31).jpeg"; // Verified image
// Create a message content without username let 
  messageContent = messages.message;  
// Check if message contains YouTube link and append thumbnail if found
  const youtubeThumbnail = detectYouTubeLink(messages.message);
  if (youtubeThumbnail) {
    messageContent += youtubeThumbnail;
  }

  // Render message with verified image and YouTube link (if applicable)
  const message = `<li class="${username === messages.username ? "sent" : "receive"}">
                    <span>${messages.username}
                      <img src="${verifiedImagePath}" alt="Verified" class="verified-icon" />
                    </span>: ${messageContent}
                  </li>`;
  
  const messagesContainer = document.getElementById("messages");
  
  // Append the new message
  messagesContainer.innerHTML += message;

  // Check if the number of messages exceeds the maximum visible limit
  if (messagesContainer.childElementCount > MAX_VISIBLE_MESSAGES) {
    // Remove the oldest message (first child) to maintain the limit
    messagesContainer.removeChild(messagesContainer.firstElementChild);
  }

  // Auto-scroll to the bottom of the messages
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

// YouTube popup functionality
function openPopup(videoId) {
  const popup = document.getElementById("popup");
  const iframe = document.getElementById("popup-iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  // Set specific dimensions for the popup 
  popup.style.width = "200px"; 
  // Set width 
  popup.style.height = "200px"; 
  // Set height 
  popup.classList.remove("hidden");
}

function closePopup() {
  const popup = document.getElementById("popup");
  const iframe = document.getElementById("popup-iframe");
  iframe.src = "";
  popup.classList.add("hidden");
}

// Dragging the popup (for both mouse and touch events)
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById("popup");
  const dragHandle = document.getElementById("drag-handle");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener('mousedown', startDrag);
  dragHandle.addEventListener('touchstart', startDrag, { passive: false });

  function startDrag(e) {
    e.preventDefault();

    isDragging = true;
    const startX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;
    const startY = (e.type === 'touchstart') ? e.touches[0].clientY : e.clientY;

    offsetX = popup.offsetLeft - startX;
    offsetY = popup.offsetTop - startY;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      const currentX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
      const currentY = (e.type === 'touchmove') ? e.touches[0].clientY : e.clientY;

      popup.style.left = (currentX + offsetX) + 'px';
      popup.style.top = (currentY + offsetY) + 'px';
    }
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
});
