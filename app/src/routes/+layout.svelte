<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import { Icon, ChevronUp } from 'svelte-hero-icons';

	let scrollY = 0;

	const handleScroll = () => {
		scrollY = window.scrollY;
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="app-shell">
	<Navbar
		items={[
			{
				href: '/content',
				text: 'Start'
			},
			{
				href: '/content/Himmelskoerper_/index.md',
				text: 'Himmelskörper'
			},
			{
				href: '/content/Volk_/index.md',
				text: 'Völker'
			},
			{
				href: '/content/timeline',
				text: 'Timeline'
			},
			{
				href: '/convert',
				text: 'Converter'
			}
		]}
	/>

	<main class="page-shell">
		<slot />
	</main>

	<button id="scroll-to-top" class:show={scrollY > 100} on:click={scrollToTop}>
		<Icon src={ChevronUp} solid size="20" />
		Zurück nach oben
		<Icon src={ChevronUp} solid size="20" />
	</button>
</div>

<style global lang="scss">
	:root {
		color-scheme: light;
		--primary-color: #201813;
		--secondary-color: #705830;
		--accent-strong: #8d5f20;
		--primary-background-color: #f3ede2;
		--secondary-background-color: #ebe2d1;
		--tertiary-background-color: #d7c4a0;
		--alternative-primary-background-color: #fffaf1;
		--alternative-secondary-background-color: #c6b289;
		--primary-border-color: #ccbda0;
		--secondary-border-color: #b79f7a;
		--surface-raised: rgba(255, 250, 241, 0.92);
		--surface-sunken: rgba(244, 235, 219, 0.92);
		--surface-strong: #fcf8ef;
		--border-subtle: rgba(112, 88, 48, 0.18);
		--text-muted: rgba(32, 24, 19, 0.72);
		--shadow-soft: 0 16px 40px rgba(54, 36, 13, 0.08);
		--shadow-strong: 0 22px 56px rgba(54, 36, 13, 0.14);
		--shell-max-width: 1500px;
		--shell-inline-padding: clamp(16px, 2.5vw, 32px);
		--shell-content-gap: clamp(16px, 2vw, 28px);
	}

	#scroll-to-top {
		display: none;
		flex-flow: row nowrap;
		align-items: center;
		gap: 10px;
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 99;
		font-size: 16px;
		background-color: rgba(41, 27, 10, 0.82);
		color: #fff8ef;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 10px 20px;
		border-radius: 50px;
		box-shadow: var(--shadow-soft);

		&:hover {
			background-color: rgba(112, 88, 48, 0.92);
		}

		&.show {
			display: flex;
		}
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		margin: 0;
		min-height: 100%;
		scrollbar-gutter: stable;
	}

	:global(body) {
		font-family: 'Aptos', 'Segoe UI', 'Trebuchet MS', sans-serif;
		font-size: 15px;
		line-height: 1.6;
		color: var(--primary-color);
		background-color: var(--primary-background-color);
		background-image:
			radial-gradient(circle at top, rgba(170, 135, 73, 0.14), transparent 32%),
			linear-gradient(180deg, #f7f0e4 0%, #f2ebdf 40%, #efe5d6 100%);
		margin: 0;
		min-height: 100vh;
	}

	:global(h1),
	:global(h2),
	:global(h3),
	:global(h4),
	:global(h5),
	:global(h6) {
		font-family: 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	:global(a) {
		color: inherit;
	}

	.app-shell {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-flow: column nowrap;
	}

	.page-shell {
		width: min(100%, var(--shell-max-width));
		flex: 1 1 auto;
		margin: 0 auto;
		padding: 0 var(--shell-inline-padding) 40px;
	}
</style>
