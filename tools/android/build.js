#!/usr/bin/env node
/* Builds the Android app: dist/AptitudeHub.apk.
   The site (pages, assets, data) is copied into the APK, so the app runs with no internet. Google Fonts links are swapped for the
   bundled fonts in tools/android/fonts. No Gradle: aapt2 + javac + d8 + zipalign + apksigner straight from the Android SDK.

   Needs: Android SDK (ANDROID_HOME, or %LOCALAPPDATA%\Android\Sdk) with build-tools and a platform, and a JDK 11+ (JAVA_HOME,
   or a known install path below). Run from the repo root after the normal site build:
     node tools/android/build.js
   Signing key: ~/.android/aptitude-hub.keystore (made on the first build). Keep it: an update installs over the old app only
   when it is signed with the same key; a new key means uninstalling first, which wipes progress (Export it first). */
const fs = require("fs"), path = require("path"), os = require("os"), cp = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const HERE = __dirname;
const BUILD = path.join(HERE, "build");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "AptitudeHub.apk");
const win = process.platform === "win32";

const die = (m) => { console.error("android build: " + m); process.exit(1); };
const exists = (p) => { try { fs.accessSync(p); return true; } catch (e) { return false; } };
const latest = (dir) => fs.readdirSync(dir).filter((d) => /^[\d.]+$|^android-\d+$/.test(d))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).pop();

// ---- tools
const SDK = [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT, process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Android", "Sdk"),
  path.join(os.homedir(), "Library", "Android", "sdk"), path.join(os.homedir(), "Android", "Sdk")].filter(Boolean).find(exists);
if (!SDK) die("Android SDK not found (set ANDROID_HOME)");
const BT = path.join(SDK, "build-tools", latest(path.join(SDK, "build-tools")) || die("no build-tools in the SDK"));
const PLATFORM = latest(path.join(SDK, "platforms")) || die("no platform in the SDK");
const ANDROID_JAR = path.join(SDK, "platforms", PLATFORM, "android.jar");
const javaOk = (home) => home && exists(path.join(home, "bin", win ? "javac.exe" : "javac"))
  && /version "(1[1-9]|[2-9]\d)/.test(cp.spawnSync(path.join(home, "bin", "java"), ["-version"], { encoding: "utf8" }).stderr || "");
const JAVA_HOME = [process.env.JAVA_HOME, "C:\\Program Files\\Android\\Android Studio\\jbr",
  "C:\\Program Files\\Tableau\\Tableau Public 2025.1\\bin\\jre",
  "/Applications/Android Studio.app/Contents/jbr/Contents/Home"].find(javaOk) || die("need a JDK 11+ (set JAVA_HOME)");
const exe = (dir, name) => path.join(dir, win ? name + (name === "d8" || name === "apksigner" ? ".bat" : ".exe") : name);
const env = { ...process.env, JAVA_HOME, PATH: path.join(JAVA_HOME, "bin") + path.delimiter + process.env.PATH };
const run = (cmd, args, opts = {}) => {
  const bat = win && /\.bat$/.test(cmd);                            // .bat needs a shell; quote every argument for it
  const r = bat ? cp.spawnSync(`"${cmd}" ${args.map((a) => `"${a}"`).join(" ")}`, { stdio: "inherit", env, shell: true, ...opts })
    : cp.spawnSync(cmd, args, { stdio: "inherit", env, ...opts });
  if (r.status !== 0) die(path.basename(cmd) + " failed");
};
const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const copy = (from, to) => fs.cpSync(from, to, { recursive: true });

// ---- version: one more than the commit count, so every new build installs over the last
const git = (a) => { try { return cp.execSync("git " + a, { cwd: ROOT, encoding: "utf8" }).trim(); } catch (e) { return ""; } };
const versionCode = (parseInt(git("rev-list --count HEAD"), 10) || 1) + 1;
const d = new Date();
const versionName = `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;

// ---- 1. site files -> build/assets/site
rm(BUILD); fs.mkdirSync(BUILD, { recursive: true });
const SITE = path.join(BUILD, "assets", "site");
fs.mkdirSync(SITE, { recursive: true });
copy(path.join(ROOT, "assets"), path.join(SITE, "assets"));
copy(path.join(ROOT, "data"), path.join(SITE, "data"));
copy(path.join(HERE, "fonts"), path.join(SITE, "assets", "fonts"));
let pages = 0;
for (const f of fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  let html = fs.readFileSync(path.join(ROOT, f), "utf8");
  html = html.replace(/[ \t]*<link rel="preconnect" href="https:\/\/fonts\.[^"]+"[^>]*>\r?\n?/g, "")
    .replace(/<noscript>\s*<link[^>]*fonts\.googleapis[^>]*>\s*<\/noscript>\r?\n?/g, "")
    .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '<link rel="stylesheet" href="assets/fonts/fonts.css">');
  if (/fonts\.googleapis/.test(html)) die(f + " still links Google Fonts (pattern changed?)");
  fs.writeFileSync(path.join(SITE, f), html);
  pages++;
}
if (!exists(path.join(SITE, "index.html"))) die("index.html missing: build the site first");

// ---- 2. resources: styles from tools/android/res + launcher icons from assets/icons
const RES = path.join(BUILD, "res");
copy(path.join(HERE, "res"), RES);
const icons = path.join(ROOT, "assets", "icons");
fs.mkdirSync(path.join(RES, "mipmap-xxxhdpi"), { recursive: true });
fs.copyFileSync(path.join(icons, "icon-192.png"), path.join(RES, "mipmap-xxxhdpi", "ic_launcher.png"));
fs.copyFileSync(path.join(icons, "icon-maskable-512.png"), path.join(RES, "mipmap-xxxhdpi", "ic_launcher_full.png"));
fs.mkdirSync(path.join(RES, "mipmap-anydpi-v26"), { recursive: true });
fs.writeFileSync(path.join(RES, "mipmap-anydpi-v26", "ic_launcher.xml"),
  '<?xml version="1.0" encoding="utf-8"?>\n<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
  '  <background android:drawable="@mipmap/ic_launcher_full" />\n  <foreground android:drawable="@android:color/transparent" />\n</adaptive-icon>\n');

// ---- 3. aapt2: compile + link (manifest, resources) -> base.apk + R.java. Site files are added in step 5: "aapt2 link -A" stores
//      Windows paths with backslashes, which Android cannot find.
const resZip = path.join(BUILD, "res.zip"), base = path.join(BUILD, "base.apk"), gen = path.join(BUILD, "gen");
run(exe(BT, "aapt2"), ["compile", "--dir", RES, "-o", resZip]);
run(exe(BT, "aapt2"), ["link", "-o", base, "-I", ANDROID_JAR, "--manifest", path.join(HERE, "AndroidManifest.xml"),
  "--java", gen, "--version-code", String(versionCode), "--version-name", versionName,
  "--min-sdk-version", "24", "--target-sdk-version", "35", resZip]);

// ---- 4. javac + d8 -> classes.dex
const classes = path.join(BUILD, "classes");
const sources = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else if (p.endsWith(".java")) sources.push(p);
});
walk(path.join(HERE, "src")); walk(gen);
run(path.join(JAVA_HOME, "bin", "javac"), ["-nowarn", "-Xlint:-options", "-source", "8", "-target", "8", "-encoding", "UTF-8",
  "-bootclasspath", ANDROID_JAR, "-d", classes, ...sources]);
const classFiles = [];
const walkC = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name); if (e.isDirectory()) walkC(p); else if (p.endsWith(".class")) classFiles.push(p);
});
walkC(classes);
run(exe(BT, "d8"), ["--release", "--min-api", "24", "--lib", ANDROID_JAR, "--output", BUILD, ...classFiles]);

// ---- 5. add classes.dex, align, sign
const assetFiles = [];
const walkA = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name); if (e.isDirectory()) walkA(p); else assetFiles.push(path.relative(BUILD, p).split(path.sep).join("/"));
});
walkA(path.join(BUILD, "assets"));
for (let i = 0; i < assetFiles.length; i += 200)                     // batches keep the command line short
  run(exe(BT, "aapt"), ["add", base, ...assetFiles.slice(i, i + 200)], { cwd: BUILD, stdio: ["ignore", "ignore", "inherit"] });
run(exe(BT, "aapt"), ["add", base, "classes.dex"], { cwd: BUILD, stdio: ["ignore", "ignore", "inherit"] });
const aligned = path.join(BUILD, "aligned.apk");
run(exe(BT, "zipalign"), ["-p", "-f", "4", base, aligned]);
const KS = process.env.APT_KEYSTORE || path.join(os.homedir(), ".android", "aptitude-hub.keystore");
const PASS = process.env.APT_KEYSTORE_PASS || "aptitude-hub";
if (!exists(KS)) {
  fs.mkdirSync(path.dirname(KS), { recursive: true });
  run(path.join(JAVA_HOME, "bin", "keytool"), ["-genkeypair", "-keystore", KS, "-alias", "aptitude", "-keyalg", "RSA", "-keysize", "2048",
    "-validity", "10000", "-dname", "CN=Aptitude Hub", "-storepass", PASS, "-keypass", PASS]);
  console.log("android build: new signing key at " + KS + " (keep it for future updates)");
}
fs.mkdirSync(DIST, { recursive: true });
run(exe(BT, "apksigner"), ["sign", "--ks", KS, "--ks-pass", "pass:" + PASS, "--ks-key-alias", "aptitude", "--out", OUT, aligned]);
rm(OUT + ".idsig");

const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
console.log(`android build: ${path.relative(ROOT, OUT)} (${mb} MB, ${pages} pages, version ${versionName} / ${versionCode})`);
