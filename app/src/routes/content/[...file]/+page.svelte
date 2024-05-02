<script context="module">
</script>

<script lang="ts">
	import { Icon, Home } from 'svelte-hero-icons';

	export let data;
</script>

<main>
	<nav id="nav-bar">
		<ul>
			<li>
				<a href="/content">Wiki</a>
			</li>
			<li>
				<a href="/gallery">Gallerie</a>
			</li>
		</ul>
	</nav>

	<body>
		<div id="main-body">
			<div id="table-of-content" class="sidebar">
				{#if data.page.toc.linkList.length > 0}
					<h3>{data.page.toc.name}</h3>
					<nav>
						<ul>
							{#each data.page.toc.linkList as item}
								<li>
									<a href={item.href}>
										{@html item.text}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				{/if}
			</div>

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
			<div id="quick-links" class="sidebar">
				<aside>
					<!-- TODO -->
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
					{#each data.page.references as list}
						{#if list.linkList.length > 0}
							<nav>
								<h2>{list.name}</h2>
								<ul>
									{#each list.linkList as link}
										<li><a href={link.href}>{link.text}</a></li>
									{/each}
								</ul>
							</nav>
						{/if}
					{/each}
				</aside>
			</div>
		</div>
	</body>
</main>

<!-- TODO: Fine-Tune colors below -->
<style>
	/* Colors */
	:root {
		--primary-color: #222222;
		--secondary-color: #000000;
		--background-color: #fff;
		--nav-background-color: rgb(231, 231, 231);
		--sidebar-background-color: #e0e0e0;
		--breadcrumbs-background-color: #eeeeee;
		--breadcrumbs-border-color: #ddd;
		--breadcrumbs-text-color: #666;
		--breadcrumbs-link-color: #333;
		--breadcrumbs-link-hover-color: #000080;
	}

	/* Reset */
	* {
		box-sizing: border-box;
	}

	/* Body */
	body {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.428571429;
		color: var(--primary-color);
		background-color: var(--background-color);
		margin: 0;
	}

	/* Navigation */
	#nav-bar ul {
		list-style-type: none;
		margin: 0;
		padding: 0 15px;
		overflow: hidden;
		background-color: var(--nav-background-color);
		height: 50px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 15px;
	}

	#nav-bar li a {
		display: block;
		color: var(--primary-color);
		text-align: center;
		padding: 0;
		text-decoration: none;
	}

	#nav-bar li a:hover {
		color: var(--secondary-color);
	}

	#nav-bar li:first-of-type a {
		font-size: 18px;
	}

	/* Main Body */
	#main-body {
		max-width: 100vw;
		min-height: fit-content;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: stretch;
	}

	#content-body {
		min-height: 100vh;
		flex-grow: 8;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 25px;
	}

	#parsed-markdown {
		width: 75%;
		text-align: justify;
	}

	/* Sidebar */
	.sidebar {
		width: 15%;
		flex-shrink: 0;
		background-color: var(--sidebar-background-color);
		padding: 10px 20px;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.sidebar nav {
		width: 100%;
		max-width: 100%;
	}

	.sidebar nav ul {
		width: 100%;
		max-width: 100%;
		list-style-type: none;
		padding: 2px 0;
		margin: 0;
		height: auto;
	}

	.sidebar nav li {
		width: 100%;
		max-width: 100%;
		padding-top: 12px;
		max-width: 100%;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sidebar nav li a {
		text-decoration: none;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	/* Breadcrumbs */
	.breadcrumbs {
		width: 100%;
		padding: 10px 20px;
		background-color: var(--breadcrumbs-background-color);
		border-bottom: 1px solid var(--breadcrumbs-border-color);
	}

	.breadcrumbs ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
	}

	.breadcrumbs li {
		display: flex;
		align-items: center;
		color: var(--breadcrumbs-text-color);
		font-size: 14px;
	}

	.breadcrumbs li:not(:last-child)::after {
		content: '/';
		margin: 0 10px;
	}

	.breadcrumbs li a {
		text-decoration: none;
		color: var(--breadcrumbs-link-color);
	}

	.breadcrumbs li a:hover {
		text-decoration: underline;
		color: var(--breadcrumbs-link-hover-color);
	}

	.tags ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
	}

	.tags li a {
		text-decoration: none;
		display: inline-block;
		padding: 0.25rem 0.5rem;
		margin: 0.25rem;
		background-color: #e0e0e0;
		border-radius: 16px;
		color: #333;
		font-size: 14px;
		font-family: Arial, sans-serif;
		transition: background-color 0.3s ease;
	}

	/* Hover effect */
	.tags li a:hover {
		background-color: #bdbdbd;
	}

	/* Header */
	.header h1 {
		font-size: xxx-large;
		margin-top: 75px;
	}
</style>
