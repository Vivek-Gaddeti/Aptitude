// DI bank (part 2): di-radar. Original questions for Aptitude Hub; every answer computed from the set data.
QB.add([
 {
  "id": "di-radar-11",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "What was Gaya's production of maize (lakh tonnes)?",
  "opts": [
   "40",
   "50",
   "100",
   "30"
  ],
  "ans": 1,
  "time": 40,
  "sol": [
   "Find the Maize spoke and read the Gaya polygon: **50**"
  ],
  "short": "Right spoke, right polygon.",
  "trap": "Mixing the two polygons.",
  "why": [
   "That is Nalanda’s maize production",
   null,
   "Read Gaya’s rice spoke",
   "Read Gaya’s bajra spoke"
  ],
  "calc": "50",
  "set": "dir-crops"
 },
 {
  "id": "di-radar-12",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "pct-change-growth",
  "d": "Easy",
  "q": "Nalanda's wheat production is what percent higher than Gaya's wheat production? (Round to one decimal place.)",
  "opts": [
   "≈ 25%",
   "≈ 15%",
   "≈ 133.3%",
   "≈ 33.3%"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "Nalanda 60, Gaya 45",
   "(60 − 45) ÷ 45 × 100 = **33.3%**"
  ],
  "short": "15/45 = 1/3.",
  "trap": "“Higher than Gaya” makes Gaya the base.",
  "why": [
   "Divided the gap by Nalanda’s figure instead of Gaya’s",
   "Gave the gap in lakh tonnes as a percent",
   "Gave the ratio 60/45, not the excess",
   null
  ],
  "calc": "round(15/45*100,1)",
  "set": "dir-crops"
 },
 {
  "id": "di-radar-13",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "ratio-of-two-values",
  "d": "Medium",
  "q": "What is the ratio of Gaya's rice production to Nalanda's pulses production?",
  "opts": [
   "10 : 7",
   "7 : 10",
   "5 : 4",
   "5 : 3"
  ],
  "ans": 0,
  "time": 65,
  "sol": [
   "Gaya rice 100, Nalanda pulses 70",
   "100 : 70 = **10 : 7**"
  ],
  "short": "Cancel the common 10.",
  "trap": "The two values come from different polygons.",
  "why": [
   null,
   "Inverted the ratio",
   "Compared the two districts’ rice (100 : 80)",
   "Used Gaya’s pulses (60) instead of Nalanda’s (70)"
  ],
  "calc": "100/70",
  "set": "dir-crops"
 },
 {
  "id": "di-radar-14",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "Rice made up what percent of Gaya's total production of the six crops? (Round to one decimal place.)",
  "opts": [
   "≈ 33.3%",
   "≈ 25.8%",
   "≈ 32.3%",
   "≈ 22.6%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Gaya total = 45 + 100 + 50 + 30 + 25 + 60 = 310",
   "100 ÷ 310 × 100 = **32.3%**"
  ],
  "short": "100/310 ≈ 0.323.",
  "trap": "Use Gaya’s own total as the denominator.",
  "why": [
   "Divided by 300, Nalanda’s total",
   "Used Nalanda’s rice (80 ÷ 310)",
   null,
   "Used Nalanda’s pulses (70 ÷ 310)"
  ],
  "calc": "round(100/310*100,1)",
  "set": "dir-crops"
 },
 {
  "id": "di-radar-15",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "combined",
  "d": "Hard",
  "q": "Consider only the crops on which Gaya produces more than Nalanda. Gaya's production of these crops exceeds Nalanda's production of the same crops by what percent of Nalanda's? (Round to one decimal place.)",
  "opts": [
   "≈ 22.2%",
   "≈ 13.3%",
   "≈ 28.6%",
   "≈ 3.3%"
  ],
  "ans": 2,
  "time": 95,
  "sol": [
   "Gaya > Nalanda: Rice (100 vs 80), Maize (50 vs 40), Bajra (30 vs 20)",
   "Gaya = 180, Nalanda = 140; (180 − 140) ÷ 140 × 100 = **28.6%**"
  ],
  "short": "180 vs 140 → 40/140 = 2/7.",
  "trap": "Filter the crops first; the base is Nalanda’s total for those crops only.",
  "why": [
   "Divided the excess by Gaya’s total for these crops",
   "Divided the excess by Nalanda’s all-crop total (40 ÷ 300)",
   null,
   "Compared the two district totals (10 ÷ 300)"
  ],
  "calc": "round((180-140)/140*100,1)",
  "set": "dir-crops"
 },
 {
  "id": "di-radar-16",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "approximate-value",
  "d": "Easy",
  "q": "Lakshmi Retail's revenue in 2020 was approximately what percent of Sundaram Retail's revenue in 2020? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 92%",
   "≈ 109%",
   "≈ 8%",
   "≈ 83%"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "2020: Lakshmi 110, Sundaram 120",
   "110 ÷ 120 × 100 = **≈ 92%**"
  ],
  "short": "11/12 ≈ 0.917.",
  "trap": "“A as a percent of B” has B in the denominator.",
  "why": [
   null,
   "Inverted: Sundaram as a percent of Lakshmi",
   "That is the shortfall, not the percentage",
   "Used Sundaram’s 2019 value (100) instead of Lakshmi’s 2020 value"
  ],
  "calc": "round(110/120*100)",
  "set": "dir-retail"
 },
 {
  "id": "di-radar-17",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "average",
  "d": "Medium",
  "q": "What was Sundaram Retail's average annual revenue over 2018 to 2023 (₹ crore)?",
  "opts": [
   "137.5",
   "120",
   "150",
   "115"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "Sundaram: 90 + 100 + 120 + 100 + 130 + 150 = 690",
   "690 ÷ 6 = **115**"
  ],
  "short": "Six years, so divide 690 by 6.",
  "trap": "Count all six spokes.",
  "why": [
   "Used Lakshmi Retail’s average",
   "Left out 2018 and divided the other five years by 5",
   "Used the highest year",
   null
  ],
  "calc": "(90+100+120+100+130+150)/6",
  "set": "dir-retail"
 },
 {
  "id": "di-radar-18",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "max-min-rank",
  "d": "Medium",
  "q": "In which year was the revenue gap between the two chains the largest?",
  "opts": [
   "2020",
   "2021",
   "2022",
   "2023"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "Gaps: 10, 20, 10, 50, 35, 30",
   "Largest = **2021**"
  ],
  "short": "Where the two polygons are furthest apart.",
  "trap": "Gap is not the same as the highest value.",
  "why": [
   "The only year Sundaram led, with a gap of just 10",
   null,
   "Gap of 35, second largest",
   "Highest revenue for both, but the gap is 30"
  ],
  "check": "(()=>{const l=[100,120,110,150,165,180],s=[90,100,120,100,130,150],y=[2018,2019,2020,2021,2022,2023];let b=0;for(let i=1;i<6;i++)if(Math.abs(l[i]-s[i])>Math.abs(l[b]-s[b]))b=i;return q.opts[q.ans]===String(y[b])})()",
  "set": "dir-retail"
 },
 {
  "id": "di-radar-19",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "years-above-average",
  "d": "Medium",
  "q": "In how many years was each chain's revenue above its own 2018–2023 average at the same time?",
  "opts": [
   "2",
   "3",
   "4",
   "1"
  ],
  "ans": 0,
  "time": 65,
  "sol": [
   "Lakshmi average = 825 ÷ 6 = 137.5 → above in 2021, 2022, 2023",
   "Sundaram average = 115 → above in 2020, 2022, 2023",
   "Both above: 2022 and 2023 → **2 years**"
  ],
  "short": "Intersect the two lists of years.",
  "trap": "“Both” means the intersection, not the union.",
  "why": [
   null,
   "Counted only Lakshmi’s above-average years",
   "Counted years in which at least one chain was above its average",
   "Counted only the final year"
  ],
  "calc": "[0,1,2,3,4,5].filter(i=>[100,120,110,150,165,180][i]>825/6&&[90,100,120,100,130,150][i]>690/6).length",
  "set": "dir-retail"
 },
 {
  "id": "di-radar-20",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did Lakshmi Retail's revenue grow from 2018 to 2023 (five yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 16%",
   "≈ 10%",
   "≈ 12%",
   "≈ 80%"
  ],
  "ans": 2,
  "time": 95,
  "sol": [
   "Ratio = 180 ÷ 100 = 1.8",
   "1.8^(1/5): 1.12⁵ ≈ 1.76, 1.13⁵ ≈ 1.84 → **≈ 12%**"
  ],
  "short": "1.12⁵ ≈ 1.76, a bit under 1.8, so just above 12%.",
  "trap": "2018 to 2023 is five steps, not six.",
  "why": [
   "Divided the total growth (80%) by 5",
   "Used six steps instead of five",
   null,
   "Gave the total growth over five years"
  ],
  "calc": "round((Math.pow(180/100,0.2)-1)*100)",
  "set": "dir-retail"
 },
 {
  "id": "di-radar-21",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "How many lakh active users did the Kisan App have in 2022?",
  "opts": [
   "50",
   "64",
   "80",
   "72"
  ],
  "ans": 1,
  "time": 40,
  "sol": [
   "Find the 2022 spoke and read the Kisan App polygon: **64**"
  ],
  "short": "Right spoke, right polygon.",
  "trap": "Neighbouring spokes are easy to confuse.",
  "why": [
   "That is the 2021 value",
   null,
   "That is the 2023 value",
   "Read BharatPay’s 2021 value"
  ],
  "calc": "64",
  "set": "dir-apps"
 },
 {
  "id": "di-radar-22",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "ratio-of-two-values",
  "d": "Easy",
  "q": "In 2023, what was the ratio of BharatPay's users to the Kisan App's users?",
  "opts": [
   "20 : 21",
   "4 : 5",
   "9 : 10",
   "21 : 20"
  ],
  "ans": 3,
  "time": 40,
  "sol": [
   "2023: BharatPay 84, Kisan 80",
   "84 : 80 = **21 : 20**"
  ],
  "short": "Divide both by 4.",
  "trap": "Order follows the question: BharatPay first.",
  "why": [
   "Inverted the ratio",
   "Used Kisan’s 2023 and 2024 values (80 : 100)",
   "Used the 2024 values (90 : 100)",
   null
  ],
  "calc": "84/80",
  "set": "dir-apps"
 },
 {
  "id": "di-radar-23",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "pct-change-growth",
  "d": "Medium",
  "q": "By what percent did the Kisan App's users grow from 2022 to 2024?",
  "opts": [
   "36%",
   "156.25%",
   "25%",
   "56.25%"
  ],
  "ans": 3,
  "time": 65,
  "sol": [
   "2022 = 64, 2024 = 100",
   "(100 − 64) ÷ 64 × 100 = **56.25%**"
  ],
  "short": "36/64 = 9/16.",
  "trap": "The base is the earlier year, 2022.",
  "why": [
   "Divided the rise by the 2024 value",
   "Gave the ratio 100/64, not the growth",
   "Used 2023 → 2024 (20 ÷ 80)",
   null
  ],
  "calc": "(100-64)/64*100",
  "set": "dir-apps"
 },
 {
  "id": "di-radar-24",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "In 2024, the Kisan App had what percent of the combined users of the two apps? (Round to one decimal place.)",
  "opts": [
   "≈ 47.4%",
   "≈ 52.6%",
   "≈ 111.1%",
   "≈ 55.6%"
  ],
  "ans": 1,
  "time": 65,
  "sol": [
   "2024: Kisan 100, BharatPay 90; combined 190",
   "100 ÷ 190 × 100 = **52.6%**"
  ],
  "short": "100/190 = 10/19.",
  "trap": "The denominator is the combined total of both apps.",
  "why": [
   "That is BharatPay’s share",
   null,
   "Divided by BharatPay alone (100 ÷ 90)",
   "Mixed years: 100 ÷ (100 + 80)"
  ],
  "calc": "round(100/190*100,1)",
  "set": "dir-apps"
 },
 {
  "id": "di-radar-25",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Roughly, at what compound annual growth rate did the Kisan App's users grow from 2019 to 2024 (five yearly steps)? Round to the nearest whole percent.",
  "opts": [
   "≈ 33%",
   "≈ 43%",
   "≈ 26%",
   "≈ 213%"
  ],
  "ans": 2,
  "time": 95,
  "sol": [
   "Ratio = 100 ÷ 32 = 3.125",
   "1.25⁵ ≈ 3.05 and 1.26⁵ ≈ 3.18 → **≈ 26%**"
  ],
  "short": "3.125 lies between 1.25⁵ and 1.26⁵.",
  "trap": "Count intervals: 2019 to 2024 is five steps.",
  "why": [
   "Used four steps instead of five",
   "Divided the total growth (212.5%) by 5",
   null,
   "Gave the total growth over five years"
  ],
  "calc": "round((Math.pow(100/32,0.2)-1)*100)",
  "set": "dir-apps"
 },
 {
  "id": "di-radar-26",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "average",
  "d": "Easy",
  "q": "What is Bhavna's average mark across the six subjects?",
  "opts": [
   "75",
   "70",
   "71.7",
   "90"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "60 + 80 + 75 + 90 + 70 + 75 = 450",
   "450 ÷ 6 = **75**"
  ],
  "short": "450 ÷ 6.",
  "trap": "Read Bhavna’s polygon, not the others.",
  "why": [
   null,
   "That is Arjun’s average",
   "That is Chirag’s average",
   "Used her highest mark"
  ],
  "calc": "(60+80+75+90+70+75)/6",
  "set": "dir-marks"
 },
 {
  "id": "di-radar-27",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "approximate-value",
  "d": "Medium",
  "q": "Chirag's Economics mark was approximately what percent of the sum of the three students' Economics marks? (Round to the nearest whole percent.)",
  "opts": [
   "≈ 33%",
   "≈ 29%",
   "≈ 38%",
   "≈ 20%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Economics: 65 + 75 + 85 = 225",
   "85 ÷ 225 × 100 = **≈ 38%**"
  ],
  "short": "85/225 = 17/45 ≈ 0.378.",
  "trap": "The denominator is the three-student Economics total.",
  "why": [
   "Assumed the three students score equally",
   "That is Arjun’s share (65 ÷ 225)",
   null,
   "Divided by Chirag’s own six-subject total (85 ÷ 420)"
  ],
  "calc": "round(85/225*100)",
  "set": "dir-marks"
 },
 {
  "id": "di-radar-28",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "max-min-rank",
  "d": "Hard",
  "q": "In which subject is the gap between the highest and the lowest of the three students' marks the largest?",
  "opts": [
   "English",
   "Comp. Sc.",
   "Maths",
   "Chemistry"
  ],
  "ans": 0,
  "time": 95,
  "sol": [
   "Gaps (max − min): Maths 25, Physics 20, Chemistry 20, English 40, Comp. Sc. 35, Economics 20",
   "Largest = **English**"
  ],
  "short": "English spans from 50 to 90.",
  "trap": "Look at the spread of all three polygons on a spoke, not at the highest mark.",
  "why": [
   null,
   "Gap of 35, second largest",
   "Gap of 25",
   "Gap of 20"
  ],
  "check": "(()=>{const a=[85,70,60,50,90,65],b=[60,80,75,90,70,75],c=[70,60,80,70,55,85],n=['Maths','Physics','Chemistry','English','Comp. Sc.','Economics'];let bi=0,bg=-1,u=true;n.forEach((_,i)=>{const g=Math.max(a[i],b[i],c[i])-Math.min(a[i],b[i],c[i]);if(g>bg){bg=g;bi=i}else if(g===bg)u=false});return u&&q.opts[q.ans]===n[bi]})()",
  "set": "dir-marks"
 },
 {
  "id": "di-radar-29",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "years-above-average",
  "d": "Hard",
  "q": "In how many subjects does Arjun score above the average of the three students' marks in that subject?",
  "opts": [
   "3",
   "2",
   "4",
   "1"
  ],
  "ans": 1,
  "time": 95,
  "sol": [
   "Subject averages: Maths 71.7, Physics 70, Chemistry 71.7, English 70, Comp. Sc. 71.7, Economics 75",
   "Arjun is above in Maths (85) and Comp. Sc. (90); equal in Physics → **2 subjects**"
  ],
  "short": "Only his two highest marks beat the averages.",
  "trap": "Equal to the average is not above the average.",
  "why": [
   "Counted Physics, where he equals the subject average of 70",
   null,
   "Compared with a fixed mark of 65 instead of the subject averages",
   "Counted only Computer Science"
  ],
  "calc": "[0,1,2,3,4,5].filter(i=>[85,70,60,50,90,65][i]>([85,70,60,50,90,65][i]+[60,80,75,90,70,75][i]+[70,60,80,70,55,85][i])/3).length",
  "set": "dir-marks"
 },
 {
  "id": "di-radar-30",
  "sec": "di",
  "topic": "di-radar",
  "pattern": "combined",
  "d": "Hard",
  "q": "Consider only the subjects in which Bhavna scores higher than both other students. By how many marks does her total in those subjects exceed Arjun's total in the same subjects?",
  "opts": [
   "30",
   "170",
   "10",
   "50"
  ],
  "ans": 3,
  "time": 95,
  "sol": [
   "Bhavna is the top scorer in Physics (80) and English (90) only",
   "Bhavna 170; Arjun 70 + 50 = 120; 170 − 120 = **50**"
  ],
  "short": "Filter to two subjects, then subtract.",
  "trap": "Filter the subjects first.",
  "why": [
   "Compared the totals of all six subjects (450 − 420)",
   "That is Bhavna’s total in those subjects, not the difference",
   "Used only Physics (80 − 70)",
   null
  ],
  "calc": "(80+90)-(70+50)",
  "set": "dir-marks"
 }
]);
