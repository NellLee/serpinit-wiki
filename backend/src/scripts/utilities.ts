
import fs from "fs";
import path from "path";

export function generateHeaderId(str: string) {
    return str.trim().toLowerCase().replace(/\s+/g, '-')
}

export function getFilePathsInFolder(folderPath: string, fileTypes: string[] = [], maxDepth: number = -1) {
    let folderStat = fs.lstatSync(folderPath);
    if (folderStat && folderStat.isDirectory()) {
        let aggregator = [];
        return getFilePathsInFolderRec(aggregator, folderPath, fileTypes, maxDepth);
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
    }
}

function getFilePathsInFolderRec(aggregator: string[], folderPath: string, fileTypes: string[] = [], maxDepth: number, startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + "/" + fileOrFolder;
        try {
            let stat = fs.lstatSync(fullPath);
            if (stat.isDirectory()) {
                if(maxDepth != 0) {
                    return getFilePathsInFolderRec(aggregator, fullPath, fileTypes, maxDepth-1, startPath);
                }
            } else if (stat.isFile()) {
                if (fileTypes.length === 0 || fileTypes.includes(path.extname(fileOrFolder))) {
                    aggregator.push(fullPath.replace(startPath, ""));
                    // console.log(fullPath.replace(startPath, ""))
                }
            }
        } catch {
            //ignored
        }
    });
    return aggregator;
}


export function getFolderPathsInFolder(folderPath: string) {
    let folderStat = fs.lstatSync(folderPath);
    if (folderStat && folderStat.isDirectory()) {
        let aggregator = [];
        return getFolderPathsInFolderRec(aggregator, folderPath);
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
    }
}

function getFolderPathsInFolderRec(aggregator: string[], folderPath: string, startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + "/" + fileOrFolder;
        let stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            aggregator.push(fullPath.replace(startPath, ""));
            return getFolderPathsInFolderRec(aggregator, fullPath, startPath);
        }
    });
    return aggregator;
}