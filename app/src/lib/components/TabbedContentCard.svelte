<script lang="ts">
	import { page } from '$app/stores';
	import { Fancybox } from '@fancyapps/ui';
	import '@fancyapps/ui/dist/fancybox/fancybox.css';
	import { onMount } from 'svelte';

	$: currentPath = $page.url.pathname;

	export let tabLinkList: LinkObject[];
	export let title: string;
	export let contentHtml: string;
	export let images: LinkObject[];
	export let fancyBoxImages: boolean = true;

	onMount(() => {
		if (fancyBoxImages) {
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
		<div class="header">
			<h1>{title}</h1>
		</div>
		<div id="overview">
			<div id="gallery">
				{#if images && images.length > 0}
					{#each images as imageLink}
						<a href={imageLink.href} data-fancybox="gallery">
							<img class="thumbnail" alt={imageLink.text} src={imageLink.href} />
						</a>
					{/each}
				{/if}
			</div>
		</div>
		<div id="content">{@html contentHtml}</div>
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
			display: flex;
			flex-flow: column nowrap;
			justify-content: flex-start;
			align-items: center;
			background-color: var(--secondary-background-color);
			padding: 20px;
			border-radius: 8px;

			#overview {
				#gallery {
					display: flex;
					flex-wrap: wrap;

					a {
						position: relative;

						&:nth-child(2) {
							transform: scale(0.4) translateX(-60%);
							.thumbnail {
								opacity: 0.5;
								&:hover {
									transform: scale(1.05);
									box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
									border-color: #aaa;
								}
							}

							&::after {
								content: '+';
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								color: white;
								padding: 5px 10px;
								border-radius: 3px;
								font-size: 100px;
								z-index: 1;
								pointer-events: none;
							}
						}

						&:nth-child(n + 3) {
							display: none;
						}
					}
				}
			}

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
					text-align: center;
				}
			}

			:global(.thumbnail) {
				width: 150px;
				height: auto;
				border: 2px solid #ddd;
				border-radius: 5px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
				transition:
					transform 0.3s ease,
					box-shadow 0.3s ease;
				cursor: pointer;
				position: relative;

				&:hover {
					transform: scale(1.05);
					box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
					border-color: #aaa;
				}

				&::after {
					content: 'Click to view gallery';
					position: absolute;
					bottom: 10px;
					left: 50%;
					transform: translateX(-50%);
					background-color: rgba(0, 0, 0, 0.7);
					color: white;
					padding: 5px 10px;
					border-radius: 3px;
					font-size: 12px;
					opacity: 0;
					transition: opacity 0.3s ease;
				}

				&:hover::after {
					opacity: 1;
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
