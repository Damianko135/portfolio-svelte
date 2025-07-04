<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		icon: string;
		class?: string;
		size?: number | string;
		color?: string;
	}

	let { icon, class: className = '', size, color }: Props = $props();
</script>

<Icon
	{icon}
	class="flex-shrink-0 {className}"
	width={size}
	height={size}
	style={color ? `color: ${color}` : undefined}
/>
