<script lang="ts">
	import { page } from '$app/stores';

	$: currentPath = $page.url.pathname;

	export let tabLinkList: LinkObject[];
	export let title: string;
	export let contentHtml: string;
</script>

<div class="content-card">
	{#if tabLinkList.length > 1}
		<div class="tabs">
			<ul>
				{#each tabLinkList as link}
					<li>
						<a href={link.href} class={link.href === currentPath ? 'active' : ''}>{link.text}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div id="content-body">
		<div class="header">
			<h1>{title}</h1>
		</div>
		<div id="content">{@html contentHtml}</div>
	</div>
</div>

<style lang="scss">
	.tabs {
		ul {
			padding: 10px 10px 0 10px;
			list-style-type: none;
			margin: 0;
			display: flex;
			border-bottom: 1px solid var(--secondary-background-color);

			li {
				margin: 0;
				padding: 0;
			}

			a {
				display: block;
				padding: 5px 10px;
				margin-right: 2px;
				text-decoration: none;
				color: #000;
				background-color: var(--primary-background-color);
				border: 1px solid var(--tertiary-background-color);
				border-bottom: none;
				border-radius: 8px 8px 0 0;
				transition: background-color 0.3s ease;

				&:hover {
					background-color: var(--secondary-background-color);
				}

				&.active {
					background-color: var(--secondary-background-color);
					border: 1px solid var(--secondary-color);
					border-bottom: 0;
					font-weight: bold;
				}
			}
		}
	}

	#content-body {
		width: 100%;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		background-color: var(--secondary-background-color);
		padding: 20px;

		#content {
			width: 80%;
			max-width: 80%;
			min-height: 70vh;
			text-align: justify;
		}

		.header {
			width: fit-content;
			max-width: 100%;

			h1 {
				font-size: xxx-large;
				margin-top: 75px;
			}
		}

		:global(img) {
			max-width: 100%;
		}

		:global(blockquote) {
			margin: 0;
			padding: 5px 20px;
			margin: 10px 0;
			background-color: var(--primary-background-color);
			border-left: 5px solid var(--secondary-color);
		}
	}
</style>
