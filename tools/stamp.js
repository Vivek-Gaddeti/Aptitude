/* Version-stamp every local script and stylesheet a page loads: src="assets/common.js?v=3f9a1c2e".
   The stamp is a short fingerprint of the file's content, so when a file changes the browser fetches the new copy
   instead of mixing a cached old file with new ones (which can leave a page blank). Unchanged files keep their stamp.
   It also rewrites sw.js: the offline file list (every page and every stamped URL exactly as the pages reference it, plus the
   manifest and icons) and a cache name with a hash of all of their content ("apt-1a2b3c4d"). The cache name changes only when
   something in that list changed, which is what makes an installed copy replace its old files and drop the old cache.
   Usage:  node tools/stamp.js      (also run automatically by tools/build.js)                                     */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.join(__dirname, "..");
const md5 = (buf) => crypto.createHash("md5").update(buf).digest("hex");
const pages = fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort().map((f) => path.join(root, f));
let changed = 0;
const assets = new Set();                                   // URLs exactly as the pages reference them
for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  const dir = path.dirname(page), html = fs.readFileSync(page, "utf8");
  const out = html.replace(/(src|href)="((?!https?:|\/\/|data:)[^"?#]+\.(?:js|css))(?:\?v=[0-9a-f]*)?"/g, (m, attr, rel) => {
    const file = path.join(dir, rel);
    if (!fs.existsSync(file)) return m;
    const url = `${rel}?v=${md5(fs.readFileSync(file)).slice(0, 8)}`;
    assets.add(url);
    return `${attr}="${url}"`;
  });
  if (out !== html) { fs.writeFileSync(page, out); changed++; }
}
console.log(`version stamps updated in ${changed} of ${pages.length} pages`);

/* ---- sw.js: ASSETS + cache name ---- */
const swFile = path.join(root, "sw.js");
if (fs.existsSync(swFile)) {
  const list = ["./", ...pages.map((p) => path.basename(p)), ...[...assets].sort(), "manifest.webmanifest"];
  const iconDir = path.join(root, "assets", "icons");
  if (fs.existsSync(iconDir)) fs.readdirSync(iconDir).sort().forEach((f) => list.push("assets/icons/" + f));
  const h = crypto.createHash("md5");
  list.forEach((u) => {
    h.update(u + "\n");
    const f = path.join(root, u.split("?")[0]);
    if (u !== "./" && fs.existsSync(f)) h.update(fs.readFileSync(f));
  });
  const name = "apt-" + h.digest("hex").slice(0, 8);
  const sw = fs.readFileSync(swFile, "utf8"), eol = /\r\n/.test(sw) ? "\r\n" : "\n";
  const body = "const ASSETS = [" + eol + list.map((u) => "  " + JSON.stringify(u)).join("," + eol) + eol + "];";
  const next = sw.replace(/const CACHE = "[^"]*";/, `const CACHE = "${name}";`).replace(/const ASSETS = \[[\s\S]*?\];/, () => body);
  if (next !== sw) { fs.writeFileSync(swFile, next); console.log(`sw.js updated: cache ${name}, ${list.length} files precached`); }
  else console.log(`sw.js unchanged (cache ${name}, ${list.length} files)`);
}
