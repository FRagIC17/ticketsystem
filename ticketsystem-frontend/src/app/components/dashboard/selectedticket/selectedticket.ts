import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-selectedticket',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './selectedticket.html',
  styleUrl: './selectedticket.css',
})
export class Selectedticket {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  ticket = signal<any>(null);
  newComment: string = '';
  comments = signal<any[]>([]);
  users = signal<any[]>([]);
  selectedUserId: number | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.loadSelectedTicket();
    }

    
  }

  loadUsers() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/users`)
      .subscribe({
        next: (response) => {
          this.users.set(response);
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.users.set([]);
        }
      });
  }

  loadComments() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to load comments for');
      this.comments.set([]);
      return;
    }

    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/comments?ticketId=${currentTicket.id}`)
      .subscribe({
        next: (response) => {
          this.comments.set(response);
        },
        error: (err) => {
          console.error('Failed to load comments:', err);
          this.comments.set([]);
        }
      });

  }


  loadSelectedTicket() {
    const ticketId = this.route.snapshot.paramMap.get('id');

    if (!ticketId) {
      console.error('No ticket ID found in URL');
      this.ticket.set(null);
      return;
    }

    this.http.get(`${SharedVariables.baseUrl}/api/tickets/ticket-by-id?id=${ticketId}`)
      .subscribe({
        next: (response: any) => {
          if (typeof response === 'string') {
            console.warn('Backend message:', response);
            this.ticket.set(null);
          } else {
            this.ticket.set(response);
            console.log('Ticket loaded successfully:', response);
          }
        },
        error: (err) => {
          console.error('Failed to load ticket:', err);
          this.ticket.set(null);
        }
      });
  }

  addComment() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to add comment to');
      return;
    }

    const payload = {
      ticketId: currentTicket.id,
      comment: this.newComment,
      commentBy: 'Current User' // Replace with actual user info in a real app
    };

    this.http.post(`${SharedVariables.baseUrl}/api/comments`, payload)
      .subscribe({
        next: (response) => {
          console.log('Comment added successfully:', response);
          this.newComment = '';
          this.loadSelectedTicket(); // Refresh ticket to show new comment
        },
        error: (err) => {
          console.error('Failed to add comment:', err);
        }
      });
  }

  // Your style methods remain the same
  getStatusStyles(ticket: any) {
    switch ((ticket?.status || '').trim()) {
      case 'Open': return { background: 'rgba(59, 130, 246, 0.12)', border: '#2563eb' };
      case 'In Progress': return { background: 'rgba(245, 158, 11, 0.12)', border: '#d97706' };
      case 'Resolved': return { background: 'rgba(16, 185, 129, 0.12)', border: '#059669' };
      case 'Closed': return { background: 'rgba(239, 68, 68, 0.12)', border: '#dc2626' };
      default: return { background: 'rgba(156, 163, 175, 0.12)', border: '#9ca3af' };
    }
  }

  getPriorityStyles(ticket: any) {
    switch ((ticket?.priority || '').trim()) {
      case 'Critical': return { background: 'rgba(239, 68, 68, 0.12)', border: '#dc2626' };
      case 'High': return { background: 'rgba(249, 115, 22, 0.12)', border: '#ea580c' };
      case 'Medium': return { background: 'rgba(234, 179, 8, 0.12)', border: '#ca8a04' };
      case 'Low': return { background: 'rgba(34, 197, 94, 0.12)', border: '#16a34a' };
      default: return { background: 'rgba(156, 163, 175, 0.12)', border: '#9ca3af' };
    }
  }
}