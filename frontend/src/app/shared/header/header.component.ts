import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../core/keycloak.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [AsyncPipe, FormsModule, RouterModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    user = '';
    pass = '';
    loading = false;
    authState$;
    constructor(
        public auth: KeycloakService,
        private router: Router,
    ) {
        this.authState$ = this.auth.authState$;
    }

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
