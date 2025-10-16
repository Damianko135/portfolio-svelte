import { launch, type BrowserWorker } from '@cloudflare/playwright';
import type { R2Bucket } from '@cloudflare/workers-types';
import projects from '$lib/data/projects.json';

interface Project { name: string; url: string; }

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

function getProjectBySlug(slug: string): Project {
	const proj = (projects as Project[]).find((p) => slugify(p.name) === slug);
	if (!proj) throw new Error(`Unknown project slug: ${slug}`);
	return proj;
}

// Capture new screenshot bytes (ArrayBuffer)
async function captureScreenshot(envBrowser: BrowserWorker, url: string): Promise<ArrayBuffer> {
	const browser = await launch(envBrowser); // Cloudflare binding required. :contentReference[oaicite:7]{index=7}
	const page = await browser.newPage();
	try {
		await page.goto(url, { waitUntil: 'load' });
		const buffer = await page.screenshot({ fullPage: true });
		return buffer as any as ArrayBuffer;
	} finally {
		await page.close();
		await browser.close();
	}
}

export interface EnsureOpts {
	envBrowser: BrowserWorker;
	bucket: R2Bucket;
	force?: boolean;        // bypass cache & re-shoot
	versionTag?: string;    // change key to auto-bust cache on deploy/content change
	cacheSeconds?: number;  // edge + browser TTL (default 604800 = 7d)
}

/**
 * Ensure a screenshot exists in R2 (optionally force refresh) and return a Response
 * with cache headers appropriate for CDN caching.
 */
export async function ensureScreenshotResponse(slug: string, opts: EnsureOpts): Promise<Response> {
	const {
		envBrowser,
		bucket,
		force = false,
		versionTag = '',
		cacheSeconds = 60 * 60 * 24 * 7 // 7 days
	} = opts;

	const project = getProjectBySlug(slug);
	const baseKey = `${slugify(project.name)}.png`;
	const key = versionTag ? `${versionTag}/${baseKey}` : baseKey;

	let body: ArrayBuffer | null = null;

	// If not forcing, try bucket first
	if (!force) {
		const obj = await bucket.get(key);
		if (obj) {
			body = await obj.arrayBuffer();
		}
	}

	// Need to capture
	if (force || body == null) {
		body = await captureScreenshot(envBrowser, project.url);
		await bucket.put(key, body, { httpMetadata: { contentType: 'image/png' } }); // persist globally. :contentReference[oaicite:8]{index=8}
	}

	// Build cache headers. Cloudflare honors origin cache headers unless overridden. :contentReference[oaicite:9]{index=9}
	const headers = new Headers({
		'Content-Type': 'image/png',
		'Cache-Control': `public, max-age=${cacheSeconds}, stale-while-revalidate=86400`,
		// Optionally control Cloudflare edge separately:
		'Cloudflare-CDN-Cache-Control': `max-age=${cacheSeconds}` // explicit edge TTL. :contentReference[oaicite:10]{index=10}
	});

	return new Response(body, { headers });
}
