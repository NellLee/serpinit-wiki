
<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
</svelte:head>

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

<main>
	<Navbar
		items={[
			{
				href: '/content',
				text: 'Wiki'
			},
			{
				href: '/convert',
				text: 'Converter'
			}
		]}
	/>

	<body>
		<slot />
	</body>

	<button id="scroll-to-top" class:show={scrollY > 100} on:click={scrollToTop}>
		<Icon src={ChevronUp} solid size="20" />
		Zurück nach oben
		<Icon src={ChevronUp} solid size="20" />
	</button>
</main>

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

	:global(main) {
		width: 100%;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.428571429;
		margin: 0;
	}

	:global(body) {
		color: var(--primary-color);
		background-color: var(--primary-background-color);
		margin: 0;

		max-width: 100vw;
		min-height: fit-content;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: stretch;
	}
</style>
