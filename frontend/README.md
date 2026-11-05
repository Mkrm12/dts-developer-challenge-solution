# Frontend - HMCTS Task Manager

React JavaScript app for managing tasks.

## Features
- Create task
- View tasks
- Update task status
- Delete task
- Basic validation and user feedback

## Tech
- React 18
- Vite
- Vitest + Testing Library

## Run
```bash
cd frontend
npm install
npm run dev
```

App URL: `http://localhost:5173`

Backend API is expected at `http://localhost:8080/api` by default.

To override:
```bash
cd frontend
VITE_API_BASE_URL=http://localhost:8080/api npm run dev
```

## Test
```bash
cd frontend
npm install
npm test
```

