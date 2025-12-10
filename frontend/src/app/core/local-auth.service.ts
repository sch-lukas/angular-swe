import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalAuthService {
    private _user: string | null = null;

    constructor() {
        const u = localStorage.getItem('local_user');
        this._user = u;
    }

    async login(username: string, password: string) {
        // very simple local auth for demo purposes
        if (username === 'admin' && password === 'p') {
            this._user = username;
            localStorage.setItem('local_user', username);
            return true;
        }
        alert('Ungültige Anmeldedaten');
        return false;
    }

    logout() {
        this._user = null;
        localStorage.removeItem('local_user');
    }

    isLoggedIn(): boolean {
        return !!this._user;
    }

    getUser(): string | null {
        return this._user;
    }
}
