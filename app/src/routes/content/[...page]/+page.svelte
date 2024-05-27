<script lang="ts">
	import EllipsisText from '$lib/components/EllipsisText.svelte';
	import '$lib/styles.css';
	import { Icon, Home } from 'svelte-hero-icons';

	export let data;
</script>

<aside id="table-of-content" class="sidebar">
	{#if data.page.toc.linkList.length > 0}
		<h3>{data.page.toc.name}</h3>
		<nav>
			<ul>
				{#each data.page.toc.linkList as item}
					<li>
						<a href={item.href}>
							<EllipsisText>
								{@html item.text}
							</EllipsisText>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</aside>

<div id="content-body">
	<div class="breadcrumbs">
		<ul>
			<li>
				<a href={data.page.breadcrumbs.shift()?.href}>
					<Icon style="transform: translateY(3px);" src={Home} solid size="16" />
				</a>
			</li>
			{#each data.page.breadcrumbs as link}
				<li><a href={link.href}>{link.text}</a></li>
			{/each}
		</ul>
	</div>
	<div class="header">
		<h1>{data.page.title}</h1>
	</div>
	<div id="parsed-markdown">{@html data.page.html}</div>
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
