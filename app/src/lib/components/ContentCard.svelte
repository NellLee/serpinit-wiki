<script lang="ts">
	import { page } from "$app/stores";
	import { Fancybox } from "@fancyapps/ui";
	import "@fancyapps/ui/dist/fancybox/fancybox.css";
	import { onMount } from "svelte";
	import Card from "./Card.svelte";

	$: currentPath = $page.url.pathname;

	export let title: string;
	export let fancyBoxGallery: boolean = true;
	export let contentHtml: string;
	export let overviewHtml: string | null;
	export let contentMinHeight: string = "70vh";

	onMount(() => {
		if (fancyBoxGallery) {
			Fancybox.bind("[data-fancybox='gallery']", {
				Thumbs: {
					type: "modern"
				}
			});
		}
	});
</script>

<div class="content-card">
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
		<div id="content" style="min-height: {contentMinHeight}">
			<div lang="de" id="content-html">
				{@html contentHtml}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.content-card {
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
				text-align: justify;

				#content-html {
					width: 100%;
				}
			}
			:global(.img-link) {
				border: rgb(95, 95, 95) 2px solid;
				background-color: var(--primary-background-color);
				border-radius: 10px;
				padding: 10px 5px;
				position: relative;
				display: block;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

				:global(.thumbnail) {
					max-width: 100%;
					padding: 20px;
				}

				:global(.img-link-text) {
					width: 100%;
					text-align: center;
				}
			}

			:global(.todo) {
				color: red;
			}

			:global(.comment) {
				width: 95%;
				margin: 1rem auto;
				border-radius: 0.5rem;
				background-color: #f9f9f9;
				position: relative;

				:global(.comment-indicator) {
					width: 100%;
					color: #fff;
					text-align: left;
					font-weight: bold;
					border-radius: 0.5rem 0.5rem 0 0;
					box-sizing: border-box;

					:global(p) {
						margin-left: 1rem;
						line-height: 3;
					}
				}

				:global(.comment-indicator.todo) {
					color: #e74c3c;
				}

				:global(.comment-indicator.maybe) {
					color: #f39c12;
				}

				:global(.comment-indicator.note) {
					color: #2ecc71;
				}
				:global(.comment-content) {
					min-height: 2.5rem;

					:global(p) {
						margin: 1rem;
						line-height: 1.5;
					}
				}
			}

			:global(.katex-html) {
				width: fit-content;
			}

			:global(figure) {
				position: relative;
				width: 400px;
				height: fit-content;
				margin: 0 20px !important;
				float: right;

				:global(p) {
					padding: 0;
					margin: 0;
				}

				:global(figcaption) {
					position: absolute;
					bottom: 2px; // Adjusting for the image border
					left: 2px; // Adjusting for the image border
					width: calc(100% - 4px); // Adjusting for the image border on both sides
					background-color: rgba(61, 61, 61, 0.74); // semi-transparent grey
					color: white;
					text-align: center;
					padding: 5px;
					box-sizing: border-box;
				}

				&:hover {
					transform: scale(1.02);
					box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
					border-color: #aaa;
				}
			}

			:global(a[data-fancybox]) {
				display: block;
				height: fit-content;

				&:not(:is(figure *) > a[data-fancybox]) {
					width: 150px; // Only apply default size to images that are NOT in a figure

					// Have to reapply fig hover effect
					&:hover {
						transform: scale(1.02);
						box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
						border-color: #aaa;
					}
				}

				:global(.thumbnail) {
					display: block;
					width: 100%;
					height: auto;
					border: 2px solid #ddd;
					border-radius: 5px;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					transition:
						transform 0.3s ease,
						box-shadow 0.3s ease;
					cursor: pointer;
				}
			}

			:global(#gallery) {
				width: 100%;
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				gap: 55px;

				:global(a[data-fancybox]) {
					&:not(:is(figure *) > a[data-fancybox]) {
						width: 250px;
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
