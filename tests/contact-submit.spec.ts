import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:5173';

test('submit contact form with mocked server response', async ({ page }) => {
	// Intercept POST to the contact action and return a successful JSON response
	await page.route('**/contact', async (route) => {
		const req = route.request();
		if (req.method() === 'POST') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					message: "Thanks for reaching out! I'll get back to you soon."
				})
			});
			return;
		}
		await route.continue();
	});

	await page.goto(`${BASE}/contact`);

	// Fill the form fields
	await page.fill('#name', 'Playwright Tester');
	await page.fill('#email', 'test@example.com');
	await page.fill('#message', 'Hello from Playwright tests. This message is sufficiently long.');

	// Submit the form and wait for the POST request to be made
	const [request] = await Promise.all([
		page.waitForRequest((r) => r.url().endsWith('/contact') && r.method() === 'POST'),
		page.click('button[type="submit"]')
	]);

	// Assert the POST payload contains the form fields we sent
	const postData = await request.postData();
	if (!postData) throw new Error('No POST data captured for contact submission');
	const decoded = decodeURIComponent(postData.replace(/\+/g, ' '));
	expect(decoded).toContain('Playwright Tester');
	expect(decoded).toContain('test@example.com');
	expect(decoded).toContain('Hello from Playwright tests');
});
