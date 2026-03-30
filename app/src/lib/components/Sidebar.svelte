<aside>
	<slot />
</aside>

<style lang="scss">
	aside {
		min-height: 100%;
		width: 100%;
		max-width: 100%;
		flex-shrink: 0;
		background-color: var(--alternative-primary-background-color);
		border: 1px solid var(--primary-border-color);
		border-radius: 12px;
		padding: 18px 16px;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: stretch;
		text-overflow: ellipsis;
		gap: 28px;
		box-shadow: 0 8px 18px rgba(0, 0, 0, 0.04);

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
