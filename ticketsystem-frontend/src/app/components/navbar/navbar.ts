import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedVariables } from '../../SharedVariables/SharedVariables';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router: Router, public sharedVariables: SharedVariables) { }


  switchToUserView() {
    this.sharedVariables.isUserView = !this.sharedVariables.isUserView;
  }

  myDashboard() {
    this.router.navigate(['/']);
  }

  createTicket() {
    this.router.navigate(['/create-ticket']);
  }

  myKnowledgeBase() {
    // Implement navigation to Knowledge Base page
    this.router.navigate(['/knowledge-base']);
  }

  Contact() {
    this.router.navigate(['/contact']);
  }

  about() {
    this.router.navigate(['/about']);
  }
}
