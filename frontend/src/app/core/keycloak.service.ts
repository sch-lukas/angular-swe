import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakServiceStub {
  private keycloak?: Keycloak;

  async init(): Promise<void> {
    // Use real config in production
    this.keycloak = new Keycloak({
      url: 'http://localhost:8080',
      realm: 'books-realm',
      clientId: 'angular-frontend',
    });
    await this.keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html' });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.authenticated;
  }
}
