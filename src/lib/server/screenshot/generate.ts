import type { Fetcher } from '@cloudflare/workers-types';
import { captureScreenshot } from '../browser/captureScreenshot';

export async function generate(projectUrl: string, browserBinding: Fetcher): Promise<ArrayBuffer> {
	return captureScreenshot(projectUrl, browserBinding);
}
