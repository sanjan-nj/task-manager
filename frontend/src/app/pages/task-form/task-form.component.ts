import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  title = '';
  description = '';
  dueDate = '';
  priority = '';
  category = '';
  completed = false;

  taskId: number | null = null;
  isEditMode = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.taskId = Number(id);
      this.isEditMode = true;

      this.taskService.getTask(this.taskId).subscribe({

        next: (task) => {

          this.title = task.title;
          this.description = task.description;
          this.dueDate = task.dueDate;
          this.priority = task.priority;
          this.category = task.category;
          this.completed = task.completed;

        },

        error: (error) => {

          console.error('Failed to load task:', error);
          alert('Failed to load task.');
          this.router.navigate(['/dashboard']);

        }

      });

    }

  }

  saveTask() {

    const task = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
      completed: this.completed
    };

    if (this.isEditMode && this.taskId !== null) {

      this.taskService.updateTask(
        this.taskId,
        task
      ).subscribe({

        next: () => {

          alert('Task updated successfully!');
          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          console.error('Failed to update task:', error);
          alert('Failed to update task.');

        }

      });

    } else {

      this.taskService.createTask(task).subscribe({

        next: () => {

          alert('Task created successfully!');
          this.router.navigate(['/dashboard']);

        },

        error: (error) => {

          console.error('Failed to create task:', error);
          alert('Failed to create task.');

        }

      });

    }

  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

}