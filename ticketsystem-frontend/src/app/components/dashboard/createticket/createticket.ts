import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../../SharedVariables/SharedVariables';

@Component({
  selector: 'app-createticket',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './createticket.html',
  styleUrl: './createticket.css',
})
export class Createticket {

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  selectedPriority: string = '';
  selectedStatus: string = '';
  selectedUser: string = '';

  priorities: any[] = [];
  statuses: any[] = [];

  loading = { statuses: true, priorities: true };

  ngOnInit() {
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

  sortTicketsByStatus(status: string) {
    console.log(status);
  }

  sortTicketsByPriority(priority: string) {
    console.log(priority);
  }

  closeTicketModal() {
    document.getElementById('ticket-modal')?.classList.remove('is-active');
  }

  updateTicket() {

  }

  goBack() {
    this.router.navigate(['/']);
  }
}
