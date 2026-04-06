import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const hookScriptPath = '.githooks/pre-commit.ps1';
const hookLauncherSourcePath = '.githooks/pre-commit-launcher.cs';
const hookExecutablePath = '.githooks/pre-commit.exe';

for (const path of [hookScriptPath, hookLauncherSourcePath]) {
	if (!fs.existsSync(path)) {
		throw new Error(`Missing required hook file: ${path}`);
	}
}

const launcherSource = fs.readFileSync(hookLauncherSourcePath, 'utf8');

execFileSync(
	'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
	[
		'-NoProfile',
		'-ExecutionPolicy',
		'Bypass',
		'-Command',
		`Add-Type -TypeDefinition @'\n${launcherSource}\n'@ -OutputAssembly '${hookExecutablePath}' -OutputType ConsoleApplication`
	],
	{ stdio: 'inherit' }
);

execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'inherit' });
console.log('Configured git hooks to use .githooks and built .githooks/pre-commit.exe');
