// The first request after a cold dev-server start pays for lazy wiki initialization
// (parsing every content/**.md file) plus, under WSL, DrvFs's slow file access - this
// can take well over Playwright's default 30s per-test timeout. Warm the server up
// once here, before any timed test runs, instead of inflating every test's timeout.
module.exports = async (config) => {
	const { baseURL } = config.projects[0].use;

	const response = await fetch(baseURL, { signal: AbortSignal.timeout(150_000) });
	if (!response.ok && response.status >= 500) {
		throw new Error(`Warm-up request to ${baseURL} failed with status ${response.status}`);
	}
};
