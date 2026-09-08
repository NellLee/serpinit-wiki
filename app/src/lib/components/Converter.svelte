<script lang="ts">
	import { onMount } from 'svelte';

	interface Unit {
		name: string;
		toBase: (value: number) => number;
		fromBase: (value: number) => number;
	}

	interface Props {
		systems: Unit[];
	}

	let { systems }: Props = $props();
	// eslint-disable-next-line svelte/valid-compile -- intentional initial-value-only read, not reactive to prop changes
	let baseUnit = systems[0];
	// eslint-disable-next-line svelte/valid-compile -- intentional initial-value-only read, not reactive to prop changes
	let otherUnits = systems.slice(1);

	let sampleValues: number[] = [1, 5, 10, 15, 20, 30, 50, 100, 1000];
	let convertedValues: number[][] = $state([]);
	let inputValue: number = $state(1);
	let inputConvertedValues: number[] = $state([]);

	function convertSampleValues() {
		convertedValues = sampleValues.map((value) => [
			value,
			...otherUnits.map((unit) => unit.fromBase(baseUnit.toBase(value)))
		]);
	}

	function convertInputValue() {
		inputConvertedValues = [
			inputValue,
			...otherUnits.map((unit) => unit.fromBase(baseUnit.toBase(inputValue)))
		];
	}

	onMount(() => {
		convertSampleValues();
		convertInputValue();
	});
</script>

<table class="unit-table">
	<thead>
		<tr>
			<th>{baseUnit.name}</th>
			{#each otherUnits as unit}
				<th>{unit.name}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><input type="number" bind:value={inputValue} oninput={convertInputValue} /></td>
			{#each inputConvertedValues.slice(1) as cell}
				<td>{cell}</td>
			{/each}
		</tr>
		{#each convertedValues as row}
			<tr>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	.unit-table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;

		th,
		td {
			border: 1px solid #ccc;
			padding: 8px;
			text-align: center;
		}

		th {
			background-color: #f2f2f2;
			font-weight: bold;
		}
	}
</style>
