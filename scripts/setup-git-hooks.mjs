import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const hookPath = '.githooks/pre-commit';

if (!fs.existsSync(hookPath)) {
	throw new Error(`Missing required hook file: ${hookPath}`);
}

// core.fileMode=false (set because DrvFs/WSL reports every file as world-executable) means
// `git add` never marks a new file executable from its on-disk bits - set it explicitly.
execFileSync('git', ['update-index', '--chmod=+x', hookPath], { stdio: 'inherit' });
execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'inherit' });
console.log('Configured git hooks to use .githooks/pre-commit');
