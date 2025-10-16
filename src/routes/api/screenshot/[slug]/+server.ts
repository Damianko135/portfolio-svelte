import { ensureScreenshotResponse } from '$lib/server/screenshot';

export const GET = async ({ params, platform }: any) => {
	if (!platform?.env?.MYBROWSER || !platform?.env?.project_screenshots) {
		throw new Error('Browser and R2 bucket bindings required');
	}

	const { slug } = params;

	try {
		return await ensureScreenshotResponse(slug, {
			envBrowser: platform.env.MYBROWSER,
			bucket: platform.env.project_screenshots
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		return new Response('Screenshot not available', { status: 500 });
	}
};