<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer
	class="relative bg-gradient-to-r from-surface-900 via-surface-800 to-surface-900 text-surface-50 overflow-hidden"
>
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0 bg-grid-pattern"></div>
	</div>

	<div class="relative container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand Section -->
			<div class="md:col-span-2 space-y-4">
				<div class="flex items-center space-x-3">
					<div
						class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center"
					>
						<span class="text-white font-bold text-xl">DK</span>
					</div>
					<div>
						<h3 class="text-xl font-bold">Damian Korver</h3>
						<p class="text-surface-300 text-sm">Cybersecurity & Cloud Enthusiast</p>
					</div>
				</div>
				<p class="text-surface-400 max-w-md">
					Passionate about cybersecurity, cloud technologies, and building secure, scalable
					solutions. Currently studying at Hogeschool Utrecht.
				</p>
			</div>

			<!-- Quick Links -->
			<div class="space-y-4">
				<h4 class="text-lg font-semibold text-primary-400">Quick Links</h4>
				<nav>
					<ul class="space-y-2">
						<li>
							<a
								href="/"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>Home</a
							>
						</li>
						<li>
							<a
								href="/about"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>About</a
							>
						</li>
						<li>
							<a
								href="/projects"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>Projects</a
							>
						</li>
						<li>
							<a
								href="/contact"
								class="text-surface-300 hover:text-primary-400 transition-colors duration-200"
								>Contact</a
							>
						</li>
					</ul>
				</nav>
			</div>

			<!-- Connect Section -->
			<div class="space-y-4">
				<h4 class="text-lg font-semibold text-primary-400">Connect</h4>
				<div class="flex space-x-3">
					<a
						href="https://www.linkedin.com/in/dkorver/"
						class="group w-10 h-10 bg-surface-700 hover:bg-[#0077B5] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
						aria-label="Damian Korver on LinkedIn"
						target="_blank"
						rel="noopener noreferrer"
					>
						<i
							class="fab fa-linkedin text-surface-300 group-hover:text-white transition-colors duration-300"
						></i>
					</a>
					<a
						href="https://github.com/damianko135"
						class="group w-10 h-10 bg-surface-700 hover:bg-[#333] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
						aria-label="Damian Korver on GitHub"
						target="_blank"
						rel="noopener noreferrer"
					>
						<i
							class="fab fa-github text-surface-300 group-hover:text-white transition-colors duration-300"
						></i>
					</a>
					<a
						href="https://twitter.com/damianko135"
						class="group w-10 h-10 bg-surface-700 hover:bg-[#1DA1F2] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
						aria-label="Damian Korver on Twitter"
						target="_blank"
						rel="noopener noreferrer"
					>
						<i
							class="fab fa-twitter text-surface-300 group-hover:text-white transition-colors duration-300"
						></i>
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Section -->
		<div
			class="mt-12 pt-8 border-t border-surface-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
		>
			<p class="text-surface-400 text-sm">
				&copy; {currentYear} Damian Korver. All rights reserved.
			</p>
			<div class="flex items-center space-x-4 text-surface-400 text-sm">
				<span>Built with</span>
				<div class="flex items-center space-x-2">
					<svg class="w-4 h-4 text-orange-500" viewBox="0 0 256 308" fill="currentColor">
						<path
							d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.2 82.2 0 0 0-37.135 55.056a86.57 86.57 0 0 0 8.536 55.576a82.4 82.4 0 0 0-12.296 30.719a87.6 87.6 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.18 82.18 0 0 0 37.135-55.057a86.6 86.6 0 0 0-8.53-55.577a82.4 82.4 0 0 0 12.29-30.718a87.57 87.57 0 0 0-14.963-66.244"
						/>
					</svg>
					<span>SvelteKit</span>
				</div>
				<span>&</span>
				<div class="flex items-center space-x-2">
					<svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
						/>
					</svg>
					<span>Tailwind CSS</span>
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	.bg-grid-pattern {
		background-image:
			linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
