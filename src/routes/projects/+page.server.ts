import projectsData from '$lib/data/projects.json';
import { ensureScreenshotResponse } from '$lib/server/screenshot';

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

export const load = async ({ platform }: any) => {
	// For now, just return projects without screenshots due to build issues
	return {
		projects: projectsData.map((project) => ({
			...project,
			screenshot: undefined
		}))
	};
};
