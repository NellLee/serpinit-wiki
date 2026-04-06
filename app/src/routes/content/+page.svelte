<script lang="ts">
	import SearchBar from '$lib/components/Searchbar.svelte';

	export let data;

	$: homepage = data.homepage;
</script>

<svelte:head>
	<title>{homepage.title}</title>
</svelte:head>

<div class="homepage">
	<section class="homepage-intro panel">
		<div class="intro-copy">
			<p class="eyebrow">Worldbuilding Wiki</p>
			<h1>{homepage.title}</h1>
			<p class="lede">{homepage.lede}</p>
		</div>

		<div class="intro-tools">
			<div class="search-surface">
				<p>{homepage.searchPrompt}</p>
				<SearchBar />
			</div>
		</div>
	</section>

	<section class="browse-section">
		<div class="section-heading">
			<p class="eyebrow">Browse First</p>
			<h2>Zentrale Einstiege</h2>
		</div>

		<div class="browse-grid">
			{#each homepage.primaryBrowse as item}
				<a class="browse-card panel" href={item.href}>
					{#if item.imageSrc}
						<div class="card-image">
							<img src={item.imageSrc} alt={item.imageAlt ?? item.title} loading="lazy" />
						</div>
					{/if}

					<div class="card-copy">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="quick-links panel">
		<div class="section-heading compact">
			<h2>Hilfreiche Pfade</h2>
			<p>Kompakte Wege zu Werkzeugen und alternativen Einstiegen.</p>
		</div>

		<div class="quick-link-list">
			{#each homepage.utilityLinks as item}
				<a href={item.href}>
					<strong>{item.title}</strong>
					<span>{item.description}</span>
				</a>
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	.homepage {
		display: grid;
		gap: 1.5rem;
		padding-top: 0.5rem;
	}

	.panel {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		box-shadow: var(--shadow-soft);
	}

	.homepage-intro {
		display: grid;
		gap: 1.25rem;
		padding: clamp(1.4rem, 3vw, 2.25rem);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background:
				radial-gradient(circle at top right, rgba(176, 140, 78, 0.16), transparent 28%),
				radial-gradient(circle at bottom left, rgba(143, 110, 57, 0.1), transparent 32%);
			pointer-events: none;
		}

		@media (min-width: 960px) {
			grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 24rem);
			align-items: start;
		}
	}

	.homepage-intro > * {
		position: relative;
		z-index: 1;
	}

	.eyebrow {
		margin: 0;
		color: var(--accent-strong);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	.intro-copy {
		display: grid;
		gap: 0.85rem;

		h1,
		p {
			margin: 0;
		}

		h1 {
			font-size: clamp(2rem, 4.2vw, 3.1rem);
			line-height: 0.98;
		}
	}

	.lede {
		max-width: 48rem;
		font-size: 1.02rem;
		line-height: 1.7;
		color: var(--text-muted);
	}

	.intro-tools {
		display: grid;
		gap: 1rem;
	}

	.search-surface {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
		background: var(--surface-sunken);
		border: 1px solid rgba(112, 88, 48, 0.14);
		border-radius: 0.8rem;

		p {
			margin: 0;
			color: var(--text-muted);
		}

		:global(#searchbar) {
			max-width: 100%;
		}
	}

	.section-heading {
		display: grid;
		gap: 0.4rem;
		margin-bottom: 1rem;

		h2,
		p {
			margin: 0;
		}
	}

	.section-heading.compact p {
		color: var(--text-muted);
		line-height: 1.6;
	}

	.browse-grid {
		display: grid;
		gap: 1rem;

		@media (min-width: 720px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.browse-card {
		display: grid;
		grid-template-columns: minmax(0, 6.5rem) minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: var(--shadow-strong);
			border-color: rgba(112, 88, 48, 0.28);
		}

		@media (max-width: 520px) {
			grid-template-columns: 1fr;
		}
	}

	.card-image {
		aspect-ratio: 1;
		border-radius: 1rem;
		overflow: hidden;
		background: var(--surface-sunken);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}

		@media (max-width: 520px) {
			aspect-ratio: 16 / 9;
		}
	}

	.card-copy {
		display: grid;
		align-content: start;
		gap: 0.45rem;

		h3,
		p {
			margin: 0;
		}

		p {
			line-height: 1.65;
			color: var(--text-muted);
		}
	}

	.quick-links {
		padding: 1.2rem;
	}

	.quick-link-list {
		display: grid;
		gap: 0.8rem;

		@media (min-width: 760px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.quick-link-list a {
		display: grid;
		gap: 0.35rem;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		background: var(--surface-sunken);
		border: 1px solid transparent;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease,
			background-color 0.2s ease;

		span {
			line-height: 1.6;
			color: var(--text-muted);
		}

		&:hover {
			transform: translateX(2px);
			border-color: rgba(112, 88, 48, 0.18);
			background: rgba(247, 241, 228, 0.92);
		}
	}
</style>
