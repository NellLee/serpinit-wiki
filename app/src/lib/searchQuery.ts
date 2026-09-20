import type { ParsedSearchQuery, SearchFieldFilterKey } from './searchContracts';

const FIELD_KEYWORDS: Record<string, SearchFieldFilterKey> = {
	titel: 'title',
	kategorie: 'category',
	pfad: 'path',
	typ: 'type'
};

function createEmptyParsedSearchQuery(rawQuery: string): ParsedSearchQuery {
	return {
		rawQuery,
		freeTextTerms: [],
		phrases: [],
		exclusions: [],
		fieldFilters: {
			title: [],
			category: [],
			path: [],
			type: []
		}
	};
}

function readQuotedValue(query: string, startIndex: number): { value: string; nextIndex: number } {
	let value = '';
	let index = startIndex + 1;

	while (index < query.length) {
		const character = query[index];
		if (character === '"') {
			return {
				value,
				nextIndex: index + 1
			};
		}

		value += character;
		index++;
	}

	return {
		value,
		nextIndex: index
	};
}

function readTokenValue(query: string, startIndex: number): { value: string; nextIndex: number } {
	let value = '';
	let index = startIndex;

	while (index < query.length && !/\s/.test(query[index])) {
		value += query[index];
		index++;
	}

	return {
		value,
		nextIndex: index
	};
}

function readSyntacticUnit(
	query: string,
	startIndex: number
): {
	value: string;
	nextIndex: number;
	quoted: boolean;
} {
	if (query[startIndex] === '"') {
		const quotedValue = readQuotedValue(query, startIndex);
		return {
			value: quotedValue.value,
			nextIndex: quotedValue.nextIndex,
			quoted: true
		};
	}

	const tokenValue = readTokenValue(query, startIndex);
	return {
		value: tokenValue.value,
		nextIndex: tokenValue.nextIndex,
		quoted: false
	};
}

export function parseSearchQuery(rawQuery: string): ParsedSearchQuery {
	const parsedQuery = createEmptyParsedSearchQuery(rawQuery);
	let index = 0;

	while (index < rawQuery.length) {
		if (/\s/.test(rawQuery[index])) {
			index++;
			continue;
		}

		const fieldMatch = rawQuery.slice(index).match(/^(titel|kategorie|pfad|typ):/i);
		if (fieldMatch) {
			const fieldKey = FIELD_KEYWORDS[fieldMatch[1].toLowerCase()];
			const unit = readSyntacticUnit(rawQuery, index + fieldMatch[0].length);
			if (unit.value) {
				parsedQuery.fieldFilters[fieldKey].push(unit.value);
			}
			index = unit.nextIndex;
			continue;
		}

		if (rawQuery[index] === '-') {
			const exclusion = readTokenValue(rawQuery, index + 1);
			if (exclusion.value) {
				parsedQuery.exclusions.push(exclusion.value);
			}
			index = exclusion.nextIndex;
			continue;
		}

		const unit = readSyntacticUnit(rawQuery, index);
		if (unit.value) {
			if (unit.quoted) {
				parsedQuery.phrases.push(unit.value);
			} else {
				parsedQuery.freeTextTerms.push(unit.value);
			}
		}
		index = unit.nextIndex;
	}

	return parsedQuery;
}
