import 'zone.js'; // Angular still relies on Zone.js for change detection
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// Simple standalone bootstrap for Angular 20
bootstrapApplication(AppComponent).catch((err: any) => console.error(err));
