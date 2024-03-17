
import fs from 'fs';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import { generateHeaderId } from '$lib/utilities';
import path from 'path';



type LinkObject = {
    href: string,
    text: string,
}

let tocContent: LinkObject[] = [];
let refContent: LinkObject[] = [];
let subContent: LinkObject[] = [];

export function load({ params }) {

    const filePath = params.file.replace(/\//g, path.sep) + ".md"; //TODO: handle the non-md urls (aliases etc.)
    const __dirname = new URL(".", import.meta.url).pathname.substring(1);
    const wikiPath = path.resolve(__dirname, "../../../../../content")

    const wikiUrl = '/content';

    const fullPath = path.resolve(wikiPath, filePath);
    const mdString = fs.readFileSync(fullPath, 'utf-8');

    // Parse markdown
    let firstHeader = '';
    let mdContent = mdString.replace(/^# (.+)$/m, (_, header) => {
        firstHeader = header;
        return '';
    });

    const mdHtml = DOMPurify.sanitize(marked(mdContent));

    // Generate table of contents
    const dom = new JSDOM('<!DOCTYPE html>' + mdHtml);
    const headers = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    tocContent = Array.from(headers).map((header) => ({
        href: `#${generateHeaderId(header.textContent)}`,
        text: '&nbsp;'.repeat((parseInt(header.tagName.slice(1)) - 1) * 3) + '• ' + header.textContent
    }));

    // Generate subcontent
    subContent = fs.readdirSync(wikiPath).map((file) => ({
        href: `${wikiUrl}/${file}`,
        text: file.endsWith('/index.md') ? file.slice(0, -9) : path.basename(file, '.md')
    }));

    // Generate references
    refContent = Array.from(dom.window.document.querySelectorAll('a[href$=".md"]')).map(
        (link) => ({
            href: link.getAttribute('href') || '',
            text: link.textContent || ''
        })
    );

    return {
        htmlContent: dom.serialize(),
        tocContent,
        subContent,
        refContent,
    }
}