import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedVariables } from '../../SharedVariables/SharedVariables';
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
  newArticleTitle = '';
  newArticleSlug = '';
  newArticleContent = '';

  private resetCreateArticleForm() {
    this.newArticleTitle = '';
    this.newArticleSlug = '';
    this.newArticleContent = '';
    this.selectedCategoryId = null;
    this.selectedItSupporterId = null;
    this.newArticleIsPublic = true;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.loadArticlesForUser();
    this.loadArticlesForSupporter();
    }
  }

  loadArticlesForUser() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/article/articles-for-user`).subscribe({
      next: (articles) => {
        this.articlesForUser.set(articles);
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  loadArticlesForSupporter() {
    this.http.get<any[]>(`${SharedVariables.baseUrl}/api/article/articles-for-supporter`).subscribe({
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
    this.resetCreateArticleForm();
    document.getElementById('create-article-modal')?.classList.add('is-active');
  }

  closecreateArticle() {
    // Implement the logic to close the article, e.g., navigate back or close a modal
    this.resetCreateArticleForm();
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
    const payload = {     
      title: this.newArticleTitle,
      slug: this.newArticleSlug,
      articleBody: this.newArticleContent,
      categoryId: this.selectedCategoryId,
      createdBy: this.itSupporters()[0]?.id,
      createdAt: new Date(),
      deletedAt: null,
      isPublicForUser: this.newArticleIsPublic
    };

    this.http.put<any[]>(`${SharedVariables.baseUrl}/api/article/create-article`, payload).subscribe({
      next: () => {
        this.resetCreateArticleForm();
        document.getElementById('create-article-modal')?.classList.remove('is-active');
        
        this.loadArticlesForUser();
        this.loadArticlesForSupporter();
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  deleteArticle(articleId: number) {
    this.http.delete(`${SharedVariables.baseUrl}/api/article/delete-article?articleId=${articleId}`).subscribe({
      next: () => {
        document.getElementById('article-modal')?.classList.remove('is-active');
        this.loadArticlesForUser();
        this.loadArticlesForSupporter();
      },
      error: (err) => {
        console.error('Failed to delete article:', err);
      }
    });
  }
}
