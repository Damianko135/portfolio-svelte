import { getCached } from './getCached';
import { generate } from './generate';
import { store } from './store';
import type { GetCachedOrGenerateOpts } from './types';

const DEFAULT_CACHE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function getCachedOrGenerate(
	projectUrl: string,
	slug: string,
	opts: GetCachedOrGenerateOpts
): Promise<Response> {
	const cacheSeconds = opts.cacheSeconds ?? DEFAULT_CACHE_SECONDS;

	// 1. Try cache
	const cached = await getCached(opts.bucket, slug);
	if (cached) {
		return new Response(cached, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': `public, max-age=${cacheSeconds}`
			}
		});
	}

	// 2. Generate new
	const screenshot = await generate(projectUrl, opts.browser);

	// 3. Store to R2
	await store(opts.bucket, slug, screenshot);

	// 4. Return response
	return new Response(screenshot, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${cacheSeconds}`
		}
	});
}

// Re-export for direct access if needed
export { getCached, generate, store };
export type { GetCachedOrGenerateOpts };
