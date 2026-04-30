import { Component, inject, PLATFORM_ID, Signal, signal } from '@angular/core';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  itSupporters = signal<any[]>([]);

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.getItSupporters();
    }
  }

  getItSupporters() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/it-supporters`).subscribe({
      next: (data) => {
        this.itSupporters.set(data);
      },
      error: (err) => {
        console.error('Error fetching IT supporters:', err);
        this.itSupporters.set([]);
      }
    });
  }
}
