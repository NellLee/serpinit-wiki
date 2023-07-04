import { parseString } from 'xml2js';

// Interface for the XML data
interface Timeline {
    version: string;
    timetype: string;
    categories: Category[];
    events: Event[];
}

interface Category {
    name: string;
    color: string;
    progress_color: string;
    done_color: string;
    font_color: string;
    parent?: string;
}

interface Event {
    start: number;
    end: number;
    text: string;
    fuzzy: boolean;
    fuzzy_start: boolean;
    fuzzy_end: boolean;
    locked: boolean;
    ends_today: boolean;
    category: string;
    description?: string;
    labels?: string[];
    default_color?: string;
}

// User Defined Type Guard to validate the parsed object format
function isValidTimeline(obj: any): obj is Timeline {
    if (
        typeof obj.version === 'string' &&
        typeof obj.timetype === 'string' &&
        Array.isArray(obj.categories) &&
        Array.isArray(obj.events)
    ) {
        for (const category of obj.categories) {
            if (
                typeof category.name === 'string' &&
                typeof category.color === 'string' &&
                typeof category.progress_color === 'string' &&
                typeof category.done_color === 'string' &&
                typeof category.font_color === 'string' &&
                (category.parent === undefined || typeof category.parent === 'string')
            ) {
                continue;
            }
            return false;
        }

        for (const event of obj.events) {
            if (
                typeof event.start === 'number' &&
                typeof event.end === 'number' &&
                typeof event.text === 'string' &&
                typeof event.fuzzy === 'boolean' &&
                typeof event.fuzzy_start === 'boolean' &&
                typeof event.fuzzy_end === 'boolean' &&
                typeof event.locked === 'boolean' &&
                typeof event.ends_today === 'boolean' &&
                typeof event.category === 'string' &&
                (event.description === undefined || typeof event.description === 'string') &&
                (event.labels === undefined || Array.isArray(event.labels)) &&
                (event.default_color === undefined || typeof event.default_color === 'string')
            ) {
                continue;
            }
            return false;
        }

        return true;
    }

    return false;
}

function normalizeObject(obj: any) {
    if (typeof obj !== 'object') {
        return obj;
    }

    const normalized: any = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (Array.isArray(value)) {
                if (value.length === 1 && typeof value[0] === 'string') {
                    normalized[key] = value[0];
                } else {
                    normalized[key] = [];
                    for(const [index, item] of Object.entries(value)) {
                        normalized[key][index] = normalizeObject(item)
                    }
                }
            } else {
                normalized[key] = normalizeObject(value);
            }
        }
    }

    return normalized;
}

//FIXME parse numbers correctly
export function parseTimeline(xml: string) {
    parseString(xml, (err, result) => {
        let normalized = normalizeObject(result)
        console.log(JSON.stringify(normalized, null, 2))




        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const timeline = result.timeline;
        if (isValidTimeline(timeline)) {
            console.log('Valid timeline object:', timeline);
            // You can work with the valid timeline object here
        } else {
            console.error('Invalid timeline object format');
        }
    });
}
