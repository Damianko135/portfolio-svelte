import { preloadProjects } from '$lib/Playwright';
import type { Project } from '$lib/types';
import path from 'path';
import fs from 'fs/promises';

export async function load() {
	// Read projects.json
	let projects: Project[];
	try {
		const jsonPath = path.resolve('static/projects.json');
		const json = await fs.readFile(jsonPath, 'utf-8');
		projects = JSON.parse(json);
	} catch (err) {
		console.error('Failed to load projects.json:', err);
		projects = []; // Or whatever fallback you want (empty array, null, default data)
	}

	// Check for missing screenshots (only one per project)
	const screenshotsDir = path.resolve('src/lib/screenshots');
	await fs.mkdir(screenshotsDir, { recursive: true });

	const missing: Project[] = [];
	const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
	const now = Date.now();
	for (const project of projects) {
		// Generate a single screenshot filename per project
		let base = '';
		if (project.name && typeof project.name === 'string') {
			base =
				project.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '_')
					.replace(/^_+|_+$/g, '') + '.png';
		} else {
			const urlObj = new URL(project.url);
			const host = urlObj.hostname.replace(/[^a-z0-9.-]/gi, '_');
			const pth = urlObj.pathname.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
			base = `${host}${pth || '_'}.png`;
		}
		const screenshotPath = path.join(screenshotsDir, base);
		let needsRefresh = false;
		try {
			const stat = await fs.stat(screenshotPath);

			if (now - stat.mtimeMs > SEVEN_DAYS_MS) {
				needsRefresh = true;
			}
		} catch {
			// File does not exist, needs to be created
			needsRefresh = true;
		}
		if (needsRefresh) {
			missing.push(project);
		}
	}

	// Preload missing screenshots (only one per project)
	if (missing.length > 0) {
		await preloadProjects(missing, { outDir: screenshotsDir });
	}

	return { projects };
}
