import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private http: HttpClient, private router: Router) { }

  myDashboard() {
    this.router.navigate(['/']);
  }

  myTickets() {
    this.router.navigate(['/my-tickets']);
  }

  myUsers() {
    this.router.navigate(['/my-users']);
  }

  mySettings() {
    this.router.navigate(['/my-settings']);
  }

  myKnowledgeBase() {
    // Implement navigation to Knowledge Base page
    this.router.navigate(['/knowledge-base']);
  }
}
