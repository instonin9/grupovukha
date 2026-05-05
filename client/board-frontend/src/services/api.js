import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const boardService = {
  async createBoard() {
    try {
      const response = await api.post('/board');
      console.log('Доска создана:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании доски:', error);
      throw error;
    }
  },
  
  async getBoards() {
    try {
      const response = await api.get('/boards');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении досок:', error);
      throw error;
    }
  },
  
  async getBoard(boardId) {
    try {
      const response = await api.get(`/board/${boardId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении доски:', error);
      throw error;
    }
  }
};