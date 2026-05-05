import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // Маршрут для доски (будет на 3 этапе)
  {
    path: '/board/:id',
    name: 'board',
    component: () => import('./views/BoardView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');