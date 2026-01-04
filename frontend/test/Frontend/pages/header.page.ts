import { expect, Page } from '@playwright/test';

export class HeaderPage {
    constructor(private readonly page: Page) {}

    async gotoHome() {
        await this.page.goto('/');
    }

    async loginAndWait(username: string, password: string) {
        // Max. zwei Versuche, falls der erste Klick den State noch nicht umschaltet
        for (let attempt = 0; attempt < 2; attempt++) {
            await this.page.getByPlaceholder('Benutzer').fill(username);
            await this.page.getByPlaceholder('Passwort').fill(password);
            await this.page.getByRole('button', { name: 'Login' }).click();

            try {
                await this.page
                    .getByRole('button', { name: 'Neu anlegen' })
                    .waitFor({ state: 'visible', timeout: 5_000 });
                return;
            } catch {
                // next attempt
            }
        }
    }

    async login(username: string, password: string) {
        await this.page.getByPlaceholder('Benutzer').fill(username);
        await this.page.getByPlaceholder('Passwort').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async expectLoggedIn() {
        await expect(
            this.page.getByRole('button', { name: 'Neu anlegen' }),
        ).toBeVisible({ timeout: 20_000 });
        await expect(
            this.page.getByRole('button', { name: 'Logout' }),
        ).toBeVisible({ timeout: 20_000 });
    }
}
