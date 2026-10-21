/* =====================================================================
   data/mocks.js : mock-test presets (used by assets/mock.js, the dashboard and the strategy page)
   Shape (docs/SPEC-final.md):
     { id, name, company, kind: "company" | "section" | "full", blurb, note,
       minutes  (overall timer in minutes, or null when every section has its own timer),
       negative (marks lost per wrong answer), marks (per right answer), sectionLock, calculator,
       sections: [ { title, sec, topics: [topic ids] | "all", count, minutes (per-section timer or null) } ] }
   A topic may also be written "sec/topic" to borrow a topic from another section (e.g. a DI set in a problem-solving section).
   Company presets are "-style" practice formats sized from public descriptions of each test. Patterns change often,
   so every company preset carries the same note telling the student to check the latest official pattern.
   Preset ids are fixed: the strategy page links to mock.html#start/<id>.
   ===================================================================== */
(function () {
  const NOTE = "Practice format modelled on the public pattern; check the latest official pattern before your test.";

  // topic groups (ids from data/catalog.js)
  const Q_NUM = ["number-system", "hcf-lcm", "simplification"];
  const Q_ARITH = ["percentages", "profit-loss", "interest", "ratio", "partnership", "mixtures", "averages", "ages", "time-work", "pipes", "tsd"];
  const Q_COUNT = ["pnc", "probability"];
  const Q_GEO = ["mensuration-2d", "mensuration-3d", "geometry"];
  const Q_ALG = ["algebra", "progressions", "logarithms"];
  const Q_MISC = ["number-series", "clocks", "calendars", "statistics", "sets-ds"];

  const R_CODES = ["series", "analogies", "classification", "coding-decoding", "alphabet-test"];
  const R_REL = ["blood-relations", "direction-sense", "order-ranking"];
  const R_ARR = ["seating", "puzzles", "input-output", "logical-deduction"];
  const R_LOGIC = ["syllogisms", "statements", "inequalities", "critical-reasoning", "data-sufficiency", "venn-reasoning"];
  const R_VIS = ["cubes-dice", "counting-figures", "non-verbal"];

  const V_GRAM = ["error-spotting", "sentence-correction", "voice", "narration"];
  const V_VOCAB = ["fill-blanks", "vocabulary", "cloze"];
  const V_PARA = ["para-jumbles", "para-completion"];
  const V_RC = ["reading-comprehension"];

  const C = (o) => Object.assign({ kind: "company", marks: 1, negative: 0, sectionLock: true, calculator: false, minutes: null, note: NOTE }, o);

  window.MOCKS = [
    /* ------------------------------------------------------------ company-style */
    C({
      id: "tcs-nqt", name: "TCS NQT-style (Foundation)", company: "TCS", calculator: true,
      blurb: "The Foundation section of the National Qualifier Test: numerical, verbal and reasoning ability, each with its own timer. No negative marking, and an on-screen calculator in the numerical section.",
      sections: [
        { title: "Numerical Ability", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["mensuration-2d", "mensuration-3d", "number-series", "statistics"]), count: 20, minutes: 25 },
        { title: "Verbal Ability", sec: "verbal", topics: V_RC.concat(V_GRAM.slice(0, 2), V_VOCAB, V_PARA), count: 25, minutes: 25 },
        { title: "Reasoning Ability", sec: "reasoning", topics: R_CODES.concat(R_REL, ["seating", "puzzles", "syllogisms", "statements", "data-sufficiency", "non-verbal"]), count: 20, minutes: 25 },
      ],
    }),
    C({
      id: "infosys", name: "Infosys-style online test", company: "Infosys",
      blurb: "Few but tough maths questions with a long timer, a logical section that mixes puzzles with small data sets, a quick verbal section, and a short puzzle-solving round at the end.",
      sections: [
        { title: "Mathematical Ability", sec: "quant", topics: Q_ARITH.concat(Q_COUNT, ["number-system", "progressions", "algebra", "number-series", "statistics"]), count: 10, minutes: 35 },
        { title: "Logical Reasoning", sec: "reasoning", topics: ["puzzles", "seating", "data-sufficiency", "syllogisms", "blood-relations", "coding-decoding", "critical-reasoning", "statements", "di/di-table", "di/di-bar"], count: 15, minutes: 25 },
        { title: "Verbal Ability", sec: "verbal", topics: V_RC.concat(["sentence-correction", "error-spotting", "fill-blanks", "vocabulary"], V_PARA), count: 20, minutes: 20 },
        { title: "Puzzle Solving", sec: "reasoning", topics: ["puzzles", "seating", "cubes-dice", "counting-figures", "logical-deduction"], count: 4, minutes: 10 },
      ],
    }),
    C({
      id: "wipro", name: "Wipro NLTH-style aptitude", company: "Wipro",
      blurb: "The aptitude part of the National Level Talent Hunt: quick quant, logical and verbal sections, roughly a minute per question, each on its own clock.",
      sections: [
        { title: "Quantitative Ability", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["number-series", "clocks", "calendars"]), count: 16, minutes: 16 },
        { title: "Logical Ability", sec: "reasoning", topics: R_CODES.concat(R_REL, ["seating", "syllogisms", "statements", "inequalities"]), count: 14, minutes: 14 },
        { title: "Verbal Ability", sec: "verbal", topics: V_RC.concat(V_GRAM, ["fill-blanks", "vocabulary"], V_PARA), count: 22, minutes: 18 },
      ],
    }),
    C({
      id: "accenture", name: "Accenture-style cognitive assessment", company: "Accenture", minutes: 50,
      blurb: "One 50-minute clock across three locked sections: English ability, critical reasoning and problem solving, then abstract (figure and pattern) reasoning.",
      sections: [
        { title: "English Ability", sec: "verbal", topics: V_GRAM.slice(0, 2).concat(V_VOCAB, V_PARA, V_RC), count: 20, minutes: null },
        { title: "Critical Reasoning & Problem Solving", sec: "reasoning", topics: ["logical-deduction", "critical-reasoning", "syllogisms", "statements", "data-sufficiency", "puzzles", "seating", "blood-relations", "direction-sense"], count: 20, minutes: null },
        { title: "Abstract Reasoning", sec: "reasoning", topics: ["non-verbal", "series", "analogies", "classification", "counting-figures", "cubes-dice"], count: 10, minutes: null },
      ],
    }),
    C({
      id: "cognizant", name: "Cognizant GenC-style", company: "Cognizant",
      blurb: "Three equal sections of 25: quantitative aptitude, logical reasoning and English comprehension, with more time for the maths and logic parts.",
      sections: [
        { title: "Quantitative Aptitude", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, Q_GEO, ["number-series", "statistics"]), count: 25, minutes: 35 },
        { title: "Logical Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, R_ARR, ["syllogisms", "statements", "data-sufficiency"], R_VIS), count: 25, minutes: 35 },
        { title: "English Comprehension", sec: "verbal", topics: V_RC.concat(V_GRAM, V_VOCAB, V_PARA), count: 25, minutes: 25 },
      ],
    }),
    C({
      id: "capgemini", name: "Capgemini-style aptitude", company: "Capgemini",
      blurb: "Short analytical sections (quant and logic) followed by a longer English communication section: grammar, vocabulary, reading and sentence order.",
      sections: [
        { title: "Analytical: Quantitative", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["number-series", "statistics"]), count: 16, minutes: 20 },
        { title: "Analytical: Logical", sec: "reasoning", topics: R_CODES.concat(R_REL, ["seating", "puzzles", "syllogisms", "statements", "inequalities", "input-output"]), count: 16, minutes: 20 },
        { title: "English Communication", sec: "verbal", topics: V_RC.concat(V_GRAM, V_VOCAB, V_PARA), count: 30, minutes: 30 },
      ],
    }),
    C({
      id: "hcl", name: "HCL-style aptitude", company: "HCL", minutes: 45, negative: 0.25, sectionLock: false,
      blurb: "Quant, reasoning and English on one 45-minute clock, with free movement between sections and a quarter mark lost for each wrong answer, so guessing costs you.",
      sections: [
        { title: "Quantitative", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["number-series"]), count: 15, minutes: null },
        { title: "Logical Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, ["seating", "puzzles", "syllogisms", "data-sufficiency"]), count: 15, minutes: null },
        { title: "Verbal Ability", sec: "verbal", topics: V_RC.concat(V_GRAM.slice(0, 2), ["fill-blanks", "vocabulary"], V_PARA), count: 15, minutes: null },
      ],
    }),
    C({
      id: "tech-mahindra", name: "Tech Mahindra-style aptitude", company: "Tech Mahindra",
      blurb: "A long English section (grammar, vocabulary, reading, written-English questions) followed by shorter quantitative and logical sections.",
      sections: [
        { title: "English", sec: "verbal", topics: V_RC.concat(V_GRAM, V_VOCAB, V_PARA, ["writing"]), count: 30, minutes: 30 },
        { title: "Quantitative Aptitude", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["mensuration-2d", "number-series"]), count: 15, minutes: 20 },
        { title: "Logical Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, R_ARR, ["syllogisms", "statements"]), count: 15, minutes: 25 },
      ],
    }),
    C({
      id: "deloitte", name: "Deloitte-style aptitude", company: "Deloitte", minutes: 60, sectionLock: false,
      blurb: "Language, quantitative and logical sections on a single one-hour clock. You can move between sections freely, so plan the order you attack them in.",
      sections: [
        { title: "Language & Communication", sec: "verbal", topics: V_RC.concat(V_GRAM, V_VOCAB, V_PARA), count: 20, minutes: null },
        { title: "Quantitative Ability", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, Q_GEO, ["number-series", "statistics"]), count: 20, minutes: null },
        { title: "Logical Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, R_ARR, R_LOGIC), count: 20, minutes: null },
      ],
    }),
    C({
      id: "amcat", name: "AMCAT-style aptitude", company: "AMCAT",
      blurb: "The three aptitude modules of the AMCAT: English comprehension, quantitative ability and logical ability, each on its own timer and locked once you move on.",
      sections: [
        { title: "English Comprehension", sec: "verbal", topics: V_RC.concat(V_GRAM.slice(0, 2), ["fill-blanks", "vocabulary"], V_PARA), count: 18, minutes: 16 },
        { title: "Quantitative Ability", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["progressions", "logarithms", "number-series"]), count: 14, minutes: 16 },
        { title: "Logical Ability", sec: "reasoning", topics: R_CODES.concat(R_REL, ["syllogisms", "statements", "critical-reasoning", "non-verbal"]), count: 14, minutes: 14 },
      ],
    }),
    C({
      id: "elitmus", name: "eLitmus pH-style test", company: "eLitmus", minutes: 120, negative: 0.25, sectionLock: false,
      blurb: "Fewer, harder questions: quantitative ability, problem solving (puzzles, data sufficiency, data sets) and verbal ability on a two-hour clock. Wrong answers cost marks, so accuracy beats attempts.",
      sections: [
        { title: "Quantitative Ability", sec: "quant", topics: ["number-system", "pnc", "probability", "algebra", "progressions", "logarithms", "geometry", "mensuration-2d", "mensuration-3d", "tsd", "time-work", "mixtures", "interest", "ratio"], count: 20, minutes: null },
        { title: "Problem Solving", sec: "reasoning", topics: ["puzzles", "seating", "data-sufficiency", "logical-deduction", "input-output", "di/di-caselet", "di/di-table", "di/di-missing", "di/di-venn"], count: 20, minutes: null },
        { title: "Verbal Ability", sec: "verbal", topics: V_RC.concat(V_PARA, ["sentence-correction", "error-spotting", "fill-blanks", "reasoning/critical-reasoning"]), count: 20, minutes: null },
      ],
    }),
    C({
      id: "cocubes", name: "CoCubes (Aon)-style aptitude", company: "CoCubes / Aon",
      blurb: "Quantitative, logical and English sections of 20 each with section timers. Steady, mid-level questions where speed matters more than tricks.",
      sections: [
        { title: "Quantitative Aptitude", sec: "quant", topics: Q_NUM.concat(Q_ARITH, Q_COUNT, ["mensuration-2d", "number-series", "clocks", "calendars"]), count: 20, minutes: 25 },
        { title: "Logical Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, ["seating", "puzzles", "syllogisms", "statements", "data-sufficiency", "non-verbal"]), count: 20, minutes: 25 },
        { title: "English", sec: "verbal", topics: V_RC.concat(V_GRAM, ["fill-blanks", "vocabulary"], V_PARA), count: 20, minutes: 20 },
      ],
    }),

    /* ------------------------------------------------------------ sectional */
    { id: "quant-sectional", name: "Quant sectional", company: "", kind: "section", marks: 1, negative: 0, sectionLock: false, calculator: false, minutes: 30,
      blurb: "20 quantitative questions from every quant topic in 30 minutes. A good weekly check on speed and accuracy in maths.",
      note: "Draws from the whole quant bank, including freshly generated percentage questions.",
      sections: [{ title: "Quantitative Aptitude", sec: "quant", topics: "all", count: 20, minutes: null }] },
    { id: "reasoning-sectional", name: "Reasoning sectional", company: "", kind: "section", marks: 1, negative: 0, sectionLock: false, calculator: false, minutes: 30,
      blurb: "20 logical-reasoning questions in 30 minutes: codes, relations, arrangements, logic and figures.",
      note: "Puzzle and seating sets keep all their questions together.",
      sections: [{ title: "Logical Reasoning", sec: "reasoning", topics: "all", count: 20, minutes: null }] },
    { id: "verbal-sectional", name: "Verbal sectional", company: "", kind: "section", marks: 1, negative: 0, sectionLock: false, calculator: false, minutes: 20,
      blurb: "20 verbal-ability questions in 20 minutes: grammar, vocabulary, reading comprehension and sentence order.",
      note: "Reading passages keep their questions together.",
      sections: [{ title: "Verbal Ability", sec: "verbal", topics: "all", count: 20, minutes: null }] },
    { id: "di-sectional", name: "DI sectional", company: "", kind: "section", marks: 1, negative: 0, sectionLock: false, calculator: false, minutes: 25,
      blurb: "Three data sets (tables, charts, caselets) with their questions, in 25 minutes. Trains you to read a chart once and answer fast.",
      note: "Each chart or caselet stays pinned on the left while you answer its questions.",
      sections: [{ title: "Data Interpretation", sec: "di", topics: "all", count: 15, minutes: null }] },

    /* ------------------------------------------------------------ full length + quick */
    { id: "full-mixed", name: "Full-length mixed mock", company: "", kind: "full", marks: 1, negative: 0.25, sectionLock: false, calculator: false, minutes: 90,
      blurb: "70 questions across quant, reasoning, verbal and DI on one 90-minute clock, with a quarter-mark penalty for wrong answers. The closest thing to a tough real test.",
      note: "Move between sections freely. Skipping is better than guessing when you can't eliminate options.",
      sections: [
        { title: "Quantitative Aptitude", sec: "quant", topics: "all", count: 20, minutes: null },
        { title: "Logical Reasoning", sec: "reasoning", topics: "all", count: 20, minutes: null },
        { title: "Verbal Ability", sec: "verbal", topics: "all", count: 20, minutes: null },
        { title: "Data Interpretation", sec: "di", topics: "all", count: 10, minutes: null },
      ] },
    { id: "quick-15", name: "Quick 15", company: "", kind: "full", marks: 1, negative: 0, sectionLock: false, calculator: false, minutes: 15,
      blurb: "15 questions in 15 minutes: five each of quant, reasoning and verbal. A warm-up you can fit into any day.",
      note: "Single questions only (no long passages or puzzle sets), so it stays quick.",
      sections: [
        { title: "Quant", sec: "quant", topics: Q_NUM.concat(Q_ARITH), count: 5, minutes: null },
        { title: "Reasoning", sec: "reasoning", topics: R_CODES.concat(R_REL, ["syllogisms", "statements", "inequalities"]), count: 5, minutes: null },
        { title: "Verbal", sec: "verbal", topics: V_GRAM.concat(["fill-blanks", "vocabulary"], V_PARA), count: 5, minutes: null },
      ] },
  ];
})();
