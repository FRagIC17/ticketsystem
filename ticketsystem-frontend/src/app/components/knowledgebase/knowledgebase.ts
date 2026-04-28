import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledgebase',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './knowledgebase.html',
  styleUrl: './knowledgebase.css',
})
export class Knowledgebase {
  
}
