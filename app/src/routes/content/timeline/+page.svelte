<script lang="ts">
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Timeline from '$lib/components/Timeline.svelte';


	const title = "Timeline";
	export let data;
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
			<Timeline timeline={data.timeline}></Timeline>
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
		height: 80vh

	}
</style>
