<template>
  <div class="board-list">
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

export default {
  name: 'BoardList',
  data() {
    return {
      boards: []
    }
  },
  methods: {
    async createNewBoard() {
      try {
        const result = await createBoard()
        this.boards.push({
          id: result.id,
          name: 'Новая доска'
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