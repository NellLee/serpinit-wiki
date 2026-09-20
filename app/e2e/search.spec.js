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

	test('the kategorie: hint lists all available categories on hover', async ({ page }) => {
		await hint(page, 'kategorie:').hover();
		const tooltip = page.locator('#hint-category');

		await expect(tooltip).toBeVisible();
		await expect(tooltip.getByText('Verfügbare Kategorien')).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Fauna' })).toBeVisible(SLOW);
		await expect(tooltip.locator('.category-list li', { hasText: 'Charakter' })).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Zirkelgründer' })).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Magie' })).toBeVisible();
		await expect(tooltip.locator('.category-list li', { hasText: 'Theologie' })).toBeVisible();
	});

	test('the pfad: hint shows examples', async ({ page }) => {
		await hint(page, 'pfad:').hover();

		await expect(page.locator('#hint-path')).toBeVisible();
		await expect(page.locator('#hint-path')).toContainText('pfad:Sodili/Charakter');
	});

	test('the -Ausschluss hint shows examples', async ({ page }) => {
		await hint(page, '-Ausschluss').hover();

		await expect(page.locator('#hint-exclusion')).toBeVisible();
		await expect(page.locator('#hint-exclusion')).toContainText('Krieg -Navura');
	});

	test('the typ: hint names the page types', async ({ page }) => {
		await hint(page, 'typ:').hover();
		const tooltip = page.locator('#hint-type');

		await expect(tooltip).toBeVisible();
		for (const type of ['Artikel', 'Übersicht']) {
			await expect(tooltip.locator('code', { hasText: new RegExp(`^${type}$`) })).toBeVisible();
		}
	});

	test('a hint stays hidden until it is hovered or focused', async ({ page }) => {
		await expect(page.locator('#hint-title')).toBeHidden();

		await page.getByRole('button', { name: 'titel:', exact: true }).focus();
		await expect(page.locator('#hint-title')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.locator('#hint-title')).toBeHidden();
	});

	test('a tooltip stays open while the pointer moves into it', async ({ page }) => {
		await hint(page, 'pfad:').hover();
		await page.locator('#hint-path .tooltip-box').hover();

		await expect(page.locator('#hint-path')).toBeVisible();
	});
});

test.describe('search behavior', () => {
	test('a quoted phrase finds only the exact wording', async ({ page }) => {
		await page.goto('/content/search?q=%22Krieg+um+Navura%22');
		await expect(page.locator('.results-header p')).toContainText('Ergebnis', SLOW);
		await expect(page.getByText('Keine Treffer gefunden.')).toHaveCount(0);

		await page.goto('/content/search?q=%22Krieg+um+Navora%22');
		await expect(page.getByText('Keine Treffer gefunden.')).toBeVisible(SLOW);
	});

	test('a typo is still forgiven without quotes', async ({ page }) => {
		await page.goto('/content/search?q=Krieg+um+Navurra');

		await expect(page.locator('.results-header p')).toContainText('Ergebnis', SLOW);
		await expect(page.getByText('Keine Treffer gefunden.')).toHaveCount(0);
	});

	test('lists the frequent categories under the results', async ({ page }) => {
		await page.goto('/content/search?q=Vorenkai');

		const group = page.locator('.facet-group', { hasText: 'Häufige Kategorien' });
		await expect(group).toBeVisible(SLOW);
		await expect(group.locator('.facet-option', { hasText: 'Charakter' })).toBeVisible();
	});
});

test.describe('category chips on a page', () => {
	test('a page shows its explicit tags and links to the filtered search', async ({ page }) => {
		await page.goto('/content/Himmelskörper/Agranum/Fauna/Fantohler/index.md');
		const chip = page.locator('.content-card .tags a', { hasText: 'Fauna' });

		await expect(chip).toBeVisible(SLOW);
		await expect(page.locator('.content-card .tags a', { hasText: 'Fantohler' })).toHaveCount(0);

		await chip.click();
		await expect(page).toHaveURL(/kategorie/);
		await expect(page.locator('.results-header h2')).toContainText('kategorie:Fauna', SLOW);
	});
});
