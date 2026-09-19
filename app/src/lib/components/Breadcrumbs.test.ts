import { describe, expect, test } from 'vitest';
import { render } from 'svelte/server';
import Breadcrumbs from './Breadcrumbs.svelte';

function delimiters(html: string): string[] {
	return [...html.matchAll(/<li class="delimiter[^"]*">(.*?)<\/li>/gs)].map((match) =>
		match[1].replace(/<!--.*?-->/gs, '').trim()
	);
}

describe('Breadcrumbs', () => {
	test('shows "-" after a tag folder and "/" after other folders', () => {
		const { body } = render(Breadcrumbs, {
			props: {
				linkList: [
					{ text: 'Home', href: '/content', tagFolder: false },
					{ text: 'Volk', href: '/content/Volk', tagFolder: true },
					{ text: 'Lateralen', href: '/content/Volk/Lateralen', tagFolder: true },
					{ text: 'Conius', href: '/content/Volk/Lateralen/Conius', tagFolder: false },
					{ text: 'Politik', href: '/content/Volk/Lateralen/Conius/Politik', tagFolder: false }
				]
			}
		});

		expect(delimiters(body)).toEqual(['/', '-', '-', '/', '']);
	});
});
