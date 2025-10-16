import projectsData from '$lib/data/projects.json';
import { ensureScreenshotResponse } from '$lib/server/screenshot';

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

export const load = async ({ platform }: any) => {
	if (!platform?.env?.MYBROWSER || !platform?.env?.project_screenshots) {
		// Fallback without screenshots
		return {
			projects: projectsData.map(project => ({
				...project,
				screenshot: undefined
			}))
		};
	}

	const cache = (caches as any).default;
	const projects = await Promise.all(
		projectsData.map(async (project) => {
			const slug = slugify(project.name);
			const url = `/api/screenshot/${slug}`;
			try {
				// Check if already cached
				const cachedResponse = await cache.match(url);
				if (!cachedResponse) {
					// Generate and cache the screenshot
					const response = await ensureScreenshotResponse(slug, {
						envBrowser: platform.env.MYBROWSER,
						bucket: platform.env.project_screenshots
					});
					await cache.put(url, response.clone());
				}
				return {
					...project,
					screenshot: url
				};
			} catch (error) {
				console.error(`Failed to cache screenshot for ${project.name}:`, error);
				return {
					...project,
					screenshot: undefined
				};
			}
		})
	);

	return {
		projects
	};
};