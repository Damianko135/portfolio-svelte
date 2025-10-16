import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

interface Project {
	id: number;
	uuid: string;
	name: string;
	url: string;
}

// Cache browser instance to reuse sessions and avoid rate limits
let cachedBrowser: any = null;
let browserLastUsed = 0;
const BROWSER_REUSE_TIMEOUT = 50000; // Keep browser alive for 50 seconds

// Function to get or create a browser instance
async function getBrowser(browserBinding: Fetcher) {
	const puppeteer = await import('@cloudflare/puppeteer');
	const now = Date.now();
	
	// Reuse existing browser if it was used recently
	if (cachedBrowser && (now - browserLastUsed) < BROWSER_REUSE_TIMEOUT) {
		browserLastUsed = now;
		return cachedBrowser;
	}
	
	// Close old browser if it exists
	if (cachedBrowser) {
		try {
			await cachedBrowser.close();
		} catch (e) {
			// Browser already closed, ignore
		}
		cachedBrowser = null;
	}
	
	// Launch new browser with keep_alive to prevent early timeout
	cachedBrowser = await puppeteer.default.launch(browserBinding as any, {
		keep_alive: 60000 // Keep alive for 60 seconds
	});
	browserLastUsed = now;
	
	return cachedBrowser;
}

// Function to capture screenshot using Cloudflare Browser Rendering API with Puppeteer
async function captureScreenshot(url: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	try {
		const browser = await getBrowser(browserBinding);
		const page = await browser.newPage();

		try {
			// Set viewport size for consistent screenshots
			await page.setViewport({ width: 1280, height: 720 });

			// Navigate to the URL with timeout protection
			await page.goto(url, { 
				waitUntil: 'networkidle2',
				timeout: 30000 // 30 second timeout
			});

			// Wait a bit for any dynamic content to load
			await new Promise(resolve => setTimeout(resolve, 2000));

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
				arrayBuffer = screenshot.buffer.slice(screenshot.byteOffset, screenshot.byteOffset + screenshot.byteLength);
			} else {
				// Handle SharedArrayBuffer by copying to ArrayBuffer
				const sharedBuffer = screenshot.buffer;
				arrayBuffer = new ArrayBuffer(screenshot.byteLength);
				new Uint8Array(arrayBuffer).set(new Uint8Array(sharedBuffer, screenshot.byteOffset, screenshot.byteLength));
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
 * Takes a screenshot of the project with the given UUID
 */
export async function ensureScreenshotResponse(uuid: string, opts: EnsureOpts): Promise<Response> {
	// Find the project by UUID
	const project = projects.find((p) => p.uuid === uuid);

	if (!project) {
		return new Response('Project not found', { status: 404 });
	}

	const screenshotKey = `screenshots/${uuid}.png`;

	try {
		// Check if screenshot already exists in bucket (unless force is true)
		if (!opts.force) {
			try {
				const existingScreenshot = await opts.bucket.get(screenshotKey);
				if (existingScreenshot) {
					const headers = new Headers({
						'Content-Type': 'image/png',
						'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`,
						'ETag': existingScreenshot.etag || '',
						'Last-Modified': existingScreenshot.uploaded?.toUTCString() || ''
					});

					// Convert the readable stream to ArrayBuffer for Response
					const arrayBuffer = await existingScreenshot.arrayBuffer();
					return new Response(arrayBuffer, { headers });
				}
			} catch (r2Error) {
				console.warn(`[Screenshot] R2 read failed for ${uuid}, will generate new screenshot:`, r2Error);
				// Continue to try generating a new screenshot
			}
		}

		// Capture new screenshot
		const screenshotBuffer = await captureScreenshot(project.url, opts.browser);

		// Store screenshot in R2 bucket (but don't fail if this fails)
		try {
			await opts.bucket.put(screenshotKey, screenshotBuffer, {
				httpMetadata: {
					contentType: 'image/png',
					cacheControl: `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
				},
				customMetadata: {
					projectUuid: uuid,
					projectId: project.id.toString(),
					capturedAt: new Date().toISOString(),
					projectUrl: project.url
				}
			});
		} catch (uploadError) {
			console.warn(`[Screenshot] R2 upload failed for ${uuid}, screenshot will not be cached:`, uploadError);
			// Continue anyway - we can still return the screenshot
		}
		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`[Screenshot] Failed to generate screenshot for ${uuid} (${project?.name}):`, error);
		
		// Return a placeholder SVG instead of 500 error
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Unavailable
				</text>
				<text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
					${project?.name || 'Project'}
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
