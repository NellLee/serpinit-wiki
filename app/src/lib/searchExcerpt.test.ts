import { describe, expect, test } from 'vitest';
import { createSearchExcerpts } from './searchExcerpt';

const html = `
<h2 id="geschichte">Geschichte</h2>
<p>Die Geschichte des Systems besitzt viele Brueche und Ueberlieferungen.</p>
<p>Ein anderer Abschnitt ohne Treffer.</p>
`;

describe('searchExcerpt', () => {
	test('builds fuzzy excerpts with section anchors', () => {
		const fuzzyExcerpt = createSearchExcerpts(html, 'geschite', '/content/Test');
		expect(fuzzyExcerpt).toHaveLength(1);
		expect(fuzzyExcerpt[0]).toMatch(/href="\/content\/Test#geschichte"/);
		expect(fuzzyExcerpt[0]).toMatch(/<mark>Geschichte<\/mark>/);
	});

	test('matches umlaut-normalized excerpts', () => {
		const umlautExcerpt = createSearchExcerpts(
			'<h2 id="welt">Welt</h2><p>Neun Himmelskörper bilden das System.</p>',
			'himmelskoper',
			'/content/Test'
		);
		expect(umlautExcerpt).toHaveLength(1);
		expect(umlautExcerpt[0]).toMatch(/<mark>Himmelskörper<\/mark>/);
	});

	test('prefers phrase matches over incidental letter matches', () => {
		const phraseExcerpt = createSearchExcerpts(
			'<h2 id="ritual">Ritual</h2><p>Der König führt außerdem die Do-Uspil aus, für die jeder Laterale pilgern muss.</p>',
			'Do Uspil',
			'/content/Test'
		);
		expect(phraseExcerpt).toHaveLength(1);
		expect(phraseExcerpt[0]).toMatch(/<mark>Do-Uspil<\/mark>/);
		expect(phraseExcerpt[0]).not.toMatch(/<mark>D<\/mark>er/);
	});

	test('returns no excerpts for missing queries', () => {
		expect(createSearchExcerpts(html, 'unauffindbar', '/content/Test')).toEqual([]);
	});
});
