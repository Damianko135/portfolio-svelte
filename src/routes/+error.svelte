<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages.js';
</script>

<main class="container mx-auto min-h-screen px-4 py-16">
	<div class="mx-auto max-w-2xl text-center">
		<h1 class="mb-4 text-6xl font-bold">
			{page.status}
		</h1>

		<h2 class="mb-8 text-2xl font-semibold">
			{page.error?.message || m.error_something_went_wrong({})}
		</h2>

		{#if page.error?.errorId}
			<p class="mb-8 text-sm text-gray-600 dark:text-gray-400">
				{m.error_id_label({})}:
				<code class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">{page.error.errorId}</code>
			</p>
		{/if}

		<div class="space-x-4">
			<a
				href="/"
				class="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
			>
				{m.error_go_home({})}
			</a>
			<button
				onclick={() => window.history.back()}
				class="inline-block rounded-lg bg-gray-200 px-6 py-3 text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
			>
				{m.error_go_back({})}
			</button>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
