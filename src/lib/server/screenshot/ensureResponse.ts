import projects from '$lib/data/projects.json';
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';
import { dev } from '$app/environment';
import type { Project } from '$lib/types/project';
import { getScreenshotObject, putScreenshotObject } from '../r2/cache';
import { buildScreenshotMetadata } from '../r2/metadata';
import { captureScreenshot } from '../browser/captureScreenshot';

export interface EnsureOpts {
	bucket: R2Bucket;
	browser: Fetcher;
	force?: boolean;
	versionTag?: string;
	cacheSeconds?: number;
}

const DEFAULT_CACHE_SECONDS = 7 * 24 * 60 * 60;

export async function ensureScreenshotResponse(
	projectUrl: string,
	urlBasedUuid: string,
	opts: EnsureOpts
): Promise<Response> {
	const screenshotKey = `screenshots/${urlBasedUuid}.png`;

	if (dev) {
		console.warn('\n🔍 [Screenshot Dev] ===================================');
		console.warn(` URL: ${projectUrl}`);
		console.warn(`🎯 URL-based UUID: ${urlBasedUuid}`);
		console.warn(`📁 Storage Key: ${screenshotKey}`);

		const sharingProjects = (projects as Project[]).filter((p) => p.url === projectUrl);
		if (sharingProjects.length > 1) {
			console.warn(`🔄 Deduplication: ${sharingProjects.length} projects share this URL:`);
			sharingProjects.forEach((p) => {
				console.warn(`   - ${p.name_key} (ID: ${p.url})`);
			});
		}
		console.warn('===================================================\n');
	}

	try {
		// Check existing screenshot in R2 (unless forced)
		if (!opts.force) {
			try {
				if (dev) console.warn(`💾 Checking R2 cache for: ${screenshotKey}`);
				const existing = await getScreenshotObject(opts.bucket, screenshotKey);
				if (existing) {
					const metadata = existing.customMetadata || {};
					const capturedAt = metadata['capturedAt'];

					const cacheSeconds = opts.cacheSeconds || DEFAULT_CACHE_SECONDS;
					const now = Date.now();
					const capturedDate = capturedAt ? new Date(capturedAt).getTime() : 0;
					const ageSeconds = (now - capturedDate) / 1000;
					const isExpired = ageSeconds > cacheSeconds;

					if (dev) {
						console.warn(`✅ Cache HIT! Found existing screenshot`);
						console.warn(`   Captured at: ${capturedAt || 'unknown'}`);
						console.warn(
							`   Age: ${Math.floor(ageSeconds / 86400)} days (${Math.floor(ageSeconds / 3600)} hours)`
						);
						console.warn(`   Max age: ${Math.floor(cacheSeconds / 86400)} days`);
						console.warn(
							`   Status: ${isExpired ? '⏰ STALE - will serve and regenerate in background' : '✅ VALID'}`
						);
						console.warn(`   Used by projects: ${metadata['usedByProjects'] || 'unknown'}`);
					}

					const arrayBuffer = await existing.arrayBuffer();

					if (isExpired) {
						if (dev)
							console.warn(`🔄 Serving stale screenshot while regenerating in background...`);

						(async () => {
							try {
								if (dev)
									console.warn(
										`🔄 [Background] Starting screenshot regeneration for ${projectUrl}`
									);
								const newScreenshot = await captureScreenshot(projectUrl, opts.browser);
								await putScreenshotObject(opts.bucket, screenshotKey, newScreenshot, {
									cacheSeconds: opts.cacheSeconds,
									customMetadata: buildScreenshotMetadata(urlBasedUuid, projectUrl)
								});
								if (dev)
									console.warn(`✅ [Background] Screenshot regenerated and uploaded successfully`);
							} catch (bgError) {
								console.warn(
									`⚠️  [Background] Failed to regenerate screenshot for ${projectUrl}:`,
									bgError
								);
							}
						})();

						const headers = new Headers({
							'Content-Type': 'image/png',
							'Cache-Control': 'public, max-age=60',
							ETag: existing.etag || '',
							'Last-Modified': existing.uploaded?.toUTCString() || '',
							'X-Cache-Status': 'STALE'
						});
						return new Response(arrayBuffer, { headers });
					} else {
						const headers = new Headers({
							'Content-Type': 'image/png',
							'Cache-Control': `public, max-age=${cacheSeconds}`,
							ETag: existing.etag || '',
							'Last-Modified': existing.uploaded?.toUTCString() || '',
							'X-Cache-Status': 'HIT'
						});
						return new Response(arrayBuffer, { headers });
					}
				} else {
					if (dev) console.warn(`❌ Cache MISS - will generate new screenshot`);
				}
			} catch (r2Error) {
				console.warn(
					`[Screenshot] R2 read failed for ${urlBasedUuid}, will generate new screenshot:`,
					r2Error
				);
			}
		} else {
			if (dev) console.warn(`🔄 Force refresh requested - will regenerate screenshot`);
		}

		if (dev) console.warn(`📸 Generating new screenshot...`);
		const screenshotBuffer = await captureScreenshot(projectUrl, opts.browser);
		if (dev)
			console.warn(`✅ Screenshot captured successfully (${screenshotBuffer.byteLength} bytes)`);

		try {
			if (dev) console.warn(`💾 Uploading to R2: ${screenshotKey}`);
			await putScreenshotObject(opts.bucket, screenshotKey, screenshotBuffer, {
				cacheSeconds: opts.cacheSeconds || DEFAULT_CACHE_SECONDS,
				customMetadata: buildScreenshotMetadata(urlBasedUuid, projectUrl)
			});
			if (dev) console.warn(`✅ Uploaded successfully to R2`);
		} catch (uploadError) {
			console.warn(
				`[Screenshot] R2 upload failed for ${urlBasedUuid}, screenshot will not be cached:`,
				uploadError
			);
		}

		const headers = new Headers({
			'Content-Type': 'image/png',
			'Cache-Control': `public, max-age=${opts.cacheSeconds || DEFAULT_CACHE_SECONDS}`,
			'X-Cache-Status': 'MISS'
		});

		return new Response(screenshotBuffer, { headers });
	} catch (error) {
		console.error(`[Screenshot] Failed to generate screenshot for URL ${projectUrl}:`, error);

		const placeholder = `
            <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
                <rect width="1280" height="720" fill="#1a1a1a"/>
                <text x="50%" y="45%" font-family="Arial" font-size="32" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
                    Screenshot Unavailable
                </text>
                <text x="50%" y="55%" font-family="Arial" font-size="18" fill="#888888" text-anchor="middle" dominant-baseline="middle">
                    Error generating screenshot
                </text>
            </svg>
        `.trim();

		return new Response(placeholder, {
			status: 200,
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	}
}
