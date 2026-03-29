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

export function buildMarkdownHookFixture(fixture: string) {
	let markdown = overviewMarkdown;
	let fakePath = path.resolve(WIKI_PATH, "Himmelskoerper_", "__markdown-hook-preview__.md");

	if (fixture === "folder-index") {
		markdown = folderIndexMarkdown;
	} else if (fixture !== "overview") {
		throw error(404, `Unknown markdown hook fixture: ${fixture}`);
	}

	const page = new MarkdownPage(fakePath, markdown);

	return JSON.parse(page.toJSON());
}
