# HMCTS DTS Developer Challenge Solution

This repository contains a complete task management solution with:
- `backend/`: Java Spring Boot API
- `frontend/`: React JavaScript web app

The app supports create, read, update status, and delete for tasks.

## Tech Stack
- Backend: Java 17, Spring Boot, JPA, H2, JUnit/MockMvc
- Frontend: React (JavaScript), Vite, Vitest, Testing Library

## Project Structure
```
.
├── backend
└── frontend
```

## Run Backend
```bash
cd backend
mvn spring-boot:run
```

- API base URL: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend URL: `http://localhost:5173`
- Default API URL used by frontend: `http://localhost:8080/api`

## Run Tests
```bash
cd backend
mvn test
```

```bash
cd frontend
npm install
npm test
```

## API Endpoints
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

## Submission Notes
- Keep repository content name-blind (avoid personal details in code/docs).
- Share the repository link in the coding challenge submission field.
