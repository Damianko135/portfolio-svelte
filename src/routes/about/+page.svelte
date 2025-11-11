<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Icon, SectionDivider } from '$lib';
	import * as m from '$lib/paraglide/messages.js';

	let visible = $state(false);
	onMount(() => {
		visible = true;
	});

	const skills = [
		{ name: m.about_skill_proxmox(), icon: 'simple-icons:proxmox', color: 'text-secondary-500' },
		{ name: m.about_skill_vmware(), icon: 'simple-icons:vmware', color: 'text-primary-500' },
		{ name: m.about_skill_hyperv(), icon: 'mdi:microsoft-windows', color: 'text-primary-600' },
		{
			name: m.about_skill_activedirectory(),
			icon: 'mdi:microsoft-active-directory',
			color: 'text-tertiary-500'
		},
		{ name: m.about_skill_docker(), icon: 'mdi:docker', color: 'text-primary-400' },
		{ name: m.about_skill_networking(), icon: 'mdi:network', color: 'text-success-500' },
		{ name: m.about_skill_firewall(), icon: 'mdi:shield-check', color: 'text-error-500' },
		{ name: m.about_skill_sveltekit(), icon: 'simple-icons:svelte', color: 'text-secondary-600' }
	];

	const interests = [
		{ name: m.about_interest_pentest(), icon: 'mdi:bug', color: 'text-error-600' },
		{ name: m.about_interest_redteam(), icon: 'mdi:sword-cross', color: 'text-error-500' },
		{ name: m.about_interest_purpleteam(), icon: 'mdi:yin-yang', color: 'text-tertiary-500' }
	];

	const timeline = [
		{
			year: 2023,
			endYear: 2027,
			title: m.about_timeline_study(),
			organization: m.about_timeline_study_org(),
			description: m.about_timeline_study_desc(),
			color: 'from-primary-500 to-tertiary-500'
		},
		{
			year: 2024,
			endYear: null, // Ongoing
			title: m.about_timeline_homelab(),
			organization: m.about_timeline_homelab_org(),
			description: m.about_timeline_homelab_desc(),
			color: 'from-success-500 to-primary-500'
		},
		{
			year: 2022,
			endYear: 2022,
			title: m.about_timeline_security(),
			organization: m.about_timeline_security_org(),
			description: m.about_timeline_security_desc(),
			color: 'from-tertiary-500 to-secondary-500'
		}
	].sort((a, b) => {
		const currentYear = getCurrentTime();

		// Check if items are current/ongoing or future
		const aIsCurrent = a.endYear === null || a.endYear > currentYear;
		const bIsCurrent = b.endYear === null || b.endYear > currentYear;

		// Current/ongoing items always go first
		if (aIsCurrent && !bIsCurrent) return -1;
		if (!aIsCurrent && bIsCurrent) return 1;

		// If both are current or both are past, sort by start year descending
		return b.year - a.year;
	});

	function getCurrentTime() {
		const now = new Date();
		const year = now.getFullYear();
		return year;
	}
</script>

<svelte:head>
	<title>{m.about_title()}</title>
	<meta name="description" content={m.about_meta_description()} />
</svelte:head>

{#if visible}
	<div class="relative overflow-hidden" transition:fade>
		<!-- Hero Section -->
		<section class="relative px-4 py-20">
			<!-- Background Pattern -->
			<div class="absolute inset-0 opacity-5">
				<div class="bg-grid-pattern absolute inset-0"></div>
			</div>

			<div class="relative container mx-auto max-w-4xl text-center">
				<div class="space-y-8" in:fly={{ y: 30, duration: 800, delay: 200 }}>
					<div
						class="from-primary-500/20 to-secondary-500/20 border-primary-500/30 inline-flex items-center rounded-full border bg-gradient-to-r px-6 py-3 backdrop-blur-sm"
					>
						<span class="text-surface-700 dark:text-surface-300 text-sm font-medium"
							>{m.about_story()}</span
						>
					</div>

					<h1 class="text-4xl font-bold md:text-6xl">
						<span class="text-surface-900 dark:text-surface-50 block">{m.about_heading()}</span>
						<span
							class="from-primary-600 via-secondary-600 to-tertiary-600 block bg-gradient-to-r bg-clip-text text-transparent"
						>
							{m.about_intro()}
						</span>
					</h1>

					<div class="flex flex-wrap justify-center gap-4 pt-4">
						<div
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 flex items-center rounded-full border bg-white/60 px-4 py-2 backdrop-blur-sm"
						>
							<Icon icon="mdi:map-marker" class="text-success-500 mr-2" />
							<span class="text-sm font-medium">{m.about_location_label()}</span>
						</div>
						<div
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 flex items-center rounded-full border bg-white/60 px-4 py-2 backdrop-blur-sm"
						>
							<Icon icon="mdi:school" class="text-primary-500 mr-2" />
							<span class="text-sm font-medium">{m.about_student_label()}</span>
						</div>
						<div
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 flex items-center rounded-full border bg-white/60 px-4 py-2 backdrop-blur-sm"
						>
							<Icon icon="mdi:heart" class="text-tertiary-500 mr-2" />
							<span class="text-sm font-medium">{m.about_enthusiast_label()}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- About Story -->
		<section
			class="from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 bg-gradient-to-br px-4 py-20"
		>
			<div class="container mx-auto max-w-4xl">
				<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<div class="space-y-6" in:fly={{ x: -30, duration: 600, delay: 300 }}>
						<h2 class="text-surface-900 dark:text-surface-50 text-3xl font-bold md:text-4xl">
							{m.about_section_title()}
						</h2>
						<div
							class="from-primary-500 to-secondary-500 h-1 w-16 rounded-full bg-gradient-to-r"
						></div>
						<div class="text-surface-600 dark:text-surface-400 space-y-4 text-lg leading-relaxed">
							<p>
								{m.about_story_p1()}
							</p>
							<p>
								{m.about_story_p2()}
							</p>
							<p>
								{m.about_story_p3()}
							</p>
						</div>
					</div>

					<div class="relative" in:fly={{ x: 30, duration: 600, delay: 400 }}>
						<div
							class="from-primary-500 to-secondary-500 relative rounded-2xl bg-gradient-to-br p-8 text-white shadow-2xl"
						>
							<div class="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10"></div>
							<div class="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10"></div>
							<div class="relative space-y-4">
								<h3 class="text-2xl font-bold">Current Focus</h3>
								<ul class="space-y-3">
									<li class="flex items-center">
										<Icon icon="mdi:school" class="mr-3" />
										<span>Cyber Security Studies</span>
									</li>
									<li class="flex items-center">
										<Icon icon="mdi:server" class="mr-3" />
										<span>Homelab Development</span>
									</li>
									<li class="flex items-center">
										<Icon icon="mdi:code-tags" class="mr-3" />
										<span>Full-Stack Development</span>
									</li>
									<li class="flex items-center">
										<Icon icon="mdi:shield-check" class="mr-3" />
										<span>Security Research</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Timeline -->
		<section class="px-4 py-20">
			<div class="container mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h3 class="text-surface-900 dark:text-surface-50 mb-4 text-3xl font-bold md:text-4xl">
						{m.about_my_journey()}
					</h3>
					<SectionDivider variant="delayed" />
				</div>

				<div class="relative">
					<!-- Timeline Line -->
					<div
						class="from-primary-500 to-secondary-500 absolute top-0 bottom-0 left-4 w-0.5 transform bg-gradient-to-b md:left-1/2 md:-translate-x-1/2"
					></div>

					<div class="space-y-12">
						{#each timeline as item, i (item.year)}
							<div
								class="relative flex items-center {i % 2 === 0
									? 'md:flex-row'
									: 'md:flex-row-reverse'}"
								in:fly={{ y: 30, duration: 600, delay: 200 + i * 100 }}
							>
								<!-- Timeline Dot -->
								<div
									class="absolute left-4 h-4 w-4 bg-gradient-to-r md:left-1/2 {item.color} z-10 -translate-x-1/2 transform rounded-full shadow-lg"
								></div>

								<!-- Content -->
								<div class="ml-12 md:ml-0 md:w-1/2 {i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}">
									<div
										class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
									>
										<div class="space-y-3">
											<div class="text-primary-600 dark:text-primary-400 text-sm font-medium">
												{(() => {
													const currentYear = getCurrentTime();
													if (item.endYear === null) {
														// Ongoing - show "year - Present"
														return `${item.year} - Present`;
													} else if (item.endYear > currentYear) {
														// Future end date - show "year - Present"
														return `${item.year} - Present`;
													} else if (item.year === item.endYear) {
														// Same year start and end - show just the year
														return `${item.year}`;
													} else {
														// Past with different start/end - show range
														return `${item.year} - ${item.endYear}`;
													}
												})()}
											</div>
											<h4 class="text-surface-900 dark:text-surface-50 text-xl font-bold">
												{item.title}
											</h4>
											<div class="text-secondary-600 dark:text-secondary-400 text-sm font-medium">
												{item.organization}
											</div>
											<p class="text-surface-600 dark:text-surface-400">{item.description}</p>
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- Skills Section -->
		<section
			class="from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 bg-gradient-to-br px-4 py-20"
		>
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<h3 class="text-surface-900 dark:text-surface-50 mb-4 text-3xl font-bold md:text-4xl">
						{m.about_my_expertise()}
					</h3>
					<SectionDivider variant="on-scroll" />
				</div>

				<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
					{#each skills as skill, i (skill.name)}
						<div
							class="group dark:bg-surface-800/70 border-surface-200/50 dark:border-surface-700/50 rounded-xl border bg-white/70 p-6 text-center shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 50 }}
						>
							<div
								class="text-4xl {skill.color} mb-3 transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={skill.icon} class="text-4xl" />
							</div>
							<p class="text-surface-900 dark:text-surface-50 font-semibold">{skill.name}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Interests Section -->
		<section class="px-4 py-20">
			<div class="container mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h3 class="text-surface-900 dark:text-surface-50 mb-4 text-3xl font-bold md:text-4xl">
						{m.about_interested_in()}
					</h3>
					<SectionDivider variant="on-scroll" />
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					{#each interests as interest, i (interest.name)}
						<div
							class="group to-surface-50/60 dark:from-surface-800/60 dark:to-surface-700/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-gradient-to-br from-white/60 p-8 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
							in:fly={{ y: 30, duration: 600, delay: 200 + i * 100 }}
						>
							<div
								class="text-5xl {interest.color} mb-4 transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={interest.icon} class="text-5xl" />
							</div>
							<h4 class="text-surface-900 dark:text-surface-50 text-lg font-bold">
								{interest.name}
							</h4>
						</div>
					{/each}
				</div>
			</div>
		</section>
	</div>
{/if}
