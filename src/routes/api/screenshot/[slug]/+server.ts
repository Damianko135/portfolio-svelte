import { ensureScreenshotResponse } from '$lib/server/screenshot';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const { slug } = params;

	try {
		return await ensureScreenshotResponse(slug, {
			bucket: (platform as any)?.env?.SCREENSHOTS
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		return new Response('Screenshot not available', { status: 500 });
	}
};;
