import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
    private keycloak?: KeycloakInstance;

    async init(): Promise<void> {
        this.keycloak = Keycloak({
            url: 'http://localhost:8080',
            realm: 'books-realm',
            clientId: 'angular-frontend',
        }) as KeycloakInstance;

        await this.keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri:
                window.location.origin + '/assets/silent-check-sso.html',
            pkceMethod: 'S256',
        });
    }

    getToken(): string | undefined {
        return this.keycloak?.token;
    }

    async login(): Promise<void> {
        await this.keycloak?.login();
    }

    async logout(redirectUri?: string): Promise<void> {
        await this.keycloak?.logout({
            redirectUri: redirectUri ?? window.location.origin,
        });
    }

    isLoggedIn(): boolean {
        return !!this.keycloak?.authenticated;
    }

    hasRole(role: string): boolean {
        return !!this.keycloak?.hasRealmRole(role);
    }
}
