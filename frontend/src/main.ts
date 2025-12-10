import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import 'zone.js'; // Angular still relies on Zone.js for change detection
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
// Simple standalone bootstrap for Angular 20
bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)],
}).catch((err: any) => console.error(err));
