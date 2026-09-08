// Drives clack-style interactive CLIs (e.g. `npx sv migrate`) with no CI bypass.
// No pty: a pty-backed child loses all progress if the driving process exits mid-prompt.
// Submit key is \r, not \n - \n toggles a Yes/No choice instead of submitting it.
// Steps fire only when their expected prompt text has appeared, not in fixed order or
// on a timer - prompt order can vary run to run (e.g. an `npx` install-confirmation
// prompt can appear before or after the tool's own prompts).
import { spawn } from 'node:child_process';

const ANSI_PATTERN = /[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ waitFor: RegExp, send?: string }[]} steps - matched in order; each step's
 *   `send` (default '\r') is written once `waitFor` matches the accumulated, ANSI-stripped output.
 * @param {{ cwd?: string, timeoutMs?: number, onData?: (chunk: string) => void }} [options]
 * @returns {Promise<{ code: number|null, output: string }>}
 */
export function driveInteractiveCli(command, args, steps, options = {}) {
	const { cwd, timeoutMs = 120_000, onData } = options;

	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });

		let output = '';
		let matchedFrom = 0;
		const pending = [...steps];

		const timer = setTimeout(() => {
			child.kill();
			reject(new Error(`drive-interactive-cli: timed out after ${timeoutMs}ms with ${pending.length}/${steps.length} steps unmatched\n${output}`));
		}, timeoutMs);

		function onChunk(chunk) {
			const text = chunk.toString();
			output += text;
			onData?.(text);

			// Steps may not appear in list order (e.g. an npm install-confirmation
			// prompt can appear before or after the tool's own prompts), so scan all
			// pending steps against the unconsumed window each time, not just the head.
			let matchedAny = true;
			while (matchedAny) {
				matchedAny = false;
				const clean = output.slice(matchedFrom).replace(ANSI_PATTERN, '');
				const index = pending.findIndex((step) => step.waitFor.test(clean));
				if (index !== -1) {
					const [step] = pending.splice(index, 1);
					child.stdin.write(step.send ?? '\r');
					matchedFrom = output.length;
					matchedAny = true;
				}
			}
		}

		child.stdout.on('data', onChunk);
		child.stderr.on('data', onChunk);

		child.on('close', (code) => {
			clearTimeout(timer);
			if (pending.length > 0) {
				reject(new Error(`drive-interactive-cli: process exited with ${pending.length}/${steps.length} steps unmatched\n${output}`));
				return;
			}
			resolve({ code, output });
		});

		child.on('error', (err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
}
