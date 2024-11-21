import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'sign-in',  // Ruta del componente sign-in
    loadComponent: () =>
      import('./sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'methods',
    children: [
      {
        path: 'email',
        loadComponent: () =>
          import('./methods/email/email.component').then((m) => m.EmailComponent),
      },
    ],
  },
] as Routes;
