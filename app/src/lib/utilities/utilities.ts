


export function generateHeaderId(str: string | null) {
    if (!str) {
        return ""
    }
    return str.trim().toLowerCase().replace(/\s/g, '-').replace(/[^\p{Letter}\p{Mark}\d_-]/gu, '')
}

export function resolveRelativeUrl(base: string, relative: string) {
    const baseUrl = new URL(base, 'http://dummy.com');
    const resolvedUrl = new URL(relative, baseUrl);

    // Remove the dummy domain and return the absolute path
    return resolvedUrl.pathname;
}

export function extractFirstSentenceOrWords(text: string, numWords: number = 10) {
    const sentenceRegex = /^[^.!?]*([.!?](?=\s|$))/;
    const sentenceMatch = text.match(sentenceRegex);
    if (sentenceMatch) {
        return sentenceMatch[0];
    }
    const words = text.split(/\s+/);
    const firstTenWords = words.slice(0, numWords).join(' ');
    return firstTenWords;
}

export function removeDuplicatesAndPartials(arr: string[]): string[] {
    // Create a new array to store the results
    let result = [];

    // Iterate through each string in the array
    for (let i = 0; i < arr.length; i++) {
        let isSubstring = false;

        // Check if the current string is a substring of any other string
        for (let j = 0; j < arr.length; j++) {
            if (i !== j && arr[j].includes(arr[i])) {
                isSubstring = true;
                break;
            }
        }

        // If the current string is not a substring, add it to the result array
        if (!isSubstring) {
            result.push(arr[i]);
        }
    }

    return result;
}

export function partitionArray<Type>(array: Type[], predicate: (item: Type) => number, num?: number): Type[][]{
    let partitions: any[][];
    if(num !== undefined) {
        partitions = Array.from({ length: num }, () => []);
    } else {
        partitions = []
    }
    
    array.reduce((acc, item) => {
      const groupIndex = predicate(item);
      
      if (acc[groupIndex] === undefined) {
        acc[groupIndex] = []
      }
      acc[groupIndex].push(item);
      
      return acc;
    }, partitions);
    
    return partitions;
  }