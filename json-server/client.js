const ws = new WebSocket('ws://localhost:3002');
const statusDiv = document.getElementById('status');
const messagesDiv = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Update connection status
function updateStatus(status) {
  statusDiv.textContent = status;
  statusDiv.className = `status ${status === 'Connected' ? 'connected' : 'disconnected'}`;
}

// Add message to the UI
function addMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  
  const usernameSpan = document.createElement('span');
  usernameSpan.className = 'username';
  usernameSpan.textContent = message.user;
  
  const timestampSpan = document.createElement('span');
  timestampSpan.className = 'timestamp';
  timestampSpan.textContent = new Date(message.timestamp).toLocaleTimeString();
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'content';
  contentDiv.textContent = message.message;
  
  messageDiv.appendChild(usernameSpan);
  messageDiv.appendChild(timestampSpan);
  messageDiv.appendChild(contentDiv);
  
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message
function sendMessage() {
  const username = usernameInput.value.trim() || 'Anonymous';
  const message = messageInput.value.trim();
  
  if (message) {
    ws.send(JSON.stringify({
      type: 'chat',
      user: username,
      message: message
    }));
    
    messageInput.value = '';
  }
}

// WebSocket event handlers
ws.onopen = () => {
  updateStatus('Connected');
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    
    if (data.type === 'messages') {
      // Load all existing messages
      data.data.forEach(message => addMessage(message));
    } else if (data.type === 'newMessage') {
      // Add new message
      addMessage(data.data);
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
};

ws.onclose = () => {
  updateStatus('Disconnected');
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  updateStatus('Error');
};

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});