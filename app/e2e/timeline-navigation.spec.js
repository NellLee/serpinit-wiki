import { expect, test } from '@playwright/test';

const PAN_TOLERANCE_PX = 2;

// E2E_DEMO=1 slows every action down and draws a fake pointer, so a human can watch a headed run.
const DEMO = Boolean(process.env.E2E_DEMO);
const DEMO_PAUSE_MS = 900;
const WHEEL_NOTCH = 100; // deltaY of one click of a typical mouse wheel

test.use({ launchOptions: { slowMo: DEMO ? 25 : 0 } });

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
	if (DEMO) {
		// Playwright's synthetic mouse is invisible in a headed window, so draw one.
		await page.addInitScript(() => {
			window.addEventListener('DOMContentLoaded', () => {
				const dot = document.createElement('div');
				dot.style.cssText =
					'position:fixed;left:-50px;top:-50px;width:16px;height:16px;margin:-8px 0 0 -8px;' +
					'border-radius:50%;border:3px solid #e11;background:#fff;z-index:2147483647;pointer-events:none';
				document.body.append(dot);
				const follow = (event) => {
					dot.style.left = `${event.clientX}px`;
					dot.style.top = `${event.clientY}px`;
					dot.style.background = event.buttons ? '#e11' : '#fff';
				};
				for (const type of ['mousemove', 'mousedown', 'mouseup']) {
					window.addEventListener(type, follow, true);
				}
			});
		});
	}
	await page.goto('/content/timeline', { waitUntil: 'domcontentloaded' });
	await page.waitForSelector('.timeline svg g.axis g.tick');
});

test.afterEach(async ({ page }) => {
	if (DEMO) {
		await page.waitForTimeout(DEMO_PAUSE_MS * 2);
	}
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

// Shows a status banner and, optionally, a vertical marker at trackedClientX.
// Green means the check passed, red means it failed. In demo mode it also pauses so it can be read.
async function showCheckpoint(page, { label, ok, trackedClientX = null, box }) {
	await page.evaluate(
		({ label, ok, trackedClientX, top, height }) => {
			const ensure = (id, css) => {
				let element = document.getElementById(id);
				if (!element) {
					element = document.createElement('div');
					element.id = id;
					element.style.cssText = css;
					document.body.append(element);
				}
				return element;
			};
			const color = ok ? '#1a7f37' : '#c62828';
			const banner = ensure(
				'e2e-banner',
				'position:fixed;left:12px;top:12px;z-index:2147483645;padding:8px 12px;border-radius:6px;' +
					'font:600 15px/1.3 system-ui,sans-serif;color:#fff;pointer-events:none;max-width:80vw'
			);
			banner.textContent = label;
			banner.style.background = color;
			const marker = ensure(
				'e2e-marker',
				'position:fixed;width:3px;margin-left:-1px;z-index:2147483644;pointer-events:none'
			);
			marker.style.display = trackedClientX === null ? 'none' : 'block';
			marker.style.left = `${trackedClientX}px`;
			marker.style.top = `${top}px`;
			marker.style.height = `${height}px`;
			marker.style.background = color;
		},
		{ label, ok, trackedClientX, top: box.top, height: box.height }
	);
	if (DEMO) {
		await page.waitForTimeout(DEMO_PAUSE_MS);
	}
}

// The green/red marker shows where the tracked year really is. It must sit under the pointer.
async function expectYearUnderPointer(page, year, pointerX, what) {
	const view = await readView(page);
	const offBy = view.xOf(year) - pointerX;
	const ok = Math.abs(offBy) <= PAN_TOLERANCE_PX;
	const yearText = Math.round(year).toLocaleString('de-DE');
	await showCheckpoint(page, {
		label: ok
			? `${what}: year ${yearText} is under the pointer`
			: `${what}: year ${yearText} is ${Math.round(offBy)} px away from the pointer`,
		ok,
		trackedClientX: view.box.left + view.xOf(year),
		box: view.box
	});
	expect
		.soft(Math.abs(offBy), `${what}: year ${yearText} should stay under the pointer`)
		.toBeLessThanOrEqual(PAN_TOLERANCE_PX);
	return view;
}

// The blue cursor line is drawn by the timeline itself and must follow the pointer.
async function expectCursorUnderPointer(page, pointerX, what) {
	const box = (await readAxisOnce(page)).box;
	const cursorX = await page.evaluate(() => {
		const line = document.querySelector('.timeline svg line.cursor-line');
		return line ? Number(line.getAttribute('x1')) : null;
	});
	const offBy = cursorX === null ? Infinity : cursorX - pointerX;
	const ok = Math.abs(offBy) <= PAN_TOLERANCE_PX;
	await showCheckpoint(page, {
		label: ok
			? `${what}: the blue line is under the pointer`
			: `${what}: the blue line is ${Math.round(offBy)} px away from the pointer`,
		ok,
		box
	});
	expect
		.soft(Math.abs(offBy), `${what}: the blue cursor line should be under the pointer`)
		.toBeLessThanOrEqual(PAN_TOLERANCE_PX);
}

// Pointer positions are x coordinates relative to the left edge of the timeline.
const EDGE_MARGIN = 6;

function xAtFraction(view, fraction) {
	const x = view.box.width * fraction;
	return Math.min(Math.max(x, EDGE_MARGIN), view.box.width - EDGE_MARGIN);
}

async function movePointer(page, view, x) {
	await page.mouse.move(view.box.left + x, view.box.top + view.box.height * 0.4, { steps: 15 });
}

// Grabs the year under fromX, drags to toX and checks after every quarter that the year followed.
async function dragAndTrackYear(page, view, fromX, toX) {
	const grabbedYear = view.yearAt(fromX);
	await movePointer(page, view, fromX);
	await page.mouse.down();
	for (const fraction of [0.25, 0.5, 0.75, 1]) {
		const pointerX = fromX + (toX - fromX) * fraction;
		await movePointer(page, view, pointerX);
		await expectYearUnderPointer(
			page,
			grabbedYear,
			pointerX,
			`dragged ${fraction * 100}% of the way`
		);
	}
	await page.mouse.up();
	await expectYearUnderPointer(page, grabbedYear, toX, 'after releasing the button');
}

// Scrolls the wheel one notch at a time and checks after every notch that the anchor year stayed put.
async function zoomAndTrackYear(page, view, pointerX, deltaY, label, notches = 6) {
	const anchoredYear = view.yearAt(pointerX);
	await movePointer(page, view, pointerX);
	for (let notch = 1; notch <= notches; notch++) {
		await page.mouse.wheel(0, deltaY);
		await expectYearUnderPointer(page, anchoredYear, pointerX, `${label}, scroll step ${notch}`);
	}
}

test.describe('user-reported scenarios', () => {
	test.describe('blue cursor line', () => {
		test('follows the pointer while hovering', async ({ page }) => {
			const view = await readView(page);
			for (const fraction of [0.2, 0.5, 0.8]) {
				const x = xAtFraction(view, fraction);
				await movePointer(page, view, x);
				await expectCursorUnderPointer(page, x, `hovering at ${fraction * 100}%`);
			}
		});

		test('does not jump when the mouse button is pressed', async ({ page }) => {
			const view = await readView(page);
			const x = xAtFraction(view, 0.4);
			await movePointer(page, view, x);
			await page.mouse.down();
			await expectCursorUnderPointer(page, x, 'button pressed');
			await page.mouse.up();
		});

		for (const [direction, sign] of [
			['right', 1],
			['left', -1]
		]) {
			test(`does not jump when a drag to the ${direction} starts and keeps following it`, async ({
				page
			}) => {
				const view = await readView(page);
				const startX = xAtFraction(view, 0.5);
				await movePointer(page, view, startX);
				await page.mouse.down();
				for (const dragged of [5, 20, 60, 100]) {
					const x = startX + sign * dragged;
					await movePointer(page, view, x);
					await expectCursorUnderPointer(page, x, `dragged ${dragged} px to the ${direction}`);
				}
				await page.mouse.up();
			});
		}
	});

	test.describe('panning', () => {
		test('to the right, from the left edge to the right edge', async ({ page }) => {
			const view = await readView(page);
			await dragAndTrackYear(page, view, xAtFraction(view, 0), xAtFraction(view, 1));
		});

		test('to the left, from the right edge to the left edge', async ({ page }) => {
			const view = await readView(page);
			await dragAndTrackYear(page, view, xAtFraction(view, 1), xAtFraction(view, 0));
		});

		test('a short way to the right, starting in the center', async ({ page }) => {
			const view = await readView(page);
			const center = xAtFraction(view, 0.5);
			await dragAndTrackYear(page, view, center, center + 150);
		});

		test('a short way to the left, starting in the center', async ({ page }) => {
			const view = await readView(page);
			const center = xAtFraction(view, 0.5);
			await dragAndTrackYear(page, view, center, center - 150);
		});
	});

	test.describe('zooming', () => {
		for (const [direction, deltaY] of [
			['out', WHEEL_NOTCH],
			['in', -WHEEL_NOTCH]
		]) {
			for (const [where, fraction] of [
				['at the left edge', 0],
				['in the center', 0.5],
				['three quarters to the right', 0.75],
				['at the right edge', 1]
			]) {
				test(`${direction} ${where} stays anchored at the pointer`, async ({ page }) => {
					const view = await readView(page);
					await zoomAndTrackYear(
						page,
						view,
						xAtFraction(view, fraction),
						deltaY,
						`zoom ${direction}`
					);
				});
			}
		}

		test('out and then back in returns to the same view', async ({ page }) => {
			const start = await readView(page);
			const x = xAtFraction(start, 0.75);
			await zoomAndTrackYear(page, start, x, WHEEL_NOTCH, 'zoom out');
			await zoomAndTrackYear(page, start, x, -WHEEL_NOTCH, 'zoom in');

			const end = await readView(page);
			expect
				.soft(end.pixelsPerYear / start.pixelsPerYear, 'the scale should be restored')
				.toBeCloseTo(1, 1);
		});
	});
});

test('clicking an event selects it even though the cursor line follows the pointer', async ({
	page
}) => {
	const target = await page.evaluate(() => {
		const svg = document.querySelector('.timeline svg').getBoundingClientRect();
		for (const label of document.querySelectorAll('.timeline text.event-label')) {
			const box = label.getBoundingClientRect();
			const insideView =
				box.left > svg.left + 10 &&
				box.right < svg.right - 10 &&
				box.top > svg.top &&
				box.bottom < svg.bottom;
			if (box.width > 20 && insideView) {
				return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
			}
		}
		return null;
	});
	expect(target, 'the default view should show at least one event').not.toBeNull();

	await page.mouse.click(target.x, target.y);

	await expect(page.locator('#event-title')).toBeVisible({ timeout: 2000 });
});
