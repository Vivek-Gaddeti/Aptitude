/* Rough-work pad: header button + right slide-out drawer, or docked into a page column (tablet workspace).
   Tabs: Draw / Notes / Calculator.  Plain script, no dependencies.
   API: window.RoughPad = { toggle, open, close, clear, undo, setContext(id), dock(hostEl), undock(), docked() }.
   Keys: W toggles (the drawer, or the dock when docked), Esc closes the drawer, Ctrl+Z undoes inside the pad.
   Docked: toggle() does not open the drawer; it fires a cancelable "apt:rwtoggle" event on document. The page that owns the
   dock handles it (and calls preventDefault); if nobody does, the dock host is just hidden / shown. */
(function () {
  "use strict";
  if (window.RoughPad) return;
  var doc = document, root = doc.documentElement;
  var LS = { notes: "apt:rw:notes", exam: "apt:rw:exam", paper: "apt:rw:paper", size: "apt:rw:size" };
  var SS = { strokes: "apt:rw:strokes", pen: "apt:rw:pen" };
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); return true; } catch (e) { return false; } }

  var ICON = {
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    eraser: '<path d="M7 21h10M5 15l9-9 5 5-7 7H8z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
    grid: '<path d="M4 4h16v16H4zM4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
    ruled: '<path d="M4 4h16v16H4zM4 9h16M4 14h16"/>',
    blank: '<path d="M4 4h16v16H4z"/>',
    thin: '<path d="M5 12h14" style="stroke-width:1.4"/>',
    med: '<path d="M5 12h14" style="stroke-width:3.6"/>',
    hide: '<path d="M9 5l7 7-7 7"/>'
  };
  function svg(n) { return '<svg class="rw-ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }
  var PAPERS = ["grid", "ruled", "blank"], PAPER_NAME = { grid: "squared", ruled: "ruled", blank: "blank" };
  var SIZES = { thin: 2, med: 3.8 };

  /* ---------- styles ---------- */
  var css = [
    ".rw-drawer{position:fixed;top:var(--rw-top,56px);right:0;bottom:0;width:400px;max-width:100vw;background:var(--panel);color:var(--text);border-left:2px solid var(--line);",
    "transform:translateX(105%);visibility:hidden;pointer-events:none;z-index:40;display:flex;flex-direction:column;padding:1rem;box-sizing:border-box;font-family:var(--sans)}",
    ".rw-drawer.show{transform:none;visibility:visible;pointer-events:auto}",
    ".rw-drawer [hidden],.rw-pane [hidden]{display:none!important}",
    ".rw-ico{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle;flex:none}",
    "#rwBtn{display:inline-grid;place-items:center;margin-right:.35rem}",
    "#rwBtn.on{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}",
    ".rw-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem}",
    ".rw-head h4,.rw-dhead h4{margin:0;font:800 var(--fs-md) var(--display);flex:1;text-transform:none;letter-spacing:0}",
    ".rw-ctx{font-size:var(--fs-2xs);color:var(--muted)}",
    ".rw-tb{display:inline-grid;place-items:center;box-sizing:border-box;width:44px;height:44px;min-width:44px;padding:0;margin:0;border:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);box-shadow:none;cursor:pointer;font:700 var(--fs-sm) var(--display);text-transform:none;letter-spacing:0}",
    ".rw-tb:hover{background:var(--panel-2)}",
    ".rw-tb.on,.rw-tb.on:hover{background:var(--text);color:var(--bg);border-color:var(--text)}",
    ".rw-tb:disabled{opacity:.4;cursor:default}",
    ".rw-tb:focus-visible,.rw-tabs button:focus-visible{outline:3px solid var(--accent);outline-offset:1px}",
    ".rw-pane{flex:1;min-height:0;display:flex;flex-direction:column;font-family:var(--sans);color:var(--text)}",
    ".rw-dhead{display:none;align-items:center;gap:.5rem;margin-bottom:.6rem}",
    ".rw-pane.docked{height:100%;box-sizing:border-box;padding:.7rem;background:var(--panel);border:2px solid var(--line)}",
    ".rw-pane.docked .rw-dhead{display:flex}",
    ".rw-tabs{display:flex;border:2px solid var(--line-control);margin-bottom:.6rem;flex:none}",
    ".rw-tabs button{flex:1;min-height:44px;border:0;border-right:2px solid var(--line-control);border-radius:0;background:var(--panel);color:var(--text);padding:0 .4rem;font:800 var(--fs-sm) var(--display);cursor:pointer;box-shadow:none;text-transform:none;letter-spacing:0}",
    ".rw-tabs button:last-of-type,.rw-tabs button[data-last]{border-right:0}",
    ".rw-tabs button:hover{background:var(--panel-2)}",
    ".rw-tabs button.on,.rw-tabs button.on:hover{background:var(--text);color:var(--bg)}",
    ".rw-panel{flex:1;min-height:0;display:flex;flex-direction:column}",
    ".rw-tools{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:.55rem;flex:none}",
    ".rw-gap{width:6px;flex:none}",
    ".rw-seg{display:inline-flex;border:2px solid var(--line-control)}",
    ".rw-seg .rw-tb{border:0;width:40px;min-width:40px;height:40px}",
    ".rw-seg .rw-tb+.rw-tb{border-left:2px solid var(--line-control)}",
    ".rw-pane{--rw-paper:color-mix(in srgb,var(--line) 65%,transparent)}",
    ".rw-sheet{position:relative;flex:1;min-height:0;border:2px solid var(--line-control);background-color:var(--bg);overflow:hidden}",
    ".rw-sheet[data-paper=\"grid\"]{background-image:linear-gradient(var(--rw-paper) 1px,transparent 1px),linear-gradient(90deg,var(--rw-paper) 1px,transparent 1px);background-size:28px 28px}",
    ".rw-sheet[data-paper=\"ruled\"]{background-image:linear-gradient(var(--rw-paper) 1px,transparent 1px);background-size:100% 34px}",
    ".rw-pad{position:absolute;left:0;top:0;width:100%;height:100%;cursor:crosshair;touch-action:none;display:block;outline:none;-webkit-user-select:none;user-select:none}",
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
    ".rw-exam{display:flex;align-items:center;gap:.55rem;margin-top:.6rem;font-size:var(--fs-xs);color:var(--muted);flex:none}",
    ".rw-sw{width:44px;height:26px;border:2px solid var(--line-control);border-radius:0;background:var(--panel);position:relative;padding:0;cursor:pointer;flex:none;box-shadow:none}",
    ".rw-sw::after{content:\"\";position:absolute;top:3px;left:3px;width:14px;height:14px;background:var(--muted)}",
    ".rw-sw[aria-checked=\"true\"]{background:var(--accent-soft);border-color:var(--text)}",
    ".rw-sw[aria-checked=\"true\"]::after{left:21px;background:var(--text)}",
    ".rw-note-off{margin:0 0 .5rem;font-size:var(--fs-2xs);color:var(--muted)}"
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

  /* ---------- state ---------- */
  var ctx = "default", strokes = {}, order = [], backup = {}, tool = "pen", size = lsGet(LS.size, "thin") === "med" ? "med" : "thin";
  var paper = PAPERS.indexOf(lsGet(LS.paper, "grid")) >= 0 ? lsGet(LS.paper, "grid") : "grid";
  var exam = lsGet(LS.exam, "0") === "1", isOpen = false, tab = "draw", penSeen = ssGet(SS.pen) === "1";
  var drawer, pane, btn, canvas, sheet, g, dpr = 1, cw = 0, ch = 0, cur = null, built = false, calcExpr = "", calcRes = "", calcDone = false;
  var dockHost = null, dockedOn = false;
  var el = {};

  function list() { return strokes[ctx] || (strokes[ctx] = []); }
  function ink() { var c = getComputedStyle(root).getPropertyValue("--text").trim(); return c || "#1d1d1f"; }

  /* strokes per question survive a reload (sessionStorage, newest 30 questions, 1 decimal) */
  (function load() {
    var raw = ssGet(SS.strokes); if (!raw) return;
    try {
      var o = JSON.parse(raw);
      (o.order || []).forEach(function (id) {
        var arr = o.s && o.s[id]; if (!arr || !arr.length) return;
        strokes[id] = arr.map(function (s) { return { erase: !!s.e, color: "", w: s.w, pts: s.p }; });
        order.push(id);
      });
    } catch (e) { strokes = {}; order = []; }
  })();
  function save() {
    order = order.filter(function (k) { return k !== ctx; });
    if (strokes[ctx] && strokes[ctx].length) order.push(ctx);
    while (order.length > 30) delete strokes[order.shift()];
    function pack(keys) {
      var o = { order: keys, s: {} };
      keys.forEach(function (k) {
        o.s[k] = strokes[k].map(function (s) {
          return { e: s.erase ? 1 : 0, w: Math.round(s.w * 10) / 10, p: s.pts.map(function (q) { return [Math.round(q[0] * 10) / 10, Math.round(q[1] * 10) / 10]; }) };
        });
      });
      return JSON.stringify(o);
    }
    var keys = order.slice();
    while (!ssSet(SS.strokes, pack(keys)) && keys.length > 1) keys.shift();    /* quota: drop the oldest */
  }

  function stroke(s) {
    var p = s.pts; if (!p.length) return;
    g.save();
    g.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
    g.strokeStyle = s.erase ? "#000" : s.color; g.lineWidth = s.w; g.lineCap = g.lineJoin = "round";
    g.beginPath(); g.moveTo(p[0][0], p[0][1]);
    if (p.length === 1) g.lineTo(p[0][0] + 0.01, p[0][1]);
    for (var k = 1; k < p.length; k++) g.lineTo(p[k][0], p[k][1]);
    g.stroke(); g.restore();
  }
  function seg(s, a, b) {
    g.save();
    g.globalCompositeOperation = s.erase ? "destination-out" : "source-over";
    g.strokeStyle = s.erase ? "#000" : s.color; g.lineWidth = s.w; g.lineCap = g.lineJoin = "round";
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.restore();
  }
  function tintAll() {
    var c = ink();
    Object.keys(strokes).forEach(function (k) { strokes[k].forEach(function (s) { if (!s.erase) s.color = c; }); });
  }
  function redraw() {
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, cw, ch);
    var c = ink(); list().forEach(function (s) { if (!s.erase) s.color = c; stroke(s); });
  }
  function fit() {
    if (!canvas || !canvas.clientWidth) return;
    var d = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === cw && h === ch && d === dpr) return;
    cw = w; ch = h; dpr = d;
    canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
    redraw();
  }
  function pos(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (e.pointerType === "pen") {
      if (!penSeen) { penSeen = true; ssSet(SS.pen, "1"); }
      if (cur && cur.type === "touch") { var l = list(), at = l.indexOf(cur.s); if (at >= 0) l.splice(at, 1); cur = null; redraw(); }   /* a palm landed first */
    } else if (e.pointerType === "touch" && penSeen) return;                  /* palm rejection: with a stylus in use, fingers do not draw */
    e.preventDefault();
    try { canvas.focus({ preventScroll: true }); } catch (x) {}
    try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
    var p = pos(e), pr = e.pointerType === "pen" && e.pressure ? 0.6 + e.pressure * 0.8 : 1;
    var s = { erase: tool === "eraser", color: ink(), w: tool === "eraser" ? 20 : SIZES[size] * pr, pts: [p] };
    cur = { s: s, pid: e.pointerId, type: e.pointerType };
    list().push(s); stroke(s);
  }
  function onMove(e) {
    if (!cur || e.pointerId !== cur.pid) return;
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if (!evs.length) evs = [e];
    var s = cur.s;
    evs.forEach(function (ev) { var a = s.pts[s.pts.length - 1], b = pos(ev); s.pts.push(b); seg(s, a, b); });
  }
  function onUp(e) {
    if (!cur || (e && e.pointerId !== cur.pid)) return;
    cur = null; save();
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
  function build() {
    if (built) return; built = true;
    drawer = doc.createElement("aside");
    drawer.className = "rw-drawer"; drawer.id = "rwDrawer"; drawer.setAttribute("aria-label", "Rough work");
    var keys = [["C", "fn"], ["(", "fn"], [")", "fn"], ["÷", "op"], ["7"], ["8"], ["9"], ["×", "op"], ["4"], ["5"], ["6"], ["−", "op"],
      ["1"], ["2"], ["3"], ["+", "op"], ["0"], ["."], ["⌫", "fn"], ["=", "eq"], ["√(", "fn", "√"], ["²", "fn", "x²"], ["%", "fn"]];
    drawer.innerHTML =
      '<div class="rw-head"><h4>Rough work</h4><span class="rw-ctx"></span>' +
      '<button type="button" class="rw-tb" id="rwClose" title="Close (W or Esc)" aria-label="Close rough work">' + svg("close") + '</button></div>' +
      '<div class="rw-pane" id="rwPane">' +
      '<div class="rw-dhead"><h4>Rough work</h4><span class="rw-ctx"></span>' +
        '<button type="button" class="rw-tb" id="rwHide" title="Hide the pad (W)" aria-label="Hide the rough work pad">' + svg("hide") + '</button></div>' +
      '<div class="rw-tabs" role="tablist"><button type="button" data-t="draw" class="on" role="tab">Draw</button><button type="button" data-t="notes" role="tab">Notes</button><button type="button" data-t="calc" role="tab">Calculator</button></div>' +
      '<div class="rw-panel" data-p="draw"><div class="rw-tools" role="toolbar" aria-label="Drawing tools">' +
        '<button type="button" class="rw-tb on" data-tool="pen" title="Pen" aria-label="Pen" aria-pressed="true">' + svg("pencil") + '</button>' +
        '<button type="button" class="rw-tb" data-tool="eraser" title="Eraser" aria-label="Eraser" aria-pressed="false">' + svg("eraser") + '</button><span class="rw-gap"></span>' +
        '<button type="button" class="rw-tb" id="rwUndo" title="Undo (Ctrl+Z)" aria-label="Undo">' + svg("undo") + '</button>' +
        '<button type="button" class="rw-tb" id="rwClear" title="Clear drawing" aria-label="Clear drawing">' + svg("trash") + '</button><span class="rw-gap"></span>' +
        '<button type="button" class="rw-tb" id="rwPaper" title="Paper" aria-label="Paper"></button>' +
        '<span class="rw-seg" role="group" aria-label="Pen size"><button type="button" class="rw-tb" data-size="thin" title="Thin pen" aria-label="Thin pen">' + svg("thin") + '</button>' +
        '<button type="button" class="rw-tb" data-size="med" title="Medium pen" aria-label="Medium pen">' + svg("med") + '</button></span></div>' +
        '<div class="rw-sheet" id="rwSheet"><canvas class="rw-pad" id="rwPad" tabindex="-1" aria-label="Drawing area"></canvas></div></div>' +
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
    el.paper = drawer.querySelector("#rwPaper"); el.undo = drawer.querySelector("#rwUndo");
    sheet = drawer.querySelector("#rwSheet");
    canvas = drawer.querySelector("#rwPad"); g = canvas.getContext("2d");

    drawer.querySelector("#rwClose").onclick = close;
    drawer.querySelector("#rwHide").onclick = function () { requestToggle(); };
    drawer.querySelector("#rwClear").onclick = clear;
    el.undo.onclick = undo;
    drawer.querySelectorAll("[data-tool]").forEach(function (b) {
      b.onclick = function () {
        tool = b.dataset.tool;
        drawer.querySelectorAll("[data-tool]").forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
      };
    });
    drawer.querySelectorAll("[data-size]").forEach(function (b) { b.onclick = function () { setSize(b.dataset.size); }; });
    el.paper.onclick = function () { setPaper(PAPERS[(PAPERS.indexOf(paper) + 1) % PAPERS.length]); };
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { b.onclick = function () { setTab(b.dataset.t); }; });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    pane.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "z" || e.key === "Z") && !(e.target && e.target.tagName === "TEXTAREA")) { e.preventDefault(); e.stopPropagation(); undo(); }
    });
    el.notes.value = lsGet(LS.notes, "");
    el.notes.addEventListener("input", function () { lsSet(LS.notes, el.notes.value); });
    el.calc.addEventListener("keydown", calcKeydown);
    drawer.querySelectorAll(".rw-keys button").forEach(function (b) {
      b.onclick = function () { calcKey(b.dataset.k); el.calc.focus({ preventScroll: true }); };
    });
    el.exam.onclick = function () { setExam(!exam); };
    setExam(exam, true);
    setPaper(paper, true); setSize(size, true);
    calcPaint();
    setCtxLabel();
    syncTabEnd();

    if (window.ResizeObserver) new ResizeObserver(fit).observe(canvas);
    window.addEventListener("resize", fit);
    new MutationObserver(function () { tintAll(); redraw(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  }
  // the drawer starts under the header as it is right now (0 when the header is hidden: tablet rail, focus mode)
  function placeTop() {
    var hd = doc.getElementById("topbar"), top = 0;
    if (hd && hd.offsetHeight && getComputedStyle(hd).display !== "none") top = Math.max(0, hd.getBoundingClientRect().bottom);
    drawer.style.setProperty("--rw-top", top + "px");
  }

  function setCtxLabel() {
    if (!el.ctxs) return;
    var t = ctx && ctx !== "default" ? "saved for this question" : "";
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
    el.paper.innerHTML = svg(p);
    var t = "Paper: " + PAPER_NAME[p] + " (tap to change)"; el.paper.title = t; el.paper.setAttribute("aria-label", t);
  }
  function setSize(s, quiet) {
    size = s; if (!quiet) lsSet(LS.size, s);
    drawer.querySelectorAll("[data-size]").forEach(function (b) { var on = b.dataset.size === s; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  }
  function setTab(t) {
    if (t === "calc" && exam) t = "draw";
    tab = t;
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { var on = b.dataset.t === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    drawer.querySelectorAll(".rw-panel").forEach(function (p) { p.hidden = p.dataset.p !== t; });
    if (t === "draw") fit();
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

  /* ---------- API ---------- */
  function open() {
    build(); if (dockedOn || isOpen) return; isOpen = true;
    placeTop();
    drawer.classList.add("show"); setOn(true);
    setTab(tab); fit();
    requestAnimationFrame(fit);
  }
  function close() {
    if (!built || !isOpen) return; isOpen = false;
    drawer.classList.remove("show"); setOn(false);
    var a = doc.activeElement; if (a && drawer.contains(a)) a.blur();
    cur = null;
  }
  function setOn(v) { doc.querySelectorAll("#rwBtn, .gr-rough").forEach(function (b) { b.classList.toggle("on", v); }); }
  /* docked: ask the page that owns the dock to show / hide it; with no owner, just hide the host */
  function requestToggle() {
    var ev = new CustomEvent("apt:rwtoggle", { cancelable: true });
    doc.dispatchEvent(ev);
    if (!ev.defaultPrevented && dockHost) dockHost.hidden = !dockHost.hidden;
  }
  function toggle() { if (dockedOn) return requestToggle(); isOpen ? close() : open(); }
  function clear() {
    var l = list(); if (l.length) backup[ctx] = l;
    strokes[ctx] = []; redraw(); save();
  }
  function undo() {
    var l = list();
    if (l.length) l.pop();
    else if (backup[ctx]) { strokes[ctx] = backup[ctx]; delete backup[ctx]; }
    cur = null; redraw(); save();
  }
  function setContext(id) {
    ctx = id == null || id === "" ? "default" : String(id);
    if (built) { setCtxLabel(); cur = null; redraw(); }
  }
  /* dock the whole pad (tabs, tools, canvas, exam switch) into a page column. Cheap and idempotent; call after every re-render. */
  function dock(host) {
    if (!host) return;
    build();
    if (isOpen) close();
    dockedOn = true; dockHost = host;
    if (pane.parentNode !== host) host.appendChild(pane);
    pane.classList.add("docked");
    fit(); requestAnimationFrame(fit);
  }
  function undock() {
    if (!built || !dockedOn) return;
    dockedOn = false; dockHost = null; cur = null;
    pane.classList.remove("docked");
    if (pane.parentNode !== drawer) drawer.appendChild(pane);
  }
  window.RoughPad = { toggle: toggle, open: open, close: close, clear: clear, undo: undo, setContext: setContext, dock: dock, undock: undock, docked: function () { return dockedOn; }, calc: calcEval };

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
