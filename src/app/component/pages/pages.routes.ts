import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

export default [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add/new/new.component').then((m) => m.NewComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'new',
    children: [
      {
        path: 'new-order',
        loadComponent: () =>
          import('./add/new-order/new-order.component').then(
            (m) => m.NewOrderComponent
          ),
          canActivate: [AuthGuard],
      },
      {
        path: 'new-trip',
        loadComponent: () =>
          import('./add/new-trip/new-trip.component').then(
            (m) => m.NewTripComponent
          ),
          canActivate : [AuthGuard],
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'viajes/detalle/:id',
    loadComponent: () =>
      import('./detail-trip/detail-trip.component').then(
        (m) => m.DetailTripComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'new-order',
    loadComponent: () =>
      import('./add/new-order/new-order.component').then(
        (m) => m.NewOrderComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'store-details/:id',
    loadComponent: () =>
      import('./store-details/store-details.component').then(
        (m) => m.StoreDetailsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ticket',
    loadComponent: () =>
      import('./ticket/ticket.component').then((m) => m.TicketComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.component').then(
        (m) => m.NotificationsComponent
      ),
    canActivate: [AuthGuard],
  },
] as Routes;
