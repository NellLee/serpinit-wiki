const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/global-setup.cjs",
	timeout: 30_000,
	expect: {
		timeout: 10_000
	},
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "on-first-retry"
	},
	webServer: {
		command: "yarn dev --host 127.0.0.1 --port 4173",
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	},
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"]
			}
		}
	]
});
