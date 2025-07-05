<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="min-h-screen flex flex-col bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900"
>
	<Header />
	<main class="flex-1 relative">
		<!-- Background Pattern -->
		<div class="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
		{@render children?.()}
	</main>
	<Footer />
</div>

<style>
	.bg-grid-pattern {
		background-image:
			linear-gradient(rgba(var(--color-primary-500) / 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(var(--color-primary-500) / 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
