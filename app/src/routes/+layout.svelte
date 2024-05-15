
<script lang="ts">
	import '$lib/styles.css';
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
            <slot/>
        </div>
    </body>
</main>