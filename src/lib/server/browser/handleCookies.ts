import { dev } from '$app/environment';
import type { Browser } from '@cloudflare/puppeteer';

// Function to handle cookie banners by clicking deny/reject buttons
export async function handleCookieBanner(page: Awaited<ReturnType<Browser['newPage']>>) {
	try {
		// First, try common CSS selectors (class/id based)
		const cssSelectors = [
			// CookieBot specific
			'#CybotCookiebotDialogBodyButtonDecline',
			'a[id*="CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll"]',
			// OneTrust specific
			'.ot-pc-refuse-all-handler',
			'button[id*="onetrust-reject"]',
			'.onetrust-close-btn-handler',
			// Cookie consent specific
			'.cc-deny',
			'.cc-dismiss',
			// Common patterns
			'button[class*="reject" i]',
			'button[class*="deny" i]',
			'button[class*="decline" i]',
			'button[id*="reject" i]',
			'button[id*="deny" i]',
			'a[class*="reject" i]',
			'a[class*="deny" i]',
			'[data-testid*="reject"]',
			'[data-testid*="deny"]'
		];

		// Try CSS selectors first
		for (const selector of cssSelectors) {
			try {
				const button = await page.$(selector);
				if (button) {
					const isVisible = await page.evaluate((el: Element) => {
						const rect = el.getBoundingClientRect();
						return rect.width > 0 && rect.height > 0;
					}, button);

					if (isVisible) {
						if (dev) console.warn(`🍪 Found cookie button via CSS: ${selector}`);
						await button.click();
						await new Promise((resolve) => setTimeout(resolve, 500));
						if (dev) console.warn(`✅ Clicked cookie deny button`);
						return;
					}
				}
			} catch (e) {
				continue;
			}
		}

		// Try finding buttons by text content using page.evaluate
		const clicked = await page.evaluate(() => {
			const keywords = [
				'reject all',
				'reject',
				'deny all',
				'deny',
				'decline all',
				'decline',
				'no thanks',
				'weigeren',
				'weiger alles',
				'afwijzen',
				'ablehnen',
				'alle ablehnen'
			];

			// Find all buttons and links
			const elements = Array.from(document.querySelectorAll('button, a'));

			for (const keyword of keywords) {
				for (const el of elements) {
					const text = el.textContent?.toLowerCase().trim() || '';
					const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';

					if (text === keyword || ariaLabel === keyword || text.includes(keyword)) {
						// Check if element is visible
						const rect = el.getBoundingClientRect();
						if (rect.width > 0 && rect.height > 0) {
							// Found a match, click it
							(el as HTMLElement).click();
							return keyword; // Return the keyword that was clicked
						}
					}
				}
			}
			return null;
		});

		if (clicked) {
			if (dev) console.warn(`🍪 Found and clicked cookie button with text: "${clicked}"`);
			await new Promise((resolve) => setTimeout(resolve, 500));
			return;
		}

		// If no deny button found, just continue (not all sites have cookie banners)
		if (dev) console.warn(`ℹ️  No cookie banner found or already dismissed`);
	} catch (error) {
		// Don't fail the whole screenshot if cookie handling fails
		if (dev) console.warn(`⚠️  Cookie banner handling failed (non-critical):`, error);
	}
}
