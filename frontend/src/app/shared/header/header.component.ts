import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KeycloakService } from '../../core/keycloak.service';

// Header-Komponente für Navigation und Login
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [AsyncPipe, FormsModule, RouterModule],
    templateUrl: './header.component.html',
})
export class HeaderComponent {
    // Login-Felder
    user = '';
    pass = '';
    loading = false;

    // Observable für Auth-Status
    authState$;

    constructor(
        public auth: KeycloakService,
        private router: Router,
    ) {
        // Auth-Status abonnieren
        this.authState$ = this.auth.authState$;
    }

    // Zur Suchseite navigieren
    navigateToSuche() {
        this.router.navigate(['/suche']);
    }

    // Zur "Neu anlegen"-Seite navigieren
    navigateToNeu() {
        this.router.navigate(['/neu']);
    }

    // Login durchführen
    login() {
        console.log('Login start, user:', this.user);

        // Eingabevalidierung
        if (!this.user || !this.pass) {
            alert('Bitte Benutzer und Passwort eingeben.');
            return;
        }

        this.loading = true;

        // Login-Request an Keycloak senden
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

    // Benutzer ausloggen
    logout() {
        this.auth.logout();
    }
}
