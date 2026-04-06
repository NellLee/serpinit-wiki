export type HomepageLink = {
	title: string;
	description: string;
	href: string;
	imageSrc?: string;
	imageAlt?: string;
};

export type HomepageStat = {
	label: string;
	value: string;
};

export type HomepageData = {
	title: string;
	lede: string;
	searchPrompt: string;
	stats: HomepageStat[];
	primaryBrowse: HomepageLink[];
	utilityLinks: HomepageLink[];
};

export function getHomepageData(): HomepageData {
	return {
		title: 'Serpinit-Wiki',
		lede:
			'Erkunde das Planetensystem Serpinit als Nachschlagewerk: von Himmelskörpern und Völkern bis zu Magie, Schöpfung und Zeitleiste.',
		searchPrompt: 'Direkt zu Orten, Wesen, Fraktionen und Konzepten springen.',
		stats: [],
		primaryBrowse: [
			{
				title: 'Himmelskörper',
				description: 'Planeten, Monde, Orte und Regionen des Serpinit-Systems.',
				href: '/content/Himmelskoerper_/index.md',
				imageSrc: '/Himmelskoerper_/Ikus/images/Ikus_Stern_Weltraum-Ansicht.png',
				imageAlt: 'Ikus im Weltraum'
			},
			{
				title: 'Völker',
				description: 'Die intelligenten Spezies, ihre Ableger und ihre großen Kulturräume.',
				href: '/content/Volk_/index.md',
				imageSrc: '/Volk_/Lateralen_/Conius/Charakter_/Lysandra-Swirm/images/Conius-Lateral_Lysandra-Swirm.png',
				imageAlt: 'Charakterillustration'
			},
			{
				title: 'Allgemein',
				description: 'Grundlagen zu Magie, Schöpfung und den zentralen Konzepten des Settings.',
				href: '/content/Allgemein/index.md',
				imageSrc: '/Allgemein/images/Creapatos_Drache_Gott_6_Erschaffung-Ikus.png',
				imageAlt: 'Creapatos'
			},
			{
				title: 'Charaktere',
				description: 'Ein Sammelpunkt für wichtige Figuren und spätere Charakterübersichten.',
				href: '/content/Charaktere.md',
				imageSrc: '/Volk_/Lateralen_/Conius/Charakter_/Ingvor-Nemet-Mandijit/images/Conius-Lateral_Ingvor-Nemet-Mandijit.png',
				imageAlt: 'Conius-Lateraler Charakter'
			}
		],
		utilityLinks: [
			{
				title: 'Timeline',
				description: 'Geschichte visuell erkunden.',
				href: '/content/timeline'
			},
			{
				title: 'Suche',
				description: 'Direkt in Artikeln und Begriffen suchen.',
				href: '/content/search'
			},
			{
				title: 'Converter',
				description: 'Zwischen Schriftsystemen und Formaten wechseln.',
				href: '/convert'
			}
		]
	};
}
