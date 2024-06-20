


export function generateHeaderId(str: string | null) {
    if (!str) {
        return ""
    }
    return str.trim().toLowerCase().replace(/\s+/g, '-')
}

export function resolveRelativeUrl(base: string, relative: string) {
    const baseUrl = new URL(base, 'http://dummy.com');
    const resolvedUrl = new URL(relative, baseUrl);
    
    // Remove the dummy domain and return the absolute path
    return resolvedUrl.pathname;
  }