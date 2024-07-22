

import { error } from "@sveltejs/kit"
import fs from "fs"
import path from "path"
import { WIKI_PATH } from "../wiki"

export function getFilePathsInFolder(folderPath: string, fileTypes: string[] = [], maxDepth: number = -1) {
    if(!fs.existsSync(folderPath)) {
        throw error(404, `Folder ${getFrontendSafePath(folderPath)} not found`)
    }
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

export function getFrontendSafePath(fullPath: string): string {
    return fullPath.replace(WIKI_PATH+path.sep, "").replaceAll(path.sep, "/")
}