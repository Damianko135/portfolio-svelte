import type { R2Bucket } from '@cloudflare/workers-types';
import { getScreenshotObject } from '../r2/cache';

export async function getCached(bucket: R2Bucket, slug: string): Promise<ArrayBuffer | null> {
	const key = `screenshots/${slug}.png`;
	const object = await getScreenshotObject(bucket, key);
	if (!object) return null;
	return object.arrayBuffer();
}
