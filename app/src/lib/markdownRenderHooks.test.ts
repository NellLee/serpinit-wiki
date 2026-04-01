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
				'* [Agranum](/content/Himmelskoerper_/Agranum/index.md)\n* [Aridess](/content/Himmelskoerper_/Aridess/index.md)\n'
		});

		expect(transformedFolderIndex.includes('<!-- INDEX -->')).toBe(false);
		expect(transformedFolderIndex).toMatch(/\* \[Agranum\]/);
		expect(transformedFolderIndex).toMatch(/\* \[Aridess\]/);
	});
});
