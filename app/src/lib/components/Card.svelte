<script lang="ts">
	export let name = "";
</script>

<div class="card">
	{#if name != ""}
		<h2>{name}</h2>
		<hr/>
	{/if}
    <div id="slot">
        <slot />
    </div>
</div>

<style lang="scss">
	.card {
        max-width: 100%;
        min-width: 160px;
        min-height: 100px;
		background-color: var(--primary-background-color);
		padding: 8px 12px 8px 12px;
		border-radius: 8px;
		box-shadow: 2px 2px 6px -3px rgb(0, 0, 0, 0.7);

		h2 {
			margin: 0px;
			padding-bottom: 6px;
			text-align: center;
		}

        hr {
            color: rgb(0,0,0,0.4);
        }

        #slot {
            padding: 16px 6px 16px 6px;
        }
	}
</style>
