import { firefox } from 'playwright';
import type { Browser, Page, LaunchOptions } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import type { Project } from './types'; // { name: string; url: string; screenshot: string; ...? }

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface PreloadOptions {
	outDir?: string;
	concurrency?: number;
	viewport?: { width: number; height: number };
	timeoutMs?: number;
	fullPage?: boolean;
	browser?: Browser;
	launchOptions?: LaunchOptions;
}

export interface PreloadResult {
	project: Project;
	ok: boolean;
	screenshotPath?: string;
	error?: unknown;
}

/* ------------------------------------------------------------------ */
/* URL Validation & Filename Helpers                                  */
/* ------------------------------------------------------------------ */

function validateUrl(u: string): URL {
	let urlObj: URL;
	try {
		urlObj = new URL(u);
	} catch {
		throw new Error(`Invalid URL: ${u}`);
	}
	const prot = urlObj.protocol;
	if (prot !== 'http:' && prot !== 'https:') {
		throw new Error(`Unsupported protocol "${prot}" for URL: ${u}`);
	}
	return urlObj;
}

function safeScreenshotFilename(project: Project, urlObj: URL): string {
	let base = '';

	if (project.screenshot && typeof project.screenshot === 'string') {
		base = path.basename(project.screenshot);
		base = base.split('?')[0].split('#')[0]; // strip query/fragment
	}

	// If no valid screenshot filename, fallback to sanitized project.name
	if (!base || base === '.png') {
		if (project.name && typeof project.name === 'string') {
			base = project.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '_') // only alphanum & underscores
				.replace(/^_+|_+$/g, ''); // trim leading/trailing underscores
			if (!base) base = 'project'; // fallback name if empty
			base += '.png';
		} else {
			// fallback to URL hostname + path if no project.name
			const host = urlObj.hostname.replace(/[^a-z0-9.-]/gi, '_');
			const pth = urlObj.pathname.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
			base = `${host}${pth || '_'} .png`.replace(/\s+/g, '');
		}
	}

	return base;
}

async function dedupePath(p: string): Promise<string> {
	try {
		await fs.access(p);
		const ext = path.extname(p);
		const stem = p.slice(0, -ext.length);
		const stamp = new Date().toISOString().replace(/[:.]/g, '-');
		return `${stem}_${stamp}${ext}`;
	} catch {
		return p;
	}
}

/* ------------------------------------------------------------------ */
/* Concurrency Helper                                                 */
/* ------------------------------------------------------------------ */

async function mapWithConcurrency<T, R>(
	items: T[],
	limit: number,
	worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
	const results: R[] = new Array(items.length);
	let next = 0;

	const run = async () => {
		while (true) {
			const i = next++;
			if (i >= items.length) return;
			try {
				results[i] = await worker(items[i], i);
			} catch (err) {
				// @ts-expect-error
				results[i] = err;
			}
		}
	};

	const workers = new Array(Math.min(limit, items.length)).fill(null).map(run);
	await Promise.all(workers);
	return results;
}

/* ------------------------------------------------------------------ */
/* Core Screenshot Worker                                             */
/* ------------------------------------------------------------------ */

async function screenshotProject(
	project: Project,
	browser: Browser,
	outDir: string,
	viewport: { width: number; height: number },
	timeoutMs: number,
	fullPage: boolean
): Promise<PreloadResult> {
	let page: Page | null = null;
	try {
		const urlObj = validateUrl(project.url);

		// Create a new browser context with viewport
		const context = await browser.newContext({ viewport });
		page = await context.newPage();

		await page.goto(urlObj.href, {
			timeout: timeoutMs,
			waitUntil: 'networkidle'
		});

		const filename = safeScreenshotFilename(project, urlObj);
		const dest = await dedupePath(path.join(outDir, filename));
		await page.screenshot({ path: dest as `${string}.png`, fullPage });

		console.log(`✅ Preloaded: ${project.name} (${project.url}) -> ${dest}`);

		await context.close();
		return { project, ok: true, screenshotPath: dest };
	} catch (error) {
		console.error(`❌ Failed to preload ${project.name}:`, error);
		return { project, ok: false, error };
	} finally {
		if (page) {
			try {
				await page.close();
			} catch {
				/* ignore */
			}
		}
	}
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export async function preloadProjects(
	projects: Project[],
	opts: PreloadOptions = {}
): Promise<PreloadResult[]> {
	const {
		outDir = path.resolve('src/lib/screenshots'),
		concurrency = 4,
		viewport = { width: 1920, height: 1080 },
		timeoutMs = 30_000,
		fullPage = false,
		browser: externalBrowser,
		launchOptions
	} = opts;

	await fs.mkdir(outDir, { recursive: true });

	const localBrowser = externalBrowser
		? null
		: await firefox.launch({
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-gpu',
					'--disable-dev-shm-usage'
				],
				...launchOptions
			});

	const browser = externalBrowser ?? (localBrowser as Browser);

	try {
		const results = await mapWithConcurrency(projects, concurrency, (proj) =>
			screenshotProject(proj, browser, outDir, viewport, timeoutMs, fullPage)
		);
		return results;
	} catch (error) {
		console.error('❌ Error during preloading:', error);
		return projects.map((p) => ({ project: p, ok: false, error }));
	} finally {
		if (!externalBrowser && localBrowser) {
			await localBrowser.close();
		}
	}
}
