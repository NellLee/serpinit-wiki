import assert from 'node:assert/strict';

import { findTagHookWarnings } from './check-content-tags.mjs';

function runTest(name, fn) {
	try {
		fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

runTest('accepts a page with a tags hook in the top block', () => {
	const warnings = findTagHookWarnings('<!-- tags: A, B -->\n# Titel\n', 'content/Volk/Seite.md');

	assert.deepEqual(warnings, []);
});

runTest('warns about a tags hook below the page content and names the file', () => {
	const warnings = findTagHookWarnings('# Titel\n\nText.\n<!-- tags: A -->\n', 'content/Volk/Seite.md');

	assert.equal(warnings.length, 1);
	assert.equal(warnings[0].filePath, 'content/Volk/Seite.md');
	assert.match(warnings[0].message, /line 4/);
});

runTest('accepts a folder-tag hook in an index.md', () => {
	const warnings = findTagHookWarnings('<!-- folder-tag -->\n# Index\n', 'content/Volk/index.md');

	assert.deepEqual(warnings, []);
});

runTest('warns about a folder-tag hook outside an index.md', () => {
	const warnings = findTagHookWarnings('<!-- folder-tag -->\n# Seite\n', 'content/Volk/Seite.md');

	assert.equal(warnings.length, 1);
	assert.match(warnings[0].message, /index\.md/);
});

runTest('warns about a misspelled tag hook', () => {
	const warnings = findTagHookWarnings('<!-- tag: A -->\n# Seite\n', 'content/Volk/Seite.md');

	assert.equal(warnings.length, 1);
	assert.match(warnings[0].message, /unrecognized tag hook/);
});
