import { Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./component/auth/auth.routes').then((m) => m.default),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./component/pages/pages.routes').then((m) => m.default),
  }
];
