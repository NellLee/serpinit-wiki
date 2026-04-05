using System;
using System.Diagnostics;
using System.IO;

public static class Program
{
	public static int Main()
	{
		var executableDirectory = AppContext.BaseDirectory;
		var hookScriptPath = Path.Combine(executableDirectory, "pre-commit.ps1");

		if (!File.Exists(hookScriptPath))
		{
			Console.Error.WriteLine("Missing hook script: " + hookScriptPath);
			return 1;
		}

		var startInfo = new ProcessStartInfo
		{
			FileName = @"C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe",
			Arguments = "-NoProfile -ExecutionPolicy Bypass -File \"" + hookScriptPath + "\"",
			UseShellExecute = false
		};

		var process = Process.Start(startInfo);
		if (process == null)
		{
			Console.Error.WriteLine("Failed to start PowerShell for pre-commit hook.");
			return 1;
		}

		process.WaitForExit();
		var exitCode = process.ExitCode;
		process.Dispose();
		return exitCode;
	}
}
