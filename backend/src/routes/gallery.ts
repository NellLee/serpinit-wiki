
import fs from "fs";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import express from "express";
import path from "path";
import jsdom from "jsdom";
import { getFilePathsInFolder } from "../scripts/utilities";
import imageThumbnail, { Options } from "image-thumbnail"
import { Image } from "../scripts/types"

const router = express.Router();


const { JSDOM } = jsdom;
let $: JQueryStatic;

let galleryPath = path.join(__dirname + "/../../../gallery");


let images: Image[] = []

console.log("Loading images...")
getFilePathsInFolder(galleryPath).forEach(file => {    
    imageThumbnail(path.join(galleryPath + file), { width: 205, height: 205, responseType: 'base64' })
    .then(thumbnail => {
        images.push({
            full: file.slice(1),
            thumbnail: 'data:image/jpeg;base64,' + thumbnail.toString()
        });
    }).catch(err => console.error(file, err));
})
console.log("Loading images... Done!")

router.get("/", (req, res) => {

    
    res.render("gallery", {
        images,
    });
})

module.exports = router;