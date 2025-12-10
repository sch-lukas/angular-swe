import { Component } from '@angular/core';
import { LocalAuthService } from '../../core/local-auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    username = '';
    password = '';

    constructor(public auth: LocalAuthService) {}

    async login() {
        await this.auth.login(this.username, this.password);
        // clear password for UX
        this.password = '';
    }

    logout() {
        this.auth.logout();
    }
}
