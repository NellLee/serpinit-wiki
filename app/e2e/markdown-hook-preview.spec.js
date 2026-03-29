import { expect, test } from "@playwright/test";

test("overview hook renders into the overview card", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/overview", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#overview")).toBeVisible();
	await expect(page.locator("#overview #overview-html img")).toBeVisible();
	await expect(page.locator("#content-html table")).toHaveCount(0);
});
