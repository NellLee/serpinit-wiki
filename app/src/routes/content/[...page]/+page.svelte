<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentTree from '$lib/components/ContentTree.svelte';
	import ReferenceList from '$lib/components/ReferenceList.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ContentCard from '$lib/components/ContentCard.svelte';
	import { TIMELINE_URL } from '$lib/constants.js';
	import SmallNamedCard from '$lib/components/Card.svelte';

	export let data;
	import { onMount } from 'svelte';

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

<div style="width: 15%">
	<Sidebar>
		<ContentTree linkTree={data.page.toc} />
	</Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<Breadcrumbs slot="head" linkList={data.page.breadcrumbs} />
		<ContentCard
			slot="content"
			title={data.page.title}
			contentHtml={data.page.contentHtml}
			overviewHtml={data.page.overviewHtml}
		/>
	</MidPanel>
</div>

<div style="width: 15%">
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
</div>
