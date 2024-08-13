import { Routes } from '@angular/router';
import {IndexComponent} from "./pages/index/index.component";

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then(x => x.GameComponent)
  }
];
