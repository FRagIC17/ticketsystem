import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';
import { Dashboard } from '../dashboard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selectedticket',
  imports: [CommonModule],
  templateUrl: './selectedticket.html',
  styleUrl: './selectedticket.css',
})
export class Selectedticket {
  constructor(private http: HttpClient ) { }

  ticket: any = null;

  ngOnInit() {
      this.loadSelectedTicket();
  }

  loadSelectedTicket() {
  const ticketId = this.getTicketIdFromUrl();

  if (!ticketId) {
    console.error('No ticket ID found in URL');
    // Optional: show user-friendly message
    this.ticket = null;
    return;
  }

  this.http.get(`${SharedVariables.baseUrl}/api/tickets/ticket-by-id?id=${ticketId}`)
    .subscribe({
      next: (response: any) => {
        // The backend returns either a Ticket object OR a String message
        if (typeof response === 'string') {
          // "No ticket with id X found"
          console.warn(response);
          this.ticket = null;
          // Optional: show message to user
          // this.errorMessage = response;
        } 
        else {
          // Successful ticket object
          this.ticket = response;
          console.log('Ticket loaded successfully:', this.ticket);
        }
      },
      error: (err) => {
        console.error('HTTP Error loading ticket:', err);
        this.ticket = null;
        // You can handle network errors, 500s, etc. here
      }
    });
}

  getTicketIdFromUrl(): string | null {
    const urlSegments = window.location.pathname.split('/');
    return urlSegments.length > 2 ? urlSegments[2] : null;
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
