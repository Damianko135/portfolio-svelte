<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime.js';
	import { Icon } from '$lib';
	import * as m from '$lib/paraglide/messages.js';

	type Locale = (typeof locales)[number];

	let currentLocale = $state(getLocale());
	let isOpen = $state(false);
	let triggerButton = $state<HTMLButtonElement | null>(null);
	let listElement = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(0);
	const listboxId = 'language-switcher-listbox';

	function getFlag(locale: Locale): string {
		return `circle-flags:${locale}`;
	}

	function handleLocaleChange(newLocale: Locale) {
		setLocale(newLocale);
		currentLocale = newLocale;
		closeDropdown();
	}

	function closeDropdown(restoreFocus = true) {
		isOpen = false;
		if (restoreFocus) {
			queueMicrotask(() => triggerButton?.focus());
		}
	}

	function focusOption(index: number) {
		const safeIndex = (index + locales.length) % locales.length;
		activeIndex = safeIndex;
		const option = listElement?.querySelector<HTMLButtonElement>(
			`button[data-index="${safeIndex}"]`
		);
		option?.focus();
	}

	function openDropdown(focusIndex = locales.indexOf(currentLocale)) {
		isOpen = true;
		queueMicrotask(() => {
			focusOption(focusIndex >= 0 ? focusIndex : 0);
		});
	}

	function toggleDropdown() {
		if (isOpen) {
			closeDropdown(false);
			return;
		}
		openDropdown();
	}

	function handleTriggerKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
			event.preventDefault();
			openDropdown();
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			openDropdown(locales.length - 1);
		}
		if (event.key === 'Escape' && isOpen) {
			event.preventDefault();
			closeDropdown();
		}
	}

	function handleListKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			closeDropdown();
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			focusOption(activeIndex + 1);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			focusOption(activeIndex - 1);
			return;
		}

		if (event.key === 'Home') {
			event.preventDefault();
			focusOption(0);
			return;
		}

		if (event.key === 'End') {
			event.preventDefault();
			focusOption(locales.length - 1);
		}
	}

	function handleOptionKeydown(event: KeyboardEvent, locale: Locale) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleLocaleChange(locale);
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-dropdown')) {
			closeDropdown(false);
		}
	}

	function handleLocaleSelect(locale: Locale, index: number) {
		activeIndex = index;
		handleLocaleChange(locale);
	}

	$effect(() => {
		currentLocale = getLocale();
		activeIndex = Math.max(0, locales.indexOf(currentLocale));
	});

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
		bind:this={triggerButton}
		type="button"
		class="hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
		onclick={toggleDropdown}
		onkeydown={handleTriggerKeydown}
		aria-label={m.ui_language_select()}
		aria-haspopup="listbox"
		aria-controls={listboxId}
		aria-expanded={isOpen}
	>
		<Icon icon={getFlag(currentLocale)} class="h-5 w-5" />
		<span>{currentLocale.toUpperCase()}</span>
		<Icon icon="mdi:chevron-down" class="h-4 w-4 {isOpen ? 'rotate-180' : ''}" />
	</button>

	{#if isOpen}
		<div
			id={listboxId}
			bind:this={listElement}
			role="listbox"
			aria-label={m.ui_language_options()}
			tabindex="-1"
			onkeydown={handleListKeydown}
			class="bg-surface-50 dark:bg-surface-800 ring-opacity-5 absolute top-full right-0 mt-1 min-w-[120px] rounded-lg shadow-lg ring-1 ring-black"
		>
			<div class="py-1">
				{#each locales as locale, i}
					<button
						type="button"
						data-index={i}
						role="option"
						aria-selected={currentLocale === locale}
						class="hover:bg-surface-200 dark:hover:bg-surface-700 flex w-full items-center gap-2 px-4 py-2 text-left text-sm {currentLocale ===
						locale
							? 'from-primary-500 to-secondary-500 bg-linear-to-r font-medium text-white'
							: 'text-surface-700 dark:text-surface-300'}"
						onfocus={() => (activeIndex = i)}
						onkeydown={(event) => handleOptionKeydown(event, locale)}
						onclick={() => handleLocaleSelect(locale, i)}
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

