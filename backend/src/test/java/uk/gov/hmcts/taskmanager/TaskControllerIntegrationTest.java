package uk.gov.hmcts.taskmanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import uk.gov.hmcts.taskmanager.model.Task;
import uk.gov.hmcts.taskmanager.model.TaskStatus;
import uk.gov.hmcts.taskmanager.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void createTaskShouldReturn201() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "Review hearing notes");
        payload.put("description", "Review before 4pm");
        payload.put("status", "TODO");
        payload.put("dueDateTime", LocalDateTime.now().plusDays(1).toString());

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.title").value("Review hearing notes"))
            .andExpect(jsonPath("$.status").value("TODO"));
    }

    @Test
    void createTaskShouldReturn400ForInvalidPayload() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("title", "");
        payload.put("status", "TODO");
        payload.put("dueDateTime", LocalDateTime.now().minusDays(1).toString());

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.validationErrors.title").exists())
            .andExpect(jsonPath("$.validationErrors.dueDateTime").exists());
    }

    @Test
    void getTaskByIdShouldReturnTask() throws Exception {
        Task task = saveTask("Prepare case file", TaskStatus.IN_PROGRESS);

        mockMvc.perform(get("/api/tasks/{id}", task.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(task.getId()))
            .andExpect(jsonPath("$.title").value("Prepare case file"));
    }

    @Test
    void getAllTasksShouldReturnList() throws Exception {
        saveTask("Task A", TaskStatus.TODO);
        saveTask("Task B", TaskStatus.DONE);

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void updateStatusShouldReturnUpdatedTask() throws Exception {
        Task task = saveTask("Call witness", TaskStatus.TODO);
        Map<String, Object> payload = new HashMap<>();
        payload.put("status", "DONE");

        mockMvc.perform(patch("/api/tasks/{id}/status", task.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("DONE"));
    }

    @Test
    void deleteTaskShouldReturn204() throws Exception {
        Task task = saveTask("Archive document", TaskStatus.TODO);

        mockMvc.perform(delete("/api/tasks/{id}", task.getId()))
            .andExpect(status().isNoContent());
    }

    @Test
    void getTaskByIdShouldReturn404WhenMissing() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 9999L))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Task not found with id: 9999"));
    }

    private Task saveTask(String title, TaskStatus status) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription("sample");
        task.setStatus(status);
        task.setDueDateTime(LocalDateTime.now().plusDays(1));
        return taskRepository.save(task);
    }
}

