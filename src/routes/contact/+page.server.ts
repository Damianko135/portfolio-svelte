import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

export const actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const email = formData.get('email')?.toString();
		const message = formData.get('message')?.toString();

		// Validation
		if (!name || !email || !message) {
			return fail(400, {
				error: 'All fields are required',
				name,
				email,
				message
			});
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please provide a valid email address',
				name,
				email,
				message
			});
		}

		// Length validation
		if (name.length > 100) {
			return fail(400, {
				error: 'Name is too long (max 100 characters)',
				name,
				email,
				message
			});
		}

		if (message.length > 5000) {
			return fail(400, {
				error: 'Message is too long (max 5000 characters)',
				name,
				email,
				message
			});
		}

		if (message.length < 10) {
			return fail(400, {
				error: 'Message is too short (min 10 characters)',
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
					error: 'Email service not configured. Please try contacting via email directly.',
					name,
					email,
					message
				});
			}

			// Send email using Resend API
			const response = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${resendApiKey}`
				},
				body: JSON.stringify({
					from: 'Portfolio Contact Form <onboarding@resend.dev>', // You'll update this with your domain
					to: 'damiankorver@gmail.com', // Your email
					reply_to: email, // Visitor's email
					subject: `Portfolio Contact: ${name}`,
					html: `
						<h2>New Contact Form Submission</h2>
						<p><strong>From:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Message:</strong></p>
						<p>${message.replace(/\n/g, '<br>')}</p>
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

			if (!response.ok) {
				const errorData = await response.text();
				console.error('Resend API error:', errorData);
				return fail(500, {
					error: 'Failed to send email. Please try contacting via email directly.',
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
			console.error('Error sending email:', error);
			return fail(500, {
				error: 'An unexpected error occurred. Please try contacting via email directly.',
				name,
				email,
				message
			});
		}
	}
} satisfies Actions;
