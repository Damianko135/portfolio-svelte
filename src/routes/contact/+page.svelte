<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Icon } from '$lib';

	let visible = $state(false);
	let formSubmitted = $state(false);
	let isSubmitting = $state(false);

	onMount(() => {
		visible = true;
	});

	let name: string = $state('');
	let email: string = $state('');
	let message: string = $state('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (name && email && message) {
			isSubmitting = true;
			// Simulate form submission
			setTimeout(() => {
				isSubmitting = false;
				formSubmitted = true;
				// Reset form after successful submission
				setTimeout(() => {
					name = '';
					email = '';
					message = '';
					formSubmitted = false;
				}, 3000);
			}, 1500);
		}
	}

	const contactMethods = [
		{
			icon: 'mdi:email',
			title: 'Email',
			value: 'damiankorver@gmail.com',
			href: 'mailto:damiankorver@gmail.com',
			color: 'from-error-500 to-error-600'
		},
		{
			icon: 'mdi:map-marker',
			title: 'Location',
			value: 'Netherlands',
			href: null,
			color: 'from-success-500 to-success-600'
		},
		{
			icon: 'mdi:clock-outline',
			title: 'Response Time',
			value: 'Usually within a day',
			href: null,
			color: 'from-primary-500 to-primary-600'
		}
	];

	const socialLinks = [
		{
			platform: 'LinkedIn',
			href: 'https://www.linkedin.com/in/damian-korver/',
			icon: 'mdi:linkedin',
			color: 'hover:bg-primary-600',
			description: 'Connect with me'
		},
		{
			platform: 'GitHub',
			href: 'https://github.com/damianko135',
			icon: 'mdi:github',
			color: 'hover:bg-surface-900',
			description: 'Check out my code'
		},
		{
			platform: 'Twitter',
			href: 'https://twitter.com/damianko135',
			icon: 'mdi:twitter',
			color: 'hover:bg-tertiary-600',
			description: 'Follow along'
		}
	];
</script>

<svelte:head>
	<title>Contact - Damian Korver</title>
	<meta
		name="description"
		content="Want to chat with Damian Korver? Drop me a line about tech, projects, or just to say hi. I'd love to hear from you!"
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
						<Icon icon="mdi:send" class="text-primary-600 mr-2" />
						<span class="text-sm font-medium text-surface-700 dark:text-surface-300"
							>Drop me a line</span
						>
					</div>

					<h1 class="text-4xl md:text-6xl font-bold">
						<span
							class="block bg-gradient-to-r from-primary-600 via-secondary-600 to-tertiary-600 bg-clip-text text-transparent"
						>
							Let's chat
						</span>
					</h1>

					<p
						class="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed"
					>
						Got a question? Want to work on something cool together? Or just want to say hi? I'd
						love to hear from you!
					</p>
				</div>
			</div>
		</section>

		<!-- Contact Methods -->
		<section class="py-12 px-4">
			<div class="container mx-auto max-w-4xl">
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
					{#each contactMethods as method, i (method.title)}
						<div
							class="group bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-surface-200/50 dark:border-surface-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r {method.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
							>
								<Icon icon={method.icon} class="text-white text-2xl" />
							</div>
							<h3 class="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">
								{method.title}
							</h3>
							{#if method.href}
								<a
									href={method.href}
									class="text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
								>
									{method.value}
								</a>
							{:else}
								<p class="text-surface-600 dark:text-surface-400">{method.value}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Main Content -->
		<section class="py-12 px-4">
			<div class="container mx-auto max-w-6xl">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<!-- Contact Form -->
					<div class="space-y-8" in:fly={{ x: -30, duration: 600, delay: 300 }}>
						<div
							class="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-surface-200/50 dark:border-surface-700/50"
						>
							<div class="mb-8">
								<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">
									Send me a message
								</h2>
								<div
									class="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
								></div>
							</div>

							{#if formSubmitted}
								<div class="text-center py-8 space-y-4" in:fly={{ y: 20, duration: 400 }}>
									<div
										class="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto"
									>
										<Icon icon="mdi:check" class="text-white text-2xl" />
									</div>
									<h3 class="text-xl font-bold text-surface-900 dark:text-surface-50">Got it!</h3>
									<p class="text-surface-600 dark:text-surface-400">
										Thanks for reaching out! I'll get back to you soon.
									</p>
								</div>
							{:else}
								<form onsubmit={handleSubmit} class="space-y-6">
									<div class="space-y-4">
										<div>
											<label
												for="name"
												class="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2"
											>
												Name *
											</label>
											<input
												id="name"
												type="text"
												bind:value={name}
												required
												disabled={isSubmitting}
												class="w-full px-4 py-3 bg-white/50 dark:bg-surface-900/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
												placeholder="Your name"
											/>
										</div>

										<div>
											<label
												for="email"
												class="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2"
											>
												Email *
											</label>
											<input
												id="email"
												type="email"
												bind:value={email}
												required
												disabled={isSubmitting}
												class="w-full px-4 py-3 bg-white/50 dark:bg-surface-900/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
												placeholder="your.email@example.com"
											/>
										</div>

										<div>
											<label
												for="message"
												class="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2"
											>
												Message *
											</label>
											<textarea
												id="message"
												bind:value={message}
												required
												disabled={isSubmitting}
												rows="5"
												class="w-full px-4 py-3 bg-white/50 dark:bg-surface-900/50 border border-surface-300 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none disabled:opacity-50"
												placeholder="Your message..."
											></textarea>
										</div>
									</div>

									<button
										type="submit"
										disabled={isSubmitting || !name || !email || !message}
										class="group w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
									>
										{#if isSubmitting}
											<svg
												class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Sending...
										{:else}
											<Icon
												icon="mdi:send"
												class="mr-2 group-hover:translate-x-1 transition-transform duration-200"
											/>
											Send it my way
										{/if}
									</button>
								</form>
							{/if}
						</div>
					</div>

					<!-- Social Links & Info -->
					<div class="space-y-8" in:fly={{ x: 30, duration: 600, delay: 400 }}>
						<!-- Social Media -->
						<div
							class="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-surface-200/50 dark:border-surface-700/50"
						>
							<div class="mb-8">
								<h3 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">
									Connect With Me
								</h3>
								<div
									class="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
								></div>
							</div>

							<div class="space-y-4">
								{#each socialLinks as social, i (social.platform)}
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										class="group flex items-center p-4 bg-white/50 dark:bg-surface-900/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
										in:fly={{ x: 20, duration: 400, delay: 500 + i * 100 }}
									>
										<div
											class="w-12 h-12 bg-surface-700 {social.color} rounded-lg flex items-center justify-center transition-all duration-300 mr-4"
										>
											<Icon icon={social.icon} class="text-white" />
										</div>
										<div class="flex-1">
											<h4
												class="font-semibold text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200"
											>
												{social.platform}
											</h4>
											<p class="text-sm text-surface-600 dark:text-surface-400">
												{social.description}
											</p>
										</div>
										<Icon
											icon="mdi:arrow-right"
											class="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200"
										/>
									</a>
								{/each}
							</div>
						</div>

						<!-- Additional Info -->
						<div
							class="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20"
						>
							<div class="text-center space-y-4">
								<div
									class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto"
								>
									<Icon icon="mdi:lightbulb" class="text-white text-2xl" />
								</div>
								<h4 class="text-xl font-bold text-surface-900 dark:text-surface-50">
									Let's Collaborate
								</h4>
								<p class="text-surface-600 dark:text-surface-400 leading-relaxed">
									I'm always excited to work on interesting projects, discuss cybersecurity topics,
									or explore new opportunities in cloud technologies.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}

<style>
	.bg-grid-pattern {
		background-image:
			linear-gradient(rgba(var(--color-primary-500) / 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(var(--color-primary-500) / 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
