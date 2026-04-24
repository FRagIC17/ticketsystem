import { Component, Injectable } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';

@Component({
  selector: 'app-ticketboard',
  imports: [Navbar, HttpClientModule, CommonModule, FormsModule],
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
  public testTickets: any[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', title: 'Ticket 1', description: 'Description for Ticket 1', status: 'Closed', priority: 'High', createdAt: new Date() },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', title: 'Ticket 2', description: 'Description for Ticket 2', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', title: 'Ticket 3', description: 'Description for Ticket 3', status: 'Closed', priority: 'Low', createdAt: new Date() },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', title: 'Ticket 4', description: 'Description for Ticket 4', status: 'Open', priority: 'High', createdAt: new Date() },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', title: 'Ticket 5', description: 'Description for Ticket 5', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 6, name: 'Diana Davis', email: 'diana.davis@example.com', title: 'Ticket 6', description: 'Description for Ticket 6', status: 'Open', priority: 'Low', createdAt: new Date() },
    { id: 7, name: 'Eve Green', email: 'eve.green@example.com', title: 'Ticket 7', description: 'Description for Ticket 7', status: 'Closed', priority: 'High', createdAt: new Date() },
    { id: 8, name: 'Frank White', email: 'frank.white@example.com', title: 'Ticket 8', description: 'Description for Ticket 8', status: 'In Progress', priority: 'Medium', createdAt: new Date() },
    { id: 9, name: 'Grace Black', email: 'grace.black@example.com', title: 'Ticket 9', description: 'Description for Ticket 9', status: 'Open', priority: 'Low', createdAt: new Date() },
    { id: 10, name: 'Henry Grey', email: 'henry.grey@example.com', title: 'Ticket 10', description: 'Description for Ticket 10', status: 'Closed', priority: 'High', createdAt: new Date() },
  ];

  ngOnInit() {
    //this.loadTickets();
  }

  getTickets() { 
    return this.testTickets;
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


    if (modalTitle) modalTitle.textContent = this.testTickets.find((t: any) => t.id === ticket.id)?.title;
    if (modalName) modalName.textContent = this.testTickets.find((t: any) => t.id === ticket.id)?.name;
    if (modalEmail) modalEmail.textContent = this.testTickets.find((t: any) => t.id === ticket.id)?.email;
    if (modalDescription) modalDescription.textContent = this.testTickets.find((t: any) => t.id === ticket.id)?.description;
    if (modalStatus) modalStatus.textContent = `Status: ${this.testTickets.find((t: any) => t.id === ticket.id)?.status}`;
    if (modalPriority) modalPriority.textContent = `Priority: ${this.testTickets.find((t: any) => t.id === ticket.id)?.priority}`;
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
