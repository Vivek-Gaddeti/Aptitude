// DI bank: di-tricks, second batch. Original questions written for Aptitude Hub.
QB.add([
 {
  "id": "di-tricks-11",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fraction-pct-table",
  "d": "Easy",
  "q": "Express **7/8** as a percentage.",
  "opts": [
   "85.7%",
   "87.5%",
   "78.5%",
   "75%"
  ],
  "ans": 1,
  "time": 35,
  "sol": [
   "1/8 = 12.5%",
   "7 × 12.5% = **87.5%**"
  ],
  "short": "1/8 = 12.5%, so 7/8 = 100% − 12.5%.",
  "trap": "Mixing up 7/8 with 6/7.",
  "why": [
   "That is 6/7",
   null,
   "Slipped the digits of 87.5",
   "That is 3/4"
  ],
  "calc": "7/8*100"
 },
 {
  "id": "di-tricks-12",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fraction-pct-table",
  "d": "Medium",
  "q": "Using 1/11 = 9.09%, find 3/11 of 2,640.",
  "opts": [
   "240",
   "720",
   "792",
   "660"
  ],
  "ans": 1,
  "time": 55,
  "sol": [
   "2,640 ÷ 11 = 240",
   "240 × 3 = **720**"
  ],
  "short": "Divide by the denominator first, then multiply by the numerator.",
  "trap": "Stopping after 1/11.",
  "why": [
   "That is 1/11 of 2,640",
   null,
   "Used 3/10 of 2,640",
   "Used 1/4 of 2,640"
  ],
  "calc": "2640*3/11"
 },
 {
  "id": "di-tricks-13",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fraction-pct-table",
  "d": "Hard",
  "q": "After a discount of 12.5% a bag costs ₹4,900. What was its marked price?",
  "opts": [
   "₹5,512.50",
   "₹5,512",
   "₹4,287.50",
   "₹5,600"
  ],
  "ans": 3,
  "time": 80,
  "sol": [
   "12.5% = 1/8, so sale price = 7/8 of marked",
   "4,900 ÷ 7 = 700; 700 × 8 = **₹5,600**"
  ],
  "short": "Sale = 7/8 of marked: divide by 7, multiply by 8.",
  "trap": "The 12.5% is of the marked price, not of ₹4,900.",
  "why": [
   "Added 12.5% to the sale price",
   "Added 12.5% of 4,900 and rounded",
   "Subtracted 12.5% from the sale price",
   null
  ],
  "calc": "4900/7*8"
 },
 {
  "id": "di-tricks-14",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "approximation",
  "d": "Easy",
  "q": "Approximate to the nearest 10: **19.8%** of 2,505 + **10.1%** of 1,990.",
  "opts": [
   "≈ 700",
   "≈ 600",
   "≈ 800",
   "≈ 900"
  ],
  "ans": 0,
  "time": 50,
  "sol": [
   "≈ 20% of 2,500 = 500",
   "≈ 10% of 2,000 = 200",
   "Sum ≈ **700** (exact 697)"
  ],
  "short": "Snap to 20% of 2,500 and 10% of 2,000.",
  "trap": "Computing the exact decimals wastes time.",
  "why": [
   null,
   "Used 10% of 1,500 for the first term",
   "Rounded 19.8% up to 25%",
   "Added the two bases as percentages"
  ],
  "calc": "Math.round((0.198*2505+0.101*1990)/10)*10"
 },
 {
  "id": "di-tricks-15",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "approximation",
  "d": "Medium",
  "q": "Approximately, 4,999 ÷ 24.8 = ?",
  "opts": [
   "≈ 250",
   "≈ 125",
   "≈ 200",
   "≈ 400"
  ],
  "ans": 2,
  "time": 60,
  "sol": [
   "4,999 ≈ 5,000 and 24.8 ≈ 25",
   "5,000 ÷ 25 = **200** (exact 201.6)"
  ],
  "short": "Divide by 25 = multiply by 4, then ÷ 100.",
  "trap": "Dividing by 24.8 long-hand.",
  "why": [
   "Divided by 20",
   "Divided by 40",
   null,
   "Divided by 12.5"
  ],
  "calc": "Math.round(4999/24.8/10)*10"
 },
 {
  "id": "di-tricks-16",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "approximation",
  "d": "Hard",
  "q": "Approximately, (7.98 × 49.9) ÷ 3.97 = ?",
  "opts": [
   "≈ 150",
   "≈ 80",
   "≈ 200",
   "≈ 100"
  ],
  "ans": 3,
  "time": 85,
  "sol": [
   "≈ (8 × 50) ÷ 4",
   "= 400 ÷ 4 = **100** (exact 100.3)"
  ],
  "short": "Round each to 8, 50 and 4.",
  "trap": "Over-rounding one number by too much.",
  "why": [
   "Rounded 3.97 down to 2.7",
   "Rounded 49.9 down to 40",
   "Divided by 2 instead of 4",
   null
  ],
  "calc": "Math.round(7.98*49.9/3.97/10)*10"
 },
 {
  "id": "di-tricks-17",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "pct-change-at-a-glance",
  "d": "Easy",
  "q": "A bar rises from 250 to 300. What is the percentage increase?",
  "opts": [
   "16.7%",
   "20%",
   "50%",
   "25%"
  ],
  "ans": 1,
  "time": 35,
  "sol": [
   "Rise = 50",
   "50 ÷ 250 = 1/5 = **20%**"
  ],
  "short": "Rise ÷ OLD value: 50 ÷ 250 = 1/5.",
  "trap": "Dividing by the new value.",
  "why": [
   "Divided the rise by the new value (50 ÷ 300)",
   null,
   "Took the rise itself as a percent",
   "Used 300 ÷ 250 − 1 wrongly as 1/4"
  ],
  "calc": "(300-250)/250*100"
 },
 {
  "id": "di-tricks-18",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "pct-change-at-a-glance",
  "d": "Medium",
  "q": "A town's population falls from 8,00,000 to 6,80,000. What is the percentage decrease?",
  "opts": [
   "17.6%",
   "12%",
   "15%",
   "20%"
  ],
  "ans": 2,
  "time": 55,
  "sol": [
   "Fall = 1,20,000",
   "1,20,000 ÷ 8,00,000 = 3/20 = **15%**"
  ],
  "short": "Fall of 120 on 800: 120/800 = 15%.",
  "trap": "The base is the old value.",
  "why": [
   "Divided the fall by the new population",
   "Used 80,000 as the fall",
   null,
   "Used 1,60,000 as the fall"
  ],
  "calc": "(800000-680000)/800000*100"
 },
 {
  "id": "di-tricks-19",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "pct-change-at-a-glance",
  "d": "Medium",
  "q": "Sales rise 40% in one year and then fall 25% the next. What is the net change over the two years?",
  "opts": [
   "+5%",
   "+15%",
   "0%",
   "−5%"
  ],
  "ans": 0,
  "time": 60,
  "sol": [
   "1.4 × 0.75 = 1.05",
   "Net = **+5%**"
  ],
  "short": "Multiply the factors: 1.4 × 0.75.",
  "trap": "Percentages on different bases cannot be added.",
  "why": [
   null,
   "Added 40 and subtracted 25",
   "Assumed the changes cancel",
   "Mistook the order for a loss"
  ],
  "calc": "(1.4*0.75-1)*100"
 },
 {
  "id": "di-tricks-20",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "ratio-comparison-without-full-division",
  "d": "Easy",
  "q": "Without dividing, which is larger: **5/9** or **6/11**?",
  "opts": [
   "5/9",
   "6/11",
   "They are equal",
   "Cannot be determined"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "Cross-multiply: 5 × 11 = 55; 6 × 9 = 54",
   "55 > 54, so **5/9** is larger"
  ],
  "short": "a/b > c/d if a×d > c×b.",
  "trap": "Trusting the larger numerator.",
  "why": [
   null,
   "Judged by the larger numerator",
   "Rounded both to 0.55",
   "Did not cross-multiply"
  ],
  "check": "(5*11>6*9)&&q.opts[q.ans]==='5/9'"
 },
 {
  "id": "di-tricks-21",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "ratio-comparison-without-full-division",
  "d": "Medium",
  "q": "Company A earned a profit of ₹36 lakh on sales of ₹480 lakh; company B earned ₹45 lakh on ₹540 lakh. Which has the higher profit margin?",
  "opts": [
   "A",
   "Both are equal",
   "B",
   "Cannot be said"
  ],
  "ans": 2,
  "time": 70,
  "sol": [
   "A: 36 ÷ 480 = 3/40 = 7.5%",
   "B: 45 ÷ 540 = 1/12 ≈ 8.3%",
   "B is higher"
  ],
  "short": "Cross-multiply: 45 × 480 = 21,600 vs 36 × 540 = 19,440.",
  "trap": "Bigger profit does not mean bigger margin.",
  "why": [
   "Went by the lower sales",
   "Rounded both to about 8%",
   null,
   "Did not compare the ratios"
  ],
  "check": "(45*480>36*540)&&q.opts[q.ans]==='B'"
 },
 {
  "id": "di-tricks-22",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "ratio-comparison-without-full-division",
  "d": "Hard",
  "q": "Which of these fractions is the largest: 13/25, 17/33, 21/41, 9/17?",
  "opts": [
   "13/25",
   "9/17",
   "17/33",
   "21/41"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Compare each with 1/2: excess = (2a − b) ÷ 2b",
   "13/25: 1/50 = 0.020; 17/33: 1/66 = 0.015; 21/41: 1/82 = 0.012; 9/17: 1/34 = 0.029",
   "Largest excess: **9/17**"
  ],
  "short": "Measure how far each is above 1/2.",
  "trap": "Bigger numerators and denominators do not mean a bigger fraction.",
  "why": [
   "This is 0.52, not the largest",
   null,
   "Judged by the larger numerator",
   "Judged by the largest numbers"
  ],
  "check": "(()=>{const f=[[13,25],[17,33],[21,41],[9,17]];const v=f.map(([a,b])=>a/b);const m=Math.max(...v);return q.opts[q.ans]===f[v.indexOf(m)].join('/')&&v.filter(x=>x===m).length===1})()"
 },
 {
  "id": "di-tricks-23",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "cagr-roughly",
  "d": "Easy",
  "q": "A fund of ₹1,00,000 grows to ₹1,21,000 in 2 years at a steady yearly rate. What is the rate?",
  "opts": [
   "21%",
   "11%",
   "5%",
   "10%"
  ],
  "ans": 3,
  "time": 50,
  "sol": [
   "(1 + r)² = 1.21",
   "1.1² = 1.21, so r = **10%**"
  ],
  "short": "1.21 = 1.1²: two steps of 10%.",
  "trap": "Total growth is not the yearly rate.",
  "why": [
   "Took the whole growth as the yearly rate",
   "Took 21% ÷ 2 and rounded up",
   "Halved the 10%",
   null
  ],
  "calc": "(Math.sqrt(1.21)-1)*100"
 },
 {
  "id": "di-tricks-24",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "cagr-roughly",
  "d": "Medium",
  "q": "Using the rule of 72, roughly what yearly growth rate doubles the users of an app in 6 years?",
  "opts": [
   "≈ 6%",
   "≈ 17%",
   "≈ 12%",
   "≈ 8%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Years to double ≈ 72 ÷ rate",
   "Rate ≈ 72 ÷ 6 = **12%** (exact 12.25%)"
  ],
  "short": "Rate ≈ 72 ÷ years to double.",
  "trap": "Dividing 100 by the years.",
  "why": [
   "Divided by 12 instead of 6",
   "Divided 100 by 6",
   null,
   "Divided 48 by 6"
  ],
  "calc": "72/6"
 },
 {
  "id": "di-tricks-25",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Sales grew from ₹25 lakh to ₹43.2 lakh over 3 years. What is the yearly compound growth rate?",
  "opts": [
   "20%",
   "72.8%",
   "24.3%",
   "15%"
  ],
  "ans": 0,
  "time": 90,
  "sol": [
   "43.2 ÷ 25 = 1.728",
   "1.2³ = 1.728, so r = **20%**"
  ],
  "short": "1.728 = 1.2³: recognise the cube.",
  "trap": "Dividing total growth by the number of years.",
  "why": [
   null,
   "The total 3-year growth",
   "Divided the 72.8% by 3",
   "Estimated from the average of 10% and 20%"
  ],
  "calc": "(Math.pow(43.2/25,1/3)-1)*100"
 },
 {
  "id": "di-tricks-26",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "averages-from-a-chart",
  "d": "Medium",
  "q": "A bar chart shows weekly sales of **205, 212, 198, 207, 203, 215, 209** units over seven weeks. What is the average?",
  "opts": [
   "209",
   "205",
   "211",
   "207"
  ],
  "ans": 3,
  "time": 70,
  "sol": [
   "Take 205 as the base: deviations 0, +7, −7, +2, −2, +10, +4",
   "Sum of deviations = +14; 14 ÷ 7 = +2",
   "Average = 205 + 2 = **207**"
  ],
  "short": "Guess a base, average the deviations.",
  "trap": "Adding seven 3-digit numbers invites mistakes.",
  "why": [
   "Took the last bar",
   "Took the first bar",
   "Misadded the deviations",
   null
  ],
  "calc": "(205+212+198+207+203+215+209)/7"
 },
 {
  "id": "di-tricks-27",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "averages-from-a-chart",
  "d": "Hard",
  "q": "A line chart shows a bus travelling at 40 km/h for 3 hours and then at 60 km/h for 2 hours. What is its average speed for the whole trip?",
  "opts": [
   "50 km/h",
   "48 km/h",
   "52 km/h",
   "46 km/h"
  ],
  "ans": 1,
  "time": 90,
  "sol": [
   "Distance = 40 × 3 + 60 × 2 = 240 km",
   "Time = 5 h",
   "Average = 240 ÷ 5 = **48 km/h**"
  ],
  "short": "Total distance over total time, not the mean of speeds.",
  "trap": "Ignoring how long each speed lasted.",
  "why": [
   "Took the plain average of 40 and 60",
   null,
   "Weighted by the wrong durations (2 h and 3 h)",
   "Used the harmonic mean of the speeds"
  ],
  "calc": "(40*3+60*2)/5"
 },
 {
  "id": "di-tricks-28",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fast-multiplication",
  "d": "Easy",
  "q": "Find **25 × 48**.",
  "opts": [
   "1,100",
   "1,250",
   "1,200",
   "960"
  ],
  "ans": 2,
  "time": 35,
  "sol": [
   "25 = 100 ÷ 4",
   "48 ÷ 4 = 12, then × 100 = **1,200**"
  ],
  "short": "× 25 = ÷ 4 then × 100.",
  "trap": "Long multiplication slips.",
  "why": [
   "Slip in 25 × 44",
   "Used 25 × 50",
   null,
   "Used 20 × 48"
  ],
  "calc": "25*48"
 },
 {
  "id": "di-tricks-29",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fast-multiplication",
  "d": "Medium",
  "q": "Find **85²**.",
  "opts": [
   "7,225",
   "7,025",
   "6,825",
   "7,525"
  ],
  "ans": 0,
  "time": 45,
  "sol": [
   "Number ending in 5: n × (n + 1) with n = 8 gives 8 × 9 = 72",
   "Append 25: **7,225**"
  ],
  "short": "For (n5)²: n(n + 1) then 25.",
  "trap": "Forgetting to use n + 1.",
  "why": [
   null,
   "Wrote 25 after 70 instead of 72",
   "Computed 85 × 80 plus an error",
   "Used 8 × 10 for the front part"
  ],
  "calc": "85*85"
 },
 {
  "id": "di-tricks-30",
  "sec": "di",
  "topic": "di-tricks",
  "pattern": "fast-multiplication",
  "d": "Hard",
  "q": "Find **996 × 1,004**.",
  "opts": [
   "10,00,016",
   "9,99,996",
   "9,96,004",
   "9,99,984"
  ],
  "ans": 3,
  "time": 60,
  "sol": [
   "(1,000 − 4)(1,000 + 4) = 1,000² − 4²",
   "= 10,00,000 − 16 = **9,99,984**"
  ],
  "short": "(a − b)(a + b) = a² − b².",
  "trap": "Treating the difference of squares as a sum.",
  "why": [
   "Added 16 instead of subtracting",
   "Subtracted 4 only",
   "Multiplied 996 × 1,000 plus 4",
   null
  ],
  "calc": "996*1004"
 }
]);
