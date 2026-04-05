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

runTest('pre-commit hook source exists and setup builds a native Windows entrypoint', () => {
	const hookPath = '.githooks/pre-commit.ps1';
	const launcherSourcePath = '.githooks/pre-commit-launcher.cs';
	const setupScriptPath = 'scripts/setup-git-hooks.mjs';
	const powershellHookPath = '.githooks/pre-commit.ps1';

	assert.ok(fs.existsSync(hookPath), 'expected .githooks/pre-commit.ps1 to exist');
	assert.ok(fs.existsSync(powershellHookPath), 'expected .githooks/pre-commit.ps1 to exist');
	assert.ok(fs.existsSync(launcherSourcePath), 'expected .githooks/pre-commit-launcher.cs to exist');
	assert.ok(fs.existsSync(setupScriptPath), 'expected scripts/setup-git-hooks.mjs to exist');

	const launcherSource = fs.readFileSync(launcherSourcePath, 'utf8');
	assert.match(
		launcherSource,
		/pre-commit\.ps1/i,
		'expected native launcher source to execute the PowerShell hook script'
	);

	const setupScriptSource = fs.readFileSync(setupScriptPath, 'utf8');
	assert.match(
		setupScriptSource,
		/Add-Type[\s\S]*pre-commit\.exe/i,
		'expected setup script to build a native pre-commit.exe hook entrypoint'
	);
});
