import assert from 'node:assert/strict';

import {
	findMojibakeIssues,
	filterContentMarkdownPaths
} from './check-content-mojibake.mjs';

function runTest(name, fn) {
	try {
		fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

runTest('accepts valid UTF-8 German content', () => {
	const issues = findMojibakeIssues(
		[
			'# Beispiel',
			'Die Wälder sind grün.',
			'Fähigkeiten, Größe, Küste und Überlieferung bleiben korrekt.',
			'„Anführungszeichen“ und Gedankenstriche bleiben lesbar.'
		].join('\n')
	);

	assert.deepEqual(issues, []);
});

runTest('reports common mojibake sequences with line numbers', () => {
	const issues = findMojibakeIssues(
		[
			'# TODO',
			`Folgende Themen m\u00c3\u00bcssen sortiert werden.`,
			`Die Runen wurden \u00e2\u20ac\u017eprogrammiert\u00e2\u20ac\u015c.`
		].join('\n')
	);

	assert.deepEqual(issues, [
		{ line: 2, marker: '\u00c3', excerpt: `Folgende Themen m\u00c3\u00bcssen sortiert werden.` },
		{ line: 3, marker: '\u00e2\u20ac', excerpt: `Die Runen wurden \u00e2\u20ac\u017eprogrammiert\u00e2\u20ac\u015c.` }
	]);
});

runTest('limits staged file checks to content markdown files', () => {
	const paths = filterContentMarkdownPaths([
		'content/Allgemein/TODO.md',
		'content/Allgemein/images/test.png',
		'content/Allgemein/TODO.txt',
		'app/src/lib/wiki.ts',
		'content/Volk_/Spirits/index.md'
	]);

	assert.deepEqual(paths, [
		'content/Allgemein/TODO.md',
		'content/Volk_/Spirits/index.md'
	]);
});
