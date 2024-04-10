<script context="module">
</script>

<script lang="ts">
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
				<h3>{data.toc.name}</h3>
				<nav>
					<ul>
						{#each data.toc.linkList as item}
							<li>
								<a href={item.href}>
									{item.text}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</div>

			<div id="content-body">
				<div class="header">
					<h1>{data.title}</h1>
				</div>
				<div id="parsed-markdown">{@html data.html}</div>
			</div>

			<div id="quick-links" class="sidebar">
				{#each data.references as list}
					<aside>
						<nav>
							<h2>{list.name}</h2>
							<ul>
								{#each list.linkList as link}
									<li><a href={link.href}>{link.text}</a></li>
								{/each}
							</ul>
						</nav>
					</aside>
				{/each}
			</div>
		</div>
	</body>
</main>

<style>
	* {
		box-sizing: border-box;
	}

	body {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 14px;
		line-height: 1.428571429;
		color: #333;
		background-color: #fff;
		margin: 0;
	}

	#nav-bar ul {
		list-style-type: none;
		margin: 0;
		padding: 0 15px;
		overflow: hidden;
		background-color: #f3f3f3;
		height: 50px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 15px;
	}

	#nav-bar li a {
		display: block;
		color: #727272;
		text-align: center;
		padding: 0;
		text-decoration: none;
	}

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

	#nav-bar li a:hover {
		color: #000000;
	}

	#nav-bar li:first-of-type a {
		font-size: 18px;
	}

	.sidebar {
		min-width: 10%;
		max-width: 15%;
		flex-shrink: 0;
		background-color: #eeeeee;
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

	#table-of-content li a {
		color: inherit;
	}

	.sidebar nav li a:hover {
		text-decoration: none;
	}

	#table-of-content li a:hover {
		font-weight: bold;
	}

	.header h1 {
		font-size: xxx-large;
		margin-top: 75px;
	}
</style>
