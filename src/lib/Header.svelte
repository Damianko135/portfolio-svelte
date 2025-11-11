<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Icon } from '$lib';
	import * as m from '$lib/paraglide/messages.js';

	let links = [
		{ name: m.nav_home(), url: '/' },
		{ name: m.nav_about(), url: '/about' },
		{ name: m.nav_projects(), url: '/projects' },
		{ name: m.nav_contact(), url: '/contact' }
	];

	let currentPath = $derived($page.url.pathname);
	let isScrolled = $state(false);
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<header
	class="sticky top-0 z-50 transition-all duration-300 {isScrolled
		? 'bg-surface-50/95 dark:bg-surface-900/95 shadow-lg backdrop-blur-md'
		: 'bg-transparent'}"
>
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between py-4">
			<!-- Logo -->
			<div class="flex items-center space-x-2">
				<div
					class="from-primary-500 to-secondary-500 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br"
				>
					<span class="text-lg font-bold text-white">DK</span>
				</div>
				<h1
					class="from-primary-600 to-secondary-600 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent"
				>
					Damian Korver
				</h1>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden items-center space-x-6 md:flex">
				<nav aria-label="Main navigation">
					<ul class="flex space-x-1">
						{#each links as link (link.url)}
							<li>
								<a
									class="rounded-lg px-4 py-2 transition-all duration-200 {link.url === currentPath
										? 'from-primary-500 to-secondary-500 bg-gradient-to-r text-white shadow-md'
										: 'hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'}"
									href={link.url}
									aria-current={link.url === currentPath ? 'page' : undefined}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</nav>

				<div class="flex items-center space-x-2">
					<ThemeToggle />
				</div>
			</div>

			<!-- Mobile Menu Button -->
			<div class="flex items-center space-x-2 md:hidden">
				<ThemeToggle />
				<button
					class="hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg p-2 transition-colors duration-200"
					onclick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					{#if mobileMenuOpen}
						<Icon icon="mdi:close" class="h-6 w-6" />
					{:else}
						<Icon icon="mdi:menu" class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="border-surface-300 dark:border-surface-600 mt-4 border-t pt-4 pb-4 md:hidden">
				<nav aria-label="Mobile navigation">
					<ul class="space-y-2">
						{#each links as link (link.url)}
							<li>
								<a
									class="block rounded-lg px-4 py-3 transition-all duration-200 {link.url ===
									currentPath
										? 'from-primary-500 to-secondary-500 bg-gradient-to-r text-white shadow-md'
										: 'hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'}"
									href={link.url}
									onclick={() => (mobileMenuOpen = false)}
									aria-current={link.url === currentPath ? 'page' : undefined}
								>
									{link.name}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>
		{/if}
	</div>
</header>
