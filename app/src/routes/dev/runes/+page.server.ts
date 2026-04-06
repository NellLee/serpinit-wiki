import { createDefaultRunicSelection, createRunePresentation } from '$lib/components/runes/runePresentation';
import { loadResolvedRunicLibrary } from '$lib/runes/library';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const library = loadResolvedRunicLibrary({ forceReload: true });
	const requestedId = url.searchParams.get('id');
	const fallback = createDefaultRunicSelection(library);
	const selectedDocument = (requestedId ? library.documentsById[requestedId] : null) ?? fallback?.document ?? null;
	const selectedId = selectedDocument?.id ?? null;

	if (!selectedDocument || !selectedId) {
		return {
			library,
			selectedId: null,
			selectedDocument: null,
			presentation: null
		};
	}

	const presentation = createRunePresentation(selectedDocument);

	return {
		library,
		selectedId,
		selectedDocument,
		presentation
	};
};
