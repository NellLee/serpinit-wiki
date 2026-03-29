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

	export let data;

	$: presentation = data.presentation;
	$: pageClass = presentation.pageClass;
	$: showLeftRail = presentation.showToc;
	$: showRightRail = presentation.showContextRail;

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
>
	<div class="rail rail-left" class:is-hidden={!showLeftRail}>
		{#if showLeftRail}
			<Sidebar>
				<ContentTree linkTree={data.page.toc} />
			</Sidebar>
		{/if}
	</div>

	<div class="main-column">
		<MidPanel contentWidth={data.presentation.contentWidth}>
			<Breadcrumbs slot="head" linkList={data.page.breadcrumbs} />
			<ContentCard
				slot="content"
				title={data.page.title}
				contentHtml={data.page.contentHtml}
				overviewHtml={data.page.overviewHtml}
			/>
		</MidPanel>
	</div>

	<div class="rail rail-right" class:is-hidden={!showRightRail}>
		{#if showRightRail}
			<Sidebar>
				{#if data.page.event}
					<SmallNamedCard name="Timeline">
						<a href="{TIMELINE_URL}?selected={encodeURIComponent(data.page.event.text)}"
							>Ereignis in Zeitleiste anzeigen</a
						>
					</SmallNamedCard>
				{/if}
				{#each data.page.references as namedLinkList}
					<ReferenceList {namedLinkList} />
				{/each}
			</Sidebar>
		{/if}
	</div>
</div>

<style lang="scss">
	.content-page {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, 17rem) minmax(0, 1fr) minmax(0, 19rem);
		align-items: start;
		gap: var(--shell-content-gap, 24px);

		&.hub {
			grid-template-columns: minmax(0, 0.2fr) minmax(0, 1fr) minmax(0, 0.2fr);
		}

		&.index {
			grid-template-columns: minmax(0, 0.1fr) minmax(0, 1fr) minmax(0, 18rem);
		}

		&.media {
			grid-template-columns: minmax(0, 0.1fr) minmax(0, 1fr) minmax(0, 0.1fr);
		}
	}

	.rail,
	.main-column {
		min-width: 0;
	}

	.rail {
		width: 100%;
	}

	.rail.is-hidden {
		visibility: hidden;
		pointer-events: none;
	}

	.main-column {
		width: 100%;
	}
</style>
