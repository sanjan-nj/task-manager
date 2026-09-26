import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Step 1: Register the user
    this.authService.register(user).subscribe({

      next: (response: any) => {

        console.log('Registration successful', response);

        // Step 2: Automatically login
        this.authService.login({
          email: this.email,
          password: this.password
        }).subscribe({

          next: (loginResponse: any) => {

            console.log('Automatic login successful', loginResponse);

            // Step 3: Save JWT
            localStorage.setItem('token', loginResponse.token);

            // Step 4: Save user information
            localStorage.setItem('user', JSON.stringify({
              id: loginResponse.id,
              name: loginResponse.name,
              email: loginResponse.email
            }));

            // Step 5: Go to Dashboard
            this.router.navigate(['/dashboard']);

          },

          error: (error) => {

            console.error('Automatic login failed', error);

            alert('Registration successful. Please login manually.');

            this.router.navigate(['/login']);

          }

        });

      },

      error: (error) => {

        console.error('Registration failed', error);

        alert('Registration failed!');

      }

    });
  }
}