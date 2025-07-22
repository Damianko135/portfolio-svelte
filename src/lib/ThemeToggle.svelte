<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);

	$effect(() => {
		var mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'dark';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		var mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		var mode = localStorage.getItem('mode') || 'dark';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<Switch {checked} {onCheckedChange}></Switch>
