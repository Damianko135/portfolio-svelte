import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event: Parameters<ServerLoad>[0]) => {
	// Fetch projects.json from static directory
	const response = await event.fetch('/projects.json');
	const projects = await response.json();

	// Trigger the POST request to preload projects, server-side only
	// const url = `${event.url.origin}/api/puppeteer`; // Full URL to API endpoint

	// event
	// 	.fetch(url, {
	// 		method: 'POST',
	// 		headers: {
	// 			Authorization: 'your-secret-token',
	// 			'Content-Type': 'application/json'
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error triggering POST request:', error);
	// 	});
	return { projects };
};
