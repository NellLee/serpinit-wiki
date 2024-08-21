
import path from "path"
import { readFile } from "fs/promises"
import { parseString } from 'xml2js'
import { parseBooleans, parseNumbers } from "xml2js/lib/processors"
const __dirname = new URL(".", import.meta.url).pathname.substring(1)

let initialized = false

export const TIMELINE_PATH = path.resolve(__dirname, "../../../timeline/Geschichte.timeline")

export let timeline: Timeline = []

export async function initTimeline() {
    if (!initialized) {
        console.log("Initializing timeline")
        timeline = await categorizeEvents()
        initialized = true
    }
}

function categorizeEvents(): Promise<TimelineEvent[]> {
    return readFile(TIMELINE_PATH).then(xml => {
        return parseTimeline(xml.toString())
    }).then((timeline: XmlTimeline) => {
        return timeline.events.map((event) => {
            const category = timeline.categories.find(
                (cat) => cat.name === event.category
            ) ?? null
            let result: TimelineEvent =  {
                ...event,
                category
            }
            return result
        })
    })
}

function parseTimeline(xml: string): Promise<XmlTimeline> {
    return new Promise((resolve, reject) => {
        parseString(xml, { valueProcessors: [parseNumbers, parseBooleans, parseRgbs], explicitArray: false }, (err, result) => {
            result.timeline.categories = result.timeline.categories.category
            result.timeline.events = result.timeline.events.event

            if (err) {
                console.error('Error parsing XML:', err)
                reject(err)
                return
            } else {
                const timeline = result.timeline
                resolve(timeline)
            }

        })
    })

}

function parseRgbs(value: string) {
    if (/(\d{1,3}),(\d{1,3}),(\d{1,3})/.test(value)) {
        return `rgb(${value})`
    }
    return value
}