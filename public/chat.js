const socket = io();


const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const msgInput = document.getElementById('msgInput');
const nameInput = document.getElementById('nameInput');
const info = document.getElementById('info');


// Join with name when user types a name and focuses out
nameInput.addEventListener('change', () => {
const name = nameInput.value.trim() || 'Anonymous';
socket.emit('join', name);
info.textContent = `Connected as ${name}`;
});


// show system messages
socket.on('system', (text) => {
const el = document.createElement('div');
el.className = 'system';
el.textContent = text;
chatWindow.appendChild(el);
chatWindow.scrollTop = chatWindow.scrollHeight;
});


socket.on('message', (payload) => {
const el = document.createElement('div');
el.className = 'message';
el.innerHTML = `<span class="meta">${escapeHtml(payload.username)} • ${new Date(payload.time).toLocaleTimeString()}</span><div class="text">${escapeHtml(payload.text)}</div>`;
chatWindow.appendChild(el);
chatWindow.scrollTop = chatWindow.scrollHeight;
});


chatForm.addEventListener('submit', (e) => {
e.preventDefault();
const text = msgInput.value.trim();
if (!text) return;
socket.emit('message', text);
msgInput.value = '';
});


function escapeHtml(unsafe) {
return unsafe
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
