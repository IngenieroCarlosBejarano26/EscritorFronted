import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'autores' },
  {
    path: 'autores',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/autores/autores.routes').then(
        (m) => m.AUTORES_ROUTES
      ),
  },
  {
    path: 'libros',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/libros/libros.routes').then((m) => m.LIBROS_ROUTES),
  },
];
