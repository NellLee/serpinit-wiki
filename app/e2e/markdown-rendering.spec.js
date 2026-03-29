import { expect, test } from "@playwright/test";
import { pages } from "./fixtures/markdown-rendering-pages.js";

for (const pageDefinition of pages) {
	test(pageDefinition.name, async ({ page }) => {
		await page.setViewportSize(pageDefinition.viewport);
		await page.goto(pageDefinition.url, { waitUntil: "domcontentloaded" });
		await page.locator("#mid-panel").waitFor();
		await expect(page).toHaveScreenshot(pageDefinition.snapshot, {
			fullPage: true,
			mask: [page.locator("img[src$='.gif']")],
			caret: "hide"
		});
	});
}
