/* Rough-work pad: header button + right slide-out drawer (Draw / Notes / Calculator). Plain script, no dependencies.
   API: window.RoughPad = { toggle, open, close, clear, setContext(id) }.  Keys: W toggles, Esc closes. */
(function () {
  "use strict";
  if (window.RoughPad) return;
  var doc = document, root = doc.documentElement;
  var LS = { notes: "apt:rw:notes", exam: "apt:rw:exam" };
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var ICON = {
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    eraser: '<path d="M7 21h10M5 15l9-9 5 5-7 7H8z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  function svg(n) { return '<svg class="rw-ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>'; }

  /* ---------- styles ---------- */
  var css = [
    ".rw-drawer{position:fixed;top:var(--rw-top,56px);right:0;bottom:0;width:380px;max-width:100vw;background:var(--panel);color:var(--text);border-left:1px solid var(--border);",
    "box-shadow:-8px 0 24px rgba(0,0,0,.06);transform:translateX(105%);visibility:hidden;pointer-events:none;z-index:40;display:flex;flex-direction:column;padding:1rem;box-sizing:border-box;font-family:var(--sans)}",
    ".rw-drawer.show{transform:none;visibility:visible;pointer-events:auto}",
    "[data-theme=\"dark\"] .rw-drawer{box-shadow:-8px 0 24px rgba(0,0,0,.35)}",
    ".rw-drawer [hidden]{display:none!important}",
    ".rw-ico{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle}",
    "#rwBtn{display:inline-grid;place-items:center;margin-right:.35rem}",
    "#rwBtn.on{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}",
    ".rw-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem}",
    ".rw-head h4{margin:0;font:800 var(--fs-md) var(--display);flex:1}",
    ".rw-ctx{font-size:var(--fs-2xs);color:var(--muted)}",
    ".rw-drawer .icon-btn{display:inline-grid;place-items:center;padding:0 .4rem}",
    ".rw-tabs{display:flex;gap:.2rem;background:var(--panel-2);border-radius:var(--r-pill);padding:3px;margin-bottom:.75rem}",
    ".rw-tabs button{flex:1;border:0;background:none;border-radius:var(--r-pill);padding:.3rem;font:700 var(--fs-xs) var(--display);color:var(--muted);cursor:pointer}",
    ".rw-tabs button.on{background:var(--panel);color:var(--text);box-shadow:var(--shadow)}",
    ".rw-panel{flex:1;min-height:0;display:flex;flex-direction:column}",
    ".rw-tools{display:flex;gap:.3rem;margin-bottom:.5rem}",
    ".rw-tools .grow{flex:1}",
    ".rw-tools .icon-btn.on{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}",
    ".rw-pad{flex:1;min-height:0;width:100%;border:1px dashed var(--border);border-radius:var(--r-md);background:var(--bg);cursor:crosshair;touch-action:none;display:block}",
    ".rw-notes{flex:1;width:100%;resize:none;box-sizing:border-box;border:1px solid var(--border);border-radius:var(--r-md);background:var(--bg);color:var(--text);padding:.7rem;font:var(--fs-sm)/1.55 var(--sans);outline:none}",
    ".rw-notes:focus{border-color:var(--accent)}",
    ".rw-calc{outline:none}",
    ".rw-disp{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-md);padding:.6rem .8rem;margin-bottom:.6rem;min-height:4.2rem;text-align:right;display:flex;flex-direction:column;justify-content:flex-end}",
    ".rw-calc:focus-visible .rw-disp{border-color:var(--accent)}",
    ".rw-expr{font:var(--fs-md) var(--mono);color:var(--muted);word-break:break-all;min-height:1.3em}",
    ".rw-res{font:700 var(--fs-xl) var(--mono);color:var(--text);word-break:break-all;min-height:1.4em}",
    ".rw-res.err{color:var(--red);font-size:var(--fs-md)}",
    ".rw-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem}",
    ".rw-keys button{border:1px solid var(--border);background:var(--panel-2);color:var(--text);border-radius:var(--r-sm);height:2.7rem;font:600 var(--fs-base) var(--sans);cursor:pointer}",
    ".rw-keys button:hover{background:var(--accent-soft)}",
    ".rw-keys button.op{color:var(--accent)}",
    ".rw-keys button.fn{color:var(--muted)}",
    ".rw-keys button.eq{background:var(--accent);border-color:var(--accent);color:var(--bg)}",
    ".rw-keys button.eq:hover{filter:brightness(1.08)}",
    ".rw-exam{display:flex;align-items:center;gap:.55rem;margin-top:.75rem;font-size:var(--fs-xs);color:var(--muted)}",
    ".rw-sw{width:32px;height:18px;border-radius:var(--r-pill);background:var(--panel-2);border:1px solid var(--border);position:relative;padding:0;cursor:pointer;flex:none}",
    ".rw-sw::after{content:\"\";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:var(--muted)}",
    ".rw-sw[aria-checked=\"true\"]{background:var(--accent-soft);border-color:var(--accent)}",
    ".rw-sw[aria-checked=\"true\"]::after{left:16px;background:var(--accent)}",
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
  var ctx = "default", strokes = {}, tool = "pen", exam = lsGet(LS.exam, "0") === "1", isOpen = false, tab = "draw";
  var drawer, btn, canvas, g, dpr = 1, cw = 0, ch = 0, cur = null, built = false, calcExpr = "", calcRes = "", calcDone = false;
  var el = {};

  function list() { return strokes[ctx] || (strokes[ctx] = []); }
  function ink() { var c = getComputedStyle(root).getPropertyValue("--text").trim(); return c || "#1d1d1f"; }

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
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
    var p = pos(e), pr = e.pointerType === "pen" && e.pressure ? 0.6 + e.pressure : 1;
    cur = { erase: tool === "eraser", color: ink(), w: (tool === "eraser" ? 18 : 2.4) * (tool === "eraser" ? 1 : pr), pts: [p] };
    list().push(cur); stroke(cur);
  }
  function onMove(e) {
    if (!cur) return;
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if (!evs.length) evs = [e];
    evs.forEach(function (ev) { cur.pts.push(pos(ev)); });
    redraw();
  }
  function onUp() { if (cur) { cur = null; } }

  /* ---------- calculator ---------- */
  function calcPaint() {
    el.expr.textContent = calcExpr || " ";
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
      '<div class="rw-head"><h4>Rough work</h4><span class="rw-ctx" id="rwCtx"></span>' +
      '<button class="icon-btn" id="rwClose" title="Close (W or Esc)" aria-label="Close rough work">' + svg("close") + '</button></div>' +
      '<div class="rw-tabs" role="tablist"><button data-t="draw" class="on" role="tab">Draw</button><button data-t="notes" role="tab">Notes</button><button data-t="calc" role="tab">Calculator</button></div>' +
      '<div class="rw-panel" data-p="draw"><div class="rw-tools">' +
        '<button class="icon-btn on" data-tool="pen" title="Pen">' + svg("pencil") + '</button>' +
        '<button class="icon-btn" data-tool="eraser" title="Eraser">' + svg("eraser") + '</button>' +
        '<span class="grow"></span><button class="icon-btn" id="rwClear" title="Clear drawing">' + svg("trash") + '</button></div>' +
        '<canvas class="rw-pad" id="rwPad"></canvas></div>' +
      '<div class="rw-panel" data-p="notes" hidden><textarea class="rw-notes" id="rwNotes" placeholder="Jot things down. Notes are saved in this browser." spellcheck="false"></textarea></div>' +
      '<div class="rw-panel rw-calc" data-p="calc" tabindex="0" hidden aria-label="Calculator (type with the keyboard)"><div class="rw-disp"><div class="rw-expr" id="rwExpr"></div><div class="rw-res" id="rwRes">0</div></div>' +
        '<div class="rw-keys">' + keys.map(function (k) { return '<button type="button" tabindex="-1" class="' + (k[1] || "") + '" data-k="' + k[0] + '">' + (k[2] || k[0]) + '</button>'; }).join("") + '</div></div>' +
      '<div class="rw-exam"><button class="rw-sw" id="rwExam" role="switch" aria-checked="false" aria-label="Exam mode"></button>' +
        '<span id="rwExamTxt">Exam mode (no calculator, like the real test)</span></div>';
    doc.body.appendChild(drawer);

    el.expr = drawer.querySelector("#rwExpr"); el.res = drawer.querySelector("#rwRes");
    el.notes = drawer.querySelector("#rwNotes"); el.exam = drawer.querySelector("#rwExam"); el.examTxt = drawer.querySelector("#rwExamTxt");
    el.ctx = drawer.querySelector("#rwCtx"); el.calc = drawer.querySelector('[data-p="calc"]');
    canvas = drawer.querySelector("#rwPad"); g = canvas.getContext("2d");

    drawer.querySelector("#rwClose").onclick = close;
    drawer.querySelector("#rwClear").onclick = clear;
    drawer.querySelectorAll("[data-tool]").forEach(function (b) {
      b.onclick = function () { tool = b.dataset.tool; drawer.querySelectorAll("[data-tool]").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    });
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { b.onclick = function () { setTab(b.dataset.t); }; });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    el.notes.value = lsGet(LS.notes, "");
    el.notes.addEventListener("input", function () { lsSet(LS.notes, el.notes.value); });
    el.calc.addEventListener("keydown", calcKeydown);
    drawer.querySelectorAll(".rw-keys button").forEach(function (b) {
      b.onclick = function () { calcKey(b.dataset.k); el.calc.focus({ preventScroll: true }); };
    });
    el.exam.onclick = function () { setExam(!exam); };
    setExam(exam, true);
    calcPaint();
    setCtxLabel();

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

  function setCtxLabel() { if (el.ctx) el.ctx.textContent = ctx && ctx !== "default" ? "saved for this question" : ""; }
  function setTab(t) {
    if (t === "calc" && exam) t = "draw";
    tab = t;
    drawer.querySelectorAll(".rw-tabs button").forEach(function (b) { var on = b.dataset.t === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    drawer.querySelectorAll(".rw-panel").forEach(function (p) { p.hidden = p.dataset.p !== t; });
    if (t === "draw") fit();
    var f = t === "notes" ? el.notes : t === "calc" ? el.calc : null; if (f && isOpen) f.focus({ preventScroll: true });
  }
  function setExam(on, quiet) {
    exam = !!on; lsSet(LS.exam, exam ? "1" : "0");
    el.exam.setAttribute("aria-checked", exam ? "true" : "false");
    drawer.querySelector('.rw-tabs [data-t="calc"]').hidden = exam;
    el.examTxt.textContent = exam ? "Exam mode on. Calculator is off in exam mode." : "Exam mode (no calculator, like the real test)";
    if (exam && tab === "calc") setTab("draw");
  }

  /* ---------- API ---------- */
  function open() {
    build(); if (isOpen) return; isOpen = true;
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
  function toggle() { isOpen ? close() : open(); }
  function clear() { strokes[ctx] = []; redraw(); }
  function setContext(id) {
    ctx = id == null || id === "" ? "default" : String(id);
    if (built) { setCtxLabel(); cur = null; redraw(); }
  }
  window.RoughPad = { toggle: toggle, open: open, close: close, clear: clear, setContext: setContext, calc: calcEval };

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
