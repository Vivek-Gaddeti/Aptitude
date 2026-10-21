/* glossary.js — plain-English definitions shown when you hover/tap an aptitude term.
   glossify(element) underlines the first occurrence of each term inside that element. */
window.GLOSSARY = {
  "cp": "Cost price: what the shopkeeper paid for the item. Profit and loss are always measured against CP unless the question says otherwise.",
  "sp": "Selling price: what the item is actually sold for. Profit = SP − CP.",
  "mp": "Marked price: the price printed on the tag before any discount. Discount is taken off MP.",
  "profit %": "Profit as a percentage of the cost price: (SP − CP) / CP × 100.",
  "discount": "A reduction from the marked price, always a percentage of the marked price: discount % = (MP − SP) / MP × 100.",
  "successive discount": "Two or more discounts one after the other. Each one applies to the price left by the previous one, so d₁ then d₂ is not d₁ + d₂.",
  "efficiency": "How much of a job someone finishes in one day (or hour). If A takes 10 days, A does 10% of the work a day.",
  "man-days": "Workers × days. A job of 120 man-days takes 10 men 12 days, or 20 men 6 days.",
  "odd days": "The leftover days when you divide a number of days by 7. They decide which weekday a date falls on.",
  "alligation": "A shortcut for mixing two things of different prices or strengths: the ratio of quantities is the inverse of the distances from the mean.",
  "mixture": "Two or more ingredients blended together, usually described by a ratio or a percentage of one ingredient.",
  "relative speed": "How fast two moving things approach or separate. Opposite directions: add the speeds. Same direction: subtract them.",
  "upstream": "Against the current of a river. Effective speed of a boat = boat speed − stream speed.",
  "downstream": "With the current of a river. Effective speed of a boat = boat speed + stream speed.",
  "compound interest": "Interest on the principal and on the interest already earned. A = P(1 + R/100)ⁿ.",
  "simple interest": "Interest on the original principal only: SI = P × R × T / 100.",
  "principal": "The amount of money first borrowed or invested, before any interest is added.",
  "rate": "How much per unit: interest per year (R%), speed per hour, work per day. Always check the time unit.",
  "syllogism": "A reasoning question with statements about groups (All A are B…) and conclusions you must test against them using Venn diagrams.",
  "premise": "A statement you are told to treat as true, even if it sounds odd in real life.",
  "conclusion": "Something that must follow from the premises. If it only might be true, it does not follow.",
  "unit digit": "The last digit of a number. For powers, it repeats in a cycle, so you only need the exponent's position in that cycle.",
  "cyclicity": "The repeating pattern of last digits of powers. 2 gives 2, 4, 8, 6, then repeats, so its cycle length is 4.",
  "remainder": "What is left over after dividing. 17 ÷ 5 gives quotient 3 and remainder 2.",
  "hcf": "Highest common factor: the largest number that divides all the given numbers exactly. Also called GCD.",
  "lcm": "Least common multiple: the smallest number that all the given numbers divide into exactly.",
  "factorial": "n! is n × (n − 1) × … × 1. For example 5! = 120. By convention 0! = 1.",
  "permutation": "An arrangement where order matters. nPr = n! / (n − r)!. ABC and CBA count as different.",
  "combination": "A selection where order does not matter. nCr = n! / (r! (n − r)!). ABC and CBA are the same.",
  "probability": "Favourable outcomes divided by total equally likely outcomes. It is always between 0 and 1.",
  "average": "The sum of the values divided by how many there are. Also called the mean.",
  "weighted average": "An average where some values count more: multiply each value by its weight, add, then divide by total weight.",
  "ratio": "A comparison of two quantities by division. 3 : 5 means 3 parts to 5 parts.",
  "proportion": "A statement that two ratios are equal, such as a : b = c : d, which gives a × d = b × c.",
  "percentage point": "The plain difference between two percentages. Going from 20% to 25% is 5 percentage points, but a 25% rise.",
  "base value": "The quantity that a percentage is taken of. Most percentage mistakes come from using the wrong base.",
  "cagr": "Compound annual growth rate: the steady yearly rate that would take you from the start value to the end value.",
  "data sufficiency": "A question type that asks whether the given statements are enough to answer something, not what the answer is.",
  "caselet": "A short paragraph of numbers in words that you first turn into a table, then answer questions from.",
  "dry run": "Working through a method by hand on a small example to check it before trusting it.",
  "back-solving": "Testing the answer options in the question instead of solving it forwards. Often faster when the options are clean numbers.",
  "coprime": "Two numbers whose only common factor is 1, such as 8 and 15. They need not be prime themselves.",
  "prime": "A number greater than 1 whose only factors are 1 and itself: 2, 3, 5, 7, 11…",
  "percentile": "The share of test takers who scored at or below you. 90th percentile means you beat about 90% of them.",
  "negative marking": "Marks deducted for a wrong answer, often one quarter or one third of a mark. It makes blind guessing costly.",
  "mean": "The usual average: total divided by count.",
  "median": "The middle value when the numbers are sorted. With an even count, it is the mean of the two middle ones.",
  "mode": "The value that appears most often in a list.",
};

window.glossify = function (root) {
  if (!root || !window.GLOSSARY) return;
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const re = new RegExp("\\b(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|") + ")\\b", "i");
  const used = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => n.parentElement.closest("code, pre, a, button, abbr, h1, .code-wrap, .viz, .chat-panel, summary, th, .crumbs, .badge, input, textarea, svg")
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    let text = node.nodeValue, m, frag = null, last = 0, guard = 0;
    const r = new RegExp(re.source, "gi");
    while ((m = r.exec(text)) && guard++ < 50) {
      const key = m[1].toLowerCase();
      if (used.has(key)) continue;
      used.add(key);
      frag = frag || document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const ab = document.createElement("abbr");
      ab.className = "gloss"; ab.tabIndex = 0; ab.textContent = m[1]; ab.dataset.def = GLOSSARY[key];
      frag.appendChild(ab);
      last = m.index + m[1].length;
    }
    if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
  });
};

/* one floating tooltip shared by all terms (works on hover, focus and tap) */
(function () {
  const css = `abbr.gloss{text-decoration:underline dotted var(--accent);text-underline-offset:3px;cursor:help}
  .gloss-tip{position:fixed;z-index:120;max-width:320px;background:var(--text);color:var(--bg);font-size:var(--fs-sm);line-height:1.45;padding:.55rem .7rem;border-radius:var(--r-sm);box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none}
  .gloss-tip b{display:block;margin-bottom:.15rem;text-transform:capitalize}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  let tip = null;
  const show = (el) => {
    if (!tip) { tip = document.createElement("div"); tip.className = "gloss-tip"; document.body.appendChild(tip); }
    tip.innerHTML = `<b>${el.textContent}</b>${el.dataset.def}`;
    tip.hidden = false;
    const r = el.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 20);
    tip.style.left = Math.max(10, Math.min(r.left, window.innerWidth - w - 10)) + "px";
    tip.style.top = (r.bottom + 8 + 120 > window.innerHeight ? r.top - tip.offsetHeight - 8 : r.bottom + 8) + "px";
  };
  const hide = () => { if (tip) tip.hidden = true; };
  document.addEventListener("mouseover", (e) => { const a = e.target.closest("abbr.gloss"); a ? show(a) : hide(); });
  document.addEventListener("focusin", (e) => { const a = e.target.closest("abbr.gloss"); if (a) show(a); });
  document.addEventListener("focusout", hide);
  window.addEventListener("scroll", hide, { passive: true });
})();
