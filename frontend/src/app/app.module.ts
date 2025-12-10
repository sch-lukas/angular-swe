import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { KeycloakService } from './core/keycloak.service';
import { GraphQLModule } from './graphql.module';
import { LandingComponent } from './pages/landing/landing.component';
import { HeaderComponent } from './shared/header/header.component';

export function initializeKeycloak(kc: KeycloakService) {
    return () => kc.init();
}

@NgModule({
    declarations: [AppComponent, HeaderComponent, LandingComponent],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([{ path: '', component: LandingComponent }]),
        GraphQLModule,
    ],
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
