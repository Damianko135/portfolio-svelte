import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:5173',
		headless: true,
		viewport: { width: 1280, height: 720 }
	},
	webServer: {
		command: 'pnpm dev',
		url: process.env.BASE_URL || 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 120_000
	}
});
