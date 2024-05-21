import path from "path"
import { REGEX_FIRST_HEADER } from "./markdownPage"
import fs from "fs"


export class FileLink {
    href: string
    text: string
    fileName: string
    extension: string
    path: string

    constructor(fullPath: string, enforceFileExistence = false, defaultExtension = ".md") {
        const relPath = fullPath.substring(fullPath.lastIndexOf(path.sep+"content"+path.sep)+1)
        let content = ""
        if (enforceFileExistence) {
            content = fs.readFileSync(fullPath, "utf-8") // no try catch
        } else {
            try {
                content = fs.readFileSync(fullPath, "utf-8")
            } catch {} //ignored
        }
    
        const lastSlash = fullPath.lastIndexOf(path.sep)
    
        this.path = fullPath.substring(0, lastSlash) 
        const file = fullPath.substring(lastSlash + 1)
        if(fullPath.lastIndexOf('.') < lastSlash) {
            this.fileName = file
            this.extension = defaultExtension
        } else {
            const lastDot = file.lastIndexOf('.')
            this.fileName = file.substring(0, lastDot) 
            this.extension = file.substring(lastDot + 1)
        }
    
        this.text = this.fileName
        let firstHeader = REGEX_FIRST_HEADER.exec(content)?.pop()
        if(this.extension == "md" && firstHeader) {
            this.text = firstHeader
        } else if(this.fileName == "index") {
            this.text = this.path.substring(this.path.lastIndexOf(path.sep)+1) 
        }
        
        this.href = "/"+relPath.replaceAll(path.sep, "/")
    }

    // TODO
    getTags() {
        const tags: string[] = []
        let segments = this.href.split("/")
        for (let segment of segments) {
            if(segment.includes(".")) {
                segment = segment.substring(0, segment.lastIndexOf("."))
            }
            if (segment && segment != "content" && !segment.startsWith("index")) {
                tags.push(... segment.split("_"))
            }
        }
        return tags
    }
}