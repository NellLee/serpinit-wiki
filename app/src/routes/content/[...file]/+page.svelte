<script context="module">
</script>

<!-- TODO: Add other stuff of old implementation (css and the other routes) -->

<script lang="ts">
	export let data;
</script>

<main>
	{@html data.html}
</main>

<!-- Render references -->
{#each data.references as list}
	<aside>
		<h2>{list.name}</h2>
		<ul>
			{#each list.linkList as link}
				<li><a href={link.href}>{link.text}</a></li>
			{/each}
		</ul>
	</aside>
{/each}
