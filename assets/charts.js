/* Aptitude Hub: DI chart renderer. QB.chartHTML(set) -> inline SVG string (themable via CSS variables).
   set.chart = { type: "bar"|"hbar"|"stacked"|"line"|"pie"|"donut"|"radar", labels, series:[{name,data}], unit?, yMax?, note?, showValues? }
   set.tableHTML (optional) is appended under the chart (mixed table + chart sets).
   Pie/donut with several series draw one pie per series side by side. Works in light and dark; no DOM access at load time. */
(function (root) {
  "use strict";
  const PAL = ["#5B9BEF", "#F06C9B", "#F7B538", "#3CC47C", "#9B7BEA", "#F08A4B", "#D9C23A", "#8C7A82"];   // neo-brutalist fills; bars get an ink outline in brutal.css
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = (v) => String(+Number(v).toFixed(2));
  const T_AX = 'fill="var(--muted)"', T_VAL = 'fill="var(--text)" font-weight="600"';
  const W = 520;

  function niceMax(max, want) {
    if (want) return want;
    const steps = [1, 2, 2.5, 5, 10];
    const mag = Math.pow(10, Math.floor(Math.log10(max || 1)));
    for (const s of steps) { const top = Math.ceil(max / (mag * s / 2)) * (mag * s / 2); const st = mag * s / 2; if (top / st <= 6 && top >= max) { /* ok */ } }
    for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * mag >= max * 1.04) return m * mag;
    return max;
  }
  function ticks(top, min) {
    min = min || 0; const span = top - min;
    for (const n of [4, 5, 3, 6, 2, 8, 10]) {
      const st = span / n;
      if (Math.abs(st - Math.round(st)) < 1e-9 || (span < 8 && Math.abs(st * 4 - Math.round(st * 4)) < 1e-9)) return Array.from({ length: n + 1 }, (_, i) => +(min + st * i).toFixed(4));
    }
    return [0, 1, 2, 3, 4].map((i) => +(min + span * i / 4).toFixed(2));
  }
  function legendSVG(names, y, colors) {
    let x = 14, row = 0, out = "";
    names.forEach((n, i) => {
      const w = 26 + n.length * 6.6 + 14;
      if (x + w > W - 8 && x > 14) { x = 14; row++; }
      out += '<rect x="' + x + '" y="' + (y + row * 20 - 8) + '" width="12" height="12" rx="3" fill="' + colors[i % colors.length] + '"/><text x="' + (x + 18) + '" y="' + (y + row * 20 + 2.5) + '" font-size="12" ' + T_AX + ">" + esc(n) + "</text>";
      x += w;
    });
    return { svg: out, rows: row + 1 };
  }
  function wrap(h, inner, c) {
    return '<svg class="chart di-chart" viewBox="0 0 ' + W + " " + h + '" width="100%" role="img" aria-label="' + esc((c.unit ? c.unit + " chart" : "chart")) +
      '" style="max-width:640px;display:block;margin:0 auto;font-family:var(--sans,system-ui,sans-serif);font-size:11.5px">' + inner + "</svg>";
  }
  const unitLabel = (c) => (c.unit ? '<text x="8" y="14" font-size="11.5" ' + T_AX + ">" + esc(c.unit) + "</text>" : "");

  /* ---------- cartesian helpers ---------- */
  function frame(c, stackedSum) {
    const n = c.labels.length, ns = c.series.length;
    const all = stackedSum ? c.labels.map((_, i) => c.series.reduce((a, s) => a + s.data[i], 0)) : [].concat.apply([], c.series.map((s) => s.data));
    const top = niceMax(Math.max.apply(null, all), c.yMax);
    const lg = ns > 1 ? Math.ceil(c.series.reduce((a, s) => a + 26 + s.name.length * 6.6 + 14, 0) / (W - 22)) : 0;
    return { n, ns, top, lgRows: lg };
  }

  function bar(c, stacked) {
    const f = frame(c, stacked), L = 44, R = 12, T = c.unit ? 34 : 24, plotH = 220;
    const H = T + plotH + 28 + (f.lgRows ? f.lgRows * 20 + 6 : 0);
    const B = T + plotH, gw = (W - L - R) / f.n, y = (v) => B - (v / f.top) * plotH;
    const showV = f.n <= 8;
    let s = unitLabel(c);
    ticks(f.top).forEach((t) => { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="var(--border)"' + (t ? ' stroke-dasharray="3 4"' : "") + '/><text x="' + (L - 7) + '" y="' + (y(t) + 4) + '" text-anchor="end" ' + T_AX + ">" + num(t) + "</text>"; });
    const bw = stacked ? Math.min(gw * 0.56, 54) : Math.min((gw * 0.78) / f.ns, 34), gap = stacked ? 0 : 2;
    c.labels.forEach((lab, i) => {
      const cx = L + i * gw + gw / 2;
      if (stacked) {
        let acc = 0;
        c.series.forEach((sr, j) => {
          const v = sr.data[i], y0 = y(acc), y1 = y(acc + v), h = y0 - y1;
          s += '<rect x="' + (cx - bw / 2) + '" y="' + y1 + '" width="' + bw + '" height="' + Math.max(h - 1, 0) + '" fill="' + PAL[j % PAL.length] + '"' + (j === f.ns - 1 ? ' rx="3"' : "") + "/>";
          if (showV && h >= 15) s += '<text x="' + cx + '" y="' + (y1 + h / 2 + 4) + '" text-anchor="middle" font-size="10.5" fill="#fff" font-weight="600">' + num(v) + "</text>";
          acc += v;
        });
        if (showV) s += '<text x="' + cx + '" y="' + (y(acc) - 6) + '" text-anchor="middle" ' + T_VAL + ">" + num(acc) + "</text>";
      } else {
        const tw = f.ns * bw + (f.ns - 1) * gap, x0 = cx - tw / 2;
        c.series.forEach((sr, j) => {
          const v = sr.data[i], x = x0 + j * (bw + gap);
          s += '<rect x="' + x + '" y="' + y(v) + '" width="' + bw + '" height="' + Math.max(B - y(v), 0) + '" rx="3" fill="' + PAL[j % PAL.length] + '"/>';
          if (showV) s += '<text x="' + (x + bw / 2) + '" y="' + (y(v) - 5) + '" text-anchor="middle" font-size="' + (f.ns > 2 ? 10 : 11) + '" ' + T_VAL + ">" + num(v) + "</text>";
        });
      }
      s += '<text x="' + cx + '" y="' + (B + 18) + '" text-anchor="middle" ' + T_AX + ">" + esc(lab) + "</text>";
    });
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + B + '" y2="' + B + '" stroke="var(--muted)" stroke-opacity=".5"/>';
    if (f.ns > 1) s += legendSVG(c.series.map((x) => x.name), B + 40, PAL).svg;
    return wrap(H, s, c);
  }

  function hbar(c) {
    const f = frame(c, false), maxLab = Math.max.apply(null, c.labels.map((l) => String(l).length));
    const L = Math.min(Math.max(maxLab * 6.4 + 14, 50), 150), R = 36, T = c.unit ? 30 : 12;
    const rowH = f.ns * 17 + 12, plotH = rowH * f.n, B = T + plotH;
    const H = B + 30 + (f.lgRows ? f.lgRows * 20 + 6 : 0), x = (v) => L + (v / f.top) * (W - L - R);
    let s = unitLabel(c);
    ticks(f.top).forEach((t) => { s += '<line y1="' + T + '" y2="' + B + '" x1="' + x(t) + '" x2="' + x(t) + '" stroke="var(--border)"' + (t ? ' stroke-dasharray="3 4"' : "") + '/><text x="' + x(t) + '" y="' + (B + 16) + '" text-anchor="middle" ' + T_AX + ">" + num(t) + "</text>"; });
    c.labels.forEach((lab, i) => {
      const y0 = T + i * rowH + 6;
      s += '<text x="' + (L - 8) + '" y="' + (y0 + (f.ns * 17) / 2 + 3) + '" text-anchor="end" ' + T_AX + ">" + esc(lab) + "</text>";
      c.series.forEach((sr, j) => {
        const v = sr.data[i], yy = y0 + j * 17;
        s += '<rect x="' + L + '" y="' + yy + '" width="' + Math.max(x(v) - L, 0) + '" height="14" rx="3" fill="' + PAL[j % PAL.length] + '"/>' +
          (f.n <= 8 ? '<text x="' + (x(v) + 5) + '" y="' + (yy + 11) + '" font-size="11" ' + T_VAL + ">" + num(v) + "</text>" : "");
      });
    });
    s += '<line x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + B + '" stroke="var(--muted)" stroke-opacity=".5"/>';
    if (f.ns > 1) s += legendSVG(c.series.map((q) => q.name), B + 38, PAL).svg;
    return wrap(H, s, c);
  }

  function line(c) {
    const f = frame(c, false), L = 44, R = 22, T = c.unit ? 34 : 24, plotH = 220;
    const H = T + plotH + 28 + (f.lgRows ? f.lgRows * 20 + 6 : 0), B = T + plotH;
    const y0 = c.yMin || 0, px = (i) => (f.n === 1 ? (L + W - R) / 2 : L + 14 + (i * (W - L - R - 28)) / (f.n - 1)), y = (v) => B - ((v - y0) / (f.top - y0)) * plotH;
    const showV = f.n <= 8;
    let s = unitLabel(c);
    ticks(f.top, y0).forEach((t) => { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="var(--border)"' + (t > y0 ? ' stroke-dasharray="3 4"' : "") + '/><text x="' + (L - 7) + '" y="' + (y(t) + 4) + '" text-anchor="end" ' + T_AX + ">" + num(t) + "</text>"; });
    c.labels.forEach((lab, i) => { s += '<text x="' + px(i) + '" y="' + (B + 18) + '" text-anchor="middle" ' + T_AX + ">" + esc(lab) + "</text>"; });
    c.series.forEach((sr, j) => {
      const col = PAL[j % PAL.length];
      s += '<polyline fill="none" stroke="' + col + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" points="' + sr.data.map((v, i) => px(i) + "," + y(v)).join(" ") + '"/>';
      sr.data.forEach((v, i) => {
        s += '<circle cx="' + px(i) + '" cy="' + y(v) + '" r="4" fill="var(--panel,#fff)" stroke="' + col + '" stroke-width="2.2"/>';
        if (showV) s += '<text x="' + px(i) + '" y="' + (y(v) + (j % 2 && f.ns > 1 ? 17 : -9)) + '" text-anchor="middle" font-size="10.5" ' + T_VAL + ">" + num(v) + "</text>";
      });
    });
    if (f.ns > 1) s += legendSVG(c.series.map((q) => q.name), B + 40, PAL).svg;
    return wrap(H, s, c);
  }

  function pies(c, donut) {
    const np = c.series.length, labels = c.labels, R = np > 1 ? 74 : 92, cw = W / np;
    const lgR = legendSVG(labels, 0, PAL).rows, top = np > 1 ? 34 : 14;
    const H = top + R * 2 + 30 + lgR * 20 + 4;
    let s = "";
    c.series.forEach((sr, k) => {
      const cx = cw * k + cw / 2, cy = top + R + 6, tot = sr.data.reduce((a, b) => a + b, 0);
      if (np > 1) s += '<text x="' + cx + '" y="18" text-anchor="middle" font-size="12.5" ' + T_VAL + ">" + esc(sr.name) + "</text>";
      let a = -Math.PI / 2;
      sr.data.forEach((v, i) => {
        const fr = v / tot, a2 = a + fr * Math.PI * 2, big = a2 - a > Math.PI ? 1 : 0, col = PAL[i % PAL.length], r0 = donut ? R * 0.55 : 0;
        const P = (r, ang) => (cx + r * Math.cos(ang)).toFixed(2) + " " + (cy + r * Math.sin(ang)).toFixed(2);
        if (fr > 0.9999) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + col + '"/>';
        else s += '<path d="M' + P(R, a) + " A" + R + " " + R + " 0 " + big + " 1 " + P(R, a2) + (donut ? " L" + P(r0, a2) + " A" + r0 + " " + r0 + " 0 " + big + " 0 " + P(r0, a) + " Z" : " L" + cx + " " + cy + " Z") + '" fill="' + col + '" stroke="var(--panel,#fff)" stroke-width="1.5"/>';
        if (fr >= 0.045) {
          const am = (a + a2) / 2, rr = donut ? (R + r0) / 2 : R * 0.66, p = fr * 100;
          const txt = Math.abs(tot - 100) < 1e-9 || c.showPct ? num(v) + "%" : (p % 1 ? p.toFixed(1) : p) + "%";
          s += '<text x="' + (cx + rr * Math.cos(am)) + '" y="' + (cy + rr * Math.sin(am) + 4) + '" text-anchor="middle" font-size="' + (np > 1 ? 10.5 : 11.5) + '" fill="#fff" font-weight="700">' + txt + "</text>";
        }
        a = a2;
      });
      if (donut && np === 1 && c.centre) s += '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" ' + T_VAL + ">" + esc(c.centre) + "</text>";
    });
    s += legendSVG(labels, top + R * 2 + 36, PAL).svg;
    return wrap(H, s, c);
  }

  function radar(c) {
    const n = c.labels.length, cx = W / 2, cy = 150, R = 100, top = niceMax(Math.max.apply(null, [].concat.apply([], c.series.map((s) => s.data))), c.yMax);
    const lg = c.series.length > 1 ? 1 : 0, H = 300 + (lg ? 26 : 0);
    const pt = (i, r) => [cx + r * Math.sin((2 * Math.PI * i) / n), cy - r * Math.cos((2 * Math.PI * i) / n)];
    let s = "";
    for (let k = 1; k <= 4; k++) {
      s += '<polygon fill="none" stroke="var(--border)" points="' + c.labels.map((_, i) => pt(i, (R * k) / 4).join(",")).join(" ") + '"/>';
      s += '<text x="' + (cx + 3) + '" y="' + (cy - (R * k) / 4 + 10) + '" font-size="9.5" ' + T_AX + ">" + num((top * k) / 4) + "</text>";
    }
    c.labels.forEach((l, i) => {
      const [x, y] = pt(i, R), [lx, ly] = pt(i, R + 16);
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="var(--border)"/><text x="' + lx + '" y="' + (ly + 4) + '" text-anchor="' + (Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end") + '" ' + T_AX + ">" + esc(l) + "</text>";
    });
    c.series.forEach((sr, j) => {
      const col = PAL[j % PAL.length], pts = sr.data.map((v, i) => pt(i, (v / top) * R));
      s += '<polygon points="' + pts.map((p) => p.join(",")).join(" ") + '" fill="' + col + '" fill-opacity=".16" stroke="' + col + '" stroke-width="2.2" stroke-linejoin="round"/>';
      pts.forEach((p, i) => { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + col + '"/>'; if (n <= 8 && c.series.length === 1) s += '<text x="' + p[0] + '" y="' + (p[1] - 7) + '" text-anchor="middle" font-size="10.5" ' + T_VAL + ">" + num(sr.data[i]) + "</text>"; });
    });
    if (lg) s += legendSVG(c.series.map((q) => q.name), 292, PAL).svg;
    return wrap(H, s, c);
  }

  function chartHTML(set) {
    const c = set && set.chart;
    if (!c || !Array.isArray(c.series) || !c.series.length) return "";
    let svg;
    try {
      svg = c.type === "hbar" ? hbar(c) : c.type === "stacked" ? bar(c, true) : c.type === "line" ? line(c) : c.type === "pie" ? pies(c, false) : c.type === "donut" ? pies(c, true) : c.type === "radar" ? radar(c) : bar(c, false);
    } catch (e) { return '<div class="pr-chart-ph">chart unavailable</div>'; }
    return svg + (c.note ? '<p class="di-note" style="margin:.5rem 0 0;font-size:.82rem;color:var(--muted)">' + esc(c.note) + "</p>" : "") +
      (set.tableHTML ? '<div class="di-extra" style="margin-top:.8rem">' + set.tableHTML + "</div>" : "");
  }

  if (root.QB) Object.assign(root.QB, { chartHTML });
  if (typeof module !== "undefined" && module.exports) module.exports = { chartHTML };
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
