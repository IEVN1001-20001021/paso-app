import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../pages/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  notificationCount: number = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del conteo de notificaciones
    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
    });
  }
}
