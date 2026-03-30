<script lang="ts">
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Converter from '$lib/components/Converter.svelte';

	export let data;

	const lengthSystems = [
		{
			name: 'Meter',
			toBase: (value: number) => value,
			fromBase: (value: number) => value
		},
		{
			name: 'Centimeter',
			toBase: (value: number) => value * 100,
			fromBase: (value: number) => value / 100
		},
		{
			name: 'Foot',
			toBase: (value: number) => value * 3.28084,
			fromBase: (value: number) => value / 3.28084
		}
	];
	const planetaryYearSystems = [
		{
			name: 'Mercury',
			toBase: (value: number) => value / 0.2408467,
			fromBase: (value: number) => value * 0.2408467
		},
		{
			name: 'Venus',
			toBase: (value: number) => value / 0.61519726,
			fromBase: (value: number) => value * 0.61519726
		}
	];
</script>

<svelte:head>
	<title>CONVERT</title>
</svelte:head>

<div class="utility-page convert-page">
	<MidPanel contentWidth={data.presentation.contentWidth}>
		<div class="utility-head" slot="head">
			<p class="eyebrow">Werkzeug</p>
			<h1>Convert</h1>
			<p class="lede">
				Nutze fokussierte Werkzeugflächen statt Artikellayouts für wiederholte Umrechnungen.
			</p>
		</div>

		<div class="convert-layout" slot="content">
			<section class="converter-panel">
				<div class="panel-copy">
					<h2>Length</h2>
					<p>Vergleiche gebräuchliche Längeneinheiten in einer kompakten Arbeitsfläche.</p>
				</div>
				<Converter systems={lengthSystems} />
			</section>

			<section class="converter-panel">
				<div class="panel-copy">
					<h2>Planetary Years</h2>
					<p>Wechsle zwischen Umlaufjahres-Systemen, ohne die Arbeitsfläche zu verlassen.</p>
				</div>
				<Converter systems={planetaryYearSystems} />
			</section>
		</div>
	</MidPanel>
</div>

<style lang="scss">
	.utility-page {
		width: 100%;
	}

	.utility-head {
		display: grid;
		gap: 0.55rem;

		p,
		h1 {
			margin: 0;
		}
	}

	.eyebrow {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--secondary-color);
	}

	.lede {
		max-width: 42rem;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.6;
	}

	.convert-layout {
		display: grid;
		gap: 1.5rem;
	}

	.converter-panel {
		padding: 1.2rem 1.35rem 1.35rem;
		border-radius: 1rem;
		background: var(--primary-background-color);
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
	}

	.panel-copy {
		margin-bottom: 1rem;

		h2,
		p {
			margin: 0;
		}

		p {
			margin-top: 0.45rem;
			color: rgba(0, 0, 0, 0.68);
			line-height: 1.6;
		}
	}
</style>
