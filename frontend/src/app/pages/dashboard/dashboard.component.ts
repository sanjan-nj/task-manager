import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userName = '';
  tasks: any[] = [];

  searchText = '';
  statusFilter = 'all';
  categoryFilter = 'all';

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {

    const userData = localStorage.getItem('user');

    if (userData) {
      this.userName = JSON.parse(userData).name;
    }

    this.loadTasks();
  }

  loadTasks() {

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Failed to load tasks:', error);
      }
    });
  }

  get totalTasks() {
    return this.tasks.length;
  }

  get pendingTasks() {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }

  get dueTodayTasks() {

    const today = new Date()
      .toISOString()
      .split('T')[0];

    return this.tasks.filter(task =>
      task.dueDate === today &&
      !task.completed
    ).length;
  }

  get filteredTasks() {

    return this.tasks.filter(task => {

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.statusFilter === 'all' ||
        (this.statusFilter === 'pending' && !task.completed) ||
        (this.statusFilter === 'completed' && task.completed);

      const matchesCategory =
        this.categoryFilter === 'all' ||
        task.category === this.categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }

  showCategory(category: string) {

    this.categoryFilter = category;

    this.searchText = '';
    this.statusFilter = 'all';
  }

  showAllTasks() {

    this.categoryFilter = 'all';

    this.searchText = '';
    this.statusFilter = 'all';
  }

  toggleTask(task: any) {

    const updatedTask = {
      ...task,
      completed: !task.completed
    };

    this.taskService
      .updateTask(task.id, updatedTask)
      .subscribe({

        next: () => {
          task.completed = updatedTask.completed;
        },

        error: (error) => {
          console.error(
            'Failed to update task:',
            error
          );

          alert('Failed to update task.');
        }

      });
  }

  deleteTask(id: number) {

    const confirmed = confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    this.taskService
      .deleteTask(id)
      .subscribe({

        next: () => {

          this.tasks =
            this.tasks.filter(
              task => task.id !== id
            );
        },

        error: (error) => {

          console.error(
            'Failed to delete task:',
            error
          );

          alert('Failed to delete task.');
        }

      });
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}