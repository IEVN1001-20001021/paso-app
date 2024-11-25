import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PasoService } from '../paso.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../pages/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  notificationCount: number = 0;

  constructor(
    private pasoService: PasoService,
    private cookieService: CookieService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del conteo de notificaciones
    this.notificationService.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
    });
  }
}
