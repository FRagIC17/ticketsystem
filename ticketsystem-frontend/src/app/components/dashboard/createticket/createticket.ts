import { ChangeDetectorRef, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-createticket',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './createticket.html',
  styleUrl: './createticket.css',
})
export class Createticket {

    private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  public sharedVariables = inject(SharedVariables);

  title: string = '';
  description: string = '';
  selectedPriority: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectedUser: string = '';
  selectedItSupporter: string = '';

  priorities = signal<any[]>([]);
  statuses = signal<any[]>([]);
  users = signal<any[]>([]);
  itSupporters = signal<any[]>([]);
  categories = signal<any[]>([]);
  isLoading = true;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }
  }

loadInitialData() {
  this.isLoading = true;

  forkJoin({
    statuses: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/statuses`),
    priorities: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/priorities`),
    categories: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/categories`),
    users: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/users`),
    itSupporters: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/it-supporters`)
  }).subscribe({
    next: ({ categories, statuses, priorities, users, itSupporters }) => {
      this.statuses.set(statuses);
      this.priorities.set(priorities);
      this.categories.set(categories);
      this.users.set(users);
      this.itSupporters.set(itSupporters);
      console.log('Data loaded successfully');
      this.isLoading = false;
    },
    error: err => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

  sortTicketsByStatus(status: string) {
    console.log(status);
  }

  sortTicketsByPriority(priority: string) {
    console.log(priority);
  }

  closeTicketModal() {
    document.getElementById('ticket-modal')?.classList.remove('is-active');
  }

  createTicket() {
    console.log('Creating ticket with:', {
      title: this.title,
      description: this.description,
      status: this.selectedStatus,
      priority: this.selectedPriority,
      category: this.selectedCategory,
      createdBy: this.selectedUser,
      assignedTo: this.selectedItSupporter
    });
    if(!this.title || !this.description || !this.selectedStatus || !this.selectedPriority || !this.selectedCategory || !this.selectedUser) {
      alert('Please fill in all fields before submitting the ticket.');
      return;
    }

    const payload = {
      title: this.title,
      description: this.description,
      status: this.selectedStatus,
      priority: this.selectedPriority,
      category: this.selectedCategory,
      createdBy: this.selectedUser,
      assignedTo: this.selectedItSupporter
    };

    console.log('Payload to send:', payload);

    this.http.post(`${SharedVariables.baseUrl}/api/tickets/create-ticket`, payload).subscribe({
      next: response => {
        console.log('Ticket created successfully:', response);
        this.router.navigate(['/']);
      },
      error: err => {
        console.error('Failed to create ticket:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
