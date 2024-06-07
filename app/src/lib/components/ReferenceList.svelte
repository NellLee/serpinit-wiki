<script lang="ts">
	import EllipsisText from './EllipsisText.svelte';

	export let namedLinkList: NamedLinkList;
</script>

{#if namedLinkList.linkList.length > 0}
	<nav>
		<h2>{namedLinkList.name}</h2>
		<ul>
			{#each namedLinkList.linkList as link}
				<li><a href={link.href}><EllipsisText>{link.text}</EllipsisText></a></li>
			{/each}
		</ul>
	</nav>
{/if}
