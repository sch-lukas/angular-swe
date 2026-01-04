import { expect, Page } from '@playwright/test';

export class HeaderPage {
    constructor(private readonly page: Page) {}

    async gotoHome() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        await this.page.getByPlaceholder('Benutzer').fill(username);
        await this.page.getByPlaceholder('Passwort').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async expectLoggedIn() {
        await expect(
            this.page.getByRole('button', { name: 'Neu anlegen' }),
        ).toBeVisible();
        await expect(
            this.page.getByRole('button', { name: 'Logout' }),
        ).toBeVisible();
    }
}
