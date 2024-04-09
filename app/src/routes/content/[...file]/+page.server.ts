
import path from 'path';
import { MarkdownPage } from '$lib/markdown';

const __dirname = new URL(".", import.meta.url).pathname.substring(1);
const wikiUrl = '/content';
const wikiPath = path.resolve(__dirname, "../../../../.."+wikiUrl)

export function load({ params }) {

    let filePath = params.file.replace(/\//g, path.sep)
    //TODO: handle the non-md urls (other files)
    if (!filePath.endsWith(".md")) {
        filePath += ".md";
    }

    const fullPath = path.resolve(wikiPath, filePath);
    
    const page = new MarkdownPage(fullPath)
    return {
        html: page.domScraper.html(),
        references: page.references
    }
}