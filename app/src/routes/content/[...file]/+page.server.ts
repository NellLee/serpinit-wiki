
import path from 'path';
import { MarkdownPage } from '$lib/markdown';
import fs from 'fs';
import { error } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const __dirname = new URL(".", import.meta.url).pathname.substring(1);
const wikiUrl = '/content';
const wikiPath = path.resolve(__dirname, "../../../../.."+wikiUrl)

export function load({ params }) {

    let filePath = params.file.replace(/\//g, path.sep)
    let fullPath = path.resolve(wikiPath, filePath);

    if (filePath == "") {
        redirect(302, "content/index.md");
    } else if (!/\.\w+$/.test(fullPath)) {
        redirect(302, `${wikiUrl}/${params.file}/index.md`);
    } else if (!filePath.endsWith(".md")) {
        throw error(404, 'resource redirecting not implemented');
        //TODO: handle the non-md urls (other files)
    }

    if (!fs.existsSync(fullPath)) {
        throw error(404, `File ${filePath} not found`);
    }
    const page = new MarkdownPage(fullPath)
    return {
        html: page.domScraper.html(),
        toc: page.toc,
        references: page.references,
        title: page.title
    }
}