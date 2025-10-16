import projects from '$lib/data/projects.json';

interface Project { name: string; url: string; }

// Mock screenshot function that doesn't actually take screenshots
async function captureScreenshot(): Promise<ArrayBuffer> {
	// Return an empty ArrayBuffer for now
	return new ArrayBuffer(0);
}

export interface EnsureOpts {
	bucket: any; // Mock bucket
	force?: boolean;
	versionTag?: string;
	cacheSeconds?: number;
}

/**
 * Mock screenshot function that doesn't actually work
 */
export async function ensureScreenshotResponse(slug: string, opts: EnsureOpts): Promise<Response> {
	// Return a mock response
	const headers = new Headers({
		'Content-Type': 'image/png',
		'Cache-Control': `public, max-age=3600`,
	});

	return new Response(new ArrayBuffer(0), { headers });
}
