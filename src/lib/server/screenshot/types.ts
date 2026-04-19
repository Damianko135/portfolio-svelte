import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

export interface GetCachedOrGenerateOpts {
	bucket: R2Bucket;
	browser: Fetcher;
	cacheSeconds?: number;
}
