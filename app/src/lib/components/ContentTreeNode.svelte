<script lang="ts">
	import ContentTreeNode from './ContentTreeNode.svelte';
	import EllipsisText from './EllipsisText.svelte';
	import { ChevronRight, Icon } from 'svelte-hero-icons';

	interface Props {
		node: LinkNode;
		level?: number;
	}

	let { node, level = 0 }: Props = $props();

	// eslint-disable-next-line svelte/valid-compile -- intentional initial-value-only read, not reactive to prop changes
	let isCollapsed = $state(node.children.length != 0 && level > 1);

	function toggleCollapse() {
		if (node.children.length == 0) {
			isCollapsed = true;
		}
		isCollapsed = !isCollapsed;
	}
</script>

<div class="link-node" style="--indentation: {level * 8}px">
	<div class="node-content">
		<button class="toggle-button {isCollapsed ? 'collapsed' : ''}" onclick={toggleCollapse}>
			<Icon src={ChevronRight} solid size="14" />
		</button>
		<a href={node.link.href}><EllipsisText>{node.link.text}</EllipsisText></a>
	</div>

	{#if node.children.length > 0 && !isCollapsed}
		<ul>
			{#each node.children as child}
				<li>
					<ContentTreeNode node={child} level={level + 1} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.link-node {
		margin-left: var(--indentation);

		.node-content {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			min-width: 0;

			.toggle-button {
				cursor: pointer;
				font-size: 14px;
				transition: transform 0.2s ease;
				background-color: transparent;
				border: none;
				margin-right: 2px;
				color: var(--text-muted);
				flex: 0 0 auto;

				&.collapsed {
					transform: rotate(90deg);
				}
			}

			a {
				flex: 1;
				text-decoration: none;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding: 0.3rem 0.45rem;
				border-radius: 0.55rem;
				color: var(--text-muted);

				&:hover {
					color: var(--primary-color);
					background: rgba(235, 226, 209, 0.84);
				}
			}
		}
	}
</style>
