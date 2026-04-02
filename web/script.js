// BankBot Web App Script
let currentUser = null;
let users = [];
let convoHistory = [];

document.addEventListener('DOMContentLoaded', function() {
  loadData();
  setupEventListeners();
  if (localStorage.getItem('bankbotUser')) {
    loginSuccess(JSON.parse(localStorage.getItem('bankbotUser')));
  } else {
    showSection('welcome');
  }
});

function loadData() {
  try {
    users = JSON.parse(localStorage.getItem('bankbotUsers')) || JSON.parse(fs.readFileSync('users.json', 'utf8')) || [];
    convoHistory = JSON.parse(localStorage.getItem('bankbotHistory')) || [];
  } catch (e) {
    users = [];
    convoHistory = [];
  }
}

function saveData() {
  localStorage.setItem('bankbotUsers', JSON.stringify(users));
  localStorage.setItem('bankbotHistory', JSON.stringify(convoHistory));
}

function setupEventListeners() {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function showLogin() {
  document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
  document.getElementById('registerModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    loginSuccess(user);
    showSuccess('Login successful! Welcome back.');
  } else {
    showError('Invalid credentials.');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const mobile = document.getElementById('regMobile').value;
  const account = document.getElementById('regAccount').value;
  const password = document.getElementById('regPassword').value;

  if (users.find(u => u.username === username)) {
    showError('Username already exists.');
    return;
  }

  const newUser = {
    id: users.length + 1,
    username,
    mobile,
    account_number: account,
    password
  };

  users.push(newUser);
  saveData();
  closeModal('registerModal');
  showSuccess('Registration successful! You can now login.');
}

function loginSuccess(user) {
  currentUser = user;
  localStorage.setItem('bankbotUser', JSON.stringify(user));
  document.getElementById('authLinks').style.display = 'none';
  document.getElementById('navLinks').style.display = 'flex';
  document.getElementById('logoutBtn').style.display = 'block';
  loadDashboard();
  showSection('dashboard');
  initWebchat();
}

function logout() {
  currentUser = null;
  localStorage.removeItem('bankbotUser');
  document.getElementById('authLinks').style.display = 'flex';
  document.getElementById('navLinks').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
  showSection('welcome');
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

function loadDashboard() {
  loadUsersTable();
  loadConvoHistory();
  loadProfile();
}

function loadUsersTable() {
  const table = document.getElementById('usersTable');
  table.innerHTML = '<table><tr><th>ID</th><th>Username</th><th>Mobile</th><th>Account</th></tr>' +
    users.map(u => `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.mobile}</td><td>${u.account_number}</td></tr>`).join('') +
    '</table>';
}

function loadConvoHistory() {
  const list = document.getElementById('convoHistory');
  list.innerHTML = convoHistory.map(h => `<li><strong>${h.timestamp}:</strong> ${h.message}</li>`).join('') || '<li>No conversation history</li>';
}

function loadProfile() {
  if (currentUser) {
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileMobile').textContent = `Mobile: ${currentUser.mobile}`;
    document.getElementById('profileAccount').textContent = `Account: ${currentUser.account_number}`;
  }
}

function clearHistory() {
  convoHistory = [];
  saveData();
  loadConvoHistory();
}

function addToHistory(message) {
  convoHistory.unshift({ timestamp: new Date().toLocaleString(), message });
  if (convoHistory.length > 50) convoHistory = convoHistory.slice(0, 50);
  saveData();
  if (currentUser) loadConvoHistory();
}

function showSuccess(msg) {
  const div = document.createElement('div');
  div.className = 'success-msg';
  div.textContent = msg;
  document.querySelector('main').prepend(div);
  setTimeout(() => div.remove(), 3000);
}

function showError(msg) {
  const div = document.createElement('div');
  div.className = 'error-msg';
  div.textContent = msg;
  document.querySelector('main').prepend(div);
  setTimeout(() => div.remove(), 3000);
}

function editProfile() {
  showError('Profile edit coming soon!');
}

function initWebchat() {
  const webchat = document.getElementById('webchat');
  if (webchat.children.length === 0) {
    window.WebChat.default({
      selector: "#webchat",
      initPayload: "/get_started",
      socketUrl: "http://localhost:5005",
      socketPath: "/socket.io/",
      customData: { username: currentUser?.username || 'guest' },
      socketReconnectionAttempts: 5
    }, {
      title: 'BankBot Assistant',
      subtitle: '24/7 Banking Support',
      showClose: false,
      speechToText: true,
      embedded: false
    });
    
    // Mock history add (in real, intercept rasa events)
    addToHistory('Started chat with BankBot');
  }
}

// Nav functions
function showDashboard() { showSection('dashboard'); }
function showProfile() { showSection('profile'); }
function showHistory() { 
  showSection('dashboard'); 
  document.querySelector('.card:nth-child(2)').scrollIntoView();
}

// Close modals on outside click
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
}

