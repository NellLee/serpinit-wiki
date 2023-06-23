import express, { Application, Request, Response } from 'express';
import { convertXML } from 'simple-xml-to-json';
import * as fs from "fs";

const app: Application = express();

const PORT: number = 3000;

app.use('/', (req: Request, res: Response): void => {

    const xmlData = fs.readFileSync("./timeline.xml", { encoding: 'utf8', flag: 'r' })

    const jsonData = convertXML(xmlData) as Timeline;


// Validate the parsed JSON data
    if (isValidTimelineData(jsonData)) {
        console.log('Parsed timeline data:', jsonData);
    } else {
        console.log('Invalid timeline data format');
    }
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, (): void => {
    console.log('Server running on: http://localhost:', PORT);
});