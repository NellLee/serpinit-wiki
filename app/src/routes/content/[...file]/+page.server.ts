
import path from 'path'
import { MarkdownPage } from '$lib/markdownPage'
import fs from 'fs'
import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { WIKI_URL, loadMarkdownPage, getLinkedFilePath } from '$lib/utilities/wiki.js'
import { getBreadcrumbs } from '$lib/utilities/links'

const REGEX_FILE_EXT = /\.\w+$/

export function load({ params }) {
    let fullPath = getLinkedFilePath(params.file)

    if (params.file == "") {
        redirect(302, "content/index.md")
    } else if (!REGEX_FILE_EXT.test(fullPath)) {
        redirect(302, `${WIKI_URL}/${params.file}/index.md`)
    } else if (!params.file.endsWith(".md")) {
        //TODO can image links work with the static symlink?
        throw error(404, `resource redirecting for '${params.file.substring(params.file.lastIndexOf("."))}' files not implemented`) //  
        
    }

    let page: undefined | MarkdownPage
    if (!fs.existsSync(fullPath)) {
        if(params.file.endsWith("index.md")) {
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep))
            page = MarkdownPage.constructIndexPage(folderPath)
        } else {
            throw error(404, `File ${params.file} not found`)
        }
    } else {
        page = loadMarkdownPage(fullPath)
    }
    return {
        page: structuredClone(page),
    }
}