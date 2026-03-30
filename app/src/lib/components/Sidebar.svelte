<aside>
	<slot />
</aside>

<style lang="scss">
	aside {
		min-height: 100%;
		width: 100%;
		max-width: 100%;
		flex-shrink: 0;
		background-color: rgba(255, 250, 241, 0.5);
		border: 1px solid rgba(112, 88, 48, 0.08);
		border-radius: 12px;
		padding: 16px 14px;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-overflow: ellipsis;
		gap: 28px;
		box-shadow: none;

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
