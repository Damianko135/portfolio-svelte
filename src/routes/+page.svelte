<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { AboutItem, Interest } from '$lib/types';

	// Using the new $state syntax for reactive variables
	let visible = $state(false);
	let heroVisible = $state(false);

	// Arrays for lists with proper typing (these don't need to be reactive)
	const aboutItems: AboutItem[] = [
		{ icon: 'fa-solid fa-location-dot', text: 'Netherlands', color: 'text-emerald-500' },
		{
			icon: 'fa-solid fa-user-graduate',
			text: 'Student at Hogeschool Utrecht',
			subText: 'University of Applied Sciences, Utrecht',
			color: 'text-blue-500'
		},
		{ icon: 'fa-solid fa-server', text: 'Studying Cyber Security & Cloud', color: 'text-purple-500' }
	];

	const interests: Interest[] = [
		{ icon: 'fa-solid fa-shield-alt', text: 'Security', color: 'text-red-500' },
		{ icon: 'fa-solid fa-cloud', text: 'Cloud', color: 'text-blue-400' },
		{ icon: 'fa-solid fa-network-wired', text: 'Networking', color: 'text-green-500' },
		{ icon: 'fa-solid fa-fire', text: 'Firewalls', color: 'text-orange-500' },
		{ icon: 'fa-solid fa-terminal', text: 'Command', color: 'text-gray-400' },
		{ icon: 'fa-brands fa-linux', text: 'Linux', color: 'text-yellow-500' },
		{ icon: 'fa-brands fa-windows', text: 'Windows', color: 'text-blue-600' }
	];

	const skills = [
		{ icon: 'fa-brands fa-golang', name: 'Golang', color: 'text-cyan-400' },
		{ icon: 'fa-brands fa-js', name: 'JavaScript', color: 'text-yellow-400' },
		{ icon: 'fa-brands fa-docker', name: 'Docker', color: 'text-blue-500' },
		{ icon: 'fa-brands fa-linux', name: 'Linux', color: 'text-yellow-500' }
	];

	onMount(() => {
		visible = true;
		setTimeout(() => {
			heroVisible = true;
		}, 200);
	});
</script>

<svelte:head>
	<title>Damian Korver - Student & Tech Enthusiast</title>
	<meta
		name="description"
		content="Damian Korver, a cybersecurity student who loves working with servers, networks, and figuring out how things work."
	/>
	<meta
		name="keywords"
		content="Damian Korver, Cyber Security, Cloud, Networking, Golang, SvelteKit, Student, Hogeschool Utrecht"
	/>
	<meta property="og:title" content="Damian Korver - Student & Tech Enthusiast" />
	<meta
		property="og:description"
		content="A cybersecurity student who loves tinkering with tech and building cool projects."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://dkorver.com" />
</svelte:head>

{#if visible}
	<div class="relative overflow-hidden">
		<!-- Hero Section -->
		<section class="relative min-h-screen flex items-center justify-center px-4 py-20">
			<!-- Animated Background Elements -->
			<div class="absolute inset-0 overflow-hidden">
				<div
					class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
				></div>
				<div
					class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
					style="animation-delay: 2s;"
				></div>
				<div
					class="absolute top-40 left-1/3 w-60 h-60 bg-tertiary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
					style="animation-delay: 4s;"
				></div>
			</div>

			<div class="relative z-10 text-center space-y-8 max-w-4xl mx-auto">
				{#if heroVisible}
					<div class="space-y-6" in:fly={{ y: 30, duration: 800, delay: 300 }}>					<div
						class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 backdrop-blur-sm"
					>
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
						<span class="text-sm font-medium text-surface-700 dark:text-surface-300"
							>Open to new projects</span
						>
					</div>

						<h1 class="text-5xl md:text-7xl font-bold leading-tight">
							<span class="block text-surface-900 dark:text-surface-50">Hey there!</span>
							<span
								class="block bg-gradient-to-r from-primary-600 via-secondary-600 to-tertiary-600 bg-clip-text text-transparent"
							>
								I'm Damian Korver
							</span>
						</h1>					<p
						class="text-xl md:text-2xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
					>
						I'm a cybersecurity student at Hogeschool Utrecht who loves tinkering with servers, 
						setting up networks, and figuring out how things work (and sometimes how they break). 
						When I'm not studying, you'll find me working on side projects or learning something new.
					</p>

						<div class="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
							<a
								href="/projects"
								class="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
							>
								<span>Check out my projects</span>
								<svg
									class="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
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
								class="inline-flex items-center px-8 py-4 border-2 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300"
							>
								Say hello
							</a>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- About Cards -->
		<section class="py-20 px-4">
			<div class="container mx-auto max-w-6xl">
				<div class="text-center mb-16" in:fly={{ y: 30, duration: 600, delay: 100 }}>
					<h2 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						A bit about me
					</h2>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					{#each aboutItems as item, i (item.text)}
						<div
							class="group relative bg-white/50 dark:bg-surface-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-surface-200/50 dark:border-surface-700/50 hover:shadow-2xl transition-all duration-500 hover:scale-105"
							in:fly={{ y: 30, duration: 600, delay: 200 + i * 100 }}
						>
							<div
								class="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity"
							></div>
							<div class="text-center space-y-4">
								<div
									class="w-16 h-16 mx-auto bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-600 rounded-2xl flex items-center justify-center shadow-inner"
								>
									<i class="{item.icon} text-3xl {item.color}"></i>
								</div>
								<div class="space-y-2">
									<h3 class="font-bold text-lg text-surface-900 dark:text-surface-50">
										{item.text}
									</h3>
									{#if item.subText}
										<p class="text-sm text-surface-600 dark:text-surface-400">{item.subText}</p>
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
			class="py-20 px-4 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
		>
			<div class="container mx-auto max-w-6xl">
				<div class="text-center mb-16">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						What I work with
					</h3>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
					{#each skills as skill, i (skill.name)}
						<div
							class="group bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300 hover:scale-110"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="text-4xl {skill.color} mb-3 group-hover:scale-110 transition-transform duration-300"
							>
								<i class={skill.icon}></i>
							</div>
							<p class="font-semibold text-surface-900 dark:text-surface-50">{skill.name}</p>
						</div>
					{/each}

					<!-- SvelteKit card -->
					<div
						class="group bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300 hover:scale-110"
						in:fly={{ y: 30, duration: 600, delay: 600 }}
					>
						<div
							class="text-4xl text-orange-500 mb-3 group-hover:scale-110 transition-transform duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 256 308"
								class="w-10 h-10 mx-auto"
							>
								<path
									fill="currentColor"
									d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.2 82.2 0 0 0-37.135 55.056a86.57 86.57 0 0 0 8.536 55.576a82.4 82.4 0 0 0-12.296 30.719a87.6 87.6 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.18 82.18 0 0 0 37.135-55.057a86.6 86.6 0 0 0-8.53-55.577a82.4 82.4 0 0 0 12.29-30.718a87.57 87.57 0 0 0-14.963-66.244"
								/>
							</svg>
						</div>
						<p class="font-semibold text-surface-900 dark:text-surface-50">SvelteKit</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Interests Section -->
		<section class="py-20 px-4">
			<div class="container mx-auto max-w-6xl">
				<div class="text-center mb-16">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						Things I'm into
					</h3>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
					{#each interests as interest, i (interest.text)}
						<div
							class="group bg-gradient-to-br from-white/60 to-surface-50/60 dark:from-surface-800/60 dark:to-surface-700/60 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="text-3xl {interest.color} mb-3 group-hover:scale-110 transition-transform duration-300"
							>
								<i class={interest.icon}></i>
							</div>
							<p class="font-semibold text-surface-900 dark:text-surface-50">{interest.text}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Contact Section -->
		<section
			class="py-20 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
		>
			<div class="container mx-auto max-w-4xl text-center">
				<div class="space-y-8">
					<div>
						<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
							Want to chat?
						</h3>
						<p class="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
							Feel free to reach out if you want to talk about tech, collaborate on something cool, 
							or just say hi. I'm always up for a good conversation.
						</p>
					</div>

					<div class="flex justify-center space-x-6">
						<a
							href="https://www.linkedin.com/in/dkorver/"
							class="group w-16 h-16 bg-gradient-to-br from-[#0077B5] to-[#005885] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
							aria-label="LinkedIn Profile"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i
								class="fab fa-linkedin text-white text-2xl group-hover:scale-110 transition-transform duration-300"
							></i>
						</a>
						<a
							href="https://github.com/damianko135"
							class="group w-16 h-16 bg-gradient-to-br from-surface-800 to-surface-900 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
							aria-label="GitHub Profile"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i
								class="fab fa-github text-white text-2xl group-hover:scale-110 transition-transform duration-300"
							></i>
						</a>
						<a
							href="mailto:damiankorver@gmail.com"
							class="group w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
							aria-label="Email Contact"
						>
							<i
								class="fas fa-envelope text-white text-2xl group-hover:scale-110 transition-transform duration-300"
							></i>
						</a>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}
