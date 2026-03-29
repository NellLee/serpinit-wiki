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

export function buildMarkdownHookFixture(fixture: string) {
	if (fixture !== "overview") {
		throw error(404, `Unknown markdown hook fixture: ${fixture}`);
	}

	const fakePath = path.resolve(WIKI_PATH, "Himmelskoerper_", "__markdown-hook-preview__.md");
	const page = new MarkdownPage(fakePath, overviewMarkdown);

	return JSON.parse(page.toJSON());
}
