import assert from 'node:assert/strict';

import { driveInteractiveCli } from './drive-interactive-cli.mjs';

function runTest(name, fn) {
	try {
		fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

async function runAsyncTest(name, fn) {
	try {
		await fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

// A fixture that behaves like a clack-style prompt: unbuffered stdout writes,
// waits for stdin, only proceeds to the next prompt once the first is answered.
const FIXTURE = `
process.stdout.write('First prompt: continue? (y/n) ');
process.stdin.resume();
process.stdin.once('data', (d) => {
	process.stdout.write('\\ngot first: ' + JSON.stringify(d.toString()) + '\\n');
	process.stdout.write('Second prompt: confirm? (y/n) ');
	process.stdin.once('data', (d2) => {
		process.stdout.write('\\ngot second: ' + JSON.stringify(d2.toString()) + '\\n');
		process.exit(0);
	});
});
`;

const REORDERED_FIXTURE = `
process.stdout.write('Second prompt: confirm? (y/n) ');
process.stdin.resume();
process.stdin.once('data', (d) => {
	process.stdout.write('\\ngot second: ' + JSON.stringify(d.toString()) + '\\n');
	process.stdout.write('First prompt: continue? (y/n) ');
	process.stdin.once('data', (d2) => {
		process.stdout.write('\\ngot first: ' + JSON.stringify(d2.toString()) + '\\n');
		process.exit(0);
	});
});
`;

await runAsyncTest('answers prompts as they appear, in declared order', async () => {
	const result = await driveInteractiveCli('node', ['-e', FIXTURE], [
		{ waitFor: /First prompt/, send: 'y\r' },
		{ waitFor: /Second prompt/, send: 'n\r' }
	]);

	assert.equal(result.code, 0);
	assert.match(result.output, /got first: "y\\r"/);
	assert.match(result.output, /got second: "n\\r"/);
});

await runAsyncTest('answers prompts out of declared order', async () => {
	const result = await driveInteractiveCli('node', ['-e', REORDERED_FIXTURE], [
		{ waitFor: /First prompt/, send: 'y\r' },
		{ waitFor: /Second prompt/, send: 'n\r' }
	]);

	assert.equal(result.code, 0);
	assert.match(result.output, /got first: "y\\r"/);
	assert.match(result.output, /got second: "n\\r"/);
});

await runAsyncTest('rejects if the process exits before all steps matched', async () => {
	await assert.rejects(
		driveInteractiveCli('node', ['-e', "process.exit(0)"], [{ waitFor: /never appears/, send: '\r' }]),
		/unmatched/
	);
});
