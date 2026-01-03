import '@angular/localize/init';
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
    // Use relative URI so `ng serve --proxy-config` can forward requests to backend
    // Keep the basic HttpLink simple (avoid passing complex headers here to satisfy types)
    const http = httpLink.create({ uri: '/graphql' });

    // Do NOT add a global auth link here — individual requests (e.g. in
    // NeuComponent) set the `Authorization` header via the operation context.
    return {
        link: http,
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
