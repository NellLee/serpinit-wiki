<script lang="ts">
	import { page } from '$app/stores';
	import { Fancybox } from '@fancyapps/ui';
	import '@fancyapps/ui/dist/fancybox/fancybox.css';
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	$: currentPath = $page.url.pathname;

	export let title: string;
	export let fancyBoxGallery: boolean = true;
	export let contentHtml: string;
	export let overviewHtml: string | null;
	export let contentMinHeight: string = '70vh';

	onMount(() => {
		if (fancyBoxGallery) {
			Fancybox.bind("[data-fancybox='gallery']", {
				Thumbs: {
					type: 'modern'
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
			display: flow-root;

			@media (min-width: 960px) {
				padding: clamp(2rem, 2.8vw, 3.5rem) clamp(2rem, 4vw, 4.5rem);
				border-radius: 16px;
				border: 1px solid rgba(0, 0, 0, 0.08);
				box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
			}

			.header {
				width: fit-content;
				max-width: 100%;
				margin: 0 auto;

				@media (min-width: 960px) {
					width: min(100%, 42rem);
					margin: 0 0 1.5rem;
				}

				h1 {
					font-size: 2.75em;
					margin: 75px 0 0;
					line-height: 1.08;
					text-align: center;
					text-wrap: balance;

					@media (min-width: 960px) {
						margin-top: 0;
						font-size: clamp(2.3rem, 4vw, 3.75rem);
						letter-spacing: -0.03em;
						text-align: left;
					}
				}
			}

			#overview {
				width: 25%;
				min-width: 250px;
				float: right;
				margin-top: 60px;
				margin-bottom: 20px;
				margin-left: 30px;
				overflow: hidden;

				@media (min-width: 960px) {
					width: min(100%, 22rem);
					min-width: 0;
					margin: 0 0 1.5rem 2rem;
					float: right;
				}

				#overview-html {
					display: flex;
					flex-flow: column nowrap;
					align-items: stretch;
					gap: 0.75rem;
					width: 100%;
					overflow: hidden;
					hyphens: auto;
					text-align: left;
					line-height: 1.55;
				}
			}

			#content {
				width: 100%;
				text-align: justify;

				@media (min-width: 960px) {
					text-align: left;
					hyphens: auto;
					line-height: 1.75;
					font-size: 1.04rem;
				}

				#content-html {
					width: 100%;
					text-wrap: pretty;

					@media (min-width: 960px) {
						:global(a) {
							color: var(--secondary-color);
							text-decoration-line: underline;
							text-decoration-thickness: 0.08em;
							text-underline-offset: 0.16em;
							transition:
								color 0.2s ease,
								text-decoration-thickness 0.2s ease;

							&:hover {
								color: var(--primary-color);
								text-decoration-thickness: 0.12em;
							}
						}

						:global(p) {
							margin: 0 0 1.1em;
							line-height: 1.75;
						}

						:global(h1),
						:global(h2),
						:global(h3),
						:global(h4),
						:global(h5),
						:global(h6) {
							margin: 2.1em 0 0.75em;
							line-height: 1.2;
							text-wrap: balance;
							font-weight: 650;
						}

						:global(h1) {
							font-size: clamp(1.95rem, 3.1vw, 2.5rem);
						}

						:global(h2) {
							font-size: clamp(1.65rem, 2.5vw, 2.05rem);
						}

						:global(h3) {
							font-size: clamp(1.35rem, 2vw, 1.7rem);
						}

						:global(h4) {
							font-size: 1.2rem;
						}

						:global(h5) {
							font-size: 1.05rem;
						}

						:global(h6) {
							font-size: 0.95rem;
							letter-spacing: 0.06em;
							text-transform: uppercase;
						}

						:global(h1:first-child),
						:global(h2:first-child),
						:global(h3:first-child),
						:global(h4:first-child),
						:global(h5:first-child),
						:global(h6:first-child),
						:global(p:first-child),
						:global(figure:first-child),
						:global(blockquote:first-child),
						:global(table:first-child),
						:global(.comment:first-child) {
							margin-top: 0;
						}

						:global(ul),
						:global(ol) {
							margin: 0 0 1.15em;
							padding-left: 1.5em;
						}

						:global(li + li) {
							margin-top: 0.35em;
						}

						:global(li > p) {
							margin-bottom: 0.65em;
						}

						:global(table) {
							width: 100%;
							margin: 1.75rem 0;
							border: 1px solid rgba(0, 0, 0, 0.12);
							border-radius: 12px;
							border-collapse: separate;
							border-spacing: 0;
							table-layout: auto;
							overflow: hidden;
							box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
						}

						:global(th),
						:global(td) {
							border-right: 1px solid rgba(0, 0, 0, 0.08);
							border-bottom: 1px solid rgba(0, 0, 0, 0.08);
							padding: 0.7rem 0.85rem;
							vertical-align: top;

							&:empty {
								display: none;
							}
						}

						:global(th) {
							background: rgba(0, 0, 0, 0.04);
							font-weight: 650;
							text-align: left;
						}

						:global(th:last-child),
						:global(td:last-child) {
							border-right: none;
						}

						:global(tbody tr:last-child td) {
							border-bottom: none;
						}

						:global(tbody tr:nth-child(even) td) {
							background: rgba(255, 255, 255, 0.18);
						}

						:global(blockquote) {
							margin: 1.5rem 0;
							padding: 1rem 1.25rem;
							background-color: var(--primary-background-color);
							border-left: 4px solid var(--secondary-color);
							border-radius: 0 0.75rem 0.75rem 0;
						}

						:global(blockquote p:last-child) {
							margin-bottom: 0;
						}
					}
				}
			}

			@media (min-width: 960px) {
				&:has(#overview) {
					display: grid;
					grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
					column-gap: clamp(1.5rem, 2vw, 2.5rem);
					align-items: start;
				}

				&:has(#overview) .header,
				&:has(#overview) #content {
					grid-column: 1;
				}

				&:has(#overview) #overview {
					grid-column: 2;
					grid-row: 1 / span 2;
					float: none;
					width: 100%;
					margin: 0;
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
					bottom: 2px;
					left: 2px;
					width: calc(100% - 4px);
					background-color: rgba(61, 61, 61, 0.74);
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
					width: 150px;

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

			@media (min-width: 960px) {
				:global(.img-link) {
					border: 1px solid rgba(0, 0, 0, 0.2);
					border-radius: 0.9rem;
					padding: 0.75rem 0.5rem;
					box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);

					:global(.thumbnail) {
						padding: 1rem;
					}
				}

				:global(.todo) {
					font-weight: 600;
				}

				:global(.comment) {
					width: min(100%, 58rem);
					margin: 1.5rem auto;
					border-radius: 0.9rem;
					background-color: var(--primary-background-color);
					border: 1px solid rgba(0, 0, 0, 0.08);
					box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
					overflow: hidden;

					:global(.comment-indicator) {
						padding: 0.7rem 1rem;
						font-weight: 700;
						text-transform: uppercase;
						letter-spacing: 0.08em;
						background: rgba(0, 0, 0, 0.04);

						:global(p) {
							margin: 0;
							line-height: 1.4;
						}
					}

					:global(.comment-content) {
						padding: 1rem 1rem 1.15rem;

						:global(p) {
							margin: 0 0 0.9rem;
							line-height: 1.65;
						}

						:global(p:last-child) {
							margin-bottom: 0;
						}
					}
				}

				:global(figure) {
					width: min(100%, 26rem);
					max-width: clamp(18rem, 36vw, 26rem);
					margin: 0 0 1.5rem 1.75rem !important;
					float: right;
					overflow: hidden;
					border-radius: 0.95rem;
					border: 1px solid rgba(0, 0, 0, 0.12);
					background: var(--primary-background-color);
					box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
					break-inside: avoid;

					:global(.thumbnail) {
						padding: 0;
						border-radius: 0.95rem;
						box-shadow: none;
					}

					:global(figcaption) {
						bottom: 0;
						left: 0;
						width: 100%;
						padding: 0.55rem 0.75rem;
					}

					&:hover {
						transform: translateY(-2px) scale(1.01);
						box-shadow: 0 18px 34px rgba(0, 0, 0, 0.16);
						border-color: rgba(0, 0, 0, 0.2);
					}
				}

				:global(a[data-fancybox]) {
					max-width: 100%;

					&:not(:is(figure *) > a[data-fancybox]) {
						width: min(100%, 11rem);

						&:hover {
							transform: translateY(-2px) scale(1.01);
							box-shadow: 0 18px 34px rgba(0, 0, 0, 0.16);
							border-color: rgba(0, 0, 0, 0.2);
						}
					}

					:global(.thumbnail) {
						border-radius: 0.75rem;
					}
				}

				:global(#gallery) {
					gap: clamp(1.5rem, 3vw, 3rem);

					:global(a[data-fancybox]) {
						&:not(:is(figure *) > a[data-fancybox]) {
							width: min(100%, 16rem);
						}
					}
				}

				:global(table) {
					margin: 1.75rem 0;
					border: 1px solid rgba(0, 0, 0, 0.12);
					border-radius: 12px;
					border-collapse: separate;
					border-spacing: 0;
					padding: 0;
					table-layout: auto;
					overflow: hidden;
					box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);

					:global(th),
					:global(td) {
						border-right: 1px solid rgba(0, 0, 0, 0.08);
						border-bottom: 1px solid rgba(0, 0, 0, 0.08);
						padding: 0.7rem 0.85rem;

						&:empty {
							display: none;
						}
					}

					:global(th) {
						background: rgba(0, 0, 0, 0.04);
						font-weight: 650;
						text-align: left;
					}

					:global(th:last-child),
					:global(td:last-child) {
						border-right: none;
					}

					:global(tbody tr:last-child td) {
						border-bottom: none;
					}

					:global(tbody tr:nth-child(even) td) {
						background: rgba(255, 255, 255, 0.18);
					}
				}

				:global(blockquote) {
					margin: 1.5rem 0;
					padding: 1rem 1.25rem;
					background-color: var(--primary-background-color);
					border-left: 4px solid var(--secondary-color);
					border-radius: 0 0.75rem 0.75rem 0;
				}

				:global(blockquote p:last-child) {
					margin-bottom: 0;
				}
			}
		}
	}
</style>
