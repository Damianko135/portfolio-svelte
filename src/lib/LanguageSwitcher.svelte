<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { Icon } from '$lib';

	let currentLocale = $state(getLocale());
	let isOpen = $state(false);

	function getFlag(locale: string): string {
		return `circle-flags:${locale}`;
	}

	function handleLocaleChange(newLocale: string) {
		setLocale(newLocale as any);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-dropdown')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
		return;
	});
</script>

<div class="language-dropdown relative">
	<button
		type="button"
		class="hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
		onclick={toggleDropdown}
		aria-label="Select language"
		aria-expanded={isOpen}
	>
		<Icon icon={getFlag(currentLocale)} class="h-5 w-5" />
		<span>{currentLocale.toUpperCase()}</span>
		<Icon
			icon="mdi:chevron-down"
			class="h-4 w-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isOpen}
		<div
			class="bg-surface-50 dark:bg-surface-800 ring-opacity-5 absolute top-full right-0 mt-1 min-w-[120px] rounded-lg shadow-lg ring-1 ring-black"
		>
			<div class="py-1">
				{#each locales as locale}
					<button
						type="button"
						class="hover:bg-surface-200 dark:hover:bg-surface-700 flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors duration-200 {currentLocale ===
						locale
							? 'from-primary-500 to-secondary-500 bg-linear-to-r font-medium text-white'
							: 'text-surface-700 dark:text-surface-300'}"
						onclick={() => handleLocaleChange(locale)}
						aria-current={currentLocale === locale ? 'true' : undefined}
					>
						<Icon icon={getFlag(locale)} class="h-5 w-5" />
						<span>{locale.toUpperCase()}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
