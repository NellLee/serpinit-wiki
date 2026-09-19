import { describe, expect, test } from 'vitest';
import { extractEventsFromRawMarkdown } from './timeline';

describe('extractEventsFromRawMarkdown', () => {
	test('parses a bare event with no description', () => {
		const markdown = `# Title\n\n<!-- event: start=0 category="Ikusation" text="Beginn der Ikusation" -->\n\n## Nächster Abschnitt\n`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Ereignis/Ikusation.md');

		expect(events).toHaveLength(1);
		expect(events[0].start).toBe(0);
		expect(events[0].end).toBe(0);
		expect(events[0].text).toBe('Beginn der Ikusation');
		expect(events[0].href).toBe('/content/Ereignis/Ikusation.md');
		expect(events[0].category?.name).toBe('Ikusation');
		expect(events[0].description).toBeUndefined();
	});

	test('defaults end to start when omitted', () => {
		const markdown = `<!-- event: start=-12.26 category="Mognar" text="Drachenkinder entdecken Navura" -->`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Himmelskörper/Mognar/index.md');

		expect(events[0].start).toBe(-12.26);
		expect(events[0].end).toBe(-12.26);
	});

	test('captures the immediately following paragraph as description', () => {
		const markdown = `<!-- event: start=-21006404 category="Interplanetar" text="Creapatos erschafft das Serpinit-Sonnensystem" -->\nDie Gottheit [Creapatos](/content/Allgemein/Aerion.md) formt ein eigenes Sonnensystem.\nUnd definiert magische Gesetze.\n`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Allgemein/Schöpfungsgeschichte.md');

		expect(events[0].description).toBe(
			'Die Gottheit Creapatos formt ein eigenes Sonnensystem. Und definiert magische Gesetze.'
		);
	});

	test('leaves description undefined when a heading follows immediately', () => {
		const markdown = `<!-- event: start=0 category="Ikusation" text="Beginn der Ikusation" -->\n\n## Auslöser\nText.\n`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Ereignis/Ikusation.md');

		expect(events[0].description).toBeUndefined();
	});

	test('supports multiple event hooks in a single file, sharing the same href', () => {
		const markdown = `# Elikta\n\n<!-- event: start=0.0705 category="Ikusation" text="Elikta landet auf Navura" -->\n\nText 1.\n\n<!-- event: start=0.1964 category="Navura" text="Elikta wird neue Königin der Drachenkinder" -->\n\nText 2.\n\n<!-- event: start=1.52 category="Navura" text="Eliktas wahre Identität wird enthüllt" -->\n\nText 3.\n`;
		const events = extractEventsFromRawMarkdown(
			markdown,
			'/content/Volk/Lateralen/Sodili/Charakter/Elikta/index.md'
		);

		expect(events).toHaveLength(3);
		expect(events.every((e) => e.href === '/content/Volk/Lateralen/Sodili/Charakter/Elikta/index.md')).toBe(
			true
		);
		expect(events.map((e) => e.text)).toEqual([
			'Elikta landet auf Navura',
			'Elikta wird neue Königin der Drachenkinder',
			'Eliktas wahre Identität wird enthüllt'
		]);
	});

	test('returns category null for an unknown category without throwing', () => {
		const markdown = `<!-- event: start=0 category="Nichtexistent" text="Test" -->`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Test.md');

		expect(events[0].category).toBeNull();
	});

	test('skips a malformed hook missing required attributes without throwing', () => {
		const markdown = `<!-- event: start=0 text="Ohne Kategorie" -->\n<!-- event: category="Ikusation" text="Ohne Start" -->\n<!-- event: start=0 category="Ikusation" -->`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Test.md');

		expect(events).toHaveLength(0);
	});

	test('parses a quoted category containing spaces and an ampersand', () => {
		const markdown = `<!-- event: start=-3.1 category="Collot & Linunar" text="Test" -->`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Test.md');

		expect(events[0].category?.name).toBe('Collot & Linunar');
	});

	test('parses fuzzy flags', () => {
		const markdown = `<!-- event: start=-3.13 end=0.18 category="Aridess" text="Globalisierung von Aridess" fuzzy -->`;
		const events = extractEventsFromRawMarkdown(markdown, '/content/Test.md');

		expect(events[0].fuzzy_start).toBe(true);
		expect(events[0].fuzzy_end).toBe(true);
	});
});
