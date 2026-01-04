import { expect } from '@playwright/test';
import { test } from '../fixtures';

// Test: Login und Token holen, Buttons prüfen
test('Login holt Token (einfacher Demo-Flow)', async ({ header, page }) => {
    // Zur Startseite
    await header.gotoHome();

    // Warte auf Token-Response von Keycloak
    const tokenUrl =
        'https://localhost:8843/realms/nest/protocol/openid-connect/token';
    const tokenPromise = page.waitForResponse(
        (resp) => resp.url().startsWith(tokenUrl) && resp.status() === 200,
        { timeout: 20_000 },
    );

    // Login mit admin/p
    await header.login('admin', 'p');

    // Warte auf Token
    await tokenPromise;

    // Button "Neu anlegen" sichtbar?
    const neuButton = page.getByRole('button', { name: 'Neu anlegen' });
    // Button "Logout" sichtbar?
    const logoutButton = page.getByRole('button', { name: 'Logout' });

    // Wenn "Neu anlegen" sichtbar, dann auch "Logout"
    if (await neuButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await expect(logoutButton).toBeVisible({ timeout: 5_000 });
    }
});
