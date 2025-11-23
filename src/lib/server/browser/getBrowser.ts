import { dev } from '$app/environment';
import type { Browser, BrowserWorker } from '@cloudflare/puppeteer';
import type { Fetcher } from '@cloudflare/workers-types';

// Cache browser instance to reuse sessions and avoid rate limits
let cachedBrowser: Browser | null = null;
let browserLastUsed = 0;
const BROWSER_REUSE_TIMEOUT = 50000; // Keep browser alive for 50 seconds

// Function to get or create a browser instance
export async function getBrowser(browserBinding: Fetcher) {
	const puppeteer = await import('@cloudflare/puppeteer');
	const now = Date.now();

	// Reuse existing browser if it was used recently
	if (cachedBrowser && now - browserLastUsed < BROWSER_REUSE_TIMEOUT) {
		browserLastUsed = now;
		if (dev) {
			const ageSeconds = Math.floor((now - (browserLastUsed - BROWSER_REUSE_TIMEOUT)) / 1000);
			console.warn(`♻️  Reusing existing browser session (age: ${ageSeconds}s)`);
		}
		return cachedBrowser;
	}

	// Close old browser if it exists
	if (cachedBrowser) {
		try {
			if (dev) console.warn(`🔄 Closing old browser session...`);
			await cachedBrowser.close();
		} catch (e) {
			// Browser already closed, ignore
		}
		cachedBrowser = null;
	}

	// Launch new browser with keep_alive to prevent early timeout
	if (dev) console.warn(`🚀 Launching new browser session...`);
	cachedBrowser = await puppeteer.default.launch(browserBinding as unknown as BrowserWorker, {
		keep_alive: 60000 // Keep alive for 60 seconds
	});
	browserLastUsed = now;
	if (dev) console.warn(`✅ Browser launched successfully`);

	return cachedBrowser;
}
