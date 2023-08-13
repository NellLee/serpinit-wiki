
import fs from "fs";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import express from "express";
import path from "path";
import jsdom from "jsdom";
const { JSDOM } = jsdom;

const router = express.Router();


function getFilePathsInFolder(folderPath, fileType = "") {
    let folderStat = fs.lstatSync(folderPath);
    if (folderStat && folderStat.isDirectory()) {
        let aggregator = [];
        return getFilePathsInFolderRec(aggregator, folderPath, fileType);
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
    }
}

function getFilePathsInFolderRec(aggregator, folderPath, fileType = "", startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + "/" + fileOrFolder;
        let stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            return getFilePathsInFolderRec(aggregator, fullPath, fileType, startPath);
        } else if (stat.isFile()) {
            if (!fileType || path.extname(fileOrFolder) === fileType) {
                aggregator.push(fullPath.replace(startPath, ""));
                // console.log(fullPath.replace(startPath, ""))
            }
        }
    });
    return aggregator;
}

let $;
let wikiPath = __dirname + "/../../../content";
getFilePathsInFolder(wikiPath).forEach(file => {
    if (path.extname(file) === ".md") {
        router.get(file, (req, res) => {

            const fullPath = wikiPath + file;
            let mdString = fs.readFileSync(fullPath).toString();

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

            $("img").each(function(this: HTMLButtonElement) {
                var oldSrc = $(this).attr("src")
                var newSrc = "wiki"+path.dirname(file) + "/"+ oldSrc
                console.log(oldSrc)
                console.log(newSrc)
                // $(this).attr("src", newSrc)
            })

            let $headerLinkTree = generateHeaderLinkTree();

            res.render("wiki", {
                navContent: {
                    "Serpinit": "/wiki/index",
                    "Die Magie": "/wiki/general/magie", 
                    "Die Schöpfungsgeschichte": "/wiki/general/schoepfungsgeschichte", 
                    "Die 9 Himmelskörper": "/wiki/himmelskoerper/index", 
                    "Die 9 Völker": "/wiki/voelker/index"
                },
                title: firstHeader,
                contentHtml: dom.serialize(),
                tocHtml: $headerLinkTree?.html() ?? ""
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

function generateHeaderLinkTree() {

    let header = $("h1");
    if (header.length > 0) {
        let $ul = $("<ul>");
        header.each((index, element) => {
            generateHeaderLinkTreeRec($(element), $ul);
        });
        return $("<div>").append($ul);
    }
    return null;
}

function generateHeaderLinkTreeRec($header, $parentUl, headerLevel = 1) {
    let $li = $("<li>");
    $parentUl.append($li);

    let $listEntry = $("<div>", {
        "class": "list-entry"
    });
    $li.append($listEntry);

    let $link = $("<a>", {
        text: $header.text(),
        href: "#" + $header.attr("id")
    });
    $listEntry.append($link);

    let $allHeaders = $(":header");
    let targetHeaderLevel = headerLevel + 1;
    let $subUl = $("<ul>");

    $listEntry.append($subUl);
    $($allHeaders.slice($allHeaders.index($header) + 1)).each((index, element) => {
        let curHeaderLevel = $(element).prop("tagName").slice(1);
        if (curHeaderLevel == targetHeaderLevel) {
            generateHeaderLinkTreeRec($(element), $subUl, targetHeaderLevel);
        } else {
            return false; //break;
        }
    });
    if ($subUl.is(":empty")) {
        $listEntry.addClass("disabled");
    }
}


module.exports = router;