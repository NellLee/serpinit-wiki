<script lang="ts">
	import Sidebar from "$lib/components/Sidebar.svelte";
	import MidPanel from "$lib/components/MidPanel.svelte";
	import Converter from "$lib/components/Converter.svelte";

	const lengthSystems = [
		{
			name: "Meter",
			toBase: (value: number) => value,
			fromBase: (value: number) => value
		},
		{
			name: "Centimeter",
			toBase: (value: number) => value * 100,
			fromBase: (value: number) => value / 100
		},
		{
			name: "Foot",
			toBase: (value: number) => value * 3.28084,
			fromBase: (value: number) => value / 3.28084
		}
	];
	const planetaryYearSystems = [
		{
			name: "Mercury",
			toBase: (value: number) => value / 0.2408467,
			fromBase: (value: number) => value * 0.2408467
		},
		{
			name: "Venus",
			toBase: (value: number) => value / 0.61519726,
			fromBase: (value: number) => value * 0.61519726
		}
		// Add other planets here...
	];
</script>

<svelte:head>
	<title>CONVERT</title>
</svelte:head>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<div slot="content">
			<Converter systems={lengthSystems} />
			<Converter systems={planetaryYearSystems} />
		</div>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>
