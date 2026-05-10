# Название Проекта
Paint Board

## Команда
- Лидер: Вишнякова А.Д @instonin9
- Frontend: Громоздова Е.Р @hlebstar
- Backend: Курбатова П.А.@ewright48 Гашнева Д.С. @dashaflowerd
- Интеграция / DevOps: Вишнякова А.Д @instonin9

## Описание
Совместная интерактивная доска для рисования и работы в реальном времени. Пользователи могут создавать доски, добавлять на них объекты и видеть изменения мгновенно.Так же удалять обьекты


## Функциональность
- cоздание досок;
- добавление объектов на доску такие как текст, изображение, линия, прямоугольник, треугольник, круг;
- свободное рисование линий;
- редактирование свойств объектов цвет, размер, содержимое;
- перемещение объектов по доске;
- изменение размеров объектов перетаскиванием;
- удаление объектов;
- синхронизация в реальном времени между несколькими пользователями;
- адаптивный дизайн для всех устройств.

## Стек технологий
- **Backend** Node.js, Express, Socket.io
- **Frontend:** Vue 3, Vite, Socket.io-client
- **Стилизация:** CSS с адаптивной версткой

## Инструкция по запуску

### 1. Клонирование репозитория

Склонируйте репозиторий с помощью SSH сыллки
```bash
git clone git@github.com:instonin9/grupovukha.git
cd grupovukha
```
Примечание: если возникли проблемы с SSH сыллкой, возьмите сыллку htttps. https://github.com/instonin9/grupovukha.git

### 2. Установка зависимостей

Бэкенд:
```bash
cd server
npm install
```

Фронтенд:
```bash
cd client/realtime-board-frontend
npm install
```

### 3. Запуск проекта

Для запуска бэкенда и фронтенда с обеих терминалах используйте одну и туже команду:

```bash
npm run dev
```

### 4. Открытие проекта

Перейти по адресу http://localhost:5173

## Правила работы (GitFlow)

main — основная версия кода
feature/backend-board — разработка бэкенда
feature/frontend-board — разработка фронтенда
Ветки создаются от main, после завершения этапа сливаются обратно через Pull Request


## Архитектура 

```bash
grupovukha/
├── client/
│   └── realtime-board-frontend/
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── vite.config.js
│       ├── .gitignore
│       ├── README.md
│       └── src/
│           ├── main.js
│           ├── App.vue
│           ├── style.css
│           ├── api/
│           │   └── boardApi.js
│           ├── socket/
│           │   └── socket.js
│           └── components/
│               ├── BoardList.vue
│               ├── Board.vue
│               ├── Toolbar.vue
│               └── BoardObject.vue
│
├── server/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
│
└── README.md
```

## Ссылки
Репозиторий: https://github.com/instonin9/grupovukha , 
git@github.com:instonin9/grupovukha.git
