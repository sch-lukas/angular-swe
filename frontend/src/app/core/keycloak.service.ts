import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class KeycloakService {
    private tokenKey = 'frontend_auth_token';

    loginDemo() {
        localStorage.setItem(this.tokenKey, 'demo-token');
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}
