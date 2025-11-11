import projectsData from '$lib/data/projects.json';
import { urlToUuid } from '$lib/server/uuid';
import type { Project } from '$lib/types/project';

export const load = async () => {
	// Generate URL-based UUIDs for all projects
	const projectsWithScreenshots = await Promise.all(
		(projectsData as Project[]).map(async (project) => {
			const urlBasedUuid = await urlToUuid(project.url);
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
