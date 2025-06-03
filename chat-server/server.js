const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'your_secret_key';
const usersDB = {}; // In-memory user store

// Register new users
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  if (usersDB[username]) return res.status(409).json({ message: 'User already exists' });
  usersDB[username] = password;
  return res.status(201).json({ message: 'User registered successfully' });
});

// Login with JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (usersDB[username] && usersDB[username] === password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const payload = jwt.verify(token, SECRET);
    socket.user = payload.username;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

const users = {};

io.on('connection', (socket) => {
  const socketId = socket.id;
  users[socketId] = socket;

  socket.emit('your-id', socketId);
  io.emit('all-users', Object.keys(users).filter(id => id !== socketId));

  socket.on('call-user', ({ userToCall, signalData, from }) => {
    if (users[userToCall]) {
      users[userToCall].emit('call-made', { signal: signalData, from });
    }
  });

  socket.on('answer-call', ({ signal, to }) => {
    if (users[to]) {
      users[to].emit('call-answered', { signal });
    }
  });

  socket.on('send-message', ({ message, from }) => {
    socket.broadcast.emit('receive-message', { message, from });
  });

  socket.on('disconnect', () => {
    delete users[socketId];
    io.emit('all-users', Object.keys(users));
  });
});

server.listen(8080, () => console.log('🚀 Server running on https://tradebridge.onrender.com'));
