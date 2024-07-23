<script lang="ts">
	import TabbedContentCard from './../../../lib/components/TabbedContentCard.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import type { EvCatPair } from '$lib/timeline.js';


	const title = "Timeline";
	export let data;
	
	let selectedEvCatPair: EvCatPair | null = null
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<div id="head" slot="head">
			<h1>{title}</h1>
		</div>

		<div id="content" slot="content">
			<Timeline bind:selectedEvCatPair={selectedEvCatPair}  timeline={data.timeline}></Timeline>
			<TabbedContentCard
				tabLinkList={[]}
				title={selectedEvCatPair?.event.text ?? ""}
				contentHtml={selectedEvCatPair?.event.description ?? ""}
				overviewHtml={selectedEvCatPair?.event.category ?? ""}
			></TabbedContentCard>
		</div>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<style lang="scss">
	#head {
		width: 100%;

		h1 {
			text-align: center;
		}
	}

	#content {
		width: 100%;
		height: 500px

	}
</style>
