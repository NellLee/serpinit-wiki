import { expect, test } from "@playwright/test";

test("overview hook renders into the overview card", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/overview", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#overview")).toBeVisible();
	await expect(page.locator("#overview #overview-html img")).toBeVisible();
	await expect(page.locator("#content-html table")).toHaveCount(0);
});

test("folder-index hook renders generated sibling links", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/folder-index", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#content-html ul")).toBeVisible();
	await expect(page.locator("#content-html ul")).toContainText("Agranum");
});

test("callout hook renders a note comment card from visible markdown", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/callout-note", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#content-html .comment")).toBeVisible();
	await expect(page.locator("#content-html .comment-indicator.note")).toContainText("NOTE");
	await expect(page.locator("#content-html .comment-content")).toContainText(
		"This note should render as a comment card."
	);
	await expect(page.locator("#content-html blockquote")).toHaveCount(0);
});

test("card-link hook renders an image link card", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/card-link", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#content-html .img-link")).toBeVisible();
	await expect(page.locator("#content-html .img-link")).toHaveAttribute(
		"href",
		"/content/Allgemein/Magie/index.md"
	);
	await expect(page.locator("#content-html .img-link .img-link-text")).toContainText("Die Magie");
	await expect(page.locator("#content-html p")).toHaveCount(0);
});

test("gallery hook renders generated gallery markup", async ({ page }) => {
	await page.goto("/dev/markdown-hook-preview/gallery", {
		waitUntil: "domcontentloaded"
	});

	await expect(page.locator("#content-html #gallery")).toBeVisible();
	await expect(page.locator("#content-html #gallery a[data-fancybox='gallery']")).toHaveCount(1);
});
