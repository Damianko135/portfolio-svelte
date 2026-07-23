#!/usr/bin/env tsx

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';
import { cwd } from 'process';

// Use current working directory as project root
const projectRoot = cwd();

interface InlangSettings {
	$schema: string;
	modules: string[];
	'plugin.inlang.messageFormat': {
		pathPattern: string;
	};
	baseLocale: string;
	locales: string[];
}

/**
 * Discover available locales from the messages directory
 */
async function discoverLocales(): Promise<string[]> {
	const messagesDir = join(projectRoot, 'messages');

	try {
		const files = await readdir(messagesDir);
		const locales = files
			.filter((file) => file.endsWith('.json'))
			.map((file) => file.replace('.json', ''))
			.sort();

		console.warn(`📍 Found ${locales.length} locales: ${locales.join(', ')}`);
		return locales;
	} catch (error) {
		console.error('❌ Error reading messages directory:', error);
		throw error;
	}
}

/**
 * Update the inlang settings with discovered locales
 */
async function updateInlangSettings(locales: string[]): Promise<void> {
	const settingsPath = join(projectRoot, 'project.inlang', 'settings.json');

	try {
		const settingsContent = await readFile(settingsPath, 'utf-8');
		const settings: InlangSettings = JSON.parse(settingsContent);

		// Determine base locale (default to first locale if not set)
		const newBaseLocale = settings.baseLocale || locales[0];

		// Validate base locale exists in discovered locales
		if (!locales.includes(newBaseLocale)) {
			console.warn(
				`⚠️  Base locale '${newBaseLocale}' not found in available locales. Using '${locales[0]}' instead.`
			);
		}

		const finalBaseLocale = locales.includes(newBaseLocale) ? newBaseLocale : locales[0];

		// Update settings
		settings.locales = locales;
		settings.baseLocale = finalBaseLocale;

		// Write updated settings
		const updatedContent = JSON.stringify(settings, null, '\t') + '\n';
		await writeFile(settingsPath, updatedContent, 'utf-8');

		console.warn(`✅ Updated inlang settings:`);
		console.warn(`   Base locale: ${finalBaseLocale}`);
		console.warn(`   Available locales: ${locales.join(', ')}`);
	} catch (error) {
		console.error('❌ Error updating inlang settings:', error);
		throw error;
	}
}

/**
 * Compile paraglide messages
 */
async function compileParaglide(): Promise<void> {
	const compileCommand =
		'npx paraglide-js compile --project ./project.inlang --outdir ./src/lib/paraglide';

	console.warn(`🔄 Running: ${compileCommand}`);

	try {
		const output = execSync(compileCommand, {
			cwd: projectRoot,
			encoding: 'utf-8',
			stdio: 'pipe'
		});

		console.warn('✅ Paraglide compilation completed successfully');
		if (output.trim()) {
			console.warn('📄 Output:', output.trim());
		}
	} catch (error: unknown) {
		const execError = error as { message?: string; stdout?: string; stderr?: string };
		console.error('❌ Error compiling paraglide:', execError.message);
		if (execError.stdout) {
			console.error('📄 Stdout:', execError.stdout);
		}
		if (execError.stderr) {
			console.error('📄 Stderr:', execError.stderr);
		}
		throw error;
	}
}

/**
 * Validate message files have consistent structure
 */
async function validateMessages(locales: string[]): Promise<void> {
	console.warn('🔍 Validating message file consistency...');

	const messageKeys: Record<string, string[]> = {};

	for (const locale of locales) {
		const messagePath = join(projectRoot, 'messages', `${locale}.json`);
		try {
			const content = await readFile(messagePath, 'utf-8');
			const messages = JSON.parse(content);
			messageKeys[locale] = Object.keys(messages).sort();
		} catch (error) {
			console.error(`❌ Error reading messages for locale '${locale}':`, error);
			throw error;
		}
	}

	// Compare keys across locales
	const baseKeys = messageKeys[locales[0]];
	const inconsistencies: string[] = [];

	for (let i = 1; i < locales.length; i++) {
		const locale = locales[i];
		const keys = messageKeys[locale];

		const missingKeys = baseKeys.filter((key) => !keys.includes(key));
		const extraKeys = keys.filter((key) => !baseKeys.includes(key));

		if (missingKeys.length > 0) {
			inconsistencies.push(`${locale}: missing keys [${missingKeys.join(', ')}]`);
		}
		if (extraKeys.length > 0) {
			inconsistencies.push(`${locale}: extra keys [${extraKeys.join(', ')}]`);
		}
	}

	if (inconsistencies.length > 0) {
		console.warn('⚠️  Message key inconsistencies detected:');
		inconsistencies.forEach((issue) => console.warn(`   ${issue}`));
	} else {
		console.warn('✅ All message files have consistent keys');
	}
}

/**
 * Main function
 */
async function main() {
	console.warn('🚀 Starting Paraglide update process...');
	try {
		// Discover available locales
		const locales = await discoverLocales();

		if (locales.length === 0) {
			console.error('❌ No locale files found in messages directory');
			process.exit(1);
		}

		// Validate message consistency
		await validateMessages(locales);

		// Update settings
		await updateInlangSettings(locales);

		// Compile paraglide
		await compileParaglide();

		console.warn('🎉 Paraglide update completed successfully!');
	} catch (error) {
		console.error('💥 Paraglide update failed:', error);
		process.exit(1);
	}
}

// Run the main function
main().catch((error) => {
	console.error('💥 Paraglide update failed:', error);
	process.exit(1);
});

export { discoverLocales, updateInlangSettings, compileParaglide, validateMessages };
