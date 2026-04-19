import projectsData from '$lib/data/projects.json';
import type { Project } from '$lib/types/project';

export const load = () => {
	// Map projects with screenshot URLs using project id as cache key
	const projectsWithScreenshots = (projectsData as Project[]).map((project) => ({
		...project,
		screenshot: `/api/screenshot/${project.id}?url=${encodeURIComponent(project.url)}`
	}));

	return {
		projects: projectsWithScreenshots
	};
};
