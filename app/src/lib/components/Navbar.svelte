<script lang="ts">
	import { page } from '$app/stores';
	import SearchBar from '$lib/components/Searchbar.svelte';

	interface Props {
		items: LinkObject[];
	}

	let { items }: Props = $props();

	function isActive(href: string, currentPath: string): boolean {
		if (href === '/content') {
			return currentPath === '/content';
		}

		return currentPath === href || currentPath.startsWith(`${href}/`);
	}
</script>

<nav id="nav-bar" aria-label="Primary">
	<div class="nav-frame">
		<div class="nav-brand">
			<a href="/content">
				<strong>Serpinit</strong>
				<span>Wiki</span>
			</a>
		</div>

		<ul>
			{#each items as item}
				<li>
					<a href={item.href} class:active={isActive(item.href, $page.url.pathname)}>{item.text}</a>
				</li>
			{/each}
		</ul>
		<SearchBar />
	</div>
</nav>

<style lang="scss">
	#nav-bar {
		width: 100%;
		padding: 14px var(--shell-inline-padding, 24px) 8px;
		position: sticky;
		top: 0;
		z-index: 20;
		backdrop-filter: blur(12px);
	}

	.nav-frame {
		width: min(100%, var(--shell-max-width, 1600px));
		margin: 0 auto;
		padding: 0.95rem 1.1rem;
		background-color: rgba(255, 250, 241, 0.82);
		border: 1px solid var(--border-subtle);
		border-radius: 12px;
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;
		gap: 16px;
		box-shadow: var(--shadow-soft);
	}

	.nav-brand a {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		padding-right: 0.75rem;
		text-decoration: none;
		color: var(--primary-color);
	}

	.nav-brand strong {
		font-family: 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
		font-size: 1.2rem;
		line-height: 1;
	}

	.nav-brand span {
		color: var(--accent-strong);
		font-size: 0.88rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-flow: row wrap;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		flex: 1 1 360px;
		min-width: 0;
	}

	:global(#searchbar) {
		flex: 0 1 320px;
	}

	li a {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		padding: 0.55rem 0.85rem;
		line-height: 1.2;
		border-radius: 999px;
		border: 1px solid transparent;
		color: var(--text-muted);
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: var(--primary-color);
			background: rgba(235, 226, 209, 0.86);
			border-color: var(--border-subtle);
		}

		&.active {
			color: var(--primary-color);
			background: rgba(229, 214, 184, 0.78);
			border-color: rgba(112, 88, 48, 0.18);
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
		}
	}

	@media (max-width: 760px) {
		#nav-bar {
			padding-top: 10px;
		}

		.nav-frame {
			padding: 0.9rem;
			gap: 12px;
		}

		.nav-brand {
			width: 100%;
		}

		ul {
			flex: 1 1 100%;
		}

		:global(#searchbar) {
			flex: 1 1 100%;
			max-width: 100%;
		}
	}
</style>
