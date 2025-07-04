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
				message: 'Thank you for your message! I\'ll get back to you soon.'
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
async function sendEmail({ name, email, message }: { name: string; email: string; message: string }) {
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
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #333; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">
					New Portfolio Contact
				</h2>
				
				<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
					<p><strong>Name:</strong> ${name}</p>
					<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
				</div>
				
				<div style="margin: 20px 0;">
					<h3 style="color: #333;">Message:</h3>
					<div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #8B5CF6; border-radius: 4px;">
						${message.replace(/\n/g, '<br>')}
					</div>
				</div>
				
				<div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 4px; text-align: center;">
					<p style="margin: 0; color: #666; font-size: 14px;">
						This message was sent via your portfolio contact form.
					</p>
				</div>
			</div>
		`
	};

	await sgMail.send(msg);
}
