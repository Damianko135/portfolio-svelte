import projectsData from '$lib/data/projects.json';
import { urlToUuid } from '$lib/server/uuid';

export const load = async ({ platform }: any) => {
	// Generate URL-based UUIDs for all projects
	const projectsWithScreenshots = await Promise.all(
		projectsData.map(async (project) => {
			const urlBasedUuid = await urlToUuid(project.url);
			console.log(`[Page Load] ${project.name}: ${project.url} → ${urlBasedUuid}`);
			return {
				...project,
				screenshot: `/api/screenshot/${urlBasedUuid}?url=${encodeURIComponent(project.url)}`
			};
		})
	);

	return {
		projects: projectsWithScreenshots
	};
};
