/* Learn pages for Verbal Ability, part 2: vocabulary, cloze test, para jumbles, sentence and para completion, writing.
   Each topic is pushed onto LEARN.verbal; the BRIEFS lines are at the end of the file. */
window.LEARN = window.LEARN || {}; LEARN.verbal = LEARN.verbal || []; window.BRIEFS = window.BRIEFS || {};

/* ===================================================================== VOCABULARY */
LEARN.verbal.push({
  id: "vocabulary", group: "Vocabulary & usage", title: "Vocabulary",
  sub: "Synonyms, antonyms, one-word substitutions, idioms, confused words and spellings: how to build a word bank that pays off in the test",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "Capgemini", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Vocabulary questions check whether you know what words mean and how they are used. They come in eight common shapes: **synonyms, antonyms, one-word substitutions, idioms and phrases, confused words, spellings, the same word with different uses, and verbal analogies.** Each is a small, quick question, so a good vocabulary score is the cheapest way to add marks in the verbal section."],
    ["p", "You cannot learn a whole dictionary before the test. What you can do is learn **word families** (roots, prefixes, suffixes), learn the usual **test words** (a few hundred come up again and again) and use **context and tone** to guess the rest. Most unknown words can be placed as positive or negative even when you do not know the exact meaning, and that alone removes two options."],
    ["list", [
      "**Synonym:** a word with nearly the same meaning. Pick the closest one, not just a related one.",
      "**Antonym:** a word with the opposite meaning. Read the question: it asks for opposite, not similar.",
      "**One-word substitution:** one word that replaces a whole phrase (a person who loves books = bibliophile).",
      "**Idiom:** a fixed phrase whose meaning is not the sum of its words (to spill the beans = to reveal a secret).",
      "**Confused words:** words that look or sound alike but differ in meaning (affect / effect).",
      "**Analogy:** two words are related in a certain way; find another pair with the same relation."
    ]],
    ["note", "A word you half-know is worth using. If you can say “it feels negative” or “it has to do with money”, you can usually remove two options even without the exact meaning."],

    ["h2", "Rules"],
    ["p", "Vocabulary has few rules, but a handful of them save many marks."],
    ["table", ["#", "Rule", "Example"], [
      ["1", "Read the question word. Synonym and antonym questions look alike, and a hurried reader picks the wrong direction.", "ANTONYM of GENEROUS: stingy, not liberal."],
      ["2", "Decide positive or negative first. Synonyms share the same feeling, antonyms carry the opposite one.", "frugal (positive: careful with money) is close to thrifty, not to miserly."],
      ["3", "Use the sentence if one is given. The meaning in context overrules the first dictionary meaning.", "“The bank will **table** the proposal” can mean to present it."],
      ["4", "Break the word into prefix, root and suffix.", "benevolent: bene (good) + vol (wish) = wishing well; malevolent = wishing harm."],
      ["5", "An option that merely resembles the word in spelling or sound is a trap.", "ELICIT (draw out) looks like ILLICIT (unlawful)."],
      ["6", "For one-word substitution the answer must match the whole phrase, not a part of it.", "A person who knows everything = omniscient; one who is present everywhere = omnipresent."],
      ["7", "An idiom is learnt as a unit. Never translate it word by word.", "A blessing in disguise = something that seems bad but turns out good."],
      ["8", "For analogies, first state the relation as a sentence, then test each option with the same sentence.", "Doctor : patient :: teacher : student (a professional serves or teaches the second)."]
    ]],
    ["h", "Prefixes and roots worth knowing"],
    ["table", ["Element", "Meaning", "Examples"], [
      ["bene-, bon-", "good", "benefit, benevolent, bonus"],
      ["mal-", "bad", "malice, malfunction, malign"],
      ["anti-, contra-", "against", "antidote, contradict, controversy"],
      ["pre-, ante-, fore-", "before", "predict, antecedent, foresee"],
      ["post-", "after", "postpone, postmortem"],
      ["omni-", "all", "omnipotent, omnivore"],
      ["-phobia / -cide", "fear / killing", "claustrophobia, insecticide"],
      ["-ology, -cracy", "study / rule", "geology, democracy"],
      ["circum-", "around", "circumference, circumvent"],
      ["pseudo-", "false", "pseudonym, pseudo-science"],
      ["dis-, un-, in-, im-", "not / opposite", "disagree, unkind, inactive, impossible"]
    ]],
    ["h", "High-frequency one-word substitutions"],
    ["table", ["Phrase", "One word"], [
      ["A person who loves books", "bibliophile"],
      ["One who knows everything", "omniscient"],
      ["Government by the people", "democracy"],
      ["A person who cannot be corrected", "incorrigible"],
      ["Something that cannot be avoided", "inevitable"],
      ["A person who is new to a field", "novice"],
      ["Murder of a king or a political leader", "assassination"],
      ["Study of ancient things and ruins", "archaeology"],
      ["A speech by one person alone", "monologue"],
      ["Fear of enclosed spaces", "claustrophobia"],
      ["Able to use both hands equally well", "ambidextrous"],
      ["A person who gives money for good causes", "philanthropist"],
      ["That which cannot be read", "illegible"],
      ["A place where birds are kept", "aviary"],
      ["One who does not believe in God", "atheist"],
      ["Leaving one's country to settle elsewhere", "emigrate (to leave) / immigrate (to enter)"]
    ]],
    ["h", "Frequently asked idioms"],
    ["table", ["Idiom", "Meaning"], [
      ["to spill the beans", "to reveal a secret by mistake"],
      ["a blessing in disguise", "a misfortune that brings a good result"],
      ["to burn the midnight oil", "to study or work late into the night"],
      ["a piece of cake", "something very easy"],
      ["to cry over spilt milk", "to regret what cannot be undone"],
      ["to beat about the bush", "to avoid coming to the point"],
      ["once in a blue moon", "very rarely"],
      ["to bite the bullet", "to face something unpleasant bravely"],
      ["at sixes and sevens", "in confusion or disorder"],
      ["the last straw", "the final small thing that makes a situation unbearable"],
      ["to let the cat out of the bag", "to reveal a secret"],
      ["under the weather", "slightly unwell"],
      ["to call it a day", "to stop working for the day"],
      ["break the ice", "to start a conversation in an awkward situation"],
      ["hit the nail on the head", "to say exactly the right thing"]
    ]],
    ["h", "Commonly confused words"],
    ["table", ["Pair", "Meaning and use"], [
      ["affect / effect", "affect (verb) = to influence; effect (noun) = result. “Rain affects crops”; “the effect of rain”."],
      ["accept / except", "accept = to receive; except = excluding."],
      ["principal / principle", "principal = head of a school or main; principle = a rule or belief."],
      ["stationary / stationery", "stationary = not moving; stationery = pens, paper."],
      ["complement / compliment", "complement = completes; compliment = praise."],
      ["elicit / illicit", "elicit = draw out; illicit = unlawful."],
      ["advice / advise", "advice (noun), advise (verb)."],
      ["lose / loose", "lose = misplace or fail to win; loose = not tight."],
      ["council / counsel", "council = a group of people; counsel = advice."],
      ["farther / further", "farther = more distant; further = additional."],
      ["emigrate / immigrate", "emigrate = leave a country; immigrate = enter a country to live."],
      ["lay / lie", "lay = to put something down (lay, laid, laid); lie = to recline (lie, lay, lain)."]
    ]],
    ["h", "Spellings that are often wrong"],
    ["table", ["Correct", "Common wrong form", "Memory hook"], [
      ["accommodation", "accomodation", "two c, two m"],
      ["necessary", "neccessary", "one c, two s: one collar, two sleeves"],
      ["separate", "seperate", "there is “a rat” in sep-a-rat-e"],
      ["definitely", "definately", "finite is inside"],
      ["occurrence", "occurence", "two c, two r"],
      ["embarrass", "embarass", "two r, two s"],
      ["receive", "recieve", "i before e except after c"],
      ["maintenance", "maintainance", "the verb maintain changes to maintenance"],
      ["government", "goverment", "govern + ment"],
      ["privilege", "priviledge", "no d"],
      ["conscience", "concience", "science sits inside"],
      ["independent", "independant", "ends -ent"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "Building a word bank in 30 days"],
    ["ol", [
      "**Learn 10 words a day** from a placement word list, together with one sentence for each. Review the old ones before adding the new.",
      "**Group by theme:** words for praise, for criticism, for secrecy, for money, for anger. A group is easier to remember than a list.",
      "**Learn opposites in pairs:** frugal / extravagant, candid / evasive, scarce / abundant. One effort gives you two words and antonym practice.",
      "**Read one editorial a day** and note the words you could not guess.",
      "**Test yourself on the move:** cover the meaning and try to recall it. Words you hesitate over go in the next day's list."
    ]],
    ["h", "When you do not know the word"],
    ["list", [
      "**Guess the feeling:** does it sound harsh (acrimonious, vindictive) or soft (benign, amiable)?",
      "**Find a word you know inside it:** “loquacious” looks like “eloquent” and “colloquial”: it has to do with speech (talkative).",
      "**Use the other options:** in a synonym question, two options that mean the same cannot both be the answer, so look for the odd one.",
      "**Try it in a sentence** you make yourself: does it sound natural?"
    ]],
    ["tip", "Antonym questions often list a synonym of the given word as an option. Underline the word ANTONYM in the question before you read the options."],
    ["tip", "Spelling questions: the wrong forms are usually a missing or doubled letter. Check the double letters first."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/vocabulary/synonyms", title: "Synonyms",
      spot: "“Choose the word closest in meaning to...”, “The word most similar to...” with a capitalised word.",
      method: ["Decide whether the given word feels positive, negative or neutral.", "Remove options with the opposite feeling.", "Of the rest, choose the one that could replace the word in a simple sentence."],
      ex: { q: "Choose the word closest in meaning to **CANDID**. (A) secretive (B) frank (C) polite (D) cunning", steps: ["“Candid” is a positive word about honesty.", "Secretive and cunning are negative or opposite in sense; polite is about manners.", "“A candid answer” = “a frank answer”."], ans: "(B) frank" },
      shortcut: "Make your own short sentence with the word, then put each option in it. The one that keeps the meaning is the synonym."
    }],
    ["pattern", {
      key: "verbal/vocabulary/antonyms", title: "Antonyms",
      spot: "“Choose the word opposite in meaning to...”.",
      method: ["Underline OPPOSITE in the question.", "Find the meaning of the given word and think of its reverse.", "Be careful: a synonym is nearly always offered as a trap."],
      ex: { q: "Choose the word opposite in meaning to **FRUGAL**. (A) thrifty (B) economical (C) extravagant (D) careful", steps: ["Frugal = careful with money.", "Thrifty, economical and careful are all close to it.", "The opposite is wasteful: extravagant."], ans: "(C) extravagant" },
      shortcut: "If three options mean the same thing as the given word, the fourth is the antonym."
    }],
    ["pattern", {
      key: "verbal/vocabulary/one-word-substitution", title: "One-word substitution",
      spot: "“Choose the one word that can replace the phrase...”.",
      method: ["Read the whole phrase and note the key idea (person, place, fear, speech, study).", "Think of the likely word or root: -phobia (fear), -cide (killing), -ology (study).", "Check that the option covers the whole phrase, not only part of it."],
      ex: { q: "One who is able to use both hands equally well is (A) ambiguous (B) ambidextrous (C) ambitious (D) amateur", steps: ["“Both hands” points to the root ambi- (both) and dexter (right hand).", "Ambiguous means unclear; ambitious means eager for success; an amateur is not a professional."], ans: "(B) ambidextrous" },
      shortcut: "Break the word into root parts; ambi = both, omni = all, phil = love, mis = hate."
    }],
    ["pattern", {
      key: "verbal/vocabulary/idioms-and-phrases", title: "Idioms & phrases",
      spot: "“Choose the meaning of the idiom...”.",
      method: ["Do not translate word by word.", "Recall the idiom as a story or a picture (beans spilling out = a secret revealed).", "If you do not know it, remove options that are literal and keep the one that fits a figure of speech."],
      ex: { q: "“To burn the midnight oil” means (A) to waste fuel (B) to work or study late at night (C) to start a fire (D) to sleep late", steps: ["Old lamps burned oil; working late meant burning oil at midnight.", "So the idiom means to work or study late."], ans: "(B) to work or study late at night" },
      shortcut: "Literal options (waste fuel, start a fire) are the trap. The real meaning is almost always figurative."
    }],
    ["pattern", {
      key: "verbal/vocabulary/confused-words", title: "Confused words (affect / effect)",
      spot: "A sentence with a blank where one of two look-alike words fits, or a question on the difference between them.",
      method: ["Decide the part of speech the blank needs (noun, verb).", "Recall the two meanings.", "Put each word in and check the sense."],
      ex: { q: "The new tax will ______ the prices of small cars. (A) effect (B) affect (C) affection (D) effort", steps: ["A verb is needed: something that will influence prices.", "Affect (verb) = to influence. Effect is mostly a noun (the effect of tax)."], ans: "(B) affect" },
      shortcut: "A is for Action (affect), E is for End result (effect)."
    }],
    ["pattern", {
      key: "verbal/vocabulary/spellings", title: "Spellings",
      spot: "“Choose the correctly spelt word”, or find the misspelt word in a list.",
      method: ["Look for double letters (accommodation, occurrence, embarrass).", "Check vowel pairs (receive, believe, separate).", "Say the word in syllables and compare with your memory hook."],
      ex: { q: "Choose the correct spelling. (A) accomodation (B) acommodation (C) accommodation (D) acomodation", steps: ["The word has two c and two m: ac-com-mo-da-tion.", "Only (C) has both doubles."], ans: "(C) accommodation" },
      shortcut: "Doubles to remember: accommodation (cc, mm), necessary (one c, ss), occurrence (cc, rr), embarrass (rr, ss)."
    }],
    ["pattern", {
      key: "verbal/vocabulary/same-word-different-uses", title: "Same word, different uses",
      spot: "A word appears in a sentence and you must find another sentence where it has the same meaning, or its meaning in the sentence given.",
      method: ["Work out the meaning of the word in the given sentence (noun, verb, adjective).", "Substitute a simple word for it.", "Choose the sentence in which the same substitute fits."],
      ex: { q: "He decided to **bear** the cost of the repairs. In which sentence does “bear” have the same meaning? (A) A bear came near the camp. (B) She could not bear the noise. (C) The company will bear the expense of training. (D) Bear left at the next signal.", steps: ["In the given sentence, bear = pay or take responsibility for.", "(C) also means pay for the expense.", "(A) is an animal, (B) means tolerate, (D) means turn."], ans: "(C)" },
      shortcut: "Replace the word with a plain word of your own (pay, tolerate, turn). The sentence that accepts the same replacement is the match."
    }],
    ["pattern", {
      key: "verbal/vocabulary/verbal-analogies", title: "Verbal analogies",
      spot: "“A : B :: C : ?” where you must pick the pair with the same relationship.",
      method: ["Write the relation as a sentence: “A is the ... of B”.", "Test every option with exactly the same sentence.", "Check the direction (cause to effect is not effect to cause)."],
      ex: { q: "Thermometer : temperature :: (A) clock : alarm (B) ruler : length (C) pen : paper (D) scale : fish", steps: ["A thermometer is the instrument that measures temperature.", "A ruler measures length: same relation.", "A clock does not measure an alarm; a pen writes on paper but does not measure it; a scale measures weight, not a fish."], ans: "(B) ruler : length" },
      shortcut: "Common relations: tool and use, part and whole, cause and effect, degree (warm : hot), worker and product, opposite."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Answering the wrong direction:** choosing a synonym when asked for an antonym. Underline the question word.",
      "**Sound-alike options:** ELICIT and ILLICIT, COMPLEMENT and COMPLIMENT. Meaning decides, not appearance.",
      "**Almost-synonyms:** two options may be close, but one carries a different feeling (frugal and miserly).",
      "**Literal idiom meanings:** the literal option is the trap.",
      "**Wrong part of speech:** affect is a verb and effect is a noun in most questions. Check what the blank needs.",
      "**Spelling by feel:** a word can “look right” and be wrong. Check doubled letters and vowel pairs.",
      "**One-word substitution that is too narrow:** the word must cover the whole phrase.",
      "**Analogy direction:** whole : part is not the same as part : whole."
    ]],
    ["warn", "If you are not sure of a word, never skip the question. Decide positive or negative, remove two options, and take the 50-50 guess."],

    ["h2", "Quick check"],
    ["quiz", ["vocab-01", "vocab-02", "vocab-04", "vocab-05", "vocab-06"]]
  ]
});

/* ===================================================================== CLOZE TEST */
LEARN.verbal.push({
  id: "cloze", group: "Vocabulary & usage", title: "Cloze test",
  sub: "One passage with several blanks: read it as a whole, find the clue for each gap, and fill them in the right order",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A cloze test is a short passage with numbered blanks. For each blank you choose one of four words. Unlike the single-sentence fill in the blanks, the passage gives a **chain of clues**: the topic, the tone, the tense and the links between sentences. The questions test grammar and vocabulary at the same time."],
    ["p", "There are two kinds. In a **grammar-based** blank all four options are forms of the same word (shares, sharing, share, shared) and you pick by tense, number or part of speech. In a **vocabulary-based** blank the four options are different words and you pick by meaning, tone and the words that usually go with it."],
    ["list", [
      "**Read the whole passage first,** ignoring the blanks, for the topic and tone. It takes 30 to 40 seconds and saves much more.",
      "**Every blank has a clue** inside the same sentence or the one before or after it.",
      "**Blanks are linked.** The answer to one blank often tells you the tense or the mood for another."
    ]],
    ["note", "The passage is the real question. If you read each sentence alone, you lose the clues about tense, tone and connectors that the examiner put there."],

    ["h2", "Rules"],
    ["table", ["#", "Rule", "Example"], [
      ["1", "Read the entire passage before answering any blank.", "The first sentence gives the topic; the last often gives the conclusion."],
      ["2", "Find the tense of the passage and keep it, unless a time word changes it.", "A passage about habits uses the present; a story uses the past."],
      ["3", "Match the verb to its subject in number, even when other words come between them.", "The results of the survey ______ (are / is) clear: plural results."],
      ["4", "Connectors decide the direction. But, although, however, yet turn the idea; and, moreover, also continue it; so, therefore, thus give a result.", "He was tired, ______ he kept working: but or yet."],
      ["5", "Look for a word that normally goes with the next word (a collocation).", "make a decision, take a decision (not do a decision)."],
      ["6", "The tone of the passage fixes the tone of the word.", "A hopeful passage will not use a gloomy adjective."],
      ["7", "After a preposition use a noun or an -ing form, not a base verb.", "He is good at ______ (play / playing) chess: playing."],
      ["8", "Fill the sure blanks first and come back to the hard ones. Check that the finished passage reads smoothly.", "Reading the passage again with your answers in place catches slips."]
    ]],
    ["h", "What the options usually vary"],
    ["table", ["If the options are...", "Then the test is on...", "Look for..."], [
      ["share, shares, sharing, shared", "verb form", "subject, tense, a helping verb (is, has, to)"],
      ["a, an, the, no article", "articles", "first mention or known thing?"],
      ["in, on, at, by", "prepositions", "fixed pairs (depend on, good at)"],
      ["which, who, whose, whom", "relative pronoun", "person or thing; possession"],
      ["however, therefore, moreover, otherwise", "connector", "contrast, result or addition"],
      ["four different nouns or adjectives", "meaning and tone", "the idea of the sentence and the sentences around it"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "A 5-step cloze routine"],
    ["ol", [
      "**Read the passage once** without stopping at blanks. Note the tense, the topic and the tone.",
      "**Do the grammar blanks first.** They are quick and can be settled by one rule.",
      "**For a vocabulary blank, read the sentence before and after.** Predict the word before you read the options.",
      "**Use elimination.** Remove options that clash in tense, number, part of speech or tone.",
      "**Read the finished passage once more** to be sure it flows."
    ]],
    ["tip", "About 40 to 60 seconds per blank is a fair budget. A 5-blank passage should take no more than 4 to 5 minutes including the first read."],
    ["tip", "If two options both seem right, look at the word that follows the blank. A preposition, article or verb form after it usually decides."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/cloze/grammar-based", title: "Grammar-based",
      spot: "All four options are forms of one word, or they are small words (articles, prepositions, pronouns).",
      method: ["Find the subject, the time word and any helping verb near the blank.", "Decide the form needed: tense, singular or plural, -ing or to-form, part of speech.", "Choose the option with that form and re-read the sentence."],
      ex: { q: "Passage: “Many students ______ (1) their notes with friends before an exam, because discussion helps them remember.” Blank (1): (A) shares (B) sharing (C) share (D) shared", steps: ["The subject is “many students”, plural, and the passage describes a habit in the present.", "A finite plural present verb is needed: share.", "Shares is singular, sharing has no helper, shared is past."], ans: "(C) share" },
      shortcut: "Read the sentence without the blank; the missing slot is usually a verb, and its form follows the subject and time words."
    }],
    ["pattern", {
      key: "verbal/cloze/vocabulary-based", title: "Vocabulary-based",
      spot: "Four different words that each look possible; the choice depends on meaning, tone or collocation.",
      method: ["Read the sentence before and after the blank to find the idea and the tone.", "Guess the word yourself first (a rough meaning is enough).", "Pick the option closest to your guess, then test the collocation and the tone."],
      ex: { q: "Passage: “The company's profits had been falling for three years. The new manager took a ______ (2) decision to close the loss-making unit, though it upset many workers.” Blank (2): (A) casual (B) hesitant (C) difficult (D) humorous", steps: ["The context: heavy losses and a move that upset many workers.", "Predict the word: a serious, painful choice, so “difficult” (or “tough”).", "Casual and humorous clash with the serious tone; hesitant describes the manager, not the decision, and “though it upset” suggests she went ahead."], ans: "(C) difficult" },
      shortcut: "Predict first. If your guess is “difficult”, the option closest to it wins; do not let a fancier word tempt you."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Filling a blank without reading the passage:** two options can fit the sentence but only one fits the passage.",
      "**Ignoring the connector:** “but” and “and” give opposite directions.",
      "**Wrong number:** the noun right before the blank is not always the subject.",
      "**Changing the tense mid-passage:** unless a time word forces it, the passage keeps one tense.",
      "**Choosing a rare word to look clever:** the passage rewards the natural, fitting word.",
      "**Skipping the second read:** one wrong blank often hides a clash that you would notice on a re-read."
    ]],
    ["warn", "A cloze passage is only as strong as its weakest blank. Do the sure ones first, so that you have time left for the hard ones."],

    ["h2", "Quick check"],
    ["quiz", ["cloze-01", "cloze-02", "cloze-03", "cloze-04", "cloze-07"]]
  ]
});

/* ===================================================================== PARA JUMBLES */
LEARN.verbal.push({
  id: "para-jumbles", group: "Sentences & paragraphs", title: "Para jumbles",
  sub: "Put jumbled sentences into a logical paragraph: find the opening, link the pairs, follow the time order",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "In a para jumble you are given four or five sentences (usually labelled P, Q, R, S) in the wrong order. You must arrange them into a paragraph that reads like a piece of connected writing. The options are strings like PQRS, QPSR and so on."],
    ["p", "The skill is not guessing the whole order at once. Instead, you look for **small certain facts**: which sentence can start the paragraph, which two sentences must sit side by side, which sentence must come before another. Each fact kills some of the options, and usually two or three facts leave exactly one."],
    ["list", [
      "**Opening sentence:** introduces the topic. It makes sense with no earlier sentence.",
      "**Mandatory pair:** two sentences that must be adjacent (a pronoun and the noun it stands for, a question and its answer).",
      "**Connector chain:** words such as however, therefore, also, then, finally show where a sentence sits.",
      "**Closing sentence:** concludes, summarises or looks ahead."
    ]],
    ["note", "You never need to read the options before you start. Try to decide the opening sentence and one pair, then scan the options for the one that matches."],

    ["h2", "Rules"],
    ["table", ["#", "Rule", "Example"], [
      ["1", "The opening sentence is complete in itself. It names the subject in full and does not depend on an earlier sentence.", "“Tea is the most widely drunk beverage in India.” can open; “It was brought by the British.” cannot."],
      ["2", "A pronoun (he, she, it, they, this, these) must come after the noun it refers to.", "“Priya joined the firm in 2018. She was promoted in 2021.”"],
      ["3", "A sentence with a definite article or “this / that / these / such” often refers back to an earlier sentence.", "“This change improved sales.” needs the change to be mentioned first."],
      ["4", "A general idea comes before a specific example, and a problem comes before its solution.", "Pollution rises; therefore cities ban old vehicles."],
      ["5", "Connectors fix position: however and but follow an idea to be contrasted; therefore and thus follow a reason; finally and lastly are near the end.", "“However, not everyone agreed.” cannot be first."],
      ["6", "Follow time order when dates or sequence words appear (first, then, later, afterwards).", "In 1991 ... In 2005 ... Today ..."],
      ["7", "A question is followed by its answer, and a claim by its proof or example.", "“Why do cities grow? Because people seek work.”"],
      ["8", "Look for the same keyword repeated in two sentences: they probably sit together.", "Both mention “monsoon” and “crops”."],
      ["9", "The paragraph is complete only if the last sentence closes the idea.", "A conclusion, result or a final remark."]
    ]],
    ["h", "Signal words and where they sit"],
    ["table", ["Type", "Words", "Usually found"], [
      ["Opening", "In general, Nowadays, Everyone knows, There are two kinds of...", "Start of the paragraph"],
      ["Addition", "Also, Moreover, Besides, In addition, Another", "Middle"],
      ["Contrast", "But, However, Yet, On the other hand, Although", "After the idea it contrasts with"],
      ["Cause / result", "Because, Therefore, Thus, As a result, Hence", "After the cause"],
      ["Sequence", "First, Then, Next, Afterwards, Later, Finally", "In their natural order"],
      ["Example", "For example, For instance, Such as", "After the general statement"],
      ["Conclusion", "In short, Overall, Thus, To sum up", "End"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "The 4-step method"],
    ["ol", [
      "**Find the opening.** Which sentence introduces the topic and uses no pronoun without a noun? Eliminate options that begin with other sentences.",
      "**Find a mandatory pair.** Look for noun-then-pronoun, question-then-answer, or two sentences sharing a keyword. Eliminate options that split the pair.",
      "**Check the connectors and time order** for the remaining options.",
      "**Read the surviving order** once, from start to finish. It should flow as a short story."
    ]],
    ["tip", "With four sentences, there are 24 possible orders. Two certain facts usually leave one or two options to compare."],
    ["tip", "If the opening is unclear, find the closing sentence instead (a conclusion or a final result) and work backwards."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/para-jumbles/opening-sentence", title: "Opening sentence",
      spot: "Options start with different letters, so deciding the first sentence removes most of them.",
      method: ["Find the sentence that names the topic and needs no earlier sentence.", "Reject sentences starting with pronouns, “this”, “however” or “also”.", "Keep only options beginning with your choice."],
      ex: { q: "P. The app then sends the money to the shop's account. Q. To pay by UPI, you first scan the shop's QR code. R. You enter the amount and your PIN. S. A confirmation message appears within seconds. Options: (A) PQRS (B) QRPS (C) RQPS (D) SPRQ", steps: ["Q introduces the subject (paying by UPI) and says “first”.", "Then R (enter amount), P (“then sends the money”), and S (the result).", "Order: Q R P S."], ans: "(B) QRPS" },
      shortcut: "Words like “first” and “To begin with” and a full noun phrase mark the opening."
    }],
    ["pattern", {
      key: "verbal/para-jumbles/mandatory-pairs", title: "Mandatory pairs (pronoun → noun)",
      spot: "Two sentences that must sit together: one has a noun, and the next has a pronoun or “this / that” for it.",
      method: ["Mark each pronoun and look for the sentence that names the person or thing.", "Join them as a pair, with the noun sentence first.", "Choose the option in which the pair stays together in that order."],
      ex: { q: "P. Its leaves are used in tea and in home remedies. Q. The tulsi plant is grown in most Indian homes. R. Many families also water it every morning as a ritual. S. It is held sacred in Hindu tradition. Pick the order where P follows Q at once. Options: (A) QPSR (B) QRPS (C) PQRS (D) SQPR", steps: ["Q names the plant. P (“Its leaves”) must follow it directly.", "S says “It is held sacred” and R says “also water it”: the ritual sentence R builds on the sacred status in S, so S comes before R.", "Order: Q P S R."], ans: "(A) QPSR" },
      shortcut: "A pronoun can never come before its noun in the same paragraph. Find the first sentence that names the thing."
    }],
    ["pattern", {
      key: "verbal/para-jumbles/connectors-and-time-order", title: "Connectors & time order",
      spot: "Sentences with then, later, finally, however, therefore, or dates and stages.",
      method: ["List the time markers and arrange them in natural order.", "Place contrast words after the idea they contrast with and result words after their cause.", "Check the chain in the remaining options."],
      ex: { q: "P. Last year she became the regional head. Q. Meera joined the firm as a trainee in 2015. R. By 2019 she was leading a small team. Options: (A) QRP (B) PRQ (C) RQP (D) QPR", steps: ["The dates give the order: 2015 (Q), 2019 (R), last year (P).", "Order: Q R P."], ans: "(A) QRP" },
      shortcut: "Sort by time first. Dates and words like “later”, “now” and “finally” are the surest clues."
    }],
    ["pattern", {
      key: "verbal/para-jumbles/fixed-first-and-last", title: "Fixed first and last",
      spot: "Sentences 1 and 6 (or the first and last) are given as fixed, and you arrange only the middle ones.",
      method: ["Read the first and last sentence to see where the paragraph starts and ends.", "Decide which middle sentence follows the first (or leads to the last).", "Use pronouns and connectors between the middle sentences."],
      ex: { q: "1. Rohan wanted to start a small bakery. P. He saved part of his salary for two years. Q. With the money he rented a tiny shop near the station. R. Soon his cakes became popular in the neighbourhood. 6. Today he runs three branches. Options: (A) PQR (B) QPR (C) RPQ (D) PRQ", steps: ["After the wish to start a bakery, saving money (P) comes first.", "Then renting the shop with the money (Q), then growing popularity (R), which leads to three branches.", "Order: P Q R."], ans: "(A) PQR" },
      shortcut: "Build a bridge from the first sentence to the last: ask what must happen in between."
    }],
    ["pattern", {
      key: "verbal/para-jumbles/odd-sentence-out", title: "Odd sentence out",
      spot: "Five sentences are given and one does not belong with the others; you pick the one that does not fit the paragraph.",
      method: ["Find the common topic of most of the sentences.", "Find the one that moves to a new topic, or repeats a different idea.", "Check that, without it, the other sentences form a smooth paragraph."],
      ex: { q: "P. Regular exercise strengthens the heart. Q. It also improves sleep and mood. R. The city has built three new stadiums this year. S. Even a 30-minute walk a day can help. Which sentence is the odd one out?", steps: ["P, Q and S are about the benefits of exercise.", "R is about stadiums in a city, a different topic."], ans: "R" },
      shortcut: "Ask “what is the paragraph about?”. The sentence that cannot be tied to that one idea is the odd one."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Starting with a sentence that sounds like an opening but has a pronoun:** “It” and “They” need an earlier noun.",
      "**Ignoring a mandatory pair:** many wrong options split a noun-pronoun pair.",
      "**Putting the conclusion early:** a sentence with “thus” or “in short” belongs near the end.",
      "**Forgetting the time order:** a later date cannot be mentioned first.",
      "**Choosing by sound:** read the final order for logic, not just fluency.",
      "**Odd-one-out on the wrong test:** the odd sentence is the one on a different idea, not the shortest or longest."
    ]],
    ["warn", "Do not shuffle all sentences in your head. Fix the opening, fix one pair, then use the options to finish."],

    ["h2", "Quick check"],
    ["quiz", ["pj-01", "pj-02", "pj-03", "pj-04", "pj-05"]]
  ]
});

/* ===================================================================== SENTENCE & PARA COMPLETION */
LEARN.verbal.push({
  id: "para-completion", group: "Sentences & paragraphs", title: "Sentence & para completion",
  sub: "Choose the sentence that fits the gap: continue the idea, keep the tone and do not add a new topic",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "In a paragraph-completion question, a short paragraph is given with one sentence missing: the **last** sentence, a **middle** one, or the **conclusion** that the facts lead to. You must choose the option that fits the paragraph in idea, direction, tone and scope."],
    ["p", "The right sentence does one of three jobs: it **concludes** the argument, it **bridges** two sentences, or it **adds the next logical step**. The wrong options usually repeat what has been said, introduce a new topic, go too far, or reverse the direction."],
    ["list", [
      "**Last sentence:** wraps up the idea, gives the result or the lesson.",
      "**Middle sentence:** connects the sentence before to the sentence after. It must fit both.",
      "**Logical conclusion:** a statement that follows from the facts given. It must not need an extra fact."
    ]],
    ["note", "Every answer is tested by two questions: does it follow from what came before, and (for a middle sentence) does it lead to what comes after?"],

    ["h2", "Rules"],
    ["table", ["#", "Rule", "Example"], [
      ["1", "Find the main idea of the paragraph before you read the options.", "Late sleep leads to tiredness and poor focus: idea = sleep affects study."],
      ["2", "The answer must continue the same topic, not move to a new one.", "A paragraph on sleep cannot end with a sentence on libraries."],
      ["3", "The tone of the answer must match the paragraph (serious, neutral, hopeful).", "A warning paragraph does not end in a joke."],
      ["4", "Avoid options that only repeat an earlier sentence in other words.", "“Phones affect sleep” adds nothing after a sentence that says the same."],
      ["5", "Avoid extreme claims (always, never, all, only) that the paragraph does not support.", "“All students must give up phones” goes too far."],
      ["6", "A middle sentence must link: its start follows the earlier sentence and its end leads into the next.", "Words like “this”, “such” or “however” in the following sentence give hints."],
      ["7", "A conclusion must follow from the given facts alone; do not use outside knowledge.", "Facts about rising prices and fixed income lead to “budgets get tighter”."],
      ["8", "A signal word at the end of the visible text (therefore, so, thus) asks for a result; “for example” asks for an example; “but” asks for a contrast.", "“...Therefore, ______” needs a result."]
    ]],
    ["h", "What a gap sentence usually does"],
    ["table", ["Position", "Likely job", "Clue to look for"], [
      ["Last", "Conclusion, lesson, result, advice", "“Therefore”, “Thus”, “In short”, a problem stated earlier"],
      ["Middle", "Example, reason, contrast, explanation", "A pronoun (“this”, “it”) in the next sentence that must refer back to your sentence"],
      ["Conclusion", "Inference from the facts", "Numbers, comparisons or cause and effect already given"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "The 4-step method"],
    ["ol", [
      "**State the main idea** of the paragraph in a few words.",
      "**Predict** the kind of sentence needed (conclusion, example, contrast, result) from the signal words.",
      "**Eliminate** options that change the topic, repeat, go too far, or reverse the direction.",
      "**Read it in place** and check that it also leads into the next sentence if one follows."
    ]],
    ["tip", "For middle sentences, read the sentence after the gap first. If it starts with “This” or “Such”, your answer must contain the thing that “this” refers to."],
    ["tip", "The correct option often has a link word of its own (so, as a result, similarly) that echoes the text before it."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/para-completion/last-sentence", title: "Last sentence",
      spot: "A paragraph followed by a blank and four candidate closing sentences.",
      method: ["Summarise the main idea and the direction (problem, cause, trend).", "Look for the option that concludes or gives a result or lesson.", "Reject options that start a new topic, repeat, or exaggerate."],
      ex: { q: "Many students spend hours on their phones every night. They sleep late and wake up tired. Their concentration in class suffers as a result. ______ (A) Phones were invented in the twentieth century. (B) Limiting screen time at night can therefore improve both sleep and studies. (C) Some students prefer to study in the library. (D) Teachers should stop giving homework.", steps: ["The paragraph shows a problem and its effects: phone use, poor sleep, poor focus.", "A fitting ending gives the lesson: limit screen time.", "(A) and (C) are off-topic, (D) is an unsupported leap."], ans: "(B)" },
      shortcut: "After a problem and its effects, the best last sentence is often the remedy or lesson."
    }],
    ["pattern", {
      key: "verbal/para-completion/middle-sentence", title: "Middle sentence",
      spot: "A blank in the middle of the paragraph; the sentence before and the sentence after are both given.",
      method: ["Read the sentences before and after and see how the idea moves from one to the other.", "Predict what must be said in between (an example, a reason, a turn).", "Check that the chosen sentence fits the sentence before and makes the one after make sense."],
      ex: { q: "Cycling to work saves money on fuel. ______ It also keeps the rider fit without a separate trip to the gym. (A) Petrol prices are rising in many cities. (B) Cars are the most popular form of transport. (C) Moreover, it adds no pollution to the air. (D) Many offices have no parking space.", steps: ["The next sentence starts with “It also”, so it adds one more benefit of cycling.", "The gap must give another benefit: (C) says it adds no pollution.", "(A), (B) and (D) are about cars or petrol and do not give a benefit of cycling."], ans: "(C)" },
      shortcut: "“Also”, “too”, “moreover” in the sentence after the gap say that the gap holds a similar point."
    }],
    ["pattern", {
      key: "verbal/para-completion/logical-conclusion", title: "Logical conclusion",
      spot: "“Which of the following can be concluded from the paragraph?”, “The most logical ending is...”.",
      method: ["Note the facts and numbers given.", "Work out what follows from them with no extra assumptions.", "Choose the statement that is certainly true and reject the ones that need outside facts or go further."],
      ex: { q: "Prices of vegetables rose by 20% this year. A household's income did not change. Which is the most logical conclusion? (A) The household can now buy fewer vegetables with the same money. (B) The household will stop eating vegetables. (C) Vegetable farmers earned 20% more. (D) Income will rise next year.", steps: ["Higher prices with the same income means the same money buys less.", "(B), (C) and (D) need information the paragraph never gives."], ans: "(A)" },
      shortcut: "The safest conclusion uses only what the paragraph states. If you need one more fact to justify an option, it is wrong."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**A new topic dressed as a conclusion:** it sounds like an ending but the paragraph never discussed it.",
      "**Repeating the paragraph:** the option restates an earlier sentence with no progress.",
      "**Going too far:** a bold advice or a total claim (“all”, “must”) not supported by the facts.",
      "**Wrong tone or direction:** a cheerful ending for a warning paragraph, or a reversal where none is signalled.",
      "**Ignoring the next sentence:** a middle sentence must lead into what follows.",
      "**Using outside knowledge:** a true fact from real life is wrong if the paragraph does not support it."
    ]],
    ["warn", "For every option ask “does the paragraph itself lead to this?”. If the answer needs an extra fact, drop the option."],

    ["h2", "Quick check"],
    ["quiz", ["pc-01", "pc-03", "pc-05", "pc-02", "pc-04"]]
  ]
});

/* ===================================================================== WRITING */
LEARN.verbal.push({
  id: "writing", group: "Writing", title: "Writing",
  sub: "Emails, short essays and spoken-English tests: structure, tone and a fixed plan you can use under time pressure",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "Versant", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "Many placement tests include a writing or communication round: write an email, write a short essay, or answer spoken and typed tasks in a computer-scored test such as a Versant-style test. The examiner is not looking for rare words. The marks go for **clear structure, correct grammar, the right tone and answering the task that was asked**."],
    ["p", "Writing under time pressure is easier if you follow a **fixed template**. For an email it is subject, greeting, purpose, details, action, closing. For an essay it is a short plan, then introduction, two or three body paragraphs and a conclusion. For a spoken test it is clear speech, complete sentences and steady pace."],
    ["list", [
      "**Email:** short, polite, one purpose, a clear request or action.",
      "**Essay:** one main idea in the introduction, one point per paragraph, a closing line.",
      "**Communication test:** accuracy first, then fluency, then speed."
    ]],
    ["note", "Simple and correct beats long and risky. A short sentence without errors scores higher than a long sentence with two mistakes."],

    ["h2", "Rules"],
    ["h", "Email structure"],
    ["table", ["Part", "What goes there", "Example"], [
      ["Subject line", "Purpose and key detail, under about eight words. Never blank, never vague.", "Leave request: 12–14 November"],
      ["Greeting", "Dear Mr / Ms + surname for formal; Hi + first name only if you know the person well.", "Dear Ms Rao,"],
      ["Opening line", "Why you are writing, in one sentence.", "I am writing to request leave from 12 to 14 November."],
      ["Body", "Reason, key details, anything the reader needs. Short paragraphs of two to three sentences.", "I need to attend my cousin's wedding in Madurai. I will complete my pending work before I leave."],
      ["Action / request", "What you want the reader to do, and by when.", "Kindly approve the leave by Friday."],
      ["Closing line", "Courtesy and next step.", "Thank you for your consideration."],
      ["Sign-off", "Formal: Yours sincerely / Best regards / Regards. Then your full name.", "Regards,\nArjun Nair"]
    ]],
    ["h", "Tone: formal and informal"],
    ["table", ["Feature", "Formal (manager, client, HR)", "Informal (close colleague)"], [
      ["Greeting", "Dear Sir / Madam, Dear Mr Sharma", "Hi Anita"],
      ["Language", "I would like to..., Could you please...", "Can you...?, Just checking..."],
      ["Contractions", "Avoid: do not, cannot", "Allowed: don't, can't"],
      ["Slang, emoji, short forms", "Never (ASAP, FYI, thx, u)", "Light use only, with people you know"],
      ["Sign-off", "Yours sincerely / Regards", "Thanks / Best"]
    ]],
    ["h", "Model email (formal request)"],
    ["html", "<div style=\"border:1px solid currentColor;border-radius:8px;padding:14px 16px;max-width:560px;font-size:0.95em;line-height:1.55\"><p style=\"margin:0 0 8px\"><strong>To:</strong> hr@sunriseinfotech.example<br><strong>Subject:</strong> Leave request: 12–14 November</p><p style=\"margin:0 0 8px\">Dear Ms Rao,</p><p style=\"margin:0 0 8px\">I am writing to request leave from Wednesday, 12 November, to Friday, 14 November, to attend a family wedding in Madurai.</p><p style=\"margin:0 0 8px\">I have completed the monthly report and will hand over my pending tasks to Karthik before I leave. I can be reached by phone in case of an urgent need.</p><p style=\"margin:0 0 8px\">Kindly approve my leave by Friday, 7 November. Thank you for your consideration.</p><p style=\"margin:0\">Regards,<br>Arjun Nair<br>Software Trainee, Team B</p></div>"],
    ["p", "Why it works: the subject line gives the purpose and dates; the first line states the request; the body gives the reason and shows responsibility; the last paragraph asks for a decision by a date; the sign-off is polite and complete."],
    ["h", "Useful phrases"],
    ["table", ["Purpose", "Phrases"], [
      ["Opening", "I am writing to..., I am writing with reference to..., Further to our conversation..."],
      ["Request", "Could you please..., I would be grateful if you could..., Kindly..."],
      ["Giving information", "Please find attached..., I would like to inform you that..., This is to confirm that..."],
      ["Apology", "I apologise for the delay, I regret any inconvenience caused."],
      ["Follow-up", "I am following up on..., I wanted to check whether..."],
      ["Closing", "Thank you for your time, I look forward to hearing from you, Please let me know if you need anything further."]
    ]],
    ["h", "Essay planning"],
    ["table", ["Part", "Job", "Length for a 300-word essay"], [
      ["Plan (not marked)", "Pick a stand and three points; jot them in the margin", "2 minutes"],
      ["Introduction", "Introduce the topic, give a brief context, state your main idea", "40 to 50 words"],
      ["Body paragraph 1", "Point + reason or example", "70 to 80 words"],
      ["Body paragraph 2", "Point + reason or example", "70 to 80 words"],
      ["Body paragraph 3 (optional)", "Counter-view and your reply, or a further point", "50 to 60 words"],
      ["Conclusion", "Sum up and close with a view or recommendation. No new points.", "40 to 50 words"],
      ["Check", "Spelling, tenses, repeated words", "2 minutes"]
    ]],
    ["list", [
      "**One idea per paragraph.** Start with a topic sentence and support it with a reason or an example.",
      "**Link the paragraphs** with connectors: firstly, moreover, however, as a result, in conclusion.",
      "**Choose a stand** (for, against or balanced) and stay with it.",
      "**Use Indian, concrete examples** (UPI, monsoon, metro, a local village) rather than vague statements."
    ]],
    ["h", "Versant-style communication tests"],
    ["p", "These tests are marked by a computer on both **content** and **speech**. The exact task list changes by version, but the usual types are: reading a sentence aloud, repeating a sentence you hear, building a sentence from jumbled phrases, answering a short question, completing a passage from memory, and a short typed or spoken response."],
    ["table", ["Task", "What is judged", "What to do"], [
      ["Read aloud", "Pronunciation, pace, clarity", "Read each word fully; pause at commas and full stops; do not rush"],
      ["Repeat a sentence", "Listening, memory, grammar", "Say the sentence in the same words and order; do not paraphrase; say it even if you miss one word"],
      ["Sentence builds", "Grammar and word order", "Put the phrases in a natural order: subject, verb, object, place, time"],
      ["Short answer", "Understanding and vocabulary", "Answer in one or two words if that is enough; no long explanations"],
      ["Passage reconstruction", "Comprehension and recall", "Note the main events and names; retell in your own words in complete sentences"],
      ["Opinion / email task", "Organisation, accuracy", "Give a point, a reason and an example; keep sentences short"]
    ]],

    ["h2", "Shortcuts"],
    ["h", "A fixed plan for each task"],
    ["ol", [
      "**Email:** read the task and underline the points you must cover; write the subject; write one line per point; read the whole email once for spelling and tone.",
      "**Essay:** spend the first two minutes on a three-point plan; write the introduction last if you are short of time; keep the last two minutes for checking.",
      "**Spoken test:** speak slowly enough to be clear. A steady, even pace scores better than a fast, uneven one.",
      "**Always answer the question asked.** An excellent answer to a different question gets no marks."
    ]],
    ["tip", "Cover every point in the task. If the task says “mention the date, the venue and the dress code”, check them off one by one before you write the sign-off."],
    ["tip", "For spoken tests, a short correct sentence is better than a long sentence with a false start. Do not stop to correct yourself more than once."],
    ["tip", "Use the given phrases exactly as provided when the task says “use the following phrases”. Underline them in your plan so that none is missed."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/writing/email-writing", title: "Email writing (structure, tone, using the given phrases)",
      spot: "“Write an email to your manager / HR / a client...” or questions about subject lines, greetings, closings and tone.",
      method: ["Note the reader (formal or informal) and the points you must cover.", "Write in order: subject, greeting, purpose line, details, request, closing, sign-off.", "Use any phrases given in the task exactly, keep sentences short and finish with a clear action."],
      ex: { q: "Write the opening two sentences of an email to a client apologising for a delayed delivery. Use the phrases “I apologise for” and “revised date”.", steps: ["Formal reader, so: Dear Mr Iyer, and a polite tone.", "State the purpose at once and give the next step.", "Draft: “I apologise for the delay in delivering your order of 200 notebooks. The revised date of delivery is Tuesday, 18 November, and I will confirm dispatch by email.”"], ans: "Dear Mr Iyer, I apologise for the delay in delivering your order of 200 notebooks. The revised date of delivery is Tuesday, 18 November, and I will confirm dispatch by email." },
      shortcut: "Remember the order: Subject, Greeting, Purpose, Details, Request, Closing, Name."
    }],
    ["pattern", {
      key: "verbal/writing/essay-planning", title: "Essay planning",
      spot: "“Write a short essay on...” or questions asking which plan, opening line or concluding line is best.",
      method: ["Read the topic and decide the stand (for, against or balanced).", "Note three points, each with a reason or an example.", "Order the points; write the introduction, the body paragraphs and the conclusion; add no new point at the end."],
      ex: { q: "Topic: “Should offices allow work from home?” Choose the best three-point plan. (A) Cost, personal freedom, my cousin's job (B) Saved travel time, better focus, risk to team bonding and how to manage it (C) Offices are old, computers are cheap, India is large (D) Yes, no, maybe", steps: ["A good plan has relevant points with a reason, and covers a counter-view.", "(B) has two benefits and one concern with a way to manage it: balanced and on topic.", "(A) and (C) contain unrelated points; (D) is not a plan."], ans: "(B)" },
      shortcut: "Plan = stand + three points + one example each. If you write down only this, the essay almost writes itself."
    }],
    ["pattern", {
      key: "verbal/writing/communication-test-tips", title: "Communication-test tips (Versant-style)",
      spot: "A spoken or typed task: repeat a sentence, build a sentence, answer a question, retell a passage, give an opinion.",
      method: ["Listen or read carefully for the whole task before you start.", "Respond in complete, simple sentences with correct grammar.", "Speak at a steady pace with clear word endings; do not stop for long pauses."],
      ex: { q: "In a “repeat the sentence” task you hear: “The training session will start at nine tomorrow morning.” You are not sure about the last word. What should you do?", steps: ["The task is graded on accuracy and fluency.", "Say the complete sentence in the same order, choosing the most likely last word, instead of stopping.", "Do not stay silent or restart."], ans: "Repeat the whole sentence in the same order, guessing the last word, without stopping." },
      shortcut: "Never go silent. A near-correct complete sentence scores better than a blank."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Vague or missing subject line:** “Hello” or “Urgent” tells the reader nothing.",
      "**Wrong tone:** slang, emoji, “thx”, “u” and all capitals in a formal email.",
      "**Too long:** long paragraphs bury the request. Two or three sentences per paragraph is enough.",
      "**Missing the action:** an email that never says what you want, or by when.",
      "**Skipping points in the task:** miss one and you lose marks even if the rest is perfect.",
      "**Essay without a plan:** the ideas jumble and the conclusion adds a new point.",
      "**Memorised openings:** generic lines that do not fit the topic read badly.",
      "**Speaking fast to finish early:** unclear words cost more than the seconds you save.",
      "**Paraphrasing in repeat tasks:** the task asks for the same words, not your own."
    ]],
    ["warn", "Always read your email or essay once before submitting. Most lost marks are small slips: a missing full stop, a wrong date, or a name spelt two ways."],

    ["h2", "Quick check"],
    ["quiz", ["wr-01", "wr-03", "wr-06", "wr-09", "wr-07"]]
  ]
});

/* ===================================================================== BRIEFS */
BRIEFS["verbal:vocabulary"] = "Vocabulary questions come in eight shapes: synonyms, antonyms, one-word substitutions, idioms, confused words, spellings, same word different uses and analogies. Read the question word (synonym or antonym), decide whether the word feels positive or negative, and remove the options with the wrong feeling.\n\nBuild a word bank with about ten words a day in themes and opposite pairs, and break unknown words into prefix, root and suffix. Learn idioms as units and watch out for look-alike traps such as elicit and illicit.";
BRIEFS["verbal:cloze"] = "A cloze test is a passage with numbered blanks. Read the whole passage first for the topic, tense and tone, then fill the grammar blanks (verb forms, articles, prepositions) before the vocabulary ones.\n\nEach blank has a clue in the same or neighbouring sentence. Connectors such as but and therefore show the direction, and a final re-read of the finished passage catches slips.";
BRIEFS["verbal:para-jumbles"] = "Do not arrange all the sentences at once. Find the opening sentence (it names the topic and has no unexplained pronoun), then a mandatory pair (a noun and the pronoun that refers to it, or a question and its answer), and use the options to remove the rest.\n\nFollow time order and connectors: however follows an idea it contrasts with, therefore follows a cause, and finally sits near the end. For odd-one-out, find the sentence on a different topic.";
BRIEFS["verbal:para-completion"] = "State the main idea of the paragraph, then predict what the missing sentence has to do: conclude, bridge or give the next step. The right option stays on topic, matches the tone and follows from the given facts only.\n\nReject options that repeat the paragraph, start a new topic, go too far with words like all or must, or need an outside fact. For a middle sentence, check that it also leads into the next sentence.";
BRIEFS["verbal:writing"] = "For an email use a fixed order: specific subject line, greeting, purpose in the first line, short details, a clear request with a date, a polite closing and your name. Keep the tone formal for managers, clients and HR, with no slang or short forms.\n\nFor an essay spend two minutes on a stand and three points, write an introduction, two or three body paragraphs and a conclusion with no new point. In Versant-style tests speak clearly at a steady pace, use complete simple sentences and never go silent.";
