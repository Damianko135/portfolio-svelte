import { dev } from '$app/environment';
import type { Fetcher } from '@cloudflare/workers-types';
import { getBrowser } from './getBrowser';
import { handleCookieBanner } from './handleCookies';

// Capture screenshot using Cloudflare Browser Rendering API with Puppeteer
export async function captureScreenshot(
	url: string,
	browserBinding: Fetcher
): Promise<ArrayBuffer> {
	try {
		const browser = await getBrowser(browserBinding);
		const page = await browser.newPage();

		try {
			if (dev) console.warn(`🧭 Opening page and navigating to ${url}`);
			// Set realistic user agent to avoid bot detection
			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			);

			// Set additional headers to look more like a real browser
			await page.setExtraHTTPHeaders({
				'Accept-Language': 'en-US,en;q=0.9',
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate, br',
				'Sec-Fetch-Dest': 'document',
				'Sec-Fetch-Mode': 'navigate',
				'Sec-Fetch-Site': 'none',
				'Sec-Fetch-User': '?1',
				'Upgrade-Insecure-Requests': '1'
			});

			// Set viewport size for consistent screenshots
			await page.setViewport({ width: 1280, height: 720 });

			// Navigate to the URL with timeout protection
			await page.goto(url, {
				waitUntil: 'networkidle2',
				timeout: 30000 // 30 second timeout
			});

			if (dev) console.warn(`✅ Page navigation completed for ${url}`);

			// Wait longer for potential Cloudflare challenges to resolve
			// and for any dynamic content to load
			await new Promise((resolve) => setTimeout(resolve, 5000));

			// Try to dismiss cookie banners for cleaner screenshots
			await handleCookieBanner(page);

			// Wait a moment after clicking cookie banner
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Take screenshot with quality settings
			const screenshot = await page.screenshot({
				type: 'png',
				fullPage: false // Only capture viewport, not full page
			});

			if (dev) console.warn(`📸 Screenshot taken for ${url} (${screenshot.length} bytes)`);

			// Validate screenshot size (max 5MB)
			const maxSize = 5 * 1024 * 1024;
			if (screenshot.length > maxSize) {
				throw new Error(`Screenshot too large: ${screenshot.length} bytes (max: ${maxSize})`);
			}

			// Convert Buffer to ArrayBuffer if needed
			let arrayBuffer: ArrayBuffer;
			if (screenshot instanceof ArrayBuffer) {
				arrayBuffer = screenshot;
			} else if (screenshot.buffer instanceof ArrayBuffer) {
				arrayBuffer = screenshot.buffer.slice(
					screenshot.byteOffset,
					screenshot.byteOffset + screenshot.byteLength
				);
			} else {
				// Handle SharedArrayBuffer by copying to ArrayBuffer
				const sharedBuffer = screenshot.buffer;
				arrayBuffer = new ArrayBuffer(screenshot.byteLength);
				new Uint8Array(arrayBuffer).set(
					new Uint8Array(sharedBuffer, screenshot.byteOffset, screenshot.byteLength)
				);
			}

			return arrayBuffer;
		} finally {
			// Close the page but keep browser alive for reuse
			await page.close();
		}
	} catch (error) {
		console.error(`[Screenshot Error] Failed to capture ${url}:`, error);

		// Check if it's a rate limit error
		const errorMessage = error instanceof Error ? error.message : String(error);
		if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
			throw new Error('RATE_LIMITED: Browser API rate limit exceeded', { cause: error });
		}

		throw error;
	}
}
