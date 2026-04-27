import { Component, Injectable } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';

@Component({
  selector: 'app-ticketboard',
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './ticketboard.html',
  styleUrl: './ticketboard.css',
})

@Injectable({
  providedIn: 'root'
})
export class Ticketboard {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  statusOpenColor = '#3b82f6';
  statusInProgressColor = '#f59e0b';
  statusClosedColor = '#10b981';

  priorityHighColor = '#ef4444';
  priorityMediumColor = '#f59e0b';
  priorityLowColor = '#22c55e';

  selectedStatus: string = '';
  selectedPriority: string = '';
  sortOption: string = 'priorityDesc';


  public tickets: any[] = [];

  ngOnInit() {
    //this.loadTickets();
  }

  getTickets() { 
    return this.tickets;
  }

  setStatusColor(ticket: any): string {
    switch (ticket.status) {
      case 'Open':
        return this.statusOpenColor;
      case 'In Progress':
        return this.statusInProgressColor;
      case 'Closed':
        return this.statusClosedColor;
      default:
        return 'gray';
    }
  }

  setPriorityColor(ticket: any): string {
    switch (ticket.priority) {
      case 'High':
        return this.priorityHighColor;
      case 'Medium':
        return this.priorityMediumColor;
      case 'Low':
        return this.priorityLowColor;
      default:
        return 'gray';
    }
  }
  
  loadTickets() {
    this.http.get(`${SharedVariables.baseUrl}/api/tickets`).subscribe((response: any) => {
      this.tickets = response;
    });
  }

  onTicketClick(ticket: any) {
    console.log('Ticket clicked ',  ticket);
    document.getElementById('ticket-modal')?.classList.add('is-active');
    setTimeout(() => {
    const modalTitle = document.getElementById('modal-ticket-title');
    const modalName = document.getElementById('modal-ticket-name');
    const modalEmail = document.getElementById('modal-ticket-email');
    const modalDescription = document.getElementById('modal-ticket-description');
    const modalStatus = document.getElementById('modal-ticket-status');
    const modalPriority = document.getElementById('modal-ticket-priority');


    if (modalTitle) modalTitle.textContent = this.tickets.find((t: any) => t.id === ticket.id)?.title;
    if (modalName) modalName.textContent = this.tickets.find((t: any) => t.id === ticket.id)?.name;
    if (modalEmail) modalEmail.textContent = this.tickets.find((t: any) => t.id === ticket.id)?.email;
    if (modalDescription) modalDescription.textContent = this.tickets.find((t: any) => t.id === ticket.id)?.description;
    if (modalStatus) modalStatus.textContent = `Status: ${this.tickets.find((t: any) => t.id === ticket.id)?.status}`;
    if (modalPriority) modalPriority.textContent = `Priority: ${this.tickets.find((t: any) => t.id === ticket.id)?.priority}`;
    }, 50);

  }

  closeTicketModal() {
    document.getElementById('ticket-modal')?.classList.remove('is-active');
  }

  updateTicket() {

  }

  createTicket() {
    this.router.navigate(['/create-ticket']);
  }
}
