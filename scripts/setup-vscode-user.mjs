// Installs the user-level VS Code files kept in .vscode/user/ (things VS Code
// only reads from the user folder, e.g. keybindings) into this machine's VS Code
// user folder. A differing existing file is backed up first.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function installUserFiles(srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const name of fs.readdirSync(srcDir)) {
		const src = path.join(srcDir, name);
		const dest = path.join(destDir, name);
		const content = fs.readFileSync(src);
		if (fs.existsSync(dest)) {
			if (fs.readFileSync(dest).equals(content)) continue;
			const stamp = new Date().toISOString().replace(/[:.]/g, '-');
			fs.copyFileSync(dest, `${dest}.bak-${stamp}`);
			console.log(`Backed up ${dest}`);
		}
		fs.writeFileSync(dest, content);
		console.log(`Installed ${dest}`);
	}
}

function isWsl() {
	return process.platform === 'linux' && /microsoft/i.test(fs.readFileSync('/proc/version', 'utf8'));
}

// Under WSL, VS Code itself runs on Windows, so its user folder is on the Windows side.
export function vscodeUserDir() {
	if (process.platform === 'win32') return path.join(process.env.APPDATA, 'Code', 'User');
	if (process.platform === 'darwin') return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User');
	if (isWsl()) {
		const appData = execFileSync('cmd.exe', ['/c', 'echo %APPDATA%'], { cwd: '/mnt/c', encoding: 'utf8' }).trim();
		const appDataPosix = execFileSync('wslpath', ['-u', appData], { encoding: 'utf8' }).trim();
		return path.join(appDataPosix, 'Code', 'User');
	}
	return path.join(os.homedir(), '.config', 'Code', 'User');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
	installUserFiles(path.join(repoRoot, '.vscode', 'user'), vscodeUserDir());
}
