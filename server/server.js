const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = 3001;

const boards = [];

app.use(cors());
app.use(express.json());


const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.post('/board', (req, res) => {
  const newBoardId = Date.now().toString();
  const newBoard = { id: newBoardId, name: 'Новая доска', objects: [] };
  boards.push(newBoard);
  res.status(201).json({ id: newBoardId });
});

io.on('connection', (socket) => {
  console.log('Новый пользователь подключился:', socket.id);
  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`Пользователь ${socket.id} зашел на доску ${boardId}`);
    socket.emit('message', `Вы подключились к доске ${boardId}`);
    socket.to(boardId).emit('message', `Пользователь ${socket.id} присоединился к доске`);
  });
  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});


app.listen(PORT, () => {
  console.log(`Сервер с WebSocket запущен на порту ${PORT}`);
});