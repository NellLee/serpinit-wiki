
import path from "path"
import { readFile } from "fs/promises"
import { parseString } from 'xml2js'
import { parseBooleans, parseNumbers } from "xml2js/lib/processors"
const __dirname = new URL(".", import.meta.url).pathname.substring(1)

export type EvCatPair = { index: number, event: Event, category: Category }

export type Category = {
    name: string
    color: string
    progress_color: string
    done_color: string
    font_color: string
    parent?: string
}

export type Event = {
    start: number
    end: number
    text: string
    fuzzy: boolean
    fuzzy_start: boolean
    fuzzy_end: boolean
    locked: boolean
    ends_today: boolean
    category: string
    description?: string
    labels?: string[] | string
    default_color?: string
}

type CategorizedTimeline = {
    version: string
    timetype: string
    categories: Category[]
    events: Event[]
}

export const TIMELINE_PATH = path.resolve(__dirname, "../../../timeline/Geschichte.timeline")
export const TIMELINE_API_URL = "/api/timeline"

export let timeline: EvCatPair[] = []

export async function loadTimeline() {
    console.log("Loading timeline...")
    timeline = await getEvCatPairs()
    console.log("Loading timeline... Done!")
}

function getEvCatPairs(): Promise<EvCatPair[]> {
    return readFile(TIMELINE_PATH).then(xml => {
        return parseTimeline(xml.toString())
    }).then((timeline: CategorizedTimeline) => {
        return timeline.events.map((event, index) => {
            const category = timeline.categories.find(
                (cat) => cat.name === event.category
            )
            if (category) {
                return { index, event, category }
            }
            return null
        }).filter(v => !!v) as EvCatPair[]
    })
}

function parseTimeline(xml: string): Promise<CategorizedTimeline> {
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