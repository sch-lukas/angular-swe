import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { createHttpLink, InMemoryCache as ApolloInMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { KeycloakService } from './core/keycloak.service';

const GRAPHQL_URI = 'https://localhost:8443/graphql'; // anpassen

export function createApollo(httpLink: HttpLink, kc: KeycloakService) {
    const http = createHttpLink({ uri: GRAPHQL_URI }) as any;

    const authLink = setContext((operation, context) => {
        const token = kc.getToken();
        const existingHeaders: Record<string, any> = (context && (context as any).headers) || {};
        if (token) {
            return {
                headers: {
                    ...existingHeaders,
                    Authorization: `Bearer ${token}`,
                },
            } as any;
        }
        return { headers: existingHeaders } as any;
    });

    return {
        link: authLink.concat(http),
        cache: new ApolloInMemoryCache(),
    };
}

@NgModule({
    imports: [HttpClientModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink, KeycloakService],
        },
    ],
})
export class GraphQLModule {}
