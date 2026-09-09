<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.page.title}</title>
</svelte:head>

{#if data.page.overviewHtml}
	<div id="overview">
		<div id="overview-html">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.page.overviewHtml}
		</div>
	</div>
{/if}

<h1>{data.page.title}</h1>

<div id="content-html">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html data.page.contentHtml}
</div>
