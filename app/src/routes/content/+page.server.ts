import { getHomepageData } from '$lib/homepage';
import { getContentPagePresentation } from '$lib/presentation/pagePresentation';

export function load() {
	return {
		homepage: getHomepageData(),
		presentation: getContentPagePresentation('content')
	};
}
