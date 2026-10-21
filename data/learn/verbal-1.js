/* Learn pages for Verbal Ability, part 1: reading comprehension, error spotting, sentence correction, voice, narration, fill in the blanks.
   Each topic is pushed onto LEARN.verbal; the BRIEFS lines are at the end of the file. */
window.LEARN = window.LEARN || {}; LEARN.verbal = LEARN.verbal || []; window.BRIEFS = window.BRIEFS || {};

/* ===================================================================== READING COMPREHENSION */
LEARN.verbal.push({
  id: "reading-comprehension", group: "Reading", title: "Reading comprehension",
  sub: "Read for the point, not for every word: how to find the answer inside the passage in under two minutes",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A reading comprehension (RC) passage is a short piece of writing followed by questions. The test is not about how much you know. Every answer is **already in the passage**, directly or by one small logical step. Your job is to find it fast and not be fooled by options that sound sensible but are not supported by the text."],
    ["p", "Most passages have the same skeleton: an **opening** that sets the topic, a **middle** that gives reasons, examples or a counter-view, and an **ending** that concludes or warns. Once you can see that skeleton, the main idea, the tone and the author's purpose are usually visible after the first and last sentences."],
    ["list", [
      "**Main idea:** what the whole passage is about, in one sentence. It is wider than any single detail.",
      "**Detail:** a fact stated in the passage. Find the line, re-read it, answer.",
      "**Inference:** something the passage clearly suggests but does not say in so many words.",
      "**Tone and purpose:** how the author feels (tone) and why the author wrote it (purpose).",
      "**Vocabulary in context:** what a word means in this particular sentence."
    ]],
    ["note", "Think of the passage as the only book you are allowed to open. If you need outside knowledge to justify an option, that option is wrong."],

    ["h2", "Rules"],
    ["p", "These ten rules are the whole rulebook of RC. Each one removes a type of wrong option."],
    ["table", ["#", "Rule", "What it means in practice"], [
      ["1", "The passage is the only authority", "Your own opinion, general knowledge and “what is true in real life” do not count. Ask: which line says this?"],
      ["2", "Main idea covers the whole passage", "An option that is true but covers only one paragraph is too narrow. An option that goes beyond the passage is too broad."],
      ["3", "Beware extreme words", "Always, never, only, all, none, completely, must, every are usually wrong. Passages are careful; safe words like often, may, some, generally are usually right."],
      ["4", "Inference means one safe step", "A good inference follows almost certainly from the lines. If you need two or three guesses to reach it, it is a leap, not an inference."],
      ["5", "Tone comes from word choice", "Look at adjectives, adverbs and verbs the author uses. “Disappointing, careless, failed” = critical. “Promising, encouraging” = optimistic."],
      ["6", "Words are decided by the sentence", "A word can have many meanings. Put each option in the sentence and see which one keeps the sense. Ignore the first dictionary meaning."],
      ["7", "Purpose is a verb", "Author's purpose answers “why did the author write this?”: to argue, describe, explain, criticise, warn, compare, persuade, narrate, inform."],
      ["8", "Three-way rule for True / False / Cannot say", "True: the passage says it or proves it. False: the passage says the opposite. Cannot say: the passage is silent. Do not use your own knowledge."],
      ["9", "The author is not the people quoted", "If the passage reports what critics, experts or villagers think, do not mistake it for the author's view unless the author agrees."],
      ["10", "Signal words show the structure", "But, however, yet, although signal a turn. Because, since, therefore, thus show cause and result. For example, for instance show support. The sentence after a “however” is often the main point."]
    ]],
    ["h", "Signal words"],
    ["table", ["Job", "Words", "What to expect"], [
      ["Contrast", "but, however, yet, although, whereas, on the other hand, nevertheless", "The idea turns. The part after the signal is usually the author's real point."],
      ["Addition", "moreover, besides, also, in addition, furthermore", "More of the same idea."],
      ["Cause / reason", "because, since, as, owing to, due to", "A reason follows: a favourite for detail questions."],
      ["Result / conclusion", "therefore, thus, hence, as a result, consequently, in short", "The conclusion, often the main idea."],
      ["Example", "for example, for instance, such as, like", "Supports a point. Examples are rarely the main idea."]
    ]],
    ["h", "Tone words you should know"],
    ["table", ["Positive", "Neutral", "Negative"], [
      ["optimistic, appreciative, enthusiastic, admiring", "objective, analytical, informative, descriptive", "critical, sarcastic, pessimistic, cynical"],
      ["hopeful, encouraging, supportive", "factual, balanced, impartial, matter-of-fact", "scornful, indignant, dismissive, disapproving"],
      ["humorous, light-hearted, playful", "reflective, thoughtful, curious", "sceptical, anxious, alarmed, resentful"]
    ]],
    ["h", "Purpose verbs"],
    ["table", ["Verb", "Use it when the author..."], [
      ["to inform / describe", "gives facts or a picture, with no strong opinion"],
      ["to explain", "shows how or why something happens"],
      ["to argue / persuade", "pushes a view and gives reasons for it"],
      ["to criticise", "points out faults"],
      ["to compare", "sets two things side by side"],
      ["to warn", "draws attention to a danger or a bad result"],
      ["to correct a misconception", "starts with a common belief and shows it is wrong"]
    ]],

    ["h2", "Strategy and shortcuts"],
    ["h", "A 4-step reading approach"],
    ["ol", [
      "**Skim the questions first** (30 seconds). Do not read the options. Just know what you will be asked: a title, a detail, a word, a tone.",
      "**Read the passage once, at normal speed.** Underline the signal words and the first and last sentence of each paragraph. Mark names, numbers and dates, which become detail questions.",
      "**Answer in the order that is easiest:** vocabulary and detail first (they point to a line), then inference and tone, and the main idea last (by now you know it).",
      "**Go back to the line.** For any detail or True / False question, find the sentence and re-read it before choosing."
    ]],
    ["h", "Elimination: five quick killers"],
    ["list", [
      "**Too narrow:** true, but covers only a part of the passage (wrong for main idea).",
      "**Too broad:** goes beyond what the passage discusses.",
      "**Opposite:** says the reverse of the passage. Often one word is flipped.",
      "**Extreme:** uses always, never, only, completely.",
      "**Out of scope:** sounds true in real life but the passage never says it."
    ]],
    ["tip", "If two options both look right, pick the one that is closer to the exact words of the passage and has less extra claim. The safer, more limited option usually wins."],
    ["tip", "Time budget: about 60 to 90 seconds per question and 2 to 3 minutes to read a short passage. If a question is eating time, mark it and move on."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/reading-comprehension/main-idea-title", title: "Main idea / title",
      spot: "“The central idea of the passage is...”, “The best title would be...”, “The passage is mainly about...”.",
      method: ["Read the first and last sentences and the sentences after any “but / however”.", "State the point in your own words in one line.", "Remove options that are too narrow (one detail), too broad, or opposite; keep the one that covers the whole passage."],
      ex: { q: "Passage: “Many cities have begun to replace some car parking spaces with cycle lanes. Shopkeepers first feared that customers would stop coming. Yet surveys in several cities found that people who walk or cycle visit shops more often, even if they spend less each time, so total sales rarely fell.” What is the best title? (A) Shopkeepers against change (B) Why cycle lanes seldom hurt local shops (C) The cost of building cycle lanes (D) How to park in a busy city", steps: ["Opening: cities replace parking with cycle lanes. The turn word is “Yet”: the fear was wrong.", "Main point: cycle lanes do not usually reduce shop sales.", "(A) covers only the first fear. (C) and (D) are never discussed. (B) covers both the fear and the finding."], ans: "(B) Why cycle lanes seldom hurt local shops" },
      shortcut: "The title should include both the topic and the passage's stand. If an option mentions something not in the passage at all, drop it at once."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/specific-detail", title: "Specific detail",
      spot: "A direct question about a name, number, date, reason or sequence: “According to the passage...”, “Which of the following is stated...”.",
      method: ["Pick out the keyword in the question (a name, a number, a rare word).", "Find that word in the passage and read the whole sentence, plus the one before and after.", "Choose the option that matches the text, not the one that merely looks reasonable."],
      ex: { q: "Passage: “The village cooperative began in 1998 with 12 farmers. By 2008 it had 140 members, but a long drought cut this to 95. Since then membership has recovered to 120.” How many members did the cooperative have immediately after the drought?", steps: ["Keyword: “drought”.", "The line says the drought cut membership to 95.", "140 was before the drought and 120 is the recovery figure."], ans: "95" },
      shortcut: "The passage often puts the wrong numbers right next to the right one. Match the number to the event in the question."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/inference", title: "Inference",
      spot: "“It can be inferred that...”, “The passage implies...”, “The author would most likely agree that...”.",
      method: ["Find the lines that the question is about.", "Ask: what must be true if these lines are true?", "Pick the option with the smallest extra step. Reject anything that needs an outside assumption."],
      ex: { q: "Passage: “Whenever the river authority raised the price of canal water, the number of new borewells in the district rose sharply the following year.” What can be inferred? (A) Farmers shift towards groundwater when canal water gets costlier. (B) Canal water is unsafe for crops. (C) Borewells are cheaper than canal water. (D) The authority wants more borewells.", steps: ["The link is: higher canal price, more new borewells next year.", "(A) is the plain meaning of that link.", "(B), (C) and (D) need facts the passage never gives: safety, relative cost, the authority's wish."], ans: "(A)" },
      shortcut: "Inference answers use soft words (tend to, may, suggests). A strongly worded option is more likely to be a leap."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/tone-and-attitude", title: "Tone & attitude",
      spot: "“The author's tone is...”, “The author's attitude towards X can be described as...”.",
      method: ["Underline the adjectives, adverbs and strong verbs used about the subject.", "Decide: positive, neutral or negative?", "Choose the tone word of that kind that matches the exact feeling (mildly critical is not the same as scornful)."],
      ex: { q: "Passage: “The committee's report, a hundred pages of confident promises, never once explains where the money will come from. One wonders whether anyone who signed it actually read it.” What is the author's tone? (A) Admiring (B) Neutral (C) Sarcastic and critical (D) Hopeful", steps: ["Words: “confident promises”, “never once explains”, “one wonders whether anyone read it”.", "These point out a fault and mock the signers.", "Negative tone: critical, with sarcasm in the last line."], ans: "(C) Sarcastic and critical" },
      shortcut: "First sort the tone into positive, neutral or negative. That alone removes two options in most questions."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/vocabulary-in-context", title: "Vocabulary in context",
      spot: "“The word X, as used in the passage, means...”.",
      method: ["Go to the sentence. Cover the word and guess a meaning from the surrounding clues.", "Put each option in place of the word and read the sentence aloud.", "Pick the one that keeps the sense, even if it is not the commonest meaning of the word."],
      ex: { q: "“The manager's remarks were so oblique that nobody was sure whether she was praising or warning us.” The word “oblique” means (A) rude (B) indirect (C) loud (D) honest", steps: ["The clue: nobody was sure of her meaning.", "So the remarks were not stated clearly: indirect.", "Rude, loud and honest do not explain the confusion."], ans: "(B) indirect" },
      shortcut: "The clue is almost always in the same sentence: a contrast word (but, yet) or a result (so ... that) points to the meaning."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/author-s-purpose", title: "Author's purpose",
      spot: "“The author's main purpose is to...”, “Why does the author mention X?”.",
      method: ["Ask what the passage does overall: tell, explain, persuade, criticise, warn.", "For a single detail (“why does the author mention X?”) find what point it supports.", "Choose the option that starts with the right purpose verb."],
      ex: { q: "Passage: “Most people believe antibiotics cure colds. They do not: colds are caused by viruses, and antibiotics act only on bacteria. Taking them needlessly helps bacteria become resistant.” The author's purpose is to (A) describe how bacteria grow (B) correct a common belief and warn against misuse (C) praise antibiotics (D) list the symptoms of a cold", steps: ["The passage opens with a belief and then says “They do not”.", "It ends with a danger: resistance.", "So: correct a misconception and warn."], ans: "(B) correct a common belief and warn against misuse" },
      shortcut: "A passage that starts with “Many people think...” followed by “but” is nearly always correcting a misconception."
    }],
    ["pattern", {
      key: "verbal/reading-comprehension/true-false-cannot-say", title: "True / false / cannot say (TCS-style)",
      spot: "A statement is given and you must choose True, False or Cannot say, based only on the passage.",
      method: ["Find the sentence that talks about the statement.", "If the passage says it, or the numbers prove it, mark True. If the passage says the opposite, mark False.", "If the passage does not talk about it, or only partly, mark Cannot say."],
      ex: { q: "Passage: “The new metro line opened in March and carries about 80,000 passengers a day. The city council had expected 100,000. Ticket prices have not yet been revised.” Statements: (1) The line carries fewer passengers than expected. (2) Ticket prices will go up soon. (3) The line opened in April.", steps: ["(1) 80,000 is less than 100,000: True.", "(2) The passage says prices “have not yet been revised”, nothing about the future: Cannot say.", "(3) The passage says March: False."], ans: "(1) True, (2) Cannot say, (3) False" },
      shortcut: "False means contradicted. Missing means Cannot say. Do not mark False just because the passage never mentions it."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Using outside knowledge:** an option can be perfectly true in real life and still wrong, because the passage does not say it.",
      "**Choosing a true detail for main idea:** it is true but too narrow. The main idea must cover the whole passage.",
      "**Extreme words:** “always”, “never” and “only” are rarely supported by a careful passage.",
      "**Mixing up whose view it is:** a view attributed to “critics” is not the author's unless the author endorses it.",
      "**Half-right options:** the first half matches the passage and the second half quietly adds a claim. Read the whole option.",
      "**Dictionary meaning for vocabulary:** the common meaning of a word may not be the one used in the sentence.",
      "**Cannot say vs False:** silence in the passage is “Cannot say”, not “False”.",
      "**Getting lost in details:** do not memorise the passage. Know where things are and go back."
    ]],
    ["warn", "Before you mark an option, say to yourself the line number or sentence that supports it. If you cannot point to one, do not choose it."],

    ["h2", "Quick check"],
    ["quiz", ["reading-comprehension-01", "reading-comprehension-02", "reading-comprehension-03", "reading-comprehension-04", "reading-comprehension-05"]]
  ]
});

/* ===================================================================== ERROR SPOTTING */
LEARN.verbal.push({
  id: "error-spotting", group: "Grammar", title: "Error spotting",
  sub: "A complete grammar rulebook with a right and a wrong example for every rule",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "Capgemini", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "In an error-spotting question a sentence is split into three or four parts, marked (A), (B), (C) and sometimes (D). **At most one part has a grammatical error.** If every part is correct, the answer is “No error”. You are not asked to rewrite anything. You only have to say where the mistake is."],
    ["p", "The questions look endless but the mistakes are not. Almost every error in a placement test comes from a small set of rules: **subject–verb agreement, tenses, articles, prepositions, pronouns, modifiers, parallelism, correlatives, degrees of comparison, adjective versus adverb, redundancy, question tags and conditionals.** Learn each rule with one right and one wrong example and the question becomes a quick check."],
    ["list", [
      "**You are checking, not writing.** Read the sentence, then test each part against the rules below.",
      "**Standard Indian-English exam grammar** (the Wren & Martin tradition) is the standard. Some usages that are accepted in casual speech are treated as errors here (for example “between you and I”).",
      "**“No error” is a real answer.** In most papers roughly one question in five or six has no error, so do not force a mistake."
    ]],
    ["note", "Spoken English forgives many things. Exam English does not. If a usage “sounds fine” but breaks a rule on this page, trust the rule."],

    ["h2", "Rules"],
    ["p", "The numbered rules below are the complete rulebook for error spotting, grouped by area. “Right” shows the correct form and “Wrong” the typical error you will meet in a question."],

    ["h", "A. Subject–verb agreement"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["1", "A singular subject takes a singular verb, a plural subject a plural verb.", "The boy plays cricket.", "The boy play cricket."],
      ["2", "Words between the subject and the verb do not change the verb. Find the real subject.", "The quality of these mangoes is poor.", "The quality of these mangoes are poor."],
      ["3", "Two subjects joined by “and” take a plural verb.", "Ravi and Sunil are friends.", "Ravi and Sunil is friends."],
      ["4", "But “and” joining two names of one thing or one person takes a singular verb.", "Bread and butter is my usual breakfast.", "Bread and butter are my usual breakfast."],
      ["5", "Each, every, either, neither, one, anyone, everyone, nobody are singular.", "Each of the students has a pen.", "Each of the students have a pen."],
      ["6", "With either...or, neither...nor, or, nor, the verb agrees with the subject nearest to it.", "Neither the students nor the teacher was present.", "Neither the students nor the teacher were present."],
      ["7", "As well as, along with, together with, in addition to do not make the subject plural.", "The captain, along with his team, is arriving today.", "The captain, along with his team, are arriving today."],
      ["8", "A collective noun is singular when it acts as one unit and plural when the members act separately.", "The committee has made its decision. / The committee were divided in their views.", "The committee have made its decision."],
      ["9", "“A number of” is plural. “The number of” is singular.", "A number of guests were late. / The number of guests is large.", "A number of guests was late."],
      ["10", "Some nouns look plural but are singular: news, mathematics, physics, economics, politics, measles, innings.", "Mathematics is a difficult subject.", "Mathematics are a difficult subject."],
      ["11", "Some nouns are always plural: scissors, trousers, spectacles, clothes, police, cattle, people. (A “pair of” is singular.)", "The police are investigating. / A pair of scissors is on the desk.", "The police is investigating."],
      ["12", "A sum of money, time, distance or weight taken as one amount is singular.", "Fifty rupees is enough.", "Fifty rupees are enough."],
      ["13", "A relative pronoun (who, which, that) takes the verb that matches its antecedent. After “one of the...” the antecedent is plural.", "He is one of those boys who are always late.", "He is one of those boys who is always late."],
      ["14", "“Many a” takes a singular noun and a singular verb.", "Many a student has failed this test.", "Many a student have failed this test."],
      ["15", "With half, most, some, all, a part of, the verb agrees with the noun after “of”.", "Half of the cake is gone. / Half of the apples are rotten.", "Half of the apples is rotten."],
      ["16", "In “There is / there are”, the verb agrees with the noun that follows.", "There are three books on the shelf.", "There is three books on the shelf."],
      ["17", "None is usually treated as singular in exam answers (“not one”).", "None of the boys was absent.", "None of the boys were absent."],
      ["18", "A title or a book name is singular.", "Gulliver's Travels is a satire.", "Gulliver's Travels are a satire."]
    ]],

    ["h", "B. Tenses"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["19", "Do not use the present perfect with a word for finished time (yesterday, ago, last year, in 2010).", "I saw him yesterday.", "I have seen him yesterday."],
      ["20", "Use the perfect tense with since (a point in time) and for (a period). Do not use the simple present.", "I have known him since 2015.", "I know him since 2015."],
      ["21", "Past perfect is for the earlier of two past actions.", "When we reached, the train had already left.", "When we reached, the train already left."],
      ["22", "If the main verb is in the past, the verb in the that-clause is also in the past, except for a universal truth.", "He said that he was ill. / The teacher said that the earth moves round the sun.", "He said that he is ill."],
      ["23", "After if, when, before, after, until, as soon as for future time, use the present tense, not will.", "I will call you when I reach home.", "I will call you when I will reach home."],
      ["24", "Verbs of state and sense (know, like, want, believe, see, hear, belong) are not used in the continuous form.", "I know the answer.", "I am knowing the answer."],
      ["25", "Hardly / scarcely ... when and no sooner ... than go with the past perfect, and the auxiliary comes first.", "Hardly had he sat down when the bell rang.", "Hardly he sat down when the bell rang."],
      ["26", "“Just now” and “a moment ago” take the simple past.", "He left just now.", "He has left just now."],
      ["27", "“It is time” and “it is high time” take the past form.", "It is high time we left.", "It is high time we leave."],
      ["28", "A modal, “used to” or “had better” is followed by the base verb.", "He can swim. / He used to play chess.", "He can swims. / He used to played chess."],
      ["29", "Use the present perfect continuous for an action that began in the past and is still going on.", "She has been working here for ten years.", "She is working here for ten years."]
    ]],

    ["h", "C. Articles"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["30", "A or an depends on the sound, not the spelling: an before a vowel sound, a before a consonant sound.", "an hour, an MBA, a university, a European, an honest man", "a hour, a MBA, an university, an European, a honest man"],
      ["31", "Use “the” for a particular or already-mentioned thing, and for unique things: the sun, rivers, mountain ranges, seas, oceans.", "The Ganga flows into the Bay of Bengal.", "Ganga flows into Bay of Bengal."],
      ["32", "No article before languages, meals, games, subjects and uncountable nouns used in a general sense.", "She plays cricket. / We had breakfast at eight.", "She plays the cricket. / We had a breakfast at eight."],
      ["33", "No article before a plural or uncountable noun used generally.", "Gold is a precious metal.", "The gold is a precious metal."],
      ["34", "Use “the” with superlatives and ordinals.", "She is the tallest girl in class.", "She is tallest girl in class."],
      ["35", "“The” + an adjective names a whole class of people.", "The rich should help the poor.", "Rich should help poor."],
      ["36", "No article with school, college, hospital, prison, bed, church when used for their main purpose.", "He is in hospital. / She goes to school by bus.", "She goes to the school every day (meaning to study there)."],
      ["37", "With such, quite, what, many, half, rather the article comes after the word.", "such a good boy, half an hour, what a pity", "a such good boy, an half hour, a what pity"],
      ["38", "Repeat the article for two different persons or things. Use it once for one person with two roles.", "I met a doctor and a lawyer. (two persons) / He is a doctor and lawyer. (one person)", "I met a doctor and lawyer. (meaning two persons)"],
      ["39", "Use “a few / a little” for a positive sense (some) and “few / little” for a negative sense (almost none).", "He has a few friends, so he is not lonely.", "He has few friends, so he is not lonely."]
    ]],

    ["h", "D. Prepositions"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["40", "Time: at for a clock time, on for a day or date, in for a month, year, season or part of a day.", "at 5 pm, on Monday, on 15 August, in July, in the morning, at night", "in 5 pm, at Monday, in 15 August, on July"],
      ["41", "Place: at for a point, in for an enclosed or large area, on for a surface.", "He lives in Delhi. / She is at the bus stop. / The book is on the table.", "He lives at Delhi. / The book is in the table."],
      ["42", "Since for a starting point, for for a length of time, during for “within a period”.", "I have lived here for ten years. / I have lived here since 2012.", "I have lived here since ten years."],
      ["43", "By means “not later than”, till or until means “continuing up to”.", "Submit the form by Friday. / Wait till Friday.", "Submit the form till Friday."],
      ["44", "Between is for two, among for more than two.", "Divide the sweets among the three children.", "Divide the sweets between the three children."],
      ["45", "Some verbs take no preposition: discuss, enter, reach, attend, resemble, marry, approach, obey.", "We discussed the plan. / He reached Delhi. / She resembles her mother.", "We discussed about the plan. / He reached to Delhi. / She resembles with her mother."],
      ["46", "Fixed verb + preposition pairs.", "insist on, depend on, congratulate on, prevent from, accuse of, agree with (person), agree to (proposal), listen to, wait for", "insist to, depend of, congratulate for, prevent to, accuse for, listen, wait to"],
      ["47", "Fixed adjective + preposition pairs.", "good at, fond of, afraid of, proud of, ashamed of, keen on, interested in, angry with (person), angry at (thing), different from, married to", "good in, fond for, afraid from, proud for, interested for, different than, married with"],
      ["48", "Latin comparatives (superior, inferior, senior, junior, prefer, prior) take “to”, not “than”.", "She is senior to me. / I prefer tea to coffee.", "She is senior than me. / I prefer tea than coffee."],
      ["49", "Transport: by bus, by train, on foot; in a car or taxi, on a bus or train (as a passenger).", "She goes to school by bus. / He came on foot.", "She goes to school with bus. / He came by foot."],
      ["50", "Beside means “next to”. Besides means “in addition to”. On time = punctual. In time = early enough.", "Besides English, she knows French. / The train arrived on time.", "Beside English, she knows French."]
    ]],

    ["h", "E. Pronouns"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["51", "After a preposition use the object form (me, him, her, us, them).", "Between you and me, the plan is risky.", "Between you and I, the plan is risky."],
      ["52", "After than and as, the pronoun takes the case it would take in the full clause.", "She is taller than I (am). / He loves you more than I (do).", "She is taller than me."],
      ["53", "Who is for the subject, whom for the object.", "Whom did you meet? / Who is at the door?", "Who did you meet?"],
      ["54", "A pronoun must agree with its noun in number, person and gender.", "Each of the boys must bring his book.", "Each of the boys must bring their book."],
      ["55", "Order of persons: 2nd, 3rd, 1st for good things (You, he and I). Reverse for blame (I, you and he).", "You, he and I will go. / I, you and he are to blame.", "I, you and he will go to the party."],
      ["56", "A reflexive pronoun (myself, himself) needs a subject to refer back to. It cannot be the subject.", "I hurt myself. / He himself did it.", "Myself and Rohan went there."],
      ["57", "Use “that” (not who/which) after all, any, only, the same, the very and superlatives.", "This is the best book that I have read.", "This is the best book which I have read."],
      ["58", "Each other is for two persons, one another for more than two.", "The two brothers help each other.", "The three brothers help each other."],
      ["59", "“One” must be followed by “one's” or “he or she”, not by a mix of person.", "One should do one's duty.", "One should do his or your duty."],
      ["60", "Use the possessive form before a gerund.", "I do not like his coming late.", "I do not like him coming late."],
      ["61", "Possessive pronouns take no apostrophe: hers, ours, yours, theirs, its. “It's” means “it is”.", "The book is hers. / The dog wagged its tail.", "The book is her's. / The dog wagged it's tail."]
    ]],

    ["h", "F. Modifiers"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["62", "Place only, even, almost, just, nearly right before the word they modify.", "She spent almost all her salary on books.", "She almost spent all her salary on books."],
      ["63", "A phrase beginning with a participle must describe the subject of the main clause. Otherwise it dangles.", "Walking down the road, he was bitten by a snake.", "Walking down the road, a snake bit him."],
      ["64", "Put a describing phrase or clause next to the noun it describes.", "He gave the child a toy that was made of wood.", "He gave a toy to the child that was made of wood."],
      ["65", "Hardly, scarcely, barely already have a negative sense. Do not add another negative.", "I can hardly hear you.", "I can't hardly hear you."],
      ["66", "Never use two negatives to make one negative idea.", "I do not know anything. / I know nothing.", "I do not know nothing."],
      ["67", "Fewer is for countable nouns, less for uncountable ones. Many is for countable, much for uncountable.", "fewer students, less money, many books, much water", "less students, fewer money, much books, many water"]
    ]],

    ["h", "G. Parallelism"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["68", "Items in a list must have the same grammatical form.", "She likes swimming, reading and dancing.", "She likes swimming, reading and to dance."],
      ["69", "What follows each half of a correlative pair must be the same type of word or phrase.", "He is not only intelligent but also hardworking. / He not only sings but also dances.", "He is not only intelligent but also he works hard."],
      ["70", "Compare like with like: a thing with a thing, a person with a person.", "The population of Mumbai is larger than that of Delhi.", "The population of Mumbai is larger than Delhi."],
      ["71", "Keep the tense of joined verbs consistent unless the time really changes.", "He came, saw and conquered.", "He came, sees and conquered."],
      ["72", "Use “to” with every infinitive in a list or with none of them.", "to read, write and speak (or) to read, to write and to speak", "to read, writing and to speak"]
    ]],

    ["h", "H. Conjunctions and correlatives"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["73", "Pairs are fixed: either–or, neither–nor, both–and, not only–but also, whether–or, no sooner–than, hardly–when, rather–than.", "Neither the manager nor the clerk knew. / Hardly had he left when it rained.", "Neither the manager or the clerk knew. / Hardly had he left than it rained."],
      ["74", "Although / though is not followed by “but” or “yet” in the other clause.", "Although he was tired, he kept working.", "Although he was tired, but he kept working."],
      ["75", "Do not use “because” and “so” together.", "Because he was ill, he stayed at home.", "Because he was ill, so he stayed at home."],
      ["76", "“Unless” already means “if not”. Do not add another not.", "Unless you work hard, you will fail.", "Unless you do not work hard, you will fail."],
      ["77", "“Lest” is followed by “should” or the base verb, with no extra negative.", "Walk fast lest you should miss the train.", "Walk fast lest you will miss the train."],
      ["78", "As if and as though take the past subjunctive (were) for something unreal.", "He speaks as if he were the owner.", "He speaks as if he is the owner."],
      ["79", "Both ... and (not both ... as well as); so ... that; such ... that.", "Both Ravi and Sunil came. / He was so tired that he fell asleep.", "Both Ravi as well as Sunil came."],
      ["80", "After “not only” at the start, the sentence is inverted.", "Not only did he steal the money, but he also lied.", "Not only he stole the money, but he also lied."]
    ]],

    ["h", "I. Degrees of comparison"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["81", "Comparative is used with “than”, superlative with “the”.", "Priya is taller than Anu. / Priya is the tallest girl.", "Priya is tallest girl."],
      ["82", "Never double a comparative or superlative.", "She is better than her sister. / the kindest man", "She is more better than her sister. / the most kindest man"],
      ["83", "For two persons, use the comparative with “the” (of the two).", "Of the two sisters, Rita is the wiser.", "Of the two sisters, Rita is the wisest."],
      ["84", "“One of the” is followed by a superlative and a plural noun.", "He is one of the best players in the team.", "He is one of the best player in the team."],
      ["85", "When something is compared with its own group, say “any other”.", "Everest is higher than any other mountain.", "Everest is higher than any mountain."],
      ["86", "Elder is for persons in a family (and not followed by than). Older is for age in general.", "Rita is my elder sister. / She is older than I.", "She is elder than I."],
      ["87", "Later / latest are for time, latter / last are for order. Farther is for distance, further for “additional”.", "The bank is farther than the post office. / Wait for further details.", "Wait for farther details."],
      ["88", "“The ... the ...” compares two changing things.", "The more you read, the more you learn.", "The more you read, more you learn."]
    ]],

    ["h", "J. Adjective versus adverb"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["89", "An adjective describes a noun. An adverb describes a verb, an adjective or another adverb.", "She sings sweetly.", "She sings sweet."],
      ["90", "After linking verbs (be, seem, look, feel, taste, smell, sound, become) use an adjective.", "The soup tastes good. / She looks tired.", "The soup tastes well. / She looks tiredly."],
      ["91", "Some pairs differ in meaning: hard / hardly, late / lately, near / nearly, high / highly, close / closely.", "He worked hard. / She arrived late.", "He worked hardly. / She arrived lately (for “not on time”)."],
      ["92", "Good is an adjective, well an adverb (also “healthy”).", "He plays well. / He is a good player.", "He plays good."],
      ["93", "Enough comes after an adjective or adverb, before a noun.", "He is tall enough. / He has enough money.", "He is enough tall."],
      ["94", "Very goes with an adjective or adverb, much with comparatives.", "very tall, much taller", "much tall, very taller"],
      ["95", "When a number and a unit join to describe a noun, the unit stays singular and takes hyphens.", "a ten-year-old boy, a five-rupee note", "a ten-years-old boy, a five-rupees note"]
    ]],

    ["h", "K. Redundancy"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["96", "Do not say the same thing twice.", "return, repeat, reverse, join, combine", "return back, repeat again, reverse back, join together, combine together"],
      ["97", "Watch for doubled phrases.", "gift, history, conclusion, innovation, surprise", "free gift, past history, final conclusion, new innovation, unexpected surprise"],
      ["98", "Do not use two words with the same meaning.", "superior, unique, identical, adequate, cousin", "more superior, most unique, same identical, adequate enough, cousin brother"],
      ["99", "Do not repeat the subject with a pronoun.", "My brother is a doctor.", "My brother he is a doctor."],
      ["100", "Do not give a reason twice.", "The reason is that he was late.", "The reason is because he was late."],
      ["101", "“Since” and “ago” do not go together in one clause.", "It is ten years since he left.", "It is ten years ago since he left."]
    ]],

    ["h", "L. Question tags"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["102", "A positive statement takes a negative tag. A negative statement takes a positive tag.", "He is clever, isn't he? / He is not clever, is he?", "He is clever, is he?"],
      ["103", "Use the same auxiliary as in the sentence. With no auxiliary use do / does / did.", "She can swim, can't she? / They play well, don't they?", "She can swim, doesn't she?"],
      ["104", "The tag pronoun matches the subject.", "Ravi is here, isn't he?", "Ravi is here, isn't it?"],
      ["105", "“I am” takes “aren't I?”.", "I am late, aren't I?", "I am late, amn't I?"],
      ["106", "Imperative sentences take “will you?”; “Let us” takes “shall we?”.", "Close the door, will you? / Let us go, shall we?", "Close the door, won't it? / Let us go, will we?"],
      ["107", "Nobody, no one, nothing, hardly, seldom, never, rarely make the statement negative, so use a positive tag. Everyone, someone, anybody take “they”.", "Nobody called, did they? / He seldom comes, does he? / Everyone came, didn't they?", "Nobody called, didn't they?"],
      ["108", "“There is / are” repeats “there” in the tag.", "There is a problem, isn't there?", "There is a problem, isn't it?"]
    ]],

    ["h", "M. Conditionals"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["109", "Zero (general truth): if + present, present.", "If you heat ice, it melts.", "If you heated ice, it will melt."],
      ["110", "First (real, probable): if + present, will / can / may + base verb. No “will” in the if-clause.", "If it rains, we will stay at home.", "If it will rain, we will stay at home."],
      ["111", "Second (unreal or unlikely present): if + past (were for all persons), would / could + base verb.", "If I were rich, I would travel the world.", "If I would be rich, I would travel the world."],
      ["112", "Third (unreal past): if + past perfect, would have + past participle.", "If he had worked hard, he would have passed.", "If he would have worked hard, he would have passed."],
      ["113", "Inversion can replace if: Had I..., Were I..., Should he....", "Had I known, I would have come.", "Had I knew, I would have come."],
      ["114", "Mixed: past condition, present result.", "If he had taken the medicine, he would be well now.", "If he took the medicine, he would have been well now."],
      ["115", "“Wish” takes the past for the present and the past perfect for the past.", "I wish I knew the answer. / I wish I had studied.", "I wish I know the answer."],
      ["116", "Provided that, as long as, in case take the present for future time.", "I will go provided that it does not rain.", "I will go provided that it will not rain."]
    ]],

    ["h2", "Strategy and shortcuts"],
    ["h", "The 6-step check (30 seconds)"],
    ["ol", [
      "**Read the whole sentence once** for meaning. Then read each part slowly.",
      "**Find the subject and the verb** and check agreement (rules 1 to 18).",
      "**Check the tense** against time words: since, for, yesterday, ago, when, if (rules 19 to 29).",
      "**Look at small words:** articles, prepositions and pronouns (rules 30 to 61). They hide most errors.",
      "**Look for signal words:** not only, either, neither, than, hardly, no sooner, lest. These point to a pair or a pattern (rules 68 to 88).",
      "**If you still find nothing, check once for redundancy and spelling-like errors. Then mark “No error”.**"
    ]],
    ["h", "Where errors hide"],
    ["table", ["If you see...", "Check for..."], [
      ["Each, every, neither, either, one of", "A singular verb after it"],
      ["A long phrase between subject and verb", "Verb agreeing with the real subject"],
      ["Since, for, ago, yesterday, last year", "Correct tense"],
      ["Between, among", "Number of persons; “between you and me”"],
      ["Than, as ... as, the most, one of the", "Comparison pattern, “any other”, comparing like with like"],
      ["Neither, either, not only, both, hardly, no sooner", "The matching word of the pair"],
      ["Agree, insist, prefer, discuss, reach, enter", "Right or wrong preposition"],
      ["Who, whom, that, which, each other, one's", "Pronoun case and agreement"],
      ["A noun starting with h, u, e, o", "A or an by sound"]
    ]],
    ["tip", "The most frequent errors in placement papers are subject–verb agreement, tenses and prepositions. Check these three first on every sentence."],
    ["tip", "Only one part is wrong. When you spot an error in one part, stop. Do not go looking for a second one."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/error-spotting/subject-verb-agreement", title: "Subject–verb agreement",
      spot: "A long subject with a phrase in the middle, “neither / either”, a collective noun, or a singular word that looks plural.",
      method: ["Mark the subject (ignore of-phrases and along-with phrases).", "Decide whether it is singular or plural by the rules above.", "Check the verb matches. Check the nearer-subject rule for or / nor."],
      ex: { q: "(A) The list of required documents / (B) are displayed / (C) on the notice board. / (D) No error", steps: ["Subject: “list” (singular). “of required documents” is only a phrase.", "Verb should be “is displayed”, but (B) has “are”."], ans: "(B)" },
      shortcut: "Cross out the phrase beginning with “of”, “along with” or “as well as”. Then the subject and verb stand side by side."
    }],
    ["pattern", {
      key: "verbal/error-spotting/tenses", title: "Tenses",
      spot: "Since / for, ago / yesterday, if / when clauses, two actions in the past, and verbs like know and want in the continuous.",
      method: ["Circle the time word.", "Match the tense to it (since / for → perfect; yesterday / ago → simple past; before another past action → past perfect).", "Check that both clauses are in sequence."],
      ex: { q: "(A) I am living in Pune / (B) since 2019 / (C) and I like it very much. / (D) No error", steps: ["“Since 2019” means from a point in the past up to now, so the present perfect continuous is needed.", "Correct form: “I have been living in Pune”. The error is in (A)."], ans: "(A)" },
      shortcut: "Since or for plus a simple present verb is almost always an error."
    }],
    ["pattern", {
      key: "verbal/error-spotting/articles", title: "Articles",
      spot: "A word starting with a vowel or consonant sound that is easy to misjudge (university, hour, European), or a missing or extra “the”.",
      method: ["Say the first sound of the next word aloud: a vowel sound takes “an”, a consonant sound takes “a”.", "Check whether the noun is particular (the), general (no article) or one of many (a).", "Check the fixed uses: the + superlative, no article before games and languages."],
      ex: { q: "(A) He bought an / (B) university textbook / (C) from the market. / (D) No error", steps: ["“University” begins with the sound “yoo”, a consonant sound.", "So it takes “a”: “a university textbook”. The error is in (A)."], ans: "(A)" },
      shortcut: "Listen to the sound, not the letter: an hour, an MBA, but a university, a one-rupee coin."
    }],
    ["pattern", {
      key: "verbal/error-spotting/prepositions", title: "Prepositions",
      spot: "A small word after a verb, adjective or time and place word. Often a verb that needs a specific preposition, or one that needs none.",
      method: ["Locate the preposition.", "Recall the fixed pair (insist on, depend on, good at) or the rule (at / on / in for time and place).", "Check whether the verb needs none (discuss, reach, enter)."],
      ex: { q: "(A) The manager insisted / (B) to meet the clients / (C) at their office. / (D) No error", steps: ["“Insist” takes “on”, followed by the gerund.", "Correct: “insisted on meeting the clients”. The error is in (B)."], ans: "(B)" },
      shortcut: "Build your own list of 30 verb–preposition pairs. About half the preposition questions come from them."
    }],
    ["pattern", {
      key: "verbal/error-spotting/pronouns", title: "Pronouns",
      spot: "I / me, who / whom, each / their, the reflexive myself, or a pronoun that does not match its noun.",
      method: ["Find the pronoun and what it refers to.", "Check case (subject, object, possessive), number, person and gender.", "Check the special rules: after a preposition use the object form; “between you and me”."],
      ex: { q: "(A) Between you and I, / (B) the plan / (C) looks risky. / (D) No error", steps: ["“Between” is a preposition, so the pronoun after it must be in the object form.", "Correct: “between you and me”. The error is in (A)."], ans: "(A)" },
      shortcut: "Take the other person out: you would never say “between I”, so you cannot say “between you and I”."
    }],
    ["pattern", {
      key: "verbal/error-spotting/modifiers", title: "Modifiers",
      spot: "Only, even, almost, just, nearly, or a descriptive phrase at the start of a sentence, or a clause that seems to describe the wrong noun.",
      method: ["Find the modifier.", "Check which word it is placed beside. Does it describe that word?", "Move limiting words (only, almost) to just before the word they limit."],
      ex: { q: "(A) She almost spent / (B) all her salary / (C) on books. / (D) No error", steps: ["“Almost” should limit “all”, the word it describes.", "The sentence says she nearly spent, meaning she did not spend at all. Correct: “She spent almost all her salary”. The error is in (A)."], ans: "(A)" },
      shortcut: "A phrase opening a sentence describes the subject that comes right after it. If it does not, the modifier is dangling."
    }],
    ["pattern", {
      key: "verbal/error-spotting/parallelism", title: "Parallelism",
      spot: "A list or a pair of linked items (A, B and C), or a correlative like not only ... but also.",
      method: ["Write the items one under another.", "Check that each has the same grammatical form: all -ing, all to + verb, all nouns.", "Change the odd one out."],
      ex: { q: "(A) The coach asked the players / (B) to warm up, stretch / (C) and running two laps. / (D) No error", steps: ["The list is: to warm up, stretch, and ...", "Each item should be a base verb: “and run two laps”. The error is in (C)."], ans: "(C)" },
      shortcut: "Read down the list: the item that sounds different from the others is the error."
    }],
    ["pattern", {
      key: "verbal/error-spotting/conjunctions-and-correlatives", title: "Conjunctions & correlatives",
      spot: "Either, neither, both, not only, hardly, no sooner, whether, although, because and unless in the same sentence as another word that they pair with.",
      method: ["Spot the first half of a pair (neither, both, not only...).", "Check the second half is its fixed partner.", "Check for double use: although ... but, because ... so."],
      ex: { q: "(A) Neither the manager / (B) or the clerk / (C) was aware of the change. / (D) No error", steps: ["“Neither” goes with “nor”, not “or”.", "Correct: “Neither the manager nor the clerk”. The error is in (B)."], ans: "(B)" },
      shortcut: "Learn the partner pairs as one unit: neither–nor, either–or, both–and, no sooner–than, hardly–when."
    }],
    ["pattern", {
      key: "verbal/error-spotting/degrees-of-comparison", title: "Degrees of comparison",
      spot: "Than, the most, as ... as, “one of the”, “of the two”, “any other”, or a double comparative.",
      method: ["Count how many things are compared: two (comparative) or more than two (superlative).", "Check for the right helper: than for comparative, the for superlative.", "Check for doubles (more better) and for a missing “other”."],
      ex: { q: "(A) Of all the cities / (B) she has visited, / (C) Jaipur is the more beautiful. / (D) No error", steps: ["“Of all the cities” means more than two.", "So the superlative is needed: “the most beautiful”. The error is in (C)."], ans: "(C)" },
      shortcut: "“Of the two” goes with the comparative, “of all” goes with the superlative."
    }],
    ["pattern", {
      key: "verbal/error-spotting/adjective-vs-adverb", title: "Adjective vs adverb",
      spot: "An adjective doing an adverb's job (sings sweet), well / good, hard / hardly, or an adjective after a linking verb.",
      method: ["Ask what the word describes: a noun (adjective) or an action (adverb)?", "After seem, look, feel, taste, sound use an adjective.", "Check the confusable pairs (hard / hardly, late / lately)."],
      ex: { q: "(A) The new employee / (B) performed / (C) very good in the interview. / (D) No error", steps: ["“Performed” is an action, so it needs an adverb.", "Correct: “very well”. The error is in (C)."], ans: "(C)" },
      shortcut: "Ask “how?”. If the answer to “how did he perform?” is the word, it must be an adverb (ending -ly, or well)."
    }],
    ["pattern", {
      key: "verbal/error-spotting/redundancy", title: "Redundancy",
      spot: "Two words that mean the same (return back, repeat again), or a reason repeated (reason ... because).",
      method: ["Look for two words that carry the same idea.", "Ask whether removing one changes the meaning. If it does not, the extra is redundant.", "Mark the part containing the extra word."],
      ex: { q: "(A) Please return back / (B) the books to the library / (C) before Friday. / (D) No error", steps: ["“Return” already means “go or give back”.", "“Back” is repeated. The error is in (A)."], ans: "(A)" },
      shortcut: "Common offenders: return back, repeat again, join together, reason because, more superior, same identical."
    }],
    ["pattern", {
      key: "verbal/error-spotting/question-tags", title: "Question tags",
      spot: "A sentence that ends with a short question like “isn't it?”, “did they?”.",
      method: ["Check whether the main statement is positive or negative. Hardly, never, nobody make it negative.", "The tag must be the opposite.", "Check that the tag uses the same auxiliary and a matching pronoun."],
      ex: { q: "(A) Nobody has / (B) come to the meeting, / (C) hasn't they? / (D) No error", steps: ["“Nobody” makes the statement negative, so the tag must be positive.", "Nobody takes “they”, and the auxiliary is “has” becoming “have”: “have they?”. The error is in (C)."], ans: "(C)" },
      shortcut: "No sign of a negative word means the tag is negative; any negative word means the tag is positive."
    }],
    ["pattern", {
      key: "verbal/error-spotting/conditionals", title: "Conditionals",
      spot: "A sentence with “if” or “unless”, or a “wish”.",
      method: ["Decide which type of condition it is (general, real future, unreal present, unreal past).", "Match the verb forms in both clauses.", "No “will” or “would” in the if-clause."],
      ex: { q: "(A) If it will rain / (B) tomorrow, we shall / (C) cancel the match. / (D) No error", steps: ["This is a real future condition.", "The if-clause takes the present tense: “If it rains tomorrow”. The error is in (A)."], ans: "(A)" },
      shortcut: "If + will / would is almost always wrong. The if-clause takes the present, the past or the past perfect."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Choosing a part that sounds odd but is correct:** if you cannot name the rule, it is not an error.",
      "**Missing the real subject:** the word closest to the verb is often not the subject (“The quality of these mangoes is...”).",
      "**Fixing meaning instead of grammar:** you are not asked whether the sentence is wise, only whether it is correct.",
      "**Forgetting “No error”:** about one question in five or six is correct.",
      "**Mistaking the spelling for the sound:** an hour, a university, an honest man, a unique idea.",
      "**Neither / either / each:** these look plural but take singular verbs.",
      "**Between and among:** between is for two; among is for more than two.",
      "**Using spoken habits:** “who did you meet?”, “between you and I”, “myself and John” are common in speech but marked wrong in exams.",
      "**“A number of” and “the number of”:** the first is plural, the second singular."
    ]],
    ["warn", "Do not pick “No error” first. Run the six-step check on every sentence and only choose it if all parts pass."],

    ["h2", "Quick check"],
    ["quiz", ["error-spotting-01", "error-spotting-02", "error-spotting-04", "error-spotting-06", "error-spotting-09"]]
  ]
});

/* ===================================================================== SENTENCE CORRECTION */
LEARN.verbal.push({
  id: "sentence-correction", group: "Grammar", title: "Sentence correction / improvement",
  sub: "Spot what is wrong with the underlined part, then pick the cleanest replacement",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Capgemini", "eLitmus"],
  blocks: [
    ["h2", "The idea"],
    ["p", "In a sentence-correction (sentence improvement) question, part of the sentence is underlined or in bold. Below it are four options. The first usually repeats the original text (labelled “No improvement” in many papers). The others are replacements. You choose the option that makes the sentence **grammatically correct, clear and concise**."],
    ["p", "This is error spotting with a twist: you do not just find the mistake, you also have to choose the right fix. The good news is that the same rulebook applies, so the best method is to **find the error type first, then look for the option that fixes it without breaking anything else**."],
    ["list", [
      "**Only the marked part can change.** The unmarked words stay. Your replacement must fit with them (agreement, tense, and meaning).",
      "**“No improvement” is right about one time in five.** If you cannot find a fault after the full check, choose it.",
      "**Two options can look correct.** The better one is shorter, clearer, and keeps the same meaning."
    ]],

    ["h2", "Rules"],
    ["p", "Rules for choosing the answer. For the grammar rules themselves (agreement, tenses, articles, prepositions and so on) use the rulebook in Error spotting; the same rules decide which option is right."],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["1", "Only the underlined part may change. The rest of the sentence must still read correctly with your choice.", "Neither of the two candidates was selected for the final round.", "Neither of the two candidates were not selected (changes meaning and adds a double negative)."],
      ["2", "Find the error type before looking at options: agreement, tense, pronoun, preposition, article, modifier, parallelism, idiom.", "She prefers tea to coffee.", "She prefers tea than coffee."],
      ["3", "The replacement must agree with the part you cannot change. Check across the gap.", "The group of workers has finished its shift.", "The group of workers have finished its shift."],
      ["4", "Keep the original meaning. A grammatically correct option that says something different is wrong.", "He told me that he would come the next day.", "He told me that he came the next day (time changes)."],
      ["5", "Prefer the shorter, simpler option if both are correct. Wordiness and redundancy are faults.", "The reason is that he was late.", "The reason is because of the fact that he was late."],
      ["6", "Check the tense against time words and against the rest of the sentence.", "She has lived here since 2015.", "She lives here since 2015."],
      ["7", "Keep parts of a list or a correlative pair parallel.", "He is not only clever but also hardworking.", "He is not only clever but he also works hard."],
      ["8", "A phrase at the front of a sentence must describe the subject that follows.", "Walking home, I saw an accident.", "Walking home, an accident was seen by me."],
      ["9", "Use the right idiom and preposition.", "She is good at mathematics. / He is senior to me.", "She is good in mathematics. / He is senior than me."],
      ["10", "Do not choose an option that fixes one error but creates another.", "If I were you, I would apologise.", "If I was you, I would apologise (the right form is “were”)."]
    ]],
    ["h", "Common correct forms you will be offered"],
    ["table", ["Pattern", "Correct form", "Often-offered wrong forms"], [
      ["no sooner ... than", "No sooner had he left than it rained.", "No sooner he left than... / ...when it rained"],
      ["hardly ... when", "Hardly had she sat down when the bell rang.", "Hardly she sat down when... / ...than the bell rang"],
      ["prefer ... to", "I prefer walking to driving.", "I prefer walking than driving."],
      ["different from", "This phone is different from that one.", "different than / different to"],
      ["so ... that", "He was so tired that he fell asleep.", "so tired than / so tired so he fell asleep"],
      ["the reason is that", "The reason is that the roads were blocked.", "The reason is because the roads were blocked."],
      ["rather ... than", "I would rather stay than go.", "I would rather stay than to go."],
      ["whether ... or", "I do not know whether he will come or not.", "whether he will come or if not"],
      ["not only ... but also", "She not only sings but also dances.", "She not only sings but also she dances."],
      ["one of the + plural", "One of my friends is a pilot.", "One of my friend is a pilot."]
    ]],

    ["h2", "Strategy and shortcuts"],
    ["h", "The 5-step method"],
    ["ol", [
      "**Read the whole sentence** (not only the underlined part) for meaning.",
      "**Diagnose** the underlined part: what rule might it break? Predict the fix before looking at options.",
      "**Test the options** against your prediction. Cross out those that keep the error or add a new one.",
      "**Re-read the sentence** with your chosen option in place, from start to end.",
      "**If the original is fine, choose “No improvement”.** Do not change a correct sentence just because the other options look fancy."
    ]],
    ["h", "Elimination shortcuts"],
    ["list", [
      "**Any option that repeats the same error as the original** can go at once.",
      "**Options with extra words** (“because of the fact that”, “in order to be able to”) are usually weaker than a short, direct one.",
      "**Check agreement first.** Many options differ only in singular / plural or in tense. One quick check removes two of them.",
      "**Compare the options with each other.** If three options start the same way and one is different, test what the differing part is changing.",
      "**Idioms are binary:** an idiom either fits (prefer ... to) or it does not. Do not argue with it."
    ]],
    ["tip", "If you cannot decide between two options, read each one aloud in the full sentence. The ear usually catches the odd one."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/sentence-correction/replace-the-underlined-part", title: "Replace the underlined part",
      spot: "The question says “choose the option that best replaces the underlined part”, and the original part is faulty.",
      method: ["Read the sentence and name the error (agreement, tense, preposition, idiom, parallelism).", "Predict the correct form.", "Pick the option that fixes it while keeping the meaning and fitting the unchanged words."],
      ex: { q: "The principal, along with the teachers, **are** planning a trip. (A) are (B) is (C) have been (D) were", steps: ["“Along with the teachers” does not make the subject plural.", "The subject is “the principal”, which is singular.", "So the verb must be “is”; the present tense matches “planning”."], ans: "(B) is" },
      shortcut: "Ignore anything between commas when checking subject and verb."
    }],
    ["pattern", {
      key: "verbal/sentence-correction/no-improvement", title: "“No improvement”",
      spot: "The first option repeats the original, and you must decide if the sentence is already correct.",
      method: ["Run the full check on the underlined part: agreement, tense, preposition, article, idiom, wordiness.", "If every check passes, nothing needs changing.", "Check that each alternative either keeps the same meaning with a new error, or changes the meaning. Then choose “No improvement”."],
      ex: { q: "The committee has submitted its report to the board. (A) No improvement (B) have submitted their report (C) are submitting its report (D) submitted their report", steps: ["“Committee” acting as one unit takes a singular verb: “has submitted”.", "“Its” agrees with “committee”.", "Every other option either breaks agreement or changes the tense."], ans: "(A) No improvement" },
      shortcut: "If you cannot name the rule that the original breaks, it probably does not break one. Answer “No improvement” and move on."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Changing a correct sentence:** the temptation is strongest when the sentence sounds slightly unusual. If it breaks no rule, leave it.",
      "**Fixing one error and creating another:** an option may fix agreement but make the tense wrong.",
      "**Ignoring the unmarked words:** the replacement must work with the words around it, especially for agreement.",
      "**Choosing the longest or the “most formal” option:** shorter, direct options are usually better.",
      "**Changing the meaning:** time words and negatives must stay the same.",
      "**Missing idioms:** prefer to, different from, good at, senior to. Memorise them as units."
    ]],
    ["warn", "After you pick an option, read the whole sentence with it in place. If it sounds wrong from start to finish, you have probably picked the wrong option."],

    ["h2", "Quick check"],
    ["quiz", ["sentence-correction-01", "sentence-correction-03", "sentence-correction-05", "sentence-correction-06", "sentence-correction-09"]]
  ]
});

/* ===================================================================== VOICE */
LEARN.verbal.push({
  id: "voice", group: "Grammar", title: "Voice",
  sub: "Active and passive voice, tense by tense, with the complete change tables",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A verb is in the **active voice** when the subject does the action (“The chef cooked the meal.”) and in the **passive voice** when the subject receives the action (“The meal was cooked by the chef.”). Changing from one to the other is a fixed procedure, just like long division."],
    ["p", "The big idea is that **the object of the active sentence becomes the subject of the passive sentence**, the verb becomes a form of **be + past participle** (in the same tense as the original), and the old subject moves to the end after **by** (and can often be dropped)."],
    ["list", [
      "**Only transitive verbs** (verbs that take an object) can be made passive.",
      "**The tense never changes** during the conversion. Only the verb form does.",
      "**Pronouns change case:** subject forms become object forms and the other way round."
    ]],
    ["note", "If you remember one line: Active: S + V + O. Passive: O + (be + V3) + by S."],

    ["h2", "Rules"],
    ["h", "A. The change in four steps"],
    ["ol", [
      "Make the **object** of the active sentence the **subject** of the passive sentence.",
      "Use the correct form of **be** for the tense, and the person and number of the new subject, followed by the **past participle (V3)** of the main verb.",
      "Put the **old subject** at the end with **by** (changing the pronoun to its object form).",
      "Keep everything else (time, place, manner words) in its place."
    ]],
    ["h", "B. Tense change table"],
    ["table", ["Tense", "Active", "Passive", "Pattern"], [
      ["Simple present", "She writes a letter.", "A letter is written by her.", "am / is / are + V3"],
      ["Present continuous", "She is writing a letter.", "A letter is being written by her.", "am / is / are + being + V3"],
      ["Present perfect", "She has written a letter.", "A letter has been written by her.", "has / have + been + V3"],
      ["Present perfect continuous", "She has been writing a letter.", "A letter has been being written by her. (rare, usually avoided)", "has / have + been + being + V3"],
      ["Simple past", "She wrote a letter.", "A letter was written by her.", "was / were + V3"],
      ["Past continuous", "She was writing a letter.", "A letter was being written by her.", "was / were + being + V3"],
      ["Past perfect", "She had written a letter.", "A letter had been written by her.", "had + been + V3"],
      ["Past perfect continuous", "She had been writing a letter.", "No usual passive form.", "(avoided)"],
      ["Simple future", "She will write a letter.", "A letter will be written by her.", "will / shall + be + V3"],
      ["Future continuous", "She will be writing a letter.", "No usual passive form.", "(avoided)"],
      ["Future perfect", "She will have written a letter.", "A letter will have been written by her.", "will have + been + V3"],
      ["Going to", "She is going to write a letter.", "A letter is going to be written by her.", "is / are going to + be + V3"]
    ]],
    ["h", "C. Modals"],
    ["table", ["Modal form", "Active", "Passive"], [
      ["can / could", "You can solve this problem.", "This problem can be solved by you."],
      ["may / might", "They may postpone the meeting.", "The meeting may be postponed by them."],
      ["must", "We must obey the rules.", "The rules must be obeyed by us."],
      ["should / ought to", "Students should read the notice.", "The notice should be read by students."],
      ["would", "He would finish the work.", "The work would be finished by him."],
      ["have to / has to", "You have to sign the form.", "The form has to be signed by you."],
      ["used to", "People used to call him a genius.", "He used to be called a genius."],
      ["modal + have + V3", "He should have posted the letter.", "The letter should have been posted by him."]
    ]],
    ["h", "D. Pronoun changes"],
    ["table", ["Active subject", "By + object form", "Active object", "Passive subject"], [
      ["I", "by me", "me", "I"],
      ["We", "by us", "us", "We"],
      ["You", "by you", "you", "You"],
      ["He", "by him", "him", "He"],
      ["She", "by her", "her", "She"],
      ["It", "by it", "it", "It"],
      ["They", "by them", "them", "They"]
    ]],
    ["h", "E. Imperatives (commands, requests, advice)"],
    ["table", ["Type", "Active", "Passive"], [
      ["Command", "Close the door.", "Let the door be closed. / You are ordered to close the door."],
      ["Request", "Please help me.", "You are requested to help me."],
      ["Negative command", "Do not touch the wires.", "Let the wires not be touched. / The wires should not be touched."],
      ["Advice", "Take this medicine.", "You are advised to take this medicine. / Let this medicine be taken."],
      ["“Let” sentences", "Let him go.", "Let him be allowed to go."],
      ["“Let” proposals", "Let us sing a song.", "Let a song be sung."]
    ]],
    ["h", "F. Questions"],
    ["table", ["Type", "Active", "Passive"], [
      ["Yes / no (is, are, was, were)", "Is he writing a letter?", "Is a letter being written by him?"],
      ["Yes / no (do, does, did)", "Did she post the parcel?", "Was the parcel posted by her?"],
      ["Yes / no (has, have)", "Have they finished the work?", "Has the work been finished by them?"],
      ["Yes / no (modal)", "Can you solve this problem?", "Can this problem be solved by you?"],
      ["Who (subject)", "Who wrote this poem?", "By whom was this poem written?"],
      ["Whom / what (object)", "Whom did you invite?", "Who was invited by you?"],
      ["Wh + do / did", "Why did he break the window?", "Why was the window broken by him?"],
      ["Wh + continuous", "Who is teaching you?", "By whom are you being taught?"]
    ]],
    ["h", "G. Special cases"],
    ["table", ["Case", "Active", "Passive"], [
      ["Two objects: make either the subject", "She gave me a book.", "I was given a book by her. / A book was given to me by her."],
      ["Verb + preposition stays together", "They laughed at him.", "He was laughed at by them."],
      ["Agent is general or unknown: drop “by ...”", "People speak English all over the world.", "English is spoken all over the world."],
      ["Intransitive verbs have no passive", "The sun rises in the east.", "No passive."],
      ["State verbs (have, resemble, lack, suit, fit) usually have no passive", "She resembles her mother.", "No passive."],
      ["Fixed prepositions replace “by”", "The news surprised us.", "We were surprised at the news."]
    ]],
    ["h", "H. Fixed prepositions in passives"],
    ["table", ["Instead of “by”", "Example"], [
      ["known to", "The answer is known to him."],
      ["surprised at / shocked at", "I was surprised at his behaviour."],
      ["pleased with / satisfied with", "She is pleased with the results."],
      ["interested in", "He is interested in music."],
      ["covered with / filled with", "The tank is filled with water."],
      ["worried about", "They are worried about the exams."],
      ["married to", "She is married to a doctor."]
    ]],

    ["h2", "Strategy and shortcuts"],
    ["list", [
      "**Say the tense first, then the pattern:** present perfect means has / have been + V3; past continuous means was / were being + V3. The table is the whole secret.",
      "**Check the new subject for number:** the form of “be” follows the new subject, not the old one (“The books were sold”, not “The books was sold”).",
      "**Only the form of be shows the tense.** The past participle never changes with tense.",
      "**For two-object verbs** (give, send, offer, tell, teach) either object can become the subject. Choosing the person is more natural: “I was given a book.”",
      "**Wh-question with who?** becomes “by whom”: “By whom was this written?”",
      "**Going the other way (passive to active)** use the same table backward: find the by-phrase, make it the subject, and use the active verb in the same tense."
    ]],
    ["tip", "Past participle forms are the real test: write wrote written, take took taken, give gave given, speak spoke spoken. Go through the irregular list once a week."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/voice/active-passive-simple-tenses", title: "Active ↔ passive: simple tenses",
      spot: "A sentence in the simple present, simple past or simple future with a clear object.",
      method: ["Mark subject, verb and object.", "Move the object to the front. Choose am / is / are (present), was / were (past) or will be (future) to match it.", "Add the past participle, then “by” + the old subject in object form."],
      ex: { q: "Change to the passive: Ravi paints the walls every year.", steps: ["Subject: Ravi. Verb: paints (simple present). Object: the walls.", "New subject: the walls (plural), so “are painted”.", "Add “by Ravi” at the end."], ans: "The walls are painted by Ravi every year." },
      shortcut: "Simple past needs was / were + V3, simple present needs is / are + V3, simple future needs will be + V3."
    }],
    ["pattern", {
      key: "verbal/voice/active-passive-perfect-and-continuous", title: "Active ↔ passive: perfect & continuous tenses",
      spot: "A verb phrase with have / has / had or with am / is / was + -ing.",
      method: ["Identify the tense: perfect (have + V3) or continuous (be + V-ing).", "Perfect: have / has / had + been + V3. Continuous: am / is / are / was / were + being + V3.", "Keep the same helper for the tense and adjust to the new subject."],
      ex: { q: "Change to the passive: The mechanic was repairing the scooter when I arrived.", steps: ["“Was repairing” is past continuous.", "Passive: was / were + being + V3, and the new subject “the scooter” is singular: “was being repaired”.", "Add “by the mechanic”."], ans: "The scooter was being repaired by the mechanic when I arrived." },
      shortcut: "Perfect tenses insert “been”. Continuous tenses insert “being”."
    }],
    ["pattern", {
      key: "verbal/voice/active-passive-modals", title: "Active ↔ passive: modals",
      spot: "A sentence with can, could, may, might, must, should, would, ought to, or have to.",
      method: ["Keep the modal as it is.", "After the modal write “be” + V3.", "For a modal with perfect (should have), write “should have been” + V3."],
      ex: { q: "Change to the passive: You must obey these rules.", steps: ["Modal: must. Object: these rules.", "Passive: these rules + must + be + obeyed.", "Add “by you”."], ans: "These rules must be obeyed by you." },
      shortcut: "Modal + be + V3. The modal never changes and never takes an -s."
    }],
    ["pattern", {
      key: "verbal/voice/active-passive-imperatives", title: "Active ↔ passive: imperatives",
      spot: "A command, a request or a piece of advice with no subject written (“Shut the window.”, “Please help me.”).",
      method: ["Commands: start with “Let”, then the object, then “be” + V3.", "Requests and advice: “You are requested / advised to ...”.", "Negative commands: “Let ... not be ...” or “... should not be ...”."],
      ex: { q: "Change to the passive: Shut the window.", steps: ["There is no stated subject, so use the “Let” frame.", "Let + the window + be + shut."], ans: "Let the window be shut. (or: You are ordered to shut the window.)" },
      shortcut: "“Please” changes the sentence into a request: “You are requested to ...”."
    }],
    ["pattern", {
      key: "verbal/voice/active-passive-questions", title: "Active ↔ passive: questions",
      spot: "A sentence that begins with an auxiliary (is, does, did, has, can) or with who, what, why, how.",
      method: ["Rewrite the question as a statement in your head.", "Convert it to the passive using the tense table.", "Put the question word or auxiliary back in front. “Who” becomes “by whom”."],
      ex: { q: "Change to the passive: Who has taken my pen?", steps: ["As a statement: someone has taken my pen (present perfect).", "Passive: my pen has been taken.", "The question word “who” goes after “by”, so: By whom has my pen been taken?"], ans: "By whom has my pen been taken?" },
      shortcut: "Auxiliary questions keep their word order: “Was the parcel posted by her?” Who-questions turn into “By whom was ... ?”."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Changing the tense:** the tense of the passive is the same as the tense of the active. Simple past stays simple past.",
      "**Wrong form of be:** “was” for a singular new subject, “were” for a plural one. Check it after changing the subject.",
      "**Forgetting “being”:** the continuous passive needs it (“is being repaired”). “Is repaired” is simple present.",
      "**Wrong past participle:** “was wrote”, “was ate”, “was took” are wrong. It is written, eaten, taken.",
      "**Pronoun case:** “by he” and “by I” are wrong. It is by him, by me.",
      "**Trying to make intransitive verbs passive:** “The sun is risen by...” is not possible.",
      "**Using “by” where it does not belong:** known to, pleased with, interested in.",
      "**Mixing up the two objects:** with “gave me a book”, “I was given a book” is more natural than “A book was given me”."
    ]],
    ["warn", "After converting, read the new sentence and check four things: the tense matches the original, the form of be matches the new subject, the verb is in V3, and the old subject follows by."],

    ["h2", "Quick check"],
    ["quiz", ["voice-01", "voice-03", "voice-04", "voice-07", "voice-09"]]
  ]
});

/* ===================================================================== NARRATION */
LEARN.verbal.push({
  id: "narration", group: "Grammar", title: "Narration",
  sub: "Direct and indirect speech: the change tables for tense, pronouns, time and place, questions, commands and exclamations",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant"],
  blocks: [
    ["h2", "The idea"],
    ["p", "There are two ways to report what someone said. In **direct speech** you quote the exact words: He said, “I am tired.” In **indirect (reported) speech** you report the meaning in your own words: He said that he was tired. Narration questions ask you to switch between the two."],
    ["p", "The conversion needs four decisions, in this order: **(1) the reporting verb and the joining word, (2) the tense, (3) the pronouns, (4) the time and place words.** Get those four right and any sentence can be converted."],
    ["list", [
      "**Reporting verb:** the verb outside the quotation marks (said, asked, told, ordered).",
      "**Reported speech:** what was said, inside the quotation marks.",
      "**Backshift:** when the reporting verb is in the past, the tense of the reported speech moves one step back in time."
    ]],
    ["note", "If the reporting verb is in the present or future (He says..., He will say...), the tense of the reported speech does not change at all."],

    ["h2", "Rules"],
    ["h", "A. Tense change table (reporting verb in the past)"],
    ["table", ["Direct speech", "Indirect speech", "Example (direct → indirect)"], [
      ["Simple present", "Simple past", "“I am happy.” → He said that he was happy."],
      ["Present continuous", "Past continuous", "“I am reading.” → She said that she was reading."],
      ["Present perfect", "Past perfect", "“I have finished.” → He said that he had finished."],
      ["Present perfect continuous", "Past perfect continuous", "“I have been waiting.” → She said that she had been waiting."],
      ["Simple past", "Past perfect", "“I saw him.” → He said that he had seen him."],
      ["Past continuous", "Past perfect continuous", "“I was sleeping.” → He said that he had been sleeping."],
      ["Past perfect", "No change", "“I had left.” → He said that he had left."],
      ["will / shall", "would", "“I will go.” → He said that he would go."],
      ["can", "could", "“I can swim.” → He said that he could swim."],
      ["may", "might", "“I may come.” → He said that he might come."],
      ["must", "must or had to", "“I must go.” → He said that he had to go."],
      ["could, would, should, might, ought to", "No change", "“I should rest.” → He said that he should rest."]
    ]],
    ["h", "B. When the tense does not change"],
    ["table", ["Case", "Example"], [
      ["Reporting verb in the present or future", "He says, “I am tired.” → He says that he is tired."],
      ["Universal truth or scientific fact", "The teacher said, “The earth moves round the sun.” → The teacher said that the earth moves round the sun."],
      ["Habitual fact that is still true", "She said, “I get up at five.” → She said that she gets up at five."],
      ["Reported speech already in the past perfect", "He said, “She had left.” → He said that she had left."],
      ["Conditional with unreal sense (second and third)", "He said, “If I were rich, I would travel.” → He said that if he were rich, he would travel."],
      ["Modals that are already in the past form", "“You should rest.” → He said that I should rest."]
    ]],
    ["h", "C. Pronoun rule: S-O-N"],
    ["table", ["Person in the reported speech", "Changes to match", "Example"], [
      ["First person (I, we, my, our)", "The subject of the reporting verb", "Rohan said, “I like my job.” → Rohan said that he liked his job."],
      ["Second person (you, your)", "The object of the reporting verb", "He said to her, “You are late.” → He told her that she was late."],
      ["Third person (he, she, they, it)", "No change", "He said, “She is clever.” → He said that she was clever."]
    ]],
    ["h", "D. Time and place words"],
    ["table", ["Direct speech", "Indirect speech", "Direct speech", "Indirect speech"], [
      ["now", "then", "ago", "before"],
      ["today", "that day", "here", "there"],
      ["tonight", "that night", "this", "that"],
      ["yesterday", "the previous day / the day before", "these", "those"],
      ["tomorrow", "the next day / the following day", "come", "go"],
      ["last night / week / year", "the previous night / week / year", "thus", "so"],
      ["next week / month", "the following week / month", "just now", "at that moment"],
      ["the day after tomorrow", "in two days' time", "hence", "thence"]
    ]],
    ["h", "E. Reporting verbs and joining words"],
    ["table", ["Type of sentence", "Reporting verb (replace “said to” with)", "Joining word"], [
      ["Statement", "said / told (when there is a listener)", "that"],
      ["Question (yes / no)", "asked / enquired", "if or whether"],
      ["Question (wh-)", "asked / enquired", "the same wh-word (what, why, where, when, how, who)"],
      ["Command", "ordered / commanded", "to (or not to)"],
      ["Request", "requested / begged / pleaded", "to (or not to)"],
      ["Advice", "advised / urged", "to (or not to)"],
      ["Suggestion (Let us)", "suggested / proposed", "that ... should"],
      ["Exclamation", "exclaimed with joy / sorrow / surprise / admiration", "that"],
      ["Wish or prayer", "wished / prayed", "that ... might"]
    ]],
    ["h", "F. Statements"],
    ["ol", [
      "Put “that” after the reporting verb (replacing the comma and quotation marks).",
      "Change “said to” into “told” (“said” stays “said” when there is no listener).",
      "Backshift the tense, change the pronouns and change time and place words."
    ]],
    ["h", "G. Questions"],
    ["table", ["Step", "Yes / no question", "Wh- question"], [
      ["Reporting verb", "asked", "asked"],
      ["Joining word", "if / whether", "the wh-word itself"],
      ["Word order", "statement order: subject, then verb", "statement order: subject, then verb"],
      ["Auxiliary do / does / did", "removed", "removed"],
      ["Question mark", "full stop instead", "full stop instead"],
      ["Example", "He said to me, “Do you know him?” → He asked me if I knew him.", "She said to him, “Where do you live?” → She asked him where he lived."]
    ]],
    ["h", "H. Commands, requests and advice"],
    ["table", ["Direct", "Indirect"], [
      ["The teacher said to the boy, “Sit down.”", "The teacher ordered the boy to sit down."],
      ["He said to her, “Please help me.”", "He requested her to help him."],
      ["The doctor said to him, “Do not eat oily food.”", "The doctor advised him not to eat oily food."],
      ["The officer said, “Stand up.”", "The officer commanded them to stand up."],
      ["She said to him, “Never tell a lie.”", "She told him never to tell a lie."],
      ["He said, “Let us go for a walk.”", "He suggested that they should go for a walk."]
    ]],
    ["h", "I. Exclamations and wishes"],
    ["table", ["Direct", "Indirect"], [
      ["He said, “Hurrah! We have won!”", "He exclaimed with joy that they had won."],
      ["She said, “Alas! I have lost my wallet.”", "She exclaimed with sorrow that she had lost her wallet."],
      ["He said, “What a beautiful garden!”", "He exclaimed with admiration that it was a very beautiful garden."],
      ["Anil said to her, “How kind you are!”", "Anil exclaimed with admiration that she was very kind."],
      ["He said, “Wow! I have passed!”", "He exclaimed with surprise that he had passed."],
      ["She said, “May God bless you!”", "She prayed that God might bless me."],
      ["He said to me, “Good morning.”", "He wished me good morning."]
    ]],
    ["h", "J. Indirect to direct"],
    ["p", "Reverse the table. Remove “that”, put the reporting verb in the past tense back to the speaker's words, bring back the original tense, change pronouns back, and put the quotation marks and the end mark. For a question, restore the auxiliary (do, does, did) and the question word."],

    ["h2", "Strategy and shortcuts"],
    ["h", "The 4-step routine"],
    ["ol", [
      "**Classify:** statement, question, command or exclamation. This decides the reporting verb and the joining word.",
      "**Tense:** is the reporting verb past? If yes, backshift using table A. If it is present or future, or the speech is a universal truth, keep the tense.",
      "**Pronouns and words:** apply S-O-N, then the time-and-place table.",
      "**Read the result aloud** for word order (questions become statements) and for the final punctuation."
    ]],
    ["h", "Quick checks"],
    ["list", [
      "**Questions** never keep the question mark and never keep do / does / did.",
      "**Commands** always become “to + verb” (or “not to + verb”).",
      "**Exclamations** use “that” and an adverb phrase of feeling (with joy / with sorrow / with surprise).",
      "**“Said to”** changes to told (statement), asked (question), ordered, advised or requested (command).",
      "**Modals:** will, can, may become would, could, might. Would, could, should, might, ought to stay as they are."
    ]],
    ["tip", "S-O-N for pronouns: Subject for the first person, Object for the second person, No change for the third person."],
    ["tip", "A quick test: a reported question must not end in a question mark, and the word right after the question word must be the subject, not did / does / is."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/narration/direct-indirect-statements", title: "Direct ↔ indirect: statements",
      spot: "A sentence with “said” or “said to” followed by a quoted statement.",
      method: ["Replace the comma and quotation marks with “that”; change “said to” to “told”.", "Backshift the tense if the reporting verb is past.", "Change the pronouns (S-O-N) and the time and place words."],
      ex: { q: "Change to indirect speech: He said to me, “I will call you tomorrow.”", steps: ["Reporting verb: said to → told me; add “that”.", "I → he (first person, subject); you → me (second person, object).", "will → would; tomorrow → the next day."], ans: "He told me that he would call me the next day." },
      shortcut: "Three changes happen every time: tense, pronouns, time words. Tick them off one by one."
    }],
    ["pattern", {
      key: "verbal/narration/direct-indirect-questions", title: "Direct ↔ indirect: questions",
      spot: "A quoted sentence that ends with a question mark and a reporting verb like “said to” or “asked”.",
      method: ["Change the reporting verb to asked.", "Yes / no question: join with if or whether. Wh-question: keep the question word.", "Use statement order, remove do / does / did, backshift the tense, change pronouns, and end with a full stop."],
      ex: { q: "Change to indirect speech: The interviewer said to Priya, “Why did you leave your last job?”", steps: ["Reporting verb: said to → asked. It is a wh-question, so keep “why”.", "Statement order: you left (not did you leave). did leave → had left.", "you → she (the listener is Priya)."], ans: "The interviewer asked Priya why she had left her last job." },
      shortcut: "Direct question: auxiliary comes first. Indirect question: subject comes first. That one swap fixes most answers."
    }],
    ["pattern", {
      key: "verbal/narration/direct-indirect-commands", title: "Direct ↔ indirect: commands",
      spot: "An order, request or piece of advice in the quotation, usually a sentence with no subject (“Sit down.”, “Please wait.”, “Do not shout.”).",
      method: ["Choose the reporting verb by feeling: ordered / commanded (command), requested (please), advised (advice), forbade or told not to (negative).", "Replace the imperative verb with “to + verb” (or “not to + verb”).", "Change pronouns by S-O-N and time words; there is no “that” and no backshift."],
      ex: { q: "Change to indirect speech: The doctor said to the patient, “Do not eat oily food.”", steps: ["It is advice, so the reporting verb is “advised”.", "Negative: “not to eat”.", "No “that”, no tense change."], ans: "The doctor advised the patient not to eat oily food." },
      shortcut: "Commands become “to + verb”. “Do not + verb” becomes “not to + verb”."
    }],
    ["pattern", {
      key: "verbal/narration/direct-indirect-exclamations", title: "Direct ↔ indirect: exclamations",
      spot: "A quotation with an exclamation mark: Hurrah! Alas! What a ...! How ...! Wow!",
      method: ["Replace “said” with “exclaimed with joy / sorrow / surprise / admiration” (or “exclaimed that”).", "Remove the exclamation word; add “that” and rewrite the rest as a statement.", "“What a / How” become “very” or “a great”; backshift the tense and change pronouns."],
      ex: { q: "Change to indirect speech: Anil said to her, “How kind you are!”", steps: ["The feeling is admiration: “exclaimed with admiration that”.", "“How kind you are” becomes the statement “she was very kind” (How → very; you → she; are → was)."], ans: "Anil exclaimed with admiration that she was very kind." },
      shortcut: "Joy: hurrah, bravo. Sorrow: alas. Surprise: oh, wow. Admiration: how, what (a)."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Keeping the question mark and the auxiliary:** “He asked me did I know him?” is wrong. It is “He asked me if I knew him.”",
      "**Forgetting to backshift:** if the reporting verb is past, “is” becomes “was”, “will” becomes “would”.",
      "**Backshifting when you should not:** universal truths and a present reporting verb keep the tense.",
      "**Changing the pronoun twice:** apply S-O-N once. “You” becomes the listener, not the speaker.",
      "**Using “that” with commands and questions:** use “to” for commands and if / whether or the wh-word for questions.",
      "**Missing time words:** tomorrow and yesterday need to change, but only when the reporting is on another day.",
      "**Using “told” with a question:** “asked” for questions, “told” only for statements and for the person addressed.",
      "**Wrong feeling in exclamations:** choose the feeling from the interjection (alas = sorrow, hurrah = joy)."
    ]],
    ["warn", "Check three things before you finish: the joining word (that / if / to), the tense, and the end mark. Wrong in any of these means the whole conversion is wrong."],

    ["h2", "Quick check"],
    ["quiz", ["narration-01", "narration-04", "narration-07", "narration-09", "narration-05"]]
  ]
});

/* ===================================================================== FILL IN THE BLANKS */
LEARN.verbal.push({
  id: "fill-blanks", group: "Vocabulary & usage", title: "Fill in the blanks",
  sub: "Predict the word before you look at the options: vocabulary, grammar, double blanks, collocations and phrasal verbs",
  tags: ["TCS", "Infosys", "Wipro", "Accenture", "AMCAT", "Cognizant", "Capgemini"],
  blocks: [
    ["h2", "The idea"],
    ["p", "A fill-in-the-blank question gives a sentence with one or two gaps and four options. Every sentence contains **clues**: the tone (positive or negative), a signal word (although, because, but), a grammar need (a verb, a plural noun, a preposition), or a word that always goes with another. The skill is to **find the clue first and predict the word**, then match it to the options."],
    ["p", "There are three kinds of blank. **Meaning blanks** test vocabulary (which word fits the sense). **Grammar blanks** test a rule (agreement, tense, preposition, article). **Usage blanks** test collocations and phrasal verbs, the pairs that native users feel but that must be learned."],
    ["list", [
      "**Predict first.** If you can say a word before reading the options, the right option will jump out.",
      "**Test by substitution.** Put the option into the gap and read the whole sentence.",
      "**Eliminate before choosing.** Wrong grammar and wrong tone remove two options fast."
    ]],

    ["h2", "Rules"],
    ["table", ["#", "Rule", "Right", "Wrong"], [
      ["1", "Read the whole sentence before looking at options. The clue is often at the far end.", "Despite repeated warnings, he remained oblivious to the danger.", "Despite repeated warnings, he remained vigilant to the danger."],
      ["2", "Decide the tone of the sentence: positive or negative. The word must match.", "Her generous donation delighted the staff.", "Her generous donation depressed the staff."],
      ["3", "Contrast signals (although, though, but, yet, however, despite, whereas, unlike) need an opposite idea. Same-direction signals (and, moreover, so, because) need a similar idea.", "Although the plan looked impressive, it proved impractical.", "Although the plan looked impressive, it proved impressive."],
      ["4", "Check the grammar need: singular or plural, tense, part of speech.", "Each of the employees has a laptop.", "Each of the employees have a laptop."],
      ["5", "A preposition after a verb or adjective is fixed.", "She is fond of music. / He insisted on paying.", "She is fond for music. / He insisted to pay."],
      ["6", "Use the natural collocation (the word partner).", "make a decision, do homework, pay attention, take a chance", "do a decision, make homework, give attention, make a chance"],
      ["7", "For phrasal verbs, the particle (up, off, out, in) changes the meaning. Match the meaning of the whole phrase.", "The match was called off because of rain.", "The match was called up because of rain."],
      ["8", "Double blanks: find the clue that fixes one blank, then check that the pair works together.", "Although the plan looked impressive, it proved impractical.", "Although the plan looked weak, it proved poor."],
      ["9", "Reject options that are right in meaning but wrong in form (wrong part of speech, wrong number).", "Her kindness is well known.", "Her kind is well known."],
      ["10", "Read the sentence with your answer in the gap. It must be natural from start to finish.", "She took on a challenging role.", "She took off a challenging role."]
    ]],
    ["h", "Signal words"],
    ["table", ["Signal", "Words", "What the blank needs"], [
      ["Contrast", "but, yet, although, though, despite, however, whereas, unlike, while", "A word with the opposite sense of the clue"],
      ["Same direction", "and, also, moreover, besides, similarly, likewise", "A word with a similar sense"],
      ["Cause", "because, since, as, due to", "A word that explains the other part"],
      ["Result", "so, therefore, thus, hence, consequently", "A word that follows from the other part"],
      ["Example or definition", "that is, namely, such as, for instance", "A word that matches the example"]
    ]],
    ["h", "Common collocations"],
    ["table", ["Verb pair", "Examples"], [
      ["make", "make a decision, make an effort, make progress, make a mistake, make a complaint, make a living, make sense"],
      ["do", "do homework, do business, do harm, do a favour, do your best, do research"],
      ["take", "take a chance, take notes, take advantage of, take part in, take place, take care of"],
      ["pay", "pay attention, pay a visit, pay a compliment, pay respect, pay the price"],
      ["draw / lay / impose", "draw a conclusion, draw attention, lay emphasis on, lay the foundation, impose a ban, impose a fine"],
      ["heavy / strong / high", "heavy rain, heavy traffic, strong tea, strong wind, high hopes, high risk"],
      ["fast / quick / rapid", "fast food, quick glance, rapid growth, quick reply"],
      ["deep / sound / light", "deep sleep, sound sleep, light sleep, deep trouble"]
    ]],
    ["h", "Common phrasal verbs"],
    ["table", ["Phrasal verb", "Meaning", "Phrasal verb", "Meaning"], [
      ["call off", "cancel", "look into", "investigate"],
      ["put off", "postpone", "carry out", "perform"],
      ["give up", "stop trying", "turn down", "reject"],
      ["bring up", "raise (a child, a topic)", "come across", "find by chance"],
      ["run out of", "have none left", "set up", "establish"],
      ["break down", "stop working", "take after", "resemble"],
      ["look after", "take care of", "make up for", "compensate"],
      ["get along with", "have a good relationship", "put up with", "tolerate"],
      ["fall back on", "rely on in need", "cut down on", "reduce"],
      ["look forward to", "await with pleasure", "come up with", "think of (an idea)"]
    ]],

    ["h2", "Strategy and shortcuts"],
    ["h", "The 4-step method"],
    ["ol", [
      "**Read the sentence completely** and find the clue: tone, signal word or grammar need.",
      "**Predict a word or its meaning** before looking at the options.",
      "**Eliminate:** wrong grammar, wrong tone, wrong meaning.",
      "**Substitute and read aloud.** Choose the option that makes the whole sentence natural."
    ]],
    ["h", "For each kind of blank"],
    ["table", ["Kind", "First look at...", "Then check..."], [
      ["Vocabulary", "The clue words and the tone of the sentence", "That the meaning and the part of speech both fit"],
      ["Grammar", "The words around the gap: subject, time words, preposition", "The rule (agreement, tense, article)"],
      ["Double blanks", "The signal word between the two gaps", "That the pair is consistent (same or opposite)"],
      ["Collocations", "The word that the gap partners", "That the pair sounds natural together"],
      ["Phrasal verbs", "The meaning needed by the sentence", "That the particle gives that exact meaning"]
    ]],
    ["tip", "With double blanks, solve the easier gap first. Eliminate the options that fail it. Often only one pair is left."],
    ["tip", "Build a small notebook of 10 new collocations and 10 phrasal verbs a week. These two kinds of blank cannot be solved by logic: they are learned."],

    ["h2", "Patterns"],
    ["pattern", {
      key: "verbal/fill-blanks/vocabulary", title: "Vocabulary",
      spot: "A single blank where the meaning of the word is the only issue. All four options are the right part of speech.",
      method: ["Find the clue: a signal word, a contrast, or a definition in the sentence.", "Predict the meaning (for example “hard to follow”).", "Choose the option that matches that meaning and tone."],
      ex: { q: "The new rules were so ______ that even experienced officers could not understand them. (A) lucid (B) convoluted (C) brief (D) familiar", steps: ["Clue: “so ... that even experienced officers could not understand”.", "The rules must be hard to follow, so predict “complicated”.", "Convoluted means complicated and twisting. Lucid means clear, brief and familiar make no sense with the result."], ans: "(B) convoluted" },
      shortcut: "So ... that sentences tell you the result. Work backward from the result to the meaning of the blank."
    }],
    ["pattern", {
      key: "verbal/fill-blanks/grammar", title: "Grammar",
      spot: "The options are forms of the same word (is / are / has been) or small function words (a / an / the, prepositions).",
      method: ["Find the subject, time word or the word that controls the gap.", "Apply the rule (agreement, tense, article, preposition).", "Check that exactly one option satisfies it."],
      ex: { q: "Each of the new employees ______ given a laptop on the first day. (A) were (B) have been (C) has been (D) are", steps: ["“Each” is singular, so the verb must be singular.", "Options (A), (B) and (D) are plural.", "“Has been given” is singular and correct."], ans: "(C) has been" },
      shortcut: "When the options are forms of one word, the sentence is testing a rule, not a meaning."
    }],
    ["pattern", {
      key: "verbal/fill-blanks/double-blanks", title: "Double blanks",
      spot: "Two gaps in the same sentence, and each option offers a pair of words.",
      method: ["Find the signal word (although, but, because) that links the two gaps.", "Decide: should the pair be opposite (contrast) or similar (same direction)?", "Check each pair against that need and against the tone of the sentence."],
      ex: { q: "Although the plan looked ______ on paper, it proved ______ in practice. (A) impressive ... impractical (B) risky ... dangerous (C) simple ... easy (D) weak ... poor", steps: ["“Although” signals contrast, so the two blanks must be opposite in feeling.", "(A) impressive vs impractical gives a contrast.", "(B), (C) and (D) are pairs with the same sense, so they fail."], ans: "(A) impressive ... impractical" },
      shortcut: "Although / but / yet → opposite pair. And / because / so → similar pair."
    }],
    ["pattern", {
      key: "verbal/fill-blanks/collocations", title: "Collocations",
      spot: "A blank next to a noun or verb where several options mean almost the same, but only one is the natural partner.",
      method: ["Say the phrase with each option and listen for the natural pair.", "Recall the fixed pair: make a decision, impose a ban, pay attention.", "Reject options that are correct English alone but unnatural in the pair."],
      ex: { q: "The council has decided to ______ a ban on plastic bags. (A) make (B) impose (C) draw (D) hold", steps: ["The noun is “a ban”.", "The natural partners are impose a ban or lift a ban.", "Only “impose” is among the options."], ans: "(B) impose" },
      shortcut: "A collocation is a pair you either know or do not. Practise by reading whole phrases, not single words."
    }],
    ["pattern", {
      key: "verbal/fill-blanks/phrasal-verbs", title: "Phrasal verbs",
      spot: "A blank for a particle (up, off, out, in, on) or for the whole phrasal verb, where the meaning depends on the particle.",
      method: ["Work out the meaning the sentence needs (cancel, postpone, tolerate, find by chance).", "Match it to the phrasal verb with that meaning.", "Check that the particle is the one the phrasal verb needs."],
      ex: { q: "The match had to be ______ because of heavy rain. (A) called off (B) called on (C) called up (D) called in", steps: ["The sentence needs the meaning “cancelled”.", "Call off = cancel. Call on = visit, call up = telephone or summon, call in = ask to come in."], ans: "(A) called off" },
      shortcut: "Learn phrasal verbs in a sentence, not in a list. “The match was called off” is easier to remember than “call off = cancel”."
    }],

    ["h2", "Common traps"],
    ["list", [
      "**Choosing the first word that sounds familiar:** check it against the clue and the tone.",
      "**Ignoring the signal word:** although, but and yet reverse the meaning. Many wrong answers are the “same direction” option.",
      "**Forgetting grammar in a meaning blank:** the word must also have the right part of speech and number.",
      "**Picking a word that is right in meaning but wrong in the pair:** do a decision, make homework are wrong.",
      "**Double blanks, one blank at a time:** a pair may fit the first blank but fail the second. Always check both.",
      "**Phrasal verb particles:** call off, call on and call up are all different. One particle changes everything.",
      "**Positive versus negative:** a word with the right meaning but the wrong tone (praise vs criticise) is wrong."
    ]],
    ["warn", "Read the whole sentence again with your chosen word in place. If it does not sound natural from start to finish, your choice is probably wrong."],

    ["h2", "Quick check"],
    ["quiz", ["fb-01", "fb-03", "fb-05", "fb-07", "fb-08"]]
  ]
});

/* ===================================================================== BRIEFS */
BRIEFS["verbal:reading-comprehension"] = "Every answer in a passage is already in the text. Skim the questions first, read the passage once while marking the signal words (but, however, because, therefore), then go back to the exact line before you answer.\n\nRemove options that are too narrow, too broad, the opposite, or extreme (always, never, only). For True / False / Cannot say, use only the passage: say it, contradict it, or stay silent.";
BRIEFS["verbal:error-spotting"] = "Only one part of the sentence is wrong, or none is. Run the same short check on every sentence: subject and verb, tense against the time word, then the small words (articles, prepositions, pronouns), then any pair like neither-nor.\n\nMost errors come from about a dozen rules. Learn each with one right and one wrong example, and remember that “No error” is correct about one time in five.";
BRIEFS["verbal:sentence-correction"] = "Only the marked part can change. Find the error type first, predict the fix, and then pick the option that repairs it without breaking agreement, tense or meaning with the words around it.\n\nWhen two options are both correct, choose the shorter and clearer one. If you cannot name a rule that the original breaks, “No improvement” is the answer.";
BRIEFS["verbal:voice"] = "In the passive voice the object of the active sentence becomes the subject, the verb becomes be + past participle in the same tense, and the old subject goes after by. The tense never changes during the conversion.\n\nLearn the tense table: is written, is being written, has been written, was written, will be written. Modals become modal + be + V3, commands use Let, and who-questions become by whom.";
BRIEFS["verbal:narration"] = "When the reporting verb is in the past, move the tense one step back (is to was, will to would, has to had). Pronouns follow S-O-N: first person to the subject, second to the object, third unchanged. Words like now, here, tomorrow become then, there, the next day.\n\nStatements use that, questions use if or the wh-word in statement order, commands use to, and exclamations use exclaimed with joy or sorrow plus that.";
BRIEFS["verbal:fill-blanks"] = "Read the whole sentence and predict the missing word before you look at the options. The clue is the tone, a signal word (although and but flip the meaning), or a grammar need.\n\nCollocations (make a decision, impose a ban) and phrasal verbs (call off, put up with) have to be learned as pairs. For double blanks, solve the easier gap first and check that the pair is consistent.";
