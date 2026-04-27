import { Component } from '@angular/core';
import { Navbar } from '../../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-createticket',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './createticket.html',
  styleUrl: './createticket.css',
})
export class Createticket {

  constructor(    private http: HttpClient,
    private router: Router) {}

  closeTicketModal() {
    document.getElementById('ticket-modal')?.classList.remove('is-active');
  }

  updateTicket() {

  }

  goBack() {
    this.router.navigate(['/my-tickets']);
  }
}
