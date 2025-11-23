import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = process.env['BASE_URL'] || 'http://localhost:5173';

// Read projects.json via filesystem to avoid ESM json import assertion issues
const projectsFile = path.resolve(process.cwd(), 'src', 'lib', 'data', 'projects.json');
type MinimalProject = { url?: string };
const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf-8')) as MinimalProject[];

test('projects page lists projects from data file', async ({ page }) => {
	await page.goto(`${BASE}/projects`);

	await expect(page).toHaveURL(/\/projects/);

	const cards = page.locator('article');
	await expect(cards).toHaveCount(projects.length);

	// Ensure the first project's visit link points to the configured URL
	const firstProject = cards.nth(0);
	const firstUrl = projects[0]?.url;
	if (!firstUrl) throw new Error('First project has no url in projects.json');
	const visitLink = firstProject.locator(`a[href="${firstUrl}"]`);
	await expect(visitLink.first()).toBeVisible();
});
