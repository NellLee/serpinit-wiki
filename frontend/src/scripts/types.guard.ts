/*
 * Generated type guards for "types.ts".
 * WARNING: Do not manually change this file.
 */
import { Timeline, Category, Event } from "./types";

function evaluate(
    isCorrect: boolean,
    varName: string,
    expected: string,
    actual: any
): boolean {
    if (!isCorrect) {
        console.error(
            `${varName} type mismatch, expected: ${expected}, found:`,
            actual
        )
    }
    return isCorrect
}

export function isTimeline(obj: unknown, argumentName: string = "timeline"): obj is Timeline {
    const typedObj = obj as Timeline
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["version"] === "string", `${argumentName}["version"]`, "string", typedObj["version"]) &&
        evaluate(typeof typedObj["timetype"] === "string", `${argumentName}["timetype"]`, "string", typedObj["timetype"]) &&
        evaluate(Array.isArray(typedObj["categories"]) &&
            typedObj["categories"].every((e: any) =>
                isCategory(e) as boolean
            ), `${argumentName}["categories"]`, "import(\"./src/scripts/types\").Category[]", typedObj["categories"]) &&
        evaluate(Array.isArray(typedObj["events"]) &&
            typedObj["events"].every((e: any) =>
                isEvent(e) as boolean
            ), `${argumentName}["events"]`, "import(\"./src/scripts/types\").Event[]", typedObj["events"])
    )
}

export function isCategory(obj: unknown, argumentName: string = "category"): obj is Category {
    const typedObj = obj as Category
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["name"] === "string", `${argumentName}["name"]`, "string", typedObj["name"]) &&
        evaluate(typeof typedObj["color"] === "string", `${argumentName}["color"]`, "string", typedObj["color"]) &&
        evaluate(typeof typedObj["progress_color"] === "string", `${argumentName}["progress_color"]`, "string", typedObj["progress_color"]) &&
        evaluate(typeof typedObj["done_color"] === "string", `${argumentName}["done_color"]`, "string", typedObj["done_color"]) &&
        evaluate(typeof typedObj["font_color"] === "string", `${argumentName}["font_color"]`, "string", typedObj["font_color"]) &&
        evaluate((typeof typedObj["parent"] === "undefined" ||
            typeof typedObj["parent"] === "string"), `${argumentName}["parent"]`, "string | undefined", typedObj["parent"])
    )
}

export function isEvent(obj: unknown, argumentName: string = "event"): obj is Event {
    const typedObj = obj as Event
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        evaluate(typeof typedObj["start"] === "number", `${argumentName}["start"]`, "number", typedObj["start"]) &&
        evaluate(typeof typedObj["end"] === "number", `${argumentName}["end"]`, "number", typedObj["end"]) &&
        evaluate(typeof typedObj["text"] === "string", `${argumentName}["text"]`, "string", typedObj["text"]) &&
        evaluate(typeof typedObj["fuzzy"] === "boolean", `${argumentName}["fuzzy"]`, "boolean", typedObj["fuzzy"]) &&
        evaluate(typeof typedObj["fuzzy_start"] === "boolean", `${argumentName}["fuzzy_start"]`, "boolean", typedObj["fuzzy_start"]) &&
        evaluate(typeof typedObj["fuzzy_end"] === "boolean", `${argumentName}["fuzzy_end"]`, "boolean", typedObj["fuzzy_end"]) &&
        evaluate(typeof typedObj["locked"] === "boolean", `${argumentName}["locked"]`, "boolean", typedObj["locked"]) &&
        evaluate(typeof typedObj["ends_today"] === "boolean", `${argumentName}["ends_today"]`, "boolean", typedObj["ends_today"]) &&
        evaluate(typeof typedObj["category"] === "string", `${argumentName}["category"]`, "string", typedObj["category"]) &&
        evaluate((typeof typedObj["description"] === "undefined" ||
            typeof typedObj["description"] === "string"), `${argumentName}["description"]`, "string | undefined", typedObj["description"]) &&
        evaluate((typeof typedObj["labels"] === "undefined" ||
            typeof typedObj["labels"] === "string" ||
            Array.isArray(typedObj["labels"]) &&
            typedObj["labels"].every((e: any) =>
                typeof e === "string"
            )), `${argumentName}["labels"]`, "string | string[] | undefined", typedObj["labels"]) &&
        evaluate((typeof typedObj["default_color"] === "undefined" ||
            typeof typedObj["default_color"] === "string"), `${argumentName}["default_color"]`, "string | undefined", typedObj["default_color"])
    )
}
