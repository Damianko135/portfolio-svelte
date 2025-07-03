<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let projects: Project[] = $state([]);

	interface Project {
		id: number;
		name: string;
		screenshot?: string;
		description?: string;
		url: string;
		technologies?: {
			name: string;
			icon?: string;
		}[];
	}

	let visible = $state(false);
	let projectsLoaded = $state(false);

	onMount(() => {
		visible = true;
		fetch('/projects.json')
			.then((res) => res.json())
			.then((data) => {
				projects = data;
				projectsLoaded = true;
			})
			.catch((error) => {
				console.error('Error loading projects:', error);
				projectsLoaded = true;
			});
	});
</script>

<svelte:head>
	<title>Projects - Damian Korver</title>
	<meta
		name="description"
		content="Explore the projects and work of Damian Korver, showcasing cybersecurity, cloud technologies, and development skills."
	/>
</svelte:head>

{#if visible}
	<div class="relative overflow-hidden" transition:fade>
		<!-- Hero Section -->
		<section class="relative py-20 px-4">
			<!-- Background Pattern -->
			<div class="absolute inset-0 opacity-5">
				<div class="absolute inset-0 bg-grid-pattern"></div>
			</div>

			<!-- Floating Elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div
					class="absolute top-20 right-20 w-32 h-32 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
				></div>
				<div
					class="absolute bottom-20 left-20 w-40 h-40 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
					style="animation-delay: 2s;"
				></div>
			</div>

			<div class="relative container mx-auto max-w-4xl text-center">
				<div class="space-y-8" in:fly={{ y: 30, duration: 800, delay: 200 }}>
					<div
						class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 backdrop-blur-sm"
					>
						<i class="fa-solid fa-folder-open text-primary-600 mr-2"></i>
						<span class="text-sm font-medium text-surface-700 dark:text-surface-300"
							>My Portfolio</span
						>
					</div>

					<h1 class="text-4xl md:text-6xl font-bold">
						<span
							class="block bg-gradient-to-r from-primary-600 via-secondary-600 to-tertiary-600 bg-clip-text text-transparent"
						>
							My Projects
						</span>
					</h1>

					<p
						class="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
					>
						Here are some of the projects I've been working on, showcasing my skills in
						<span class="font-semibold text-primary-600 dark:text-primary-400">cybersecurity</span>,
						<span class="font-semibold text-secondary-600 dark:text-secondary-400"
							>cloud technologies</span
						>, and
						<span class="font-semibold text-tertiary-600 dark:text-tertiary-400"
							>full-stack development</span
						>.
					</p>
				</div>
			</div>
		</section>

		<!-- Projects Grid -->
		<section class="py-20 px-4">
			<div class="container mx-auto max-w-7xl">
				{#if projectsLoaded}
					{#if projects.length > 0}
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{#each projects as project, i (project.id)}
								<article
									class="group relative bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-surface-200/50 dark:border-surface-700/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
									in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
								>
									<!-- Project Header -->
									<header class="p-6 pb-4">
										<div class="flex items-start justify-between mb-4">
											<div class="flex-1">
												<h2
													class="text-xl font-bold text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
												>
													{project.name}
												</h2>
											</div>
											<div
												class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300"
											>
												<i class="fa-solid fa-code text-white text-sm"></i>
											</div>
										</div>
									</header>

									<!-- Project Screenshot -->
									{#if project.screenshot}
										<div class="px-6 mb-4">
											<a
												href={project.url}
												target="_blank"
												rel="noopener noreferrer"
												class="block group-hover:scale-105 transition-transform duration-300"
											>
												<div class="relative overflow-hidden rounded-xl shadow-md">
													<img
														src={project.screenshot}
														alt="{project.name} screenshot"
														class="w-full aspect-video object-cover"
														loading="lazy"
													/>
													<div
														class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
													></div>
													<div
														class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
													>
														<div
															class="w-12 h-12 bg-white/90 dark:bg-surface-800/90 rounded-full flex items-center justify-center shadow-lg"
														>
															<i class="fa-solid fa-external-link-alt text-primary-600 text-lg"></i>
														</div>
													</div>
												</div>
											</a>
										</div>
									{:else}
										<!-- Placeholder for projects without screenshots -->
										<div class="px-6 mb-4">
											<div
												class="aspect-video bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-xl flex items-center justify-center border border-primary-500/30"
											>
												<div class="text-center space-y-2">
													<i class="fa-solid fa-code text-4xl text-primary-500/60"></i>
													<p class="text-sm text-surface-600 dark:text-surface-400">
														Project Preview
													</p>
												</div>
											</div>
										</div>
									{/if}

									<!-- Project Description -->
									{#if project.description}
										<div class="px-6 mb-4">
											<p class="text-surface-600 dark:text-surface-400 leading-relaxed">
												{project.description}
											</p>
										</div>
									{/if}

									<!-- Technologies -->
									{#if project.technologies && project.technologies.length > 0}
										<div class="px-6 mb-6">
											<h3 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
												Technologies:
											</h3>
											<div class="flex flex-wrap gap-2">
												{#each project.technologies as technology (technology.name)}
													<span
														class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full border border-primary-500/30 text-xs font-medium text-surface-700 dark:text-surface-300"
													>
														{#if technology.icon}
															<i class="{technology.icon} mr-1.5"></i>
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
											class="group inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
										>
											<span>View Project</span>
											<svg
												class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
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
						<div class="text-center py-20">
							<div
								class="w-24 h-24 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
							>
								<i class="fa-solid fa-folder-open text-4xl text-surface-500 dark:text-surface-400"
								></i>
							</div>
							<h3 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
								No Projects Found
							</h3>
							<p class="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
								Projects are currently being updated. Check back soon for new and exciting work!
							</p>
						</div>
					{/if}
				{:else}
					<!-- Loading State -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
						{#each Array(6) as _, i (i)}
							<div
								class="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-surface-200/50 dark:border-surface-700/50 animate-pulse"
							>
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<div class="h-6 bg-surface-300 dark:bg-surface-600 rounded w-3/4"></div>
										<div class="w-10 h-10 bg-surface-300 dark:bg-surface-600 rounded-lg"></div>
									</div>
									<div class="aspect-video bg-surface-300 dark:bg-surface-600 rounded-xl"></div>
									<div class="space-y-2">
										<div class="h-4 bg-surface-300 dark:bg-surface-600 rounded w-full"></div>
										<div class="h-4 bg-surface-300 dark:bg-surface-600 rounded w-2/3"></div>
									</div>
									<div class="flex gap-2">
										<div class="h-6 bg-surface-300 dark:bg-surface-600 rounded-full w-16"></div>
										<div class="h-6 bg-surface-300 dark:bg-surface-600 rounded-full w-20"></div>
									</div>
									<div class="h-10 bg-surface-300 dark:bg-surface-600 rounded-xl"></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<!-- Call to Action -->
		<section
			class="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
		>
			<div class="container mx-auto max-w-4xl text-center">
				<div class="space-y-8">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50">
						Interested in Working Together?
					</h3>
					<p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
						I'm always open to new opportunities and exciting projects. Let's connect and discuss
						how we can create something amazing together.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/contact"
							class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
						>
							<span>Get In Touch</span>
							<svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							class="inline-flex items-center px-8 py-4 border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300"
						>
							<span>View GitHub</span>
							<i class="fab fa-github ml-2"></i>
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}

<style>
	.bg-grid-pattern {
		background-image:
			linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
