#!/usr/bin/env node
/* tools/verify.js - safety net for the question bank and generators (see docs/SPEC-stage1.md section 7).
 *
 *   node tools/verify.js                 full run (generators: seeds 1..2000 per difficulty)
 *   node tools/verify.js --quick         generators: seeds 1..200
 *   node tools/verify.js --only <text>   only topics / pattern keys containing <text> (e.g. percentages, successive)
 *   node tools/verify.js --show <id>     print one bank question after evaluation
 *   node tools/verify.js --show <sec/topic/pattern> <seed> [Easy|Medium|Hard]     print a generated question
 *   node tools/verify.js --show g:<key>:<d>:<seed>                                 same, by generated id
 *   node tools/verify.js --root <dir>    use another site root (for testing)
 *   node tools/verify.js --all           also list catalog patterns that have no questions / generator
 * Exit code 1 if there are errors. No dependencies.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---------------------------------------------------------------- args
const argv = process.argv.slice(2);
const opts = { quick: false, only: null, show: null, root: path.resolve(__dirname, '..'), all: false };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--quick') opts.quick = true;
  else if (a === '--all') opts.all = true;
  else if (a === '--only') opts.only = (argv[++i] || '').toLowerCase();
  else if (a === '--root') opts.root = path.resolve(argv[++i] || '.');
  else if (a === '--show') {
    opts.show = [];
    while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) opts.show.push(argv[++i]);
    if (!opts.show.length) { console.error('--show needs an id (or a generator key and seed)'); process.exit(2); }
  } else if (a === '-h' || a === '--help') {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 14).join('\n'));
    process.exit(0);
  } else { console.error('Unknown argument: ' + a); process.exit(2); }
}
const ROOT = opts.root;
const SEEDS = opts.quick ? 200 : 2000;
const DIFFS = ['Easy', 'Medium', 'Hard'];

// ---------------------------------------------------------------- bookkeeping
const errors = [];   // { file, id, key, msg }
const warnings = []; // { file, id, key, msg }
const notes = [];    // plain info lines
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const addErr = (file, id, key, msg) => errors.push({ file, id, key, msg });
const addWarn = (file, id, key, msg) => warnings.push({ file, id, key, msg });

// ---------------------------------------------------------------- vm context
const ctx = vm.createContext({ console });
vm.runInContext('var window = globalThis; var self = globalThis;', ctx);
const run = (code, filename) => vm.runInContext(code, ctx, { filename });
const get = (expr) => { try { return run(expr, 'verify-get'); } catch (e) { return undefined; } };

function loadFile(abs) {
  const file = rel(abs);
  try {
    run(fs.readFileSync(abs, 'utf8'), abs);
    return true;
  } catch (e) {
    const where = String(e && e.stack || e).split('\n').slice(0, 2).join(' | ');
    addErr(file, '-', null, 'file failed to load: ' + (e && e.message || e) + '   [' + where + ']');
    return false;
  }
}
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (/\.js$/i.test(name)) out.push(p);
  }
  return out.sort((a, b) => (rel(a) < rel(b) ? -1 : 1));
}

// 1. site.js (or a minimal QB registry)
const siteJs = path.join(ROOT, 'assets', 'site.js');
if (fs.existsSync(siteJs)) loadFile(siteJs);
if (!get('typeof QB !== "undefined" && QB && typeof QB.add === "function"')) {
  if (!fs.existsSync(siteJs)) notes.push('assets/site.js missing: using a minimal QB registry from spec section 2.');
  run(`window.QB = window.QB || {}; Object.assign(QB, {
    qs: QB.qs || [], byId: QB.byId || {}, sets: QB.sets || {}, gens: QB.gens || {},
    add(list) { list.forEach((q) => { this.qs.push(q); this.byId[q.id] = q; }); },
    set(id, spec) { this.sets[id] = Object.assign({ id }, spec); },
    gen(key, g) { this.gens[key] = Object.assign({ key }, g); } });`, 'verify-minimal-qb');
}

// 2. qbank.js
const qbankJs = path.join(ROOT, 'assets', 'qbank.js');
let qbankOk = false;
if (fs.existsSync(qbankJs)) qbankOk = loadFile(qbankJs);
else notes.push('assets/qbank.js missing: generators cannot be run (skipped); the bank is still checked.');
const hasMake = qbankOk && get('typeof QB.make === "function"');
if (qbankOk && !hasMake) addErr('assets/qbank.js', '-', null, 'QB.make is not a function after loading qbank.js (spec section 4).');

// 3. catalog.js
let catalogLoaded = false;
const catalogJs = path.join(ROOT, 'data', 'catalog.js');
if (fs.existsSync(catalogJs)) catalogLoaded = loadFile(catalogJs) && get('Array.isArray(window.CATALOG)');
if (!catalogLoaded) addWarn('data/catalog.js', '-', null, 'catalog missing or invalid: sec/topic/pattern checks are SKIPPED.');
const CAT = {};      // sec -> topic -> Set(patterns)
const catPatterns = []; // { key, gen, solver }
if (catalogLoaded) {
  const cat = JSON.parse(run('JSON.stringify(window.CATALOG)', 'verify-cat'));
  for (const s of cat) {
    CAT[s.sec] = {};
    for (const t of s.topics || []) {
      CAT[s.sec][t.id] = new Set();
      for (const p of t.patterns || []) {
        CAT[s.sec][t.id].add(p.id);
        catPatterns.push({ key: `${s.sec}/${t.id}/${p.id}`, gen: !!p.gen, solver: !!p.solver, title: p.title });
      }
    }
  }
}

// 4. data files (wrapping QB.add / QB.set / QB.gen to remember the file and catch duplicates)
const fileOf = new Map();   // question object -> file
const genFile = {};         // gen key -> file
const setFile = {};         // set id -> file
const dataFiles = [];
for (const sub of ['q', 'gen', 'sets']) for (const f of walk(path.join(ROOT, 'data', sub))) dataFiles.push(f);
for (const abs of dataFiles) {
  const file = rel(abs);
  const wrap = vm.runInContext(`(function (file, notify) {
    const o = { add: QB.add, set: QB.set, gen: QB.gen };
    QB.add = function (list) { if (!Array.isArray(list)) throw new Error("QB.add expects an array of questions, got " + typeof list); list.forEach((q) => notify("q", q)); return o.add.apply(this, arguments); };
    QB.set = function (id, spec) { notify("set", id); return o.set.apply(this, arguments); };
    QB.gen = function (key, g) { notify("gen", key); return o.gen.apply(this, arguments); };
    return function restore() { QB.add = o.add; QB.set = o.set; QB.gen = o.gen; };
  })`, ctx);
  const restore = wrap(file, (kind, v) => {
    if (kind === 'q') fileOf.set(v, file);
    else if (kind === 'gen') {
      if (genFile[v]) addErr(file, v, null, `generator key "${v}" defined twice (first in ${genFile[v]}); the second silently replaces the first.`);
      genFile[v] = file;
    } else if (kind === 'set') {
      if (setFile[v]) addErr(file, v, null, `set id "${v}" defined twice (first in ${setFile[v]}).`);
      setFile[v] = file;
    }
  });
  loadFile(abs);
  restore();
}

const QB = vm.runInContext('QB', ctx);
const bank = Array.isArray(QB.qs) ? QB.qs : [];
const sets = QB.sets || {};
const gens = QB.gens || {};

// ---------------------------------------------------------------- helpers for calc / check
const H = {};
for (const n of Object.getOwnPropertyNames(Math)) H[n] = Math[n];
Object.assign(H, {
  gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; },
  lcm(a, b) { return a && b ? Math.abs(a * b) / H.gcd(a, b) : 0; },
  fact(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
  nPr(n, r) { if (r < 0 || r > n) return 0; let x = 1; for (let i = 0; i < r; i++) x *= (n - i); return x; },
  nCr(n, r) { if (r < 0 || r > n) return 0; r = Math.min(r, n - r); let x = 1; for (let i = 1; i <= r; i++) x = x * (n - r + i) / i; return Math.round(x); },
  round(x, n) { n = n || 0; const f = Math.pow(10, n); return Math.round(+(x * f).toPrecision(12)) / f; },
  sqrt: Math.sqrt, pow: Math.pow, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, min: Math.min, max: Math.max,
  PI: Math.PI, log: Math.log, log10: Math.log10, exp: Math.exp,
});
const fnCache = new Map();
function evalExpr(expr, q) {
  let f = fnCache.get(expr);
  if (!f) {
    // eslint-disable-next-line no-new-func
    f = new Function('__h', 'q', 'with (__h) { return (' + expr + '\n); }');
    fnCache.set(expr, f);
  }
  return f(H, q);
}

const VF = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5],
  '⅙': [1, 6], '⅚': [5, 6], '⅐': [1, 7], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8], '⅑': [1, 9], '⅒': [1, 10] };
const VF_RE = new RegExp('(\\d+)?\\s*([' + Object.keys(VF).join('') + '])', 'g');

/** Parse the number shown in an option. -> { value, dec (decimals shown or null for fraction/ratio), approx, many } or { err } */
function parseOpt(text) {
  let s = String(text);
  const approx = /≈|approx|~/i.test(s);
  s = s.replace(/[−–‒]/g, '-');
  s = s.replace(VF_RE, (m, w, f) => ` ${w ? w + ' ' : ''}${VF[f][0]}/${VF[f][1]} `);
  s = s.replace(/(\d),(?=\d)/g, '$1');
  s = s.replace(/[A-Za-z]+\/[A-Za-z]+/g, ' ');        // km/h, m/s
  if (/\d\s*:\s*\d+\s*:\s*\d/.test(s)) return { err: 'three-part ratio cannot be turned into one number' };
  const nums = (s.match(/\d+(?:\.\d+)?/g) || []).length;
  let m;
  if ((m = s.match(/(-?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)/))) {            // mixed fraction  a b/c
    if (+m[4] === 0) return { err: 'zero denominator' };
    const v = (+m[2]) + (+m[3]) / (+m[4]);
    return { value: m[1] ? -v : v, dec: null, approx, many: nums > 3 };
  }
  if ((m = s.match(/(-?\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)/))) {   // a/b or ratio a : b
    if (+m[2] === 0) return { err: 'zero denominator' };
    return { value: +m[1] / +m[2], dec: null, approx, many: nums > 2 };
  }
  if ((m = s.match(/(?<![\d.])(-?)\s*(\d+(?:\.\d+)?|\.\d+)/))) {
    const t = m[2];
    const dec = t.includes('.') ? t.split('.')[1].length : 0;
    return { value: (m[1] ? -1 : 1) * parseFloat(t), dec, approx, many: nums > 1 };
  }
  return { err: 'no number found' };
}
function tolFor(p, calc) {
  const rel9 = 1e-9 * Math.abs(calc) + 1e-12;
  if (p.dec === null) return rel9;
  if (p.dec > 0) return 0.5 * Math.pow(10, -p.dec) + rel9;
  if (p.approx && Math.abs(calc - Math.round(calc)) > 1e-9) return 0.5 + rel9;
  return rel9;
}
const fnum = (x) => String(Number(Number(x).toPrecision(12)));
const short = (s, n = 70) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const jstr = (x) => JSON.stringify(x);

// ---------------------------------------------------------------- question validation
const ALLOWED = new Set(['id', 'sec', 'topic', 'pattern', 'd', 'q', 'opts', 'ans', 'time', 'sol', 'short', 'trap', 'why', 'calc', 'check', 'set']);
const BAD_TEXT = /\bNaN\b|\bundefined\b|\bInfinity\b|\[object |\bnull\b(?!\s*[,.)])/;

/** Returns { E: [msg], W: [msg], info } for one question object. gen=true -> calc is required. */
function validateQ(q, o) {
  o = o || {};
  const E = [], W = [];
  const info = { calc: undefined, parsed: null, checkValue: undefined };
  if (!q || typeof q !== 'object' || Array.isArray(q)) return { E: ['question is not an object: ' + short(jstr(q))], W, info };

  // identity & catalog
  if (typeof q.id !== 'string' || !q.id.trim()) E.push('id: missing or not a non-empty string');
  if (typeof q.sec !== 'string' || !q.sec) E.push('sec: missing');
  if (typeof q.topic !== 'string' || !q.topic) E.push('topic: missing');
  if (typeof q.pattern !== 'string' || !q.pattern) E.push('pattern: missing');
  if (catalogLoaded && q.sec && q.topic && q.pattern) {
    if (!CAT[q.sec]) E.push(`sec: "${q.sec}" is not in CATALOG (known: ${Object.keys(CAT).join(', ')})`);
    else if (!CAT[q.sec][q.topic]) E.push(`topic: "${q.topic}" is not a topic of sec "${q.sec}" in CATALOG (known: ${Object.keys(CAT[q.sec]).join(', ')})`);
    else if (!CAT[q.sec][q.topic].has(q.pattern)) E.push(`pattern: "${q.pattern}" is not a pattern of ${q.sec}/${q.topic} in CATALOG (known: ${[...CAT[q.sec][q.topic]].join(', ')})`);
  }
  if (!DIFFS.includes(q.d)) E.push(`d: ${jstr(q.d)} must be one of "Easy", "Medium", "Hard"`);

  // text fields
  if (typeof q.q !== 'string' || !q.q.trim()) E.push('q: missing or empty question text');

  // options
  let optsOk = false;
  if (!Array.isArray(q.opts)) E.push('opts: must be an array of exactly 4 strings, got ' + typeof q.opts);
  else if (q.opts.length !== 4) E.push(`opts: must have exactly 4 options, has ${q.opts.length}`);
  else if (q.opts.some((x) => typeof x !== 'string' || !x.trim())) E.push('opts: every option must be a non-empty string: ' + short(jstr(q.opts), 120));
  else {
    optsOk = true;
    const seen = new Map();
    q.opts.forEach((x, i) => {
      const k = x.trim().toLowerCase();
      if (seen.has(k)) E.push(`opts: options ${seen.get(k)} and ${i} are the same text ${jstr(x.trim())} (compared trimmed, case-insensitive)`);
      else seen.set(k, i);
    });
  }
  const ansOk = Number.isInteger(q.ans) && q.ans >= 0 && q.ans <= 3;
  if (!ansOk) E.push(`ans: must be an integer 0-3 (index of the correct option), got ${jstr(q.ans)}`);

  // why
  if (q.why !== undefined && q.why !== null) {
    if (!Array.isArray(q.why) || q.why.length !== 4) E.push(`why: must be an array of exactly 4 entries (null for the correct option), got ${Array.isArray(q.why) ? 'length ' + q.why.length : typeof q.why}`);
    else {
      if (ansOk && q.why[q.ans] != null) E.push(`why: why[${q.ans}] belongs to the correct option and must be null, got ${jstr(short(q.why[q.ans], 50))}`);
      q.why.forEach((w, i) => { if (w != null && (typeof w !== 'string' || !w.trim())) E.push(`why[${i}]: must be null or a non-empty string`); });
    }
  }

  // time
  if (typeof q.time !== 'number' || !isFinite(q.time) || q.time < 10 || q.time > 300) E.push(`time: must be a number from 10 to 300 seconds, got ${jstr(q.time)}`);

  // solution
  if (!Array.isArray(q.sol) || !q.sol.length) E.push('sol: must be a non-empty array of step strings');
  else q.sol.forEach((s, i) => { if (typeof s !== 'string' || !s.trim()) E.push(`sol[${i}]: must be a non-empty string`); });
  for (const f of ['short', 'trap']) if (q[f] != null && (typeof q[f] !== 'string' || !q[f].trim())) E.push(`${f}: if present must be a non-empty string`);

  // set
  if (q.set != null) {
    if (typeof q.set !== 'string' || !sets[q.set]) E.push(`set: ${jstr(q.set)} does not exist (QB.set ids: ${Object.keys(sets).join(', ') || 'none defined'})`);
  }

  // text hygiene
  const texts = [['q', q.q]];
  if (optsOk) q.opts.forEach((x, i) => texts.push([`opts[${i}]`, x]));
  if (Array.isArray(q.sol)) q.sol.forEach((x, i) => texts.push([`sol[${i}]`, x]));
  texts.push(['short', q.short], ['trap', q.trap]);
  if (Array.isArray(q.why)) q.why.forEach((x, i) => texts.push([`why[${i}]`, x]));
  for (const [name, t] of texts) {
    if (typeof t !== 'string') continue;
    const bad = t.match(BAD_TEXT);
    if (bad) E.push(`${name}: contains ${jstr(bad[0])} (a bug leaking into the text): ${jstr(short(t, 90))}`);
    if ((t.split('**').length - 1) % 2) E.push(`${name}: unbalanced ** (bold markers): ${jstr(short(t, 90))}`);
    if ((t.split('`').length - 1) % 2) E.push(`${name}: unbalanced backtick: ${jstr(short(t, 90))}`);
  }

  // unknown fields (typos)
  for (const k of Object.keys(q)) if (!ALLOWED.has(k)) W.push(`unknown field "${k}" (typo?)`);

  // calc / check
  const hasCalc = q.calc != null && q.calc !== '';
  const hasCheck = q.check != null && q.check !== '';
  // generated questions must prove their answer: calc for a number, or a real check (not a bare "true") for text answers
  const trivialCheck = hasCheck && /^\s*(true|!0|1)\s*$/.test(String(q.check));
  if (o.gen && !hasCalc && (!hasCheck || trivialCheck)) E.push('calc/check: generated questions must supply calc (numeric answer) or a check expression that tests the correct option (a bare "true" proves nothing)');
  if (!hasCalc && !hasCheck && !o.gen && q.sec === 'quant') W.push('quant question has neither calc nor check, so its answer key is NOT machine-verified');

  if (hasCalc) {
    let cv;
    try { cv = evalExpr(String(q.calc), q); } catch (e) { E.push(`calc: ${jstr(String(q.calc))} failed to evaluate: ${e.message}`); }
    if (cv !== undefined) {
      if (typeof cv !== 'number' || !isFinite(cv)) E.push(`calc: ${jstr(String(q.calc))} must give a finite number, got ${jstr(cv)}`);
      else {
        info.calc = cv;
        if (optsOk && ansOk) {
          const P = q.opts.map(parseOpt);
          info.parsed = P;
          const own = P[q.ans];
          const matches = [];
          P.forEach((p, j) => { if (!p.err && Math.abs(p.value - cv) <= tolFor(p, cv)) matches.push(j); });
          if (own.err) {
            E.push(`calc: correct option opts[${q.ans}] ${jstr(q.opts[q.ans])} cannot be parsed as a number (${own.err}) but calc is given (= ${fnum(cv)}); fix the option text or use check instead`);
          } else if (!matches.includes(q.ans)) {
            const tol = tolFor(own, cv);
            let m = `ans key: calc ${jstr(String(q.calc))} = ${fnum(cv)}, but the marked-correct option opts[${q.ans}] ${jstr(q.opts[q.ans])} parses to ${fnum(own.value)} (off by ${fnum(Math.abs(own.value - cv))}, allowed +/-${fnum(tol)})`;
            if (matches.length) m += `. Option${matches.length > 1 ? 's that DO' : ' that DOES'} match calc: ${matches.map((j) => `opts[${j}] ${jstr(q.opts[j])}`).join(', ')}. Expected ans: ${matches[0]}, got ${q.ans}`;
            else m += '. No option matches calc at all: the options or the calc expression are wrong';
            E.push(m);
          } else {
            for (const j of matches) if (j !== q.ans) E.push(`options: opts[${j}] ${jstr(q.opts[j])} ALSO matches calc = ${fnum(cv)} (same as the correct opts[${q.ans}] ${jstr(q.opts[q.ans])}); two options would be correct`);
            if (own.many) W.push(`opts[${q.ans}] ${jstr(q.opts[q.ans])} contains several numbers; only the first was compared with calc`);
          }
        } else if (!optsOk || !ansOk) {
          /* structural errors already reported */
        }
      }
    }
  }
  if (hasCheck) {
    try {
      const r = evalExpr(String(q.check), q);
      info.checkValue = r;
      if (r !== true) E.push(`check: ${jstr(short(String(q.check), 100))} evaluated to ${jstr(r)}, must be strictly true`);
    } catch (e) { E.push(`check: ${jstr(short(String(q.check), 100))} failed to evaluate: ${e.message}`); }
  }
  return { E, W, info };
}

// ---------------------------------------------------------------- scope (--only)
const only = opts.only;
const keyOf = (q) => `${q.sec}/${q.topic}/${q.pattern}`;
const inScope = (key) => !only || key.toLowerCase().includes(only);

// ---------------------------------------------------------------- --show
function printShown(q, label) {
  const v = validateQ(q, { gen: /^g:/.test(String(q.id)) });
  console.log(`\n${label}`);
  console.log(`id: ${q.id}   ${q.sec}/${q.topic}/${q.pattern}   ${q.d}   target ${q.time}s${q.set ? '   set: ' + q.set : ''}`);
  console.log('\nQ: ' + q.q);
  (q.opts || []).forEach((o, i) => {
    const p = v.info.parsed ? v.info.parsed[i] : null;
    const pv = p ? (p.err ? `(unparsed: ${p.err})` : `-> ${fnum(p.value)}${p.dec === null ? ' [fraction/ratio]' : ` [${p.dec} dp${p.approx ? ', approx' : ''}]`}`) : '';
    console.log(`  ${'ABCD'[i]}) ${o}${i === q.ans ? '   <== KEY' : ''}   ${pv}`);
  });
  if (q.calc != null) console.log(`\ncalc: ${q.calc}  =>  ${v.info.calc === undefined ? '(failed)' : fnum(v.info.calc)}`);
  if (q.check != null) console.log(`check: ${q.check}  =>  ${jstr(v.info.checkValue)}`);
  console.log('\nSolution:'); (q.sol || []).forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  if (q.short) console.log('Shortcut: ' + q.short);
  if (q.trap) console.log('Trap: ' + q.trap);
  if (q.why) { console.log('Why (per option):'); q.why.forEach((w, i) => console.log(`  ${'ABCD'[i]}: ${w == null ? '(correct)' : w}`)); }
  console.log('\n' + (v.E.length ? 'ERRORS:\n' + v.E.map((e) => '  - ' + e).join('\n') : 'no errors') + (v.W.length ? '\nWARNINGS:\n' + v.W.map((e) => '  - ' + e).join('\n') : ''));
  process.exitCode = v.E.length ? 1 : 0;
}
if (opts.show) {
  let [a, b, c] = opts.show;
  let q;
  const gm = /^g:([^:]+):(Easy|Medium|Hard):(\d+)$/.exec(a);
  if (gm) { a = gm[1]; b = gm[3]; c = gm[2]; }
  if (QB.byId && QB.byId[a]) { q = QB.byId[a]; printShown(q, 'Bank question from ' + (fileOf.get(q) || '?')); }
  else if (gens[a]) {
    if (!hasMake) { console.error('QB.make is not available (assets/qbank.js missing or failed).'); process.exit(2); }
    const seed = parseInt(b || '1', 10), d = c || 'Medium';
    try { q = QB.make(a, d, seed); } catch (e) { console.error(`QB.make(${a}, ${d}, ${seed}) threw: ${e.message}`); process.exit(1); }
    printShown(q, `Generated question (${genFile[a] || '?'}) seed ${seed}`);
  } else {
    console.error(`No bank question with id "${a}" and no generator with key "${a}".`);
    const near = bank.map((x) => x.id).filter((id) => id.includes(a)).slice(0, 8);
    if (near.length) console.error('Similar ids: ' + near.join(', '));
    process.exit(2);
  }
  process.exit(process.exitCode || 0);
}

// ---------------------------------------------------------------- check the bank
const idFirst = new Map();
const rows = new Map();     // key -> { E, M, H, total, gen, runs, pass, errs }
const rowFor = (key) => {
  if (!rows.has(key)) rows.set(key, { E: 0, M: 0, H: 0, total: 0, gen: false, runs: 0, pass: 0, errs: 0, hasQ: false });
  return rows.get(key);
};
let nQuestions = 0;
const unverified = [];
const textSeen = new Map();
const ansCount = new Map(); // key -> [c0..c3]

for (const q of bank) {
  const key = q && q.sec ? keyOf(q) : '(no key)';
  if (q && q.sec && !inScope(key)) continue;
  if (!q || typeof q !== 'object') { addErr('?', '?', null, 'bank contains a non-object entry'); continue; }
  nQuestions++;
  const file = fileOf.get(q) || '?';
  const id = q.id == null ? '(no id)' : String(q.id);
  const row = rowFor(key);
  row.hasQ = true;
  row.total++;
  if (q.d === 'Easy') row.E++; else if (q.d === 'Medium') row.M++; else if (q.d === 'Hard') row.H++;
  if (q.id != null) {
    if (idFirst.has(q.id)) {
      addErr(file, id, key, `id is not unique: already used in ${idFirst.get(q.id)}`); row.errs++;
    } else idFirst.set(q.id, file);
  }
  const v = validateQ(q, {});
  for (const m of v.E) { addErr(file, id, key, m); row.errs++; }
  for (const m of v.W) {
    if (/neither calc nor check/.test(m)) unverified.push({ file, id });
    else addWarn(file, id, key, m);
  }
  if (typeof q.q === 'string') {
    const t = q.q.trim().toLowerCase();
    if (textSeen.has(t)) addWarn(file, id, key, `same question text as ${textSeen.get(t)}`);
    else textSeen.set(t, id);
  }
  if (Number.isInteger(q.ans) && q.ans >= 0 && q.ans <= 3) {
    if (!ansCount.has(key)) ansCount.set(key, [0, 0, 0, 0]);
    ansCount.get(key)[q.ans]++;
  }
}
for (const [key, c] of ansCount) {
  const n = c[0] + c[1] + c[2] + c[3];
  if (n >= 12) {
    const mx = Math.max(...c);
    if (mx / n > 0.5) addWarn('-', '-', key, `answer positions look lopsided: A/B/C/D = ${c.join('/')} of ${n}; vary the key positions`);
  }
}
if (unverified.length) {
  // every one counts as a warning; only the first 20 are printed (one summary line)
  unverified.forEach((u) => warnings.push({ file: u.file, id: u.id, key: null, quiet: true, msg: 'neither calc nor check' }));
  warnings.push({ file: '-', id: '-', key: null, msg: `${unverified.length} quant question(s) have neither calc nor check (answer key NOT machine-verified). First ${Math.min(20, unverified.length)}: ` +
    unverified.slice(0, 20).map((u) => u.id).join(', ') + (unverified.length > 20 ? ', ...' : ''), summary: true });
}

// ---------------------------------------------------------------- generators
let nGens = 0;
const genReports = [];
for (const key of Object.keys(gens).sort()) {
  if (!inScope(key)) continue;
  nGens++;
  const file = genFile[key] || '?';
  const row = rowFor(key);
  row.gen = true;
  const parts = key.split('/');
  if (catalogLoaded && !(CAT[parts[0]] && CAT[parts[0]][parts[1]] && CAT[parts[0]][parts[1]].has(parts[2]))) {
    addErr(file, key, key, `generator key ${jstr(key)} is not a sec/topic/pattern in CATALOG`); row.errs++;
  }
  if (parts.length !== 3) { addErr(file, key, key, 'generator key must look like "sec/topic/pattern"'); row.errs++; continue; }
  if (!hasMake) { row.skipped = true; continue; }
  const rep = { key, file, runs: 0, pass: 0, fails: [], failTotal: 0, ans: [0, 0, 0, 0] };
  const record = (d, seed, msgs) => {
    rep.failTotal++;
    if (rep.fails.length < 5) rep.fails.push({ d, seed, msgs });
  };
  for (const d of DIFFS) {
    const texts = new Set();
    let runsD = 0;
    for (let seed = 1; seed <= SEEDS; seed++) {
      rep.runs++; runsD++;
      let a, b;
      try { a = QB.make(key, d, seed); } catch (e) { record(d, seed, [`QB.make threw: ${e && e.message || e}`]); continue; }
      let ja;
      try {
        ja = JSON.stringify(a);
        b = QB.make(key, d, seed);
      } catch (e) { record(d, seed, [`QB.make threw on 2nd call: ${e && e.message || e}`]); continue; }
      if (ja !== JSON.stringify(b)) {
        record(d, seed, [`not deterministic: same seed gave different questions (1st q: ${jstr(short(a && a.q, 60))}, 2nd q: ${jstr(short(b && b.q, 60))})`]);
        continue;
      }
      const v = validateQ(a, { gen: true });
      const msgs = v.E.slice();
      if (a && typeof a === 'object') {
        if (a.id !== `g:${key}:${d}:${seed}`) msgs.push(`id: expected ${jstr(`g:${key}:${d}:${seed}`)}, got ${jstr(a.id)}`);
        if (a.d !== d) msgs.push(`d: asked for ${d}, question says ${jstr(a.d)}`);
        if (keyOf(a) !== key) msgs.push(`sec/topic/pattern: expected ${key}, got ${keyOf(a)}`);
      }
      if (msgs.length) { record(d, seed, msgs); continue; }
      rep.pass++;
      texts.add(a.q);
      rep.ans[a.ans]++;
    }
    const ratio = texts.size / runsD;
    if (texts.size && ratio < 0.3) {
      addWarn(file, key, key, `low variety at ${d}: only ${texts.size} distinct question texts in ${runsD} runs (${Math.round(ratio * 100)}%, want >= 30%)`);
    }
  }
  const okRuns = rep.pass;
  if (okRuns >= 100) {
    const mn = Math.min(...rep.ans) / okRuns, mx = Math.max(...rep.ans) / okRuns;
    if (mn < 0.15 || mx > 0.35) addWarn(file, key, key, `answer positions are skewed: A/B/C/D = ${rep.ans.map((c) => Math.round(c / okRuns * 100) + '%').join('/')}`);
  }
  row.runs = rep.runs; row.pass = rep.pass;
  if (rep.failTotal) {
    row.errs++;
    const lines = rep.fails.map((f) => `  seed ${f.seed} (${f.d}): ${f.msgs.join(' | ')}`);
    addErr(file, key, key, `${rep.failTotal} of ${rep.runs} runs failed. Reproduce with: node tools/verify.js --show ${key} <seed> <Easy|Medium|Hard>\n${lines.join('\n')}` +
      (rep.failTotal > rep.fails.length ? `\n  ... and ${rep.failTotal - rep.fails.length} more failing runs` : ''));
  }
  genReports.push(rep);
}
if (!hasMake && Object.keys(gens).filter(inScope).length) {
  addWarn('-', '-', null, `${Object.keys(gens).filter(inScope).length} generator(s) defined but NOT run (QB.make unavailable).`);
}

// ---------------------------------------------------------------- report
const out = [];
const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);
out.push(`verify: root ${ROOT}${only ? `   --only "${only}"` : ''}   generators: ${hasMake ? SEEDS + ' seeds x 3 difficulties' : 'skipped'}`);
for (const n of notes) out.push('note: ' + n);
out.push('');
// Table grouped by sec/topic
const keys = [...rows.keys()].filter((k) => rows.get(k).hasQ || rows.get(k).gen).sort((a, b) => {
  const ca = catPatterns.findIndex((p) => p.key === a), cb = catPatterns.findIndex((p) => p.key === b);
  if (ca >= 0 && cb >= 0) return ca - cb;
  return a < b ? -1 : 1;
});
if (keys.length) {
  out.push(pad('topic / pattern', 40) + lpad('E', 4) + lpad('M', 4) + lpad('H', 4) + lpad('Tot', 5) + '  ' + pad('Gen', 5) + lpad('Pass', 7) + lpad('Err', 5));
  out.push('-'.repeat(40 + 4 * 3 + 5 + 2 + 5 + 7 + 5));
  let lastTopic = null;
  const tot = { E: 0, M: 0, H: 0, total: 0, errs: 0 };
  for (const k of keys) {
    const r = rows.get(k);
    const [s, t, p] = k.split('/');
    const topic = `${s}/${t}`;
    if (topic !== lastTopic) { out.push(topic); lastTopic = topic; }
    const pass = !r.gen ? '' : r.skipped ? 'skip' : (r.runs ? Math.round(r.pass / r.runs * 1000) / 10 + '%' : '-');
    out.push(pad('  ' + (p === undefined ? k : p), 40) + lpad(r.E, 4) + lpad(r.M, 4) + lpad(r.H, 4) + lpad(r.total, 5) + '  ' + pad(r.gen ? 'yes' : 'no', 5) + lpad(pass, 7) + lpad(r.errs || '', 5));
    tot.E += r.E; tot.M += r.M; tot.H += r.H; tot.total += r.total; tot.errs += r.errs;
  }
  out.push('-'.repeat(40 + 4 * 3 + 5 + 2 + 5 + 7 + 5));
  out.push(pad('TOTAL', 40) + lpad(tot.E, 4) + lpad(tot.M, 4) + lpad(tot.H, 4) + lpad(tot.total, 5) + '  ' + pad(nGens, 5) + lpad('', 7) + lpad(tot.errs || '', 5));
} else out.push('(no questions or generators found' + (only ? ' matching --only' : '') + ')');
if (catalogLoaded) {
  const cp = catPatterns.filter((p) => inScope(p.key));
  const noQ = cp.filter((p) => !(rows.get(p.key) && rows.get(p.key).hasQ));
  const needGen = cp.filter((p) => p.gen && !gens[p.key]);
  out.push(`\ncatalog: ${cp.length} patterns; ${noQ.length} without bank questions; ${needGen.length} marked gen:true without a generator yet.`);
  if (opts.all) {
    if (noQ.length) out.push('  no bank questions: ' + noQ.map((p) => p.key).join(', '));
    if (needGen.length) out.push('  gen missing: ' + needGen.map((p) => p.key).join(', '));
  }
}
// Errors
const CAP = 200;
if (errors.length) {
  out.push(`\nERRORS (${errors.length})`);
  errors.slice(0, CAP).forEach((e) => {
    const lines = e.msg.split('\n');
    out.push(`  [${e.file}] ${e.id}: ${lines[0]}`);
    lines.slice(1).forEach((l) => out.push('      ' + l.trim()));
  });
  if (errors.length > CAP) out.push(`  ... ${errors.length - CAP} more errors not shown`);
}
if (warnings.length) {
  out.push(`\nWARNINGS (${warnings.filter((w) => !w.summary).length}; unverified-quant questions are counted individually, listed in one line)`);
  const shown = warnings.filter((w) => !w.quiet);
  shown.slice(0, CAP).forEach((w) => out.push(`  [${w.file}] ${w.id}: ${w.msg}`));
  if (shown.length > CAP) out.push(`  ... ${shown.length - CAP} more warnings not shown`);
}
out.push(`\nverify: ${nQuestions} questions, ${nGens} generators, ${errors.length} errors, ${warnings.filter((w) => !w.summary).length} warnings`);
console.log(out.join('\n'));
process.exitCode = errors.length ? 1 : 0;
