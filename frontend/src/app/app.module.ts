import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { KeycloakService } from './core/keycloak.service';
import { GraphQLModule } from './graphql.module';

export function initializeKeycloak(kc: KeycloakService) {
    return () => kc.init();
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, RouterModule.forRoot([]), GraphQLModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            deps: [KeycloakService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
