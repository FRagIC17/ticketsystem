import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selectedticket',
  imports: [CommonModule],
  templateUrl: './selectedticket.html',
  styleUrl: './selectedticket.css',
})
export class Selectedticket {
  
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  ticket = signal<any>(null);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSelectedTicket();
    }
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

  // Your style methods remain the same
  getStatusStyles(ticket: any) {
    switch ((ticket?.status || '').trim()) {
      case 'Open':        return { background: 'rgba(59, 130, 246, 0.12)', border: '#2563eb' };
      case 'In Progress': return { background: 'rgba(245, 158, 11, 0.12)', border: '#d97706' };
      case 'Resolved':    return { background: 'rgba(16, 185, 129, 0.12)', border: '#059669' };
      case 'Closed':      return { background: 'rgba(239, 68, 68, 0.12)',  border: '#dc2626' };
      default:            return { background: 'rgba(156, 163, 175, 0.12)', border: '#9ca3af' };
    }
  }

  getPriorityStyles(ticket: any) {
    switch ((ticket?.priority || '').trim()) {
      case 'Critical': return { background: 'rgba(239, 68, 68, 0.12)', border: '#dc2626' };
      case 'High':     return { background: 'rgba(249, 115, 22, 0.12)', border: '#ea580c' };
      case 'Medium':   return { background: 'rgba(234, 179, 8, 0.12)', border: '#ca8a04' };
      case 'Low':      return { background: 'rgba(34, 197, 94, 0.12)', border: '#16a34a' };
      default:         return { background: 'rgba(156, 163, 175, 0.12)', border: '#9ca3af' };
    }
  }
}