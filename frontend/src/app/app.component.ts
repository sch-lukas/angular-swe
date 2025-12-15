import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        HeaderComponent,
        RouterOutlet,
    ],
    template: `
        <app-header></app-header>
        <div class="container mt-4">
            <router-outlet></router-outlet>
        </div>
    `,
})
export class AppComponent {}
