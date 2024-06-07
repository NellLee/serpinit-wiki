<div id="mid-panel">
    <div id="head">
        <slot name="head"></slot>
    </div>
    <div id="content">
        <slot name="content"></slot>
    </div>
</div>

<style lang="scss">
	#mid-panel {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-flow: column nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 25px;


        #head {
            width: 100%;
        }

        #content {
            width: 90%;
        }
	}
</style>
