import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedVariables } from '../../SharedVariables/SharedVariables';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, HttpClientModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router: Router, public sharedVariables: SharedVariables) { }


  switchToUserView() {
    this.sharedVariables.isUserView = !this.sharedVariables.isUserView;
  }
}
