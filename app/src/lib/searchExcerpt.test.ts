import assert from 'node:assert/strict';
import { createSearchExcerpts } from './searchExcerpt';

const html = `
<h2 id="geschichte">Geschichte</h2>
<p>Die Geschichte des Systems besitzt viele Brueche und Ueberlieferungen.</p>
<p>Ein anderer Abschnitt ohne Treffer.</p>
`;

const fuzzyExcerpt = createSearchExcerpts(html, 'geschite', '/content/Test');
assert.equal(fuzzyExcerpt.length, 1);
assert.match(fuzzyExcerpt[0], /href="\/content\/Test#geschichte"/);
assert.match(fuzzyExcerpt[0], /<mark>Geschichte<\/mark>/);

const umlautExcerpt = createSearchExcerpts(
	'<h2 id="welt">Welt</h2><p>Neun Himmelsk\u00f6rper bilden das System.</p>',
	'himmelskoper',
	'/content/Test'
);
assert.equal(umlautExcerpt.length, 1);
assert.match(umlautExcerpt[0], /<mark>Himmelsk\u00f6rper<\/mark>/);

assert.deepEqual(createSearchExcerpts(html, 'unauffindbar', '/content/Test'), []);
