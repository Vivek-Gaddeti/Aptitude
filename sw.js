/* Aptitude Hub service worker: network first, cache as the offline fallback. Registered by assets/common.js over http(s) only. */
const CACHE = "apt-v1";
const PAGES = ["./", "index.html", "quant.html", "reasoning.html", "verbal.html", "di.html", "practice.html", "mock.html", "revision.html", "formulas.html", "strategy.html"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  // precache what exists; one missing page must not fail the install
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PAGES.map((p) => c.add(p).catch(() => {})))));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  let url;
  try { url = new URL(req.url); } catch (x) { return; }
  const put = (res) => { if (res && res.ok && (res.type === "basic" || res.type === "cors")) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); } return res; };
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(put).catch(() => caches.match(req, { ignoreSearch: false }).then((r) => r || caches.match(req, { ignoreSearch: true })).then((r) => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))));
  } else if (FONT_HOSTS.includes(url.hostname)) {
    // stale-while-revalidate for Google Fonts; everything else cross-origin goes straight to the network
    e.respondWith(caches.match(req).then((hit) => { const net = fetch(req).then(put).catch(() => hit); return hit || net; }));
  }
});
