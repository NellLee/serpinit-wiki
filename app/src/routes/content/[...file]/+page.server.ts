import type { MarkdownPage } from "$lib/markdownPage.js";
import { getLinkedFilePath } from "$lib/utilities/links";
import { WIKI_URL } from "$lib/utilities/wiki";
import { error, redirect } from "@sveltejs/kit";


const REGEX_FILE_EXT = /\.\w+$/

export async function load({ fetch, params, url }) {
    const file = params.file;

    if (file == "") {
        redirect(302, "content/index.md")
    } else if (!REGEX_FILE_EXT.test(getLinkedFilePath(file))) {
        redirect(302, `${WIKI_URL}/${file}/index.md`)
    } else if (!file.endsWith(".md")) {
        redirect(302, url.toString().replace("content/", "")) // uses staic symlink
    }
    let fetchResult = await fetch("/page?file="+file)
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