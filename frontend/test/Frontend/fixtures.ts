import { test as base } from '@playwright/test';
import { HeaderPage } from './pages/header.page';

type Fixtures = {
    header: HeaderPage;
};

export const test = base.extend<Fixtures>({
    header: async ({ page }, use) => {
        const header = new HeaderPage(page);
        await use(header);
    },
});

export const expect = test.expect;
