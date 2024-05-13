import type { MarkdownPage } from "$lib/markdownPage.js";
import { getLinkedFilePath } from "$lib/utilities/links";
import { WIKI_URL } from "$lib/utilities/wiki";
import { error, redirect } from "@sveltejs/kit";


const REGEX_FILE_EXT = /\.\w+$/

export async function load({ fetch, params }) {
    const file = params.file;

    if (file == "") {
        redirect(302, "content/index.md")
    } else if (!REGEX_FILE_EXT.test(getLinkedFilePath(file))) {
        redirect(302, `${WIKI_URL}/${file}/index.md`)
    } else if (!file.endsWith(".md")) {
        //TODO can image links work with the static symlink?
        throw error(404, `resource redirecting for '${file.substring(file.lastIndexOf("."))}' files not implemented`) //  
        
    }
    let fetchResult = await fetch("/page?file="+file)
    let page: MarkdownPage = JSON.parse(await fetchResult.json())
    return {
        page,
    }
}