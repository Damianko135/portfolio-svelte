import { ensureScreenshotResponse } from '$lib/server/screenshot';

export const GET = async ({ params }: any) => {
	const { slug } = params;

	try {
		return await ensureScreenshotResponse(slug, {
			bucket: null // Mock bucket
		});
	} catch (error) {
		console.error(`Screenshot error for ${slug}:`, error);
		return new Response('Screenshot not available', { status: 500 });
	}
};
