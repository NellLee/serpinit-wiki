import path from "path"
import { REGEX_FIRST_HEADER } from "./markdownPage"
import fs from "fs"


export class FileLink {
    href: string
    text: string
    descriptiveText: string
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
        if (this.text.endsWith("_")) {
            this.text = this.text.slice(0, -1) + " Index"
        }

        
        this.href = "/"+relPath.replaceAll(path.sep, "/")

        
        this.descriptiveText = this.text
        
        const folderName = decodeURIComponent(this.href.split('/').at(-2)?.replaceAll("_", " ")!)
        if (this.fileName != "index") {
            this.descriptiveText = folderName + " > " + this.descriptiveText
        } else {
            if (folderName == "images") {
                this.descriptiveText = decodeURIComponent(this.href.split('/').at(-3)!) + " > Gallerie"
            }
        }
    }

    // TODO
    getTags() {
        const tags: string[] = []
        const segments = this.href.split("/")
        let segment = decodeURIComponent(segments.at(-1)!)
        if(segment.includes(".")) {
            segment = segment.substring(0, segment.lastIndexOf("."))
        }
        if (segment.startsWith("index")) {
            segment = segments.at(-2)!
        }
        if (segment && segment != "content") {
            tags.push(... segment.split("_"))
        }
        return tags
    }
}