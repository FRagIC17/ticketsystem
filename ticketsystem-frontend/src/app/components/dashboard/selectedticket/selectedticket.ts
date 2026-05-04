import { HttpClient } from '@angular/common/http';
import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
  public sharedVariables = inject(SharedVariables);

  ticket = signal<any>(null);
  newComment: string = '';
  comments = signal<any[]>([]);
  users = signal<any[]>([]);
  supporters = signal<any[]>([]);
  statuses = signal<any[]>([]);
  priorities = signal<any[]>([]);
  selectedUserId: number | null = null;
  selectedItSupporterId: number | null = null;
  selectedStatusId: number | null = null;
  selectedPriorityId: number | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadSelectedTicket();
      forkJoin({
        users: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/users`),
        supporters: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/it-supporters`),
        statuses: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/statuses`),
        priorities: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/priorities`),
        comments: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/comment/comments-by-ticket-id?ticketId=${this.route.snapshot.paramMap.get('id')}`)
      }).subscribe({
        next: ({ users, supporters, statuses, priorities, comments }) => {
          this.users.set(users);
          this.supporters.set(supporters);
          this.statuses.set(statuses);
          this.priorities.set(priorities);
          this.comments.set(comments);

          this.syncSelectedStatus();
          this.syncSelectedPriority();
          console.log('Users, statuses, and priorities loaded successfully');
        },
        error: err => {
          console.error('Failed to load users, statuses, or priorities:', err);
          this.users.set([]);
          this.supporters.set([]);
          this.statuses.set([]);
          this.priorities.set([]);
        }
      });
    }
    this.loadComments();
  }


  updateTicketStatus() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to update status for');
      return;
    }

    if (!this.selectedStatusId) {
      console.error('No status selected for update');
      return;
    }

    const payload = {
      ticketId: currentTicket.id,
      statusId: this.selectedStatusId
    };

    console.log('Updating ticket status with payload:', payload);

    this.http.put(`${SharedVariables.baseUrl}/api/tickets/update-ticket-status`, payload)
      .subscribe({
        next: (response) => {
          this.loadSelectedTicket(); // Refresh ticket to show updated status
        },
        error: (err) => {
          console.error('Failed to update ticket status:', err);
        }
      });
  }

  updateTicketPriority() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to update priority for');
      return;
    }

    if (!this.selectedPriorityId) {
      console.error('No priority selected for update');
      return;
    }

    const payload = {
      ticketId: currentTicket.id,
      priorityId: this.selectedPriorityId
    };

    console.log('Updating ticket priority with payload:', payload);

    this.http.put(`${SharedVariables.baseUrl}/api/tickets/update-ticket-priority`, payload)
      .subscribe({
        next: (response) => {
          this.loadSelectedTicket(); // Refresh ticket to show updated priority
        },
        error: (err) => {
          console.error('Failed to update ticket priority:', err);
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

    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/comment/comments-by-ticket-id?ticketId=${currentTicket.id}`)
      .subscribe({
        next: (response) => {
          this.comments.set(response);
          this.loadSelectedTicket(); // Refresh ticket to ensure comments are up to date
        },
        error: (err) => {
          console.error('Failed to load comments:', err);
          this.comments.set([]);
        }
      });

  }

  addComment(userId: number, isSupportComment: boolean) {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to add comment to');
      return;
    }

    console.log('Adding comment with text:', this.newComment, 'by user ID:', userId);

    const payload = {
      ticketId: currentTicket.id,
      commentText: this.newComment,
      createdBy: userId,
      isSupportComment: isSupportComment
    };

    this.http.post(`${SharedVariables.baseUrl}/api/comment/add-comment`, payload)
      .subscribe({
        next: (response) => {
          console.log('Comment added successfully:');
          this.newComment = '';
          this.loadComments(); // Refresh comments to show the new comment
        },
        error: (err) => {
          console.error('Failed to add comment:', err);
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
            this.syncSelectedStatus();
            this.syncSelectedPriority();
            console.log('Ticket loaded successfully:');
          }
        },
        error: (err) => {
          console.error('Failed to load ticket:', err);
          this.ticket.set(null);
        }
      });
  }

  deleteTicket() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    this.http.delete(`${SharedVariables.baseUrl}/api/tickets/delete-ticket?id=${currentTicket.id}`)
      .subscribe({
        next: (response) => {
          console.log('Ticket deleted successfully:', response);
          window.history.back(); // Go back to previous page after deletion
        },
        error: (err) => {
          console.error('Failed to delete ticket:', err);
        }
      });
  }

  reassignTicket() {
    const currentTicket = this.ticket();
    if (!currentTicket) {
      console.error('No ticket loaded to reassign');
      return;
    }

    if (!this.selectedItSupporterId) {
      console.error('No supporter selected for reassignment');
      return;
    }

    const payload = {
      ticketId: currentTicket.id,
      assignedTo: this.selectedItSupporterId
    };

    console.log('Reassigning ticket with payload:', payload);

    this.http.put(`${SharedVariables.baseUrl}/api/tickets/reassign-ticket`, payload)
      .subscribe({
        next: (response) => {
          console.log('Ticket reassigned successfully:', response);
          this.loadSelectedTicket(); // Refresh ticket to show new assignment
        },
        error: (err) => {
          console.error('Failed to reassign ticket:', err);
        }
      });
  }

  private syncSelectedPriority() {
    const currentTicket = this.ticket();
    const allPriorities = this.priorities();

    if (!currentTicket || !Array.isArray(allPriorities) || allPriorities.length === 0) {
      return;
    }

    const ticketPriorityIdCandidate = currentTicket?.priorityId ?? currentTicket?.priority?.id ?? currentTicket?.priority;

    const asNumber = Number(ticketPriorityIdCandidate);
    if (!Number.isNaN(asNumber)) {
      const exists = allPriorities.some(p => Number(p?.id) === asNumber);
      if (exists) {
        this.selectedPriorityId = asNumber;
        return;
      }
    }

    const ticketPriorityName = (currentTicket?.priority?.name ?? currentTicket?.priority ?? '').toString().trim().toLowerCase();
    if (!ticketPriorityName) {
      return;
    }

    const matched = allPriorities.find(p => (p?.name ?? '').toString().trim().toLowerCase() === ticketPriorityName);
    if (matched) {
      this.selectedPriorityId = Number(matched.id);
    }
  }

  private syncSelectedStatus() {
    const currentTicket = this.ticket();
    const allStatuses = this.statuses();

    if (!currentTicket || !Array.isArray(allStatuses) || allStatuses.length === 0) {
      return;
    }

    const ticketStatusIdCandidate = currentTicket?.statusId ?? currentTicket?.status?.id ?? currentTicket?.status;

    const asNumber = Number(ticketStatusIdCandidate);
    if (!Number.isNaN(asNumber)) {
      const exists = allStatuses.some(s => Number(s?.id) === asNumber);
      if (exists) {
        this.selectedStatusId = asNumber;
        return;
      }
    }

    const ticketStatusName = (currentTicket?.status?.name ?? currentTicket?.status ?? '').toString().trim().toLowerCase();
    if (!ticketStatusName) {
      return;
    }

    const matched = allStatuses.find(s => (s?.name ?? '').toString().trim().toLowerCase() === ticketStatusName);
    if (matched) {
      this.selectedStatusId = Number(matched.id);
    }
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