<template>
  <div class="board-list">

    <div class="hero-section">
      <h1 class="hero-title">Добро пожаловать</h1>
      <p class="hero-subtitle">
        Создавайте доски и работайте вместе в реальном времени.
        Нажмите кнопку ниже чтобы начать.
      </p>
      <button @click="createNewBoard" class="create-btn">
        <span class="btn-icon">+</span>
        Создать доску
      </button>
    </div>

    <div v-if="boards.length === 0" class="empty-message">
      У вас пока нет досок. Создайте первую!
    </div>

    <div v-if="boards.length > 0" class="boards-container">
      <h2>Ваши доски</h2>
      <TransitionGroup name="board-list-animation" tag="div">
        <div
          v-for="board in boards"
          :key="board.id"
          class="board-card"
          @click="joinBoard(board.id)"
        >
          <div class="board-card-content">
            <span class="board-name">{{ board.name }}</span>
            <span class="board-id">ID: {{ board.id }}</span>
          </div>
          <span class="board-arrow">→</span>
        </div>
      </TransitionGroup>
    </div>

    <div v-if="currentBoardId" class="current-board">
      <h3>Доска: {{ currentBoardId }}</h3>
      <div class="messages-list">
        <TransitionGroup name="message-animation" tag="div">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            {{ msg }}
          </div>
        </TransitionGroup>

    <button @click="createNewBoard" class="create-btn">
      Создать новую доску
    </button>

    <div v-if="boards.length === 0" class="empty-message">
      Нет созданных досок. Создайте первую доску.
    </div>

    <div v-if="boards.length > 0" class="boards-container">
      <h2>Список досок:</h2>
      <div
        v-for="board in boards"
        :key="board.id"
        class="board-card"
      >
        <span class="board-id">ID: {{ board.id }}</span>
        <span class="board-name">{{ board.name }}</span>

      </div>
    </div>
  </div>
</template>

<script>
import { createBoard } from '../api/boardApi'

import socket from '../socket/socket'


export default {
  name: 'BoardList',
  data() {
    return {

      boards: [],
      currentBoardId: null,
      messages: [],
      isLoading: false

      boards: []

    }
  },
  methods: {
    async createNewBoard() {

      if (this.isLoading) return
      this.isLoading = true

      try {
        const result = await createBoard()
        this.boards.push({
          id: result.id,
          name: 'Новая доска'
        })

      } catch (error) {
        console.error('Ошибка:', error)
        alert('Не удалось создать доску')
      } finally {
        this.isLoading = false
      }
    },
    joinBoard(boardId) {
      this.currentBoardId = boardId
      this.messages = []
      socket.emit('join-board', boardId)
    }
  },
  mounted() {
    socket.on('message', (message) => {
      this.messages.push(message)
    })

        console.log('Доска создана с ID:', result.id)
      } catch (error) {
        console.error('Ошибка:', error)
        alert('Не удалось создать доску')
      }
    }

  }
}
</script>

<style scoped>
.board-list {

  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.068), rgba(0, 0, 0, 0.493)), 
            url('/src/assets/glavna.jpg') center/cover no-repeat fixed;
  color: white;
  font-family: sans-serif;
}

.hero-section {
  position: relative;
  padding: 100px 20px;
  text-align: center;
  max-width: 800px;
  z-index: 2;
}

.hero-section::before {
  display: none;
}

.hero-title {
  color: #ffffff;
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 400; 
  margin-bottom: 1rem;
  letter-spacing: 1px;
  animation: fadeInDown 0.8s ease-out;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin-bottom: 3rem;
  line-height: 1.5;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 40px;
  background: transparent; 
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.7); 
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 20px;
}

.boards-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  z-index: 2;
}

.boards-container h2 {
  font-weight: 300;
  margin-bottom: 20px;
  text-align: center;
}

.board-card {
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.board-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.board-name {
  color: white;
  font-weight: 500;
}

.board-id {
  color: rgba(255, 255, 255, 0.5);
}

.board-arrow {
  color: white;
}

.empty-message {
  color: rgba(255, 255, 255, 0.5);
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero-section { padding: 60px 20px; }
  .create-btn { width: 100%; justify-content: center; }
}
</style>

  margin-top: 30px;
}

.create-btn {
  display: block;
  margin: 0 auto 30px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #45a049;
}

.empty-message {
  text-align: center;
  color: #888;
  font-size: 16px;
  margin-top: 40px;
}

.boards-container {
  margin-top: 20px;
}

.boards-container h2 {
  color: #333;
  margin-bottom: 15px;
}

.board-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
}

.board-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.board-id {
  color: #888;
  font-size: 13px;
  font-family: monospace;
}

.board-name {
  color: #333;
  font-size: 16px;
  font-weight: 500;
}
</style>

