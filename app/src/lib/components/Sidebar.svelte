
<aside>
	<slot />
</aside>

<style lang="scss">
	aside {
		min-height: 100%;
		width: 100%;
		max-width: 100%;
		flex-shrink: 0;
		background-color: var(--secondary-background-color);
		padding: 10px 20px;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		text-overflow: ellipsis;
		gap: 50px;
		padding-top: 50px;


		:global(ul) {
			width: 100%;
			max-width: 100%;
			list-style-type: none;
			padding: 2px 0;
			margin: 0;
			height: auto;
		}

		:global(li) {
			width: 100%;
			max-width: 100%;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
