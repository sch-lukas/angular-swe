import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import 'zone.js';
import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

export function createApollo(httpLink: HttpLink) {
    return {
        link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
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
