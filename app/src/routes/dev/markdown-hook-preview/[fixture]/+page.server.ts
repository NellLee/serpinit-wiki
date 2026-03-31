import { buildMarkdownHookFixture } from "$lib/markdownHookFixtures";

export function load({ params }) {
	return {
		page: buildMarkdownHookFixture(params.fixture)
	};
}
