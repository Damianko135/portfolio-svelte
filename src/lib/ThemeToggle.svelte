<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let checked = $state(false);

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		const mode = localStorage.getItem('mode') || 'light';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<div role="group" aria-label="Theme selection">
	<span id="theme-toggle-label" class="sr-only">{m.ui_theme_toggle()}</span>
	<Switch aria-labelledby="theme-toggle-label" {checked} {onCheckedChange}></Switch>
</div>
