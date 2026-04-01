import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const RESEND_TIMEOUT_MS = 10_000;

function asSafeTrimmedString(value: { toString(): string } | null): string {
	return value?.toString().trim() ?? '';
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

export const actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();
		const name = asSafeTrimmedString(formData.get('name'));
		const email = asSafeTrimmedString(formData.get('email'));
		const message = asSafeTrimmedString(formData.get('message'));

		// Validation
		if (name.length === 0 || email.length === 0 || message.length === 0) {
			return fail(400, {
				error: 'Please fill in your name, email, and message before sending.',
				name,
				email,
				message
			});
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Enter a valid email address, for example: name@example.com.',
				name,
				email,
				message
			});
		}

		// Length validation
		if (name.length > 100) {
			return fail(400, {
				error: 'Your name is too long. Please keep it under 100 characters.',
				name,
				email,
				message
			});
		}

		if (message.length > 5000) {
			return fail(400, {
				error: 'Your message is too long. Please keep it under 5000 characters.',
				name,
				email,
				message
			});
		}

		if (message.length < 10) {
			return fail(400, {
				error: 'Your message is too short. Please add at least 10 characters.',
				name,
				email,
				message
			});
		}

		try {
			// Get Resend API key from environment
			// In development: uses RESEND_API_KEY from .env via $env/dynamic/private
			// In production (Cloudflare): uses platform.env.RESEND_API_KEY
			const resendApiKey = platform?.env?.RESEND_API_KEY || env['RESEND_API_KEY'];

			if (!resendApiKey) {
				console.error('RESEND_API_KEY not configured');
				return fail(500, {
					error:
						'The contact form is temporarily unavailable. Please email me directly at damiankorver@gmail.com.',
					name,
					email,
					message
				});
			}

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

			// Send email using Resend API
			const safeName = escapeHtml(name);
			const safeEmail = escapeHtml(email);
			const safeMessage = escapeHtml(message);

			const response = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${resendApiKey}`
				},
				signal: controller.signal,
				body: JSON.stringify({
					from: 'Portfolio Contact Form <onboarding@resend.dev>', // You'll update this with your domain
					to: 'damiankorver@gmail.com', // Your email
					reply_to: email, // Visitor's email
					subject: `Portfolio Contact: ${name}`,
					html: `
						<h2>New Contact Form Submission</h2>
						<p><strong>From:</strong> ${safeName}</p>
						<p><strong>Email:</strong> ${safeEmail}</p>
						<p><strong>Message:</strong></p>
						<p>${safeMessage.replace(/\n/g, '<br>')}</p>
					`,
					text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}
					`
				})
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.text();
				console.error('Resend API error:', errorData);

				if (response.status === 429) {
					return fail(429, {
						error:
							'Too many messages were sent in a short time. Please wait a minute and try again.',
						name,
						email,
						message
					});
				}

				if (response.status === 400) {
					return fail(400, {
						error:
							'Your message could not be sent because some details were invalid. Please review the form and try again.',
						name,
						email,
						message
					});
				}

				return fail(500, {
					error:
						'We could not send your message right now. Please try again, or email me directly at damiankorver@gmail.com.',
					name,
					email,
					message
				});
			}

			await response.json(); // Email sent successfully

			return {
				success: true,
				message: "Thanks for reaching out! I'll get back to you soon."
			};
		} catch (error) {
			if ((error as Error).name === 'AbortError') {
				return fail(504, {
					error:
						'Sending took too long and timed out. Please try again in a moment, or email me directly.',
					name,
					email,
					message
				});
			}

			console.error('Error sending email:', error);
			return fail(500, {
				error:
					'An unexpected error occurred while sending your message. Please try again, or email me directly at damiankorver@gmail.com.',
				name,
				email,
				message
			});
		}
	}
} satisfies Actions;
