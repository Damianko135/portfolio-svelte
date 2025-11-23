import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:5173';

test('home page shows hero and CTAs', async ({ page }) => {
	await page.goto(`${BASE}/`);

	// Ensure hero heading contains the site owner name (match the primary h1)
	await expect(page.locator('h1', { hasText: /Damian Korver/i }).first()).toBeVisible();

	// Primary CTA should link to /projects (match by href to be language-agnostic)
	const projectsCta = page.locator('a[href="/projects"]');
	await expect(projectsCta.first()).toBeVisible();
	await expect(projectsCta.first()).toHaveAttribute('href', '/projects');

	// Secondary CTA should link to /contact
	const contactCta = page.locator('a[href="/contact"]');
	await expect(contactCta.first()).toBeVisible();
	await expect(contactCta.first()).toHaveAttribute('href', '/contact');
});
