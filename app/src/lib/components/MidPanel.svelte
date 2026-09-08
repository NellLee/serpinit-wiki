<script lang="ts">
	interface Props {
		contentWidth?: 'standard' | 'wide';
		head?: import('svelte').Snippet;
		content?: import('svelte').Snippet;
	}

	let { contentWidth = 'wide', head, content }: Props = $props();
</script>

<div
	id="mid-panel"
	class:standard={contentWidth === 'standard'}
	class:wide={contentWidth === 'wide'}
>
	<div id="head">
		{@render head?.()}
	</div>
	<div id="content">
		{@render content?.()}
	</div>
</div>

<style lang="scss">
	#mid-panel {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		gap: 24px;

		#head {
			width: 100%;
		}

		#content {
			width: 100%;
			max-width: 100%;
			margin: 0 auto;
		}

		&.standard {
			#content {
				max-width: 960px;
			}
		}

		&.wide {
			#content {
				max-width: 1200px;
			}
		}
	}
</style>
