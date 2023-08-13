
import fs from "fs";
import path from "path";

export function getFilePathsInFolder(folderPath: string, fileType = "") {
    let folderStat = fs.lstatSync(folderPath);
    if (folderStat && folderStat.isDirectory()) {
        let aggregator = [];
        return getFilePathsInFolderRec(aggregator, folderPath, fileType);
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
    }
}

function getFilePathsInFolderRec(aggregator: string[], folderPath: string, fileType = "", startPath = folderPath) {
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
            return getFilePathsInFolderRec(aggregator, fullPath, startPath);
        }
    });
    return aggregator;
}