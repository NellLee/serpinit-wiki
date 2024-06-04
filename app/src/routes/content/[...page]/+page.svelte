<script lang="ts">
	import EllipsisText from '$lib/components/EllipsisText.svelte';
	import LinkTree from '$lib/components/LinkTree.svelte';
	import '$lib/styles.css';
	import { linkTreeToList } from '$lib/utilities/links.js';
	import { Icon, Home } from 'svelte-hero-icons';

	export let data;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<aside id="table-of-content" class="sidebar">
	{#if data.page.toc.children.length > 0}
		<h3>Inhalt</h3>
		<nav>
			<LinkTree tree={data.page.toc}/>
		</nav>
	{/if}
</aside>

<div id="mid-panel">
	<div id="headline">
		<div class="breadcrumbs">
			<ul>
				{#each data.page.breadcrumbs as link, i}
					{#if i == 0}
						<li>
							<a href={link.href}>
								<Icon style="transform: translateY(3px);" src={Home} solid size="16" />
							</a>
						</li>
					{:else}
						<li><a href={link.href}>{link.text}</a></li>
					{/if}
				{/each}
				{#if data.page.breadcrumbs.length > 0}
					<li>...</li>
				{/if}
			</ul>
		</div>
	</div>
	<div class="content-card">
		<div class="tabs">
			<ul>
				{#each data.page.tabs as link}
					<li><a href={link.href}>{link.text}</a></li>
				{/each}
			</ul>
		</div>
		<div id="content-body">
			<div class="header">
				<h1>{data.page.title}</h1>
			</div>
			<div id="parsed-markdown">{@html data.page.html}</div>
		</div>
	</div>
</div>

<aside id="quick-links" class="sidebar">
	{#if data.page.tags.length > 0}
		<div class="tags">
			<nav>
				<h2>Tags</h2>
				<ul>
					{#each data.page.tags as link}
						<li><a href={link.href}>{link.text}</a></li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
	{#each data.page.references as list}
		{#if list.linkList.length > 0}
			<nav>
				<h2>{list.name}</h2>
				<ul>
					{#each list.linkList as link}
						<li><a href={link.href}><EllipsisText>{link.text}</EllipsisText></a></li>
					{/each}
				</ul>
			</nav>
		{/if}
	{/each}
</aside>
