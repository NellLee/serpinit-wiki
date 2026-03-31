<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.page.title}</title>
</svelte:head>

{#if data.page.overviewHtml}
	<div id="overview">
		<div id="overview-html">
			{@html data.page.overviewHtml}
		</div>
	</div>
{/if}

<h1>{data.page.title}</h1>

<div id="content-html">
	{@html data.page.contentHtml}
</div>
