import type { HandleClientError } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as m from '$lib/paraglide/messages.js';

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	// Generate a simple error ID using timestamp and random
	const errorId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

	// Log to console in development
	if (dev) {
		console.error('Client error:', {
			errorId,
			status,
			message,
			error,
			url: event.url
		});
	}

	// In production, you could send this to an error tracking service like Sentry
	// Example:
	// if (!dev) {
	//   Sentry.captureException(error, {
	//     extra: { event, errorId, status }
	//   });
	// }

	return {
		message: status === 404 ? m.error_page_not_found({}) : m.error_something_went_wrong({}),
		errorId
	};
};
