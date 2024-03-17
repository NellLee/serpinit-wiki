<script context="module">
</script>

<!-- TODO: Add other stuff of old implementation (css and the other routes) -->

<script lang="ts">
	export let data;
</script>

<main>
	{@html data.htmlContent}
</main>

<!-- Render table of contents -->
{#if data.tocContent.length > 0}
	<aside>
		<h2>Table of Contents</h2>
		<ul>
			{#each data.tocContent as item}
				<li><a href={item.href}>{item.text}</a></li>
			{/each}
		</ul>
	</aside>
{/if}

<!-- Render subcontent -->
{#if data.subContent.length > 0}
	<aside>
		<h2>Subcontent</h2>
		<ul>
			{#each data.subContent as item}
				<li><a href={item.href}>{item.text}</a></li>
			{/each}
		</ul>
	</aside>
{/if}

<!-- Render references -->
{#if data.refContent.length > 0}
	<aside>
		<h2>References</h2>
		<ul>
			{#each data.refContent as item}
				<li><a href={item.href}>{item.text}</a></li>
			{/each}
		</ul>
	</aside>
{/if}
