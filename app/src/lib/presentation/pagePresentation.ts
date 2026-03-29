export type PageClass = "hub" | "index" | "article" | "media" | "utility";

export type UtilityView = "search" | "timeline" | "convert";

export interface PagePresentation {
	pageClass: PageClass;
	showToc: boolean;
	showContextRail: boolean;
	contentWidth: "standard" | "wide";
	emphasizeOverview: boolean;
}

const HUB_PRESENTATION: PagePresentation = {
	pageClass: "hub",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: true
};

const INDEX_PRESENTATION: PagePresentation = {
	pageClass: "index",
	showToc: false,
	showContextRail: true,
	contentWidth: "wide",
	emphasizeOverview: true
};

const ARTICLE_PRESENTATION: PagePresentation = {
	pageClass: "article",
	showToc: true,
	showContextRail: true,
	contentWidth: "standard",
	emphasizeOverview: false
};

const MEDIA_PRESENTATION: PagePresentation = {
	pageClass: "media",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: true
};

const UTILITY_PRESENTATION: PagePresentation = {
	pageClass: "utility",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: false
};

const MEDIA_BRANCHES = new Set(["images", "gallery", "galleries", "media"]);

function clonePresentation(presentation: PagePresentation): PagePresentation {
	return { ...presentation };
}

function normalizePagePath(pagePath: string | null | undefined): string {
	if (!pagePath) {
		return "";
	}

	return pagePath.replace(/\\/g, "/").replace(/^\/+/, "");
}

function isHubPage(pagePath: string): boolean {
	return (
		pagePath === "" ||
		pagePath === "content" ||
		pagePath === "index.md" ||
		pagePath === "content/index.md"
	);
}

function isMediaPage(pagePath: string): boolean {
	const segments = pagePath.split("/").filter(Boolean);
	if (segments.length === 0) {
		return false;
	}

	return segments.some((segment) => MEDIA_BRANCHES.has(segment)) || pagePath.includes("/images/");
}

function isIndexPage(pagePath: string): boolean {
	return pagePath.endsWith("/index.md");
}

export function getContentPagePresentation(pagePath: string | null | undefined): PagePresentation {
	const normalizedPath = normalizePagePath(pagePath);

	if (isHubPage(normalizedPath)) {
		return clonePresentation(HUB_PRESENTATION);
	}

	if (isMediaPage(normalizedPath)) {
		return clonePresentation(MEDIA_PRESENTATION);
	}

	if (isIndexPage(normalizedPath)) {
		return clonePresentation(INDEX_PRESENTATION);
	}

	return clonePresentation(ARTICLE_PRESENTATION);
}

export function getUtilityPagePresentation(_view: UtilityView): PagePresentation {
	// Utility routes such as /content/search, /content/timeline, and /convert
	// must share this module instead of duplicating classification logic.
	return clonePresentation(UTILITY_PRESENTATION);
}
