import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const generosRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/generos.component').then((m) => m.GenerosComponent),
  },
];
