package uk.gov.hmcts.taskmanager.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import uk.gov.hmcts.taskmanager.model.TaskStatus;

import java.time.LocalDateTime;

public class CreateTaskRequest {

    @NotBlank(message = "title is required")
    private String title;

    private String description;

    @NotNull(message = "status is required")
    private TaskStatus status;

    @NotNull(message = "dueDateTime is required")
    @Future(message = "dueDateTime must be in the future")
    private LocalDateTime dueDateTime;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getDueDateTime() {
        return dueDateTime;
    }

    public void setDueDateTime(LocalDateTime dueDateTime) {
        this.dueDateTime = dueDateTime;
    }
}

