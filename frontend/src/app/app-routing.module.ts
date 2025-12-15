import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { NeuComponent } from './pages/neu/neu.component';
import { Suche } from './pages/suche/suche';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'suche', component: Suche },
    { path: 'neu', component: NeuComponent },
    { path: '**', redirectTo: '' },
];
