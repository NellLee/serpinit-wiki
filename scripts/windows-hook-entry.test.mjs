import assert from 'node:assert/strict';
import fs from 'node:fs';

function runTest(name, fn) {
	try {
		fn();
		console.log(`PASS ${name}`);
	} catch (error) {
		console.error(`FAIL ${name}`);
		throw error;
	}
}

runTest('pre-commit hook is a shebang script git can find and run on any platform', () => {
	const hookPath = '.githooks/pre-commit';
	const setupScriptPath = 'scripts/setup-git-hooks.mjs';

	assert.ok(fs.existsSync(hookPath), 'expected .githooks/pre-commit to exist');
	assert.ok(!fs.existsSync('.githooks/pre-commit.exe'), 'a built .exe hook is never found by git under WSL - see project_wsl_git_hooks_silent_skip');

	const hookSource = fs.readFileSync(hookPath, 'utf8');
	assert.match(hookSource, /^#!\/bin\/sh/, 'expected the hook to be a POSIX shebang script');
	assert.match(hookSource, /check-content-mojibake\.mjs/, 'expected the hook to call the mojibake checker');

	const mode = fs.statSync(hookPath).mode & 0o777;
	assert.ok(mode & 0o100, `expected ${hookPath} to be executable on disk, got mode ${mode.toString(8)}`);

	const setupScriptSource = fs.readFileSync(setupScriptPath, 'utf8');
	assert.match(
		setupScriptSource,
		/update-index.*--chmod=\+x/,
		'expected setup script to force the executable bit via git update-index, since core.fileMode=false hides it from plain git add'
	);
});

runTest('yarn install in app/ configures the git hooks, so a fresh clone runs them', () => {
	const appPackage = JSON.parse(fs.readFileSync('app/package.json', 'utf8'));
	assert.match(
		appPackage.scripts?.postinstall ?? '',
		/setup-git-hooks\.mjs/,
		'expected app/package.json postinstall to run scripts/setup-git-hooks.mjs, since core.hooksPath is local git config and is not cloned'
	);
});
