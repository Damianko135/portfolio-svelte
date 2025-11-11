import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';
import { dev } from '$app/environment';
import type { Browser, BrowserWorker } from '@cloudflare/puppeteer';
import type { Project } from '$lib/types/project';

// Cache browser instance to reuse sessions and avoid rate limits
let cachedBrowser: Browser | null = null;
let browserLastUsed = 0;
const BROWSER_REUSE_TIMEOUT = 50000; // Keep browser alive for 50 seconds

// Function to get or create a browser instance
async function getBrowser(browserBinding: Fetcher) {
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

// Function to handle cookie banners by clicking deny/reject buttons
async function handleCookieBanner(page: Awaited<ReturnType<Browser['newPage']>>) {
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

// Function to capture screenshot using Cloudflare Browser Rendering API with Puppeteer
async function captureScreenshot(url: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	try {
		const browser = await getBrowser(browserBinding);
		const page = await browser.newPage();

		try {
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
			throw new Error('RATE_LIMITED: Browser API rate limit exceeded');
		}

		throw error;
	}
}

export interface EnsureOpts {
	bucket: R2Bucket;
	browser: Fetcher;
	force?: boolean;
	versionTag?: string;
	cacheSeconds?: number;
}

// Default cache duration: 7 days
const DEFAULT_CACHE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Takes a screenshot of the given URL
 * Uses URL-based UUID for storage to deduplicate identical URLs
 */
export async function ensureScreenshotResponse(
	projectUrl: string,
	urlBasedUuid: string,
	opts: EnsureOpts
): Promise<Response> {
	const screenshotKey = `screenshots/${urlBasedUuid}.png`;

	if (dev) {
		console.warn('\n🔍 [Screenshot Dev] ===================================');
		console.warn(` URL: ${projectUrl}`);
		console.warn(`🎯 URL-based UUID: ${urlBasedUuid}`);
		console.warn(`📁 Storage Key: ${screenshotKey}`);

		// Check if other projects share this URL
		const sharingProjects = (projects as Project[]).filter((p) => p.url === projectUrl);
		if (sharingProjects.length > 1) {
			console.warn(`🔄 Deduplication: ${sharingProjects.length} projects share this URL:`);
			sharingProjects.forEach((p) => {
				console.warn(`   - ${p.name_key} (ID: ${p.url})`);
			});
		}
		console.warn('===================================================\n');
	}

	try {
		// Check if screenshot already exists in bucket (unless force is true)
		if (!opts.force) {
			try {
				if (dev) console.warn(`💾 Checking R2 cache for: ${screenshotKey}`);
				const existingScreenshot = await opts.bucket.get(screenshotKey);
				if (existingScreenshot) {
					if (dev) {
						const metadata = existingScreenshot.customMetadata || {};
						console.warn(`✅ Cache HIT! Found existing screenshot`);
						console.warn(`   Captured at: ${metadata['capturedAt'] || 'unknown'}`);
						console.warn(`   Used by projects: ${metadata['usedByProjects'] || 'unknown'}`);
					}

					const headers = new Headers({
						'Content-Type': 'image/png',
						'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`,
						ETag: existingScreenshot.etag || '',
						'Last-Modified': existingScreenshot.uploaded?.toUTCString() || ''
					});

					// Convert the readable stream to ArrayBuffer for Response
					const arrayBuffer = await existingScreenshot.arrayBuffer();
					return new Response(arrayBuffer, { headers });
				} else {
					if (dev) console.warn(`❌ Cache MISS - will generate new screenshot`);
				}
			} catch (r2Error) {
				console.warn(
					`[Screenshot] R2 read failed for ${urlBasedUuid}, will generate new screenshot:`,
					r2Error
				);
				// Continue to try generating a new screenshot
			}
		} else {
			if (dev) console.warn(`🔄 Force refresh requested - will regenerate screenshot`);
		}

		// Capture new screenshot
		if (dev) console.warn(`📸 Generating new screenshot...`);
		const screenshotBuffer = await captureScreenshot(projectUrl, opts.browser);
		if (dev)
			console.warn(`✅ Screenshot captured successfully (${screenshotBuffer.byteLength} bytes)`);

		// Store screenshot in R2 bucket (but don't fail if this fails)
		try {
			if (dev) console.warn(`💾 Uploading to R2: ${screenshotKey}`);
			await opts.bucket.put(screenshotKey, screenshotBuffer, {
				httpMetadata: {
					contentType: 'image/png',
					cacheControl: `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
				},
				customMetadata: {
					urlBasedUuid: urlBasedUuid,
					projectUrl: projectUrl,
					capturedAt: new Date().toISOString(),
					// Store all project names that use this URL (for tracking)
					usedByProjects: (projects as Project[])
						.filter((p) => p.url === projectUrl)
						.map((p) => p.name_key)
						.join(', ')
				}
			});
			if (dev) console.warn(`✅ Uploaded successfully to R2`);
		} catch (uploadError) {
			console.warn(
				`[Screenshot] R2 upload failed for ${urlBasedUuid}, screenshot will not be cached:`,
				uploadError
			);
			// Continue anyway - we can still return the screenshot
		}
		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`[Screenshot] Failed to generate screenshot for URL ${projectUrl}:`, error);

		// Return a placeholder SVG instead of 500 error
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Unavailable
				</text>
				<text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
					Error generating screenshot
				</text>
			</svg>
		`.trim();

		return new Response(placeholder, {
			status: 200,
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour only
			}
		});
	}
}
