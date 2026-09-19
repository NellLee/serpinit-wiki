const { defineConfig, devices } = require("@playwright/test");

// E2E_BASE_URL runs the tests against an already running server instead of starting one.
// E2E_DEMO=1 (see e2e/timeline-navigation.spec.js) slows the tests down for a human to watch.
const externalBaseURL = process.env.E2E_BASE_URL;

module.exports = defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/global-setup.cjs",
	timeout: process.env.E2E_DEMO ? 120_000 : 30_000,
	expect: {
		timeout: 10_000
	},
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: "list",
	use: {
		baseURL: externalBaseURL ?? "http://127.0.0.1:4173",
		trace: "on-first-retry"
	},
	webServer: externalBaseURL
		? undefined
		: {
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
