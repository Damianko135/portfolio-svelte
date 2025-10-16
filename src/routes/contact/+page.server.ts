// // TODO: Fix smtp server configuration
// import { error } from '@sveltejs/kit';
// import type { Actions } from './$types';
// import { sendEmail } from '$lib/email';
// export const actions: Actions = {
//     default: async ({ request }) => {
//         const formData = await request.formData();
//         const name = formData.get('name') as string;
//         const email = formData.get('email') as string;
//         const message = formData.get('message') as string;

//         if (!name || !email || !message) {
//             return { success: false, error: 'All fields are required.' };
//         }

//         try {
//             await sendEmail({ name, email, message });
//             return { success: true };
//         } catch (err) {
//             console.error('Email sending failed:', err);
//             throw error(500, 'Failed to send email. Please try again later.');
//         }
//     }
// };
