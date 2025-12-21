import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import 'zone.js';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

export function createApollo(httpLink: HttpLink) {
    const basicHttp = httpLink.create({
        uri: '/graphql',
        withCredentials: true,
        headers: {
            'apollo-require-preflight': 'true',
        } as any,
    });

    const auth = setContext((_, { headers }) => {
        // Hole den Token aus dem LocalStorage
        const token = localStorage.getItem('access_token');

        return {
            headers: {
                ...headers,
                ...(token ? { authorization: `Bearer ${token}` } : {}),
            } as any, // 'as any' verhindert den HttpHeaders-Fehler
        };
    });

    return {
        link: auth.concat(basicHttp),
        cache: new InMemoryCache(),
    };
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
        Apollo,
        HttpLink,
        provideRouter(routes),
    ],
}).catch((err: any) => console.error(err));
