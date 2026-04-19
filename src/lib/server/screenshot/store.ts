import type { R2Bucket } from '@cloudflare/workers-types';
import { putScreenshotObject } from '../r2/cache';

const DEFAULT_CACHE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function store(bucket: R2Bucket, slug: string, buffer: ArrayBuffer): Promise<void> {
	const key = `screenshots/${slug}.png`;

	await putScreenshotObject(bucket, key, buffer, {
		cacheSeconds: DEFAULT_CACHE_SECONDS
	});
}
