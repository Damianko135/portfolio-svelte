<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		variant?: 'delayed' | 'on-scroll';
		className?: string;
	}

	let { variant = 'delayed', className = '' }: Props = $props();

	let dividerElement: HTMLDivElement;
	let isVisible = false;

	const animationClasses = {
		delayed: 'animate-expand-delayed',
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
	class="from-primary-500 to-secondary-500 mx-auto h-1 w-64 rounded-full bg-linear-to-r {animationClasses[
		variant
	]} {className}"
></div>
