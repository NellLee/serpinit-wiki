<script lang="ts">
	import EllipsisText from './EllipsisText.svelte';
	import { ChevronRight, Icon } from 'svelte-hero-icons';

	export let node: LinkNode;
	export let level = 0;
	let isCollapsed = node.children.length != 0 && level > 1;

	function toggleCollapse() {
		if (node.children.length == 0) {
			isCollapsed = true;
		}
		isCollapsed = !isCollapsed;
	}
</script>

<div class="link-node">
    <!-- TODO -->
	<button class="toggle-button {isCollapsed ? 'collapsed' : ''}" on:click={toggleCollapse}>
		<Icon src={ChevronRight} solid size="14" />
	</button>
	<a href={node.link.href}><EllipsisText>{node.link.text}</EllipsisText></a>
	{#if node.children.length > 0 && !isCollapsed}
		<ul>
			{#each node.children as child}
				<li>
					<svelte:self node={child} level={level + 1} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.link-node {
		margin-left: var(--indentation);
	}
	.toggle-button {
    margin-right: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: transform 0.3s ease;
    background-color: transparent; 
    border: none;
}
	.toggle-button.collapsed {
		transform: rotate(90deg); /* Rotate ">" to indicate expanded state */
	}
</style>
