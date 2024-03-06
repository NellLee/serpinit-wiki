
import fs from "fs";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import express from "express";
import path from "path";
import { JSDOM } from "jsdom";
import { getFilePathsInFolder } from "../scripts/utilities";

const router = express.Router();

interface LinkContent {
    href: string,
    text: string,
}
let $: JQueryStatic;

let wikiPath = __dirname + "/../../../content";
let wikiUrl = "/content";


console.log("Loading files...")
getFilePathsInFolder(wikiPath).forEach(file => {
    const basePath = file.replace(path.basename(file), "")
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

            let tocContent = generateTableOfContents();

            let subContent = generateSubContent(fullPath, basePath);

            let refContent = generateMentionedReferences();

            res.render("wiki", {
                title: firstHeader,
                tocContent,
                contentHtml: dom.serialize(),
                refContent,
                subContent
            });
        });

        router.get(file.replace(".md", ""), (req, res) => {
            res.redirect(wikiUrl + file); // e.g.: /wiki/index -> /wiki/index.md
        });

        if (path.basename(file) === "index.md") {
            router.get(basePath, (req, res) => {
                res.redirect(wikiUrl + file); // e.g.: /wiki/ -> /wiki/index.md
            });
        }
    } else {
        router.get(file, (req, res) => {
            res.redirect("/resources" + file); // e.g.: /wiki/example.png -> /resources/example.png
        });
    }
});
console.log("Loading files... Done!")


function generateSubContent(fullPath: string, currentBasePath: string) {
    const folderPath = fullPath.replace(path.basename(fullPath), "")
    const result: LinkContent[] = [];

    getFilePathsInFolder(folderPath, [".md"], 1).forEach(file => {
        file = file.slice(1)
        let newBasePath = file.replace(path.basename(file), "")
        if (newBasePath == "") {
            return
        }
        let displayName = path.basename(file) == "index.md" ? newBasePath.slice(0, -1) : path.basename(file).replace(".md", "")
        result.push({
            href: wikiUrl+currentBasePath+file,
            text: displayName,
        })
    })

    return result
}

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