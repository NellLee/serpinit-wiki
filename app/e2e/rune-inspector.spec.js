import { expect, test } from "@playwright/test";

test("rune inspector keeps one explicit detail tab visible at a time", async ({ page }) => {
	await page.goto("/dev/runes", {
		waitUntil: "networkidle"
	});
	await page.waitForTimeout(500);

	await expect(page.getByRole("tablist", { name: "Runic detail views" })).toBeVisible();
	await expect(page.getByRole("tab", { name: "Struktur", exact: true })).toBeVisible();
	await expect(page.getByRole("tab", { name: "Projektion", exact: true })).toBeVisible();
	await expect(page.getByRole("tab", { name: "Legende", exact: true })).toBeVisible();
	await expect(page.getByRole("tabpanel")).toContainText("Semantik");
	await expect(page.getByRole("tabpanel")).not.toContainText("Sektorpaare");

	await page.getByRole("tab", { name: "Legende", exact: true }).click();

	await expect(page.getByRole("tabpanel")).toContainText("Sektorpaare");
	await expect(page.getByRole("tabpanel")).not.toContainText("Semantik");
});

test("rune inspector marks the selected library entry and keeps it readable on rune switches", async ({
	page
}) => {
	await page.goto("/dev/runes", {
		waitUntil: "networkidle"
	});
	await page.waitForTimeout(500);

	const selectedPrimitive = page.getByRole("link", {
		name: /Leitbahn primitive\.leitbahn/i
	});

	await expect(selectedPrimitive).toHaveAttribute("aria-current", "page");

	const selectedRune = page.getByRole("link", {
		name: /Substratgebundener Auslass rune\.substrat-gebundener-auslass/i
	});

	await selectedRune.click();

	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Substratgebundener Auslass");
	await expect(selectedRune).toHaveAttribute("aria-current", "page");
});
