// Dynamic import for Cloudflare Playwright to avoid build issues
let firefox: any;

import projects from '$lib/data/projects.json';

interface Project {
	name: string;
	url: string;
}

// Function to capture screenshot using Cloudflare Playwright
async function captureScreenshot(url: string): Promise<ArrayBuffer> {
	// Lazy load firefox only when needed
	if (!firefox) {
		const playwright = await import('@cloudflare/playwright');
		firefox = playwright.firefox;
	}

	const browser = await firefox.launch();
	const page = await browser.newPage();

	try {
		// Set viewport size for consistent screenshots
		await page.setViewportSize({ width: 1280, height: 720 });

		// Navigate to the URL
		await page.goto(url, { waitUntil: 'networkidle' });

		// Wait a bit for any dynamic content to load
		await page.waitForTimeout(2000);

		// Take screenshot
		const screenshot = await page.screenshot({ type: 'png' });

		// Convert Buffer to ArrayBuffer
		const arrayBuffer = new ArrayBuffer(screenshot.length);
		const view = new Uint8Array(arrayBuffer);
		view.set(screenshot);
		return arrayBuffer;
	} finally {
		await browser.close();
	}
}

export interface EnsureOpts {
	bucket: any; // Mock bucket
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

	try {
		const screenshotBuffer = await captureScreenshot(project.url);

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
