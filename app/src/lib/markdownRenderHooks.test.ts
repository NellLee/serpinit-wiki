import { describe, expect, test } from 'vitest';
import { applyMarkdownRenderHooks } from './markdownRenderHooks';

const cardLinkMarkdown = `# Markdown Hook Preview

<!-- display: card-link -->
[![Die Magie](/content/images/Potentiale-Querschnitte.png)](/content/Allgemein/Magie/index.md)

Die Magie
`;

const folderIndexMarkdown = `# Markdown Hook Preview

<!-- render: folder-index -->
`;

const figureMarkdown = `# Markdown Hook Preview

<!-- display: figure -->
![Ein Beispielbild](./images/Beispiel.png)
`;

const figureMarkdownWithStyle = `# Markdown Hook Preview

<!-- display: figure style="width: 250px;" -->
![Ein Beispielbild](./images/Beispiel.png)
`;

const figureMarkdownWithoutImage = `# Markdown Hook Preview

<!-- display: figure -->

Kein Bild folgt hier.
`;

const eventMarkdown = `# Markdown Hook Preview

<!-- event: start=0 category="Ikusation" text="Beginn der Ikusation" -->

Dieser Absatz beschreibt das Ereignis.
`;

describe('markdownRenderHooks', () => {
	test('renders image card links without legacy imglink syntax', () => {
		const transformedCardLink = applyMarkdownRenderHooks(cardLinkMarkdown);
		expect(transformedCardLink.includes('imglink{text="')).toBe(false);
		expect(transformedCardLink).toMatch(/class="img-link no-fancy"/);
		expect(transformedCardLink).toMatch(/href="\/content\/Allgemein\/Magie\/index\.md"/);
	});

	test('injects generated folder index content', () => {
		const transformedFolderIndex = applyMarkdownRenderHooks(folderIndexMarkdown, {
			folderIndexMarkdown:
				'* [Agranum](/content/Himmelskörper/Agranum/index.md)\n* [Aridess](/content/Himmelskörper/Aridess/index.md)\n'
		});

		expect(transformedFolderIndex.includes('<!-- INDEX -->')).toBe(false);
		expect(transformedFolderIndex).toMatch(/\* \[Agranum\]/);
		expect(transformedFolderIndex).toMatch(/\* \[Aridess\]/);
	});

	test('renders figure hooks as figure/figcaption directives', () => {
		const transformed = applyMarkdownRenderHooks(figureMarkdown);
		expect(transformed.includes('<!-- display: figure -->')).toBe(false);
		expect(transformed).toMatch(/:::figure\{style="width: 400px;"\}/);
		expect(transformed).toMatch(/!\[Ein Beispielbild\]\(\.\/images\/Beispiel\.png\)/);
		expect(transformed).toMatch(/::figcaption\[Ein Beispielbild\]/);
	});

	test('honors a custom style attribute on figure hooks', () => {
		const transformed = applyMarkdownRenderHooks(figureMarkdownWithStyle);
		expect(transformed).toMatch(/:::figure\{style="width: 250px;"\}/);
	});

	test('drops figure hooks that are not followed by a bare image', () => {
		const transformed = applyMarkdownRenderHooks(figureMarkdownWithoutImage);
		expect(transformed.includes(':::figure')).toBe(false);
		expect(transformed).toMatch(/Kein Bild folgt hier\./);
	});

	test('leaves event hooks completely untouched', () => {
		const transformed = applyMarkdownRenderHooks(eventMarkdown);
		expect(transformed).toBe(eventMarkdown);
	});
});
