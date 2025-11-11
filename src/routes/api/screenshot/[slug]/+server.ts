import { ensureScreenshotResponse } from '$lib/server/screenshot';
import type { RequestHandler } from './$types';
import projects from '$lib/data/projects.json';
import { dev } from '$app/environment';
import type { Project } from '$lib/types/project';

// Disable prerendering for this API route
export const prerender = false;

export const GET: RequestHandler = async ({ params, platform, url }) => {
	const { slug } = params;

	// Get the project URL from query parameter (no rehashing needed!)
	const projectUrl = url.searchParams.get('url');

	if (dev) {
		console.warn(`[API] Received screenshot request for UUID: ${slug}`);
		console.warn(`[API] Project URL: ${projectUrl}`);
	}

	if (!projectUrl) {
		return new Response('Missing URL parameter', { status: 400 });
	}

	// Find the project by URL (simple lookup, no hashing)
	const matchingProject = (projects as Project[]).find((p) => p.url === projectUrl);

	if (!matchingProject) {
		return new Response('Invalid project URL', { status: 400 });
	}

	if (dev) {
		console.warn(`[API] Matched project: ${matchingProject.name_key}`);
	}

	// Get Cloudflare bindings (available in both dev with wrangler and production)
	const bucket = platform?.env?.SCREENSHOTS;
	const browser = platform?.env?.MYBROWSER;

	// If bindings aren't available (running with normal vite dev instead of wrangler), return placeholder
	if (!bucket || !browser) {
		if (dev) {
			console.warn(
				`[DEV] Bindings unavailable for ${matchingProject.name_key} (${slug}) - returning placeholder`
			);
			console.warn(`[DEV] To test screenshots locally, run: pnpm run preview`);
		}

		// Return a simple SVG placeholder
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Preview${dev ? ' (Dev Mode)' : ''}
				</text>
				<text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
					${matchingProject.name_key}
				</text>
				${dev ? `<text x="50%" y="65%" font-family="Arial" font-size="14" fill="#666666" text-anchor="middle" dominant-baseline="middle">Run 'pnpm run preview' to test with Cloudflare bindings</text>` : ''}
			</svg>
		`.trim();

		return new Response(placeholder, {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'no-cache'
			}
		});
	}

	try {
		return await ensureScreenshotResponse(matchingProject.url, slug, {
			bucket: bucket,
			browser: browser,
			cacheSeconds: 7 * 24 * 60 * 60 // Cache for 7 days to keep screenshots fresh
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);

		// If rate limited or error, return a cached placeholder
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Unavailable
			</text>
			<text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
				${matchingProject.name_key}
			</text>
		</svg>
	`.trim();
		return new Response(placeholder, {
			status: 200,
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=3600' // Cache placeholder for 1 hour
			}
		});
	}
};
