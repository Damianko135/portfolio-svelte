import { ensureScreenshotResponse } from '$lib/server/screenshot';
import type { RequestHandler } from './$types';
import projects from '$lib/data/projects.json';
import { dev } from '$app/environment';

// Disable prerendering for this API route
export const prerender = false;

export const GET: RequestHandler = async ({ params, platform, request }) => {
	const { slug } = params;

	// Validate that the project exists in our projects.json (slug is now a UUID)
	const validUuids = projects.map(p => p.uuid);
	
	if (!validUuids.includes(slug)) {
		return new Response('Invalid project UUID', { status: 400 });
	}

	// In development, return a placeholder response
	if (dev) {
		const project = projects.find(p => p.uuid === slug);
		console.log(`[DEV] Screenshot request for project ${project?.name} (${slug}) - returning placeholder`);
		
		// Return a simple SVG placeholder
		const placeholder = `
			<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
				<rect width="1280" height="720" fill="#1a1a1a"/>
				<text x="50%" y="50%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
					Screenshot Preview (Dev Mode)
				</text>
				<text x="50%" y="60%" font-family="Arial" font-size="20" fill="#888888" text-anchor="middle" dominant-baseline="middle">
					${project?.name || 'Project'}
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
			browser: browser,
			cacheSeconds: 30 * 24 * 60 * 60 // Cache for 30 days to reduce API calls
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		
		// If rate limited or error, return a cached placeholder
		const project = projects.find(p => p.uuid === slug);
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
				'Cache-Control': 'public, max-age=3600' // Cache placeholder for 1 hour
			}
		});
	}
};
