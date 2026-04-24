import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Ticketboard } from './ticketboard/ticketboard';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  amountOfTickets: number = 0;

  constructor(private Ticketboard: Ticketboard) { }

  ngOnInit() {
    this.findAmountOfTickets();
  }

  findAmountOfTickets() {
    this.amountOfTickets = this.Ticketboard.getTickets().length;
  }

  onTicketClick(ticket: any) {

  }
}
