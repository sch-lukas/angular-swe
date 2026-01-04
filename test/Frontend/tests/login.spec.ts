import { test } from '../fixtures';

test('Login zeigt Neu anlegen und Logout', async ({ header }) => {
    await header.gotoHome();
    await header.login('admin', 'p');
    await header.expectLoggedIn();
});
