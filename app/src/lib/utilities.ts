
import fs from "fs";
import path from "path";

export function getFilePathsInFolder(folderPath: string, fileTypes: string[] = []) {
    let folderStat = fs.lstatSync(folderPath);
    if (folderStat && folderStat.isDirectory()) {
        let aggregator: string[] = [];
        return getFilePathsInFolderRec(aggregator, folderPath, fileTypes);
    } else {
        throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
    }
}

function getFilePathsInFolderRec(aggregator: string[], folderPath: string, fileTypes: string[] = [], startPath = folderPath) {
    fs.readdirSync(folderPath).forEach(fileOrFolder => {
        let fullPath = folderPath + "/" + fileOrFolder;
        let stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            return getFilePathsInFolderRec(aggregator, fullPath, fileTypes, startPath);
        } else if (stat.isFile()) {
            if (fileTypes.length === 0 || fileTypes.includes(path.extname(fileOrFolder))) {
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
        let aggregator: string[] = [];
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