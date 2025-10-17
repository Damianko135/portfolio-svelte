import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
	// Global ignores
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'node_modules/**',
			'*.config.js',
			'*.config.ts',
			'.wrangler/**'
		]
	},

	// JavaScript/TypeScript files
	{
		files: ['**/*.js', '**/*.ts'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...js.configs.recommended.rules,
			...tsPlugin.configs.recommended.rules,

			// TypeScript handles this
			'@typescript-eslint/no-unused-vars': 'off',

			// Allow 'any' for now
			'@typescript-eslint/no-explicit-any': 'warn',

			// Only allow console.warn and console.error
			'no-console': ['warn', { allow: ['warn', 'error'] }],

			// Enforce best practices
			'prefer-const': 'error',
			'no-var': 'error'
		}
	},

	// Svelte files
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		},
		plugins: {
			svelte: sveltePlugin
		},
		rules: {
			...sveltePlugin.configs.recommended.rules,
			'no-console': ['warn', { allow: ['warn', 'error'] }]
		}
	},

	// Prettier compatibility (must be last)
	prettierConfig
];
