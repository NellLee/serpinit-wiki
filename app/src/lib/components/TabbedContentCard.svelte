<script lang="ts">
	import { page } from '$app/stores';
	import { Fancybox } from '@fancyapps/ui';
	import '@fancyapps/ui/dist/fancybox/fancybox.css';
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	$: currentPath = $page.url.pathname;

	export let tabLinkList: LinkObject[];
	export let title: string;
	export let fancyBoxGallery: boolean = true;
	export let contentHtml: string;
	export let overviewHtml: string | null;

	onMount(() => {
		if (fancyBoxGallery) {
			Fancybox.bind('[data-fancybox="gallery"]', {
				Thumbs: {
					type: 'modern'
				}
			});
		}
	});
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
		{#if overviewHtml}
			<div id="overview">
				<Card>
					<div lang="de" id="overview-html">
						{@html overviewHtml}
					</div>
				</Card>
			</div>
		{/if}
		<div class="header">
			<h1>{title}</h1>
		</div>
		<div id="content">
			<div lang="de" id="content-html">
				{@html contentHtml}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.content-card {
		.tabs {
			ul {
				padding: 10px 10px 0 10px;
				list-style-type: none;
				margin: 0;
				display: flex;

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
			background-color: var(--secondary-background-color);
			padding: 20px 60px;
			border-radius: 8px;

			.header {
				width: fit-content;
				max-width: 100%;

				h1 {
					font-size: 2.75em;
					margin-top: 75px;
					text-align: center;
				}
			}

			#overview {
				width: 25%;
				min-width: 250px;
				float: right;
				margin-top: 60px;
				margin-bottom: 20px;
				margin-left: 30px;

				#overview-html {
					display: flex;
					flex-flow: column nowrap;
					align-items: center;
					width: 100%;
					overflow: hidden;
					hyphens: auto;
					text-align: left;
				}
			}

			#content {
				width: 100%;
				min-height: 70vh;
				text-align: justify;

				#content-html {
					width: 100%;
				}
			}

			// Globals for the content included with "@html"

			:global(a[data-fancybox]) {
				display: block;
				height: fit-content;

				&:not(:is(figure *) > a[data-fancybox]) {
					width: 150px; // Only apply default size to images that are NOT in a figure
				}

				:global(.thumbnail) {
					width: 100%;
					border: 2px solid #ddd;
					border-radius: 5px;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					transition:
						transform 0.3s ease,
						box-shadow 0.3s ease;
					cursor: pointer;

					&:hover {
						transform: scale(1.02);
						box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
						border-color: #aaa;
					}
				}
			}

			:global(figure) {
				margin: 40px auto;
			}

			:global(table) {
				width: 100%;
				border: 1px solid #ccc;
				border-radius: 5px;
				border-collapse: collapse;
				padding: 5px;
				table-layout: fixed;

				:global(th),
				:global(td) {
					border: 1px solid #ccc;
					padding: 5px;
					border-collapse: collapse;
					border-spacing: 0;
					vertical-align: top;

					&:empty {
						display: none;
					}
				}
			}

			:global(blockquote) {
				margin: 0;
				padding: 5px 20px;
				margin: 10px 0;
				background-color: var(--primary-background-color);
				border-left: 5px solid var(--secondary-color);
			}
		}
	}
</style>
