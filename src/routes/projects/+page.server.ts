import { preloadProjects } from '$lib/Playwright';
import type { Project } from '$lib/types';
import path from 'path';
import fs from 'fs/promises';

import { error } from '@sveltejs/kit';

export async function load() {
	// Read projects.json
	let projects: Project[];
	try {
		const jsonPath = path.resolve('static/projects.json');
		const json = await fs.readFile(jsonPath, 'utf-8');
		projects = JSON.parse(json);
	} catch (err) {
		throw error(500, 'Failed to load projects.json');
	}

	// Check for missing screenshots
	const screenshotsDir = path.resolve('src/lib/screenshots');
	await fs.mkdir(screenshotsDir, { recursive: true });

	const missing = [];
	for (const project of projects) {
		// Assume screenshot filename logic is in Playwright.ts
		const urlObj = new URL(project.url);
		// Import the helper from Playwright if needed, or duplicate logic here
		let base = '';
		if (project.screenshot && typeof project.screenshot === 'string') {
			base = path.basename(project.screenshot).split('?')[0].split('#')[0];
		}
		if (!base || base === '.png') {
			if (project.name && typeof project.name === 'string') {
				base = project.name
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '_')
					.replace(/^_+|_+$/g, '');
				if (!base) base = 'project';
				base += '.png';
			} else {
				const host = urlObj.hostname.replace(/[^a-z0-9.-]/gi, '_');
				const pth = urlObj.pathname.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
				base = `${host}${pth || '_'} .png`.replace(/\s+/g, '');
			}
		}
		const screenshotPath = path.join(screenshotsDir, base);
		try {
			await fs.access(screenshotPath);
		} catch {
			missing.push(project);
		}
	}

	// Preload missing screenshots
	if (missing.length > 0) {
		await preloadProjects(missing, { outDir: screenshotsDir });
	}

	return { projects };
}
