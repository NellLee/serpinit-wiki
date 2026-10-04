import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { installUserFiles } from './setup-vscode-user.mjs';

function runTest(name, fn) {
	try {
		fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

function tempDirs() {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vscode-user-'));
	const src = path.join(root, 'src');
	const dest = path.join(root, 'dest');
	fs.mkdirSync(src);
	fs.writeFileSync(path.join(src, 'keybindings.json'), '[1]');
	return { src, dest };
}

runTest('copies repo files into a missing user folder', () => {
	const { src, dest } = tempDirs();
	installUserFiles(src, dest);
	assert.equal(fs.readFileSync(path.join(dest, 'keybindings.json'), 'utf8'), '[1]');
});

runTest('backs up a different existing user file before replacing it', () => {
	const { src, dest } = tempDirs();
	fs.mkdirSync(dest);
	fs.writeFileSync(path.join(dest, 'keybindings.json'), '[old]');
	installUserFiles(src, dest);
	assert.equal(fs.readFileSync(path.join(dest, 'keybindings.json'), 'utf8'), '[1]');
	const backups = fs.readdirSync(dest).filter((f) => f.startsWith('keybindings.json.bak-'));
	assert.equal(backups.length, 1);
	assert.equal(fs.readFileSync(path.join(dest, backups[0]), 'utf8'), '[old]');
});

runTest('leaves an identical user file alone', () => {
	const { src, dest } = tempDirs();
	installUserFiles(src, dest);
	installUserFiles(src, dest);
	assert.deepEqual(fs.readdirSync(dest), ['keybindings.json']);
});
