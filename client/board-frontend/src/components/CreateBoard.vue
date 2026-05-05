<template>
  <div class="create-board-container">
    <div class="create-board-card">
      <h1 class="title">Создание новой доски</h1>
      <p class="subtitle">Нажмите кнопку, чтобы создать новую доску для совместной работы</p>
      
      <button 
        @click="createBoard" 
        :disabled="isLoading"
        class="create-button"
      >
        <span v-if="isLoading" class="loading-spinner"></span>
        <span v-else>+ Создать доску</span>
      </button>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="createdBoard" class="success-message">
        <p>✅ Доска успешно создана!</p>
        <p class="board-id">ID доски: <strong>{{ createdBoard.id }}</strong></p>
        <button @click="goToBoard" class="open-button">
          Открыть доску
        </button>
      </div>
    </div>
    
    <div class="boards-list" v-if="recentBoards.length > 0">
      <h2>Последние созданные доски</h2>
      <div v-for="board in recentBoards" :key="board.id" class="board-item">
        <span>Доска {{ board.id }}</span>
        <span class="board-time">{{ board.createdAt }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { boardService } from '../services/api';

export default {
  name: 'CreateBoard',
  data() {
    return {
      isLoading: false,
      error: null,
      createdBoard: null,
      recentBoards: []
    };
  },
  methods: {
    async createBoard() {
      this.isLoading = true;
      this.error = null;
      this.createdBoard = null;
      
      try {
        const result = await boardService.createBoard();
        this.createdBoard = result;
        
        // Добавляем в список недавних досок
        this.recentBoards.unshift({
          id: result.id,
          createdAt: new Date().toLocaleTimeString()
        });
        
        // Сохраняем ID в localStorage
        this.saveBoardToLocal(result.id);
        
      } catch (err) {
        this.error = 'Не удалось создать доску. Проверьте подключение к серверу.';
        console.error('Ошибка создания доски:', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    saveBoardToLocal(boardId) {
      const boards = JSON.parse(localStorage.getItem('boards') || '[]');
      boards.push({ id: boardId, createdAt: new Date().toISOString() });
      localStorage.setItem('boards', JSON.stringify(boards));
    },
    
    goToBoard() {
      if (this.createdBoard) {
        // Переход на страницу доски (будет реализован на 3 этапе)
        this.$router.push(`/board/${this.createdBoard.id}`);
      }
    }
  },
  
  mounted() {
    // Загружаем историю из localStorage
    const savedBoards = JSON.parse(localStorage.getItem('boards') || '[]');
    this.recentBoards = savedBoards.slice(0, 5).map(board => ({
      ...board,
      createdAt: new Date(board.createdAt).toLocaleString()
    }));
  }
};
</script>

<style scoped>
.create-board-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.create-board-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.title {
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #718096;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.create-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.create-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.create-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: 20px;
  padding: 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
}

.success-message {
  margin-top: 20px;
  padding: 20px;
  background: #c6f6d5;
  color: #22543d;
  border-radius: 8px;
}

.board-id {
  font-size: 0.9rem;
  color: #4a5568;
  margin: 10px 0;
}

.open-button {
  background: #48bb78;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.open-button:hover {
  background: #38a169;
}

.boards-list {
  margin-top: 30px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
}

.boards-list h2 {
  color: #2d3748;
  margin-bottom: 15px;
}

.board-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.board-item:last-child {
  border-bottom: none;
}

.board-time {
  color: #a0aec0;
  font-size: 0.9rem;
}
</style>