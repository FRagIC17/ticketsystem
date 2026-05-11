import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { NotificationBanner } from '../../components/notification-banner/notification-banner';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, RouterModule, NotificationBanner],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
