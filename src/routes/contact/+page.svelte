<script lang="ts">
	import { enhance } from '$app/forms';
	import { Icon } from '$lib';
	import * as m from '$lib/paraglide/messages.js';
	import { fade, fly } from 'svelte/transition';
	import type { ActionData } from './$types';

	type ContactMethod = {
		icon: string;
		title: string;
		color: string;
		value?: string;
		getValue?: () => string;
		href?: string | null;
		clickHandler?: (event: Event) => void;
	};

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();

	let visible = $state(false);
	let isSubmitting = $state(false);
	let showSuccessMessage = $state(false);
	const contactFormStatusId = 'contact-form-status';
	const contactFormErrorId = 'contact-form-error';
	const nameHintId = 'contact-name-hint';
	const messageHintId = 'contact-message-hint';

	let statusMessage = $derived.by(() => {
		if (isSubmitting) return m.contact_form_sending();
		if (form?.error) return form.error;
		if (showSuccessMessage) return form?.message || m.contact_form_success();
		return '';
	});

	$effect(() => {
		visible = true;
	});

	// Check if form was successfully submitted
	$effect(() => {
		if (form?.success) {
			isSubmitting = false;
			showSuccessMessage = true;
		}
	});

	function resetForm() {
		showSuccessMessage = false;
		form = undefined;
	}

	// Email obfuscation
	const emailParts = ['damiankorver', 'gmail', 'com'];
	const getEmail = () => `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`;
	const getObfuscatedEmail = () => `${emailParts[0]} [at] ${emailParts[1]} [dot] ${emailParts[2]}`;

	let emailRevealed = $state(false);

	function handleEmailClick(event: Event) {
		event.preventDefault();
		if (!emailRevealed) {
			emailRevealed = true;
			// Small delay to show the reveal animation, then open email client
			setTimeout(() => {
				window.location.href = `mailto:${getEmail()}`;
			}, 500);
		} else {
			window.location.href = `mailto:${getEmail()}`;
		}
	}

	const contactMethods: ContactMethod[] = [
		{
			icon: 'mdi:email',
			title: m.contact_email(),
			getValue: () => (emailRevealed ? getEmail() : getObfuscatedEmail()),
			href: `mailto:${getEmail()}`,
			color: 'from-error-500 to-error-600',
			clickHandler: handleEmailClick
		},
		{
			icon: 'mdi:map-marker',
			title: m.contact_location(),
			value: m.home_location(),
			href: null,
			color: 'from-success-500 to-success-600'
		},
		{
			icon: 'mdi:clock-outline',
			title: m.contact_response_time(),
			value: m.contact_response_time_value(),
			href: null,
			color: 'from-primary-500 to-primary-600'
		}
	];

	const socialLinks = [
		{
			platform: m.contact_social_linkedin(),
			href: 'https://www.linkedin.com/in/dkorver/',
			icon: 'mdi:linkedin',
			color: 'hover:bg-primary-600',
			description: m.contact_social_connect()
		},
		{
			platform: m.contact_social_github(),
			href: 'https://github.com/damianko135',
			icon: 'mdi:github',
			color: 'hover:bg-surface-900',
			description: m.contact_social_github_desc()
		}
	];
</script>

<svelte:head>
	<title>{m.contact_title()}</title>
	<meta name="description" content={m.contact_meta_description()} />
	<!-- Canonical URL -->
	<link rel="canonical" href="https://dkorver.nl/contact" />
	<!-- Open Graph -->
	<meta property="og:title" content={m.contact_title()} />
	<meta property="og:description" content={m.contact_meta_description()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://dkorver.nl/contact" />
	<meta property="og:image" content="/favicon.svg" />
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={m.contact_title()} />
	<meta name="twitter:description" content={m.contact_meta_description()} />
	<meta name="twitter:image" content="/favicon.svg" />
	<!-- Alternate language -->
	<link rel="alternate" hrefLang="en" href="https://dkorver.nl/contact" />
	<link rel="alternate" hrefLang="nl" href="https://dkorver.nl/nl/contact" />
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
						class="from-primary-500/12 to-secondary-500/12 border-primary-500/20 inline-flex items-center rounded-full border bg-linear-to-r px-6 py-3 backdrop-blur-sm"
					>
						<Icon icon="mdi:send" class="text-primary-600 mr-2" />
						<span class="type-kicker text-surface-700 dark:text-surface-300"
							>{m.contact_heading()}</span
						>
					</div>

					<h1 class="type-display">
						<span
							class="from-primary-600 via-secondary-600 to-tertiary-600 block bg-linear-to-r bg-clip-text text-transparent"
						>
							{m.contact_heading()}
						</span>
					</h1>

					<p class="type-lead text-surface-600 dark:text-surface-400 mx-auto max-w-3xl">
						{m.contact_intro()}
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
							class="group dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 rounded-2xl border bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm hover:scale-105 hover:shadow-xl"
							in:fly={{ y: 30, duration: 600, delay: 100 + i * 100 }}
						>
							<div
								class="mx-auto mb-4 h-16 w-16 bg-linear-to-r {method.color} flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
							>
								<Icon icon={method.icon} class="text-2xl text-white" />
							</div>
							<h3 class="text-surface-900 dark:text-surface-50 mb-2 text-lg font-bold">
								{method.title}
							</h3>
							{#if method.clickHandler}
								<button
									onclick={method.clickHandler}
									class="text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer underline-offset-2 transition-colors duration-200 hover:underline"
								>
									{method.getValue ? method.getValue() : method.value}
									{#if method.title === m.contact_email() && !emailRevealed}
										<span class="ml-1 text-xs opacity-60">{m.contact_email_click_to_reveal()}</span>
									{/if}
								</button>
							{:else if method.href}
								<a
									href={method.href}
									class="text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
								>
									{method.getValue ? method.getValue() : method.value}
								</a>
							{:else}
								<p class="text-surface-600 dark:text-surface-400">
									{method.getValue ? method.getValue() : method.value}
								</p>
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
							class="dark:bg-surface-800/60 border-surface-200/50 dark:border-surface-700/50 h-full rounded-2xl border bg-white/60 p-8 shadow-lg backdrop-blur-sm"
						>
							<div class="mb-8">
								<h2 class="type-title text-surface-900 dark:text-surface-50 mb-2">
									{m.contact_form_send_message()}
								</h2>
								<div
									class="from-primary-500 to-secondary-500 h-1 w-16 rounded-full bg-linear-to-r"
								></div>
							</div>

							{#if showSuccessMessage}
								<div class="space-y-4 py-8 text-center" in:fly={{ y: 20, duration: 400 }}>
									<p id={contactFormStatusId} class="sr-only" aria-live="polite" aria-atomic="true">
										{statusMessage}
									</p>
									<div
										class="bg-success-500 mx-auto flex h-16 w-16 items-center justify-center rounded-full"
									>
										<Icon icon="mdi:check" class="text-2xl text-white" />
									</div>
									<h3 class="type-title text-surface-900 dark:text-surface-50">
										{m.contact_form_success()}
									</h3>
									<p class="text-surface-600 dark:text-surface-400 text-lg">
										{form?.message || m.contact_form_success()}
									</p>
									<button
										onclick={resetForm}
										type="button"
										class="from-primary-500 to-secondary-500 mt-4 rounded-xl bg-linear-to-r px-6 py-2 font-semibold text-white shadow-lg hover:scale-105"
									>
										{m.contact_form_send_another()}
									</button>
								</div>
							{:else}
								<form
									method="POST"
									novalidate
									use:enhance={() => {
										isSubmitting = true;
										return async ({ update }) => {
											await update();
											isSubmitting = false;
										};
									}}
									class="space-y-6"
								>
									<p id={contactFormStatusId} class="sr-only" aria-live="polite" aria-atomic="true">
										{statusMessage}
									</p>
									{#if form?.error}
										<div
											id={contactFormErrorId}
											role="alert"
											class="bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 rounded-xl border p-4"
											in:fly={{ y: -10, duration: 300 }}
										>
											<div class="flex items-start">
												<Icon
													icon="mdi:alert-circle"
													class="text-error-600 dark:text-error-400 mt-0.5 mr-3"
												/>
												<p class="text-error-700 dark:text-error-300 text-sm font-medium">
													{form.error}
												</p>
											</div>
										</div>
									{/if}

									<div class="space-y-4">
										<div>
											<label
												for="name"
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												{m.contact_form_name()} *
											</label>
											<input
												id="name"
												name="name"
												type="text"
												value={form?.name ?? ''}
												autocomplete="name"
												minlength="2"
												maxlength="100"
												required
												disabled={isSubmitting}
												aria-describedby={form?.error
													? `${nameHintId} ${contactFormErrorId}`
													: nameHintId}
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 w-full rounded-xl border bg-white/50 px-4 py-3 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder={m.contact_form_name_placeholder()}
											/>
											<p
												id={nameHintId}
												class="text-surface-500 dark:text-surface-400 mt-2 text-xs"
											>
												{m.contact_form_name_hint()}
											</p>
										</div>

										<div>
											<label
												for="email"
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												{m.contact_form_email()} *
											</label>
											<input
												id="email"
												name="email"
												type="email"
												value={form?.email ?? ''}
												autocomplete="email"
												inputmode="email"
												maxlength="254"
												spellcheck="false"
												required
												disabled={isSubmitting}
												aria-describedby={form?.error ? contactFormErrorId : undefined}
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 w-full rounded-xl border bg-white/50 px-4 py-3 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder={m.contact_form_email_placeholder()}
											/>
										</div>

										<div>
											<label
												for="message"
												class="text-surface-700 dark:text-surface-300 mb-2 block text-sm font-semibold"
											>
												{m.contact_form_message()} *
											</label>
											<textarea
												id="message"
												name="message"
												value={form?.message ?? ''}
												required
												disabled={isSubmitting}
												minlength="10"
												maxlength="5000"
												rows="5"
												aria-describedby={form?.error
													? `${messageHintId} ${contactFormErrorId}`
													: messageHintId}
												class="dark:bg-surface-900/50 border-surface-300 dark:border-surface-600 focus:ring-primary-500 mb-4 w-full resize-none rounded-xl border bg-white/50 px-4 py-3 focus:border-transparent focus:ring-2 disabled:opacity-50"
												placeholder={m.contact_form_message_placeholder()}
											></textarea>
											<p
												id={messageHintId}
												class="text-surface-500 dark:text-surface-400 -mt-2 text-xs"
											>
												{m.contact_form_message_hint()}
											</p>
										</div>
									</div>

									<button
										type="submit"
										disabled={isSubmitting}
										class="group from-primary-500 to-secondary-500 flex w-full transform items-center justify-center rounded-xl bg-linear-to-r px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
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
											{m.contact_form_sending()}
										{:else}
											<Icon
												icon="mdi:send"
												class="mr-2 transition-transform duration-200 group-hover:translate-x-1"
											/>
											{m.contact_form_submit()}
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
									{m.contact_connect_with_me()}
								</h3>
								<div
									class="from-primary-500 to-secondary-500 h-1 w-16 rounded-full bg-linear-to-r"
								></div>
							</div>

							<div class="space-y-4">
								{#each socialLinks as social, i (social.platform)}
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										class="group dark:bg-surface-900/50 flex items-center rounded-xl bg-white/50 p-4 hover:scale-105 hover:shadow-lg"
										in:fly={{ x: 20, duration: 400, delay: 500 + i * 100 }}
									>
										<div
											class="bg-surface-700 h-12 w-12 {social.color} mr-4 flex items-center justify-center rounded-lg"
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
											class="text-surface-400 group-hover:text-primary-500 group-hover:translate-x-1"
										/>
									</a>
								{/each}
							</div>
						</div>

						<!-- Additional Info -->
						<div
							class="from-primary-500/10 to-secondary-500/10 border-primary-500/20 bg-linear-to- rounded-2xl border p-8 shadow-lg backdrop-blur-sm"
						>
							<div class="space-y-3 text-center">
								<div
									class="from-primary-500 to-secondary-500 bg-linear-to- mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
								>
									<Icon icon="mdi:lightbulb" class="text-2xl text-white" />
								</div>
								<h4 class="text-surface-900 dark:text-surface-50 text-xl font-bold">
									{m.contact_collaborate_heading()}
								</h4>
								<p class="text-surface-600 dark:text-surface-400 leading-relaxed">
									{m.contact_collaborate_description()}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
{/if}

