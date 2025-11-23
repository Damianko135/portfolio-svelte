<script lang="ts">
	import { Icon } from '$lib';
	import * as m from '$lib/paraglide/messages.js';
</script>

<footer
	class="from-surface-900 via-surface-800 to-surface-900 text-surface-50 relative overflow-hidden bg-linear-to-r"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="bg-grid-pattern absolute inset-0"></div>
	</div>

	<div class="relative container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<!-- Brand Section -->
			<div class="space-y-4 md:col-span-2">
				<div class="flex items-center space-x-3">
					<div
						class="from-primary-500 to-secondary-500 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br"
					>
						<span class="text-xl font-bold text-white">DK</span>
					</div>
					<div>
						<h3 class="text-xl font-bold">{m.header_name()}</h3>
						<p class="text-surface-300 text-sm">
							{m.about_student_label()} & {m.about_enthusiast_label()}
						</p>
					</div>
				</div>
				<p class="text-surface-400 max-w-md">
					{m.footer_description()}
				</p>
			</div>

			<!-- Quick Links -->
			<div class="space-y-4">
				<h4 class="text-primary-400 text-lg font-semibold">{m.footer_quick_links()}</h4>
				<nav>
					<ul class="space-y-2">
						<li>
							<a
								href="/"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>{m.nav_home()}</a
							>
						</li>
						<li>
							<a
								href="/about"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>{m.nav_about()}</a
							>
						</li>
						<li>
							<a
								href="/projects"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>{m.nav_projects()}</a
							>
						</li>
						<li>
							<a
								href="/contact"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>{m.nav_contact()}</a
							>
						</li>
					</ul>
				</nav>
			</div>

			<!-- Connect Section -->
			<div class="space-y-4">
				<h4 class="text-primary-400 text-lg font-semibold">{m.footer_connect()}</h4>
				<div class="flex space-x-3">
					<a
						href="https://www.linkedin.com/in/dkorver/"
						class="group bg-surface-700 hover:bg-primary-600 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
						aria-label="Damian Korver on LinkedIn"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon
							icon="mdi:linkedin"
							class="text-surface-300 transition-colors duration-300 group-hover:text-white"
						/>
					</a>
					<a
						href="https://github.com/damianko135"
						class="group bg-surface-700 hover:bg-surface-900 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
						aria-label="Damian Korver on GitHub"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon
							icon="mdi:github"
							class="text-surface-300 transition-colors duration-300 group-hover:text-white"
						/>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div
			class="border-surface-700 mt-12 flex flex-col items-center justify-between space-y-4 border-t pt-8 md:flex-row md:space-y-0"
		>
			<p class="text-surface-400 text-sm">
				{m.footer_copyright()}
			</p>
			<div class="text-surface-400 flex items-center space-x-4 text-sm">
				<span>{m.footer_built_with()}</span>
				<div class="flex items-center space-x-2">
					<Icon icon="simple-icons:svelte" class="text-secondary-500 h-4 w-4" />
					<span>{m.tech_sveltekit()}</span>
				</div>
				<span>&</span>
				<div class="flex items-center space-x-2">
					<Icon icon="simple-icons:tailwindcss" class="text-primary-500 h-4 w-4" />
					<span>{m.tech_tailwind()}</span>
				</div>
			</div>
		</div>
	</div>
</footer>
