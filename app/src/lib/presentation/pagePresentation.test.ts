import assert from "node:assert/strict";
import {
	getContentPagePresentation,
	getUtilityPagePresentation,
} from "./pagePresentation";

assert.deepEqual(getContentPagePresentation("/content"), {
	pageClass: "hub",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: true
});

assert.deepEqual(getContentPagePresentation("/content/atlas/index.md"), {
	pageClass: "index",
	showToc: false,
	showContextRail: true,
	contentWidth: "wide",
	emphasizeOverview: true
});

assert.deepEqual(getContentPagePresentation("/content/atlas/notes.md"), {
	pageClass: "article",
	showToc: true,
	showContextRail: true,
	contentWidth: "standard",
	emphasizeOverview: false
});

assert.deepEqual(getContentPagePresentation("/content/images/gallery/index.md"), {
	pageClass: "media",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: true
});

assert.deepEqual(getUtilityPagePresentation("search"), {
	pageClass: "utility",
	showToc: false,
	showContextRail: false,
	contentWidth: "wide",
	emphasizeOverview: false
});
