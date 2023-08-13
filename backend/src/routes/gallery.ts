
import fs from "fs";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import express from "express";
import path from "path";
import jsdom from "jsdom";
import { getFilePathsInFolder } from "../scripts/utilities";

const router = express.Router();


const { JSDOM } = jsdom;
let $: JQueryStatic;

let galleryPath = __dirname + "/../../../gallery";

router.get("/", (req, res) => {

    let imagePaths: string[] = []

    getFilePathsInFolder(galleryPath).forEach(file => {
        imagePaths.push(file.slice(1));
    })

    
    res.render("gallery", {
        imagePaths,
    });
})

module.exports = router;