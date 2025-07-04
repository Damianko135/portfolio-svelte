<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { Icon } from '$lib';

	let links = [
		{ name: 'Home', url: '/' },
		{ name: 'About', url: '/about' },
		{ name: 'Projects', url: '/projects' },
		{ name: 'Contact', url: '/contact' }
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
		? 'bg-surface-50/95 dark:bg-surface-900/95 backdrop-blur-md shadow-lg'
		: 'bg-transparent'}"
>
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between py-4">
			<!-- Logo -->
			<div class="flex items-center space-x-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
				>
					<span class="text-white font-bold text-lg">DK</span>
				</div>
				<h1
					class="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
				>
					Damian Korver
				</h1>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-6">
				<nav aria-label="Main navigation">
					<ul class="flex space-x-1">
						{#each links as link (link.url)}
							<li>
								<a
									class="px-4 py-2 rounded-lg transition-all duration-200 {link.url === currentPath
										? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
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

				<ThemeToggle />
			</div>

			<!-- Mobile Menu Button -->
			<div class="md:hidden flex items-center space-x-2">
				<ThemeToggle />
				<button
					class="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors duration-200"
					onclick={toggleMobileMenu}
					aria-label="Toggle mobile menu"
				>
					{#if mobileMenuOpen}
						<Icon icon="mdi:close" class="w-6 h-6" />
					{:else}
						<Icon icon="mdi:menu" class="w-6 h-6" />
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden pb-4 border-t border-surface-300 dark:border-surface-600 mt-4 pt-4">
				<nav aria-label="Mobile navigation">
					<ul class="space-y-2">
						{#each links as link (link.url)}
							<li>
								<a
									class="block px-4 py-3 rounded-lg transition-all duration-200 {link.url ===
									currentPath
										? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md'
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
