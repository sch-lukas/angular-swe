import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

const GRAPHQL_URI = 'https://localhost:8443/graphql'; // anpassen

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: GRAPHQL_URI }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
