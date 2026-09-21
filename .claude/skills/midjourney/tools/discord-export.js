// Browser console script (Firefox, Discord web) that reads a forum channel's posts and saves them as JSON parts.
// It only reads what the page already shows and scrolls like a person. It sends no request of its own.
// 1. Open the forum channel, show the post list. Paste this script into the console (type 'allow pasting' first if asked).
// 2. Run:  __mjRun('name', [[listPosition, 'threadId'], ...])   -- sorted by list position; ids come from discord-index.js.
// 3. Stop early with:  window.__mjStop = true    Files land in the Downloads folder as mj-faq-<name>-partN.json.
// Copy the parts into <archive>/raw/discord/ and run build-archive.mjs.
window.__mjRun = (() => {
	const run = async (BATCH_NAME, BATCH) => {
		const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
		const wait = (min, max) => sleep(min + Math.random() * (max - min));
		const log = (...a) => (console.info || console.log).call(console, '[mj-faq]', ...a);
		const poll = async (fn, timeout, every = 300) => {
			const t = Date.now();
			while (Date.now() - t < timeout) {
				const v = fn();
				if (v) return v;
				await sleep(every);
			}
			return null;
		};
		const blocked = () =>
			document.querySelector('[aria-modal="true"], iframe[src*="captcha"], [class*="captcha" i]');
		const scrollable = (e) =>
			e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY);
		const scrollerOf = (e) => {
			while (e && !scrollable(e)) e = e.parentElement;
			return e;
		};
		const base = (u) => {
			try {
				const x = new URL(u, location.href);
				return (x.origin + x.pathname).slice(0, 300);
			} catch (e) {
				return String(u).slice(0, 200);
			}
		};

		// --- reader begin
		const nodeText = (n) => {
			if (n.nodeType === 3) return n.textContent;
			if (n.nodeType !== 1) return '';
			const tag = n.tagName;
			if (tag === 'BR') return '\n';
			if (tag === 'IMG') return n.getAttribute('alt') || '';
			if (tag === 'TIME') {
				const t = n.textContent.trim();
				return /^\(.*\)$/.test(t) ? '' : t;
			}
			if (tag === 'PRE') return '\n```\n' + n.textContent.replace(/\n$/, '') + '\n```\n';
			if (tag === 'CODE') return '`' + n.textContent + '`';
			const inner = () => Array.from(n.childNodes, (c) => nodeText(c)).join('');
			if (tag === 'A') {
				const t = inner().trim();
				const h = n.getAttribute('href') || '';
				return t && h && t !== h && !h.startsWith('#') ? '[' + t + '](' + h + ')' : t || h;
			}
			if (/^H[1-3]$/.test(tag))
				return '\n' + '#'.repeat(Number(tag[1])) + ' ' + inner().trim() + '\n';
			if (tag === 'LI') return '\n- ' + inner().trim();
			if (tag === 'BLOCKQUOTE')
				return (
					'\n' +
					inner()
						.trim()
						.split('\n')
						.map((l) => '> ' + l)
						.join('\n') +
					'\n'
				);
			if (tag === 'DIV' || tag === 'P' || tag === 'UL' || tag === 'OL') return inner() + '\n';
			return inner();
		};

		const clean = (s) =>
			s
				.replace(/[ \t]+\n/g, '\n')
				.replace(/\n{3,}/g, '\n\n')
				.trim();
		const uniq = (arr, key) => {
			const seen = new Set();
			return arr.filter((x) => {
				const k = key(x);
				if (seen.has(k)) return false;
				seen.add(k);
				return true;
			});
		};

		const readMessage = (li, mid) => {
			const contents = [...li.querySelectorAll('[id^="message-content-"]')].filter(
				(e) => !e.closest('[id^="message-reply-context-"]')
			);
			const text = contents.length ? clean(nodeText(contents[0])) : '';
			const extra = contents
				.slice(1)
				.map((e) => clean(nodeText(e)))
				.filter((t) => t && t !== text);
			const edited =
				contents.length > 0 &&
				[...contents[0].querySelectorAll('time')].some((t) =>
					/^\(.*\)$/.test(t.textContent.trim())
				);
			const acc = li.querySelector('[id^="message-accessories-"]');
			const images = acc
				? uniq(
						[...acc.querySelectorAll('img')]
							.filter(
								(im) =>
									!/^data:/.test(im.src) &&
									!im.closest('article') &&
									!/emoji/i.test(im.className) &&
									!/\/emojis?\//.test(im.src)
							)
							.map((im) => ({ name: base(im.src), alt: im.alt || '' })),
						(x) => x.name
					)
				: [];
			const videos = acc
				? uniq(
						[...acc.querySelectorAll('video, video source')].map((v) => ({
							name: base(v.currentSrc || v.src || '')
						})),
						(x) => x.name
					)
				: [];
			const files = acc
				? uniq(
						[...acc.querySelectorAll('a[href*="/attachments/"]')]
							.filter((a) => !/\.(png|jpe?g|gif|webp|avif|bmp)$/i.test(base(a.href)))
							.map((a) => ({
								name: base(a.href),
								label: a.innerText.trim().slice(0, 120)
							})),
						(x) => x.name
					)
				: [];
			const embeds = acc
				? [...acc.querySelectorAll('article')].map((a) => ({
						text: clean(a.innerText).slice(0, 1500),
						links: uniq(
							[...a.querySelectorAll('a[href]')].map((l) => l.href),
							(x) => x
						).slice(0, 10)
					}))
				: [];
			const stickers = acc
				? [...acc.querySelectorAll('[class*="sticker" i] img')].map((s) => s.alt || base(s.src))
				: [];
			const msg = {
				id: mid,
				time: li.querySelector('time[datetime]')?.getAttribute('datetime') || null,
				author:
					li.querySelector('[id^="message-username-"]')?.innerText.trim().split('\n')[0].trim() ||
					null,
				header:
					(li.querySelector('h3')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160) ||
					null,
				replyTo:
					li
						.querySelector('[id^="message-reply-context-"]')
						?.innerText.replace(/\s+/g, ' ')
						.trim()
						.slice(0, 200) || null,
				text
			};
			if (extra.length) msg.extraTexts = extra;
			if (edited) msg.edited = true;
			if (images.length) msg.images = images;
			if (videos.length) msg.videos = videos;
			if (files.length) msg.files = files;
			if (embeds.length) msg.embeds = embeds;
			if (stickers.length) msg.stickers = stickers;
			if (
				!text &&
				!images.length &&
				!videos.length &&
				!files.length &&
				!embeds.length &&
				!stickers.length
			) {
				msg.raw = li.innerText.replace(/\s+/g, ' ').trim().slice(0, 1500);
				msg.html = (acc || li).outerHTML.slice(0, 3000);
			}
			return msg;
		};
		const score = (m) =>
			(m.text || '').length +
			100 *
				((m.images || []).length +
					(m.videos || []).length +
					(m.files || []).length +
					(m.embeds || []).length) +
			(m.raw ? 1 : 0) +
			(m.author ? 1 : 0);
		// --- reader end

		const findList = () => document.querySelector('[data-list-id^="forum-channel-list-"]');
		const list = findList();
		if (!list) return 'Stop: forum list not found.';
		const listSc = scrollerOf(list);
		if (!listSc) return 'Stop: list scroll area not found.';
		const wrapperFor = (id) => findList()?.querySelector('[data-list-item-id$="___' + id + '"]');

		const titleOf = (label) => label.replace(/^Post\s+/, '').replace(/,\s*\d+\s+Nachrichten?$/, '');
		const expectedOf = (label) => {
			const m = /,\s*(\d+)\s+Nachrichten?$/.exec(label);
			return m ? Number(m[1]) : null;
		};
		const isOpen = (id) => location.pathname.endsWith('/threads/' + id);
		const waitOnline = async (max = 5 * 60 * 1000) => {
			if (navigator.onLine) return true;
			log('Offline, waiting for the connection...');
			const ok = await poll(() => navigator.onLine, max, 2000);
			if (ok) await wait(5000, 10000);
			return !!ok;
		};

		// The batch is sorted by list position, so the list only needs to move downward.
		const seek = async (id) => {
			let stale = 0;
			for (let i = 0; i < 80 && !window.__mjStop; i++) {
				const w = wrapperFor(id);
				if (w) return w;
				listSc.scrollBy({
					top: Math.round(listSc.clientHeight * (0.6 + Math.random() * 0.3)),
					behavior: 'smooth'
				});
				await wait(1000, 2000);
				const atEnd = listSc.scrollTop + listSc.clientHeight >= listSc.scrollHeight - 5;
				if (atEnd && !wrapperFor(id)) {
					if (++stale >= 2) break;
					await wait(3000, 5000);
				} else {
					stale = 0;
				}
			}
			return wrapperFor(id);
		};

		const openPost = async (id) => {
			const w = await seek(id);
			if (!w) return { ok: false, reason: 'card not found in list' };
			const label = w.getAttribute('aria-label') || '';
			if (isOpen(id)) return { ok: true, label };
			w.click();
			let opened = await poll(() => isOpen(id), 10000);
			if (!opened) {
				const needle = titleOf(label)
					.replace(/^[^\p{L}\p{N}]+/u, '')
					.slice(0, 25);
				const hits = needle
					? [...(findList()?.querySelectorAll('*') || [])].filter(
							(e) => e.children.length === 0 && e.textContent.includes(needle)
						)
					: [];
				if (hits.length !== 1)
					return {
						ok: false,
						reason: 'click on card did not open the post (' + hits.length + ' fallback hits)',
						label
					};
				hits[0].click();
				opened = await poll(() => isOpen(id), 10000);
			}
			if (!opened) return { ok: false, reason: 'post did not open', label };
			return { ok: true, label };
		};

		const readPost = async (id, label) => {
			const expected = expectedOf(label);
			const msgs = new Map();
			const foreign = [];
			const collect = () => {
				for (const li of document.querySelectorAll('li[id^="chat-messages-"]')) {
					const m = /^chat-messages-(\d+)-(\d+)$/.exec(li.id);
					if (!m) continue;
					if (m[1] !== id) {
						if (foreign.length < 3) foreign.push(li.id.replace(/\d{6,}/g, '#'));
						continue;
					}
					const cur = readMessage(li, m[2]);
					const old = msgs.get(m[2]);
					if (!old || score(cur) > score(old)) msgs.set(m[2], cur);
				}
			};
			const chatScroller = () => {
				const c = document.querySelector('[data-list-id="chat-messages"]');
				return c && scrollerOf(c);
			};

			const loaded = () => {
				collect();
				return msgs.size > 0;
			};
			let ready = await poll(loaded, 45000);
			if (!ready) {
				log('Panel empty, waiting for the connection...');
				await waitOnline();
				ready = await poll(loaded, 45000);
			}
			if (!ready) return { ok: false, reason: 'no messages of this post found', foreign };
			await wait(1000, 2000);
			collect();

			const edge = async (dir) => {
				let stale = 0;
				for (let i = 0; i < 25 && stale < 2 && !window.__mjStop; i++) {
					const s = chatScroller();
					if (!s) return;
					const before = msgs.size;
					s.scrollTo({ top: dir < 0 ? 0 : s.scrollHeight, behavior: 'smooth' });
					await wait(1800, 3200);
					collect();
					const atEdge =
						dir < 0 ? s.scrollTop <= 2 : s.scrollTop + s.clientHeight >= s.scrollHeight - 5;
					if (msgs.size === before && atEdge) stale++;
					else stale = 0;
				}
			};
			const stepPass = async () => {
				let s = chatScroller();
				if (!s) return;
				s.scrollTo({ top: 0, behavior: 'smooth' });
				await wait(1500, 2500);
				for (let i = 0; i < 120 && !window.__mjStop; i++) {
					collect();
					s = chatScroller();
					if (!s || s.scrollTop + s.clientHeight >= s.scrollHeight - 5) break;
					s.scrollBy({
						top: Math.round(s.clientHeight * (0.6 + Math.random() * 0.25)),
						behavior: 'smooth'
					});
					await wait(1000, 2000);
				}
				collect();
			};

			await edge(-1);
			await edge(1);
			collect();
			if (expected && msgs.size < expected + 1) {
				log('Post incomplete (' + msgs.size + '/' + (expected + 1) + '), retrying once...');
				await waitOnline();
				await wait(10000, 15000);
				await edge(-1);
				await edge(1);
				collect();
			}
			let stepped = false;
			if (expected && msgs.size < expected + 1 && chatScroller()) {
				stepped = true;
				await stepPass();
			}

			const arr = [...msgs.values()].sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
			let last = null;
			for (const m of arr) {
				if (m.author) last = m.author;
				else if (last) {
					m.author = last;
					m.authorInferred = true;
				}
			}
			const flags = [];
			if (
				/\b(moved|deleted|archived|obsolete|outdated|gel\S+scht|verschoben|archiviert)\b/i.test(
					(arr[0]?.text || '').slice(0, 400)
				)
			)
				flags.push('status-word-in-first-message');
			if (expected && arr.length < expected + 1) flags.push('incomplete');
			return {
				ok: true,
				id,
				path: location.pathname,
				expected,
				got: arr.length,
				stepped,
				flags,
				messages: arr
			};
		};

		window.__mjStop = false;
		const results = [];
		const errors = [];
		const pending = [];
		const pendingErrors = [];
		let part = 0;
		window.__mjPosts = results;

		const save = (file, posts, errs) => {
			const data = {
				exportedAt: new Date().toISOString(),
				channel: 'prompt-faqs',
				batch: BATCH_NAME,
				posts,
				errors: errs
			};
			const blob = new Blob([JSON.stringify(data, null, 1)], {
				type: 'application/json'
			});
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = file;
			document.body.appendChild(a);
			a.click();
			a.remove();
		};
		const flush = () => {
			if (!pending.length && !pendingErrors.length) return;
			part++;
			save(
				'mj-faq-' + BATCH_NAME + '-part' + part + '.json',
				pending.splice(0),
				pendingErrors.splice(0)
			);
		};

		const t0 = Date.now();
		listSc.scrollTo({ top: 0, behavior: 'smooth' });
		await wait(2500, 4000);

		let k = 0;
		let failStreak = 0;
		try {
			for (const [order, id] of BATCH) {
				if (window.__mjStop) {
					log('Stopped by user.');
					break;
				}
				if (Date.now() - t0 > 120 * 60 * 1000) {
					log('Stop: time cap.');
					break;
				}
				if (blocked()) {
					log('Stop: dialog or captcha appeared.');
					break;
				}
				if (!(await waitOnline())) {
					log('Stop: connection is gone.');
					break;
				}
				k++;
				let failure = null;
				try {
					const o = await openPost(id);
					if (!o.ok) {
						failure = { order, id, reason: o.reason, label: o.label || null };
					} else {
						const r = await readPost(id, o.label);
						if (!r.ok) {
							failure = {
								order,
								id,
								reason: r.reason,
								foreign: r.foreign,
								label: o.label
							};
						} else {
							r.order = order;
							r.title = titleOf(o.label);
							r.label = o.label;
							results.push(r);
							pending.push(r);
							failStreak = 0;
							log(
								'[' +
									k +
									'/' +
									BATCH.length +
									'] #' +
									order +
									' ' +
									r.title.slice(0, 40) +
									' -> ' +
									r.got +
									'/' +
									r.expected +
									(r.flags.length ? ' ' + r.flags.join(',') : '')
							);
						}
					}
				} catch (e) {
					failure = { order, id, reason: String((e && e.message) || e) };
				}
				if (failure) {
					errors.push(failure);
					pendingErrors.push(failure);
					failStreak++;
					log('Failed #' + order + ': ' + failure.reason + ' (' + failStreak + ' in a row)');
					if (failStreak >= 3) {
						log('Stop: 3 failures in a row.');
						break;
					}
					await wait(8000, 15000);
				}
				if (pending.length >= 20) flush();
				await wait(2500, 5500);
			}
		} finally {
			flush();
		}

		return (
			'Done: ' +
			results.length +
			'/' +
			BATCH.length +
			' posts, ' +
			results.reduce((n, p) => n + p.got, 0) +
			' messages, ' +
			errors.length +
			' error(s). Files: mj-faq-' +
			BATCH_NAME +
			'-part1..' +
			part +
			'.json'
		);
	};
	return async (name, batch) => {
		if (window.__mjRunning) return 'Stop: a run is already active.';
		window.__mjRunning = true;
		try {
			return await run(name, batch);
		} finally {
			window.__mjRunning = false;
		}
	};
})();
