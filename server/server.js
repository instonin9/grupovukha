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
  console.log(`Создана доска с ID: ${newBoardId}`);
  res.status(201).json({ id: newBoardId });
});

app.get('/boards', (req, res) => {
  res.json(boards);
});

app.get('/board/:id', (req, res) => {
  const board = boards.find(b => b.id === req.params.id);
  if (!board) {
    return res.status(404).json({ error: 'Доска не найдена' });
  }
  res.json(board);
});

app.put('/board/:id', (req, res) => {
  const board = boards.find(b => b.id === req.params.id);
  if (!board) {
    return res.status(404).json({ error: 'Доска не найдена' });
  }
  board.objects = req.body.objects || board.objects;
  board.name = req.body.name || board.name;
  res.json(board);
});

io.on('connection', (socket) => {
  console.log('Новый пользователь подключился:', socket.id);

  socket.on('join-board', (boardId) => {
  socket.join(boardId);
  const board = boards.find(b => b.id === boardId);
  if (board) {
    socket.emit('board-data', board);
  }
  socket.emit('message', `Вы подключились к доске ${boardId}`);
  socket.to(boardId).emit('message', `Пользователь присоединился к доске`);
});

  socket.on('update-objects', (data) => {
    const { boardId, objects } = data;
    const board = boards.find(b => b.id === boardId);
    if (board) {
      board.objects = objects;
      socket.to(boardId).emit('objects-updated', objects);
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });


socket.on('create-object', (data) => {
  const { boardId, object } = data;
  const board = boards.find(b => b.id === boardId);
  if (board) {
    board.objects.push(object);
    socket.to(boardId).emit('object-created', object);
  }
});

socket.on('update-object', (data) => {
  const { boardId, object } = data;
  const board = boards.find(b => b.id === boardId);
  if (board) {
    const index = board.objects.findIndex(o => o.id === object.id);
    if (index !== -1) {
      board.objects[index] = object;
      socket.to(boardId).emit('object-updated', object);
    }
  }
});

socket.on('move-object', (data) => {
  const { boardId, id, x, y } = data;
  const board = boards.find(b => b.id === boardId);
  if (board) {
    const obj = board.objects.find(o => o.id === id);
    if (obj) {
      obj.x = x;
      obj.y = y;
      socket.to(boardId).emit('object-moved', { id, x, y });
    }
  }
});

socket.on('delete-object', (data) => {
  const { boardId, id } = data;
  const board = boards.find(b => b.id === boardId);
  if (board) {
    board.objects = board.objects.filter(o => o.id !== id);
    socket.to(boardId).emit('object-deleted', id);
  }
});

});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});