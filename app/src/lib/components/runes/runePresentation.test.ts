import { describe, expect, test } from 'vitest';
import { getRunicDocumentById } from '$lib/runes/library';
import { createRunePresentation } from './runePresentation';

describe('rune presentation', () => {
	test('preserves canonical sector ordering and opposition count', () => {
		const presentation = createRunePresentation(getRunicDocumentById('primitive.leitbahn'));

		expect(presentation.sectors.map((sector) => sector.name)).toEqual([
			'auslass',
			'lenkung',
			'entfaltung',
			'spaltung',
			'praegung',
			'siegelung',
			'sammlung',
			'begrenzung'
		]);
		expect(presentation.oppositions).toHaveLength(4);
		expect(presentation.sectors[0].startAngle).toBe(-90);
	});

	test('derives ascending layer radii', () => {
		const presentation = createRunePresentation(getRunicDocumentById('primitive.leitbahn'));

		expect(presentation.layerRadii[0]).toBe(0);
		expect(presentation.layerRadii.at(-1)).toBeGreaterThan(presentation.layerRadii[1]);
	});

	test('maps shape families from canonical placements', () => {
		const presentation = createRunePresentation(getRunicDocumentById('structure.geschuetzter-auslass'));

		expect(presentation.shapeFamilies).toEqual(expect.arrayContaining(['leitbahn', 'anker', 'mantel', 'sperre']));
		expect(presentation.relations).toHaveLength(3);
	});

	test('renders distinct path patterns for different relation modes', () => {
		const presentation = createRunePresentation(getRunicDocumentById('rune.substrat-gebundener-auslass'));
		const guarded = createRunePresentation(getRunicDocumentById('structure.geschuetzter-auslass'));
		const strahl = presentation.relations.find((relation) => relation.mode === 'strahl');
		const strahlbogen = presentation.relations.find((relation) => relation.mode === 'strahlbogen');
		const bruecke = presentation.relations.find((relation) => relation.mode === 'bruecke');
		const bogen = guarded.relations.find((relation) => relation.mode === 'bogen');

		expect(strahl?.path).toContain('L');
		expect(strahl?.path).not.toContain('A');
		expect(bogen?.path).toContain('A');
		expect(bogen?.path).not.toContain('Q');
		expect(strahlbogen?.path).toContain('A');
		expect(strahlbogen?.path).toContain('L');
		expect(strahlbogen?.path).not.toContain('Q');
		expect(bruecke?.path).toContain('Q');
		expect(strahlbogen?.path).not.toBe(bruecke?.path);
		expect(bogen?.path).not.toBe(strahlbogen?.path);
		expect(strahl?.path).not.toBe(bruecke?.path);
	});

	test('assigns explicit control-path emphasis metadata for canvas rendering', () => {
		const presentation = createRunePresentation(getRunicDocumentById('rune.substrat-gebundener-auslass'));
		const relation = presentation.relations.find((entry) => entry.mode === 'strahlbogen');

		expect(relation).toMatchObject({
			emphasis: 'primary',
			layering: 'above-shapes'
		});
	});
});
