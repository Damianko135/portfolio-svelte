import projectsData from '$lib/data/projects.json';

export const load = async ({ platform }: any) => {
	return {
		projects: projectsData.map((project) => ({
			...project,
			screenshot: `/api/screenshot/${project.id}`
		}))
	};
};
