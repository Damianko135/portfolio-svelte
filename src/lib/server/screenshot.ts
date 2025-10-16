import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

interface Project {
	id: number;
	uuid: string;
	name: string;
	url: string;
}

// Function to capture screenshot using Cloudflare Playwright
async function captureScreenshot(url: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	console.log(`Starting screenshot capture for: ${url}`);

	try {
		// Dynamic import to avoid loading at build time
		const playwright = await import('@cloudflare/playwright');
		
		console.log('Launching Firefox browser');
		const browser = await (playwright.default as any).launch(browserBinding);
		console.log('Browser launched, creating new page');

		const page = await browser.newPage();
		console.log('Page created, setting viewport');

		try {
			// Set viewport size for consistent screenshots
			await page.setViewportSize({ width: 1280, height: 720 });
			console.log('Viewport set, navigating to URL');

			// Navigate to the URL with timeout protection
			await page.goto(url, { 
				waitUntil: 'networkidle',
				timeout: 30000 // 30 second timeout
			});
			console.log('Navigation complete, waiting for content to load');

			// Wait a bit for any dynamic content to load
			await page.waitForTimeout(2000);
			console.log('Content loaded, taking screenshot');

			// Take screenshot with quality settings
			const screenshot = await page.screenshot({ 
				type: 'png',
				fullPage: false // Only capture viewport, not full page
			});
			console.log(`Screenshot taken, size: ${screenshot.length} bytes`);
			
			// Validate screenshot size (max 5MB)
			const maxSize = 5 * 1024 * 1024;
			if (screenshot.length > maxSize) {
				throw new Error(`Screenshot too large: ${screenshot.length} bytes (max: ${maxSize})`);
			}

			// Convert Buffer to ArrayBuffer
			const arrayBuffer = new ArrayBuffer(screenshot.length);
			const view = new Uint8Array(arrayBuffer);
			view.set(screenshot);

			console.log('Screenshot converted to ArrayBuffer');
			return arrayBuffer;
		} finally {
			console.log('Closing browser');
			await browser.close();
		}
	} catch (error) {
		console.error('Error in captureScreenshot:', error);
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
			console.log(`Checking for existing screenshot: ${screenshotKey}`);
			const existingScreenshot = await opts.bucket.get(screenshotKey);
			if (existingScreenshot) {
				console.log(`Found existing screenshot for ${uuid}`);
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
			console.log(`No existing screenshot found for ${uuid}, generating new one`);
		}

		// Capture new screenshot
		console.log(`Capturing screenshot for ${project.url}`);
		const screenshotBuffer = await captureScreenshot(project.url, opts.browser);

		// Store screenshot in R2 bucket
		console.log(`Uploading screenshot to R2: ${screenshotKey}`);
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
		console.log(`Successfully uploaded screenshot for ${uuid}`);

		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`Screenshot error for ${uuid}:`, error);
		return new Response('Screenshot failed', { status: 500 });
	}
}
