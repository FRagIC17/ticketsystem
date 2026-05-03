import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
import { error } from 'console';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  articlesForUser = signal<any[]>([]);
  articlesForSupporter = signal<any[]>([]);
  article = signal<any[]>([]);
  selectedArticle = signal<any>(null);
  newArticleIsPublic = true;

  selectedCategoryId: number | null = null;
  selectedItSupporterId: number | null = null;

  itSupporters = signal<any[]>([]);
  categories = signal<any[]>([]);
  newArticleTitle: any;
  newArticleSlug: any;
  newArticleContent: any;

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
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  loadItSupporters() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/it-supporters`).subscribe({
      next: (itSupporters) => {
        this.itSupporters.set(itSupporters);
      },
      error: (err) => {
        console.error('Failed to load IT supporters:', err);
      }
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/categories`).subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  opencreateArticle() {
    // Implement the logic to open the article, e.g., navigate to an article detail page or open a modal
    this.loadItSupporters();
    this.loadCategories();
    this.newArticleIsPublic = true;
    document.getElementById('create-article-modal')?.classList.add('is-active');
  }

  closecreateArticle() {
    // Implement the logic to close the article, e.g., navigate back or close a modal
    document.getElementById('create-article-modal')?.classList.remove('is-active');
  }

  openArticle(article: any) {
    this.selectedArticle.set(article);
    // Implement the logic to open the article, e.g., navigate to an article detail page or open a modal
    document.getElementById('article-modal')?.classList.add('is-active');
  }

  closeArticle() {
    // Implement the logic to close the article, e.g., navigate back or close a modal
    document.getElementById('article-modal')?.classList.remove('is-active');
  }

  createArticle() {
    const payload = {     title: this.newArticleTitle,
      slug: this.newArticleSlug,
      articleBody: this.newArticleContent,
      categoryId: this.selectedCategoryId,
      createdBy: this.itSupporters()[0]?.id,
      createdAt: new Date(),
      deletedAt: null,
      isPublicForUser: this.newArticleIsPublic
    };

    this.http.post<any[]>(`${SharedVariables.baseUrl}/api/create-article`, payload).subscribe({
      next: (articles) => {
        console.log('Articles loaded successfully:', articles);
        this.router.navigate(['/knowledge-base']);
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });

  }
}
