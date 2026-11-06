/* Rough-work pad: header button + right slide-out drawer, or docked into a page column (tablet workspace, tablet lessons).
   Tabs: Draw / Notes / Calculator.  Plain script, no dependencies.  Spec: docs/SPEC-pen.md.
   API: window.RoughPad = { toggle, open, close, clear, undo, redo, setContext(id, opts?), dock(hostEl), undock(), docked(), layer(hostEl, contextKey), calc }.
   Keys: W toggles (the drawer, or the dock when docked), Esc closes the drawer, Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y undo / redo inside the pad.
   Docked: toggle() does not open the drawer; it fires a cancelable "apt:rwtoggle" event on document. The page that owns the
   dock handles it (and calls preventDefault); if nobody does, the dock host is just hidden / shown.
   Lessons (tablet landscape, pages with #sidebar): toggle() docks the pad as a right column that rough.js creates itself
   (#rwLessonDock); the content gets padding so it shrinks. Portrait and other devices keep the drawer.

   Sheets: setContext(id, { scope, group?, label? }) switches the pad to rough-work sheets shared by a run of questions (one practice session / mock attempt = scope).
   A sheet is a drawing keyed "sheet:" + scope + ":" + n; bookkeeping (order, question -> sheet, group -> sheet, current) lives in sessionStorage apt:rw:sheets.
   Mode (localStorage apt:rw:sheetmode): auto = questions of one set share a sheet and a new unrelated question gets a fresh sheet when the current one has ink;
   manual = one sheet continues until New sheet. A question remembers its sheet. Without opts, one drawing per context as before.

   RoughPad.layer(hostEl, contextKey) -> { clear(), destroy(), setTool(t), hasMarks(), readonly(on), undo(), redo() }
     A transparent ink layer over hostEl (made position:relative if it is static), same engine as the pad: pressure, smoothing, pen eraser,
     stroke / area eraser, colours, size, pen-only rule (a finger scrolls the nearest scrolling ancestor instead of drawing) are shared with the pad.
     Coordinates are relative to hostEl. Strokes are saved in sessionStorage under the key "mk:" + contextKey (so they survive Prev/Next and reload).
     setTool("hl" | "pen" | "eraser") applies to this layer only (default "hl" = highlighter; "highlighter" and "marker" also work).
     readonly(true) keeps the marks visible but the layer stops capturing input (pointer-events:none); readonly(false) makes it live again.
     destroy() removes the layer's DOM and listeners; the saved strokes stay. hasMarks() is true while a non-eraser stroke is stored under the key. */
(function () {
  "use strict";
  if (window.RoughPad) return;
  var doc = document, root = doc.documentElement;
  var LS = { notes: "apt:rw:notes", exam: "apt:rw:exam", paper: "apt:rw:paper", size: "apt:rw:size", tool: "apt:rw:tool", color: "apt:rw:color", penonly: "apt:rw:penonly", emode: "apt:rw:emode", smode: "apt:rw:sheetmode" };
  var SS = { strokes: "apt:rw:strokes", pen: "apt:rw:pen", sheets: "apt:rw:sheets" };
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function r1(n) { return Math.round(n * 10) / 10; }
  function r2(n) { return Math.round(n * 100) / 100; }

  var ICON = {
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    marker: '<path d="M14 4l6 6-8 8H7l-1-1v-4z"/><path d="M4 21h9"/>',
    eraser: '<path d="M7 21h10M5 15l9-9 5 5-7 7H8z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    redo: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
    grid: '<path d="M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
    ruled: '<path d="M4 4h16v16H4zM4 9h16M4 14h16"/>',
    blank: '<path d="M4 4h16v16H4z"/>',
    thin: '<path d="M4 12h16" style="stroke-width:1.2"/>',
    med: '<path d="M4 12h16" style="stroke-width:5"/>',
    stylus: '<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M5 19l-1 2 2-1"/><path d="M14 7l3 3"/>',
    finger: '<path d="M9 12V6.5a1.5 1.5 0 0 1 3 0V11M12 10.5V5a1.5 1.5 0 0 1 3 0v6M15 11V7.5a1.5 1.5 0 0 1 3 0V15c0 3.5-2 6-5.5 6-2.6 0-4.2-1.3-5.5-3.5L4.500 13a1.5 1.5 0 0 1 2.5-1.5L9 14"/>',
    sheets: '<path d="M8 4h12v12H8z"/><path d="M4 8v12h12"/>',
    hide: '<path d="M9 5l7 7-7 7"/>'
  };
  function svg(n) { return '<svg class="rw-ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }
  var PAPERS = ["grid", "ruled", "blank"], PAPER_NAME = { grid: "squared", ruled: "ruled", blank: "blank" };
  var PENW = [2, 5], HLW = [14, 26], ERW = [16, 32], ERR = [10, 18], MAXPAGES = 6, STORE_MAX = 60;

  /* ---------- shared preferences (pad and layers) ---------- */
  var TOOLS = ["pen", "hl", "eraser"], COLORS = ["ink", "red", "blue"];
  var prefs = {
    tool: TOOLS.indexOf(lsGet(LS.tool, "pen")) >= 0 ? lsGet(LS.tool, "pen") : "pen",
    color: COLORS.indexOf(lsGet(LS.color, "ink")) >= 0 ? lsGet(LS.color, "ink") : "ink",
    size: lsGet(LS.size, "thin") === "med" ? "med" : "thin",
    emode: lsGet(LS.emode, "stroke") === "area" ? "area" : "stroke",
    penOnly: lsGet(LS.penonly, "") === "1"
  };
  var uiSync = null;   /* set by build(): refreshes the toolbar after a preference changed from outside (auto pen-only) */
  function sizeIx() { return prefs.size === "med" ? 1 : 0; }
  function widthFor(kind) { var i = sizeIx(); return kind === "hl" ? HLW[i] : kind === "er" ? ERW[i] : PENW[i]; }
  function notePen() {
    if (ssGet(SS.pen) !== "1") ssSet(SS.pen, "1");
    if (lsGet(LS.penonly, "") === "") { prefs.penOnly = true; lsSet(LS.penonly, "1"); if (uiSync) uiSync(); }   /* first pen stroke: fingers stop drawing (user can turn it off) */
  }

  /* ---------- palette (follows the theme) ---------- */
  var pal = { ink: "#1d1d1f", red: "#C21F4F", blue: "#1F5FA8", hl: "#FFD23F", dark: false };
  function cssv(n, d) { var c = getComputedStyle(root).getPropertyValue(n).trim(); return c || d; }
  function dim(hex, f) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex); if (!m) return hex;
    var n = parseInt(m[1], 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(function (v) { return Math.round(v * f); });
    return "rgb(" + c.join(",") + ")";
  }
  function refreshPal() {
    pal.dark = root.getAttribute("data-theme") === "dark";
    pal.ink = cssv("--text", "#1d1d1f"); pal.red = cssv("--red", "#C21F4F");
    pal.blue = pal.dark ? "#82B4F5" : "#1F5FA8";
    var y = cssv("--f-yellow", "#FFD23F");
    pal.hl = pal.dark ? dim(y, 0.5) : y;            /* dark: "screen" blend, so a dimmed yellow keeps light text readable */
  }

  /* ---------- styles ---------- */
  var touchRules = [
    ".rw-pane .rw-tools .rw-tb{width:auto;min-width:46px;height:56px;padding:0 3px}",
    ".rw-pane .rw-tools .rw-lb{display:block}",
    ".rw-pane .rw-tools{gap:4px}.rw-pane .rw-grp{gap:4px}"
  ].join("");
  var css = [
    ".rw-drawer{position:fixed;top:var(--rw-top,56px);right:0;bottom:0;width:400px;max-width:100vw;background:var(--panel);color:var(--text);border-left:2px solid var(--line);",
    "transform:translateX(105%);visibility:hidden;pointer-events:none;z-index:40;display:flex;flex-direction:column;padding:1rem;box-sizing:border-box;font-family:var(--sans)}",
    ".rw-drawer.show{transform:none;visibility:visible;pointer-events:auto}",
    ".rw-drawer [hidden],.rw-pane [hidden]{display:none!important}",
    ".rw-ico{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle;flex:none}",
    "#rwBtn .rw-ico{width:18px;height:18px}",
    "#rwBtn{display:inline-grid;place-items:center;margin-right:.35rem}",
    "#rwBtn.on{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}",
    ".rw-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem}",
    ".rw-head h4,.rw-dhead h4{margin:0;font:800 var(--fs-md) var(--display);flex:1;text-transform:none;letter-spacing:0}",
    ".rw-ctx{font-size:var(--fs-2xs);color:var(--muted)}",
    ".rw-tb{position:relative;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-sizing:border-box;width:44px;height:44px;min-width:44px;padding:0;margin:0;border:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);box-shadow:none;cursor:pointer;font:700 var(--fs-sm) var(--display);text-transform:none;letter-spacing:0;touch-action:manipulation}",
    ".rw-lb{display:none;font:700 10px/1 var(--display);white-space:nowrap;letter-spacing:0;text-transform:none}",
    ".rw-tb:hover{background:var(--panel-2)}",
    ".rw-tb.on,.rw-tb.on:hover{background:var(--text);color:var(--bg);border-color:var(--text)}",
    ".rw-tb:disabled{opacity:.4;cursor:default}",
    ".rw-tb:focus-visible,.rw-tabs button:focus-visible,.rw-pb:focus-visible,.rw-more:focus-visible{outline:3px solid var(--accent);outline-offset:1px}",
    ".rw-dot{position:absolute;top:3px;right:3px;width:9px;height:9px;background:var(--rw-pc,var(--text));outline:2px solid var(--panel);pointer-events:none}",
    ".rw-tb.on .rw-dot{outline-color:var(--bg)}",
    ".rw-pane{flex:1;min-height:0;display:flex;flex-direction:column;font-family:var(--sans);color:var(--text);--rw-blue:#1F5FA8}",
    "[data-theme=\"dark\"] .rw-pane{--rw-blue:#82B4F5}",
    ".rw-dhead{display:none;align-items:center;gap:.5rem;margin-bottom:.6rem}",
    ".rw-pane.docked{height:100%;box-sizing:border-box;padding:.7rem;background:var(--panel);border:2px solid var(--line)}",
    ".rw-pane.docked .rw-dhead{display:flex}",
    ".rw-tabs{display:flex;border:2px solid var(--line-control);margin-bottom:.6rem;flex:none}",
    ".rw-tabs button{flex:1;min-height:44px;border:0;border-right:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);padding:0 .4rem;font:800 var(--fs-sm) var(--display);cursor:pointer;box-shadow:none;text-transform:none;letter-spacing:0}",
    ".rw-tabs button:last-of-type,.rw-tabs button[data-last]{border-right:0}",
    ".rw-tabs button:hover{background:var(--panel-2)}",
    ".rw-tabs button.on,.rw-tabs button.on:hover{background:var(--text);color:var(--bg)}",
    ".rw-panel{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}",
    ".rw-tools{display:flex;flex-wrap:wrap;align-items:flex-start;gap:6px;margin-bottom:.55rem;flex:none}",
    ".rw-grp{display:inline-flex;gap:6px}",
    ".rw-pager{display:flex;align-items:center;gap:6px;margin-bottom:.55rem;flex:none}",
    ".rw-pg-t{flex:1;min-width:0;text-align:center;font:800 var(--fs-sm) var(--display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".rw-pager .rw-tb:not(.rw-new){font-size:26px;line-height:1}",
    ".rw-pager .rw-new{width:auto;padding:0 .8rem;font:800 var(--fs-sm) var(--display)}",
    ".rw-pager .rw-new.flash{outline:3px solid var(--accent);outline-offset:1px}",
    ".rw-pane .rw-tools .rw-sm{width:auto;min-width:46px;padding:0 6px}.rw-sm .rw-lb{display:block}",
    ".rw-gap{width:8px;flex:none}",
    ".rw-gap.wide{width:14px}",
    ".rw-pop{position:absolute;z-index:8;display:flex;gap:6px;padding:6px;background:var(--panel);border:2px solid var(--line)}",
    ".rw-pb{display:inline-grid;place-items:center;box-sizing:border-box;min-width:44px;height:44px;padding:0 .7rem;border:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);cursor:pointer;box-shadow:none;font:800 var(--fs-sm) var(--display);text-transform:none;letter-spacing:0;touch-action:manipulation}",
    ".rw-pb:hover{background:var(--panel-2)}",
    ".rw-pb[aria-checked=\"true\"]{border-color:var(--text);background:var(--accent-soft)}",
    ".rw-pb .sq{display:block;width:28px;height:28px;border:2px solid var(--line)}",
    ".rw-pane{--rw-paper:color-mix(in srgb,var(--line) 65%,transparent)}",
    ".rw-sheet{position:relative;flex:1;min-height:0;border:2px solid var(--line-control);background-color:var(--bg);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}",
    ".rw-page{position:relative;width:100%;min-height:100%}",
    ".rw-sheet[data-paper=\"grid\"] .rw-page{background-image:linear-gradient(var(--rw-paper) 1px,transparent 1px),linear-gradient(90deg,var(--rw-paper) 1px,transparent 1px);background-size:28px 28px}",
    ".rw-sheet[data-paper=\"ruled\"] .rw-page{background-image:linear-gradient(var(--rw-paper) 1px,transparent 1px);background-size:100% 34px}",
    ".rw-cv{position:absolute;left:0;top:0;width:100%;height:100%;display:block;outline:none;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}",
    ".rw-cv-ink{cursor:crosshair}",
    ".rw-cv-hl,.rw-cv-pv{pointer-events:none}",
    "html:not([data-theme=\"dark\"]) .rw-cv-hl{mix-blend-mode:multiply}",
    "html[data-theme=\"dark\"] .rw-cv-hl{mix-blend-mode:screen}",
    ".rw-ring{position:absolute;left:0;top:0;display:none;box-sizing:border-box;border:1.5px solid var(--text);border-radius:50%;background:transparent;pointer-events:none;z-index:4;box-shadow:0 0 0 1px var(--bg)}",
    ".rw-layer{position:absolute;left:0;top:0;right:0;bottom:0;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}",
    ".rw-layer.ro{pointer-events:none}",
    ".rw-more{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:5;min-height:44px;padding:0 1rem;border:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);font:800 var(--fs-sm) var(--display);cursor:pointer;box-shadow:none;text-transform:none;letter-spacing:0;touch-action:manipulation}",
    ".rw-more:hover{background:var(--panel-2)}",
    ".rw-notes{flex:1;width:100%;resize:none;box-sizing:border-box;border:2px solid var(--line-control);border-radius:0;background:var(--bg);color:var(--text);padding:.7rem;font:var(--fs-sm)/1.55 var(--sans);outline:none}",
    ".rw-notes:focus{border-color:var(--accent)}",
    ".rw-calc{outline:none}",
    ".rw-disp{background:var(--bg);border:2px solid var(--line-control);padding:.6rem .8rem;margin-bottom:.6rem;min-height:4.2rem;text-align:right;display:flex;flex-direction:column;justify-content:flex-end}",
    ".rw-calc:focus-visible .rw-disp{border-color:var(--accent)}",
    ".rw-expr{font:var(--fs-md) var(--mono);color:var(--muted);word-break:break-all;min-height:1.3em}",
    ".rw-res{font:700 var(--fs-xl) var(--mono);color:var(--text);word-break:break-all;min-height:1.4em}",
    ".rw-res.err{color:var(--red);font-size:var(--fs-md)}",
    ".rw-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}",
    ".rw-keys button{border:2px solid var(--line-control);background:var(--panel);color:var(--text);border-radius:0;height:2.9rem;font:700 var(--fs-base) var(--sans);cursor:pointer;box-shadow:none;text-transform:none;letter-spacing:0}",
    ".rw-keys button:hover{background:var(--panel-2)}",
    ".rw-keys button.op{color:var(--accent)}",
    ".rw-keys button.fn{color:var(--muted)}",
    ".rw-keys button.eq{background:var(--text);border-color:var(--text);color:var(--bg)}",
    ".rw-pane.docked .rw-keys button{height:3.3rem}",
    ".rw-exam{display:flex;align-items:center;gap:.55rem;margin-top:.6rem;font-size:var(--fs-xs);color:var(--muted);flex:none;min-height:44px}",
    ".rw-sw{width:64px;height:44px;border:2px solid var(--line-control);border-radius:0;background:var(--panel);position:relative;padding:0;cursor:pointer;flex:none;box-shadow:none;touch-action:manipulation}",
    ".rw-sw::after{content:\"\";position:absolute;top:6px;left:6px;width:20px;height:28px;background:var(--muted)}",
    ".rw-sw[aria-checked=\"true\"]{background:var(--accent-soft);border-color:var(--text)}",
    ".rw-sw[aria-checked=\"true\"]::after{left:32px;background:var(--text)}",
    ".rw-sw:focus-visible{outline:3px solid var(--accent);outline-offset:1px}",
    ".rw-note-off{margin:0 0 .5rem;font-size:var(--fs-2xs);color:var(--muted)}",
    /* lesson dock (tablet landscape): a right column next to the lesson */
    ".rw-ld-host{position:fixed;top:0;bottom:0;right:var(--rail-w,0px);width:var(--rw-ld-w,460px);z-index:45;box-sizing:border-box;padding:10px;background:var(--bg);border-left:2px solid var(--line);display:flex;flex-direction:column}",
    "html[data-hand=\"left\"] .rw-ld-host{right:0}",
    ".rw-ld-host[hidden]{display:none}",
    "html.rw-ld.rw-ld[data-device=\"tablet\"] body{padding-right:calc(var(--rail-w,0px) + var(--rw-ld-w,460px))}",
    "html.rw-ld.rw-ld[data-device=\"tablet\"][data-hand=\"left\"] body{padding-right:var(--rw-ld-w,460px)}",
    "@media (pointer:coarse),(hover:none){" + touchRules + "}",
    "html[data-device=\"tablet\"] " + touchRules.split("}").filter(Boolean).join("}html[data-device=\"tablet\"] ") + "}",
    "html[data-device=\"phone\"] " + touchRules.split("}").filter(Boolean).join("}html[data-device=\"phone\"] ") + "}"
  ].join("\n");
  var st = doc.createElement("style"); st.id = "rwStyle"; st.textContent = css; doc.head.appendChild(st);

  /* ---------- safe calculator parser (recursive descent, no eval) ---------- */
  function calcEval(src) {
    var s = String(src).replace(/\s+/g, "").replace(/[*xX]/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
    var i = 0;
    function fail(m) { throw new Error(m || "Invalid"); }
    function expr() {
      var v = term();
      while (s[i] === "+" || s[i] === "−") { var o = s[i++], r = term(); v = o === "+" ? v + r : v - r; }
      return v;
    }
    function term() {
      var v = unary();
      for (;;) {
        var c = s[i];
        if (c === "×") { i++; v *= unary(); }
        else if (c === "÷") { i++; var d = unary(); if (d === 0) fail("Divide by zero"); v /= d; }
        else if (c === "(" || c === "√") { v *= unary(); }          /* implicit multiplication: 2(3), 2√9 */
        else break;
      }
      return v;
    }
    function unary() {
      if (s[i] === "−") { i++; return -unary(); }
      if (s[i] === "+") { i++; return unary(); }
      return postfix();
    }
    function postfix() {
      var v = primary();
      while (s[i] === "%" || s[i] === "²") { v = s[i] === "%" ? v / 100 : v * v; i++; }
      return v;
    }
    function primary() {
      var c = s[i];
      if (c === "(") { i++; var v = expr(); if (s[i] !== ")") fail("Missing )"); i++; return v; }
      if (c === "√") { i++; var a = s[i] === "(" || s[i] === "√" || /[\d.]/.test(s[i] || "") ? primary() : fail(); if (a < 0) fail("√ of a negative"); return Math.sqrt(a); }
      var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) fail(i >= s.length ? "Incomplete" : "Invalid");
      i += m[0].length; return parseFloat(m[0]);
    }
    if (!s) return "";
    var out = expr();
    if (i < s.length) fail("Invalid");
    if (!isFinite(out)) fail("Out of range");
    return out;
  }
  function fmtNum(n) {
    if (n === "") return "";
    var r = parseFloat(n.toPrecision(12));
    var t = String(r);
    if (/e/.test(t)) return t;
    var p = t.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return p.join(".");
  }

  /* ---------- stroke store (shared by the pad and every layer; sessionStorage) ----------
     stroke = { k: "pen" | "hl" | "er", c: "ink" | "red" | "blue", w: base width, pr: true when points carry pressure, pts: [[x, y, pressure?], ...] }
     Coordinates are page coordinates (pad) or host-relative (layer); the colour is resolved when drawing, so a theme change recolours old ink. */
  var store = { s: {}, order: [], pg: {} }, hist = {};
  (function load() {
    var raw = ssGet(SS.strokes); if (!raw) return;
    try {
      var o = JSON.parse(raw);
      (o.order || []).forEach(function (id) {
        var arr = o.s && o.s[id]; if (!arr || !arr.length) return;
        store.s[id] = arr.map(function (s) {
          var k = s.k || (s.e ? "er" : "pen");
          return { k: k, c: s.c || "ink", w: s.w, pr: !!(s.p && s.p[0] && s.p[0].length > 2), pts: s.p };
        });
        store.order.push(id);
      });
      if (o.g) store.pg = o.g;
    } catch (e) { store.s = {}; store.order = []; }
  })();
  function listOf(key) { return store.s[key] || (store.s[key] = []); }
  function save(key) {
    store.order = store.order.filter(function (k) { return k !== key; });
    if (store.s[key] && store.s[key].length) store.order.push(key);
    while (store.order.length > STORE_MAX) { var d = store.order.shift(); delete store.s[d]; delete store.pg[d]; }
    function pack(keys) {
      var o = { order: keys, s: {}, g: {} };
      keys.forEach(function (k) {
        o.s[k] = store.s[k].map(function (s) {
          return { k: s.k, c: s.c, w: r1(s.w), p: s.pts.map(function (q) { return q.length > 2 ? [r1(q[0]), r1(q[1]), r2(q[2])] : [r1(q[0]), r1(q[1])]; }) };
        });
        if (store.pg[k] && store.pg[k] > 2) o.g[k] = store.pg[k];
      });
      return JSON.stringify(o);
    }
    var keys = store.order.slice();
    while (!ssSet(SS.strokes, pack(keys)) && keys.length > 1) keys.shift();    /* quota: drop the oldest */
  }
  function histOf(key) { return hist[key] || (hist[key] = { u: [], r: [] }); }

  /* ---------- drawing engine: one instance for the pad, one per layer ---------- */
  var engines = [];
  function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function segD2(a, b, x, y) {
    var dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? ((x - a[0]) * dx + (y - a[1]) * dy) / l : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    var px = a[0] + t * dx - x, py = a[1] + t * dy - y; return px * px + py * py;
  }
  function bbox(s) {
    if (s.bb) return s.bb;
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    s.pts.forEach(function (q) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; });
    return (s.bb = [x0, y0, x1, y1]);
  }
  function hitStroke(s, x, y, r) {
    var rr = r + s.w / 2 + 1, b = bbox(s);
    if (x < b[0] - rr || x > b[2] + rr || y < b[1] - rr || y > b[3] + rr) return false;
    var p = s.pts;
    if (p.length === 1) { var dx = p[0][0] - x, dy = p[0][1] - y; return dx * dx + dy * dy <= rr * rr; }
    for (var i = 1; i < p.length; i++) if (segD2(p[i - 1], p[i], x, y) <= rr * rr) return true;
    return false;
  }

  /* cfg: { wrap, id?, label, key(): string, tool(): "pen"|"hl"|"eraser", scroller(): Element|null, onChange?(), keys?: bool } */
  function Engine(cfg) {
    var E = {}, A = mkCv("rw-cv rw-cv-hl"), B = mkCv("rw-cv rw-cv-ink"), V = mkCv("rw-cv rw-cv-pv"), ring = doc.createElement("div");
    var gA = A.getContext("2d"), gB = null, gV = V.getContext("2d");
    try { gB = B.getContext("2d", { desynchronized: true }); } catch (x) {}
    if (!gB) gB = B.getContext("2d");
    var cw = 0, ch = 0, dpr = 1, cur = null, ro = false, pv = null, inertia = 0, dead = false;
    function mkCv(cls) { var c = doc.createElement("canvas"); c.className = cls; return c; }
    ring.className = "rw-ring";
    B.setAttribute("tabindex", "-1"); B.setAttribute("aria-label", cfg.label || "Drawing area"); if (cfg.id) B.id = cfg.id;
    A.setAttribute("aria-hidden", "true"); V.setAttribute("aria-hidden", "true");
    cfg.wrap.appendChild(A); cfg.wrap.appendChild(B); cfg.wrap.appendChild(V); cfg.wrap.appendChild(ring);

    function key() { return cfg.key(); }
    function list() { return listOf(key()); }
    function targets(s) { return s.k === "hl" ? [gA] : s.k === "pen" ? [gB] : [gA, gB]; }
    function style(g, s) {
      g.globalCompositeOperation = s.k === "er" ? "destination-out" : "source-over";
      g.strokeStyle = s.k === "er" ? "#000" : s.k === "hl" ? pal.hl : (pal[s.c] || pal.ink);
      g.lineCap = g.lineJoin = "round";
    }
    function wAt(s, a, b) { return s.pr ? s.w * (0.45 + 0.9 * (((a[2] === undefined ? 0.5 : a[2]) + (b[2] === undefined ? 0.5 : b[2])) / 2)) : s.w; }
    /* one smoothed piece ending at point i: quadratic curve through segment midpoints */
    function step(s, i) {
      var p = s.pts;
      targets(s).forEach(function (g) {
        style(g, s); g.beginPath();
        if (i === 0) { g.lineWidth = wAt(s, p[0], p[0]); g.moveTo(p[0][0], p[0][1]); g.lineTo(p[0][0] + 0.01, p[0][1]); }
        else {
          var a = i === 1 ? p[0] : mid(p[i - 2], p[i - 1]), b = mid(p[i - 1], p[i]);
          g.lineWidth = wAt(s, p[i - 1], p[i]); g.moveTo(a[0], a[1]); g.quadraticCurveTo(p[i - 1][0], p[i - 1][1], b[0], b[1]);
        }
        g.stroke();
      });
    }
    function tail(s) {   /* the last half-segment, from the final midpoint to the final point */
      var p = s.pts, n = p.length; if (n < 2) return;
      var a = mid(p[n - 2], p[n - 1]);
      targets(s).forEach(function (g) { style(g, s); g.lineWidth = wAt(s, p[n - 2], p[n - 1]); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(p[n - 1][0], p[n - 1][1]); g.stroke(); });
    }
    function drawAll(s) { if (!s.pts.length) return; for (var i = 0; i < s.pts.length; i++) step(s, i); tail(s); }
    function redraw() {
      if (dead) return;
      [gA, gB, gV].forEach(function (g) { g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cw, ch); });
      pv = null; list().forEach(drawAll);
    }
    function fit() {
      if (dead || !B.clientWidth || !B.clientHeight) return;
      var w = B.clientWidth, h = B.clientHeight, d = window.devicePixelRatio || 1, cap = Math.sqrt(9e6 / (w * h));
      if (d > cap) d = Math.max(1, cap);
      if (w === cw && h === ch && d === dpr) return;
      cw = w; ch = h; dpr = d;
      [A, B, V].forEach(function (c) { c.width = Math.round(w * d); c.height = Math.round(h * d); });
      redraw();
    }
    function pos(e) { var r = B.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

    /* predicted points: a one-frame preview on the top canvas, replaced on every move */
    function clearPv() { if (pv) { gV.clearRect(pv[0] - 2, pv[1] - 2, pv[2] - pv[0] + 4, pv[3] - pv[1] + 4); pv = null; } }
    function preview(e, s) {
      clearPv();
      if (s.k !== "pen" || !e.getPredictedEvents) return;
      var pe; try { pe = e.getPredictedEvents(); } catch (x) { return; }
      if (!pe || !pe.length) return;
      var p = s.pts, n = p.length, a = n > 1 ? mid(p[n - 2], p[n - 1]) : p[0];
      var pts = [a, p[n - 1]].concat(pe.slice(0, 3).map(pos));
      gV.save(); style(gV, s); gV.lineWidth = wAt(s, p[n - 1], p[n - 1]); gV.beginPath(); gV.moveTo(pts[0][0], pts[0][1]);
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      pts.forEach(function (q, i) { if (i) gV.lineTo(q[0], q[1]); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
      gV.stroke(); gV.restore();
      var m = s.w * 1.6 + 2; pv = [x0 - m, y0 - m, x1 + m, y1 + m];
    }

    function showRing(x, y, d) {
      ring.style.display = "block"; ring.style.width = ring.style.height = Math.max(6, d) + "px";
      ring.style.transform = "translate(" + (x - Math.max(6, d) / 2) + "px," + (y - Math.max(6, d) / 2) + "px)";
    }
    function hideRing() { ring.style.display = "none"; }
    function ringSize(kind, erasing) { return erasing ? (kind === "stroke" ? ERR[sizeIx()] * 2 : ERW[sizeIx()]) : kind === "hl" ? HLW[sizeIx()] : PENW[sizeIx()] * 1.6; }

    /* history */
    function push(op) { var h = histOf(key()); h.u.push(op); if (h.u.length > 300) h.u.shift(); h.r.length = 0; }
    function persist() { save(key()); if (cfg.onChange) cfg.onChange(); }
    function eraseTo(x, y) {
      var l = list(), r = ERR[sizeIx()], lx = cur.lx, ly = cur.ly, dx = x - lx, dy = y - ly, n = Math.max(1, Math.ceil(Math.sqrt(dx * dx + dy * dy) / (r / 2))), hit = false;
      for (var j = 1; j <= n; j++) {
        var px = lx + dx * j / n, py = ly + dy * j / n;
        for (var i = l.length - 1; i >= 0; i--) {
          if (l[i].k !== "er" && hitStroke(l[i], px, py, r)) { cur.removed.push({ s: l[i], i: i }); l.splice(i, 1); hit = true; }
        }
      }
      cur.lx = x; cur.ly = y;
      if (hit) redraw();
    }
    function addPoint(s, ev) {
      var q = pos(ev), p = s.pts, last = p[p.length - 1];
      if (Math.abs(q[0] - last[0]) < 0.4 && Math.abs(q[1] - last[1]) < 0.4) return;
      if (s.pr) { var lp = last[2] === undefined ? 0.5 : last[2], pr = ev.pressure > 0 ? ev.pressure : lp; q.push(r2(lp + (pr - lp) * 0.5)); }
      p.push(q); step(s, p.length - 1);
    }

    /* fingers in pen-only mode scroll (the pad page, or the nearest scrolling ancestor of a layer) */
    function setTop(sc, v) { if (sc === doc.scrollingElement || sc === doc.documentElement || sc === doc.body) window.scrollTo(0, v); else sc.scrollTop = v; }
    function getTop(sc) { return sc === doc.scrollingElement || sc === doc.documentElement || sc === doc.body ? (window.pageYOffset || 0) : sc.scrollTop; }
    function startScroll(e) {
      var sc = cfg.scroller(); if (!sc) return;
      cancelAnimationFrame(inertia);
      try { B.setPointerCapture(e.pointerId); } catch (x) {}
      cur = { type: "scroll", pid: e.pointerId, y: e.clientY, top: getTop(sc), sc: sc, smp: [[e.timeStamp, e.clientY]] };
    }
    function moveScroll(e) {
      var c = cur; setTop(c.sc, c.top - (e.clientY - c.y));
      c.smp.push([e.timeStamp, e.clientY]); if (c.smp.length > 6) c.smp.shift();
    }
    function endScroll(c) {
      var a = c.smp[0], b = c.smp[c.smp.length - 1], dt = b[0] - a[0];
      var v = dt > 0 && b[0] - a[0] < 200 ? -(b[1] - a[1]) / dt : 0, last = performance.now();     /* px per ms */
      if (Math.abs(v) < 0.15) return;
      (function tick(now) {
        var d = Math.min(40, now - last); last = now;
        setTop(c.sc, getTop(c.sc) + v * d); v *= Math.pow(0.95, d / 16);
        if (Math.abs(v) > 0.03 && !dead) inertia = requestAnimationFrame(tick);
      })(last);
    }

    function down(e) {
      if (ro || dead) return;
      var pt = e.pointerType || "mouse";
      if (pt === "touch" && prefs.penOnly) { if (!cur) startScroll(e); return; }
      if (e.button !== 0 && !(pt === "pen" && e.button === 5)) return;
      if (pt === "pen") {
        notePen();
        if (cur && cur.type === "touch") { var l0 = list(), at = l0.indexOf(cur.s); if (at >= 0) l0.splice(at, 1); cur = null; clearPv(); redraw(); }   /* a palm landed first */
      }
      if (cur) return;
      e.preventDefault();
      try { B.focus({ preventScroll: true }); } catch (x) {}
      try { B.setPointerCapture(e.pointerId); } catch (x) {}
      var p = pos(e), t = cfg.tool(), penEr = pt === "pen" && (e.button === 5 || (e.buttons & 32) || (e.buttons & 2));
      var erasing = penEr || t === "eraser";
      if (erasing && prefs.emode === "stroke") {
        cur = { type: pt, pid: e.pointerId, stroke: true, removed: [], lx: p[0], ly: p[1] };
        showRing(p[0], p[1], ringSize("stroke", true)); eraseTo(p[0], p[1]); return;
      }
      var kind = erasing ? "er" : t === "hl" ? "hl" : "pen";
      var s = { k: kind, c: prefs.color, w: widthFor(kind), pr: kind === "pen" && pt === "pen", pts: [p] };
      if (s.pr) p.push(r2(e.pressure > 0 ? e.pressure : 0.5));
      cur = { type: pt, pid: e.pointerId, s: s, erasing: erasing };
      list().push(s); step(s, 0);
      if (erasing) showRing(p[0], p[1], ringSize("area", true)); else hideRing();
    }
    function move(e) {
      if (dead) return;
      if (cur && e.pointerId === cur.pid) {
        if (cur.type === "scroll") { moveScroll(e); return; }
        var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
        if (!evs || !evs.length) evs = [e];
        if (cur.stroke) { evs.forEach(function (ev) { var q = pos(ev); eraseTo(q[0], q[1]); }); var q2 = pos(e); showRing(q2[0], q2[1], ringSize("stroke", true)); }
        else {
          evs.forEach(function (ev) { addPoint(cur.s, ev); });
          if (cur.erasing) { var q3 = pos(e); showRing(q3[0], q3[1], ringSize("area", true)); } else preview(e, cur.s);
        }
        return;
      }
      if (ro || cur || e.pointerType !== "pen") return;
      var barrel = (e.buttons & 2) || (e.buttons & 32), t = cfg.tool(), q = pos(e);   /* hover preview: a ring the size of the tool at the tip */
      if (barrel || t === "eraser") showRing(q[0], q[1], ringSize(prefs.emode, true));
      else showRing(q[0], q[1], ringSize(t, false));
    }
    function up(e) {
      if (!cur || (e && e.pointerId !== cur.pid)) return;
      var c = cur; cur = null; hideRing();
      if (c.type === "scroll") { endScroll(c); return; }
      clearPv();
      if (c.stroke) { if (c.removed.length) push({ t: "d", items: c.removed }); }
      else { tail(c.s); push({ t: "a", s: c.s }); }
      persist();
    }

    function apply(op, undo) {
      var l = list();
      if (op.t === "a") { if (undo) { var at = l.indexOf(op.s); if (at >= 0) l.splice(at, 1); } else l.push(op.s); }
      else if (op.t === "d") {
        if (undo) for (var i = op.items.length - 1; i >= 0; i--) l.splice(Math.min(op.items[i].i, l.length), 0, op.items[i].s);
        else op.items.forEach(function (it) { var at2 = l.indexOf(it.s); if (at2 >= 0) l.splice(at2, 1); });
      } else if (op.t === "c") { if (undo) Array.prototype.push.apply(l, op.items); else l.length = 0; }
    }
    E.undo = function () {
      var h = histOf(key()), l = list(), op = h.u.pop();
      if (!op && l.length) op = { t: "a", s: l[l.length - 1] };      /* after a reload: step back through the saved strokes */
      if (!op) return;
      cur = null; clearPv(); apply(op, true); h.r.push(op); redraw(); persist();
    };
    E.redo = function () {
      var h = histOf(key()), op = h.r.pop(); if (!op) return;
      cur = null; clearPv(); apply(op, false); h.u.push(op); redraw(); persist();
    };
    E.canUndo = function () { return histOf(key()).u.length > 0 || list().length > 0; };
    E.canRedo = function () { return histOf(key()).r.length > 0; };
    E.clear = function () {
      var l = list(); if (!l.length) return;
      push({ t: "c", items: l.slice() }); l.length = 0; cur = null; redraw(); persist();
    };
    E.hasMarks = function () { return list().some(function (s) { return s.k !== "er"; }); };
    E.readonly = function (on) { ro = !!on; if (ro) { cur = null; hideRing(); clearPv(); } };
    E.reset = function () { cur = null; clearPv(); hideRing(); redraw(); };
    E.fit = fit; E.redraw = redraw; E.canvas = B;
    E.destroy = function () {
      if (cur && !cur.stroke && cur.type !== "scroll") { try { tail(cur.s); persist(); } catch (x) {} }
      dead = true; cur = null; cancelAnimationFrame(inertia);
      engines = engines.filter(function (x) { return x !== E; });
    };

    B.addEventListener("pointerdown", down);
    B.addEventListener("pointermove", move);
    B.addEventListener("pointerup", up);
    B.addEventListener("pointercancel", up);
    B.addEventListener("pointerleave", function (e) { if (!cur) hideRing(); });
    ["contextmenu", "selectstart", "dragstart"].forEach(function (n) { B.addEventListener(n, function (e) { e.preventDefault(); }); });
    if (cfg.keys) B.addEventListener("keydown", function (e) {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      var k = e.key.toLowerCase();
      if (k === "z") { e.preventDefault(); e.stopPropagation(); e.shiftKey ? E.redo() : E.undo(); }
      else if (k === "y") { e.preventDefault(); e.stopPropagation(); E.redo(); }
    });
    engines.push(E);
    return E;
  }
  var themeObs = null;
  function watchTheme() {
    if (themeObs) return;
    refreshPal();
    themeObs = new MutationObserver(function () { refreshPal(); engines.forEach(function (x) { x.redraw(); }); });
    themeObs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---------- the pad ---------- */
  var ctx = "default", paper = PAPERS.indexOf(lsGet(LS.paper, "grid")) >= 0 ? lsGet(LS.paper, "grid") : "grid";
  var exam = lsGet(LS.exam, "0") === "1", isOpen = false, tab = "draw";
  var drawer, pane, btn, sheet, page, E, built = false, calcExpr = "", calcRes = "", calcDone = false, moreBtn, pop = null, popFor = "";
  var dockHost = null, dockedOn = false, lessonHost = null, lessonOn = false;
  var el = {};
  var sc = null;   /* sheets: { scope, qid, group, label } while the pad is in sheet mode, else null */

  /* ---------- rough-work sheets ---------- */
  var sheetsAll = (function () { try { var o = JSON.parse(ssGet(SS.sheets) || ""); if (o && o.d && o.o) return o; } catch (e) {} return { o: [], d: {} }; })();
  function sheetMode() { return lsGet(LS.smode, "auto") === "manual" ? "manual" : "auto"; }
  function saveSheets() { ssSet(SS.sheets, JSON.stringify(sheetsAll)); }
  function scopeData(scope) {
    var d = sheetsAll.d[scope];
    if (!d) { d = sheetsAll.d[scope] = { list: [], map: {}, groups: {}, lab: {}, cur: "", n: 0 }; }
    sheetsAll.o = sheetsAll.o.filter(function (x) { return x !== scope; }); sheetsAll.o.push(scope);
    while (sheetsAll.o.length > 5) delete sheetsAll.d[sheetsAll.o.shift()];
    return d;
  }
  function isBlank(key) { return !key || !(store.s[key] || []).some(function (s) { return s.k !== "er"; }); }
  function newSheetKey(d) { d.n = Math.max(d.n || 0, d.list.length) + 1; var k = "sheet:" + sc.scope + ":" + d.n; d.list.push(k); return k; }
  function assign(d, key) {
    d.cur = key; d.map[sc.qid] = key; if (sc.group) d.groups[sc.group] = key;
    if (sc.label) d.lab[sc.qid] = sc.label;
  }
  function chooseSheet() {
    var d = scopeData(sc.scope), key = d.map[sc.qid];
    if (!key || d.list.indexOf(key) < 0) {
      if (sheetMode() === "manual") key = d.cur && d.list.indexOf(d.cur) >= 0 ? d.cur : newSheetKey(d);
      else if (sc.group && d.groups[sc.group] && d.list.indexOf(d.groups[sc.group]) >= 0) key = d.groups[sc.group];
      else if (d.cur && d.list.indexOf(d.cur) >= 0 && isBlank(d.cur)) key = d.cur;
      else key = newSheetKey(d);
    }
    assign(d, key); saveSheets(); return key;
  }
  function showSheet(key) {
    ctx = key;
    if (built) { setCtxLabel(); syncPager(); closePop(); sheet.scrollTop = 0; padFit(); E.reset(); syncUndo(); }
  }
  function flipSheet(delta) {
    if (!sc) return;
    var d = scopeData(sc.scope), i = d.list.indexOf(ctx) + delta;
    if (i < 0 || i >= d.list.length) return;
    assign(d, d.list[i]); saveSheets(); showSheet(d.list[i]);
  }
  function newSheet() {
    if (!sc) return;
    if (isBlank(ctx)) { if (el.nw) { el.nw.classList.add("flash"); setTimeout(function () { el.nw && el.nw.classList.remove("flash"); }, 700); } return; }
    var d = scopeData(sc.scope), k = newSheetKey(d);
    assign(d, k); saveSheets(); showSheet(k);
  }
  function sheetNote() {
    var d = scopeData(sc.scope), qs = [];
    Object.keys(d.map).forEach(function (q) { if (d.map[q] === ctx && d.lab[q]) qs.push(d.lab[q]); });
    return "Sheet " + (d.list.indexOf(ctx) + 1) + (qs.length ? " \u00b7 " + qs.join(", ") : "");
  }
  function syncPager() {
    if (!built) return;
    el.pager.hidden = !sc; el.sm.hidden = !sc;
    if (!sc) return;
    var d = scopeData(sc.scope), i = d.list.indexOf(ctx);
    el.pgt.textContent = "Sheet " + (i + 1) + " of " + d.list.length;
    el.prev.disabled = i <= 0; el.next.disabled = i >= d.list.length - 1;
    var m = sheetMode(), t = m === "auto" ? "Sheets: Auto. A new question gets a fresh sheet unless it shares a chart or passage with an earlier one (tap for Manual)" : "Sheets: Manual. One sheet continues until you tap New sheet (tap for Auto)";
    el.sm.innerHTML = svg("sheets") + '<span class="rw-lb">Sheets: ' + (m === "auto" ? "Auto" : "Manual") + '</span>'; el.sm.title = t; el.sm.setAttribute("aria-label", t);
  }

  function pages() { return Math.max(2, Math.min(MAXPAGES, store.pg[ctx] || 2)); }
  function neededPages(unit) {
    var m = 0; listOf(ctx).forEach(function (s) { m = Math.max(m, bboxY(s)); });
    return unit ? Math.min(MAXPAGES, Math.ceil((m + 24) / unit)) : 1;
  }
  function bboxY(s) { return s.pts.length ? bbox(s)[3] : 0; }
  function padFit() {
    if (!built || !sheet) return;
    var unit = sheet.clientHeight; if (!unit) return;
    var n = Math.max(pages(), neededPages(unit));
    if (n !== store.pg[ctx] && n > 2) store.pg[ctx] = n;
    page.style.height = n * unit + "px";
    moreBtn.hidden = n >= MAXPAGES;
    E.fit();
  }
  function addPage() {
    var n = pages(); if (n >= MAXPAGES) return;
    store.pg[ctx] = n + 1; save(ctx); padFit();
    var top = sheet.scrollTop; sheet.scrollTop = top + sheet.clientHeight * 0.6;
  }

  /* ---------- calculator ---------- */
  function calcPaint() {
    el.expr.textContent = calcExpr || " ";
    el.res.classList.remove("err");
    if (calcRes && calcRes.err) { el.res.textContent = calcRes.err; el.res.classList.add("err"); }
    else el.res.textContent = calcRes === "" ? "0" : fmtNum(calcRes);
  }
  function calcLive() {
    if (!calcExpr) { calcRes = ""; return; }
    try { calcRes = calcEval(calcExpr); } catch (e) { calcRes = ""; }   /* quiet while typing */
  }
  function calcInput(t) {
    if (calcDone) {
      if (/^[\d.(√]$/.test(t)) calcExpr = "";                      /* start fresh after = */
      else if (typeof calcRes === "number") calcExpr = String(parseFloat(calcRes.toPrecision(12)));
      else calcExpr = "";
      calcDone = false;
    }
    calcExpr += t; calcLive(); calcPaint();
  }
  function calcKey(k) {
    if (k === "C") { calcExpr = ""; calcRes = ""; calcDone = false; calcPaint(); }
    else if (k === "⌫") { if (calcDone) { calcDone = false; } calcExpr = calcExpr.slice(0, -1); calcLive(); calcPaint(); }
    else if (k === "=") {
      if (!calcExpr) return;
      try { calcRes = calcEval(calcExpr); calcDone = true; calcExpr += " ="; }
      catch (e) { calcRes = { err: e.message }; }
      calcPaint();
    }
    else calcInput(k);
  }
  var KEYMAP = { "*": "×", "x": "×", "X": "×", "/": "÷", "-": "−" };
  function calcKeydown(e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    var k = e.key, m = null;
    if (/^[0-9.+()%]$/.test(k)) m = k;
    else if (KEYMAP[k]) m = KEYMAP[k];
    else if (k === "Enter" || k === "=") m = "=";
    else if (k === "Backspace") m = "⌫";
    else if (k === "Delete" || k === "c" || k === "C") m = "C";
    else if (k === "r" || k === "R") m = "√(";
    else if (k === "^" || k === "q") m = "²";
    if (m === null) return;
    e.preventDefault(); e.stopPropagation(); calcKey(m);
  }

  /* ---------- build ---------- */
  function tbBtn(attrs, icon, label, title) {
    return '<button type="button" class="rw-tb" ' + attrs + ' title="' + title + '" aria-label="' + title + '">' + icon + '<span class="rw-lb">' + label + '</span></button>';
  }
  function build() {
    if (built) return; built = true;
    watchTheme();
    drawer = doc.createElement("aside");
    drawer.className = "rw-drawer"; drawer.id = "rwDrawer"; drawer.setAttribute("aria-label", "Rough work");
    drawer.setAttribute("inert", "");
    var keys = [["C", "fn"], ["(", "fn"], [")", "fn"], ["÷", "op"], ["7"], ["8"], ["9"], ["×", "op"], ["4"], ["5"], ["6"], ["−", "op"],
      ["1"], ["2"], ["3"], ["+", "op"], ["0"], ["."], ["⌫", "fn"], ["=", "eq"], ["√(", "fn", "√"], ["²", "fn", "x²"], ["%", "fn"]];
    drawer.innerHTML =
      '<div class="rw-head"><h4>Rough work</h4><span class="rw-ctx"></span>' +
      '<button type="button" class="rw-tb" id="rwClose" title="Close (W or Esc)" aria-label="Close rough work">' + svg("close") + '</button></div>' +
      '<div class="rw-pane" id="rwPane">' +
      '<div class="rw-dhead"><h4>Rough work</h4><span class="rw-ctx"></span>' +
        '<button type="button" class="rw-tb" id="rwHide" title="Hide the pad (W)" aria-label="Hide the rough work pad">' + svg("hide") + '</button></div>' +
      '<div class="rw-tabs" role="tablist"><button type="button" data-t="draw" class="on" role="tab">Draw</button><button type="button" data-t="notes" role="tab">Notes</button><button type="button" data-t="calc" role="tab">Calculator</button></div>' +
      '<div class="rw-panel" data-p="draw"><div class="rw-pager" id="rwPager" hidden><button type="button" class="rw-tb" id="rwPrev" title="Previous sheet" aria-label="Previous sheet">\u2039</button>' +
        '<span class="rw-pg-t" id="rwPgT" aria-live="polite"></span><button type="button" class="rw-tb" id="rwNext" title="Next sheet" aria-label="Next sheet">\u203a</button>' +
        '<button type="button" class="rw-tb rw-new" id="rwNew" title="Start a new blank sheet" aria-label="New sheet">New sheet</button></div>' +
        '<div class="rw-tools" role="toolbar" aria-label="Drawing tools"><span class="rw-grp">' +
        tbBtn('data-tool="pen" aria-pressed="true"', '<i class="rw-dot"></i>' + svg("pencil"), "Pen", "Pen (tap again for colour)") +
        tbBtn('data-tool="hl" aria-pressed="false"', svg("marker"), "Marker", "Highlighter") +
        tbBtn('data-tool="eraser" aria-pressed="false"', svg("eraser"), "Eraser", "Eraser (tap again for stroke or area)") +
        '</span><span class="rw-gap"></span><span class="rw-grp">' +
        tbBtn('id="rwUndo"', svg("undo"), "Undo", "Undo (Ctrl+Z)") + tbBtn('id="rwRedo"', svg("redo"), "Redo", "Redo (Ctrl+Shift+Z)") +
        '</span><span class="rw-gap wide"></span>' +
        tbBtn('id="rwClear"', svg("trash"), "Clear", "Clear drawing") +
        '<span class="rw-gap"></span><span class="rw-grp">' +
        tbBtn('id="rwPaper"', "", "Paper", "Paper") + tbBtn('id="rwSize"', "", "Thin", "Pen size") + tbBtn('id="rwPO" aria-pressed="false"', "", "Pen only", "Pen only") +
        '<button type="button" class="rw-tb rw-sm" id="rwSM" hidden></button>' +
        '</span></div>' +
        '<div class="rw-sheet" id="rwSheet"><div class="rw-page" id="rwPage"><button type="button" class="rw-more" id="rwMore">More space</button></div></div></div>' +
      '<div class="rw-panel" data-p="notes" hidden><textarea class="rw-notes" id="rwNotes" placeholder="Jot things down. Notes are saved in this browser." spellcheck="false"></textarea></div>' +
      '<div class="rw-panel rw-calc" data-p="calc" tabindex="0" hidden aria-label="Calculator (type with the keyboard)"><div class="rw-disp"><div class="rw-expr" id="rwExpr"></div><div class="rw-res" id="rwRes">0</div></div>' +
        '<div class="rw-keys">' + keys.map(function (k) { return '<button type="button" tabindex="-1" class="' + (k[1] || "") + '" data-k="' + k[0] + '">' + (k[2] || k[0]) + '</button>'; }).join("") + '</div></div>' +
      '<div class="rw-exam"><button type="button" class="rw-sw" id="rwExam" role="switch" aria-checked="false" aria-label="Exam mode"></button>' +
        '<span id="rwExamTxt">Exam mode (no calculator, like the real test)</span></div></div>';
    doc.body.appendChild(drawer);

    pane = drawer.querySelector("#rwPane");
    el.expr = drawer.querySelector("#rwExpr"); el.res = drawer.querySelector("#rwRes");
    el.notes = drawer.querySelector("#rwNotes"); el.exam = drawer.querySelector("#rwExam"); el.examTxt = drawer.querySelector("#rwExamTxt");
    el.ctxs = drawer.querySelectorAll(".rw-ctx"); el.calc = drawer.querySelector('[data-p="calc"]');
    el.paper = drawer.querySelector("#rwPaper"); el.undo = drawer.querySelector("#rwUndo"); el.redo = drawer.querySelector("#rwRedo");
    el.size = drawer.querySelector("#rwSize"); el.po = drawer.querySelector("#rwPO"); el.draw = drawer.querySelector('[data-p="draw"]');
    el.tools = drawer.querySelectorAll("[data-tool]");
    el.pager = drawer.querySelector("#rwPager"); el.pgt = drawer.querySelector("#rwPgT"); el.prev = drawer.querySelector("#rwPrev"); el.next = drawer.querySelector("#rwNext");
    el.nw = drawer.querySelector("#rwNew"); el.sm = drawer.querySelector("#rwSM");
    sheet = drawer.querySelector("#rwSheet"); page = drawer.querySelector("#rwPage"); moreBtn = drawer.querySelector("#rwMore");

    E = Engine({
      wrap: page, id: "rwPad", label: "Drawing area", keys: false,
      key: function () { return ctx; }, tool: function () { return prefs.tool; }, scroller: function () { return sheet; },
      onChange: syncUndo
    });
    page.insertBefore(moreBtn, null);   /* keep the button above the canvases */

    drawer.querySelector("#rwClose").onclick = close;
    drawer.querySelector("#rwHide").onclick = function () { requestToggle(); };
    drawer.querySelector("#rwClear").onclick = function () { E.clear(); };
    el.undo.onclick = function () { E.undo(); }; el.redo.onclick = function () { E.redo(); };
    moreBtn.onclick = addPage;
    el.tools.forEach(function (b) {
      b.onclick = function () {
        var t = b.dataset.tool;
        if (prefs.tool === t && t !== "hl") { popFor === t && pop ? closePop() : openPop(t, b); return; }     /* second tap on the active pen / eraser: colour or mode */
        closePop(); prefs.tool = t; lsSet(LS.tool, t); syncTools();
      };
    });
    el.size.onclick = function () { prefs.size = prefs.size === "thin" ? "med" : "thin"; lsSet(LS.size, prefs.size); syncTools(); };
    el.po.onclick = function () { prefs.penOnly = !prefs.penOnly; lsSet(LS.penonly, prefs.penOnly ? "1" : "0"); syncTools(); };
    el.prev.onclick = function () { flipSheet(-1); }; el.next.onclick = function () { flipSheet(1); }; el.nw.onclick = newSheet;
    el.sm.onclick = function () { lsSet(LS.smode, sheetMode() === "auto" ? "manual" : "auto"); syncPager(); };
    el.paper.onclick = function () { setPaper(PAPERS[(PAPERS.indexOf(paper) + 1) % PAPERS.length]); };
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { b.onclick = function () { setTab(b.dataset.t); }; });
    pane.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pop) { e.stopPropagation(); closePop(); return; }
      if (!(e.ctrlKey || e.metaKey) || e.altKey || (e.target && e.target.tagName === "TEXTAREA")) return;
      var k = e.key.toLowerCase();
      if (k === "z") { e.preventDefault(); e.stopPropagation(); e.shiftKey ? E.redo() : E.undo(); }
      else if (k === "y") { e.preventDefault(); e.stopPropagation(); E.redo(); }
    });
    doc.addEventListener("pointerdown", function (e) { if (pop && !pop.contains(e.target) && !(e.target.closest && e.target.closest("[data-tool]"))) closePop(); }, true);
    el.notes.value = lsGet(LS.notes, "");
    el.notes.addEventListener("input", function () { lsSet(LS.notes, el.notes.value); });
    el.calc.addEventListener("keydown", calcKeydown);
    drawer.querySelectorAll(".rw-keys button").forEach(function (b) {
      b.onclick = function () { calcKey(b.dataset.k); el.calc.focus({ preventScroll: true }); };
    });
    el.exam.onclick = function () { setExam(!exam); };
    setExam(exam, true);
    setPaper(paper, true);
    uiSync = syncTools;
    syncTools(); syncUndo();
    calcPaint();
    setCtxLabel(); syncPager();
    syncTabEnd();

    if (window.ResizeObserver) new ResizeObserver(padFit).observe(sheet);
    window.addEventListener("resize", function () { padFit(); if (lessonOn && !lessonEligible()) closeLesson(); });
    padFit();
  }
  // the drawer starts under the header as it is right now (0 when the header is hidden: tablet rail, focus mode)
  function placeTop() {
    var hd = doc.getElementById("topbar"), top = 0;
    if (hd && hd.offsetHeight && getComputedStyle(hd).display !== "none") top = Math.max(0, hd.getBoundingClientRect().bottom);
    drawer.style.setProperty("--rw-top", top + "px");
  }

  function syncTools() {
    if (!built) return;
    el.tools.forEach(function (b) { var on = b.dataset.tool === prefs.tool; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    var pc = prefs.color === "red" ? "var(--red)" : prefs.color === "blue" ? "var(--rw-blue)" : "var(--text)";
    pane.style.setProperty("--rw-pc", pc);
    var eb = drawer.querySelector('[data-tool="eraser"] .rw-lb'); if (eb) eb.textContent = prefs.emode === "area" ? "Area" : "Eraser";
    el.size.innerHTML = svg(prefs.size === "med" ? "med" : "thin") + '<span class="rw-lb">' + (prefs.size === "med" ? "Medium" : "Thin") + '</span>';
    var st2 = "Pen size: " + (prefs.size === "med" ? "medium" : "thin") + " (tap to change)"; el.size.title = st2; el.size.setAttribute("aria-label", st2);
    el.size.classList.toggle("on", false);
    el.po.innerHTML = svg(prefs.penOnly ? "stylus" : "finger") + '<span class="rw-lb">' + (prefs.penOnly ? "Pen only" : "Finger too") + '</span>';
    el.po.classList.toggle("on", prefs.penOnly); el.po.setAttribute("aria-pressed", prefs.penOnly);
    var pt2 = prefs.penOnly ? "Pen only: fingers scroll, the pen writes (tap to let fingers draw too)" : "Finger too: fingers draw as well (tap for pen only)";
    el.po.title = pt2; el.po.setAttribute("aria-label", pt2);
    if (pop) closePop();
  }
  function syncUndo() {
    if (!built) return;
    el.undo.disabled = !E.canUndo(); el.redo.disabled = !E.canRedo();
  }
  function closePop() { if (pop) { pop.remove(); pop = null; popFor = ""; } }
  function openPop(which, anchor) {
    closePop(); popFor = which;
    pop = doc.createElement("div"); pop.className = "rw-pop"; pop.setAttribute("role", "group");
    if (which === "pen") {
      pop.setAttribute("aria-label", "Pen colour");
      [["ink", "Ink", "var(--text)"], ["red", "Red", "var(--red)"], ["blue", "Blue", "var(--rw-blue)"]].forEach(function (c) {
        var b = doc.createElement("button"); b.type = "button"; b.className = "rw-pb"; b.dataset.color = c[0];
        b.setAttribute("role", "radio"); b.setAttribute("aria-checked", prefs.color === c[0]); b.title = c[1]; b.setAttribute("aria-label", c[1] + " pen");
        b.innerHTML = '<span class="sq" style="background:' + c[2] + '"></span>';
        b.onclick = function () { prefs.color = c[0]; lsSet(LS.color, c[0]); syncTools(); };
        pop.appendChild(b);
      });
    } else {
      pop.setAttribute("aria-label", "Eraser mode");
      [["stroke", "Stroke"], ["area", "Area"]].forEach(function (c) {
        var b = doc.createElement("button"); b.type = "button"; b.className = "rw-pb"; b.dataset.mode = c[0];
        b.setAttribute("role", "radio"); b.setAttribute("aria-checked", prefs.emode === c[0]); b.textContent = c[1];
        b.title = c[0] === "stroke" ? "Touch a stroke to remove all of it" : "Rub out like a pixel eraser";
        b.onclick = function () { prefs.emode = c[0]; lsSet(LS.emode, c[0]); syncTools(); };
        pop.appendChild(b);
      });
    }
    el.draw.appendChild(pop);
    pop.style.top = anchor.offsetTop + anchor.offsetHeight + 4 + "px";
    pop.style.left = Math.max(0, Math.min(anchor.offsetLeft, el.draw.clientWidth - pop.offsetWidth)) + "px";
  }
  function setCtxLabel() {
    if (!el.ctxs) return;
    if (sc) { var sn = sheetNote(); el.ctxs.forEach(function (n) { n.textContent = sn; }); return; }
    var t = ctx && ctx !== "default" ? (ctx.indexOf("lesson:") === 0 ? "saved for this lesson" : "saved for this question") : "";
    el.ctxs.forEach(function (n) { n.textContent = t; });
  }
  function syncTabEnd() {   /* the last visible tab has no right rule */
    var vis = Array.prototype.filter.call(drawer.querySelectorAll(".rw-tabs button"), function (b) { return !b.hidden; });
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { b.removeAttribute("data-last"); });
    if (vis.length) vis[vis.length - 1].setAttribute("data-last", "");
  }
  function setPaper(p, quiet) {
    paper = p; if (!quiet) lsSet(LS.paper, p);
    sheet.dataset.paper = p;
    el.paper.innerHTML = svg(p) + '<span class="rw-lb">Paper</span>';
    var t = "Paper: " + PAPER_NAME[p] + " (tap to change)"; el.paper.title = t; el.paper.setAttribute("aria-label", t);
  }
  function setTab(t) {
    if (t === "calc" && exam) t = "draw";
    tab = t;
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { var on = b.dataset.t === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    drawer.querySelectorAll(".rw-panel").forEach(function (p) { p.hidden = p.dataset.p !== t; });
    if (t !== "draw") closePop();
    if (t === "draw") padFit();
    var f = t === "notes" ? el.notes : t === "calc" ? el.calc : null; if (f && (isOpen || dockedOn)) f.focus({ preventScroll: true });
  }
  function setExam(on, quiet) {
    exam = !!on; lsSet(LS.exam, exam ? "1" : "0");
    el.exam.setAttribute("aria-checked", exam ? "true" : "false");
    drawer.querySelector('.rw-tabs [data-t="calc"]').hidden = exam;
    syncTabEnd();
    el.examTxt.textContent = exam ? "Exam mode on. Calculator is off in exam mode." : "Exam mode (no calculator, like the real test)";
    if (exam && tab === "calc") setTab("draw");
  }

  /* ---------- lesson dock (tablet landscape, pages with #sidebar) ---------- */
  function lessonEligible() {
    var d = root.dataset;
    return !!doc.getElementById("sidebar") && d.device === "tablet" && d.orient !== "portrait" && !doc.body.classList.contains("in-session");
  }
  function lessonKey() { return "lesson:" + (location.pathname.split("/").pop() || "index") + location.hash; }
  function openLesson() {
    build(); if (isOpen) close();
    if (!lessonHost) { lessonHost = doc.createElement("div"); lessonHost.id = "rwLessonDock"; lessonHost.className = "rw-ld-host"; doc.body.appendChild(lessonHost); }
    var w = Math.round(Math.max(380, Math.min(540, window.innerWidth * 0.42)));
    root.style.setProperty("--rw-ld-w", w + "px"); root.classList.add("rw-ld");
    lessonHost.hidden = false; lessonOn = true;
    dock(lessonHost); setContext(lessonKey()); setOn(true);
  }
  function closeLesson() {
    if (!lessonOn) return; lessonOn = false;
    root.classList.remove("rw-ld"); if (lessonHost) lessonHost.hidden = true;
    undock(); setOn(false);
  }
  window.addEventListener("hashchange", function () { if (lessonOn) setContext(lessonKey()); });

  /* ---------- API ---------- */
  function open() {
    build(); if (dockedOn || isOpen) return; isOpen = true;
    placeTop();
    drawer.removeAttribute("inert");
    drawer.classList.add("show"); setOn(true);
    setTab(tab); padFit();
    requestAnimationFrame(padFit);
  }
  function close() {
    if (!built || !isOpen) return; isOpen = false;
    var a = doc.activeElement; if (a && drawer.contains(a)) a.blur();
    drawer.classList.remove("show"); drawer.setAttribute("inert", ""); setOn(false);
    closePop(); E.reset();
  }
  function setOn(v) { doc.querySelectorAll("#rwBtn, .gr-rough").forEach(function (b) { b.classList.toggle("on", v); }); }
  /* docked: ask the page that owns the dock to show / hide it; with no owner, just hide the host */
  function requestToggle() {
    if (lessonOn) return closeLesson();
    var ev = new CustomEvent("apt:rwtoggle", { cancelable: true });
    doc.dispatchEvent(ev);
    if (!ev.defaultPrevented && dockHost) dockHost.hidden = !dockHost.hidden;
  }
  function toggle() {
    if (dockedOn) return requestToggle();
    if (lessonEligible()) return openLesson();
    isOpen ? close() : open();
  }
  function clear() {
    if (built) E.clear();
    else { var l = listOf(ctx); if (l.length) { l.length = 0; save(ctx); } }
  }
  function undo() { if (built) E.undo(); }
  function redo() { if (built) E.redo(); }
  function setContext(id, opts) {
    if (opts && opts.scope != null && id != null && id !== "") {
      sc = { scope: String(opts.scope), qid: String(id), group: opts.group ? String(opts.group) : "", label: opts.label ? String(opts.label) : "" };
      showSheet(chooseSheet()); return;
    }
    sc = null;
    ctx = id == null || id === "" ? "default" : String(id);
    if (built) { setCtxLabel(); syncPager(); closePop(); sheet.scrollTop = 0; padFit(); E.reset(); syncUndo(); }
  }
  /* dock the whole pad (tabs, tools, canvas, exam switch) into a page column. Cheap and idempotent; call after every re-render. */
  function dock(host) {
    if (!host) return;
    build();
    if (isOpen) close();
    dockedOn = true; dockHost = host;
    if (pane.parentNode !== host) host.appendChild(pane);
    pane.classList.add("docked");
    padFit(); requestAnimationFrame(padFit);
  }
  function undock() {
    if (!built || !dockedOn) return;
    var wasLesson = lessonOn; if (wasLesson) { lessonOn = false; root.classList.remove("rw-ld"); if (lessonHost) lessonHost.hidden = true; setOn(false); }
    dockedOn = false; dockHost = null; closePop(); E.reset();
    pane.classList.remove("docked");
    if (pane.parentNode !== drawer) drawer.appendChild(pane);
  }

  /* ---------- layer factory: the same engine over any element (mark up a question) ---------- */
  function normTool(t) { t = String(t || "").toLowerCase(); return t === "highlighter" || t === "marker" || t === "highlight" ? "hl" : t === "eraser" || t === "erase" ? "eraser" : t === "pen" ? "pen" : "hl"; }
  function layer(host, contextKey) {
    if (!host) return null;
    watchTheme();
    var key = "mk:" + contextKey, ltool = "hl", madeRel = false;
    if (getComputedStyle(host).position === "static") { host.style.position = "relative"; madeRel = true; }
    var wrap = doc.createElement("div"); wrap.className = "rw-layer"; host.appendChild(wrap);
    var L = Engine({
      wrap: wrap, label: "Mark-up layer", keys: true,
      key: function () { return key; }, tool: function () { return ltool; },
      scroller: function () {
        for (var n = host.parentElement; n && n !== doc.body && n !== root; n = n.parentElement) {
          var oy = getComputedStyle(n).overflowY;
          if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1) return n;
        }
        return doc.scrollingElement || root;
      }
    });
    var obs = window.ResizeObserver ? new ResizeObserver(function () { L.fit(); }) : null;
    if (obs) obs.observe(wrap); else window.addEventListener("resize", L.fit);
    L.fit(); requestAnimationFrame(L.fit);
    var api = {
      clear: function () { L.clear(); },
      destroy: function () {
        if (obs) obs.disconnect(); else window.removeEventListener("resize", L.fit);
        L.destroy(); if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (madeRel) host.style.position = "";
      },
      setTool: function (t) { ltool = normTool(t); },
      hasMarks: function () { return L.hasMarks(); },
      readonly: function (on) { L.readonly(on); wrap.classList.toggle("ro", !!on); },
      undo: function () { L.undo(); },
      redo: function () { L.redo(); }
    };
    return api;
  }

  window.RoughPad = { toggle: toggle, open: open, close: close, clear: clear, undo: undo, redo: redo, setContext: setContext, dock: dock, undock: undock, docked: function () { return dockedOn; }, layer: layer, calc: calcEval };

  /* ---------- header button + keys ---------- */
  function mountBtn() {
    if (doc.getElementById("rwBtn")) return true;
    var slot = doc.querySelector("#topbar .tb-slot") || doc.querySelector(".tb-slot");
    if (!slot) return false;
    btn = doc.createElement("button");
    btn.className = "icon-btn"; btn.id = "rwBtn"; btn.type = "button";
    btn.title = "Rough work (W)"; btn.setAttribute("aria-label", "Rough work");
    btn.innerHTML = svg("pencil").replace('class="rw-ico"', 'class="rw-ico ico"');
    btn.onclick = function () { toggle(); };
    slot.parentNode.insertBefore(btn, slot);
    if (isOpen) btn.classList.add("on");
    return true;
  }
  if (!mountBtn()) doc.addEventListener("DOMContentLoaded", function () { if (!mountBtn()) setTimeout(mountBtn, 400); });

  function typing(t) {
    if (!t || !t.tagName) return false;
    var n = t.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT" || t.isContentEditable;
  }
  doc.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === "Escape") { if (isOpen) { close(); } return; }
    if ((e.key === "w" || e.key === "W") && !typing(e.target)) { e.preventDefault(); toggle(); }
  });
})();
