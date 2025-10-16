import projectsData from '$lib/data/projects.json';

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

export const load = async ({ platform }: any) => {
	return {
		projects: projectsData.map((project) => ({
			...project,
			screenshot: `/api/screenshot/${project.id}`
		}))
	};
};
