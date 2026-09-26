package com.taskmanager.backend.service;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task, User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(User user) {
        return taskRepository.findByUser(user);
    }

    public Task getTaskById(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user)
                .orElse(null);
    }

    public void deleteTask(Long id, User user) {

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElse(null);

        if (task != null) {
            taskRepository.delete(task);
        }
    }

    public Task updateTask(Long id, Task task, User user) {

        Task existingTask = taskRepository.findByIdAndUser(id, user)
                .orElse(null);

        if (existingTask == null) {
            return null;
        }

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setPriority(task.getPriority());
        existingTask.setCategory(task.getCategory());
        existingTask.setCompleted(task.isCompleted());

        return taskRepository.save(existingTask);
    }
}