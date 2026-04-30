import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
import { error } from 'console';

@Component({
  selector: 'app-knowledgebase',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './knowledgebase.html',
  styleUrl: './knowledgebase.css',
})
export class Knowledgebase {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  public sharedVariables = inject(SharedVariables);

  articlesForUser = signal<any[]>([]);
  articlesForSupporter = signal<any[]>([]);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.loadArticlesForUser();
    this.loadArticlesForSupporter();
    }
  }

  loadArticlesForUser() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/articles-for-user`).subscribe({
      next: (articles) => {
        this.articlesForUser.set(articles);
        console.log('Articles loaded successfully:', articles);
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  loadArticlesForSupporter() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/articles-for-supporter`).subscribe({
      next: (articles) => {
        this.articlesForSupporter.set(articles);
        console.log('Articles loaded successfully:', articles);
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  openArticle() {
    // Implement the logic to open the article, e.g., navigate to an article detail page or open a modal
    document.getElementById('delete-modal')?.classList.add('is-active');
  }

  addArticle() {
    // Implement the logic to add a new article

  }
}
