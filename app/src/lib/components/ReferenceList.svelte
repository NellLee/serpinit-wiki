<script lang="ts">
	import EllipsisText from './EllipsisText.svelte';
	import SmallNamedCard from './SmallNamedCard.svelte';

	export let namedLinkList: NamedLinkList;
</script>

{#if namedLinkList.linkList.length > 0}
	<nav style="width: 95%;">
		<SmallNamedCard name={namedLinkList.name}>
		<ul>
			{#each namedLinkList.linkList as link}
				<li><a href={link.href}><EllipsisText>{link.text}</EllipsisText></a></li>
			{/each}
		</ul>
		</SmallNamedCard>
	</nav>
{/if}
