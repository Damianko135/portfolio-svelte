// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { R2Bucket, Fetcher } from '@cloudflare/workers-types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				SCREENSHOTS?: R2Bucket;
				MYBROWSER?: Fetcher;
				RESEND_API_KEY?: string;
			};
		}
	}
}

export {};
