import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import sgMail from '@sendgrid/mail';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const message = data.get('message') as string;

		// Basic validation
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
				error: 'Please enter a valid email address',
				name,
				email,
				message
			});
		}

		try {
			// Send email using SendGrid
			await sendEmail({ name, email, message });

			return {
				success: true,
				message: "Thank you for your message! I'll get back to you soon."
			};
		} catch (error) {
			console.error('Form submission error:', error);
			return fail(500, {
				error: 'Sorry, there was an error sending your message. Please try again.',
				name,
				email,
				message
			});
		}
	}
};

// SendGrid email function
async function sendEmail({
	name,
	email,
	message
}: {
	name: string;
	email: string;
	message: string;
}) {
	const apiKey = env.SENDGRID_API_KEY;

	if (!apiKey) {
		throw new Error('SendGrid API key not configured');
	}

	sgMail.setApiKey(apiKey);

	const msg = {
		to: 'damiankorver@gmail.com', // Your email address
		from: 'noreply@damiankorver.dev', // Must be a verified sender in SendGrid
		replyTo: email, // So you can reply directly to the person
		subject: `Portfolio Contact: Message from ${name}`,
		text: `
			New contact form submission from your portfolio:
			
			Name: ${name}
			Email: ${email}
			
			Message:
			${message}
		`,
	html: `
		<div class="portfolio-email">
			<h2>New Portfolio Contact</h2>
			<div class="portfolio-email-details">
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
			</div>
			<div class="portfolio-email-message">
				<h3>Message:</h3>
				<div>${message.replace(/\n/g, '<br>')}</div>
			</div>
			<div class="portfolio-email-footer">
				<p>This message was sent via your portfolio contact form.</p>
			</div>
		</div>
	`
	};

	await sgMail.send(msg);
}
