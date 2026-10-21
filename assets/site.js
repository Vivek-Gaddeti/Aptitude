/* Site config for Aptitude Hub (quant, reasoning, verbal, DI + a practice player). Loaded first on every page. */
window.SITE = {
  storeKey: "apt:v1",                                               // all progress, notes, bookmarks and attempts
  brand: "Aptitude Hub",
  logo: "AH",
  home: "index.html",
  mascot: "walk",                                                   // walks along the bottom of the sidebar as you progress
  ring: { prefixes: ["quant:", "reasoning:", "verbal:", "di:"], total: 70, label: "topics learned" },   // progress ring around the logo (total is corrected when data/catalog.js loads)
  // [href, label] or [href, label, [[href, label, subtitle], …]] for a link with a small menu
  links: [
    ["index.html", "Dashboard"],
    ["quant.html", "Quant"],
    ["reasoning.html", "Reasoning"],
    ["verbal.html", "Verbal"],
    ["di.html", "DI"],
    ["practice.html", "Practice", [
      ["practice.html", "Practice", "Drills, topic sets, daily set"],
      ["mock.html", "Mock tests", "Company-style timed tests"],
      ["strategy.html", "Placement strategy", "Company patterns and exam technique"],
    ]],
    ["revision.html", "Revision", [
      ["revision.html", "Review & mistakes", "Due questions and your mistake book"],
      ["formulas.html", "Cheat sheet", "Every formula, shortcut and table on one page"],
    ]],
  ],
};

/* Data containers filled by data/*.js */
window.LEARN = window.LEARN || { quant: [], reasoning: [], verbal: [], di: [], strategy: [] };   // doc sections, filled by data/learn/*.js
window.BRIEFS = window.BRIEFS || {};
window.QB = window.QB || {};                                         // question registry, filled by data/q/**, data/gen/**, data/sets/**
Object.assign(window.QB, {
  qs: window.QB.qs || [], byId: window.QB.byId || {}, sets: window.QB.sets || {}, gens: window.QB.gens || {},
  add(list) { list.forEach((q) => { this.qs.push(q); this.byId[q.id] = q; }); },
  set(id, spec) { this.sets[id] = Object.assign({ id }, spec); },
  gen(key, g) { this.gens[key] = Object.assign({ key }, g); },       // key = "sec/topic/pattern"
});
