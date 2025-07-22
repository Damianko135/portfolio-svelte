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
	class="from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900 flex min-h-screen flex-col bg-gradient-to-br"
>
	<Header />
	<main
		class="from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900 flex min-h-screen flex-col bg-gradient-to-br"
	>
		<!-- Background Pattern -->
		<div class="bg-grid-pattern pointer-events-none absolute inset-0 opacity-5"></div>
		{@render children?.()}
	</main>
	<Footer />
</div>
