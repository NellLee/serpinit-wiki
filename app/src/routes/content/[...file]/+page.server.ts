
import path from 'path'
import { MarkdownPage } from '$lib/markdown'
import fs from 'fs'
import { error } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { WIKI_URL, getLinkedFilePath } from '$lib/utilities/wiki.js'


export function load({ params }) {
    let fullPath = getLinkedFilePath(params.file)

    if (params.file == "") {
        redirect(302, "content/index.md")
    } else if (!/\.\w+$/.test(fullPath)) {
        redirect(302, `${WIKI_URL}/${params.file}/index.md`)
    } else if (!params.file.endsWith(".md")) {
        throw error(404, 'resource redirecting not implemented')
        //TODO: handle the non-md urls (other files)
    }

    if (!fs.existsSync(fullPath)) {
        throw error(404, `File ${params.file} not found`)
    }
    const page = new MarkdownPage(fullPath)
    return {
        html: page.domScraper.html(),
        toc: page.toc,
        references: page.references,
        title: page.title
    }
}