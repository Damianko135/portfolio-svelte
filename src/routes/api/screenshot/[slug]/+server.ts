import { ensureScreenshotResponse } from '$lib/server/screenshot';
import type { RequestHandler } from './$types';
import projects from '$lib/data/projects.json';
import { dev } from '$app/environment';

// Disable prerendering for this API route
export const prerender = false;

export const GET: RequestHandler = async ({ params, platform, request }) => {
	const { slug } = params;

	// Validate that the project exists in our projects.json
	const validIds = projects.map(p => p.id);
	const projectId = parseInt(slug);
	
	if (isNaN(projectId) || !validIds.includes(projectId)) {
		return new Response('Invalid project ID', { status: 400 });
	}

	// In development, return a placeholder response
	if (dev) {
		console.log(`[DEV] Screenshot request for project ${slug} - returning placeholder`);
		
		// Return a simple SVG placeholder
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="50%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Preview (Dev Mode)
				</text>
				<text x="50%" y="60%" font-family="Arial" font-size="20" fill="#888888" text-anchor="middle" dominant-baseline="middle">
					Project ID: ${slug}
				</text>
			</svg>
		`.trim();
		
		return new Response(placeholder, {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'no-cache'
			}
		});
	}

	// Production: Use Cloudflare bindings
	const bucket = (platform as any)?.env?.SCREENSHOTS;
	const browser = (platform as any)?.env?.MYBROWSER;
	
	if (!bucket) {
		console.error('R2 bucket not available');
		return new Response('Storage not available', { status: 503 });
	}
	if (!browser) {
		console.error('Browser binding not available');
		return new Response('Browser not available', { status: 503 });
	}

	try {
		return await ensureScreenshotResponse(slug, {
			bucket: bucket,
			browser: browser
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		return new Response('Screenshot not available', { status: 500 });
	}
};
