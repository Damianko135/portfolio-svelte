<script lang="ts">
	import { onMount } from 'svelte';

	export let variant: 'default' | 'delayed' | 'subtle' | 'on-scroll' = 'default';
	export let className: string = '';

	let dividerElement: HTMLDivElement;
	let isVisible = false;

	const animationClasses = {
		default: 'animate-expand',
		delayed: 'animate-expand-delayed',
		subtle: 'animate-expand-subtle',
		'on-scroll': 'animate-expand-on-scroll'
	};

	onMount(() => {
		if (variant === 'on-scroll' && dividerElement) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !isVisible) {
							isVisible = true;
							dividerElement.classList.add('visible');
						}
					});
				},
				{ threshold: 0.2 }
			);

			observer.observe(dividerElement);

			return () => observer.disconnect();
		}
		return undefined;
	});
</script>

<div
	bind:this={dividerElement}
	class="from-primary-500 to-secondary-500 mx-auto h-1 w-24 rounded-full bg-gradient-to-r {animationClasses[
		variant
	]} {className}"
></div>
