"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimeline = void 0;
// User Defined Type Guard to validate the parsed object format
function isValidTimeline(obj) {
    if (typeof obj.version === 'string' &&
        typeof obj.timetype === 'string' &&
        Array.isArray(obj.categories) &&
        Array.isArray(obj.events)) {
        for (const category of obj.categories) {
            if (typeof category.name === 'string' &&
                typeof category.color === 'string' &&
                typeof category.progress_color === 'string' &&
                typeof category.done_color === 'string' &&
                typeof category.font_color === 'string' &&
                (category.parent === undefined || typeof category.parent === 'string')) {
                continue;
            }
            return false;
        }
        for (const event of obj.events) {
            if (typeof event.start === 'number' &&
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
                (event.default_color === undefined || typeof event.default_color === 'string')) {
                continue;
            }
            return false;
        }
        return true;
    }
    return false;
}
exports.isValidTimeline = isValidTimeline;
