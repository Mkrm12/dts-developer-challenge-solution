# Backend - HMCTS Task Manager

Spring Boot REST API for task management.

## Features
- Create task
- Get task by ID
- Get all tasks
- Update task status
- Delete task
- Validation and error handling
- OpenAPI docs

## Tech
- Java 17
- Spring Boot 3
- Spring Data JPA
- H2 database (file-based)
- JUnit + MockMvc

## Run
```bash
cd backend
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Test
```bash
cd backend
mvn test
```

## Endpoints
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

