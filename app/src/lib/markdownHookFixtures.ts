import path from "path";
import { error } from "@sveltejs/kit";
import { MarkdownPage } from "$lib/markdownPage";
import { WIKI_PATH } from "$lib/wiki";

const overviewMarkdown = `# Markdown Hook Preview

<!-- layout: overview -->

![Preview](/content/images/Potentiale-Querschnitte.png)

| Key | Value |
| --- | --- |
| **Type** | Preview |
| **Hook** | layout: overview |

This paragraph should remain in the main content body.
`;

const folderIndexMarkdown = `# Markdown Hook Preview

<!-- render: folder-index -->
`;

const calloutNoteMarkdown = `# Markdown Hook Preview

<!-- callout: note -->
> **Note:** This note should render as a comment card.
`;

const cardLinkMarkdown = `# Markdown Hook Preview

<!-- display: card-link -->
[![Die Magie](/content/images/Potentiale-Querschnitte.png)](/content/Allgemein/Magie/index.md)

Die Magie
`;

const galleryMarkdown = `# Markdown Hook Preview

<!-- render: gallery -->
`;

export function buildMarkdownHookFixture(fixture: string) {
	let markdown = overviewMarkdown;
	let fakePath = path.resolve(WIKI_PATH, "Himmelskoerper_", "__markdown-hook-preview__.md");

	if (fixture === "folder-index") {
		markdown = folderIndexMarkdown;
	} else if (fixture === "callout-note") {
		markdown = calloutNoteMarkdown;
	} else if (fixture === "card-link") {
		markdown = cardLinkMarkdown;
	} else if (fixture === "gallery") {
		markdown = galleryMarkdown;
		fakePath = path.resolve(WIKI_PATH, "Himmelskoerper_", "Aridess", "__markdown-hook-preview__.md");
	} else if (fixture !== "overview") {
		throw error(404, `Unknown markdown hook fixture: ${fixture}`);
	}

	const page = new MarkdownPage(fakePath, markdown);

	return JSON.parse(page.toJSON());
}
