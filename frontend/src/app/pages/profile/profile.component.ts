import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  name = '';
  email = '';
  profileLetter = '';

  constructor(private router: Router) {}

  ngOnInit() {

    const userData = localStorage.getItem('user');

    if (userData) {

      const user = JSON.parse(userData);

      this.name = user.name;
      this.email = user.email;

      this.profileLetter =
        this.name.charAt(0).toUpperCase();
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }
}