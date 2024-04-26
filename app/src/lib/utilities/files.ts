
import { REGEX_FIRST_HEADER } from "$lib/markdown"
import fs from "fs"
import path from "path"

export function getFilePathsInFolder(folderPath: string, fileTypes: string[] = [], maxDepth: number = -1) {
    let folderStat = fs.lstatSync(folderPath)
    if (folderStat && folderStat.isDirectory()) {
        let aggregator: string[] = []
        return getFilePathsInFolderRec(aggregator, folderPath, fileTypes, maxDepth)
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!"
    }
}

function getFilePathsInFolderRec(aggregator: string[], folderPath: string, fileTypes: string[] = [], maxDepth: number, startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + path.sep + fileOrFolder
        try {
            let stat = fs.lstatSync(fullPath)
            if (stat.isDirectory()) {
                if(maxDepth != 0) {
                    return getFilePathsInFolderRec(aggregator, fullPath, fileTypes, maxDepth-1, startPath)
                }
            } else if (stat.isFile()) {
                if (fileTypes.length === 0 || fileTypes.includes(path.extname(fileOrFolder))) {
                    aggregator.push(fullPath.replace(startPath, ""))
                    // console.log(fullPath.replace(startPath, ""))
                }
            }
        } catch {
            //ignored
        }
    })
    return aggregator
}


export function getFolderPathsInFolder(folderPath: string, maxDepth: number = -1) {
    let folderStat = fs.lstatSync(folderPath)
    if (folderStat && folderStat.isDirectory()) {
        let aggregator: string[] = []
        return getFolderPathsInFolderRec(aggregator, folderPath, maxDepth)
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!"
    }
}

function getFolderPathsInFolderRec(aggregator: string[], folderPath: string, maxDepth: number, startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + path.sep + fileOrFolder
        let stat = fs.lstatSync(fullPath)
        if (stat.isDirectory()) {
            aggregator.push(fullPath.replace(startPath, ""))
            if(maxDepth != 0) {
                return getFolderPathsInFolderRec(aggregator, fullPath, maxDepth-1, startPath)
            }
        }
    })
    return aggregator
}

export function getFileLinkObject(fullPath: string) {
    const relPath = fullPath.substring(fullPath.lastIndexOf(path.sep+"content"+path.sep)+1)
    let content = ""
    try {
        content = fs.readFileSync(fullPath, "utf-8")
    } catch { 
        //ignored // FIXME
    }

    const lastSlash = fullPath.lastIndexOf(path.sep)

    const folderPath = fullPath.substring(0, lastSlash) 
    const file = fullPath.substring(lastSlash + 1)

    const lastDot = file.lastIndexOf('.')

    const fileName = file.substring(0, lastDot) 
    const extension = file.substring(lastDot + 1)

    let text = fileName
    let firstHeader = REGEX_FIRST_HEADER.exec(content)?.pop()
    if(firstHeader) {
        text = firstHeader
    } else if(fileName == "index") {
        text = folderPath.substring(folderPath.lastIndexOf(path.sep)+1) 
    }
    let fileLinkObject: FileLinkObject = {
        href: "/"+relPath.replaceAll(path.sep, "/"),
        text,
        fileName,
        extension,
        path: folderPath
    }

    return fileLinkObject
}