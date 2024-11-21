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
] as Routes;
