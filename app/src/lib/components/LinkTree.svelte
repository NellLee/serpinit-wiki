<script lang="ts">
	import LinkNode from './LinkNode.svelte';
	export let tree: LinkTree;
</script>

<ul>
	{#each tree.children as child}
		<li>
			<LinkNode node={child} level={0} />
		</li>
	{/each}
</ul>
