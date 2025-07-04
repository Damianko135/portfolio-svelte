<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let visible = $state(false);
	onMount(() => {
		visible = true;
	});

	const skills = [
		{ name: 'Proxmox', icon: 'fa-solid fa-server', color: 'text-orange-500' },
		{ name: 'VMware', icon: 'fa-solid fa-laptop-code', color: 'text-blue-500' },
		{ name: 'Hyper-V', icon: 'fa-brands fa-windows', color: 'text-blue-600' },
		{ name: 'Active Directory', icon: 'fa-solid fa-sitemap', color: 'text-purple-500' },
		{ name: 'Docker', icon: 'fa-brands fa-docker', color: 'text-blue-400' },
		{ name: 'Networking', icon: 'fa-solid fa-network-wired', color: 'text-green-500' },
		{ name: 'Firewall', icon: 'fa-solid fa-shield-alt', color: 'text-red-500' },
		{ name: 'SvelteKit', icon: 'fa-brands fa-svelte', color: 'text-orange-600' }
	];

	const interests = [
		{ name: 'Penetration Testing', icon: 'fa-solid fa-user-secret', color: 'text-red-600' },
		{ name: 'Red Teaming', icon: 'fa-solid fa-flag', color: 'text-red-500' },
		{ name: 'Purple Teaming', icon: 'fa-solid fa-yin-yang', color: 'text-purple-500' }
	];

	const timeline = [
		{
			year: '2023 - Present',
			title: 'Studying Cybersecurity',
			organization: 'Hogeschool Utrecht',
			description:
				'Learning Applied Computer Science with a focus on cybersecurity and cloud stuff. Lots of labs, projects, and figuring things out.',
			color: 'from-blue-500 to-purple-500'
		},
		{
			year: '2022',
			title: 'Started my homelab',
			organization: 'Self-taught',
			description:
				'Built my own lab setup with Proxmox, Docker, and various tools. Breaking things and learning how to fix them.',
			color: 'from-green-500 to-blue-500'
		},
		{
			year: '2021',
			title: 'Got into cybersecurity',
			organization: 'Self-taught',
			description: 'Started exploring security concepts, networking, and system administration. The rabbit hole began.',
			color: 'from-purple-500 to-pink-500'
		}
	];
</script>

<svelte:head>
	<title>About - Damian Korver</title>
	<meta
		name="description"
		content="Get to know Damian Korver, a cybersecurity student who loves tinkering with tech and building cool projects."
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

			<div class="relative container mx-auto max-w-4xl text-center">
				<div class="space-y-8" in:fly={{ y: 30, duration: 800, delay: 200 }}>
					<div
						class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 backdrop-blur-sm"
					>
						<span class="text-sm font-medium text-surface-700 dark:text-surface-300"
							>Here's my story</span
						>
					</div>

					<h1 class="text-4xl md:text-6xl font-bold">
						<span class="block text-surface-900 dark:text-surface-50">Hello!</span>
						<span
							class="block bg-gradient-to-r from-primary-600 via-secondary-600 to-tertiary-600 bg-clip-text text-transparent"
						>
							I'm Damian Korver
						</span>
					</h1>

					<div class="flex flex-wrap justify-center gap-4 pt-4">
						<div
							class="flex items-center px-4 py-2 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-full border border-surface-200/50 dark:border-surface-700/50"
						>
							<i class="fa-solid fa-location-dot text-emerald-500 mr-2"></i>
							<span class="text-sm font-medium">Netherlands</span>
						</div>
						<div
							class="flex items-center px-4 py-2 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-full border border-surface-200/50 dark:border-surface-700/50"
						>
							<i class="fa-solid fa-user-graduate text-blue-500 mr-2"></i>
							<span class="text-sm font-medium">Student</span>
						</div>
						<div
							class="flex items-center px-4 py-2 bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-full border border-surface-200/50 dark:border-surface-700/50"
						>
							<i class="fa-solid fa-cloud text-purple-500 mr-2"></i>
							<span class="text-sm font-medium">Tech Enthusiast</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- About Story -->
		<section
			class="py-20 px-4 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
		>
			<div class="container mx-auto max-w-4xl">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div class="space-y-6" in:fly={{ x: -30, duration: 600, delay: 300 }}>
						<h2 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50">
							How I got here
						</h2>
						<div
							class="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
						></div>
						<div class="space-y-4 text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
							<p>
								I love learning about tech, especially when it comes to keeping things secure
								and making them work in the cloud. Right now I'm studying cybersecurity at 
								Hogeschool Utrecht and having a blast figuring out how systems work.
							</p>
							<p>
								My goal? To become really good at protecting digital stuff and building 
								cloud solutions that actually make sense. I want to be someone who can 
								look at a problem and know how to solve it securely.
							</p>
							<p>
								Come along for the ride as I build things with SvelteKit, dive deeper into 
								security concepts, and explore whatever new tech catches my eye next.
							</p>
						</div>
					</div>

					<div class="relative" in:fly={{ x: 30, duration: 600, delay: 400 }}>
						<div
							class="relative bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-2xl"
						>
							<div class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
							<div class="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
							<div class="relative space-y-4">
								<h3 class="text-2xl font-bold">Current Focus</h3>
								<ul class="space-y-3">
									<li class="flex items-center">
										<i class="fa-solid fa-graduation-cap mr-3"></i>
										<span>Cyber Security Studies</span>
									</li>
									<li class="flex items-center">
										<i class="fa-solid fa-server mr-3"></i>
										<span>Homelab Development</span>
									</li>
									<li class="flex items-center">
										<i class="fa-solid fa-code mr-3"></i>
										<span>Full-Stack Development</span>
									</li>
									<li class="flex items-center">
										<i class="fa-solid fa-shield-alt mr-3"></i>
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
		<section class="py-20 px-4">
			<div class="container mx-auto max-w-4xl">
				<div class="text-center mb-16">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						My Timeline
					</h3>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="relative">
					<!-- Timeline Line -->
					<div
						class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 transform md:-translate-x-1/2"
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
									class="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-r {item.color} rounded-full transform -translate-x-1/2 z-10 shadow-lg"
								></div>

								<!-- Content -->
								<div class="ml-12 md:ml-0 md:w-1/2 {i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}">
									<div
										class="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300"
									>
										<div class="space-y-3">
											<div class="text-sm font-medium text-primary-600 dark:text-primary-400">
												{item.year}
											</div>
											<h4 class="text-xl font-bold text-surface-900 dark:text-surface-50">
												{item.title}
											</h4>
											<div class="text-sm font-medium text-secondary-600 dark:text-secondary-400">
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
			class="py-20 px-4 bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800"
		>
			<div class="container mx-auto max-w-6xl">
				<div class="text-center mb-16">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						What I know
					</h3>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
					{#each skills as skill, i (skill.name)}
						<div
							class="group bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-md border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 50 }}
						>
							<div
								class="text-4xl {skill.color} mb-3 group-hover:scale-110 transition-transform duration-300"
							>
								<i class={skill.icon}></i>
							</div>
							<p class="font-semibold text-surface-900 dark:text-surface-50">{skill.name}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Interests Section -->
		<section class="py-20 px-4">
			<div class="container mx-auto max-w-4xl">
				<div class="text-center mb-16">
					<h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 mb-4">
						What gets me excited
					</h3>
					<div
						class="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"
					></div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
					{#each interests as interest, i (interest.name)}
						<div
							class="group bg-gradient-to-br from-white/60 to-surface-50/60 dark:from-surface-800/60 dark:to-surface-700/60 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-surface-200/50 dark:border-surface-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105"
							in:fly={{ y: 30, duration: 600, delay: 200 + i * 100 }}
						>
							<div
								class="text-5xl {interest.color} mb-4 group-hover:scale-110 transition-transform duration-300"
							>
								<i class={interest.icon}></i>
							</div>
							<h4 class="text-lg font-bold text-surface-900 dark:text-surface-50">
								{interest.name}
							</h4>
						</div>
					{/each}
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
