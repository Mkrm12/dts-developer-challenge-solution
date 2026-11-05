package uk.gov.hmcts.taskmanager.dto;

import jakarta.validation.constraints.NotNull;
import uk.gov.hmcts.taskmanager.model.TaskStatus;

public class UpdateTaskStatusRequest {

    @NotNull(message = "status is required")
    private TaskStatus status;

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}

