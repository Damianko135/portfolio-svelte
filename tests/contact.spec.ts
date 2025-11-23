import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:5173';

test('email reveal shows real email and prevents navigation', async ({ page }) => {
	// Intercept location changes to avoid leaving the test page (mailto:)
	await page.addInitScript(() => {
		// Override replace to capture navigations instead of performing them
		try {
			type Loc = { assign?: (url: string) => void; replace?: (url: string) => void };
			const loc = window.location as unknown as Loc;
			loc.assign = (url: string) => {
				(window as unknown as { __lastAssignedUrl?: string }).__lastAssignedUrl = url;
			};
			loc.replace = (url: string) => {
				(window as unknown as { __lastAssignedUrl?: string }).__lastAssignedUrl = url;
			};
			Object.defineProperty(window.location, 'href', {
				set(v: unknown) {
					(window as unknown as { __lastAssignedUrl?: string }).__lastAssignedUrl = String(v);
				}
			});
		} catch (e) {
			// some environments may prevent redefinition; ignore
		}
	});

	await page.goto(`${BASE}/contact`);

	// Find the obfuscated email button (use the username to locate it reliably)
	const emailButton = page.locator('button', { hasText: 'damiankorver' });
	await expect(emailButton).toBeVisible();

	// Click to reveal the real email (client-side change occurs before the mailto)
	await emailButton.click();

	// The button should now contain the real email (contains @)
	await expect(emailButton).toContainText('@');
});
