package com.taskmanager.backend.controller;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.UserRepository;
import com.taskmanager.backend.service.TaskService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(
            TaskService taskService,
            UserRepository userRepository
    ) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    private User getLoggedInUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    @PostMapping
    public Task createTask(
            @RequestBody Task task,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        return taskService.createTask(task, user);
    }

    @GetMapping
    public List<Task> getAllTasks(
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        return taskService.getAllTasks(user);
    }

    @GetMapping("/{id}")
    public Task getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        return taskService.getTaskById(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        taskService.deleteTask(id, user);
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task task,
            Authentication authentication
    ) {

        User user = getLoggedInUser(authentication);

        return taskService.updateTask(id, task, user);
    }
}