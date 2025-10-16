import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';
import playwright from '@cloudflare/playwright';

interface Project {
	name: string;
	url: string;
}

// Function to capture screenshot using Cloudflare Playwright
async function captureScreenshot(url: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	console.log(`Starting screenshot capture for: ${url}`);

	try {

		console.log('Launching Firefox browser');
		const browser = await (playwright as any).launch(browserBinding);
		console.log('Browser launched, creating new page');

		const page = await browser.newPage();
		console.log('Page created, setting viewport');

		try {
			// Set viewport size for consistent screenshots
			await page.setViewportSize({ width: 1280, height: 720 });
			console.log('Viewport set, navigating to URL');

			// Navigate to the URL
			await page.goto(url, { waitUntil: 'networkidle' });
			console.log('Navigation complete, waiting for content to load');

			// Wait a bit for any dynamic content to load
			await page.waitForTimeout(2000);
			console.log('Content loaded, taking screenshot');

			// Take screenshot
			const screenshot = await page.screenshot({ type: 'png' });
			console.log(`Screenshot taken, size: ${screenshot.length} bytes`);

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

/**
 * Takes a screenshot of the project with the given slug
 */
export async function ensureScreenshotResponse(slug: string, opts: EnsureOpts): Promise<Response> {
	// Find the project by slug (assuming slug is the project id)
	const project = projects.find((p) => p.id.toString() === slug);

	if (!project) {
		return new Response('Project not found', { status: 404 });
	}

	const screenshotKey = `screenshots/${slug}.png`;

	try {
		// Check if screenshot already exists in bucket (unless force is true)
		if (!opts.force) {
			console.log(`Checking for existing screenshot: ${screenshotKey}`);
			const existingScreenshot = await opts.bucket.get(screenshotKey);
			if (existingScreenshot) {
				console.log(`Found existing screenshot for ${slug}`);
				const headers = new Headers({
					'Content-Type': 'image/png',
					'Cache-Control': `public, max-age=${opts.cacheSeconds || 3600}`,
					'ETag': existingScreenshot.etag || '',
					'Last-Modified': existingScreenshot.uploaded?.toUTCString() || ''
				});

				// Convert the readable stream to ArrayBuffer for Response
				const arrayBuffer = await existingScreenshot.arrayBuffer();
				return new Response(arrayBuffer, { headers });
			}
			console.log(`No existing screenshot found for ${slug}, generating new one`);
		}

		// Capture new screenshot
		console.log(`Capturing screenshot for ${project.url}`);
		const screenshotBuffer = await captureScreenshot(project.url, opts.browser);

		// Store screenshot in R2 bucket
		console.log(`Uploading screenshot to R2: ${screenshotKey}`);
		await opts.bucket.put(screenshotKey, screenshotBuffer, {
			httpMetadata: {
				contentType: 'image/png',
				cacheControl: `public, max-age=${opts.cacheSeconds || 3600}`
			}
		});
		console.log(`Successfully uploaded screenshot for ${slug}`);

		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || 3600}`
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		return new Response('Screenshot failed', { status: 500 });
	}
}
