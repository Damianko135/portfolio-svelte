<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		icon: string;
		class?: string;
		size?: number | string;
		color?: string;
	}

	let { icon, class: className = '', size, color }: Props = $props();

	// Build props conditionally to respect exactOptionalPropertyTypes
	const iconProps = $derived({
		icon,
		class: `flex-shrink-0 ${className}${color ? ` ${color}` : ''}`,
		...(size !== undefined ? { width: size, height: size } : {})
	});
</script>

<Icon {...iconProps} />
