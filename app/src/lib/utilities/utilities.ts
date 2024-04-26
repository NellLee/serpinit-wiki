


export function generateHeaderId(str: string | null) {
    if (!str) {
        return ""
    }
    return str.trim().toLowerCase().replace(/\s+/g, '-')
}
