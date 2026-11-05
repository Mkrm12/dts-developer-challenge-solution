package uk.gov.hmcts.taskmanager.service;

import org.springframework.stereotype.Service;
import uk.gov.hmcts.taskmanager.dto.CreateTaskRequest;
import uk.gov.hmcts.taskmanager.dto.TaskResponse;
import uk.gov.hmcts.taskmanager.exception.TaskNotFoundException;
import uk.gov.hmcts.taskmanager.model.Task;
import uk.gov.hmcts.taskmanager.model.TaskStatus;
import uk.gov.hmcts.taskmanager.repository.TaskRepository;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setDueDateTime(request.getDueDateTime());

        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse getTaskById(Long id) {
        return TaskResponse.from(findTaskById(id));
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
            .stream()
            .map(TaskResponse::from)
            .toList();
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTaskById(id);
        task.setStatus(status);
        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new TaskNotFoundException(id));
    }
}

