import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    const user = {
      email: this.email,
      password: this.password
    };

    this.authService.login(user).subscribe({

      next: (response: any) => {

        console.log('Login successful', response);

        // Save JWT token
        localStorage.setItem('token', response.token);

        // Save user information
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email
        }));

        // Go to Dashboard
        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error('Login failed', error);

        alert('Invalid email or password');

      }

    });
  }
}