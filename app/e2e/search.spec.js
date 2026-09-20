import { test, expect } from '@playwright/test';

// The category list and every search need the whole wiki, which the first request after a cold
// start has to build first, so these tests allow far more time than the default 30 seconds.
test.setTimeout(150_000);
const SLOW = { timeout: 120_000 };

function hint(page, label) {
	return page.locator('.syntax-help .hint-wrap').filter({
		has: page.getByRole('button', { name: label, exact: true })
	});
}

test.describe('search page hints', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/content/search');
		// Keyboard handlers only exist once the page has hydrated.
		await page.waitForLoadState('networkidle');
	});

	test('no longer calls the category filters hand-picked', async ({ page }) => {
		await expect(page.getByText('Handverlesene')).toHaveCount(0);
	});

	test('the category: hint lists all available categories on hover', async ({ page }) => {
		await hint(page, 'category:').hover();
		const tooltip = page.locator('#hint-category');

		await expect(tooltip).toBeVisible();
		await expect(tooltip.getByText('Verfügbare Kategorien')).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Fauna' })).toBeVisible(SLOW);
		await expect(tooltip.locator('.category-list li', { hasText: 'Charakter' })).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Zirkelgründer' })).toBeVisible();
	});

	test('the path: hint shows examples', async ({ page }) => {
		await hint(page, 'path:').hover();

		await expect(page.locator('#hint-path')).toBeVisible();
		await expect(page.locator('#hint-path')).toContainText('path:Sodili/Charakter');
	});

	test('the -Ausschluss hint shows examples', async ({ page }) => {
		await hint(page, '-Ausschluss').hover();

		await expect(page.locator('#hint-exclusion')).toBeVisible();
		await expect(page.locator('#hint-exclusion')).toContainText('Krieg -Navura');
	});

	test('the type: hint names the page types', async ({ page }) => {
		await hint(page, 'type:').hover();
		const tooltip = page.locator('#hint-type');

		await expect(tooltip).toBeVisible();
		for (const type of ['article', 'index', 'media', 'hub']) {
			await expect(tooltip.locator('code', { hasText: new RegExp(`^${type}$`) })).toBeVisible();
		}
	});

	test('a hint stays hidden until it is hovered or focused', async ({ page }) => {
		await expect(page.locator('#hint-title')).toBeHidden();

		await page.getByRole('button', { name: 'title:', exact: true }).focus();
		await expect(page.locator('#hint-title')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.locator('#hint-title')).toBeHidden();
	});

	test('a tooltip stays open while the pointer moves into it', async ({ page }) => {
		await hint(page, 'path:').hover();
		await page.locator('#hint-path .tooltip-box').hover();

		await expect(page.locator('#hint-path')).toBeVisible();
	});
});

test.describe('search fuzziness', () => {
	test('starts at the normal level and shows its name', async ({ page }) => {
		await page.goto('/content/search');

		await expect(page.locator('.fuzziness-control input[type="range"]')).toHaveValue('2');
		await expect(page.locator('.fuzziness-control strong')).toHaveText('Normal');
	});

	test('a typo is found at the normal level but not at the exact level', async ({ page }) => {
		await page.goto('/content/search?q=Vorenkei');
		await page.waitForLoadState('networkidle');
		await expect(page.getByText('Keine Treffer gefunden.')).toHaveCount(0, SLOW);
		await expect(page.locator('.results-header h2')).toContainText('Treffer für "Vorenkei"', SLOW);

		const slider = page.locator('.fuzziness-control input[type="range"]');
		await slider.focus();
		await page.keyboard.press('Home');

		await expect(page).toHaveURL(/fuzziness=0/);
		await expect(page.locator('.fuzziness-control strong')).toHaveText('Exakt');
		await expect(page.getByText('Keine Treffer gefunden.')).toBeVisible(SLOW);
	});

	test('the chosen level survives a reload', async ({ page }) => {
		await page.goto('/content/search?q=Vorenkai&fuzziness=1');

		await expect(page.locator('.fuzziness-control input[type="range"]')).toHaveValue('1');
		await expect(page.locator('.fuzziness-control strong')).toHaveText('Streng');
	});

	test('an invalid level falls back to the normal level', async ({ page }) => {
		await page.goto('/content/search?q=Vorenkai&fuzziness=99');

		await expect(page.locator('.fuzziness-control input[type="range"]')).toHaveValue('2');
	});
});
