import { type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Rate limiting configuration
interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// In-memory rate limiting store (for Cloudflare Workers, use KV or Durable Objects in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 30; // Max requests per window
const RATE_LIMIT_API_MAX_REQUESTS = 10; // Stricter limit for API endpoints

// Cleanup old rate limit entries every 5 minutes
if (!dev) {
	setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of rateLimitStore.entries()) {
			if (entry.resetTime < now) {
				rateLimitStore.delete(key);
			}
		}
	}, 5 * 60 * 1000);
}

/**
 * Get client identifier (IP address or fallback)
 */
function getClientIdentifier(request: Request): string {
	// Try to get real IP from Cloudflare headers
	const cfConnectingIp = request.headers.get('cf-connecting-ip');
	if (cfConnectingIp) return cfConnectingIp;

	// Fallback to x-forwarded-for
	const xForwardedFor = request.headers.get('x-forwarded-for');
	if (xForwardedFor) return xForwardedFor.split(',')[0].trim();

	// Fallback to x-real-ip
	const xRealIp = request.headers.get('x-real-ip');
	if (xRealIp) return xRealIp;

	// Last resort fallback
	return 'unknown';
}

/**
 * Check if request exceeds rate limit
 */
function checkRateLimit(clientId: string, maxRequests: number): boolean {
	const now = Date.now();
	const entry = rateLimitStore.get(clientId);

	if (!entry || entry.resetTime < now) {
		// Create new entry
		rateLimitStore.set(clientId, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW
		});
		return false; // Not rate limited
	}

	if (entry.count >= maxRequests) {
		return true; // Rate limited
	}

	// Increment count
	entry.count++;
	return false;
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(headers: Headers): void {
	// Content Security Policy
	headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Svelte/Vite
			"style-src 'self' 'unsafe-inline'", // Needed for Tailwind
			"img-src 'self' data: https:",
			"font-src 'self' data:",
			"connect-src 'self' https://api.iconify.design",
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'"
		].join('; ')
	);

	// Security headers
	headers.set('X-Frame-Options', 'DENY');
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	headers.set('X-XSS-Protection', '1; mode=block');

	// HSTS (only in production)
	if (!dev) {
		headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	}
}

/**
 * Validate API request
 */
function validateApiRequest(url: URL, request: Request): Response | null {
	// Check for required headers on POST/PUT/DELETE requests
	if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
		const contentType = request.headers.get('content-type');
		if (!contentType) {
			return new Response('Content-Type header required', { status: 400 });
		}
	}

	// Block requests with suspicious user agents
	const userAgent = request.headers.get('user-agent') || '';
	const suspiciousPatterns = [
		/bot/i,
		/crawler/i,
		/spider/i,
		/scraper/i,
		// Allow legitimate bots
		/(?!googlebot|bingbot)/i
	];

	// Only block on screenshot API to prevent abuse
	if (url.pathname.includes('/api/screenshot/')) {
		for (const pattern of suspiciousPatterns) {
			if (pattern.test(userAgent) && !/(googlebot|bingbot)/i.test(userAgent)) {
				console.warn(`Blocked suspicious user agent: ${userAgent}`);
				return new Response('Forbidden', { status: 403 });
			}
		}
	}

	return null;
}

/**
 * Main hook handler
 */
export const handle: Handle = async ({ event, resolve }) => {
	const { request, url } = event;
	const clientId = getClientIdentifier(request);

	// Skip rate limiting and some checks in development
	if (!dev) {
		// Rate limiting - stricter for API endpoints
		const isApiEndpoint = url.pathname.startsWith('/api/');
		const maxRequests = isApiEndpoint ? RATE_LIMIT_API_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS;

		if (checkRateLimit(clientId, maxRequests)) {
			console.warn(`Rate limit exceeded for ${clientId} on ${url.pathname}`);
			return new Response('Too Many Requests', {
				status: 429,
				headers: {
					'Retry-After': '60',
					'Content-Type': 'text/plain'
				}
			});
		}

		// Validate API requests
		if (isApiEndpoint) {
			const validationError = validateApiRequest(url, request);
			if (validationError) {
				return validationError;
			}
		}
	}

	// Log requests in development
	if (dev) {
		console.log(`${request.method} ${url.pathname}`);
	}

	// Resolve the request
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => {
			// Allow these headers to be serialized
			return name === 'content-type' || name === 'cache-control';
		}
	});

	// Apply security headers
	const headers = new Headers(response.headers);
	applySecurityHeaders(headers);

	// Return response with security headers
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
