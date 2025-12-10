import { Component } from '@angular/core';
import { LandingComponent } from './pages/landing/landing.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, LandingComponent],
  template: `
    <app-header></app-header>
    <div class="container mt-4">
      <app-landing></app-landing>
    </div>
  `
})
export class AppComponent {}
