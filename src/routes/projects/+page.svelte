<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Icon } from '$lib';

	const { data } = $props<import('./$types').PageData>();
	let projects = $state(data.projects);
	let visible = $state(false);

	const screenPath = '$libs/creenshots/';

	$effect(() => {
		visible = true;
	});
</script>

<svelte:head>
	<title>Projects - DK</title>
	<meta
		name="description"
		content="Check out the projects I've been working on - from cybersecurity tools to web apps and everything in between."
	/>
</svelte:head>

{#if visible}
	<div class="relative" transition:fade>
		<!-- Hero Section -->
		<section class="relative px-4 py-20">
			<!-- Background Pattern -->
			<div class="absolute inset-0 opacity-5">
				<div class="bg-grid-pattern absolute inset-0"></div>
			</div>

			<!-- Floating Elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div
					class="bg-primary-500 absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full opacity-20 mix-blend-multiply blur-xl filter"
				></div>
				<div
					class="bg-secondary-500 delay-2s absolute bottom-20 left-20 h-40 w-40 animate-pulse rounded-full opacity-20 mix-blend-multiply blur-xl filter"
				></div>
			</div>

			<div class="relative container mx-auto max-w-4xl text-center">
				<div class="space-y-8" in:fly={{ y: 30, duration: 800, delay: 200 }}>
					<div
						class="from-primary-500/20 to-secondary-500/20 border-primary-500/30 inline-flex items-center rounded-full border bg-gradient-to-r px-6 py-3 backdrop-blur-sm"
					>
						<Icon icon="mdi:folder-open" class="text-primary-600 mr-2" />
						<span class="text-surface-700 dark:text-surface-300 text-sm font-medium"
							>Things I've built</span
						>
					</div>

					<h1 class="text-4xl font-bold md:text-6xl">
						<span
							class="from-primary-600 via-secondary-600 to-tertiary-600 block bg-gradient-to-r bg-clip-text text-transparent"
						>
							My Projects
						</span>
					</h1>

					<p
						class="text-surface-600 dark:text-surface-400 mx-auto max-w-3xl text-xl leading-relaxed"
					>
						Here's some stuff I've been working on - a mix of security tools, web apps, and
						experiments. Always learning something new with each one.
					</p>
				</div>
			</div>
		</section>

		<!-- Projects Grid -->
		<section class="px-4 py-20">
			<div class="container mx-auto max-w-7xl">
				{#if projects?.length > 0}
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each projects as project, i (project.id)}
							<article
								class="group dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 relative overflow-hidden rounded-2xl border bg-white/60 shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl"
								in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
							>
								<!-- Project Header -->
								<header class="p-6 pb-4">
									<div class="mb-4 flex items-start justify-between">
										<div class="flex-1">
											<h2
												class="text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 text-xl font-bold transition-colors duration-300"
											>
												{project.name}
											</h2>
										</div>
										<div
											class="from-primary-500 to-secondary-500 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br opacity-80 transition-opacity duration-300 group-hover:opacity-100"
										>
											<Icon icon="mdi:code-tags" class="text-sm text-white" />
										</div>
									</div>
								</header>

								<!-- Project Screenshot -->
								{#if project.screenshot}
									<div class="mb-4 px-6">
										<a
											href={project.url}
											target="_blank"
											rel="noopener noreferrer"
											class="block transition-transform duration-300 group-hover:scale-105"
										>
											<div class="relative overflow-hidden rounded-xl shadow-md">
												<img
													src={project.screenshot}
													alt={project.name + ' screenshot'}
													class="aspect-video w-full object-cover"
													loading="lazy"
												/>
												<div
													class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
												></div>
												<div
													class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
												>
													<div
														class="dark:bg-surface-800/90 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg"
													>
														<Icon icon="mdi:open-in-new" class="text-primary-600 text-lg" />
													</div>
												</div>
											</div>
										</a>
									</div>
								{:else}
									<!-- Placeholder for projects without screenshots -->
									<div class="mb-4 px-6">
										<div
											class="from-primary-500/20 to-secondary-500/20 border-primary-500/30 flex aspect-video items-center justify-center rounded-xl border bg-gradient-to-br"
										>
											<div class="space-y-2 text-center">
												<Icon icon="mdi:code-tags" class="text-primary-500/60 text-4xl" />
												<p class="text-surface-600 dark:text-surface-400 text-sm">
													Project Preview
												</p>
											</div>
										</div>
									</div>
								{/if}

								<!-- Project Description -->
								{#if project.description}
									<div class="mb-4 px-6">
										<p class="text-surface-600 dark:text-surface-400 leading-relaxed">
											{project.description}
										</p>
									</div>
								{/if}

								<!-- Technologies -->
								{#if project.technologies && project.technologies.length > 0}
									<div class="mb-6 px-6">
										<h3 class="text-surface-700 dark:text-surface-300 mb-3 text-sm font-semibold">
											Technologies:
										</h3>
										<div class="flex flex-wrap gap-2">
											{#each project.technologies as technology (technology.name)}
												<span
													class="from-primary-500/20 to-secondary-500/20 border-primary-500/30 text-surface-700 dark:text-surface-300 inline-flex items-center rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-medium"
												>
													{#if technology.icon}
														<Icon icon={technology.icon} class="mr-1.5" />
													{/if}
													{technology.name}
												</span>
											{/each}
										</div>
									</div>
								{/if}

								<!-- Project Footer -->
								<footer class="p-6 pt-0">
									<a
										href={project.url}
										target="_blank"
										rel="noopener noreferrer"
										class="group from-primary-500 to-secondary-500 inline-flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
									>
										<span>View Project</span>
										<svg
											class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
											/>
										</svg>
									</a>
								</footer>
							</article>
						{/each}
					</div>
				{:else}
					<!-- Empty State -->
					<div class="py-20 text-center">
						<div
							class="from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br"
						>
							<Icon
								icon="mdi:folder-open"
								class="text-surface-500 dark:text-surface-400 text-4xl"
							/>
						</div>
						<h3 class="text-surface-900 dark:text-surface-50 mb-4 text-2xl font-bold">
							No Projects Found
						</h3>
						<p class="text-surface-600 dark:text-surface-400 mx-auto max-w-md">
							Projects are currently being updated. Check back soon for new and exciting work!
						</p>
					</div>
				{/if}
			</div>
		</section>

		<!-- Call to Action -->
		<section
			class="from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 bg-gradient-to-br px-4 py-20"
		>
			<div class="container mx-auto max-w-4xl text-center">
				<div class="space-y-8">
					<h3 class="text-surface-900 dark:text-surface-50 text-3xl font-bold md:text-4xl">
						Interested in Working Together?
					</h3>
					<p class="text-surface-600 dark:text-surface-400 mx-auto max-w-2xl text-lg">
						I'm always open to new opportunities and exciting projects. Let's connect and discuss
						how we can create something amazing together.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/contact"
							class="from-primary-500 to-secondary-500 inline-flex transform items-center rounded-xl bg-gradient-to-r px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
						>
							<span>Get In Touch</span>
							<svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</a>
						<a
							href="https://github.com/damianko135"
							target="_blank"
							rel="noopener noreferrer"
							class="border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-500 inline-flex items-center rounded-xl border-2 px-8 py-4 font-semibold transition-all duration-300 hover:text-white"
						>
							<span>View GitHub</span>
							<Icon icon="mdi:github" class="ml-2" />
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}
