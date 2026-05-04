import { ChangeDetectorRef, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { get } from 'http';
import { forkJoin } from 'rxjs';
import { Sla } from './sla/sla';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, FormsModule, Sla],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  amountOfTickets: number = 0;
  selectedTicket: any = null;

  tickets = signal<any[]>([]);
  statuses = signal<any[]>([]);
  priorities = signal<any[]>([]);

  //selectedStatus: string = '';
  //selectedPriority: string = '';
  searchTerm: string = '';

  isLoading = true;

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  public sharedVariables = inject(SharedVariables);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }
  }

  loadInitialData() {
    this.isLoading = true;

    forkJoin({
      tickets: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/tickets`),
      statuses: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/statuses`),
      priorities: this.http.get<any[]>(`${SharedVariables.baseUrl}/api/priorities`)
    }).subscribe({
      next: ({ tickets, statuses, priorities }) => {
        this.tickets.set(tickets);
        this.amountOfTickets = tickets.length;
        this.statuses.set(statuses);
        this.priorities.set(priorities);
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSearchTermChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.loadInitialData();
      return;
    }

    console.log('Searching for:', term);

    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/dashboard/search?search=${encodeURIComponent(term)}`)
      .subscribe({
        next: data => {
          this.tickets.set(data);
        },
        error: err => console.error(err)
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

  // Return number of tickets with status 'Open'
  openTickets(): number {
    const all = this.tickets();
    if (!all || !Array.isArray(all)) return 0;
    return all.filter(t => (t?.status || '').toString().trim().toLowerCase() === 'open').length;
  }

  // Return number of tickets with status 'Closed'
  closedTickets(): number {
    const all = this.tickets();
    if (!all || !Array.isArray(all)) return 0;
    return all.filter(t => (t?.status || '').toString().trim().toLowerCase() === 'closed' || (t?.status || '').toString().trim().toLowerCase() === 'resolved').length;
  }

  // Compute average resolution time across tickets and return a short human string (e.g. "2d 3h 15m")
  averageResolutionTime(): string {
    const all = this.tickets();
    if (!all || !Array.isArray(all) || all.length === 0) return 'N/A';

    let totalMs = 0;
    let count = 0;

    for (const t of all) {
      const createdRaw = t?.createdAt;
      const resolvedRaw = t?.resolvedAt ?? t?.closedAt ?? t?.resolvedOn ?? t?.closedOn ?? t?.updatedAt;
      if (!createdRaw || !resolvedRaw) continue;
      const created = new Date(createdRaw);
      const resolved = new Date(resolvedRaw);
      if (isNaN(created.getTime()) || isNaN(resolved.getTime())) continue;
      const diff = resolved.getTime() - created.getTime();
      if (diff >= 0) {
        totalMs += diff;
        count++;
      }
    }

    if (count === 0) return 'N/A';

    const avgMs = totalMs / count;
    const days = Math.floor(avgMs / 86400000);
    const hours = Math.floor((avgMs % 86400000) / 3600000);
    const minutes = Math.round((avgMs % 3600000) / 60000);

    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.length ? parts.join(' ') : '0m';
  }


  sortTicketsByStatus(status: any) {
    this.http.get<any[]>(
      `${SharedVariables.baseUrl}/api/tickets?status=${this.getValue(status)}`
    ).subscribe({
      next: data => {
        this.tickets.set(data);
        this.amountOfTickets = data.length;
      },
      error: err => console.error(err)
    });
  }

  sortTicketsByPriority(priority: any) {
    this.http.get<any[]>(
      `${SharedVariables.baseUrl}/api/tickets?priority=${this.getValue(priority)}`
    ).subscribe({
      next: data => {
        this.tickets.set(data);
        this.amountOfTickets = data.length;
      },
      error: err => console.error(err)
    });
  }

  onTicketClick(ticket: any) {
    this.selectedTicket = ticket;
    this.router.navigate(['/tickets', ticket.id]);
  }

  getStatusStyles(ticket: any) {
    switch ((ticket?.status || '').trim()) {
      case 'Open':
        return {
          background: 'rgba(59, 130, 246, 0.12)',
          border: '#2563eb',
        };

      case 'In Progress':
        return {
          background: 'rgba(245, 158, 11, 0.12)',
          border: '#d97706',
        };

      case 'Resolved':
        return {
          background: 'rgba(16, 185, 129, 0.12)',
          border: '#059669',
        };

      case 'Closed':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          border: '#dc2626',
        };

      default:
        return {
          background: 'rgba(156, 163, 175, 0.12)',
          border: '#9ca3af',
        };
    }
  }

  getPriorityStyles(ticket: any) {
    switch ((ticket?.priority || '').trim()) {
      case 'Critical':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          border: '#dc2626',
        };

      case 'High':
        return {
          background: 'rgba(249, 115, 22, 0.12)',
          border: '#ea580c',
        };

      case 'Medium':
        return {
          background: 'rgba(234, 179, 8, 0.12)',
          border: '#ca8a04',
        };

      case 'Low':
        return {
          background: 'rgba(34, 197, 94, 0.12)',
          border: '#16a34a',
        };

      default:
        return {
          background: 'rgba(156, 163, 175, 0.12)',
          border: '#9ca3af',
        };
    }
  }

}
