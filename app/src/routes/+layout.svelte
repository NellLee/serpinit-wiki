<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<main>
	<Navbar
		items={[
			{
				href: '/content',
				text: 'Wiki'
			},
			{
				href: '/gallery',
				text: 'Gallerie'
			}
		]}
	/>

	<body>
		<slot />
	</body>
</main>

<style global lang="scss">
	:root {
		--primary-color: #000000;
		--secondary-color: #065d26;
		--primary-background-color: #fff;
		--secondary-background-color: rgb(234, 234, 234);
		--tertiary-background-color: #d2d2d2;
		--quaternary-background-color: #d2d2d2;
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
