import type { R2Bucket } from '@cloudflare/workers-types';

export async function getScreenshotObject(bucket: R2Bucket, key: string) {
	const obj = await bucket.get(key);
	return obj || null;
}

export async function putScreenshotObject(
	bucket: R2Bucket,
	key: string,
	buffer: string | ArrayBuffer | Blob | ArrayBufferView | ReadableStream<unknown> | null,
	opts: { cacheSeconds?: number; customMetadata?: Record<string, string> }
) {
	const cacheSeconds = opts.cacheSeconds ?? 7 * 24 * 60 * 60;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- R2/DOM ReadableStream typing mismatch; intentional cast for Cloudflare R2 interop
	await bucket.put(key, buffer as any, {
		httpMetadata: {
			contentType: 'image/png',
			cacheControl: `public, max-age=${cacheSeconds}`
		},
		customMetadata: opts.customMetadata || {}
	});
}
