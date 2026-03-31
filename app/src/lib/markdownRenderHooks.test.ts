import assert from 'node:assert/strict';
import { applyMarkdownRenderHooks } from './markdownRenderHooks';

const cardLinkMarkdown = `# Markdown Hook Preview

<!-- display: card-link -->
[![Die Magie](/content/images/Potentiale-Querschnitte.png)](/content/Allgemein/Magie/index.md)

Die Magie
`;

const folderIndexMarkdown = `# Markdown Hook Preview

<!-- render: folder-index -->
`;

const transformedCardLink = applyMarkdownRenderHooks(cardLinkMarkdown);
assert.equal(transformedCardLink.includes('imglink{text="'), false);
assert.match(transformedCardLink, /class="img-link no-fancy"/);
assert.match(transformedCardLink, /href="\/content\/Allgemein\/Magie\/index\.md"/);

const transformedFolderIndex = applyMarkdownRenderHooks(folderIndexMarkdown, {
	folderIndexMarkdown: `* [Agranum](/content/Himmelskoerper_/Agranum/index.md)\n* [Aridess](/content/Himmelskoerper_/Aridess/index.md)\n`
});
assert.equal(transformedFolderIndex.includes('<!-- INDEX -->'), false);
assert.match(transformedFolderIndex, /\* \[Agranum\]/);
assert.match(transformedFolderIndex, /\* \[Aridess\]/);
