
import fs from "fs";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import express from "express";
import path from "path";
import jsdom from "jsdom";
import { getFilePathsInFolder } from "../scripts/utilities";

const router = express.Router();

interface LinkContent {
    href: string,
    text: string,
}

const { JSDOM } = jsdom;
let $: JQueryStatic;

let wikiPath = __dirname + "/../../../content";

getFilePathsInFolder(wikiPath).forEach(file => {
    if (path.extname(file) === ".md") {
        router.get(file, (req, res) => {

            const fullPath = wikiPath + file;
            let mdString = fs.readFileSync(fullPath).toString();

            // Extract first header from md content
            let firstHeader = "";
            const firstHeaderStartIndex = mdString.indexOf("#");
            if (firstHeaderStartIndex >= 0) {
                const firstHeaderEndIndex = mdString.indexOf("\n", firstHeaderStartIndex);
                if (firstHeaderEndIndex >= 0) {
                    firstHeader = mdString.substring(firstHeaderStartIndex + 1, firstHeaderEndIndex).trim();
                    mdString = mdString.substring(firstHeaderEndIndex + 1);
                }
            }

            const mdHtml = DOMPurify.sanitize(marked.parse(mdString));

            let dom = new JSDOM("<!DOCTYPE html>" + mdHtml);
            $ = require("jquery")(dom.window);

            let navContent =  {
                "Serpinit": "/wiki/index",
                "Die Magie": "/wiki/general/magie", 
                "Die Schöpfungsgeschichte": "/wiki/general/schoepfungsgeschichte", 
                "Die 9 Himmelskörper": "/wiki/himmelskoerper/index", 
                "Die 9 Völker": "/wiki/voelker/index"
            };

            let tocContent = generateTableOfContents();

            let refContent = generateMentionedReferences();

            res.render("wiki", {
                title: firstHeader,
                navContent,
                tocContent,
                contentHtml: dom.serialize(),
                refContent,
            });
        });

        // alias route, omitting '.md'
        router.get(file.replace(".md", ""), (req, res) => {
            res.redirect("/wiki" + file);
        });

        if (path.basename(file) === "index.md") {
            router.get(file.replace(path.basename(file), ""), (req, res) => {
                res.redirect("/wiki" + file);
            });
        }
    } else {
        router.get(file, (req, res) => {
            res.redirect("/wiki/content" + file);
        });
    }
});


function generateMentionedReferences() {
    let $mentions = $("a").filter(function(this: HTMLElement) {
        return $(this).attr("href")?.includes(".md") ?? false
    })
    const result: LinkContent[] = [];

    $("a").filter(function(this: HTMLElement) {
        return $(this).attr("href")?.includes(".md") ?? false
    }).each((index, link) => {

        result[index] = {
            href: $(link).attr("href")!,
            text: $(link).text(),
        }
    })

    return result
}

function generateTableOfContents() {
    const result: LinkContent[] = [];

    $(":header").each((index, header) => {
        let headerLevel = parseInt($(header).prop("tagName").slice(1))
        result[index] = {
            href: "#" + $(header).text().toLowerCase().replace(" ", "-"),
            text: "&nbsp;".repeat((headerLevel-1)*3) + "> " + $(header).text(),
        }
    })

    return result
}

module.exports = router;