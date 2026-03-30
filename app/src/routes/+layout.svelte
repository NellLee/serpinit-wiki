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
				text: 'Wiki'
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
		Zurueck nach oben
		<Icon src={ChevronUp} solid size="20" />
	</button>
</div>

<style global lang="scss">
	:root {
		--primary-color: #000000;
		--secondary-color: #065d26;
		--primary-background-color: #fff;
		--secondary-background-color: #eaeaea;
		--tertiary-background-color: #d2d2d2;
		--alternative-primary-background-color: #f9f9f9;
		--alternative-secondary-background-color: #c5c5c5;
		--primary-border-color: #ccc;
		--secondary-border-color: #b1b1b1;
		--shell-max-width: 1600px;
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
		background-color: rgba(0, 0, 0, 0.4);
		color: white;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 10px 20px;
		border-radius: 50px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

		&:hover {
			background-color: rgba(6, 93, 38, 0.4);
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
	}

	:global(body) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.428571429;
		color: var(--primary-color);
		background-color: var(--primary-background-color);
		margin: 0;
		min-height: 100vh;
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
		padding: 0 var(--shell-inline-padding) 32px;
	}
</style>
