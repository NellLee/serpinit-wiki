/*
 * Generated type guards for "types.d.ts".
 * WARNING: Do not manually change this file.
 */
import { Image, EventConfig, EvCatPair, RectangleConfig, TextConfig, Timeline, Category, Event } from "./types";

export function isImage(obj: unknown): obj is Image {
    const typedObj = obj as Image
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["full"] === "string" &&
        typeof typedObj["thumbnail"] === "string"
    )
}

export function isEventConfig(obj: unknown): obj is EventConfig {
    const typedObj = obj as EventConfig
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        isRectangleConfig(typedObj["rect"]) as boolean &&
        isTextConfig(typedObj["text"]) as boolean
    )
}

export function isEvCatPair(obj: unknown): obj is EvCatPair {
    const typedObj = obj as EvCatPair
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["index"] === "number" &&
        isEvent(typedObj["event"]) as boolean &&
        isCategory(typedObj["category"]) as boolean
    )
}

export function isRectangleConfig(obj: unknown): obj is RectangleConfig {
    const typedObj = obj as RectangleConfig
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["x"] === "number" &&
        typeof typedObj["y"] === "number" &&
        typeof typedObj["width"] === "number" &&
        typeof typedObj["height"] === "number" &&
        typeof typedObj["fill"] === "string"
    )
}

export function isTextConfig(obj: unknown): obj is TextConfig {
    const typedObj = obj as TextConfig
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["x"] === "number" &&
        typeof typedObj["y"] === "number" &&
        typeof typedObj["text"] === "string" &&
        typeof typedObj["fontSize"] === "number" &&
        typeof typedObj["fill"] === "string"
    )
}

export function isTimeline(obj: unknown): obj is Timeline {
    const typedObj = obj as Timeline
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["version"] === "string" &&
        typeof typedObj["timetype"] === "string" &&
        Array.isArray(typedObj["categories"]) &&
        typedObj["categories"].every((e: any) =>
            isCategory(e) as boolean
        ) &&
        Array.isArray(typedObj["events"]) &&
        typedObj["events"].every((e: any) =>
            isEvent(e) as boolean
        )
    )
}

export function isCategory(obj: unknown): obj is Category {
    const typedObj = obj as Category
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["name"] === "string" &&
        typeof typedObj["color"] === "string" &&
        typeof typedObj["progress_color"] === "string" &&
        typeof typedObj["done_color"] === "string" &&
        typeof typedObj["font_color"] === "string" &&
        (typeof typedObj["parent"] === "undefined" ||
            typeof typedObj["parent"] === "string")
    )
}

export function isEvent(obj: unknown): obj is Event {
    const typedObj = obj as Event
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        typeof typedObj["start"] === "number" &&
        typeof typedObj["end"] === "number" &&
        typeof typedObj["text"] === "string" &&
        typeof typedObj["fuzzy"] === "boolean" &&
        typeof typedObj["fuzzy_start"] === "boolean" &&
        typeof typedObj["fuzzy_end"] === "boolean" &&
        typeof typedObj["locked"] === "boolean" &&
        typeof typedObj["ends_today"] === "boolean" &&
        typeof typedObj["category"] === "string" &&
        (typeof typedObj["description"] === "undefined" ||
            typeof typedObj["description"] === "string") &&
        (typeof typedObj["labels"] === "undefined" ||
            typeof typedObj["labels"] === "string" ||
            Array.isArray(typedObj["labels"]) &&
            typedObj["labels"].every((e: any) =>
                typeof e === "string"
            )) &&
        (typeof typedObj["default_color"] === "undefined" ||
            typeof typedObj["default_color"] === "string")
    )
}
