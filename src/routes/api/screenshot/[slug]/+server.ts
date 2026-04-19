import { getCachedOrGenerate } from '$lib/server';
import type { RequestHandler } from './$types';
import projects from '$lib/data/projects.json';
import { dev } from '$app/environment';
import type { Project } from '$lib/types/project';

// Disable prerendering for this API route
export const prerender = false;

function createPlaceholderSvg(
	projectName: string,
	isDev: boolean = false,
	reason: 'missing-bindings' | 'error' = 'error'
): string {
	const title = reason === 'missing-bindings' ? 'Screenshot Preview' : 'Screenshot Unavailable';
	const subtitle = projectName;
	const devNote =
		isDev && reason === 'missing-bindings'
			? '<text x="50%" y="65%" font-family="Arial" font-size="14" fill="#666666" text-anchor="middle" dominant-baseline="middle">Run \'pnpm run preview\' to test with Cloudflare bindings</text>'
			: '';

	return `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
		<rect width="1280" height="720" fill="#1a1a1a"/>
		<text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
			${title}
		</text>
		<text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
			${subtitle}
		</text>
		${devNote}
	</svg>`;
}

export const GET: RequestHandler = async ({ params, platform, url }) => {
	const { slug } = params;

	// Get the project URL from query parameter
	const projectUrl = url.searchParams.get('url');

	if (!projectUrl) {
		return new Response('Missing URL parameter', { status: 400 });
	}

	// Validate URL format and protocol
	try {
		const urlObj = new URL(projectUrl);

		// Only allow http/https (prevents file://, javascript://, data:// mistakes)
		if (!['http:', 'https:'].includes(urlObj.protocol)) {
			return new Response('Invalid URL protocol', { status: 400 });
		}

		// Reject internal/localhost URLs (prevents deployment mistakes)
		const hostname = urlObj.hostname.toLowerCase();
		if (
			hostname === 'localhost' ||
			hostname.startsWith('127.') ||
			hostname.startsWith('0.') ||
			hostname === '::1'
		) {
			return new Response('Internal URLs not allowed', { status: 400 });
		}
	} catch (error) {
		return new Response('Invalid URL format', { status: 400 });
	}

	// Find the project by URL
	const matchingProject = (projects as Project[]).find((p) => p.url === projectUrl);

	if (!matchingProject) {
		return new Response('Invalid project URL', { status: 400 });
	}

	// Get Cloudflare bindings
	const bucket = platform?.env?.SCREENSHOTS;
	const browser = platform?.env?.MYBROWSER;

	// If bindings aren't available, return placeholder
	if (!bucket || !browser) {
		if (dev) {
			console.warn(
				`[DEV] Bindings unavailable for ${matchingProject.name_key} - returning placeholder`
			);
			console.warn(`[DEV] To test screenshots locally, run: pnpm run preview`);
		}

		return new Response(createPlaceholderSvg(matchingProject.name_key, dev, 'missing-bindings'), {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'no-cache'
			}
		});
	}

	try {
		return await getCachedOrGenerate(projectUrl, slug, {
			bucket,
			browser,
			cacheSeconds: 7 * 24 * 60 * 60 // Cache for 7 days
		});
	} catch (error) {
		console.error(`Screenshot error for project ${matchingProject.name_key}:`, error);

		return new Response(createPlaceholderSvg(matchingProject.name_key, false, 'error'), {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=3600' // Cache placeholder for 1 hour
			}
		});
	}
};
