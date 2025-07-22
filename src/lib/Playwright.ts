import {firefox, launch } from '@cloudflare/playwright';
import fs from 'fs/promises';
import path from 'path';

export async function makeScreenshot(projectName: string) {
	// Fetch data from projects.json
	const jsonPath = path.resolve('static/projects.json');
	const json = await fs.readFile(jsonPath, 'utf-8');
	const projects = JSON.parse(json);
	const project = projects.find((p: { name: string }) => p.name === projectName);
	// Validate project existence and needed fields
	if (!project) {
		throw new Error(`Project "${projectName}" not found in projects.json`);
	}
	
	if (!project.url) {
		throw new Error(`Project "${projectName}" does not have a valid URL`);
	}
	// Create save location if not exists
	const outputDir = path.resolve('src/lib/screenshots');
	if (!outputDir) {
		await fs.mkdir(outputDir, { recursive: true });
	}

	// Generate a valid filename
	let base = '';
	if (project.name && typeof project.name === 'string') {
		base = project.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '_')
			.replace(/^_+|_+$/g, '') + '.png';
	} else {
		// Cannot generate filename from name, so return early
		console.error(`Cannot generate filename for project "${projectName}"`);
		return;
	}

	const screenshotPath = path.join(outputDir, base);
	// Check if screenshot already exists
	try {
		await fs.access(screenshotPath);
		console.log(`Screenshot for "${projectName}" already exists at ${screenshotPath}`);
		// Check meta data to see if it needs to be refreshed
		const stat = await fs.stat(screenshotPath);
		const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
		const now = Date.now();
		if (now - stat.mtimeMs < SEVEN_DAYS_MS) {
			console.log(`Screenshot for "${projectName}" is up-to-date.`);
			return; // Screenshot is fresh, no need to take a new one
		} else {
			console.log(`Screenshot for "${projectName}" is outdated, refreshing...`);
			generateScreenshot(project.url, screenshotPath);
		}
	} catch (err) {
		// File does not exist, proceed to take a screenshot
		console.log(`Taking screenshot for "${projectName}"...`);
		await generateScreenshot(project.url, screenshotPath);
		console.log(`Screenshot saved to ${screenshotPath}`);

	}


	
}
	
async function generateScreenshot(url: string, screenshotPath: string) {
    // Only pass the browser binding from your environment
    const browser = await firefox.launch(); // 1 second keep alive

    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'load' });
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to ${screenshotPath}`);
    } catch (err) {
        console.error(`Failed to take screenshot for ${url}:`, err);
    } finally {
        await page.close();
        await browser.close();
    }
}