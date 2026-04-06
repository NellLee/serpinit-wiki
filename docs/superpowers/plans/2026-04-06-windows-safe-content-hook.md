# Windows-Safe Content Hook

## Plan

1. Replace shell-heavy hook logic with a PowerShell-backed entry path.
2. Keep the Node detector unchanged as the shared validation engine.
3. Verify the hook directly and with a staged temporary mojibake file that must block commit.
