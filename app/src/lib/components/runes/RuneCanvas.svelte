<script lang="ts">
	import type { RunePresentation } from './runePresentation';

	export let presentation: RunePresentation;

	const familyClassNames: Record<string, string> = {
		leitbahn: 'shape-leitbahn',
		drossel: 'shape-drossel',
		kammer: 'shape-kammer',
		gabel: 'shape-gabel',
		anker: 'shape-anker',
		mantel: 'shape-mantel',
		sperre: 'shape-sperre',
		schwelle: 'shape-schwelle',
		pruefkammer: 'shape-pruefkammer',
		weiche: 'shape-weiche',
		rueckfuehrung: 'shape-rueckfuehrung',
		siegelpfad: 'shape-siegelpfad'
	};

	$: outerRadius = presentation.layerRadii[presentation.layerRadii.length - 1] ?? 0;
</script>

<div class="canvas-panel">
	<svg viewBox={`0 0 ${presentation.canvasSize} ${presentation.canvasSize}`} aria-label={presentation.document.name}>
		<circle class="core" cx={presentation.center} cy={presentation.center} r="18" />

		{#each presentation.layerRadii.slice(1) as radius}
			<circle class="layer" cx={presentation.center} cy={presentation.center} r={radius} />
		{/each}

		{#each presentation.sectors as sector}
			{@const angle = (sector.centerAngle * Math.PI) / 180}
			{@const x2 = presentation.center + Math.cos(angle) * outerRadius}
			{@const y2 = presentation.center + Math.sin(angle) * outerRadius}
			<line class="sector-line" x1={presentation.center} y1={presentation.center} {x2} {y2} />
			<text
				class="sector-label"
				x={presentation.center + Math.cos(angle) * (outerRadius + 24)}
				y={presentation.center + Math.sin(angle) * (outerRadius + 24)}
			>
				{sector.name}
			</text>
		{/each}

		{#each presentation.relations as relation}
			<path class={`relation relation-${relation.mode}`} d={relation.path} />
		{/each}

		{#each presentation.shapes as shape}
			<path class={`shape ${familyClassNames[shape.shapeFamily] ?? ''}`} d={shape.path} />
			<text class="shape-label" x={shape.labelX} y={shape.labelY}>{shape.label}</text>
		{/each}
	</svg>
</div>

<style lang="scss">
	.canvas-panel {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		padding: 1rem;
		box-shadow: var(--shadow-soft);

		svg {
			width: 100%;
			height: auto;
			overflow: visible;
		}
	}

	.core {
		fill: rgba(112, 88, 48, 0.16);
		stroke: rgba(112, 88, 48, 0.6);
		stroke-width: 2;
	}

	.layer,
	.sector-line {
		fill: none;
		stroke: rgba(112, 88, 48, 0.18);
		stroke-width: 1;
	}

	.relation {
		fill: none;
		stroke: rgba(54, 36, 13, 0.55);
		stroke-width: 2;
	}

	.relation-strahl {
		stroke-dasharray: 6 4;
	}

	.relation-bogen {
		stroke: rgba(78, 70, 34, 0.6);
	}

	.relation-strahlbogen {
		stroke: rgba(38, 88, 112, 0.62);
	}

	.relation-bruecke {
		stroke: rgba(88, 46, 108, 0.62);
	}

	.shape {
		stroke: rgba(32, 24, 19, 0.88);
		stroke-width: 2;
	}

	.shape-leitbahn { fill: rgba(171, 127, 47, 0.38); }
	.shape-drossel { fill: rgba(160, 89, 32, 0.42); }
	.shape-kammer { fill: rgba(116, 141, 78, 0.38); }
	.shape-gabel { fill: rgba(114, 101, 175, 0.3); }
	.shape-anker { fill: rgba(40, 106, 121, 0.35); }
	.shape-mantel { fill: rgba(88, 78, 66, 0.24); }
	.shape-sperre { fill: rgba(126, 53, 46, 0.35); }
	.shape-schwelle { fill: rgba(178, 116, 34, 0.38); }
	.shape-pruefkammer { fill: rgba(85, 127, 72, 0.42); }
	.shape-weiche { fill: rgba(89, 97, 176, 0.34); }
	.shape-rueckfuehrung { fill: rgba(58, 122, 139, 0.34); }
	.shape-siegelpfad { fill: rgba(135, 58, 78, 0.36); }

	.sector-label,
	.shape-label {
		font-size: 12px;
		fill: var(--primary-color);
		text-anchor: middle;
	}

	.shape-label {
		font-weight: 700;
	}
</style>
