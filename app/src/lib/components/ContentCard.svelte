<script lang="ts">
	import { Fancybox } from '@fancyapps/ui';
	import '@fancyapps/ui/dist/fancybox/fancybox.css';
	import { onMount } from 'svelte';
	import Card from './Card.svelte';

	interface Props {
		title: string;
		fancyBoxGallery?: boolean;
		contentHtml: string;
		overviewHtml: string | null;
		contentMinHeight?: string;
		tags?: Array<{ text: string; href: string }>;
	}

	let {
		title,
		fancyBoxGallery = true,
		contentHtml,
		overviewHtml,
		contentMinHeight = '70vh',
		tags = []
	}: Props = $props();

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
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html overviewHtml}
					</div>
				</Card>
			</div>
		{/if}
		<div class="header">
			<h1>{title}</h1>
			{#if tags.length > 0}
				<ul class="tags" aria-label="Kategorien">
					{#each tags as tag}
						<li><a href={tag.href}>{tag.text}</a></li>
					{/each}
				</ul>
			{/if}
		</div>
		<div id="content" style="min-height: {contentMinHeight}">
			<div lang="de" id="content-html">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html contentHtml}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.content-card {
		#content-body {
			width: 100%;
			background: linear-gradient(180deg, rgba(255, 250, 241, 0.96), rgba(248, 241, 228, 0.96));
			padding: 1.35rem;
			border-radius: 1rem;
			border: 1px solid var(--border-subtle);
			box-shadow: var(--shadow-strong);
			display: flow-root;

			@media (min-width: 960px) {
				padding: clamp(1.8rem, 2.8vw, 3rem) clamp(1.7rem, 4vw, 4rem);
				border-radius: 1.1rem;
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
					font-size: 2.35rem;
					margin: 0.5rem 0 0;
					line-height: 1.02;
					text-align: center;
					text-wrap: balance;

					@media (min-width: 960px) {
						margin-top: 0;
						font-size: clamp(2.1rem, 3.2vw, 3rem);
						letter-spacing: -0.03em;
						text-align: left;
					}
				}

				.tags {
					display: flex;
					flex-wrap: wrap;
					gap: 0.4rem;
					margin: 0.7rem 0 0;
					padding: 0;
					list-style: none;

					a {
						display: inline-block;
						padding: 0.2rem 0.7rem;
						border: 1px solid var(--border-subtle);
						border-radius: 999px;
						background: var(--surface-raised);
						color: var(--text-muted);
						font-size: 0.82rem;
						text-decoration: none;

						&:hover {
							border-color: var(--primary-color);
							color: var(--primary-color);
						}
					}
				}
			}

			#overview {
				width: 100%;
				float: none;
				margin: 0 0 1.25rem;
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
				text-align: left;

				@media (min-width: 960px) {
					hyphens: auto;
					line-height: 1.8;
					font-size: 1.03rem;
				}

				#content-html {
					width: 100%;
					text-wrap: pretty;
				}
			}

			@media (min-width: 960px) {
				&:global(:has(#overview)) {
					display: grid;
					grid-template-columns: minmax(0, 1fr) minmax(18rem, 22rem);
					column-gap: clamp(1.5rem, 2vw, 2.5rem);
					align-items: start;
				}

				&:global(:has(#overview)) .header,
				&:global(:has(#overview)) #content {
					grid-column: 1;
				}

				&:global(:has(#overview)) #overview {
					grid-column: 2;
					grid-row: 1 / span 2;
					float: none;
					width: 100%;
					margin: 0;
				}
			}

			:global(.img-link) {
				border: 1px solid rgba(112, 88, 48, 0.2);
				background-color: var(--surface-strong);
				border-radius: 0.75rem;
				padding: 0.85rem 0.65rem;
				position: relative;
				display: block;
				box-shadow: var(--shadow-soft);

				:global(.thumbnail) {
					max-width: 100%;
					padding: 0.8rem;
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
				width: 100%;
				margin: 1.2rem auto;
				border-radius: 0.8rem;
				background-color: var(--surface-strong);
				position: relative;
				border: 1px solid var(--border-subtle);

				:global(.comment-indicator) {
					width: 100%;
					color: var(--primary-color);
					text-align: left;
					font-weight: bold;
					border-radius: 0.8rem 0.8rem 0 0;
					box-sizing: border-box;
					background: rgba(235, 226, 209, 0.85);

					:global(p) {
						margin: 0;
						line-height: 1.4;
						padding: 0.8rem 1rem;
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
					padding: 1rem;

					:global(p) {
						margin: 0 0 0.9rem;
						line-height: 1.6;
					}
				}
			}

			:global(.katex-html) {
				width: fit-content;
			}

			:global(figure) {
				position: relative;
				width: min(100%, 24rem);
				height: fit-content;
				margin: 1rem auto !important;
				float: none;
				overflow: hidden;
				border-radius: 0.75rem;
				border: 1px solid rgba(112, 88, 48, 0.16);
				background: var(--surface-strong);
				box-shadow: var(--shadow-soft);

				:global(p) {
					padding: 0;
					margin: 0;
				}

				:global(figcaption) {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					background-color: rgba(61, 61, 61, 0.74);
					color: white;
					text-align: center;
					padding: 0.55rem 0.75rem;
					box-sizing: border-box;
				}

				&:hover {
					transform: translateY(-2px);
					box-shadow: var(--shadow-strong);
				}
			}

			:global(a[data-fancybox]) {
				display: block;
				height: fit-content;

				&:not(:is(figure *) > a[data-fancybox]) {
					width: min(100%, 11rem);

					&:hover {
						transform: translateY(-2px);
						box-shadow: var(--shadow-strong);
					}
				}

				:global(.thumbnail) {
					display: block;
					width: 100%;
					height: auto;
					border: 1px solid rgba(112, 88, 48, 0.12);
					border-radius: 0.65rem;
					box-shadow: none;
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
				gap: 1.4rem;

				:global(a[data-fancybox]) {
					&:global(:not(:is(figure *) > a[data-fancybox])) {
						width: min(100%, 15rem);
					}
				}
			}

			:global(table) {
				width: 100%;
				margin: 1.75rem 0;
				border: 1px solid rgba(112, 88, 48, 0.12);
				border-radius: 10px;
				border-collapse: separate;
				border-spacing: 0;
				padding: 0;
				table-layout: auto;
				overflow: hidden;
				box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);

				:global(th),
				:global(td) {
					border-right: 1px solid rgba(112, 88, 48, 0.08);
					border-bottom: 1px solid rgba(112, 88, 48, 0.08);
					padding: 0.7rem 0.85rem;
					vertical-align: top;

					&:empty {
						display: none;
					}
				}

				:global(th) {
					background: rgba(231, 216, 188, 0.46);
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
			}

			:global(blockquote) {
				margin: 1.5rem 0;
				padding: 1rem 1.25rem;
				background-color: rgba(244, 235, 219, 0.72);
				border-left: 4px solid var(--accent-strong);
				border-radius: 0 0.75rem 0.75rem 0;
			}

			:global(a) {
				color: var(--accent-strong);
				text-decoration-line: underline;
				text-decoration-thickness: 0.08em;
				text-underline-offset: 0.16em;

				&:hover {
					color: var(--primary-color);
				}
			}

			:global(p) {
				margin: 0 0 1.1em;
				line-height: 1.78;
			}

			:global(h1),
			:global(h2),
			:global(h3),
			:global(h4),
			:global(h5),
			:global(h6) {
				margin: 2em 0 0.7em;
				line-height: 1.16;
				text-wrap: balance;
				font-weight: 650;
			}

			:global(h2) {
				font-size: clamp(1.7rem, 2.6vw, 2.15rem);
			}

			:global(h3) {
				font-size: clamp(1.25rem, 1.8vw, 1.55rem);
			}

			:global(h4) {
				font-size: 1.08rem;
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
				padding-left: 1.45em;
			}

			:global(li + li) {
				margin-top: 0.35em;
			}

			@media (min-width: 960px) {
				:global(figure) {
					margin: 0 0 1.5rem 1.75rem !important;
					float: right;
				}

				:global(#gallery) {
					gap: clamp(1.5rem, 3vw, 3rem);
				}
			}
		}
	}
</style>
