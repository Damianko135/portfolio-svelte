import projects from '$lib/data/projects.json';
import type { Project } from '$lib/types/project';

export function buildScreenshotMetadata(urlBasedUuid: string, projectUrl: string) {
	return {
		urlBasedUuid,
		projectUrl,
		capturedAt: new Date().toISOString(),
		usedByProjects: (projects as Project[])
			.filter((p) => p.url === projectUrl)
			.map((p) => p.name_key)
			.join(', ')
	} as Record<string, string>;
}
