<script lang="ts">
	import ContentTreeNode from './ContentTreeNode.svelte';
	export let linkTree: LinkTree;
</script>

<div id="table-of-content">
	{#if linkTree.children.length > 0}
		<nav>
			<h2>Inhalt</h2>
			<ul>
				{#each linkTree.children as child}
					<li>
						<ContentTreeNode node={child} level={0} />
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</div>

<style lang="scss">
	#table-of-content {
		width: 100%;
		max-width: 100%;

		h2 {
			margin-top: 0;
		}
	}
</style>
