type LinkObject = {
	href: string;
	text: string;
	tagFolder?: boolean;
};

type NamedLinkList = {
	name: string;
	linkList: LinkObject[];
};

type LinkTree = {
	children: LinkNode[];
};

type LinkNode = {
	link: LinkObject;
	children: LinkNode[];
	parent: LinkNode | LinkTree;
};

type Timeline = TimelineEvent[];

type TimelineEvent = {
	start: number;
	end: number;
	text: string;
	fuzzy_start: boolean;
	fuzzy_end: boolean;
	category: {
		name: string;
		color: string;
		progress_color: string;
		done_color: string;
		font_color: string;
		parent?: string;
	} | null;
	href: string;
	description?: string;
};

type SearchResult<T> = {
	item: T;
	excerpts: string[];
	titleHighlights?: [number, number][];
};
