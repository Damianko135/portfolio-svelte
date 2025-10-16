import { ensureScreenshotResponse } from '$lib/server/screenshot';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, request }) => {
	const { slug } = params;

	// Basic validation - only allow requests for valid project IDs
	const validIds = [1, 2, 3]; // From projects.json
	if (!validIds.includes(parseInt(slug))) {
		return new Response('Invalid project ID', { status: 400 });
	}

	// Check for bucket access
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
};;
