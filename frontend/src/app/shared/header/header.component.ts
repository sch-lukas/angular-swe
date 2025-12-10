import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeycloakService } from '../../core/keycloak.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-header d-flex align-items-center">
      <div class="me-auto h5">Buch</div>

      <div class="me-3">
        <button class="btn btn-outline-secondary btn-sm">Suche</button>
      </div>

      <div *ngIf="!auth.isAuthenticated(); else logged" class="d-flex align-items-center">
        <input [(ngModel)]="user" placeholder="Benutzer" class="form-control form-control-sm me-2" style="width:120px">
        <input [(ngModel)]="pass" placeholder="Passwort" type="password" class="form-control form-control-sm me-2" style="width:120px">
        <button class="btn btn-primary btn-sm" (click)="login()">Login</button>
      </div>

      <ng-template #logged>
        <div class="d-flex align-items-center">
          <button *ngIf="auth.isAuthenticated()" class="btn btn-success btn-sm me-2">Neu anlegen</button>
          <button class="btn btn-outline-secondary btn-sm" (click)="logout()">Logout</button>
        </div>
      </ng-template>
    </div>
  `
})
export class HeaderComponent {
  user = '';
  pass = '';
  constructor(public auth: KeycloakService) {}

  login() {
    if (this.user === 'admin' && this.pass === 'p') {
      this.auth.loginDemo();
    } else {
      alert('Ungültige Zugangsdaten');
    }
  }

  logout() {
    this.auth.logout();
  }
}
