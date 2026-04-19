<script lang="ts">
	import { Icon, SectionDivider } from '$lib';
	import * as m from '$lib/paraglide/messages.js';
	import type { AboutItem, Interest } from '$lib/types';
	import { fly } from 'svelte/transition';

	// Using the new $state syntax for reactive variables
	let visible = $state(false);
	let heroVisible = $state(false);

	// Arrays for lists with proper typing (these don't need to be reactive)
	const aboutItems: AboutItem[] = [
		{
			icon: 'mdi:map-marker',
			text: m.home_location(),
			subText: m.home_location_desc(),
			color: 'text-success-500'
		},

		{
			icon: 'mdi:school',
			text: m.home_education(),
			subText: m.home_education_desc(),
			color: 'text-primary-500'
		},
		{
			icon: 'mdi:server-security',
			text: m.home_focus(),
			subText: m.home_focus_desc(),
			color: 'text-error-500'
		}
	];

	const interests: Interest[] = [
		{ icon: 'mdi:shield-check', text: m.home_skill_security(), color: 'text-error-500' },
		{ icon: 'mdi:cloud', text: m.home_skill_cloud(), color: 'text-primary-500' },
		{ icon: 'mdi:network', text: m.home_skill_networking(), color: 'text-success-500' },
		{ icon: 'mdi:firewall', text: m.home_skill_firewalls(), color: 'text-secondary-500' },
		{ icon: 'mdi:terminal', text: m.home_skill_command(), color: 'text-surface-500' },
		{ icon: 'mdi:linux', text: m.home_skill_linux(), color: 'text-warning-500' },
		{ icon: 'mdi:microsoft-windows', text: m.home_skill_windows(), color: 'text-primary-600' }
	];

	const skills = [
		{ icon: 'simple-icons:go', name: 'Golang', color: 'text-primary-500' },
		{ icon: 'mdi:language-javascript', name: 'JavaScript', color: 'text-warning-500' },
		{ icon: 'mdi:docker', name: 'Docker', color: 'text-primary-500' },
		{ icon: 'mdi:linux', name: 'Linux', color: 'text-warning-500' }
	];

	$effect(() => {
		visible = true;
		setTimeout(() => {
			heroVisible = true;
		}, 200);
	});
</script>

<svelte:head>
	<title>{m.home_title()}</title>
	<meta name="description" content={m.home_meta_description()} />
	<meta name="keywords" content={m.home_meta_keywords()} />
	<meta property="og:title" content={m.home_title()} />
	<meta property="og:description" content={m.home_hero_subtitle()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://dkorver.nl" />
	<!-- Canonical URL -->
	<link rel="canonical" href="https://dkorver.nl/" />
	<!-- Open Graph Image -->
	<meta property="og:image" content="/favicon.svg" />
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={m.home_title()} />
	<meta name="twitter:description" content={m.home_hero_subtitle()} />
	<meta name="twitter:image" content="/favicon.svg" />
	<!-- Alternate language -->
	<link rel="alternate" hrefLang="en" href="https://dkorver.nl/" />
	<link rel="alternate" hrefLang="nl" href="https://dkorver.nl/nl/" />
</svelte:head>

{#if visible}
	<div class="relative overflow-hidden">
		<!-- Hero Section -->
		<section
			class="relative flex min-h-[85vh] items-center justify-center px-4 py-20 md:min-h-screen"
		>
			<!-- Animated Background Elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div
					class="bg-primary-500 absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-12 mix-blend-multiply blur-lg motion-safe:animate-pulse"
				></div>
				<div
					class="bg-secondary-500 delay-2s absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-12 mix-blend-multiply blur-lg motion-safe:animate-pulse"
				></div>
			</div>

			<div class="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
				{#if heroVisible}
					<div class="space-y-6" in:fly={{ y: 30, duration: 800, delay: 300 }}>
						<div
							class="from-primary-500/12 to-secondary-500/12 border-primary-500/20 inline-flex items-center rounded-full border bg-linear-to-r px-4 py-2 backdrop-blur-sm"
						>
							<div class="bg-success-500 mr-3 h-2 w-2 rounded-full motion-safe:animate-pulse"></div>
							<span class="type-kicker text-surface-700 dark:text-surface-300"
								>{m.home_available()}</span
							>
						</div>

						<h1 class="type-display">
							<span class="text-surface-900 dark:text-surface-50 block">{m.home_hero_title()}</span>
							<span
								class="from-primary-600 via-secondary-600 to-tertiary-600 block bg-linear-to-r bg-clip-text text-transparent"
							>
								Damian Korver
							</span>
						</h1>
						<p class="type-lead text-surface-600 dark:text-surface-400 mx-auto max-w-3xl">
							{m.home_hero_subtitle()}
						</p>

						<div class="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
							<a
								href="/projects"
								class="group from-primary-500 to-secondary-500 inline-flex transform items-center rounded-xl bg-linear-to-r px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl"
							>
								<span>{m.home_cta_primary()}</span>
								<svg
									class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</a>
							<a
								href="/contact"
								class="border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500 inline-flex items-center rounded-xl border-2 px-8 py-4 font-semibold hover:text-white"
							>
								{m.home_cta_secondary()}
							</a>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- About Cards -->
		<section class="px-4 py-20">
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center" in:fly={{ y: 30, duration: 600, delay: 100 }}>
					<h2 class="type-section-title text-surface-900 dark:text-surface-50 mb-4">
						A bit about me
					</h2>
					<SectionDivider variant="delayed" />
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					{#each aboutItems as item, i (item.text)}
						<div
							class="group dark:bg-surface-800/50 border-surface-200/50 dark:border-surface-700/50 relative rounded-2xl border bg-white/50 p-8 shadow-lg backdrop-blur-sm hover:scale-105 hover:shadow-2xl"
							in:fly={{ y: 30, duration: 600, delay: 200 + i * 100 }}
						>
							<div
								class="from-primary-500 to-secondary-500 absolute -top-4 -right-4 h-8 w-8 rounded-lg bg-linear-to-br opacity-20 transition-opacity group-hover:opacity-40"
							></div>
							<div class="space-y-4 text-center">
								<div
									class="from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-600 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-inner"
								>
									<Icon icon={item.icon} class="text-3xl {item.color}" />
								</div>
								<div class="space-y-2">
									<h3 class="text-surface-900 dark:text-surface-50 text-lg font-bold">
										{item.text}
									</h3>
									{#if item.subText}
										<p class="text-surface-600 dark:text-surface-400 text-sm">{item.subText}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Tech Stack -->
		<section
			class="from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 bg-linear-to-br px-4 py-20"
		>
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<h3 class="type-section-title text-surface-900 dark:text-surface-50 mb-4">
						{m.home_tech_stack()}
					</h3>
					<SectionDivider variant="on-scroll" />
				</div>

				<div class="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
					{#each skills as skill, i (skill.name)}
						<div
							class="group dark:bg-surface-800/70 border-surface-200/50 dark:border-surface-700/50 rounded-xl border bg-white/70 p-6 text-center shadow-md backdrop-blur-sm hover:scale-110 hover:shadow-xl"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="text-4xl {skill.color} mb-3 transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={skill.icon} class="text-4xl" />
							</div>
							<p class="text-surface-900 dark:text-surface-50 font-semibold">{skill.name}</p>
						</div>
					{/each}

					<!-- SvelteKit card -->
					<div
						class="group dark:bg-surface-800/70 border-surface-200/50 dark:border-surface-700/50 rounded-xl border bg-white/70 p-6 text-center shadow-md backdrop-blur-sm hover:scale-110 hover:shadow-xl"
						in:fly={{ y: 30, duration: 600, delay: 600 }}
					>
						<div
							class="text-secondary-500 mb-3 text-4xl transition-transform duration-300 group-hover:scale-110"
						>
							<Icon icon="simple-icons:svelte" class="text-4xl" />
						</div>
						<p class="text-tertiary-900 dark:text-tertiary-50 font-semibold">SvelteKit</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Interests Section -->
		<section class="px-4 py-20">
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<h3 class="type-section-title text-surface-900 dark:text-surface-50 mb-4">
						{m.home_interested_in()}
					</h3>
					<SectionDivider variant="on-scroll" />
				</div>

				<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
					{#each interests as interest, i (interest.text)}
						<div
							class="group to-surface-50/60 dark:from-surface-800/60 dark:to-surface-700/60 border-surface-200/50 dark:border-surface-700/50 rounded-xl border bg-linear-to-br from-white/60 p-6 text-center shadow-md backdrop-blur-sm hover:scale-105 hover:shadow-xl"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="text-3xl {interest.color} mb-3 transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={interest.icon} class="text-3xl" />
							</div>
							<p class="text-surface-900 dark:text-surface-50 font-semibold">{interest.text}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Contact Section -->
		<section
			class="from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 bg-linear-to-br px-4 py-20"
		>
			<div class="container mx-auto max-w-4xl text-center">
				<div class="space-y-8">
					<div>
						<h3 class="type-section-title text-surface-900 dark:text-surface-50 mb-4">
							{m.home_contact_heading()}
						</h3>
						<p class="type-body-lg text-surface-600 dark:text-surface-400 mx-auto max-w-2xl">
							{m.home_contact_description()}
						</p>
					</div>

					<div class="flex justify-center space-x-6">
						<a
							href="https://www.linkedin.com/in/dkorver/"
							class="group bg-primary-600 hover:bg-primary-700 flex h-16 w-16 transform items-center justify-center rounded-2xl shadow-lg hover:scale-110 hover:shadow-2xl"
							aria-label="LinkedIn Profile"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								icon="mdi:linkedin"
								class="text-2xl text-white transition-transform duration-300 group-hover:scale-110"
							/>
						</a>
						<a
							href="https://github.com/damianko135"
							class="group bg-surface-800 hover:bg-surface-900 flex h-16 w-16 transform items-center justify-center rounded-2xl shadow-lg hover:scale-110 hover:shadow-2xl"
							aria-label="GitHub Profile"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								icon="mdi:github"
								class="text-2xl text-white transition-transform duration-300 group-hover:scale-110"
							/>
						</a>
						<a
							href="mailto:damiankorver@gmail.com"
							class="group bg-error-500 hover:bg-error-600 flex h-16 w-16 transform items-center justify-center rounded-2xl shadow-lg hover:scale-110 hover:shadow-2xl"
							aria-label="Email Contact"
						>
							<Icon
								icon="mdi:email"
								class="text-2xl text-white transition-transform duration-300 group-hover:scale-110"
							/>
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}
