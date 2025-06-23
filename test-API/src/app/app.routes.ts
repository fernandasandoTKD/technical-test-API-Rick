import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/characters/characters.component').then(m => m.CharactersComponent)
  }
];

