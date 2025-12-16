import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class KeycloakService {
    private tokenKey = 'frontend_auth_token';
    // Über Proxy (siehe proxy.conf.json), um CORS im Dev zu umgehen.
    private readonly tokenUrl = environment.keycloak.url;
    private readonly clientId = environment.keycloak.clientId;
    private readonly clientSecret = environment.keycloak.clientSecret;

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        const secret = this.clientSecret?.trim();
        if (!secret) {
            return throwError(
                () => new Error('Client Secret fehlt (NG_APP_CLIENT_SECRET)'),
            );
        }

        const body = new HttpParams()
            .set('username', username)
            .set('password', password)
            .set('grant_type', 'password')
            .set('client_id', this.clientId)
            .set('client_secret', secret);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http
            .post<{ access_token: string }>(this.tokenUrl, body, { headers })
            .pipe(
                tap((res) => {
                    console.log('Token response', res);
                    if (!res?.access_token) {
                        throw new Error('Access Token fehlt in der Antwort');
                    }
                    this.saveToken(res.access_token);
                    console.log('Token gespeichert');
                }),
                map(() => void 0),
            );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getToken(): string | null {
        return (
            localStorage.getItem(this.tokenKey) ??
            sessionStorage.getItem(this.tokenKey)
        );
    }

    private saveToken(token: string) {
        try {
            localStorage.setItem(this.tokenKey, token);
            console.log('Token in localStorage geschrieben');
        } catch (err) {
            console.warn('localStorage nicht verfügbar, versuche sessionStorage');
            try {
                sessionStorage.setItem(this.tokenKey, token);
                console.log('Token in sessionStorage geschrieben');
            } catch (e) {
                console.error('Konnte Token nicht speichern', e);
            }
        }
    }
}
