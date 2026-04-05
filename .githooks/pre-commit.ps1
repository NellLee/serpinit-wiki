$ErrorActionPreference = 'Stop'

$repoRoot = (& git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
	throw 'Could not determine repository root.'
}

Set-Location $repoRoot

$files = @(
	& git diff --cached --name-only --diff-filter=ACMR
) | Where-Object {
	$_ -and
	$_.Trim() -and
	$_.Replace('\', '/').StartsWith('content/') -and
	$_.Replace('\', '/').EndsWith('.md')
}

if ($files.Count -eq 0) {
	exit 0
}

& node scripts/check-content-mojibake.mjs --files $files
exit $LASTEXITCODE
