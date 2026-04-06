import { describe, expect, test } from 'vitest';
import {
	assertNoDeprecatedCanonicalVocabulary,
	assertRunicDocumentIntegrity,
	assertValidRunicDocumentData,
	getRunicDocumentById,
	loadResolvedRunicLibrary,
	validateRunicDocumentData
} from './library';

describe('runic library loading', () => {
	test('loads the authoritative grouped library', () => {
		const library = loadResolvedRunicLibrary({ forceReload: true });

		expect(library.groups).toHaveLength(3);
		expect(library.groups[0].entries.length).toBeGreaterThanOrEqual(12);
		expect(library.groups[1].entries.length).toBeGreaterThanOrEqual(6);
		expect(library.groups[2].entries.length).toBeGreaterThanOrEqual(2);
	});

	test('resolves a document by id through the library', () => {
		const document = getRunicDocumentById('primitive.leitbahn');

		expect(document.id).toBe('primitive.leitbahn');
		expect(document.kind).toBe('primitive');
		expect(document.projection2d.system.orientationFrame.gravityReference).toBe(
			'oben-gegen-schwerkraft'
		);
	});

	test('loads the expanded controlling primitive inventory', () => {
		const library = loadResolvedRunicLibrary({ forceReload: true });
		const primitiveIds = library.groups.find((group) => group.kind === 'primitive')?.entries.map((entry) => entry.id) ?? [];

		expect(primitiveIds).toEqual(
			expect.arrayContaining([
				'primitive.schwelle',
				'primitive.pruefkammer',
				'primitive.weiche',
				'primitive.rueckfuehrung',
				'primitive.siegelpfad'
			])
		);
	});

	test('rejects malformed documents', () => {
		const malformed = {
			id: 'primitive.invalid',
			name: 'Invalid',
			kind: 'primitive',
			version: '1.0.0',
			description: 'broken'
		};

		expect(validateRunicDocumentData(malformed)).toBe(false);
		expect(() => assertValidRunicDocumentData(malformed, 'inline')).toThrow(/Invalid runic document/);
	});

	test('rejects projection paths that reference missing placements', () => {
		const library = loadResolvedRunicLibrary({ forceReload: true });
		const broken = structuredClone(getRunicDocumentById('rune.lokaler-auslass'));
		broken.projection2d.relationPaths[0].target = 'instance:missing';

		expect(() => assertRunicDocumentIntegrity(broken, library.documentsById, 'inline')).toThrow(
			/missing placement/
		);
	});

	test('rejects non-canonical sector definitions', () => {
		const library = loadResolvedRunicLibrary({ forceReload: true });
		const broken = structuredClone(getRunicDocumentById('primitive.leitbahn'));
		broken.projection2d.system.sectors[0].name = 'lenkung';

		expect(() => assertRunicDocumentIntegrity(broken, library.documentsById, 'inline')).toThrow(
			/sector 0 must be auslass/
		);
	});

	test('rejects deprecated English canonical vocabulary in inline documents', () => {
		const broken = structuredClone(getRunicDocumentById('primitive.leitbahn'));
		broken.projection2d.placements[0].shapeFamily = 'channel';

		expect(() => assertNoDeprecatedCanonicalVocabulary(broken, 'inline')).toThrow(
			/deprecated canonical vocabulary/i
		);
	});

	test('loads example runes with integrated control structures', () => {
		const rune = getRunicDocumentById('rune.substrat-gebundener-auslass');

		expect(JSON.stringify(rune)).toMatch(/schwelle|pruefkammer|weiche|siegelpfad|rueckfuehrung/);
	});
});
