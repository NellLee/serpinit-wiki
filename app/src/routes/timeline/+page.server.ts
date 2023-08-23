import path from "path"
import { readFile } from "fs/promises";
import type { EvCatPair, Timeline } from "$lib/types";
import { isTimeline } from "$lib/types.guard";
import { parseString } from "xml2js";
import { parseNumbers, parseBooleans } from "xml2js/lib/processors";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function load() {

    let timelinePath = path.join(__dirname + "/../../../../timeline/Geschichte.timeline");

    const evCatPairs: EvCatPair[] = await getEvCatPairs(timelinePath)

    return {
        evCatPairs
    }
}




function getEvCatPairs(timelinePath: string): Promise<EvCatPair[]> {
    return readFile(timelinePath).then(xml => {
        return parseTimeline(xml.toString());
    }).then((timeline: Timeline) => {
        return timeline.events.map((event, index) => {
            const category = timeline.categories.find(
                (cat) => cat.name === event.category
            );
            if (category) {
                return { index, event, category };
            }
            return null
        }).filter(v => !!v) as EvCatPair[];
    })
}

function parseTimeline(xml: string): Promise<Timeline> {
    return new Promise((resolve, reject) => {
        parseString(xml, { valueProcessors: [parseNumbers, parseBooleans, parseRgbs], explicitArray: false }, (err, result) => {
            result.timeline.categories = result.timeline.categories.category
            result.timeline.events = result.timeline.events.event


            if (err) {
                console.error('Error parsing XML:', err);
                reject(err)
                return;
            }

            const timeline = result.timeline;
            if (isTimeline(timeline)) {

                console.log('Valid timeline object');
                // console.log(timeline);
                resolve(timeline);
            } else {
                let message = 'Invalid timeline object format';
                console.error(message);
                reject(message)
            }
        });
    })

}


function parseRgbs(value: string) {
    if (/(\d{1,3}),(\d{1,3}),(\d{1,3})/.test(value)) {
        return `rgb(${value})`
    }
    return value;
}

