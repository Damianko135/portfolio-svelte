import type { RequestHandler } from './$types';
import { ensureScreenshotResponse } from '$lib/server/screenshot';

export const GET: RequestHandler = async ({ params, url, platform }) => {
	if (!platform?.env) return new Response('Missing platform env', { status: 500 });

	const slug = params.slug;
	const force = url.searchParams.has('refresh');     // ?refresh=1 to bust
	const version = url.searchParams.get('v') ?? '';   // deploy-hash/PR-id etc.

	try {
		return await ensureScreenshotResponse(slug, {
			envBrowser: platform.env.MYBROWSER,   // Browser Rendering binding. :contentReference[oaicite:11]{index=11}
			bucket: platform.env.SCREENSHOTS,     // R2 bound bucket. :contentReference[oaicite:12]{index=12}
			force,
			versionTag: version,
			cacheSeconds: 60 * 60 * 24 * 7
		});
	} catch (err: any) {
		console.error(err);
		return new Response(err?.message ?? 'Screenshot failed', { status: 500 });
	}
};
