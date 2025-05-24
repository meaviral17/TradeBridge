const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const JWT_SECRET="kfzT7WLh52oXvDFQabFzJxMmG3eNt8qz";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 🔐 JWT validation middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded.sub; // assuming "sub" holds username
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

// 🌐 Chat logic
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.user}`);

  socket.on('chatMessage', (text) => {
    const msg = {
      username: socket.user,
      message: text
    };
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 ${socket.user} disconnected`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🔐 Secure chat server running on port ${PORT}`);
});


const users = {};

io.on('connection', (socket) => {
  users[socket.id] = socket;
  socket.emit('your-id', socket.id);

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

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});
