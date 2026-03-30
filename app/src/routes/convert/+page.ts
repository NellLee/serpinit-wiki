import { getUtilityPagePresentation } from '$lib/presentation/pagePresentation';

export function load() {
	return {
		presentation: getUtilityPagePresentation('convert')
	};
}
