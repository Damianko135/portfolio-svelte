<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Icon } from '$lib';

	let visible = $state(false);
	let formSubmitted = $state(false);
	let isSubmitting = $state(false);

	$effect(() => {
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
			value: 'Usually within a work day',
			href: null,
			color: 'from-primary-500 to-primary-600'
		}
	];

	const socialLinks = [
		{
			platform: 'LinkedIn',
			href: 'https://www.linkedin.com/in/dkorver/',
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
		}
		// {
		// 	platform: 'Twitter',
		// 	href: 'https://twitter.com/damianko135',
		// 	icon: 'mdi:twitter',
		// 	color: 'hover:bg-tertiary-600',
		// 	description: 'Follow along'
		// }
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
						<Icon icon="mdi:send" class="text-primary-600 mr-2" />
						<span class="text-surface-700 dark:text-surface-300 text-sm font-medium"
							>Drop me a line</span
						>
					</div>

					<h1 class="text-4xl font-bold md:text-6xl">
						<span
							class="from-primary-600 via-secondary-600 to-tertiary-600 block bg-gradient-to-r bg-clip-text text-transparent"
						>
							Let's chat
						</span>
					</h1>

					<p
						class="text-surface-600 dark:text-surface-400 mx-auto max-w-3xl text-xl leading-relaxed"
					>
						Got a question? Want to work on something cool together? Or just want to say hi? I'd
						love to hear from you!
					</p>
				</div>
			</div>
		</section>

		<!-- Contact Methods -->
		<section class="px-4 py-12">
			<div class="container mx-auto max-w-4xl">
				<div class="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
					{#each contactMethods as method, i (method.title)}
						<div
							class="group dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="mx-auto mb-4 h-16 w-16 bg-gradient-to-r {method.color} flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={method.icon} class="text-2xl text-white" />
							</div>
							<h3 class="text-surface-900 dark:text-surface-50 mb-2 text-lg font-bold">
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
		<section class="px-4 py-12">
			<div class="container mx-auto max-w-6xl">
				<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
					<!-- Contact Form -->
					<div class="space-y-8" in:fly={{ x: -30, duration: 600, delay: 300 }}>
						<div
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white/60 p-8 shadow-lg backdrop-blur-sm"
						>
							<div class="mb-8">
								<h2 class="text-surface-900 dark:text-surface-50 mb-2 text-2xl font-bold">
									Send me a message
								</h2>
								<div
									class="from-primary-500 to-secondary-500 h-1 w-16 rounded-full bg-gradient-to-r"
								></div>
							</div>

							{#if formSubmitted}
								<div class="space-y-4 py-8 text-center" in:fly={{ y: 20, duration: 400 }}>
									<div
										class="bg-success-500 mx-auto flex h-16 w-16 items-center justify-center rounded-full"
									>
										<Icon icon="mdi:check" class="text-2xl text-white" />
									</div>
									<h3 class="text-surface-900 dark:text-surface-50 text-xl font-bold">Got it!</h3>
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
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												Name *
											</label>
											<input
												id="name"
												type="text"
												bind:value={name}
												required
												disabled={isSubmitting}
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 w-full rounded-xl border bg-white/50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder="Your name"
											/>
										</div>

										<div>
											<label
												for="email"
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												Email *
											</label>
											<input
												id="email"
												type="email"
												bind:value={email}
												required
												disabled={isSubmitting}
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 w-full rounded-xl border bg-white/50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder="your.email@example.com"
											/>
										</div>

										<div>
											<label
												for="message"
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												Message *
											</label>
											<textarea
												id="message"
												bind:value={message}
												required
												disabled={isSubmitting}
												rows="5"
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 w-full resize-none rounded-xl border bg-white/50 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder="Your message..."
											></textarea>
										</div>
									</div>

									<button
										type="submit"
										disabled={isSubmitting || !name || !email || !message}
										class="group from-primary-500 to-secondary-500 flex w-full transform items-center justify-center rounded-xl bg-gradient-to-r px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
									>
										{#if isSubmitting}
											<svg
												class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
												class="mr-2 transition-transform duration-200 group-hover:translate-x-1"
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
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white/60 p-8 shadow-lg backdrop-blur-sm"
						>
							<div class="mb-8">
								<h3 class="text-surface-900 dark:text-surface-50 mb-2 text-2xl font-bold">
									Connect With Me
								</h3>
								<div
									class="from-primary-500 to-secondary-500 h-1 w-16 rounded-full bg-gradient-to-r"
								></div>
							</div>

							<div class="space-y-4">
								{#each socialLinks as social, i (social.platform)}
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										class="group dark:bg-surface-900/50 flex items-center rounded-xl bg-white/50 p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg"
										in:fly={{ x: 20, duration: 400, delay: 500 + i * 100 }}
									>
										<div
											class="bg-surface-700 h-12 w-12 {social.color} mr-4 flex items-center justify-center rounded-lg transition-all duration-300"
										>
											<Icon icon={social.icon} class="text-white" />
										</div>
										<div class="flex-1">
											<h4
												class="text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-semibold transition-colors duration-200"
											>
												{social.platform}
											</h4>
											<p class="text-surface-600 dark:text-surface-400 text-sm">
												{social.description}
											</p>
										</div>
										<Icon
											icon="mdi:arrow-right"
											class="text-surface-400 group-hover:text-primary-500 transition-all duration-200 group-hover:translate-x-1"
										/>
									</a>
								{/each}
							</div>
						</div>

						<!-- Additional Info -->
						<div
							class="from-primary-500/10 to-secondary-500/10 border-primary-500/20 rounded-2xl border bg-gradient-to-br p-8 backdrop-blur-sm"
						>
							<div class="space-y-4 text-center">
								<div
									class="from-primary-500 to-secondary-500 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br"
								>
									<Icon icon="mdi:lightbulb" class="text-2xl text-white" />
								</div>
								<h4 class="text-surface-900 dark:text-surface-50 text-xl font-bold">
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
