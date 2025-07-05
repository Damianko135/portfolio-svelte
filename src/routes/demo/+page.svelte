<script lang="ts">
	import { SectionDivider } from '$lib';
</script>

<div class="container mx-auto max-w-4xl px-4 py-20">
	<div class="text-center mb-16">
		<h1 class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-50 mb-6">
			Section Divider Animation Showcase
		</h1>
		<p class="text-lg text-surface-600 dark:text-surface-400">
			Demonstrating the different animation variants available for section dividers
		</p>
	</div>

	<div class="space-y-16">
		<!-- Default Animation -->
		<section class="text-center">
			<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
				Default Animation
			</h2>
			<SectionDivider variant="default" />
			<p class="text-surface-600 dark:text-surface-400 mt-4">
				Standard smooth expansion with opacity transition (0.8s)
			</p>
		</section>

        
		<!-- Subtle Animation -->
		<section class="text-center">
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
                Subtle Animation
			</h2>
			<SectionDivider variant="subtle" />
			<p class="text-surface-600 dark:text-surface-400 mt-4">
                Gentler expansion to w-48 instead of w-64 (0.6s)
			</p>
		</section>
        <!-- Delayed Animation -->
        <section class="text-center">
            <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
                Delayed Animation
            </h2>
            <SectionDivider variant="delayed" />
            <p class="text-surface-600 dark:text-surface-400 mt-4">
                Longer duration with 50% delay point (1.2s)
            </p>
        </section>
        
		<!-- Scroll-triggered Animation -->
		<div style="height: 100vh;" class="flex items-center justify-center">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
					Scroll into view to trigger animation
				</h2>
				<SectionDivider variant="on-scroll" />
				<p class="text-surface-600 dark:text-surface-400 mt-4">
					Intersection Observer triggered animation
				</p>
			</div>
		</div>

		<!-- Custom Class Example -->
		<section class="text-center">
			<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-4">
				Custom Styling
			</h2>
			<SectionDivider variant="default" className="!bg-gradient-to-r !from-red-500 !to-blue-500" />
			<p class="text-surface-600 dark:text-surface-400 mt-4">
				Custom gradient colors with className prop
			</p>
		</section>
	</div>

	<!-- Usage Examples -->
	<div class="mt-20 bg-surface-100 dark:bg-surface-800 rounded-xl p-8">
		<h3 class="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">
			Usage Examples
		</h3>
		<pre class="text-sm text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-900 p-4 rounded-lg overflow-x-auto"><code>{`<!-- Basic usage -->
<SectionDivider variant="default" />

<!-- Delayed animation for hero sections -->
<SectionDivider variant="delayed" />

<!-- Subtle animation for secondary sections -->
<SectionDivider variant="subtle" />

<!-- Scroll-triggered for performance -->
<SectionDivider variant="on-scroll" />

<!-- Custom styling -->
<SectionDivider 
  variant="default" 
  className="!bg-gradient-to-r !from-red-500 !to-blue-500" 
/>`}</code></pre>
	</div>
</div>
