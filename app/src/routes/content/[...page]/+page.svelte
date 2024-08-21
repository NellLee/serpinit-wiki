<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentTree from '$lib/components/ContentTree.svelte';
	import ReferenceList from '$lib/components/ReferenceList.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import TabbedContentCard from '$lib/components/TabbedContentCard.svelte';
	import Tags from '$lib/components/Tags.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.page.title}</title>
</svelte:head>

<!-- TODO: Conditional timeline link (if article is event) -->


<div style="width: 15%">
	<Sidebar>
		<ContentTree linkTree={data.page.toc} />
	</Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<Breadcrumbs slot="head" linkList={data.page.breadcrumbs} />
		<TabbedContentCard
			slot="content"
			tabLinkList={data.page.tabs}
			title={data.page.title}
			contentHtml={data.page.contentHtml}
			overviewHtml={data.page.overviewHtml}
		/>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar>
		<Tags tags={data.page.tags} />
		{#each data.page.references as namedLinkList}
			<ReferenceList {namedLinkList} />
		{/each}
	</Sidebar>
</div>
