// DI bank (part 2): di-caselet. Original questions for Aptitude Hub; every answer computed from the set data.
QB.add([
 {
  "id": "di-caselet-11",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "What was Surat's revenue in 2024?",
  "opts": [
   "₹160 crore",
   "₹180 crore",
   "₹20 crore",
   "₹140 crore"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "2023 shares: one part = 480 ÷ 12 = ₹40 crore, so Coimbatore 200, Surat 160, Ludhiana 120",
   "Surat 2024 = 160 × (1 − 0.125) = **₹140 crore**"
  ],
  "short": "Find the part value (₹40 crore) first; 12.5% is 1/8, so 160 − 20 = 140.",
  "trap": "Stopping at the 2023 split and not applying the change.",
  "why": [
   "That is the 2023 figure; the fall was ignored",
   "Applied a 12.5% rise instead of a fall",
   "That is the size of the fall, not the new revenue",
   null
  ],
  "calc": "480*4/12*(1-0.125)",
  "set": "dic-kaveri"
 },
 {
  "id": "di-caselet-12",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "pct-change-growth",
  "d": "Easy",
  "q": "By what percent did Kaveri Textiles' total revenue change from 2023 to 2024?",
  "opts": [
   "5.88% increase",
   "6.25% increase",
   "10% increase",
   "30% increase"
  ],
  "ans": 1,
  "time": 40,
  "sol": [
   "2024 total = 220 + 140 + 150 = ₹510 crore",
   "Change = (510 − 480) ÷ 480 × 100 = **6.25%**"
  ],
  "short": "Coimbatore +20, Surat −20, Ludhiana +30: net +30 on 480 = 6.25%.",
  "trap": "The base is always the old (2023) total.",
  "why": [
   "Divided the ₹30 crore rise by the 2024 total",
   null,
   "That is only Coimbatore’s growth",
   "Used the rise in ₹ crore as a percent"
  ],
  "calc": "(510-480)/480*100",
  "set": "dic-kaveri"
 },
 {
  "id": "di-caselet-13",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "ratio-of-two-values",
  "d": "Medium",
  "q": "In 2024, what was the ratio of Coimbatore's revenue to Ludhiana's revenue?",
  "opts": [
   "22 : 15",
   "5 : 3",
   "15 : 22",
   "11 : 7"
  ],
  "ans": 0,
  "time": 65,
  "sol": [
   "Coimbatore 2024 = 200 × 1.1 = 220; Ludhiana 2024 = 120 + 30 = 150",
   "220 : 150 = **22 : 15**"
  ],
  "short": "Cancel the common 10 from 220 : 150.",
  "trap": "The 2023 ratio no longer holds after the changes.",
  "why": [
   null,
   "This is the 2023 ratio (200 : 120)",
   "Inverted the ratio",
   "Compared Coimbatore with Surat (220 : 140)"
  ],
  "calc": "220/150",
  "set": "dic-kaveri"
 },
 {
  "id": "di-caselet-14",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "In 2024, Surat contributed what percent of the total revenue of the three plants? (Round to one decimal place.)",
  "opts": [
   "≈ 33.3%",
   "≈ 29.2%",
   "≈ 27.5%",
   "≈ 43.1%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Surat 2024 = 140; total = 510",
   "140 ÷ 510 × 100 = **27.5%**"
  ],
  "short": "140/510 = 14/51 ≈ 27.5%.",
  "trap": "Use the 2024 total as the denominator.",
  "why": [
   "That is Surat’s 2023 share (160 ÷ 480)",
   "Divided by the 2023 total (140 ÷ 480)",
   null,
   "That is Coimbatore’s share"
  ],
  "calc": "round(140/510*100,1)",
  "set": "dic-kaveri"
 },
 {
  "id": "di-caselet-15",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "combined",
  "d": "Hard",
  "q": "By how much did Coimbatore's profit in 2024 exceed the combined profit of Surat and Ludhiana in 2024? (Profit = revenue − expenses.)",
  "opts": [
   "₹52 crore",
   "₹22 crore",
   "₹36 crore",
   "₹110 crore"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Profit = revenue × (1 − expense share): Coimbatore 220 × 0.3 = 66, Surat 140 × 0.1 = 14, Ludhiana 150 × 0.2 = 30",
   "66 − (14 + 30) = **₹22 crore**"
  ],
  "short": "Plant profit margins are 30%, 10%, 20%; then 66 − 44.",
  "trap": "The expense percentage is not the profit percentage.",
  "why": [
   "Compared with Surat’s profit only (66 − 14)",
   null,
   "Compared with Ludhiana’s profit only (66 − 30)",
   "That is the profit of all three plants together"
  ],
  "calc": "66-(14+30)",
  "set": "dic-kaveri"
 },
 {
  "id": "di-caselet-16",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "approximate-value",
  "d": "Easy",
  "q": "The number of patients treated in 2023 was approximately what percent of the number treated in 2021? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 93%",
   "≈ 7%",
   "≈ 125%",
   "≈ 107%"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "2021 = 3,000 × 1.4 = 4,200; 2022 = 4,200 − 600 = 3,600; 2023 = 3,600 × 1.25 = 4,500",
   "4,500 ÷ 4,200 × 100 = **≈ 107%**"
  ],
  "short": "4500/4200 = 15/14 ≈ 1.071.",
  "trap": "“X as a percent of Y” puts Y in the denominator.",
  "why": [
   "Inverted the comparison (2021 as a percent of 2023)",
   "That is the rise over 2021, not the ratio",
   "Used the 2022 → 2023 growth",
   null
  ],
  "calc": "round(4500/4200*100)",
  "set": "dic-sahyadri"
 },
 {
  "id": "di-caselet-17",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "average",
  "d": "Medium",
  "q": "What was the average number of patients treated per year over 2019 to 2023?",
  "opts": [
   "3,825",
   "3,750",
   "4,000",
   "3,860"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "Yearly counts: 4,000; 3,000; 4,200; 3,600; 4,500",
   "Sum = 19,300; average = 19,300 ÷ 5 = **3,860**"
  ],
  "short": "Sum 19,300 over 5 years.",
  "trap": "Do not stop at the year with the given figure; compute all five years first.",
  "why": [
   "Left out 2019 and averaged only four years",
   "Took the midpoint of the highest and lowest years",
   "Used the 2019 level as the average",
   null
  ],
  "calc": "(4000+3000+4200+3600+4500)/5",
  "set": "dic-sahyadri"
 },
 {
  "id": "di-caselet-18",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "max-min-rank",
  "d": "Medium",
  "q": "In which year was the percentage increase in patients over the previous year the largest?",
  "opts": [
   "2020",
   "2021",
   "2022",
   "2023"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "Year-on-year: 2020 −25%, 2021 +40%, 2022 −14.3%, 2023 +25%",
   "Largest rise = **2021**"
  ],
  "short": "Only 2021 and 2023 rose; 40% beats 25%.",
  "trap": "A rise means positive change; ignore the years in which patients fell.",
  "why": [
   "The biggest change, but it was a fall",
   null,
   "Treated 600 fewer patients, a fall",
   "A 25% rise, the second largest"
  ],
  "check": "(()=>{const h=[4000,3000,4200,3600,4500],y=[2019,2020,2021,2022,2023];let b=1;for(let i=2;i<5;i++)if((h[i]-h[i-1])/h[i-1]>(h[b]-h[b-1])/h[b-1])b=i;return q.opts[q.ans]===String(y[b])})()",
  "set": "dic-sahyadri"
 },
 {
  "id": "di-caselet-19",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "years-above-average",
  "d": "Medium",
  "q": "In how many of the five years (2019 to 2023) was the number of patients above the five-year average?",
  "opts": [
   "2",
   "4",
   "3",
   "5"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Average = 3,860",
   "Above 3,860: 4,000; 4,200; 4,500 → **3 years**"
  ],
  "short": "Only 2020 and 2022 sit below 3,860.",
  "trap": "Compare each year with the average, not with 2019.",
  "why": [
   "Counted only the years above 4,000",
   "Counted 2022 (3,600) as above average",
   null,
   "Forgot to compare with the average"
  ],
  "calc": "[4000,3000,4200,3600,4500].filter(x=>x>3860).length",
  "set": "dic-sahyadri"
 },
 {
  "id": "di-caselet-20",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did the yearly number of patients change from 2019 to 2023 (four yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 3%",
   "≈ 12.5%",
   "≈ 6%",
   "≈ 25%"
  ],
  "ans": 0,
  "time": 95,
  "sol": [
   "Ratio = 4,500 ÷ 4,000 = 1.125",
   "1.125^(1/4) ≈ 1.03, since 1.03⁴ ≈ 1.126 → **≈ 3%**"
  ],
  "short": "12.5% total growth over 4 steps is about 3% a year.",
  "trap": "Intermediate dips in 2020 and 2022 do not matter; CAGR uses only the end years.",
  "why": [
   null,
   "Gave the total growth over 4 years without annualising",
   "Divided by 2 instead of using the fourth root",
   "Used the 2022 → 2023 growth"
  ],
  "calc": "round((Math.pow(4500/4000,0.25)-1)*100)",
  "set": "dic-sahyadri"
 },
 {
  "id": "di-caselet-21",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "How much milk (thousand litres) was collected from Kheda in 2022?",
  "opts": [
   "300",
   "330",
   "270",
   "30"
  ],
  "ans": 2,
  "time": 40,
  "sol": [
   "2021: one part = 900 ÷ 9 = 100, so Anand 200, Kheda 300, Mehsana 400",
   "Kheda 2022 = 300 × 0.9 = **270**"
  ],
  "short": "Part value 100; 300 − 10% = 270.",
  "trap": "Stopping at the 2021 split.",
  "why": [
   "That is the 2021 figure; the fall was ignored",
   "Applied a 10% rise instead of a fall",
   null,
   "That is the size of the fall, not the new collection"
  ],
  "calc": "900*3/9*0.9",
  "set": "dic-gokul"
 },
 {
  "id": "di-caselet-22",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "ratio-of-two-values",
  "d": "Easy",
  "q": "In 2022, what was the ratio of Mehsana's collection to Anand's collection?",
  "opts": [
   "5 : 3",
   "2 : 1",
   "3 : 5",
   "4 : 3"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "Mehsana 2022 = 400 × 1.25 = 500; Anand 2022 = 200 × 1.5 = 300",
   "500 : 300 = **5 : 3**"
  ],
  "short": "500/300 = 5/3.",
  "trap": "Use the 2022 figures for both districts.",
  "why": [
   null,
   "That is the 2021 ratio (400 : 200)",
   "Inverted the ratio",
   "Compared the 2021 Mehsana figure with the 2022 Anand figure"
  ],
  "calc": "500/300",
  "set": "dic-gokul"
 },
 {
  "id": "di-caselet-23",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "pct-change-growth",
  "d": "Medium",
  "q": "By what percent did the total collection change from 2021 to 2022? (Round to one decimal place.)",
  "opts": [
   "≈ 15.9%",
   "≈ 18.9%",
   "≈ 21.7%",
   "≈ 25%"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "2022 total = 300 + 270 + 500 = 1,070",
   "(1,070 − 900) ÷ 900 × 100 = **18.9%**"
  ],
  "short": "+100 −30 +100 = +170 on 900.",
  "trap": "Percentages of different bases cannot be averaged.",
  "why": [
   "Divided the rise by the 2022 total",
   null,
   "Averaged the three district percentages (50, −10, 25)",
   "That is Mehsana’s growth alone"
  ],
  "calc": "round((1070-900)/900*100,1)",
  "set": "dic-gokul"
 },
 {
  "id": "di-caselet-24",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "In 2022, Mehsana's collection was what percent of the total collection? (Round to one decimal place.)",
  "opts": [
   "≈ 44.4%",
   "≈ 55.6%",
   "≈ 28.0%",
   "≈ 46.7%"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "Mehsana 2022 = 500; total 2022 = 1,070",
   "500 ÷ 1,070 × 100 = **46.7%**"
  ],
  "short": "500/1070 ≈ 0.467.",
  "trap": "Both figures must be from 2022.",
  "why": [
   "That is Mehsana’s 2021 share (400 ÷ 900)",
   "Divided the 2022 figure by the 2021 total",
   "That is Anand’s share",
   null
  ],
  "calc": "round(500/1070*100,1)",
  "set": "dic-gokul"
 },
 {
  "id": "di-caselet-25",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did the total collection grow from 2021 to 2023 (two yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 20%",
   "≈ 44%",
   "≈ 22%",
   "≈ 19%"
  ],
  "ans": 0,
  "time": 95,
  "sol": [
   "Ratio = 1,296 ÷ 900 = 1.44",
   "√1.44 = 1.2 → **20% a year**"
  ],
  "short": "1.44 is 1.2², so 20%.",
  "trap": "CAGR is the geometric (not simple) yearly rate.",
  "why": [
   null,
   "Gave the total growth over two years",
   "Divided the 44% total growth by 2",
   "Used the 2021 → 2022 growth only"
  ],
  "calc": "round((Math.pow(1296/900,0.5)-1)*100)",
  "set": "dic-gokul"
 },
 {
  "id": "di-caselet-26",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "average",
  "d": "Easy",
  "q": "What was the average monthly revenue of the bakery from January to May?",
  "opts": [
   "₹1,95,833",
   "₹2,22,500",
   "₹2,35,000",
   "₹2,42,500"
  ],
  "ans": 2,
  "time": 40,
  "sol": [
   "In ₹ thousand: Jan 200; Feb 250; Mar 200; Apr 240; May 285",
   "Sum = 1,175; average = 1,175 ÷ 5 = 235 → **₹2,35,000**"
  ],
  "short": "1,175 ÷ 5 = 235 (in thousands).",
  "trap": "Five months, so divide by 5.",
  "why": [
   "Divided the five-month total by 6",
   "Left out May from the average",
   null,
   "Took the midpoint of the highest and lowest months"
  ],
  "calc": "(200+250+200+240+285)/5*1000",
  "set": "dic-bakery"
 },
 {
  "id": "di-caselet-27",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "approximate-value",
  "d": "Medium",
  "q": "March's revenue was approximately what percent of the total revenue of the five months? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 20%",
   "≈ 21%",
   "≈ 24%",
   "≈ 17%"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "March = 200; five-month total = 1,175 (in thousands)",
   "200 ÷ 1,175 × 100 = **≈ 17%**"
  ],
  "short": "200/1175 ≈ 0.17.",
  "trap": "Compute each month first; the percentages in the passage are month-to-month, not shares of the total.",
  "why": [
   "Assumed all five months contribute equally",
   "That is February’s share",
   "That is May’s share",
   null
  ],
  "calc": "round(200/1175*100)",
  "set": "dic-bakery"
 },
 {
  "id": "di-caselet-28",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "max-min-rank",
  "d": "Hard",
  "q": "Among the months in which revenue rose over the previous month, in which month was the percentage rise the smallest?",
  "opts": [
   "February",
   "May",
   "March",
   "April"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Rises: Feb +50 on 200 = 25%; Apr +40 on 200 = 20%; May +45 on 240 = 18.75%",
   "Smallest percentage rise = **May**"
  ],
  "short": "Compare 50/200, 40/200 and 45/240.",
  "trap": "The smallest rupee rise (April) is not the smallest percentage rise because the bases differ.",
  "why": [
   "Its 25% rise is the largest percentage rise",
   null,
   "Revenue fell in March, so it is not a rise month",
   "Its rise (₹40,000) is the smallest in rupees, but 20% is not the smallest percent"
  ],
  "check": "(()=>{const m=[200,250,200,240,285],n=['January','February','March','April','May'];let b=-1,bv=1e9;for(let i=1;i<5;i++){const g=(m[i]-m[i-1])/m[i-1];if(g>0&&g<bv){bv=g;b=i}}return q.opts[q.ans]===n[b]})()",
  "set": "dic-bakery"
 },
 {
  "id": "di-caselet-29",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "years-above-average",
  "d": "Hard",
  "q": "In how many of the five months was revenue above the five-month average?",
  "opts": [
   "2",
   "3",
   "4",
   "1"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Average = 1,175 ÷ 5 = 235 (in thousands)",
   "Above 235: February 250, April 240, May 285 → **3 months**"
  ],
  "short": "Only January and March fall below 235.",
  "trap": "April (240) is just above the average and is easy to miss.",
  "why": [
   "Missed April (240), which is just above the average of 235",
   null,
   "Counted March (₹2,00,000) as above average",
   "Counted only the best month"
  ],
  "calc": "[200,250,200,240,285].filter(x=>x>235).length",
  "set": "dic-bakery"
 },
 {
  "id": "di-caselet-30",
  "sec": "di",
  "topic": "di-caselet",
  "pattern": "combined",
  "d": "Hard",
  "q": "What was the total profit (revenue − costs) of the bakery over the five months?",
  "opts": [
   "₹4,70,000",
   "₹3,52,500",
   "₹7,57,500",
   "₹4,17,500"
  ],
  "ans": 3,
  "time": 95,
  "sol": [
   "Jan–Mar revenue = 200 + 250 + 200 = 650; profit at 40% = 260",
   "Apr–May revenue = 240 + 285 = 525; profit at 30% = 157.5",
   "Total = 417.5 thousand = **₹4,17,500**"
  ],
  "short": "0.4 × 650 + 0.3 × 525.",
  "trap": "Costs 60% means profit 40%; costs 70% means profit 30%.",
  "why": [
   "Used a 40% profit rate for all five months",
   "Used a 30% profit rate for all five months",
   "That is the total cost, not the profit",
   null
  ],
  "calc": "(0.4*(200+250+200)+0.3*(240+285))*1000",
  "set": "dic-bakery"
 }
]);
