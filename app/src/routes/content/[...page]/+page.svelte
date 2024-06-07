<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentTree from '$lib/components/ContentTree.svelte';
	import ReferenceList from '$lib/components/ReferenceList.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import TabbedCard from '$lib/components/TabbedCard.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import SmallNamedCard from '$lib/components/SmallNamedCard.svelte';

	export let data;
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
		<TabbedCard
			slot="content"
			tabLinkList={data.page.tabs}
			title={data.page.title}
			contentHtml={data.page.html}
		/>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar>
		<Tags tags={data.page.tags}/>
		{#each data.page.references as namedLinkList}
			<ReferenceList {namedLinkList} />
		{/each}
	</Sidebar>
</div>
