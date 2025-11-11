import type { Handle, HandleServerError, HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { dev } from '$app/environment';
import { error_unexpected } from '$lib/paraglide/messages/error_unexpected.js';

// Handle Paraglide i18n
const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

// Add security headers and performance optimizations
const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => {
			// Include custom headers in serialized responses
			return name.startsWith('x-') || name === 'cache-control';
		}
	});

	// Only modify headers if response is mutable
	if (response.headers.get('content-type')?.includes('text/html')) {
		// Security headers
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('X-Frame-Options', 'SAMEORIGIN');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

		// Performance headers
		if (!dev) {
			response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
		}
	}

	return response;
};

// Combine all handlers using sequence
export const handle: Handle = sequence(handleParaglide, handleSecurityHeaders);

// Handle server-side fetch requests
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	// Log API calls in development
	if (dev && !request.url.includes('/_app/')) {
		console.warn(`[Fetch] ${request.method} ${request.url}`);
	}

	// You could modify requests here, for example:
	// - Add authentication headers
	// - Proxy internal API calls
	// - Add custom headers for external APIs

	return fetch(request);
};

// Handle server errors
export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	// Generate a simple error ID using timestamp and random
	const errorId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

	// Get locale from cookie or default to 'nl'
	const localeCookie = event.cookies.get('PARAGLIDE_LOCALE');
	const locale = (localeCookie || 'nl') as 'en' | 'nl';

	// Log detailed error information
	console.error('Server error:', {
		errorId,
		status,
		message,
		url: event.url.pathname,
		method: event.request.method,
		...(dev && { error, stack: error instanceof Error ? error.stack : undefined })
	});

	// In production, you could send this to an error tracking service
	// Example with Sentry:
	// if (!dev) {
	//   Sentry.captureException(error, {
	//     extra: { event, errorId, status }
	//   });
	// }

	return {
		message: dev ? message : error_unexpected({}, { locale }),
		errorId
	};
};
