import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
	getContentPagePresentation,
	getUtilityPagePresentation,
} from "./pagePresentation";

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), "utf8");
}

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

assert.deepEqual(getContentPagePresentation("/content/atlas/media/index.md"), {
	pageClass: "index",
	showToc: false,
	showContextRail: true,
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

assert.deepEqual(getUtilityPagePresentation("timeline"), {
	pageClass: "utility",
	showToc: false,
	showContextRail: true,
	contentWidth: "wide",
	emphasizeOverview: false
});

assert.deepEqual(getUtilityPagePresentation("convert"), {
	pageClass: "utility",
	showToc: false,
	showContextRail: false,
	contentWidth: "standard",
	emphasizeOverview: false
});

const searchRouteSource = readAppFile("src/routes/content/search/+page.server.ts");
assert.match(searchRouteSource, /getUtilityPagePresentation/);
assert.match(searchRouteSource, /presentation:\s*getUtilityPagePresentation\("search"\)/);

const timelineRouteSource = readAppFile("src/routes/content/timeline/+page.server.ts");
assert.match(timelineRouteSource, /getUtilityPagePresentation/);
assert.match(timelineRouteSource, /presentation:\s*getUtilityPagePresentation\("timeline"\)/);

const convertRoutePath = path.resolve(APP_ROOT, "src/routes/convert/+page.ts");
assert.equal(fs.existsSync(convertRoutePath), true);

const convertRouteSource = fs.readFileSync(convertRoutePath, "utf8");
assert.match(convertRouteSource, /getUtilityPagePresentation/);
assert.match(convertRouteSource, /presentation:\s*getUtilityPagePresentation\("convert"\)/);
