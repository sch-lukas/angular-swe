import { Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './pages/landing/landing.component';
import { Suche } from './pages/suche/suche';
import { HeaderComponent } from './shared/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [HeaderComponent, AppRoutingModule, LandingComponent, Suche],
    template: `
        <app-header></app-header>
        <div class="container mt-4">
            <router-outlet></router-outlet>
        </div>
    `,
})
export class AppComponent {}
