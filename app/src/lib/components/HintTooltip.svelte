<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		id: string;
		align?: 'left' | 'right';
		children: Snippet;
	}

	let { label, id, align = 'left', children }: Props = $props();
</script>

<div class="hint-wrap">
	<button
		type="button"
		class="hint"
		aria-describedby={id}
		onkeydown={(event) => event.key === 'Escape' && event.currentTarget.blur()}
	>
		{label}
	</button>
	<div class="tooltip {align}" role="tooltip" {id}>
		<div class="tooltip-box">{@render children()}</div>
	</div>
</div>

<style lang="scss">
	.hint-wrap {
		position: relative;
	}

	.hint {
		padding: 0.25rem 0.5rem;
		border: 0;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.04);
		color: inherit;
		font: inherit;
		cursor: help;
	}

	.tooltip {
		display: none;
		position: absolute;
		top: 100%;
		z-index: 30;
		// The padding keeps the pointer inside the hover area on its way to the box.
		padding-top: 0.4rem;

		&.left {
			left: 0;
		}

		&.right {
			right: 0;
		}
	}

	.hint-wrap:hover .tooltip,
	.hint-wrap:focus-within .tooltip {
		display: block;
	}

	.tooltip-box {
		display: grid;
		gap: 0.55rem;
		width: max-content;
		max-width: min(22rem, 80vw);
		padding: 0.75rem 0.9rem;
		border-radius: 0.7rem;
		background: var(--primary-background-color);
		border: 1px solid rgba(0, 0, 0, 0.14);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
		color: rgba(0, 0, 0, 0.82);
		font-size: 0.86rem;
		font-weight: 400;
		line-height: 1.45;
		text-align: left;
	}
</style>
