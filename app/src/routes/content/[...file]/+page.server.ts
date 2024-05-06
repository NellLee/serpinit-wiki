
import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { WIKI_URL, loadMarkdownPage, getLinkedFilePath, initWiki } from '$lib/utilities/wiki.js'

const REGEX_FILE_EXT = /\.\w+$/

export function load({ params }) {
    initWiki() //FIXME
    let fullPath = getLinkedFilePath(params.file)

    if (params.file == "") {
        redirect(302, "content/index.md")
    } else if (!REGEX_FILE_EXT.test(fullPath)) {
        redirect(302, `${WIKI_URL}/${params.file}/index.md`)
    } else if (!params.file.endsWith(".md")) {
        //TODO can image links work with the static symlink?
        throw error(404, `resource redirecting for '${params.file.substring(params.file.lastIndexOf("."))}' files not implemented`) //  
        
    }

    let page = loadMarkdownPage(fullPath)
    return {
        page: structuredClone(page),
    }
}