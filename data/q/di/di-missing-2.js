// DI bank (part 2): di-missing. Original questions for Aptitude Hub; every answer computed from the set data.
QB.add([
 {
  "id": "di-missing-11",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "What was Plant Y's production in 2023 (thousand units)?",
  "opts": [
   "72",
   "78",
   "108",
   "42"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "Row total 108 = 30 + 36 + ?",
   "? = 108 − 66 = **42**"
  ],
  "short": "108 − 30 − 36 = 42.",
  "trap": "Subtract both known years from the row total.",
  "why": [
   "Forgot to subtract the 2021 value",
   "Forgot to subtract the 2022 value",
   "That is the three-year total",
   null
  ],
  "calc": "108-30-36",
  "set": "dim-plants"
 },
 {
  "id": "di-missing-12",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "pct-change-growth",
  "d": "Easy",
  "q": "By what percent did Plant X's production grow from 2021 to 2022?",
  "opts": [
   "20%",
   "25%",
   "10%",
   "125%"
  ],
  "ans": 1,
  "time": 40,
  "sol": [
   "X 2022 = 150 − 40 − 60 = 50",
   "(50 − 40) ÷ 40 × 100 = **25%**"
  ],
  "short": "10/40 = 1/4.",
  "trap": "The base is the earlier year.",
  "why": [
   "Divided the rise by the 2022 value instead of the 2021 base",
   null,
   "Gave the rise in thousand units as a percent",
   "Gave the ratio 50/40, not the growth"
  ],
  "calc": "(50-40)/40*100",
  "set": "dim-plants"
 },
 {
  "id": "di-missing-13",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "ratio-of-two-values",
  "d": "Medium",
  "q": "What was the ratio of Plant Z's production in 2021 to Plant Y's production in 2021?",
  "opts": [
   "5 : 3",
   "3 : 5",
   "5 : 4",
   "4 : 3"
  ],
  "ans": 0,
  "time": 65,
  "sol": [
   "Z 2021 = 120 − 40 − 30 = 50 (column total)",
   "50 : 30 = **5 : 3**"
  ],
  "short": "Find Z from the 2021 column total first.",
  "trap": "Z’s 2021 value is blank; use the column total, not the row total.",
  "why": [
   null,
   "Inverted the ratio",
   "Compared Z with X (50 : 40)",
   "Compared X with Y (40 : 30)"
  ],
  "calc": "50/30",
  "set": "dim-plants"
 },
 {
  "id": "di-missing-14",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "Plant Z's production was what percent of the total production of all three plants in 2021? (Round to one decimal place.)",
  "opts": [
   "≈ 39.9%",
   "≈ 33.3%",
   "≈ 41.7%",
   "≈ 25%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Z 2021 = 50; 2021 total = 120",
   "50 ÷ 120 × 100 = **41.7%**"
  ],
  "short": "50/120 = 5/12 ≈ 41.7%.",
  "trap": "The question names a single year; do not use the three-year total.",
  "why": [
   "Used Z’s three-year share (171 ÷ 429)",
   "Assumed the three plants share equally",
   null,
   "Used Plant Y’s 2021 value (30 ÷ 120)"
  ],
  "calc": "round(50/120*100,1)",
  "set": "dim-plants"
 },
 {
  "id": "di-missing-15",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "combined",
  "d": "Hard",
  "q": "In 2021 the profit per unit was ₹500 for Plant X, ₹400 for Plant Y and ₹300 for Plant Z. What was the total profit of the three plants in 2021?",
  "opts": [
   "₹480 lakh",
   "₹470 lakh",
   "₹320 lakh",
   "₹559 lakh"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "2021 units (thousand): X 40, Y 30, Z 50 (Z from the column total)",
   "Profit = 40 × 500 + 30 × 400 + 50 × 300 = 47,000 thousand = **₹470 lakh**"
  ],
  "short": "20,000 + 12,000 + 15,000 (in thousands of ₹) = ₹4.7 crore.",
  "trap": "Units are in thousands: 1 thousand × ₹100 = ₹1 lakh.",
  "why": [
   "Used the average profit ₹400 on all 120 thousand units",
   null,
   "Left out Plant Z because its value was blank",
   "Used the 2022 column instead of 2021"
  ],
  "calc": "40*500/100+30*400/100+50*300/100",
  "set": "dim-plants"
 },
 {
  "id": "di-missing-16",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "approximate-value",
  "d": "Easy",
  "q": "In 2023, export sales were approximately what percent of total sales? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 56%",
   "≈ 64%",
   "≈ 26%",
   "≈ 36%"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "2023 export = 280 − 180 = 100",
   "100 ÷ 280 × 100 = **≈ 36%**"
  ],
  "short": "100/280 = 5/14 ≈ 0.357.",
  "trap": "Total is the denominator, not domestic sales.",
  "why": [
   "Divided export by domestic sales (100 ÷ 180)",
   "That is the domestic share",
   "Divided by the five-year export total (100 ÷ 390)",
   null
  ],
  "calc": "round(100/280*100)",
  "set": "dim-exports"
 },
 {
  "id": "di-missing-17",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "average",
  "d": "Medium",
  "q": "What was the average annual export sales over the five years (₹ crore)?",
  "opts": [
   "97.5",
   "150",
   "228",
   "78"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "Export column total = 390",
   "390 ÷ 5 = **78**"
  ],
  "short": "The column total is given; no need to fill every blank.",
  "trap": "Blank cells still belong to the average; divide by 5 years.",
  "why": [
   "Divided by 4, because one year’s value was blank",
   "That is the average domestic sales",
   "That is the average total sales",
   null
  ],
  "calc": "390/5",
  "set": "dim-exports"
 },
 {
  "id": "di-missing-18",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "max-min-rank",
  "d": "Medium",
  "q": "In which year was the export share of total sales the lowest?",
  "opts": [
   "2019",
   "2021",
   "2022",
   "2023"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "Missing: Export 2021 = 220 − 150 = 70; 2022 total = 250; Export 2023 = 100",
   "Shares: 33.3%, 35.7%, 31.8%, 34.0%, 35.7% → lowest in **2021**"
  ],
  "short": "Only 2021 has export just under a third (70/220).",
  "trap": "Lowest export value is not the same as lowest export share.",
  "why": [
   "Lowest export value (60), but its share is 33.3%",
   null,
   "Export share is 34.0%, not the lowest",
   "Export share is 35.7%, among the highest"
  ],
  "check": "(()=>{const e=[60,75,70,85,100],t=[180,210,220,250,280],y=[2019,2020,2021,2022,2023];let b=0;for(let i=1;i<5;i++)if(e[i]/t[i]<e[b]/t[b])b=i;return q.opts[q.ans]===String(y[b])})()",
  "set": "dim-exports"
 },
 {
  "id": "di-missing-19",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "years-above-average",
  "d": "Medium",
  "q": "In how many of the five years were domestic sales above the five-year average of domestic sales?",
  "opts": [
   "3",
   "1",
   "2",
   "4"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Domestic average = 750 ÷ 5 = 150",
   "Above 150: 2022 (165) and 2023 (180) → **2 years**; 2021 equals it"
  ],
  "short": "The years are evenly spread around 150; only the last two exceed it.",
  "trap": "“Above” excludes the year that is exactly equal to the average.",
  "why": [
   "Counted 2021, whose domestic sales equal the average",
   "Counted only the highest year",
   null,
   "Counted 2020 and 2021 as above average"
  ],
  "calc": "[120,135,150,165,180].filter(x=>x>150).length",
  "set": "dim-exports"
 },
 {
  "id": "di-missing-20",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did domestic sales grow from 2019 to 2023 (four yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 11%",
   "≈ 12.5%",
   "≈ 50%",
   "≈ 8%"
  ],
  "ans": 0,
  "time": 95,
  "sol": [
   "Domestic 2020 = 210 − 75 = 135 (not needed for CAGR)",
   "Ratio = 180 ÷ 120 = 1.5; 1.5^(1/4) ≈ 1.107, since 1.107⁴ ≈ 1.50 → **≈ 11%**"
  ],
  "short": "√1.5 ≈ 1.225; √1.225 ≈ 1.107.",
  "trap": "Count intervals, not years: 2019 to 2023 is four steps.",
  "why": [
   null,
   "Divided the total growth (50%) by 4, the simple average",
   "Gave the total growth over four years",
   "Used five steps instead of four"
  ],
  "calc": "round((Math.pow(180/120,0.25)-1)*100)",
  "set": "dim-exports"
 },
 {
  "id": "di-missing-21",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "How many thousand candidates applied for Exam Q in 2021?",
  "opts": [
   "78",
   "66",
   "36",
   "42"
  ],
  "ans": 2,
  "time": 40,
  "sol": [
   "Row total 156 = 30 + ? + 42 + 48",
   "? = 156 − 120 = **36**"
  ],
  "short": "156 − 30 − 42 − 48 = 36.",
  "trap": "Subtract all three known years.",
  "why": [
   "Forgot to subtract the 2022 value",
   "Forgot to subtract the 2020 value",
   null,
   "Read the 2022 column"
  ],
  "calc": "156-30-42-48",
  "set": "dim-exams"
 },
 {
  "id": "di-missing-22",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "ratio-of-two-values",
  "d": "Easy",
  "q": "In 2023, what was the ratio of applicants for Exam P to applicants for Exam R?",
  "opts": [
   "2 : 1",
   "5 : 3",
   "1 : 2",
   "8 : 3"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "P 2023 = 230 − 40 − 50 − 60 = 80",
   "80 : 40 = **2 : 1**"
  ],
  "short": "80/40 = 2.",
  "trap": "P’s 2023 value is blank; use the row total.",
  "why": [
   null,
   "Compared P with Q (80 : 48)",
   "Inverted the ratio",
   "Compared P 2023 with R 2022 (80 : 30)"
  ],
  "calc": "80/40",
  "set": "dim-exams"
 },
 {
  "id": "di-missing-23",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "pct-change-growth",
  "d": "Medium",
  "q": "By what percent did the applicants for Exam Q grow from 2021 to 2023? (Round to one decimal place.)",
  "opts": [
   "≈ 25%",
   "≈ 33.3%",
   "≈ 14.3%",
   "≈ 133.3%"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "Q 2021 = 36",
   "(48 − 36) ÷ 36 × 100 = **33.3%**"
  ],
  "short": "12/36 = 1/3.",
  "trap": "The base is 2021, which is the blank cell.",
  "why": [
   "Divided the rise by the 2023 value",
   null,
   "Used the 2022 → 2023 rise (6 ÷ 42)",
   "Gave the ratio 48/36, not the growth"
  ],
  "calc": "round((48-36)/36*100,1)",
  "set": "dim-exams"
 },
 {
  "id": "di-missing-24",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "Exam R's applicants in 2020 were what percent of the total applicants in 2020? (Round to one decimal place.)",
  "opts": [
   "≈ 22.8%",
   "≈ 44.4%",
   "≈ 33.3%",
   "≈ 22.2%"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "R 2020 = 90 − 40 − 30 = 20",
   "20 ÷ 90 × 100 = **22.2%**"
  ],
  "short": "20/90 = 2/9.",
  "trap": "R’s 2020 value is blank; the column total gives it.",
  "why": [
   "Used R’s share of the five-year grand total (114 ÷ 500)",
   "That is Exam P’s share",
   "Assumed the three exams are equal",
   null
  ],
  "calc": "round(20/90*100,1)",
  "set": "dim-exams"
 },
 {
  "id": "di-missing-25",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did the applicants for Exam P grow from 2020 to 2023 (three yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 26%",
   "≈ 33%",
   "≈ 41%",
   "≈ 100%"
  ],
  "ans": 0,
  "time": 95,
  "sol": [
   "P 2023 = 230 − 40 − 50 − 60 = 80",
   "Ratio = 80 ÷ 40 = 2; 2^(1/3) ≈ 1.26 (1.26³ ≈ 2.0) → **≈ 26%**"
  ],
  "short": "Doubling in 3 years is about 26% a year.",
  "trap": "Three steps between 2020 and 2023.",
  "why": [
   null,
   "Divided the total growth (100%) by 3",
   "Used two steps instead of three",
   "Gave the total growth over three years"
  ],
  "calc": "round((Math.pow(80/40,1/3)-1)*100)",
  "set": "dim-exams"
 },
 {
  "id": "di-missing-26",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "average",
  "d": "Easy",
  "q": "What was the average quarterly deposit of the Salt Lake branch (₹ crore)?",
  "opts": [
   "77.3",
   "54.25",
   "58",
   "232"
  ],
  "ans": 2,
  "time": 40,
  "sol": [
   "Salt Lake row total = 232",
   "232 ÷ 4 = **58**"
  ],
  "short": "232 ÷ 4.",
  "trap": "Divide by 4 quarters.",
  "why": [
   "Divided the total by 3 quarters",
   "Used the Aundh branch’s row",
   null,
   "That is the yearly total, not the average"
  ],
  "calc": "232/4",
  "set": "dim-deposits"
 },
 {
  "id": "di-missing-27",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "approximate-value",
  "d": "Medium",
  "q": "Koramangala's Q3 deposit was approximately what percent of the total deposits of all four branches in Q3? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 26%",
   "≈ 24%",
   "≈ 35%",
   "≈ 33%"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "Koramangala Q3 = 350 − 85 − 80 − 95 = 90; Q3 total = 1,075 − 240 − 260 − 300 = 275",
   "90 ÷ 275 × 100 = **≈ 33%**"
  ],
  "short": "90/275 = 18/55 ≈ 0.327.",
  "trap": "Both the numerator and the denominator are blank cells here.",
  "why": [
   "Divided by Koramangala’s own yearly total (90 ÷ 350)",
   "That is Mylapore’s Q3 share (66 ÷ 275)",
   "That is Koramangala’s Q1 share (85 ÷ 240)",
   null
  ],
  "calc": "round(90/275*100)",
  "set": "dim-deposits"
 },
 {
  "id": "di-missing-28",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "max-min-rank",
  "d": "Hard",
  "q": "Which branch showed the highest percentage growth in deposits from Q1 to Q4?",
  "opts": [
   "Mylapore",
   "Aundh",
   "Koramangala",
   "Salt Lake"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Aundh Q1 = 240 − 60 − 85 − 50 = 45; Salt Lake Q4 = 232 − 50 − 58 − 64 = 60",
   "Growth: Mylapore 30%, Koramangala 11.8%, Salt Lake 20%, **Aundh 48.9%**"
  ],
  "short": "Aundh nearly adds half to its Q1 value.",
  "trap": "The largest branch is not the fastest growing one.",
  "why": [
   "Its growth is 30%, second highest",
   null,
   "Highest deposits, but only 11.8% growth",
   "Its growth is 20%"
  ],
  "check": "(()=>{const a={Mylapore:[60,78],Koramangala:[85,95],'Salt Lake':[50,60],Aundh:[45,67]};let b='',bv=-1;for(const k in a){const g=(a[k][1]-a[k][0])/a[k][0];if(g>bv){bv=g;b=k}}return q.opts[q.ans]===b})()",
  "set": "dim-deposits"
 },
 {
  "id": "di-missing-29",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "years-above-average",
  "d": "Hard",
  "q": "For how many of the four branches was the Q3 deposit above that branch's own average quarterly deposit?",
  "opts": [
   "2",
   "3",
   "4",
   "1"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Averages: Mylapore 276/4 = 69, Koramangala 87.5, Salt Lake 58, Aundh 54.25",
   "Q3 vs average: 66 < 69; 90 > 87.5; 64 > 58; 55 > 54.25 → **3 branches**"
  ],
  "short": "Only Mylapore dips in Q3 relative to its average.",
  "trap": "Aundh clears its average by just 0.75.",
  "why": [
   "Left out Aundh (55 vs average 54.25)",
   null,
   "Counted Mylapore, whose Q3 (66) is below its average 69",
   "Counted only Koramangala"
  ],
  "calc": "[[60,72,66,78],[85,80,90,95],[50,58,64,60],[45,50,55,67]].filter(r=>r[2]>r.reduce((a,b)=>a+b)/4).length",
  "set": "dim-deposits"
 },
 {
  "id": "di-missing-30",
  "sec": "di",
  "topic": "di-missing",
  "pattern": "combined",
  "d": "Hard",
  "q": "By how much (₹ crore) do the combined deposits of Mylapore and Aundh in Q2 and Q3 exceed the combined deposits of Salt Lake in Q1 and Q4?",
  "opts": [
   "243",
   "121",
   "11",
   "133"
  ],
  "ans": 3,
  "time": 95,
  "sol": [
   "Mylapore Q2 = 72 (row total); Aundh Q2 + Q3 = 50 + 55; Mylapore Q3 = 66",
   "Mylapore + Aundh = 72 + 66 + 50 + 55 = 243",
   "Salt Lake Q1 + Q4 = 50 + 60 = 110 (Q4 from the row total)",
   "243 − 110 = **133**"
  ],
  "short": "243 − 110.",
  "trap": "Pick the right quarters for each branch.",
  "why": [
   "Did not subtract the Salt Lake figure",
   "Used Salt Lake’s Q2 and Q3 instead of Q1 and Q4",
   "Subtracted Salt Lake’s whole yearly total (232)",
   null
  ],
  "calc": "(72+66+50+55)-(50+60)",
  "set": "dim-deposits"
 }
]);
