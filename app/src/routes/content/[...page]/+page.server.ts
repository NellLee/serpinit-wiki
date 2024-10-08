import { WIKI_URL, PAGE_API_URL } from "$lib/constants";
import type { MarkdownPage } from "$lib/markdownPage.js";
import { getLinkedFilePath } from "$lib/utilities/links";
import { error, redirect } from "@sveltejs/kit";


const REGEX_FILE_EXT = /\.\w+$/

export async function load({ fetch, params, url }) {
    const linkedFile = params.page;

    if (linkedFile == "") {
        redirect(302, "content/index.md")
    } else if (!REGEX_FILE_EXT.test(getLinkedFilePath(linkedFile))) {
        redirect(302, `${WIKI_URL}/${linkedFile}/index.md`)
    } else if (!linkedFile.endsWith(".md")) {
        redirect(302, url.toString().replace("content/", "")) // uses static symlink
    }

    let fetchResult = await fetch(`${PAGE_API_URL}?file=${linkedFile}`)
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let fetchJson = await fetchResult.json()
    let page: MarkdownPage = JSON.parse(fetchJson)

    return {
        page,
    }
}