import express, { Application, Request, Response } from 'express';
import {readFileSync} from "fs";
import { parseString } from 'xml2js';
import {isValidTimeline} from "./guards";

const app: Application = express();


const PORT: number = 3000;

app.use('/', (req: Request, res: Response): void => {




// Read and parse the XML file
    const xml = readFileSync('timeline.xml', 'utf-8');

    parseAndValidateXML(xml)
        .then((validatedObject: ParsedXML) => {
            console.log(validatedObject);
        })
        .catch((error: Error) => {
            console.error(error);
        });

});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, (): void => {
    console.log('Server running on: http://localhost:'+ PORT);
});