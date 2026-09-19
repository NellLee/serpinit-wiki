import { expect, test } from '@playwright/test';

const PAN_TOLERANCE_PX = 2;

function parseAxisLabel(label) {
	return Number(label.replace(/−/g, '-').replace(/\./g, '').replace(',', '.'));
}

async function readAxisOnce(page) {
	return page.evaluate(() => {
		const svg = document.querySelector('.timeline svg');
		const box = svg.getBoundingClientRect();
		const ticks = [...svg.querySelectorAll('g.axis g.tick')].map((tick) => ({
			x: Number(/translate\(([-\d.e]+)/.exec(tick.getAttribute('transform'))[1]),
			label: tick.querySelector('text').textContent
		}));
		const axisTransform = svg.querySelector('g.axis').getAttribute('transform') ?? '';
		const axisY = Number(/translate\([-\d.e]+[ ,]+([-\d.e]+)/.exec(axisTransform)?.[1] ?? NaN);
		const cursor = svg.querySelector('line.cursor-line');
		return {
			box: { left: box.left, top: box.top, width: box.width, height: box.height },
			ticks,
			axisY,
			cursorX: cursor ? Number(cursor.getAttribute('x1')) : null
		};
	});
}

// The axis redraws through a short d3 transition, so wait until two reads agree.
async function readAxis(page) {
	let previous = JSON.stringify(await readAxisOnce(page));
	for (let attempt = 0; attempt < 40; attempt++) {
		await page.waitForTimeout(50);
		const current = JSON.stringify(await readAxisOnce(page));
		if (current === previous) {
			return JSON.parse(current);
		}
		previous = current;
	}
	throw new Error('Timeline axis did not settle');
}

// Reconstructs the pixel <-> year mapping from the rendered axis ticks.
async function readView(page) {
	const axis = await readAxis(page);
	const points = axis.ticks
		.map((tick) => ({ x: tick.x, year: parseAxisLabel(tick.label) }))
		.filter((point) => Number.isFinite(point.year));
	expect(points.length).toBeGreaterThanOrEqual(2);
	const first = points[0];
	const last = points[points.length - 1];
	const pixelsPerYear = (last.x - first.x) / (last.year - first.year);
	return {
		...axis,
		pixelsPerYear,
		yearAt: (x) => first.year + (x - first.x) / pixelsPerYear,
		xOf: (year) => first.x + (year - first.year) * pixelsPerYear
	};
}

async function dragBy(page, box, dx, dy) {
	const startX = box.left + box.width / 2;
	const startY = box.top + box.height / 2;
	const steps = 10;
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	for (let step = 1; step <= steps; step++) {
		await page.mouse.move(startX + (dx * step) / steps, startY + (dy * step) / steps);
	}
	await page.mouse.up();
}

async function wheelZoomAt(page, box, fractionOfWidth, deltaY) {
	const x = box.width * fractionOfWidth;
	await page.mouse.move(box.left + x, box.top + box.height / 2);
	await page.mouse.wheel(0, deltaY);
	return x;
}

test.beforeEach(async ({ page }) => {
	await page.goto('/content/timeline', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('.timeline svg g.axis g.tick');
});

test('dragging pans the timeline 1:1 with the pointer', async ({ page }) => {
	for (let drag = 0; drag < 2; drag++) {
		const before = await readView(page);
		const centerX = before.box.width / 2;
		const yearAtCenter = before.yearAt(centerX);

		await dragBy(page, before.box, 200, 0);

		const after = await readView(page);
		expect(Math.abs(after.xOf(yearAtCenter) - centerX - 200)).toBeLessThanOrEqual(PAN_TOLERANCE_PX);
	}
});

test('wheel zoom keeps the year under the pointer fixed', async ({ page }) => {
	for (const fraction of [0.25, 0.75]) {
		const before = await readView(page);
		const yearUnderPointer = before.yearAt(before.box.width * fraction);

		const pointerX = await wheelZoomAt(page, before.box, fraction, -300);

		const after = await readView(page);
		expect(after.pixelsPerYear).toBeGreaterThan(before.pixelsPerYear);
		expect(Math.abs(after.xOf(yearUnderPointer) - pointerX)).toBeLessThanOrEqual(PAN_TOLERANCE_PX);
	}
});

test('dragging still pans 1:1 after zooming', async ({ page }) => {
	const initial = await readView(page);
	await wheelZoomAt(page, initial.box, 0.75, -600);

	const before = await readView(page);
	const centerX = before.box.width / 2;
	const yearAtCenter = before.yearAt(centerX);

	await dragBy(page, before.box, -150, 0);

	const after = await readView(page);
	expect(Math.abs(after.xOf(yearAtCenter) - centerX + 150)).toBeLessThanOrEqual(PAN_TOLERANCE_PX);
});

test('dragging vertically moves the axis 1:1 and leaves the years alone', async ({ page }) => {
	const before = await readView(page);
	const yearAtCenter = before.yearAt(before.box.width / 2);

	await dragBy(page, before.box, 0, 100);

	const after = await readView(page);
	expect(after.axisY - before.axisY).toBeCloseTo(100, 0);
	expect(Math.abs(after.xOf(yearAtCenter) - before.box.width / 2)).toBeLessThanOrEqual(
		PAN_TOLERANCE_PX
	);
});

test('zooming does not move the axis vertically', async ({ page }) => {
	const before = await readView(page);
	await wheelZoomAt(page, before.box, 0.5, -400);
	const after = await readView(page);
	expect(after.axisY).toBeCloseTo(before.axisY, 0);
});

test('the cursor line stays under the pointer while dragging and zooming', async ({ page }) => {
	const before = await readView(page);

	await dragBy(page, before.box, 120, 0);
	const afterDrag = await readAxis(page);
	expect(Math.abs(afterDrag.cursorX - (before.box.width / 2 + 120))).toBeLessThanOrEqual(
		PAN_TOLERANCE_PX
	);

	const pointerX = await wheelZoomAt(page, before.box, 0.25, -200);
	const afterZoom = await readAxis(page);
	expect(Math.abs(afterZoom.cursorX - pointerX)).toBeLessThanOrEqual(PAN_TOLERANCE_PX);
});
