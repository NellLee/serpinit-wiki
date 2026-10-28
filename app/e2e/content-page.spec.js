import { test, expect } from '@playwright/test';

// The first request after a cold start builds the whole wiki first.
test.setTimeout(150_000);

test('category chips under the title sit on one line', async ({ page }) => {
	await page.goto('/content/Himmelskörper/Luqua');
	const chips = page.locator('.header .tags li');
	await expect(chips).toHaveCount(3, { timeout: 120_000 });

	const tops = await chips.evaluateAll((items) => items.map((li) => li.getBoundingClientRect().top));
	expect(new Set(tops).size).toBe(1);
});
