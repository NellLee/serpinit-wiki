<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentTree from '$lib/components/ContentTree.svelte';
	import ReferenceList from '$lib/components/ReferenceList.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import { TIMELINE_URL } from '$lib/constants.js';
	import SmallNamedCard from '$lib/components/Card.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let presentation = $derived(data.presentation);
	let pageClass = $derived(presentation.pageClass);
	let showLeftRail = $derived(presentation.showToc);
	let showRightRail = $derived(presentation.showContextRail);

	onMount(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}

		const savedScrollPosition = sessionStorage.getItem('scrollPosition');
		if (savedScrollPosition) {
			setTimeout(() => {
				window.scrollTo(0, parseInt(savedScrollPosition));
			}, 0);
		}

		window.addEventListener('beforeunload', () => {
			sessionStorage.setItem('scrollPosition', window.scrollY as unknown as string);
		});
	});
</script>

<svelte:head>
	<title>{data.page.title}</title>
</svelte:head>

<div
	class="content-page"
	class:hub={pageClass === 'hub'}
	class:index={pageClass === 'index'}
	class:article={pageClass === 'article'}
	class:media={pageClass === 'media'}
	class:left-rail={showLeftRail}
	class:right-rail={showRightRail}
>
	{#if showLeftRail}
		<div class="rail rail-left">
			<Sidebar>
				<ContentTree linkTree={data.page.toc} />
			</Sidebar>
		</div>
	{/if}

	<div class="main-column">
		<MidPanel contentWidth={data.presentation.contentWidth}>
			{#snippet head()}
				<Breadcrumbs linkList={data.page.breadcrumbs} />
			{/snippet}
			{#snippet content()}
				<ContentCard
					title={data.page.title}
					contentHtml={data.page.contentHtml}
					overviewHtml={data.page.overviewHtml}
				/>
			{/snippet}
		</MidPanel>
	</div>

	{#if showRightRail}
		<div class="rail rail-right">
			<Sidebar>
				{#if data.page.events.length > 0}
					<SmallNamedCard name="Timeline">
						{#each data.page.events as event}
							<a href="{TIMELINE_URL}?selected={encodeURIComponent(event.text)}">{event.text}</a>
						{/each}
					</SmallNamedCard>
				{/if}
				{#each data.page.references as namedLinkList}
					<ReferenceList {namedLinkList} />
				{/each}
			</Sidebar>
		</div>
	{/if}
</div>

<style lang="scss">
	.content-page {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		gap: var(--shell-content-gap, 24px);

		&.left-rail.right-rail {
			grid-template-columns: minmax(0, 17rem) minmax(0, 1fr) minmax(0, 19rem);
		}

		&.right-rail:not(.left-rail) {
			grid-template-columns: minmax(0, 1fr) minmax(0, 18rem);
		}

		&.left-rail:not(.right-rail) {
			grid-template-columns: minmax(0, 17rem) minmax(0, 1fr);
		}
	}

	.rail,
	.main-column {
		min-width: 0;
	}

	.rail {
		width: 100%;

		@media (min-width: 960px) {
			position: sticky;
			top: 6.2rem;
			align-self: start;
		}
	}

	.main-column {
		width: 100%;
	}
</style>
