const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const boards = [];

app.use(cors());
app.use(express.json());

app.post('/board', (req, res) => {
  const newBoardId = Date.now().toString();
  const newBoard = { id: newBoardId, name: 'Новая доска', objects: [] };
  boards.push(newBoard);
  console.log(`Создана доска с ID: ${newBoardId}`);
  res.status(201).json({ id: newBoardId });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});