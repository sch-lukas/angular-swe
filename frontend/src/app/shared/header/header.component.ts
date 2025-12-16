import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../core/keycloak.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
        <div class="app-header d-flex align-items-center">
            <a routerLink="/" class="me-auto h5 text-decoration-none">Buch</a>

            <div class="me-3">
                <a
                    (click)="navigateToSuche()"
                    class="btn btn-outline-secondary btn-sm"
                    >Suche</a
                >
            </div>

            <div
                *ngIf="!auth.isAuthenticated(); else logged"
                class="d-flex align-items-center"
            >
                <input
                    [(ngModel)]="user"
                    placeholder="Benutzer"
                    class="form-control form-control-sm me-2"
                    style="width:120px"
                />
                <input
                    [(ngModel)]="pass"
                    placeholder="Passwort"
                    type="password"
                    class="form-control form-control-sm me-2"
                    style="width:120px"
                />
                <button class="btn btn-primary btn-sm" (click)="login()">
                    Login
                </button>
            </div>

            <ng-template #logged>
                <div class="d-flex align-items-center">
                    <button
                        *ngIf="auth.isAuthenticated()"
                        class="btn btn-success btn-sm me-2"
                        (click)="navigateToNeu()"
                    >
                        Neu anlegen
                    </button>
                    <button
                        class="btn btn-outline-secondary btn-sm"
                        (click)="logout()"
                    >
                        Logout
                    </button>
                </div>
            </ng-template>
        </div>
    `,
})
export class HeaderComponent {
    user = '';
    pass = '';
    loading = false;
    constructor(
        public auth: KeycloakService,
        private router: Router,
    ) {}

    navigateToSuche() {
        this.router.navigate(['/suche']);
    }

    navigateToNeu() {
        this.router.navigate(['/neu']);
    }

    login() {
        console.log('Login start, user:', this.user);
        if (!this.user || !this.pass) {
            alert('Bitte Benutzer und Passwort eingeben.');
            return;
        }

        this.loading = true;

        this.auth.login(this.user, this.pass).subscribe({
            next: () => {
                console.log('Login success');
                this.loading = false;
            },
            error: (err) => {
                console.error('Login error', err);
                this.loading = false;
                alert(
                    'Login fehlgeschlagen: ' +
                        (err?.message || 'Bitte Daten prüfen'),
                );
            },
        });
    }

    logout() {
        this.auth.logout();
    }
}
