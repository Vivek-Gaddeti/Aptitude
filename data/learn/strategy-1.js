/* Placement strategy pages (strategy.html): start here, company patterns, exam technique.
   Every section is pushed onto LEARN.strategy; short plain-English summaries go in BRIEFS["strategy:<id>"].
   Company numbers are approximate and based on public information: always check the latest official pattern. */
window.LEARN = window.LEARN || {}; LEARN.strategy = LEARN.strategy || []; window.BRIEFS = window.BRIEFS || {};

(function () {
  /* ---- link helpers (titles match data/catalog.js) ---- */
  const PAGE = { q: "quant", r: "reasoning", v: "verbal", d: "di" };
  const TITLE = {
    "q:number-system": "Number system", "q:hcf-lcm": "HCF & LCM", "q:simplification": "Simplification & approximation", "q:percentages": "Percentages",
    "q:profit-loss": "Profit, loss & discount", "q:interest": "Simple & compound interest", "q:ratio": "Ratio & proportion", "q:partnership": "Partnership",
    "q:mixtures": "Mixtures & alligation", "q:averages": "Averages", "q:ages": "Problems on ages", "q:time-work": "Time & work", "q:pipes": "Pipes & cisterns",
    "q:tsd": "Time, speed & distance", "q:pnc": "Permutations & combinations", "q:probability": "Probability", "q:geometry": "Geometry basics",
    "q:algebra": "Algebra", "q:progressions": "Progressions", "q:logarithms": "Logarithms", "q:number-series": "Number series", "q:clocks": "Clocks",
    "q:calendars": "Calendars", "q:statistics": "Statistics", "q:sets-ds": "Sets & Venn",
    "r:series": "Series", "r:analogies": "Analogies", "r:classification": "Classification", "r:coding-decoding": "Coding–decoding", "r:alphabet-test": "Alphabet test",
    "r:blood-relations": "Blood relations", "r:direction-sense": "Direction sense", "r:order-ranking": "Order & ranking", "r:seating": "Seating arrangement",
    "r:puzzles": "Puzzles", "r:input-output": "Input–output", "r:logical-deduction": "Logical deduction", "r:syllogisms": "Syllogisms", "r:statements": "Statements",
    "r:inequalities": "Inequalities", "r:critical-reasoning": "Critical reasoning", "r:data-sufficiency": "Data sufficiency", "r:venn-reasoning": "Venn reasoning",
    "r:cubes-dice": "Cubes & dice", "r:counting-figures": "Counting figures", "r:non-verbal": "Non-verbal reasoning",
    "v:reading-comprehension": "Reading comprehension", "v:error-spotting": "Error spotting", "v:sentence-correction": "Sentence correction", "v:voice": "Voice",
    "v:narration": "Narration", "v:fill-blanks": "Fill in the blanks", "v:vocabulary": "Vocabulary", "v:cloze": "Cloze test", "v:para-jumbles": "Para jumbles",
    "v:para-completion": "Para completion", "v:writing": "Writing",
    "d:di-table": "DI tables", "d:di-bar": "DI bar graphs", "d:di-line": "DI line graphs", "d:di-pie": "DI pie charts", "d:di-mixed": "DI mixed charts",
    "d:di-caselet": "DI caselets", "d:di-missing": "DI missing data", "d:di-tricks": "DI calculation tricks"
  };
  const lk = (k) => { const [s, id] = k.split(":"); return `[${TITLE[k]}](${PAGE[s]}.html#${id})`; };
  const lks = (ks) => ks.map(lk).join(" · ");
  const learnBlock = (o) => ["list", [
    o.q && "**Quant:** " + lks(o.q), o.r && "**Reasoning:** " + lks(o.r), o.v && "**Verbal:** " + lks(o.v), o.d && "**Data interpretation:** " + lks(o.d)
  ].filter(Boolean)];

  const WARN = ["warn", "Patterns change every year — check the latest official pattern before your test.", "Check the latest pattern"];
  const mockBtn = (id, name) => ["html", `<div class="btn-row"><a class="btn primary" href="mock.html#start/${id}">Take the ${name}-style mock →</a><a class="btn" href="practice.html#daily">Do today’s Daily set</a></div>`];
  const HEAD = ["Section", "Questions", "Time", "Negative marking", "Notes"];

  function company(o) {
    LEARN.strategy.push({
      id: o.id, group: "Companies", title: o.title, sub: o.sub,
      blocks: [
        ["p", o.intro],
        ["h2", "The pattern (approximate)"],
        ["table", HEAD, o.rows],
        ...(o.tableNote ? [["note", o.tableNote]] : []),
        ["h2", "What tends to be asked"],
        ["list", o.asked],
        ["h2", "Cut-off style"],
        ["p", o.cutoff],
        ["h2", "Tips for this test"],
        ["list", o.tips],
        WARN,
        ["h2", "Practise for it"],
        ["p", o.practice || "The mock below follows the same shape as the test, sized from public information. After it, open the review, tag your mistakes and drill the weakest patterns."],
        mockBtn(o.id, o.name),
        ["h3", "Topics to learn first"],
        learnBlock(o.learn)
      ]
    });
    BRIEFS["strategy:" + o.id] = o.brief;
  }

  /* ================================================================== START HERE */
  LEARN.strategy.push({
    id: "how-it-works", group: "Start here", title: "How campus aptitude tests work",
    sub: "Sections, timers, negative marking, cut-offs, and how to use this site to prepare",
    blocks: [
      ["h2", "What the test looks like"],
      ["p", "Most large recruiters screen thousands of students with an online aptitude test before any interview. It is usually a few timed sections of multiple-choice questions: **quantitative aptitude** (arithmetic, number system, a little algebra), **logical reasoning** (series, arrangements, puzzles, syllogisms) and **verbal ability** (grammar, vocabulary, reading comprehension). Many tests add **data interpretation**, a **technical or pseudocode** section, **coding** problems and a **communication** test (an essay or spoken English)."],
      ["p", "The aptitude part is a filter. Clear the cut-off and you move on to the technical and HR rounds, where the real conversation happens. So the goal is not a perfect score. The goal is a **safe score**, reached calmly, in every section."],
      ["h2", "Words you will meet"],
      ["table", ["Idea", "What it means", "What to do about it"], [
        ["Sectional timer", "Each section has its own clock. Unused time is lost and you usually cannot go back.", "Work out seconds per question before you start. Finish the section; do not spend its whole clock on one question."],
        ["Overall timer", "One clock for the whole paper, and you can move between questions.", "Use the two-pass method (see Time management): easy marks first."],
        ["Fixed vs adaptive", "Fixed: everyone sees the same questions. Adaptive: the next question depends on your last answers, so a right answer brings a harder one.", "In an adaptive test, a harder question is a good sign, not a bad one. Do not panic and do not rush the easy ones."],
        ["Negative marking", "A wrong answer loses a fraction of a mark (often 1/4 or 1/3), and a skipped one costs nothing.", "Guess only when the maths favours it (table below)."],
        ["Sectional cut-off", "You need a minimum in each section as well as overall.", "Do not sacrifice a weak section to polish a strong one. A near-zero in verbal can sink a great quant score."],
        ["Absolute vs relative", "Absolute: a fixed pass mark. Relative: your percentile among all candidates.", "With percentile scoring, accuracy on the harder questions is what separates you."],
        ["Tools", "A few tests give an on-screen calculator, most give rough paper, many remote tests use a webcam and screen proctoring.", "Practise with the rough-work pad here. Read the instructions on rules and allowed items the day before."]
      ]],
      ["h2", "Negative marking: when is a guess worth it?"],
      ["p", "If a right answer earns 1 mark and a wrong one loses `p` marks, a guess pays off on average only when your chance of being right is above `p / (1 + p)`. With no negative marking you should never leave a blank. With negative marking, the average value of a guess is:"],
      ["table", ["Penalty per wrong answer", "Break-even chance", "Blind guess (4 options)", "After removing 1 option", "After removing 2 options"], [
        ["1/4 mark", "20%", "+0.06", "+0.17", "+0.38"],
        ["1/3 mark", "25%", "0.00", "+0.11", "+0.33"],
        ["1 mark", "50%", "−0.50", "−0.33", "0.00"]
      ]],
      ["tip", "Elimination changes everything. With a 1/3 penalty a blind guess is worth nothing, but if you can rule out even one wrong option for sure, the guess is worth about +0.11 marks on average. Over ten such questions that is a full mark."],
      ["h2", "Cut-offs"],
      ["p", "Companies rarely publish cut-offs, and they can change from drive to drive. They usually come in one of these styles: a **fixed overall score**, a **minimum per section** plus overall, **top-N by rank or percentile**, or **bands** where a higher score unlocks a better role or package. Treat any number you read on a forum as a rough guess."],
      ["p", "A sensible target is to attempt most of the paper and keep accuracy high. In a test with no negative marking, aim to attempt nearly everything. In a test with negative marking, aim for roughly 85% accuracy on what you attempt and skip the rest. Your mock review will show where you really stand."],
      ["h2", "How to use this site"],
      ["steps", [
        "**Learn.** Open a topic on the [Quant](quant.html), [Reasoning](reasoning.html), [Verbal](verbal.html) or [DI](di.html) page. Read the idea, the formulas, the shortcut and the pattern cards.",
        "**Drill.** Every pattern card has a **Practice this pattern** button. The drill starts easy and gets harder as you get answers right. Use [Practice setup](practice.html#setup) to pick your own topics and counts.",
        "**Build the habit.** Do the [Daily set](practice.html#daily) and a round of the [Speed drill](practice.html#speed) every day. See Daily routine.",
        "**Mock tests.** Start with a sectional mock, then a company-style mock, then a full mixed mock under real timing. Everything is on the [Mock tests](mock.html) page.",
        "**Review.** After every set or mock, open the review. Tag each wrong answer (concept, calculation, misread, time, guessed) and add it to the mistake book.",
        "**Revise.** Skim the [Cheat sheet](formulas.html) and use the [Revision](revision.html) page for flashcards and items that are due. Then loop back to learning the weak spots."
      ]],
      ["note", "Mocks only help once you have some topics behind you. In the first two weeks, spend most of your time on learning and drilling; from week three, mocks and review should take about half of your study time."]
    ]
  });
  BRIEFS["strategy:how-it-works"] = "A campus aptitude test is a timed set of multiple-choice sections (quant, reasoning, verbal, sometimes more). It is a filter for the interview rounds, so aim for a safe score in every section, not a perfect one.\n\nLearn the timers and the negative marking before test day, then follow the loop on this site: learn, drill, mocks, review, revision.";

  LEARN.strategy.push({
    id: "study-plans", group: "Start here", title: "A 4-week plan and an 8-week plan",
    sub: "Week-by-week routes: 4 weeks if the test is close, 8 weeks if you have the time",
    blocks: [
      ["p", "Both plans assume about **1.5–2 hours on weekdays** and **3 hours on weekends**. The [Daily set](practice.html#daily) and a round of the [Speed drill](practice.html#speed) happen every day in both plans (see Daily routine). Adjust the order to your strengths: if you are already strong in arithmetic, move its time to verbal or reasoning."],
      ["h2", "The 4-week plan"],
      ["table", ["Week", "Learn and drill", "Practise and test", "End-of-week checkpoint"], [
        ["Week 1: Number sense", `${lks(["q:number-system", "q:simplification", "q:percentages", "q:ratio", "q:averages"])}. Read the Mental math section. Reasoning: ${lks(["r:series", "r:coding-decoding"])}.`, "Daily set and Speed drill. A Quick-15 mock on Sunday.", "Speed drill best score noted. At least 70% accuracy in each topic drill."],
        ["Week 2: Arithmetic core", `${lks(["q:profit-loss", "q:interest", "q:time-work", "q:tsd", "q:mixtures"])}. Reasoning: ${lks(["r:blood-relations", "r:direction-sense", "r:order-ranking"])}. Verbal: ${lks(["v:error-spotting", "v:vocabulary"])}.`, "Daily set. A quant sectional mock on the weekend.", "Mistake book up to date. Weakest 3 patterns identified."],
        ["Week 3: Reasoning, DI and verbal", `${lks(["r:seating", "r:puzzles", "r:syllogisms", "r:inequalities"])}. ${lks(["d:di-table", "d:di-bar", "d:di-pie"])}. Verbal: ${lks(["v:reading-comprehension", "v:para-jumbles", "v:fill-blanks"])}. Light touch: ${lks(["q:ages", "q:pnc", "q:probability"])}.`, "One sectional mock every second day (reasoning, verbal, DI).", "Every section above 60% in a mock. Time per question under target in at least one section."],
        ["Week 4: Mocks and revision", "No new topics except gaps found by the review. Drill your weakest patterns. Skim the Cheat sheet daily.", "A company-style mock every second day, plus one full mixed mock. Review each one fully, with the mistake reasons.", "Final mock at your target score. Last two days: light revision only, early nights."]
      ]],
      ["h2", "The 8-week plan"],
      ["table", ["Week", "Learn and drill", "Practise and test", "End-of-week checkpoint"], [
        ["Week 1", `Foundations: ${lks(["q:number-system", "q:hcf-lcm", "q:simplification", "q:percentages"])}. Learn the squares and fraction tables (Mental math).`, "Daily set; Speed drill every day.", "Speed drill baseline. Percent and fraction tables from memory."],
        ["Week 2", `${lks(["q:profit-loss", "q:interest", "q:ratio", "q:averages", "q:partnership", "q:mixtures"])}`, "Daily set; one drill per pattern.", "Accuracy above 70% on each topic drill."],
        ["Week 3", `${lks(["q:time-work", "q:pipes", "q:tsd", "q:ages", "q:pnc", "q:probability"])}`, "Daily set; Quick-15 mock on Sunday.", "Quant sectional mock: note score and time left."],
        ["Week 4", `Reasoning I: ${lks(["r:series", "r:analogies", "r:coding-decoding", "r:alphabet-test", "r:blood-relations", "r:direction-sense", "r:order-ranking"])}`, "Daily set; reasoning drills.", "Reasoning sectional mock."],
        ["Week 5", `Reasoning II and DI: ${lks(["r:seating", "r:puzzles", "r:syllogisms", "r:inequalities", "r:statements", "r:input-output"])}. ${lks(["d:di-table", "d:di-bar", "d:di-line", "d:di-pie", "d:di-tricks"])}`, "Daily set; DI sectional mock on the weekend.", "Arrangement puzzles under 4 minutes each."],
        ["Week 6", `Verbal: ${lks(["v:reading-comprehension", "v:error-spotting", "v:sentence-correction", "v:voice", "v:narration", "v:fill-blanks", "v:vocabulary", "v:cloze", "v:para-jumbles", "v:para-completion"])}`, "Daily set; Vocabulary flashcards every day.", "Verbal sectional mock."],
        ["Week 7", `Fill the gaps: ${lks(["q:geometry", "q:algebra", "q:number-series", "q:clocks", "q:calendars", "q:statistics", "q:sets-ds"])}, plus your weakest patterns from the dashboard.`, "A sectional mock every second day (rotate quant, reasoning, verbal, DI).", "No section below 60%. Mistake book reviewed."],
        ["Week 8", "Revision only: Cheat sheet, flashcards, weak-pattern drills.", "Company-style mocks for the tests you will actually sit, then full mixed mocks. Full review after each.", "Two mocks at or above your target. Taper in the last two days."]
      ]],
      ["tip", "Under two weeks to go? Skip the plan. Skim the Cheat sheet, do the Daily set every day, take a company-style mock every second day, and fix only what the review shows. Mocks teach more per hour than new theory at this stage."],
      ["note", "Falling behind is normal. Move the low-frequency topics (logarithms, progressions, statistics) later and protect the big ones: percentages, profit and loss, time and work, speed, series, seating and puzzles, grammar and reading."]
    ]
  });
  BRIEFS["strategy:study-plans"] = "Pick the 4-week plan if the test is close and the 8-week plan if you have time. Both run the same weekly rhythm: learn a few topics, drill them, then test yourself with sectional and company mocks.\n\nThe Daily set and Speed drill continue every day. Do not worry if you slip behind; move low-frequency topics later and protect the big ones.";

  LEARN.strategy.push({
    id: "daily-routine", group: "Start here", title: "Daily routine",
    sub: "A simple 80-minute day (and shorter versions) that keeps all the skills warm",
    blocks: [
      ["p", "Small daily practice beats a long weekend session. This routine mixes speed, mixed practice, new learning, and revision, so each day touches everything."],
      ["h2", "The 80-minute day"],
      ["table", ["Block", "Time", "What to do", "Where"], [
        ["Warm up", "5 min", "One or two rounds of 60-second mental-math rapid fire. Try to beat your best.", "[Speed drill](practice.html#speed)"],
        ["Daily set", "25 min", "20 questions mixed from your weak patterns, items due for review and new material.", "[Daily set](practice.html#daily)"],
        ["Learn and drill", "30 min", "Read one topic section, then drill one pattern until it feels easy.", "[Quant](quant.html), [Reasoning](reasoning.html), [Verbal](verbal.html), [DI](di.html)"],
        ["Review", "10 min", "Open yesterday’s wrong answers. Say why you missed each one and add the real traps to the mistake book.", "[Review](practice.html#review)"],
        ["Recall", "10 min", "Skim one page of the Cheat sheet, then do flashcards that are due.", "[Cheat sheet](formulas.html), [Revision](revision.html)"]
      ]],
      ["p", "That is 5 + 25 + 30 + 10 + 10 = **80 minutes**. The dashboard tracks a daily question goal (25 by default), and the Daily set already covers most of it."],
      ["h2", "A short day: 45 minutes"],
      ["list", [
        "**5 min:** Speed drill.",
        "**20 min:** Daily set.",
        "**15 min:** one pattern drill from your weakest topic.",
        "**5 min:** review the mistakes from the Daily set."
      ]],
      ["h2", "A bad day: 15 minutes"],
      ["p", "Do just the [Daily set](practice.html#daily). Keeping the streak alive matters more than the length of the session. The next day, return to the full routine."],
      ["h2", "The weekend"],
      ["list", [
        "**One mock** (a sectional one in the early weeks, a company-style or full mock later), taken in one sitting with no pauses.",
        "**Review for as long as the mock took.** A mock without a review is wasted. Tag every mistake, drill the weakest pattern, and write one line for the habit to change next week.",
        "**Cheat sheet pass:** read the whole [Cheat sheet](formulas.html) once. It takes about 20 minutes and shows you what has gone rusty."
      ]],
      ["tip", "Tie the routine to a fixed time and place (for example right after breakfast). Habits that depend on motivation vanish in exam weeks; habits that depend on a schedule survive."]
    ]
  });
  BRIEFS["strategy:daily-routine"] = "An 80-minute day: speed drill, Daily set, one topic to learn and drill, ten minutes of review and ten of recall. On busy days drop to 45 minutes or just the Daily set.\n\nOn weekends take one mock and spend as long reviewing it as you spent taking it.";

  /* ================================================================== COMPANIES */
  company({
    id: "tcs-nqt", name: "TCS NQT", title: "TCS NQT",
    sub: "The National Qualifier Test for TCS Ninja, Digital and Prime roles",
    intro: "TCS hires freshers mainly through its **National Qualifier Test (NQT)**, run on the TCS iON platform several times a year. The test has a **Foundation** part (the basic aptitude) and an **Advanced** part (harder aptitude plus coding). A good Foundation score opens the door; the Advanced part decides the profile.",
    rows: [
      ["Foundation: Numerical Ability", "about 20", "about 25 min", "Usually none", "Arithmetic and number-based questions"],
      ["Foundation: Verbal Ability", "about 24", "about 30 min", "Usually none", "Grammar, vocabulary, reading comprehension"],
      ["Foundation: Reasoning Ability", "about 20", "about 25 min", "Usually none", "Series, coding, arrangements, puzzles"],
      ["Advanced: Quantitative", "about 15", "about 25 min", "Usually none", "Harder, multi-step; counts towards Digital and Prime"],
      ["Advanced: Reasoning", "about 15", "about 25 min", "Usually none", "Harder puzzles and logic sets"],
      ["Advanced: Coding", "1–2 problems", "about 90 min", "Judged by test cases", "Not aptitude, shown for the full picture"]
    ],
    tableNote: "The Foundation sections have their own timers in recent versions. Older NQT papers had different counts and a programming-logic section, so treat all numbers here as rough.",
    asked: [
      "**Numerical:** percentages, profit and loss, ratio, averages, time and work, time-speed-distance, simple and compound interest, number system, and simple permutations and probability.",
      "**Verbal:** error spotting, sentence correction, voice and narration, synonyms and antonyms, fill in the blanks, reading comprehension and para jumbles.",
      "**Reasoning:** number and letter series, coding–decoding, blood relations, directions, seating arrangements, puzzles and syllogisms.",
      "**Advanced:** the same topics, but with more steps and more traps: probability, P&C, geometry and mensuration, sets and DI-style data."
    ],
    cutoff: "TCS does not publish its cut-offs. The Foundation score decides whether you are shortlisted, and a stronger Advanced score plus coding performance leads to the Digital or Prime profile (higher pay) rather than Ninja. Sectional minimums are reported by many students, so no section should be left weak.",
    tips: [
      "With no negative marking, **attempt every question**. A blind guess is free; an educated guess is better.",
      "The average is about 75 seconds per Foundation question. Bank time on the easy verbal questions (30 seconds each) and spend it on arrangements and word problems.",
      "Do not leave verbal for the end of the preparation. It is the section where the most marks are available per minute.",
      "In the Advanced section, read all the questions first and start with the one whose setup you understand quickest. Harder does not always mean longer."
    ],
    brief: "TCS NQT has a Foundation part (numerical, verbal, reasoning with separate timers) and an Advanced part (harder quant and reasoning, plus coding). No negative marking is usual, so attempt everything.\n\nThe Foundation score gets you through; the Advanced score and coding decide the Digital or Prime profile.",
    learn: { q: ["q:percentages", "q:profit-loss", "q:time-work", "q:tsd", "q:ratio", "q:interest", "q:pnc", "q:probability"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:seating", "r:puzzles", "r:syllogisms"], v: ["v:error-spotting", "v:reading-comprehension", "v:vocabulary", "v:para-jumbles"] }
  });

  company({
    id: "infosys", name: "Infosys", title: "Infosys",
    sub: "Short, sectional papers with a hard maths section and a fast verbal one",
    intro: "Infosys hires freshers for the Systems Engineer (and higher-paid Specialist Programmer or Digital Specialist Engineer) roles through an online test with **separate timers for each section**. The questions are usually harder than the average campus test, especially in the mathematical section. Roles with higher pay add coding.",
    rows: [
      ["Reasoning ability", "about 15", "about 25 min", "Usually none", "Series, arrangements, deduction"],
      ["Mathematical ability", "about 10", "about 35 min", "Usually none", "Few questions, long and multi-step"],
      ["Verbal ability", "about 20", "about 20 min", "Usually none", "Grammar, vocabulary, comprehension"],
      ["Pseudocode", "about 5", "about 10 min", "Usually none", "Read and trace short code; some roles"],
      ["Puzzle solving", "about 4", "about 10 min", "Usually none", "Logic puzzles; some roles"]
    ],
    tableNote: "Section lists differ by role and year. The pseudocode and puzzle parts appear in some versions and not in others.",
    asked: [
      "**Mathematical:** a small number of heavier questions on time and work, speed, mixtures, probability, number system, P&C and geometry. Expect 3–4 minutes per question.",
      "**Reasoning:** arrangements, puzzles, data sufficiency, series, direction and blood-relation problems.",
      "**Verbal:** reading comprehension, para jumbles, sentence completion and error-based questions, with a time budget of about one minute each.",
      "**Puzzles and pseudocode** if your role includes them: logical puzzles, loops and output tracing."
    ],
    cutoff: "The test uses sectional cut-offs plus an overall score, and the passing marks differ between roles. Infosys does not publish them. Because every section has its own timer, there is no way to trade time from a weaker section to a stronger one.",
    tips: [
      "Mathematical ability gives about 3.5 minutes per question. That is plenty of time to be **careful**, so check your answer by an independent route (units digit or digit sum, see Silly mistakes).",
      "Verbal is a sprint at about 60 seconds each. Take the grammar items first (about 30 seconds), then comprehension.",
      "No section can borrow time from another. If you are stuck at the midpoint of a section, pick an option by elimination and move on.",
      "Practise puzzles on paper. Neat tables save more time than clever shortcuts."
    ],
    brief: "Infosys uses short, sectional papers: reasoning, a few hard maths questions, a quick verbal section and, for some roles, pseudocode and puzzles. Each section has its own clock.\n\nMaths gives you minutes per question, so use them to be careful. Verbal gives you about a minute, so be quick.",
    learn: { q: ["q:time-work", "q:tsd", "q:mixtures", "q:probability", "q:pnc", "q:number-system", "q:geometry"], r: ["r:seating", "r:puzzles", "r:data-sufficiency", "r:series", "r:direction-sense", "r:blood-relations"], v: ["v:reading-comprehension", "v:para-jumbles", "v:para-completion", "v:error-spotting"] }
  });

  company({
    id: "wipro", name: "Wipro", title: "Wipro",
    sub: "A single aptitude test, an essay and a coding round (Elite and Turbo hiring)",
    intro: "Wipro hires freshers through its **Elite National Talent Hunt** and similar programmes. The online assessment typically has an **aptitude** test with quant, logical and verbal questions, a **written communication** task (a short essay), and a **coding** section.",
    rows: [
      ["Aptitude (quant, logical, verbal)", "about 48", "about 48 min", "Usually none", "Roughly one minute per question; split of topics varies"],
      ["Written communication", "1 essay", "about 20 min", "None (assessed)", "A short essay on a general topic"],
      ["Coding", "about 2 problems", "about 60 min", "Judged by test cases", "Not aptitude, shown for the full picture"]
    ],
    asked: [
      "**Quant:** percentages, ratio, averages, time and work, speed, simple and compound interest, number system, and mixed arithmetic.",
      "**Logical:** series, coding–decoding, blood relations, directions, arrangements, syllogisms and data sufficiency.",
      "**Verbal:** grammar (error spotting, sentence correction), vocabulary, reading comprehension, and para completion.",
      "**Essay:** a general or technology topic. The marks go to structure, grammar and clarity, not to fancy ideas."
    ],
    cutoff: "Wipro does not publish a cut-off. Candidates usually need to clear the aptitude and the essay and then the coding round to move on to interviews. Recent reports mention an overall aptitude cut-off rather than a strict sectional one, but this changes between drives.",
    tips: [
      "About one minute per question means you must not get stuck. Aim for 30 seconds on verbal, 75 seconds on quant.",
      "Prepare a simple essay structure: opening line, two or three clear points with an example each, and a one-line close. Write a practice essay in 20 minutes.",
      "Do not neglect the grammar basics. They are the cheapest marks in the paper.",
      "Practise on the mock with a strict clock. Total time is tight, so plan to answer everything you can see in the first pass."
    ],
    brief: "Wipro’s online assessment mixes one timed aptitude test (quant, logical, verbal, about a minute each), a short essay and a coding round.\n\nSpeed matters more than depth here, and the essay rewards a simple clear structure.",
    learn: { q: ["q:percentages", "q:ratio", "q:averages", "q:time-work", "q:tsd", "q:interest", "q:number-system"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:syllogisms", "r:data-sufficiency"], v: ["v:error-spotting", "v:sentence-correction", "v:vocabulary", "v:reading-comprehension", "v:writing"] }
  });

  company({
    id: "accenture", name: "Accenture", title: "Accenture",
    sub: "A cognitive and technical assessment, with abstract reasoning in the mix",
    intro: "Accenture’s fresher hiring typically uses a **cognitive and technical assessment**, a coding task, and a separate communication assessment. The cognitive part tests general ability (verbal, numerical, and abstract or logical reasoning) rather than a long syllabus, and each part has its own timer.",
    rows: [
      ["Cognitive: English, numerical and abstract reasoning", "about 50", "about 50 min", "Usually none", "Sectional timers; abstract reasoning is figure-based"],
      ["Technical assessment", "about 40", "about 40 min", "Usually none", "MS Office, cloud, networking, security, pseudocode"],
      ["Coding", "about 2 problems", "about 45 min", "Judged by test cases", "Not aptitude"],
      ["Communication assessment", "varies", "varies", "Not applicable", "Spoken and written English"]
    ],
    tableNote: "Accenture has changed this test several times. Older versions had a longer cognitive paper with separate sections for English, reasoning and abstract reasoning.",
    asked: [
      "**Verbal:** grammar, usage, short comprehension and sentence-completion questions.",
      "**Numerical:** simple arithmetic and data questions: percentages, ratios, averages and basic algebra.",
      "**Abstract and logical reasoning:** patterns in shapes and figures, series, and rule-based arrangements.",
      "**Technical:** basic computer concepts and pseudocode; not part of the aptitude syllabus but often in the same sitting."
    ],
    cutoff: "Accenture does not publish its cut-offs. Students report that both the cognitive and the technical sections are scored, and that a minimum is needed in each. Because the questions are simpler, the cut-off is usually met by speed and accuracy rather than by solving hard problems.",
    tips: [
      "The questions are easier than at many tests, so **accuracy and speed on simple questions** is the goal. Do not spend three minutes on a single one.",
      "Practise **abstract reasoning** (figure series, odd one out, mirror and rotation). It is unusual for campus tests and takes practice.",
      "Technical basics are quick wins: revise MS Office, networking, cloud, and cyber-security terms in one evening.",
      "Check the section timers at the start. Each section locks when its time is up."
    ],
    brief: "Accenture’s assessment tests general ability (English, numerical, abstract and logical reasoning) and basic technical knowledge, with a separate timer for each part.\n\nQuestions are simpler than at many tests, so the challenge is speed and accuracy. Abstract reasoning needs special practice.",
    learn: { q: ["q:percentages", "q:ratio", "q:averages", "q:simplification", "q:number-series"], r: ["r:non-verbal", "r:series", "r:classification", "r:coding-decoding", "r:puzzles"], v: ["v:error-spotting", "v:sentence-correction", "v:fill-blanks", "v:reading-comprehension"] }
  });

  company({
    id: "cognizant", name: "Cognizant", title: "Cognizant",
    sub: "GenC-style aptitude tests, with coding and communication for higher bands",
    intro: "Cognizant hires freshers through several programmes (often called GenC, GenC Next and GenC Pro, with different packages). The online test usually has a **quant**, **logical** and **verbal** part, and the higher programmes add a **coding** section and a **communication** test.",
    rows: [
      ["Quantitative ability", "about 15–20", "about 20 min", "Usually none", "Standard arithmetic"],
      ["Logical reasoning", "about 15–20", "about 20 min", "Usually none", "Series, arrangements, deductions"],
      ["Verbal ability", "about 15–20", "about 20 min", "Usually none", "Grammar, vocabulary, comprehension"],
      ["Coding / technical", "varies", "varies", "Judged by test cases", "GenC Next and Pro; not aptitude"],
      ["Communication test", "varies", "varies", "Not applicable", "Spoken and written English"]
    ],
    tableNote: "These counts are the roughest in this list: Cognizant uses several vendors and varies the format. Treat them as a ballpark only.",
    asked: [
      "**Quant:** percentages, profit and loss, time and work, speed, averages, ratio, simple and compound interest and number problems.",
      "**Logical:** series, coding–decoding, blood relations, directions, arrangements and syllogisms.",
      "**Verbal:** error spotting, fill in the blanks, vocabulary, para jumbles and short comprehension passages.",
      "**Communication:** reading aloud, repeating sentences and short written responses, in some drives."
    ],
    cutoff: "Cognizant does not publish its cut-offs, and they are reported to differ by programme and drive. Higher packages need a stronger score and the coding section. Treat the aptitude score as a gate: the closer you are to the top, the more options you keep.",
    tips: [
      "Because the sections are short, **start with your strongest topic** and bank easy marks early.",
      "If your drive has a communication test, practise reading aloud and recording yourself; clear and steady beats fast.",
      "Check the instructions for your own drive. Candidates sometimes find the format very different from the previous year’s.",
      "Do a quick Daily set on the day before to keep your speed up, but do not start new topics."
    ],
    brief: "Cognizant’s aptitude test is usually three short parts (quant, logical, verbal), with coding and a communication test added for the higher programmes.\n\nThe format varies a lot from drive to drive, so read your own instructions closely and keep your preparation broad.",
    learn: { q: ["q:percentages", "q:profit-loss", "q:time-work", "q:tsd", "q:averages", "q:ratio", "q:interest"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:direction-sense", "r:seating", "r:syllogisms"], v: ["v:error-spotting", "v:fill-blanks", "v:vocabulary", "v:para-jumbles", "v:reading-comprehension"] }
  });

  company({
    id: "capgemini", name: "Capgemini", title: "Capgemini",
    sub: "Game-based aptitude, pseudocode and English in recent years",
    intro: "Capgemini’s fresher test has changed often. In recent years it has typically included a **game-based aptitude** round, a **pseudocode** and technical part, and an **English** (grammar and comprehension) part, and sometimes a behavioural section. Some drives use conventional quant and reasoning MCQs instead.",
    rows: [
      ["Game-based aptitude", "game rounds", "about 20–25 min", "Not applicable", "Logic, memory and speed tasks"],
      ["Pseudocode / technical", "about 10–15", "about 20–25 min", "Usually none", "Trace code, output and logic"],
      ["English (verbal)", "about 20", "about 20 min", "Usually none", "Grammar, vocabulary, comprehension"],
      ["Behavioural", "varies", "varies", "Not applicable", "Situational judgement"]
    ],
    tableNote: "Games cannot be reproduced exactly here. The Capgemini-style mock uses regular MCQs in the same spirit (quant, reasoning and verbal) so you can practise speed and accuracy.",
    asked: [
      "**Game-based tasks:** puzzles that test pattern spotting, memory, and decisions under time. Preparing with general reasoning practice (series, puzzles, figures) helps.",
      "**Pseudocode:** loops, conditions, simple functions and tracing the output.",
      "**English:** grammar, error spotting, sentence completion and reading comprehension.",
      "**Quant and logic MCQs** in the drives that use a classic paper: percentages, ratios, series and arrangements."
    ],
    cutoff: "Capgemini does not publish its cut-offs. The different parts are scored separately and the weight differs between drives. Some drives report a minimum for the game round and the pseudocode section independently.",
    tips: [
      "For game-based rounds, **stay calm and do not over-think the first attempt**. Try the practice or demo round if the platform offers one.",
      "Practise tracing pseudocode on paper: write each variable’s value in a small table, line by line.",
      "Do not skip English. It is quick and steady marks.",
      "Rest well the day before. Game rounds reward focus and reaction speed more than last-minute revision."
    ],
    brief: "Capgemini’s recent tests have combined a game-based aptitude round, pseudocode, and an English part. Older drives used regular quant and reasoning MCQs.\n\nGeneral reasoning practice and clean pseudocode tracing are the best preparation, and the mock here uses the regular MCQ format.",
    learn: { q: ["q:percentages", "q:ratio", "q:number-series", "q:simplification"], r: ["r:series", "r:puzzles", "r:non-verbal", "r:classification", "r:coding-decoding", "r:input-output"], v: ["v:error-spotting", "v:vocabulary", "v:fill-blanks", "v:reading-comprehension"] }
  });

  company({
    id: "hcl", name: "HCL", title: "HCL",
    sub: "Aptitude plus a technical part, then interviews",
    intro: "HCL’s campus and off-campus drives for engineering freshers usually combine an **aptitude** test (quant, logical, verbal) with a **technical** or domain part, followed by interviews. HCL also runs separate programmes with their own tests, so check which one you are sitting.",
    rows: [
      ["Quantitative aptitude", "about 15–20", "about 20 min", "Usually none", "Standard arithmetic"],
      ["Logical reasoning", "about 15–20", "about 20 min", "Usually none", "Series, arrangements, deductions"],
      ["Verbal ability", "about 15–20", "about 15–20 min", "Usually none", "Grammar, vocabulary, comprehension"],
      ["Technical / domain", "about 15–20", "about 20 min", "Varies", "CS fundamentals or pseudocode, depending on the role"]
    ],
    tableNote: "HCL has used different formats in different years and for different roles. This is a typical shape, not a fixed rule.",
    asked: [
      "**Quant:** percentages, profit and loss, ratio, time and work, time-speed-distance, averages and interest.",
      "**Logical:** series, coding–decoding, blood relations, directions, seating and syllogisms.",
      "**Verbal:** error spotting, fill in the blanks, para jumbles and comprehension.",
      "**Technical:** data structures, programming basics, and DBMS and OS fundamentals for CS roles."
    ],
    cutoff: "HCL does not publish its cut-offs. Students report an overall cut-off and sometimes a sectional one, with the technical part carrying real weight for engineering roles.",
    tips: [
      "Treat the aptitude as a **speed and accuracy** exercise: about a minute per question.",
      "Balance your time between aptitude and technical revision; many candidates over-invest in only one.",
      "Check the exact structure of your own drive: some have a combined paper with one timer, others have sectional timers.",
      "Practise on the mock with the timer on. Your pace on a mixed paper is the thing to improve."
    ],
    brief: "HCL’s drives usually pair an aptitude test (quant, logical, verbal) with a technical part, then interviews.\n\nThe format changes by role and year. Aim for about a minute per aptitude question and give the technical part real revision time.",
    learn: { q: ["q:percentages", "q:profit-loss", "q:ratio", "q:time-work", "q:tsd", "q:averages"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:seating", "r:syllogisms"], v: ["v:error-spotting", "v:fill-blanks", "v:para-jumbles", "v:reading-comprehension"] }
  });

  company({
    id: "tech-mahindra", name: "Tech Mahindra", title: "Tech Mahindra",
    sub: "An aptitude test, a communication assessment and then interviews",
    intro: "Tech Mahindra’s fresher drives typically start with an online **aptitude** test (quant, logical, verbal), often followed by a **communication assessment** (spoken English) and technical and HR interviews. Some roles add a technical or pseudocode section.",
    rows: [
      ["Quantitative aptitude", "about 15", "about 15–20 min", "Usually none", "Standard arithmetic"],
      ["Logical reasoning", "about 15", "about 15–20 min", "Usually none", "Series, arrangements, deductions"],
      ["Verbal ability", "about 15", "about 15 min", "Usually none", "Grammar, vocabulary, comprehension"],
      ["Communication assessment", "varies", "about 15–20 min", "Not applicable", "Spoken English; often a separate sitting"],
      ["Technical / pseudocode", "varies", "varies", "Usually none", "Some roles only"]
    ],
    tableNote: "The counts here are rough. Tech Mahindra varies the format by role and by drive.",
    asked: [
      "**Quant:** percentages, profit and loss, ratio, time and work, speed, simple interest and number problems.",
      "**Logical:** series, coding–decoding, blood relations, directions, order and ranking, and syllogisms.",
      "**Verbal:** error spotting, sentence completion, vocabulary and short comprehension passages.",
      "**Communication:** listening and repeating, reading aloud and short spoken answers."
    ],
    cutoff: "Tech Mahindra does not publish its cut-offs. Candidates generally report that the aptitude cut-off is moderate and that the communication assessment can be the stage where people fall out, so do not ignore it.",
    tips: [
      "The aptitude paper is usually a **moderate-difficulty speed test**. Take every easy mark first.",
      "Prepare for the communication assessment separately: read aloud for 10 minutes a day and speak in full sentences.",
      "Keep a calm pace; do not rush so much that you misread simple questions.",
      "Review the basics of grammar, because they are the quickest marks."
    ],
    brief: "Tech Mahindra’s process is usually an aptitude test (quant, logical, verbal) followed by a spoken-English communication assessment and then interviews.\n\nThe aptitude paper is moderate; the communication stage often needs its own preparation.",
    learn: { q: ["q:percentages", "q:profit-loss", "q:ratio", "q:time-work", "q:tsd", "q:interest"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:order-ranking", "r:syllogisms"], v: ["v:error-spotting", "v:fill-blanks", "v:vocabulary", "v:reading-comprehension", "v:writing"] }
  });

  company({
    id: "deloitte", name: "Deloitte", title: "Deloitte",
    sub: "Aptitude, technical and sometimes case-style assessments",
    intro: "Deloitte’s fresher hiring in India typically uses an online assessment (often called the **National Level Assessment**) that combines **aptitude** (verbal, quant, reasoning) with a **technical** or role-specific part. Later rounds may include a group discussion, a case, and interviews.",
    rows: [
      ["Verbal ability", "about 15–20", "about 15–20 min", "Usually none", "Grammar and reading comprehension"],
      ["Quantitative ability", "about 15–20", "about 20 min", "Usually none", "Arithmetic and data questions"],
      ["Logical reasoning", "about 15–20", "about 20 min", "Usually none", "Arrangements, series, deductions"],
      ["Technical / role-specific", "varies", "varies", "Varies", "CS or domain MCQs, depending on the role"]
    ],
    tableNote: "Deloitte’s format has varied by year, business unit and role. These counts are an approximate picture only.",
    asked: [
      "**Verbal:** longer comprehension passages than most tests, plus grammar and para-based questions.",
      "**Quant:** percentages, ratios, averages, time and work, profit and loss, and data interpretation.",
      "**Reasoning:** puzzles, arrangements, critical reasoning and data sufficiency.",
      "**Technical:** depends on role (analytics, CS, or business knowledge)."
    ],
    cutoff: "Deloitte does not publish its cut-offs. The assessment is scored on several parts and candidates report both overall and sectional minimums. The later group discussion and case rounds count too, so aptitude is a gate rather than the whole decision.",
    tips: [
      "Reading comprehension carries weight. Read a few editorials a week and practise passages under time.",
      "Data interpretation shows up often. Learn the calculation tricks (fraction-to-percent, rounding) so charts do not eat your clock.",
      "Prepare for the later rounds in parallel. A clear, structured way of speaking helps in group discussion and case rounds.",
      "Read the instructions for your own drive: roles and business units can differ."
    ],
    brief: "Deloitte’s online assessment usually mixes aptitude (verbal, quant, reasoning) with a technical or role-specific part, and later rounds add group discussion, cases and interviews.\n\nReading comprehension and data interpretation deserve extra time.",
    learn: { q: ["q:percentages", "q:ratio", "q:averages", "q:profit-loss", "q:time-work"], r: ["r:puzzles", "r:seating", "r:critical-reasoning", "r:data-sufficiency", "r:syllogisms"], v: ["v:reading-comprehension", "v:error-spotting", "v:para-jumbles", "v:para-completion"], d: ["d:di-table", "d:di-bar", "d:di-pie", "d:di-tricks"] }
  });

  company({
    id: "amcat", name: "AMCAT", title: "AMCAT",
    sub: "An adaptive test whose score is shared with many recruiters",
    intro: "**AMCAT** is not tied to one company. You take it once (or retake it after a gap) and your score report is shared with the recruiters that use AMCAT. The core modules are **English**, **Quantitative ability** and **Logical ability**, and you can add role-specific modules (programming, domain). The test is **adaptive**, so the difficulty of the next question depends on your answers.",
    rows: [
      ["English", "about 20–25", "about 20 min", "Scoring is adaptive", "Grammar, vocabulary, comprehension"],
      ["Quantitative ability", "about 20–25", "about 25 min", "Scoring is adaptive", "Arithmetic, algebra and data"],
      ["Logical ability", "about 15", "about 15–25 min", "Scoring is adaptive", "Series, deductions, patterns"],
      ["Role-specific modules", "varies", "varies", "Varies", "Programming, domain, personality"]
    ],
    tableNote: "AMCAT does not publish a simple marks-per-answer scheme. Scores are scaled on a wide range (roughly 200 to 900) and depend on the difficulty of the questions you answered correctly.",
    asked: [
      "**English:** grammar, sentence correction, vocabulary, and reading comprehension.",
      "**Quant:** percentages, profit and loss, time and work, speed, mixtures, number system, permutations and probability, and sometimes algebra and geometry.",
      "**Logical:** series, coding–decoding, arrangements, deduction and pattern questions.",
      "**Difficulty:** because the test adapts, strong candidates reach questions that are harder than a typical campus paper."
    ],
    cutoff: "There is no pass mark. Each recruiter sets its own minimum for the section scores it cares about, and a strong AMCAT score can open many drives. Scores are shared across companies, so a single good attempt is valuable.",
    tips: [
      "Accuracy matters more than volume. In adaptive tests, **right answers raise the difficulty**; wrong ones lower it. Do not guess blindly.",
      "A hard question after a streak of right answers is a good sign. Stay steady.",
      "Practise the harder patterns of each topic, not only the easy ones, because strong candidates reach them.",
      "Because you often cannot go back, decide quickly on each question. Spend about a minute per quant question on average."
    ],
    brief: "AMCAT is an adaptive test taken independently of any one company: English, quant and logical modules, with the next question depending on your last answers.\n\nAccuracy matters more than volume, and a strong score can be shared with many recruiters.",
    learn: { q: ["q:percentages", "q:profit-loss", "q:time-work", "q:tsd", "q:mixtures", "q:number-system", "q:pnc", "q:probability"], r: ["r:series", "r:coding-decoding", "r:seating", "r:puzzles", "r:syllogisms", "r:non-verbal"], v: ["v:error-spotting", "v:sentence-correction", "v:vocabulary", "v:reading-comprehension"] }
  });

  company({
    id: "elitmus", name: "eLitmus", title: "eLitmus pH test",
    sub: "A hard, percentile-based test used by many mid-size companies",
    intro: "The **eLitmus pH (potential + hard work) test** gives you a percentile that many companies use for hiring. It is considered harder than most campus tests, with long logical-reasoning questions, tricky quant, and verbal sections that lean on reading and critical reasoning. You take it independently, and the score is valid for a period set by eLitmus.",
    rows: [
      ["Quantitative ability", "about 20", "part of about 120 min", "Yes, about 1/3 per wrong answer", "Hard arithmetic, number system, P&C, probability"],
      ["Verbal ability", "about 20", "part of about 120 min", "Yes, about 1/3 per wrong answer", "RC, para jumbles, critical reasoning"],
      ["Logical reasoning", "about 20", "part of about 120 min", "Yes, about 1/3 per wrong answer", "Arrangements, deduction, data sufficiency, DI-style"]
    ],
    tableNote: "Reports describe about 60 questions in about 120 minutes with sectional timing, but the exact split and timers have changed over the years. The score is reported as a percentile.",
    asked: [
      "**Quant:** number system, remainders, P&C, probability, time and work, speed, geometry, mixtures. Questions are often word-heavy and non-routine.",
      "**Logical reasoning:** arrangements and puzzles, logical deduction, data sufficiency, Venn problems and data-style sets.",
      "**Verbal:** reading comprehension, para jumbles, critical reasoning, sentence correction and vocabulary.",
      "**Style:** unusual question types that reward understanding over memorised tricks."
    ],
    cutoff: "Your result is a **percentile**, not a raw score, and companies set their own percentile cut-offs (often high for popular firms). Sectional minimums are reported, and the score is relative to other candidates, so a good attempt matters more than a perfect one.",
    tips: [
      "With about a 1/3 penalty, a blind guess among 4 options is worth zero. **Guess only after you remove an option** or two.",
      "You are not expected to finish. Spend your time on the questions you can solve and skip the ones that need heavy computation.",
      "Practise puzzles and logical deduction hard. This is where the eLitmus paper is most different from other tests.",
      "Take at least three full mocks under real timing. Endurance across 120 minutes is a skill."
    ],
    brief: "The eLitmus pH test is a harder, percentile-scored test with about 60 questions in about two hours and negative marking of about a third of a mark.\n\nYou are not expected to finish. Choose the questions you can solve, guess only after elimination, and practise logical deduction.",
    learn: { q: ["q:number-system", "q:pnc", "q:probability", "q:time-work", "q:tsd", "q:geometry", "q:mixtures"], r: ["r:logical-deduction", "r:puzzles", "r:seating", "r:data-sufficiency", "r:venn-reasoning", "r:critical-reasoning"], v: ["v:reading-comprehension", "v:para-jumbles", "v:sentence-correction", "v:vocabulary"] }
  });

  company({
    id: "cocubes", name: "CoCubes", title: "CoCubes / Aon",
    sub: "Campus assessments from Aon’s CoCubes platform",
    intro: "**CoCubes** (now part of Aon) runs assessments that colleges and recruiters use for campus selection. The usual aptitude test has **quant**, **logical/analytical** and **English** sections. Some versions add technical or coding parts, and the platform also offers role-based tests.",
    rows: [
      ["Quantitative ability", "about 20–25", "about 20–30 min", "Varies by drive", "Arithmetic and data questions"],
      ["Analytical / logical ability", "about 20–25", "about 20–30 min", "Varies by drive", "Series, arrangements, deductions"],
      ["English / verbal ability", "about 20–25", "about 20–30 min", "Varies by drive", "Grammar, vocabulary, comprehension"],
      ["Technical / coding", "varies", "varies", "Varies", "Some drives only"]
    ],
    tableNote: "CoCubes formats differ by college and by recruiter. Always read the instructions of your own drive for the section counts, timers and marking.",
    asked: [
      "**Quant:** percentages, ratio, averages, profit and loss, time and work, speed, interest and number problems.",
      "**Analytical:** series, coding–decoding, blood relations, directions, arrangements and data sufficiency.",
      "**English:** error spotting, sentence correction, vocabulary, para jumbles and reading comprehension.",
      "**Data interpretation:** tables and charts appear in some versions."
    ],
    cutoff: "CoCubes does not set the cut-off; each college or recruiter does. Reports describe a combined score, sometimes with minimums per section, and the platform gives colleges a report that ranks students.",
    tips: [
      "Because formats vary, **read the rules first**: sectional or overall timer, and whether wrong answers lose marks.",
      "Practise on a mix of all three sections in one sitting, since the paper tests stamina as well as skill.",
      "Keep a steady pace: roughly a minute per question is the usual budget.",
      "Check your internet and camera in advance for remote tests."
    ],
    brief: "CoCubes (Aon) assessments are used by colleges and recruiters for campus selection: quant, logical and English sections, with formats that vary by drive.\n\nRead the rules first (timers and negative marking), keep a steady pace, and practise all three sections in one sitting.",
    learn: { q: ["q:percentages", "q:ratio", "q:averages", "q:profit-loss", "q:time-work", "q:tsd", "q:interest"], r: ["r:series", "r:coding-decoding", "r:blood-relations", "r:direction-sense", "r:seating", "r:data-sufficiency"], v: ["v:error-spotting", "v:sentence-correction", "v:vocabulary", "v:para-jumbles", "v:reading-comprehension"], d: ["d:di-table", "d:di-bar"] }
  });

  /* ================================================================== EXAM TECHNIQUE */
  LEARN.strategy.push({
    id: "time-management", group: "Exam technique", title: "Time management",
    sub: "Per-question budgets and the two-pass method",
    blocks: [
      ["h2", "Know your seconds per question"],
      ["p", "Divide the section time by the number of questions before the clock starts. That one number tells you whether you are on pace at every question."],
      ["table", ["Example section (approximate)", "Questions", "Time", "Seconds each"], [
        ["TCS Foundation: Numerical", "20", "25 min", "75"],
        ["TCS Foundation: Verbal", "24", "30 min", "75"],
        ["Infosys: Reasoning", "15", "25 min", "100"],
        ["Infosys: Mathematical", "10", "35 min", "210"],
        ["Infosys: Verbal", "20", "20 min", "60"],
        ["eLitmus pH (whole paper)", "60", "120 min", "120"]
      ]],
      ["p", "These are **averages**. Easy questions should take 30–40 seconds, medium ones about the average, and hard ones up to twice the average. The time you save on easy ones pays for the hard ones."],
      ["h2", "The two-pass method"],
      ["p", "Use it whenever you can move between questions (an overall timer, or one section at a time):"],
      ["steps", [
        "**Pass 1 (about 60% of the time).** Go through the questions in order. If you can see the method within about 10 seconds, solve it. If not, mark it and move on. No guilt.",
        "**Pass 2 (about 30%).** Return to the marked questions, easiest first. Stop at about twice the budget per question.",
        "**Pass 3 (about 10%).** Guess the remaining ones by elimination (if there is no penalty, guess all of them) and re-check the silly mistakes on the highest-value answers."
      ]],
      ["p", "For a 25-minute section that is about 15 minutes for the first pass, 7 for the second and 3 for the last. Write the three numbers on your rough sheet before you begin."],
      ["h2", "When you cannot go back"],
      ["p", "In a sectional test that locks questions or sections, you do not get a second pass. Use a **hard ceiling** instead: if you are at twice the budget and still not close, choose the most likely option and move. A wrong answer after 2.5 minutes costs the same as a wrong answer after 30 seconds, but it also takes 2 minutes away from the next questions."],
      ["h2", "Habits that help"],
      ["list", [
        "**Check the clock every five questions**, not every question. Staring at it is itself a time sink.",
        "**Reading comprehension:** a passage with four questions has about 8 minutes, which is 2 minutes per question including reading. Skim once, answer the factual questions first, and leave the inference ones for last.",
        "**Data interpretation sets:** spend the first 60 seconds on the headings, units and scale before touching any question.",
        "**Rough work:** write neatly and in columns. A messy page costs more time than any slow calculation."
      ]],
      ["tip", "The review after each mock shows your time per question against the target line. Look for the two or three questions that took three times the budget; those are the habits to break."]
    ]
  });
  BRIEFS["strategy:time-management"] = "Divide section time by question count to get your seconds per question, and treat it as an average. Easy questions take half of it, hard ones up to double.\n\nIn the two-pass method you take the easy marks first, return to the rest, and guess the leftovers in the last few minutes.";

  LEARN.strategy.push({
    id: "what-to-skip", group: "Exam technique", title: "What to skip",
    sub: "Decide in ten seconds, not in two minutes",
    blocks: [
      ["p", "Skipping is a skill, not a failure. A test is a race for marks per minute, and some questions are simply poor value. The trick is to decide quickly, and to decide the same way every time."],
      ["h2", "Skip (or park) these in the first pass"],
      ["list", [
        "**You do not recognise the pattern** after 10 seconds. A fresh look in pass 2 often helps.",
        "**Long, multi-step word problems** with four or more quantities, unless the topic is your strongest.",
        "**Ugly arithmetic** with three-digit multiplication and no rounding option.",
        "**Dense reading comprehension** on a technical topic. Do the shorter passages first.",
        "**Large arrangement puzzles** (six or more items and several attributes) when the section has a tight clock, unless the set carries four or five questions that are worth the setup.",
        "**Any question in which you have already spent twice the budget.** The time spent is gone; do not let it grow."
      ]],
      ["h2", "Do not skip these"],
      ["list", [
        "**Easy marks in your strong topics**: series, coding–decoding, blood relations, grammar.",
        "**Questions you can answer by elimination** in half a minute.",
        "**Sets with a simple setup** (a small table, a short passage): one setup gives several marks.",
        "**Anything in a test with no negative marking.** Park it, but come back and guess before time is up."
      ]],
      ["h2", "A rough value check"],
      ["table", ["Question type", "Typical time", "Marks", "Seconds per mark"], [
        ["Grammar or vocabulary item", "30 s", "1", "30"],
        ["Series or coding–decoding", "60 s", "1", "60"],
        ["Medium quant word problem", "90 s", "1", "90"],
        ["Arrangement puzzle set (5 questions)", "6 min", "5", "72"],
        ["Hard quant, multi-step", "3 min", "1", "180"]
      ]],
      ["p", "The last row is the one to skip first. The puzzle set looks scary but, once the setup is done, it pays like a medium question per mark."],
      ["h2", "Build your personal skip list"],
      ["p", "Use the [dashboard](index.html) and the mock reviews to find your slowest and least accurate patterns. Pick **three** that eat your time, and give each of them a hard cap in tests: two attempts at most, or twice the budget. Then practise them in drills so that they leave the list."],
      ["warn", "In a test with sectional timers and no way back, you cannot return to a skipped question. Mark your best guess before moving on."],
      ["tip", "Write a small “?” next to the question number on your rough sheet when you park it. In pass 2 you will find them in seconds."]
    ]
  });
  BRIEFS["strategy:what-to-skip"] = "Skip fast. If you do not see a method in about 10 seconds, park the question and move on. Long multi-step problems and ugly arithmetic are the first to go.\n\nNever skip easy marks in your strong topics, and in tests without negative marking, always come back and guess.";

  LEARN.strategy.push({
    id: "elimination-backsolving", group: "Exam technique", title: "Elimination and back-solving from options",
    sub: "Options are information: use them before you solve",
    blocks: [
      ["p", "In a multiple-choice paper the right answer is always sitting on the screen. Four quick tools let you use that: **bounds**, **last digit and parity**, **digit sums**, and **back-solving** (testing an option). Try them before you start a long calculation."],
      ["h2", "1. Bounds and direction"],
      ["p", "Ask: should the answer be bigger or smaller than the starting value? Is it positive or negative? Roughly how big? That often removes two options before any calculation."],
      ["ex", { t: "Example: a rise and a fall", open: true, q: "A price rises by 20% and then falls by 20%. What is the net change? Options: no change / 4% decrease / 4% increase / 2% decrease.", steps: ["A rise followed by an equal fall can never leave the price unchanged or higher (the fall acts on a bigger number). That removes “no change” and “4% increase”.", "Two options remain: 4% or 2% decrease. Start with 100: after the rise it is 120, and 20% of 120 is 24, so it ends at 96.", "Net change = −4%, a **4% decrease**."] }],
      ["h2", "2. Last digit and digit sum"],
      ["p", "For addition, subtraction and multiplication, the **last digit** of the answer depends only on the last digits of the numbers. The **digit sum** (add the digits until you get one digit, i.e. the remainder mod 9) works the same way. Compute either one and match it against the options."],
      ["ex", { t: "Example: 347 × 29", q: "Which of these equals 347 × 29? Options: 10,033 / 10,163 / 10,063 / 9,963.", steps: ["Last digits: 7 × 9 = 63, so the answer ends in 3. All four options end in 3, so this does not separate them.", "Digit sums: 347 gives 3 + 4 + 7 = 14, then 1 + 4 = 5. And 29 gives 2 + 9 = 11, then 2. The product must have digit sum 5 × 2 = 10, then 1.", "Check the options: 10,033 gives 7, 10,163 gives 11 then 2, 9,963 gives 27 then 0, and 10,063 gives 10 then 1. Only **10,063** works."] }],
      ["note", "Digit sums catch most slips, but not swapped digits (1,306 and 1,360 share a digit sum), so use them to eliminate options, not as proof."],
      ["h2", "3. Back-solving: test an option"],
      ["p", "When a question says “find the number” and each option is a number, plug an option in. Start with the **middle** option: the result tells you whether to go up or down, so you need at most two or three tries."],
      ["ex", { t: "Example: a number plus 40% of itself", q: "A number increased by 40% of itself becomes 84. What is the number? Options: 50 / 55 / 60 / 65.", steps: ["Try 55: 55 × 1.4 = 77, which is less than 84, so the answer must be larger.", "Try 60: 60 × 1.4 = 84. That matches.", "The number is **60**. (Algebra, 1.4x = 84, gives the same answer, but the options took two multiplications.)"] }],
      ["ex", { t: "Example: a two-digit number", q: "The digits of a two-digit number add up to 9. Reversing the digits makes the number 27 smaller. Which number is it? Options: 72 / 63 / 81 / 54.", steps: ["All four options have a digit sum of 9, so the first condition does not help.", "Test 63: reversed it is 36, and 63 − 36 = 27. That matches.", "The number is **63**. (For the others the differences are 45, 63 and 9.)"] }],
      ["h2", "When elimination is not the right tool"],
      ["list", [
        "**Messy options** (fractions, decimals, surds): plugging in is slower than solving.",
        "**“Cannot be determined” or data sufficiency**: you must reason about whether the data is enough.",
        "**Questions with a clean formula** (a 10-second calculation): just solve it.",
        "**Options very close together**: bounds will not separate them, so compute exactly."
      ]],
      ["tip", "With negative marking, elimination turns a bad guess into a good one: removing even one wrong option moves a 1/3-penalty guess from worth 0 to about +0.11 marks."]
    ]
  });
  BRIEFS["strategy:elimination-backsolving"] = "The answer is on the screen, so use the options. Check whether the answer should be bigger or smaller, match the last digit or digit sum, or test an option in the question itself, starting with a middle one.\n\nThis is often faster than solving and it makes guesses much better.";

  LEARN.strategy.push({
    id: "approximation", group: "Exam technique", title: "Approximation",
    sub: "Round smartly, and know when not to",
    blocks: [
      ["p", "Many calculation questions have options that are far enough apart that an exact answer is a waste. **Round the numbers to friendly values, compute, and pick the nearest option.** The skill is knowing how far you can round."],
      ["h2", "The method"],
      ["steps", [
        "**Look at the options first.** The gaps between them tell you how accurate you have to be. If they differ by 10% or more, rounding to two significant figures is plenty.",
        "**Round to friendly numbers:** 39.8 to 40, 24.9 to 25, 1,002 to 1,000, 9.98 to 10.",
        "**Compute with the friendly numbers.**",
        "**Adjust if the options are close.** Estimate which way each rounding pushed the result, and nudge the answer."
      ]],
      ["ex", { t: "Example: a mixed expression", open: true, q: "Approximate 39.8 × 24.9 + 1,002 ÷ 9.98. Options: 1,000 / 1,100 / 1,200 / 1,300.", steps: ["39.8 ≈ 40 and 24.9 ≈ 25, so the product is about 40 × 25 = 1,000.", "1,002 ÷ 9.98 ≈ 1,000 ÷ 10 = 100.", "Sum ≈ 1,000 + 100 = 1,100. The exact value is 1,091.4, so **1,100** is the nearest option."] }],
      ["ex", { t: "Example: percent of a number, with an adjustment", q: "Approximate 48.9% of 1,998.", steps: ["Take 50% of 2,000 = 1,000.", "But 48.9% is 1.1% below 50%, and 1.1% of 2,000 is 22.", "So the value is about 1,000 − 22 = 978. The exact value is 977.02."] }],
      ["ex", { t: "Example: a square root", q: "Approximate √2,410.", steps: ["Remember 49² = 2,401.", "2,410 is just 9 above that, so the root is a little above 49.", "√2,410 ≈ 49.1, so “about 49”."] }],
      ["h2", "Rules of thumb"],
      ["list", [
        "**For a product, round one number up and the other down** when you can, so the errors cancel (39.8 × 25.1 becomes 40 × 25). Rounding both up always overshoots.",
        "**For a division, round the numerator and denominator in the same direction**, so the ratio barely moves.",
        "**Keep at least two significant figures** when the options are close (1,091 vs 1,100 is a 1% gap).",
        "**Check the units digit or the order of magnitude** before trusting any estimate.",
        "**Percentages:** 10%, 5% and 1% are the building blocks. For 7.4% of 800, note that 7.5% is 3/40, so 7.5% of 800 is 60. A touch less is right: the exact value is 59.2."
      ]],
      ["warn", "Do not approximate when the options are very close (for example 1,091 and 1,095), when the question says “exactly”, or when the numbers are small and the exact calculation takes about as long as rounding."],
      ["p", "For more practice, open the [Simplification & approximation](quant.html#simplification) page and the “?” approximation drill."]
    ]
  });
  BRIEFS["strategy:approximation"] = "When the options are far apart, round the numbers to friendly ones, compute, and pick the nearest option. Check the gaps between the options first to see how much rounding you can afford.\n\nIf options are close, adjust for which way you rounded, or compute exactly.";

  LEARN.strategy.push({
    id: "mental-math", group: "Exam technique", title: "Mental math tricks",
    sub: "Squares, ×5, ×25, ×125, ×11, vertical-crosswise and the fraction table",
    blocks: [
      ["p", "These tricks save seconds on every question, and seconds add up to a whole section. Learn **one per day**, and use the [Speed drill](practice.html#speed) to make each one automatic. All examples below have been checked."],
      ["h2", "Squares near 50"],
      ["formulas", [
        ["Square of 50 + a", "(50 + a)² = 2500 + 100a + a²", "Say it as “(25 + a) hundreds, then a²”"],
        ["Square of 50 − a", "(50 − a)² = 2500 − 100a + a²", "Say it as “(25 − a) hundreds, then a²”"]
      ]],
      ["list", [
        "**53²:** a = 3, so (25 + 3) = 28 hundreds and 3² = 09, giving **2,809**.",
        "**47²:** a = −3, so (25 − 3) = 22 hundreds and 9, giving **2,209**.",
        "**56²:** (25 + 6) = 31 hundreds and 36, giving **3,136**.",
        "**44²:** (25 − 6) = 19 hundreds and 36, giving **1,936**."
      ]],
      ["h2", "Squares and products near 100"],
      ["list", [
        "**97²:** 97 is 3 below 100. Subtract 3 from 97 to get 94, then write 3² = 09, giving **9,409**.",
        "**104²:** 104 is 4 above 100. Add 4 to get 108, then write 4² = 16, giving **10,816**.",
        "**96 × 98:** deficits are 4 and 2. Subtract crosswise: 96 − 2 = 94 (or 98 − 4). Multiply the deficits: 4 × 2 = 08. The product is **9,408**.",
        "**103 × 107:** excesses are 3 and 7. Add crosswise: 103 + 7 = 110. Multiply: 3 × 7 = 21. The product is **11,021**."
      ]],
      ["h2", "Squares ending in 5"],
      ["p", "For n5², multiply n by (n + 1) and write 25 after it."],
      ["list", [
        "**65²:** 6 × 7 = 42, so **4,225**.",
        "**85²:** 8 × 9 = 72, so **7,225**.",
        "**115²:** 11 × 12 = 132, so **13,225**."
      ]],
      ["h2", "× 5, × 25, × 125 and × 75"],
      ["table", ["To multiply by", "Do this", "Example"], [
        ["5", "Halve, then × 10", "86 × 5: 86 ÷ 2 = 43, so **430**"],
        ["25", "Divide by 4, then × 100", "84 × 25: 84 ÷ 4 = 21, so **2,100**"],
        ["125", "Divide by 8, then × 1,000", "72 × 125: 72 ÷ 8 = 9, so **9,000**"],
        ["75", "× 3/4, then × 100", "64 × 75: 64 × 3/4 = 48, so **4,800**"]
      ]],
      ["p", "In reverse, dividing by 5 means doubling and then dividing by 10; dividing by 25 means × 4 and then ÷ 100."],
      ["h2", "× 11 and × 99"],
      ["list", [
        "**Two digits × 11:** write the first digit, then the sum of the digits, then the last digit. **43 × 11:** 4 | 4 + 3 | 3 = **473**.",
        "**With a carry:** **78 × 11:** 7 | 7 + 8 = 15 | 8. Carry the 1 into the 7, giving 8 | 5 | 8 = **858**.",
        "**Three digits × 11:** the same idea moving across: **234 × 11:** 2 | 2 + 3 | 3 + 4 | 4 = 2 | 5 | 7 | 4 = **2,574**.",
        "**× 99 (or × 9):** use 100 (or 10) minus 1. **47 × 99** = 4,700 − 47 = **4,653**, and **63 × 9** = 630 − 63 = **567**."
      ]],
      ["h2", "Two-digit × two-digit: vertical and crosswise"],
      ["p", "Write the numbers as ab × cd. The product is built from three parts: **a×c** (the hundreds), **a×d + b×c** (the tens, the “cross”), and **b×d** (the units). Add them in that order with place values."],
      ["ex", { t: "Example: 34 × 27", open: true, steps: ["Tens times tens: 3 × 2 = 6, worth 600.", "Cross: 3 × 7 + 4 × 2 = 21 + 8 = 29, worth 290.", "Units: 4 × 7 = 28.", "Total: 600 + 290 + 28 = **918**."] }],
      ["ex", { t: "Example: 47 × 68 (with carries)", steps: ["4 × 6 = 24, worth 2,400.", "Cross: 4 × 8 + 7 × 6 = 32 + 42 = 74, worth 740.", "Units: 7 × 8 = 56.", "Total: 2,400 + 740 + 56 = **3,196**."] }],
      ["tip", "Do not carry digits one at a time. Keep the three parts as full numbers (2,400 + 740 + 56) and add at the end. It is faster and you make fewer mistakes."],
      ["h2", "Square roots of perfect squares"],
      ["p", "Use the last digit and the neighbouring tens. To find √2,209: the last digit 9 means the root ends in 3 or 7. 40² = 1,600 and 50² = 2,500, so the root is in the forties. And 45² = 2,025 is below 2,209, so the root is above 45: it is **47**. (Check: 47² = 2,209.)"],
      ["h2", "Fraction ↔ percent recall"],
      ["p", "The full table for 1/2 to 1/20 is on the [Percentages](quant.html#percentages) page. These are the ones to know cold, especially the eighths and sixths."],
      ["table", ["Fraction", "Percent", "Fraction", "Percent"], [
        ["1/8", "12.5%", "5/8", "62.5%"],
        ["3/8", "37.5%", "7/8", "87.5%"],
        ["1/6", "16.67%", "5/6", "83.33%"],
        ["1/3", "33.33%", "2/3", "66.67%"],
        ["1/16", "6.25%", "3/16", "18.75%"],
        ["1/12", "8.33%", "1/15", "6.67%"],
        ["1/7", "14.29%", "1/9", "11.11%"]
      ]],
      ["list", [
        "**37.5% of 240** = 3/8 × 240 = 3 × 30 = **90**.",
        "**62.5% of 320** = 5/8 × 320 = 5 × 40 = **200**.",
        "**16.67% of 540** = 540 ÷ 6 = **90**."
      ]],
      ["h2", "Add and subtract by rounding"],
      ["list", [
        "**697 + 468:** round 697 up to 700, add 468 to get 1,168, then take back the 3. The answer is **1,165**.",
        "**1,000 − 367:** subtract each digit from 9 and the last from 10: 9 − 3 = 6, 9 − 6 = 3, 10 − 7 = 3. The answer is **633**."
      ]],
      ["note", "Mental math is only useful if it is reliable. Practise in the Speed drill until a trick is right every time. A trick you are 80% sure of is a trap."]
    ]
  });
  BRIEFS["strategy:mental-math"] = "A few patterns replace a lot of long multiplication: squares near 50 and 100, squares ending in 5, ×5, ×25, ×125 by halving and quartering, ×11 by adding neighbouring digits, and vertical-crosswise for two-digit products.\n\nLearn one a day and practise it in the Speed drill until it never fails.";

  LEARN.strategy.push({
    id: "silly-mistakes", group: "Exam technique", title: "Avoiding silly mistakes",
    sub: "Most lost marks are not about knowledge; they are about attention",
    blocks: [
      ["p", "Look at your mistake book after a few mocks. A large share of the wrong answers are usually not “I did not know this”. They are misreads, unit slips, half-finished calculations and sign errors. The good news is that these are the easiest marks to win back."],
      ["h2", "The usual suspects"],
      ["table", ["Slip", "Example", "Defence"], [
        ["Misreading the question", "The question asks for the **remaining** amount, the **difference**, or what is **not** true, and you answer the main quantity.", "Underline the last line of the question, and write what you are asked to find (for example “find: loss %”) before you start."],
        ["Unit mismatch", "A speed of 72 km/h and a time in seconds. 72 km/h is 72 × 5/18 = 20 m/s.", "Write units beside every number and convert at the start."],
        ["Wrong base", "80 to 100 is a 25% rise, not 20%.", "Say “percent of what?” out loud in your head."],
        ["Stopping at the half-way answer", "The question wants the **new** price and you give the discount.", "Remember that the options are built from half-finished answers. If your answer is the first option you see, check once more."],
        ["Sign or direction errors", "A fall of 20% treated as a rise.", "Write the change as a signed number (+, −) and use the factor (0.8 for −20%)."],
        ["Copying numbers wrongly", "A 6 turns into a 0 on your rough sheet.", "Copy slowly and tick each number against the screen."],
        ["Arithmetic slips", "347 × 29 gives 10,163 instead of 10,063.", "Check with the last digit and the digit sum."]
      ]],
      ["h2", "A 5-second check habit"],
      ["list", [
        "**Size check:** is the answer sensible? A price cannot be negative, and a percentage of a number cannot be bigger than the number (unless it is more than 100%).",
        "**Units check:** does the answer carry the unit the question asked for?",
        "**Last-digit or digit-sum check** for any multiplication or long addition (see Elimination).",
        "**Re-read the last line** of the question just before you click the option."
      ]],
      ["ex", { t: "Example: casting out nines on a result", q: "You computed 347 × 29 = 10,163. Is it right?", steps: ["Digit sum of 347: 3 + 4 + 7 = 14, then 1 + 4 = 5. Digit sum of 29: 2 + 9 = 11, then 2.", "The product should reduce to 5 × 2 = 10, then 1.", "10,163 gives 1 + 0 + 1 + 6 + 3 = 11, then 2. That is not 1, so it is wrong. The correct product is 10,063 (digit sum 10, then 1)."] }],
      ["h2", "Use the mistake book"],
      ["p", "When you tag a wrong answer on this site as “Misread”, “Calculation” or “Time pressure”, you are building your own list of slips. Each week, pick the **most common tag** and write one habit to fix it (for example: “underline the last line”). Check that tag again the next week to see if it dropped."],
      ["tip", "Slowing down by 10% on the easy questions usually costs less time than it saves, because you will not need to redo anything. Speed comes from methods, not from rushing."]
    ]
  });
  BRIEFS["strategy:silly-mistakes"] = "Many lost marks come from misreading, unit slips, wrong bases and half-finished answers, not from missing knowledge. Underline what the question asks for and write units beside every number.\n\nUse a five-second check at the end: size, units, last digit or digit sum, and the last line of the question.";

  LEARN.strategy.push({
    id: "test-day", group: "Exam technique", title: "The night before and test day checklist",
    sub: "Calm, prepared and early: the boring things that protect your score",
    blocks: [
      ["h2", "The week before"],
      ["list", [
        "**Stop starting new topics** about three days before the test. Use the time for mocks, the mistake book and the [Cheat sheet](formulas.html).",
        "**Take one full mock at the same time of day** as your real test, so your body is used to it.",
        "**Read the official instructions** for your drive: the pattern, timers, negative marking, allowed items and the platform you will use."
      ]],
      ["h2", "The night before"],
      ["list", [
        "**Light revision only:** one pass over the Cheat sheet, the fraction table and the squares. No new hard problems.",
        "**Prepare your documents:** the admit card or confirmation email, a photo ID matching your registration, and a pen.",
        "**Sleep 7 hours or more.** An extra hour of study at 1 a.m. costs more marks than it earns.",
        "**For a remote test:** run the system check, test your webcam and microphone, and close other programs. Charge your laptop, and plan a backup for internet (a phone hotspot).",
        "**For a centre test:** check the route, the reporting time, and what you are allowed to carry."
      ]],
      ["h2", "Test day, before the test"],
      ["list", [
        "**Eat a light meal** and drink water. Heavy food makes you drowsy.",
        "**Log in or arrive 30 minutes early** and not later. Technical hiccups are common.",
        "**Clear your desk and the room** (for remote tests): a quiet space, no notes on the wall, no other devices that the rules do not allow.",
        "**Do a two-minute warm-up** on paper: a couple of squares and fractions to get the numbers flowing."
      ]],
      ["h2", "During the test"],
      ["steps", [
        "**Read the instructions screen fully.** Check the timers and the marking scheme again.",
        "**Write your time plan** on your rough sheet: seconds per question and the pass-1, pass-2 and pass-3 times.",
        "**Scan the section** for two minutes and pick off the easy ones first.",
        "**Move on the moment you pass twice the budget.**",
        "**Keep your breathing slow** if you hit a hard run. One bad question is only one question.",
        "**In the last minutes**, answer every unanswered question if there is no negative marking, and use elimination if there is."
      ]],
      ["h2", "After the test"],
      ["list", [
        "**Write down** what the sections were like (counts, timers, topics) while you remember. It helps your friends and future you.",
        "**Do not replay the test** in your head. Move on to the next round."
      ]],
      ["warn", "Do not use unauthorised help, notes or other devices in a proctored test. Platforms flag this, and a disqualification can follow you to other drives."]
    ]
  });
  BRIEFS["strategy:test-day"] = "Stop learning new topics three days out, then revise lightly. The night before, sort your documents, check your system for a remote test and sleep properly.\n\nOn the day, log in early, read the instructions, write your time plan on the rough sheet, and answer everything you can in a calm first pass.";

  LEARN.strategy.push({
    id: "interview-aptitude", group: "Exam technique", title: "Interview-round aptitude follow-ups",
    sub: "Quick puzzles and mental-math questions that can come up in interviews",
    blocks: [
      ["p", "Technical and HR interviews for freshers sometimes include a quick aptitude-style question, partly to check your **reasoning out loud** and partly to see how you handle pressure. Nobody expects a lightning answer. They want to see a calm method."],
      ["h2", "How to handle them"],
      ["steps", [
        "**Repeat the question** in your own words. It buys time and catches misreadings.",
        "**State your approach** (“I will turn this into a fraction” or “I will assume the first case and check”) before you calculate.",
        "**Think aloud**, in short sentences. A wrong answer with clear reasoning often scores better than a silent right one.",
        "**Estimate first** and refine. “It should be around 40” is a sound start.",
        "**Check and state your answer** with the unit, then offer a one-line sanity check."
      ]],
      ["h2", "The kinds you may meet"],
      ["ex", { t: "Mental math: a percentage", open: true, q: "What is 15% of 240?", steps: ["10% of 240 is 24.", "5% is half of that: 12.", "Total: 24 + 12 = **36**."] }],
      ["ex", { t: "Trap question: the bat and the ball", q: "A bat and a ball cost ₹1.10 together. The bat costs ₹1.00 more than the ball. How much is the ball?", steps: ["The tempting answer is 10 paise, but then the bat would be ₹1.10 and the total ₹1.20.", "Let the ball cost x. Then the bat is x + 1.00 and the total is 2x + 1.00 = 1.10.", "x = 0.05, so the ball costs **5 paise**."] }],
      ["ex", { t: "Clock angle", q: "What is the angle between the hands of a clock at 3:15?", steps: ["The minute hand is on the 3, at 90° from 12.", "The hour hand has moved a quarter of the way from the 3 to the 4: 3 × 30° + 15 × 0.5° = 97.5°.", "Angle = 97.5° − 90° = **7.5°**."] }],
      ["ex", { t: "Probability", q: "Two fair coins are tossed. What is the probability of two heads?", steps: ["There are 4 equally likely outcomes: HH, HT, TH, TT.", "Only one is HH, so the probability is **1/4**. (At least one head is 3/4.)"] }],
      ["ex", { t: "Quick logic: the heavier ball", q: "Eight balls look identical, but one is slightly heavier. You have a balance scale. What is the fewest weighings that always finds it?", steps: ["Split the balls into groups of 3, 3 and 2. Weigh the two groups of 3.", "If one side is heavier, the heavy ball is in that group of 3. If they balance, it is in the group of 2.", "One more weighing finds it: weigh two balls from a group of 3, or the two balls of the group of 2.", "The answer is **2 weighings**."] }],
      ["ex", { t: "Number sense: trailing zeros", q: "How many zeros are at the end of 25!?", steps: ["Count the factors of 5: 25 ÷ 5 = 5, and 25 ÷ 25 = 1 more.", "5 + 1 = **6 zeros**."] }],
      ["h2", "Questions about your own aptitude results"],
      ["list", [
        "**“Which section was your weakest?”** Answer honestly, and say what you did about it (the drills, the mocks, the routine).",
        "**“How do you approach a problem you cannot solve?”** Mention estimating, working from the options, and moving on and returning.",
        "**“Tell me a mistake you learned from.”** A mistake-book habit makes a good, genuine story."
      ]],
      ["tip", "Practise answering aloud. Pick a question from the Daily set and explain the solution to a friend, or to the wall, in under a minute."],
      ["p", "For more puzzles and structured practice, see [Puzzles](reasoning.html#puzzles), [Clocks](quant.html#clocks) and [Probability](quant.html#probability)."]
    ]
  });
  BRIEFS["strategy:interview-aptitude"] = "Interviewers sometimes drop in a quick puzzle or mental-math question to hear how you think. Repeat the question, state your approach, think aloud and estimate before you refine.\n\nA calm, clear method with a small mistake often beats a silent right answer.";
})();
