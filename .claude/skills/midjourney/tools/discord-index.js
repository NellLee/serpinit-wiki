// Browser console script (Firefox, Discord web) that lists every post of a forum channel.
// It scrolls the post list down slowly and records each card's thread id and its aria-label ("Post <title>, <n> Nachrichten").
// 1. Filter the forum channel as you like (tags), close any open post, paste this script into the console.
// 2. Do not scroll while it runs. It downloads mj-prompt-faqs-index.json at the end. Stop early with: window.__mjStop = true
// The result decides which posts to export (archived or moved posts are marked in the title) and feeds discord-export.js.
(async () => {
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const wait = (min, max) => sleep(min + Math.random() * (max - min));
	const log = (...a) => (console.info || console.log).call(console, '[mj-index]', ...a);

	const list = document.querySelector('[data-list-id^="forum-channel-list-"]');
	if (!list) return 'Stop: forum list not found. Close any open post first.';
	let sc = list;
	while (
		sc &&
		!(sc.scrollHeight > sc.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(sc).overflowY))
	)
		sc = sc.parentElement;
	if (!sc) return 'Stop: scroll area not found.';

	const cards = new Map();
	const collect = () => {
		for (const el of list.querySelectorAll('[data-list-item-id]')) {
			const key = el.dataset.listItemId;
			if (!key.startsWith('forum-channel-list-') || key.endsWith('___forum-channel-header'))
				continue;
			const label = el.getAttribute('aria-label') || '';
			const old = cards.get(key);
			if (!old) cards.set(key, { id: key.split('___')[1], order: cards.size, label });
			else if (!old.label && label) old.label = label;
		}
	};

	window.__mjStop = false;
	sc.scrollTo({ top: 0, behavior: 'smooth' });
	await wait(3000, 5000);

	const t0 = Date.now();
	let stale = 0;
	let steps = 0;
	collect();
	while (!window.__mjStop && steps < 300 && Date.now() - t0 < 25 * 60 * 1000) {
		if (
			document.querySelector('[aria-modal="true"], iframe[src*="captcha"], [class*="captcha" i]')
		) {
			log('Stop: dialog or captcha appeared.');
			break;
		}
		const before = cards.size;
		const hBefore = sc.scrollHeight;
		sc.scrollBy({
			top: Math.round(sc.clientHeight * (0.6 + Math.random() * 0.3)),
			behavior: 'smooth'
		});
		await wait(2500, 5500);
		collect();
		steps++;
		const atEnd = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 5;
		if (atEnd && sc.scrollHeight === hBefore && cards.size === before) {
			stale++;
			if (stale >= 3) {
				log('End of list reached.');
				break;
			}
			await wait(6000, 10000);
		} else {
			stale = 0;
		}
		if (steps % 10 === 0) log(steps, 'steps,', cards.size, 'posts');
	}
	collect();

	const tags = [
		...new Set(
			[...document.querySelectorAll('[data-list-item-id*="forum-tag-"]')]
				.map((e) => e.getAttribute('aria-label') || e.textContent.trim())
				.filter(Boolean)
		)
	];
	const posts = [...cards.values()];
	const noLabel = posts.filter((p) => !p.label).length;
	const data = {
		exportedAt: new Date().toISOString(),
		tags,
		count: posts.length,
		posts
	};
	const blob = new Blob([JSON.stringify(data, null, 1)], {
		type: 'application/json'
	});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'mj-prompt-faqs-index.json';
	document.body.appendChild(a);
	a.click();
	a.remove();
	return `Done: ${posts.length} posts (${noLabel} without label) in ${steps} steps. File: mj-prompt-faqs-index.json`;
})();
