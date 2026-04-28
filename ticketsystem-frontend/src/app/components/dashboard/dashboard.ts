import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { get } from 'http';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  amountOfTickets: number = 0;
  selectedTicket: any = null;

  tickets: any[] = [];
  testTickets: any[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', category: 'Support', title: 'Ticket 1', description: 'Description for Ticket 1', status: 'Closed', priority: 'High', createdAt: new Date() },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', category: 'Sales', title: 'Ticket 2', description: 'Description for Ticket 2', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', category: 'Marketing', title: 'Ticket 3', description: 'Description for Ticket 3', status: 'Closed', priority: 'Low', createdAt: new Date() },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', category: 'IT', title: 'Ticket 4', description: 'Description for Ticket 4', status: 'Open', priority: 'High', createdAt: new Date() },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', category: 'HR', title: 'Ticket 5', description: 'Description for Ticket 5', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 7, name: 'Eve Green', email: 'eve.green@example.com', category: 'Finance', title: 'Ticket 7', description: 'Description for Ticket 7', status: 'Closed', priority: 'High', createdAt: new Date() },
    { id: 8, name: 'Frank White', email: 'frank.white@example.com', category: 'IT', title: 'Ticket 8', description: 'Description for Ticket 8', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 9, name: 'Grace Black', email: 'grace.black@example.com', category: 'Marketing', title: 'Ticket 9', description: 'Description for Ticket 9', status: 'Open', priority: 'Low', createdAt: new Date() },
    { id: 10, name: 'Henry Grey', email: 'henry.grey@example.com', category: 'Sales', title: 'Ticket 10', description: 'Description for Ticket 10', status: 'Closed', priority: 'High', createdAt: new Date() },
  ];
  statuses: any[] = [];
  priorities: any[] = [];

  selectedStatus: string = '';
  selectedPriority: string = '';

  loading = { statuses: true, priorities: true };

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    //this.loadTickets();

    this.getPriorityAndStatusFromDatabase()
  }

  getPriorityAndStatusFromDatabase() {
    // Fetch Statuses
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/statuses`)
      .subscribe({
        next: (data) => {
          this.statuses = data || [];
          this.loading.statuses = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading statuses:', err);
          this.loading.statuses = false;
          this.cdr.detectChanges();
        }
      });

    // Fetch Priorities
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/priorities`)
      .subscribe({
        next: (data) => {
          this.priorities = data || [];
          this.loading.priorities = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading priorities:', err);
          this.loading.priorities = false;
          this.cdr.detectChanges();
        }
      });
  }

  // Helper to safely get the value for [value] binding
  getValue(item: any): string {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.id?.toString() || item.name || item.status || item.priority || item.title || JSON.stringify(item);
  }

  // Helper to safely get what to display to the user
  getDisplayName(item: any): string {
    if (!item) return 'Unknown';
    if (typeof item === 'string') return item;
    return item.name || item.status || item.priority || item.title || 'Unknown';
  }

  sortTicketsByStatus(status: any) {
    console.log('Filtering by status:', status);
    this.http.get(`${SharedVariables.baseUrl}/api/tickets?status=${this.getValue(status)}`)
  }

  sortTicketsByPriority(priority: any) {
    console.log('Filtering by priority:', priority);
    this.http.get(`${SharedVariables.baseUrl}/api/tickets?priority=${this.getValue(priority)}`)
  }

  loadTickets() {
    this.http.get(`${SharedVariables.baseUrl}/api/tickets`)
      .subscribe((response: any) => {
        this.tickets = response;
        this.amountOfTickets = this.tickets.length;
      });
  }

  onTicketClick(ticket: any) {
    this.selectedTicket = ticket;
    this.router.navigate(['/tickets', ticket.id]);
  }

  getStatusStyles(ticket: any) {
    switch (ticket.status) {
      case 'Open':
        return {
          background: 'rgba(59,130,246,.14)',
          border: '#3b82f6',
          color: '#1e3a8a'
        };

      case 'In Progress':
        return {
          background: 'rgba(245,158,11,.14)',
          border: '#f59e0b',
          color: '#92400e'
        };

      case 'Closed':
        return {
          background: 'rgba(16,185,129,.14)',
          border: '#10b981',
          color: '#065f46'
        };

      default:
        return {
          background: '#f3f4f6',
          border: '#9ca3af',
          color: '#111827'
        };
    }
  }

  getPriorityStyles(ticket: any) {
    switch (ticket.priority) {
      case 'High':
        return {
          background: 'rgba(239,68,68,.14)',
          border: '#ef4444',
          color: '#991b1b'
        };

      case 'Medium':
        return {
          background: 'rgba(245,158,11,.14)',
          border: '#f59e0b',
          color: '#92400e'
        };

      case 'Low':
        return {
          background: 'rgba(34,197,94,.14)',
          border: '#22c55e',
          color: '#166534'
        };

      default:
        return {
          background: '#f3f4f6',
          border: '#9ca3af',
          color: '#111827'
        };
    }
  }

}
