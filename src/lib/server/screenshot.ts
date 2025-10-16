import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

interface Project {
	id: number;
	uuid: string;
	name: string;
	url: string;
}

// Function to capture screenshot using Cloudflare Browser Rendering API with Puppeteer
async function captureScreenshot(url: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	console.log(`Starting screenshot capture for: ${url}`);

	try {
		// Use Puppeteer with Cloudflare Browser Rendering API
		// This is the recommended approach and avoids filesystem operations
		const puppeteer = await import('@cloudflare/puppeteer');
		
		console.log('Connecting to browser via Cloudflare Browser Rendering API');
		const browser = await puppeteer.default.launch(browserBinding as any);
		console.log('Browser connected, creating new page');

		const page = await browser.newPage();
		console.log('Page created, setting viewport');

		try {
			// Set viewport size for consistent screenshots
			await page.setViewport({ width: 1280, height: 720 });
			console.log('Viewport set, navigating to URL');

			// Navigate to the URL with timeout protection
			await page.goto(url, { 
				waitUntil: 'networkidle2',
				timeout: 30000 // 30 second timeout
			});
			console.log('Navigation complete, waiting for content to load');

			// Wait a bit for any dynamic content to load
			await new Promise(resolve => setTimeout(resolve, 2000));
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

			console.log('Screenshot ready');
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
			try {
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
			} catch (r2Error) {
				console.error(`R2 bucket access error for ${uuid}:`, r2Error);
				// Continue to try generating a new screenshot
			}
		}

		// Capture new screenshot
		console.log(`Capturing screenshot for ${project.url}`);
		const screenshotBuffer = await captureScreenshot(project.url, opts.browser);

		// Store screenshot in R2 bucket (but don't fail if this fails)
		try {
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
		} catch (uploadError) {
			console.error(`Failed to upload screenshot to R2 for ${uuid}:`, uploadError);
			// Continue anyway - we can still return the screenshot
		}
		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`Screenshot error for ${uuid}:`, error);
		
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
