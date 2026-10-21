// DI bank: di-venn, second batch. Original questions written for Aptitude Hub.
QB.add([
 {
  "id": "di-venn-11",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "max-min-rank",
  "d": "Easy",
  "q": "How many members does the largest of the three clubs (by total membership) have?",
  "opts": [
   "50",
   "48",
   "54",
   "30"
  ],
  "ans": 2,
  "time": 40,
  "sol": [
   "Maths = 30 + 12 + 8 + 4 = 54",
   "Robotics = 22 + 12 + 10 + 4 = 48; Debate = 14 + 8 + 10 + 4 = 36",
   "Largest = **54**"
  ],
  "short": "Add all four regions inside each circle, then compare.",
  "trap": "The biggest single region is not the biggest club.",
  "why": [
   "Left out the 4 who are in all three clubs",
   "That is the Robotics club",
   null,
   "Took the biggest \"only\" region instead of a whole club"
  ],
  "calc": "30+12+8+4",
  "set": "di-venn-s2-clubs"
 },
 {
  "id": "di-venn-12",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "How many students belong to exactly one of the three clubs?",
  "opts": [
   "66",
   "100",
   "70",
   "34"
  ],
  "ans": 0,
  "time": 40,
  "sol": [
   "Only-regions: 30 + 22 + 14",
   "= **66**"
  ],
  "short": "Exactly one = the three outer petals only.",
  "trap": "The centre and the lens regions belong to more than one club.",
  "why": [
   null,
   "Counted everyone in at least one club",
   "Added the centre region as well",
   "That is the number in exactly two clubs"
  ],
  "calc": "30+22+14",
  "set": "di-venn-s2-clubs"
 },
 {
  "id": "di-venn-13",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "ratio-of-two-values",
  "d": "Medium",
  "q": "The Maths club has how many times as many members as the Debate club?",
  "opts": [
   "0.67",
   "2.14",
   "1.13",
   "1.5"
  ],
  "ans": 3,
  "time": 55,
  "sol": [
   "Maths = 54, Debate = 36",
   "54 ÷ 36 = **1.5**"
  ],
  "short": "Whole circle ÷ whole circle: 54 : 36 = 3 : 2.",
  "trap": "Using only the \"only\" regions changes the ratio.",
  "why": [
   "Inverted the ratio (36 ÷ 54)",
   "Compared \"Maths only\" with \"Debate only\" (30 ÷ 14)",
   "Compared Maths with Robotics (54 ÷ 48)",
   null
  ],
  "calc": "54/36",
  "set": "di-venn-s2-clubs"
 },
 {
  "id": "di-venn-14",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "years-above-average",
  "d": "Medium",
  "q": "Find the average of the three \"exactly two clubs\" regions. How many of the seven regions inside the circles are strictly above that average?",
  "opts": [
   "5",
   "4",
   "3",
   "7"
  ],
  "ans": 1,
  "time": 70,
  "sol": [
   "Average = (12 + 8 + 10) ÷ 3 = 10",
   "Regions: 30, 22, 14, 12, 8, 10, 4",
   "Strictly above 10: 30, 22, 14, 12 = **4**"
  ],
  "short": "Average = 10; scan the seven numbers and count those over 10.",
  "trap": "A value equal to the average is not above it.",
  "why": [
   "Counted the region equal to the average (10) as above it",
   null,
   "Left out the 12 region",
   "Assumed every region exceeds it"
  ],
  "calc": "[30,22,14,12,8,10,4].filter(x=>x>(12+8+10)/3).length",
  "set": "di-venn-s2-clubs"
 },
 {
  "id": "di-venn-15",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "combined",
  "d": "Hard",
  "q": "Students who are in Maths or Robotics but not in Debate are what percent of all students who are in at least one club?",
  "opts": [
   "52%",
   "64%",
   "86%",
   "50.8%"
  ],
  "ans": 1,
  "time": 100,
  "sol": [
   "Maths or Robotics, not Debate = 30 + 22 + 12 = 64",
   "At least one club = 126 − 26 = 100",
   "64 ÷ 100 = **64%**"
  ],
  "short": "Three regions on top, over 100 club members.",
  "trap": "The denominator is \"at least one club\", not the whole 126.",
  "why": [
   "Dropped the Maths-and-Robotics-only region",
   null,
   "Included the Debate overlaps (Maths or Robotics in all)",
   "Divided by all 126 students, not just those in a club"
  ],
  "calc": "(30+22+12)/(126-26)*100",
  "set": "di-venn-s2-clubs"
 },
 {
  "id": "di-venn-16",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "direct-read",
  "d": "Easy",
  "q": "How many customers used both UPI and cards in 2023?",
  "opts": [
   "121",
   "49",
   "50",
   "72"
  ],
  "ans": 3,
  "time": 35,
  "sol": [
   "The overlap in the 2023 diagram = **72**"
  ],
  "short": "Both = the lens in the middle.",
  "trap": "Mixing up the two years.",
  "why": [
   "That is all UPI users in 2023",
   "Only UPI, without cards",
   "The 2021 figure",
   null
  ],
  "calc": "72",
  "set": "di-venn-s2-pay"
 },
 {
  "id": "di-venn-17",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "pct-change-growth",
  "d": "Easy",
  "q": "By what percent did the number of UPI users (alone or with cards) grow from 2021 to 2023?",
  "opts": [
   "21%",
   "17.4%",
   "44%",
   "16.7%"
  ],
  "ans": 0,
  "time": 50,
  "sol": [
   "2021: 50 + 50 = 100; 2023: 49 + 72 = 121",
   "Growth = 21 ÷ 100 = **21%**"
  ],
  "short": "Base is the old value: 100 → 121.",
  "trap": "Dividing by the new value.",
  "why": [
   null,
   "Divided the rise by the new value (21 ÷ 121)",
   "That is the growth of customers using both",
   "That is the growth of all customers surveyed"
  ],
  "calc": "(121-100)/100*100",
  "set": "di-venn-s2-pay"
 },
 {
  "id": "di-venn-18",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "cagr-roughly",
  "d": "Medium",
  "q": "UPI users (alone or with cards) went from 100 in 2021 to 121 in 2023. Roughly, what was the yearly compound growth rate?",
  "opts": [
   "21%",
   "5%",
   "10%",
   "15%"
  ],
  "ans": 2,
  "time": 65,
  "sol": [
   "Two years, so (1 + r)² = 1.21",
   "1.1 × 1.1 = 1.21, so r = **10%**"
  ],
  "short": "121 = 11²: two equal steps of 10%.",
  "trap": "Total growth over two years is not the yearly rate.",
  "why": [
   "Took the whole two-year growth as the yearly rate",
   "Halved the 10% again",
   null,
   "Guessed without checking that 1.15² is 1.32"
  ],
  "calc": "(Math.sqrt(121/100)-1)*100",
  "set": "di-venn-s2-pay"
 },
 {
  "id": "di-venn-19",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "cagr-roughly",
  "d": "Hard",
  "q": "Customers using both UPI and cards rose from 50 (2021) to 72 (2023). What was the yearly compound growth rate?",
  "opts": [
   "44%",
   "22%",
   "12%",
   "20%"
  ],
  "ans": 3,
  "time": 90,
  "sol": [
   "(1 + r)² = 72 ÷ 50 = 1.44",
   "1.2 × 1.2 = 1.44, so r = **20%**"
  ],
  "short": "1.44 is 1.2²: recognise the perfect square.",
  "trap": "Dividing total growth by the number of years.",
  "why": [
   "The total two-year growth",
   "Divided the 44% by 2 and added a little",
   "Guessed from 50 → 72 being roughly 1.5 times",
   null
  ],
  "calc": "(Math.sqrt(72/50)-1)*100",
  "set": "di-venn-s2-pay"
 },
 {
  "id": "di-venn-20",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "share-of-total",
  "d": "Medium",
  "q": "In 2023, customers who used only UPI were what percent of all customers surveyed?",
  "opts": [
   "34.6%",
   "14%",
   "40.5%",
   "16.3%"
  ],
  "ans": 1,
  "time": 55,
  "sol": [
   "Only UPI in 2023 = 49",
   "Total surveyed in 2023 = 350",
   "49 ÷ 350 = **14%**"
  ],
  "short": "49 ÷ 350: 350 × 14% = 49.",
  "trap": "Using a different base (UPI users or the 2021 total).",
  "why": [
   "Used all UPI users (121), not only UPI",
   null,
   "Divided by UPI users (121) instead of all customers",
   "Divided by the 2021 total of 300"
  ],
  "calc": "49/350*100",
  "set": "di-venn-s2-pay"
 },
 {
  "id": "di-venn-21",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "max-min-rank",
  "d": "Easy",
  "q": "The most-followed sport has how many more followers than the least-followed sport?",
  "opts": [
   "60",
   "90",
   "120",
   "210"
  ],
  "ans": 2,
  "time": 45,
  "sol": [
   "Totals: cricket 330, hockey 270, kabaddi 210",
   "330 − 210 = **120**"
  ],
  "short": "Whole-sport totals are given: 330 − 210.",
  "trap": "Using the \"only\" regions instead of the totals.",
  "why": [
   "Compared cricket with hockey, the second-most followed",
   "Compared the \"cricket only\" and \"kabaddi only\" regions",
   null,
   "That is the kabaddi total itself"
  ],
  "calc": "330-210",
  "set": "di-venn-s2-sports"
 },
 {
  "id": "di-venn-22",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "average",
  "d": "Medium",
  "q": "On average, how many of the three sports does a resident (out of the 600 surveyed) follow?",
  "opts": [
   "1.35",
   "1.45",
   "270",
   "0.93"
  ],
  "ans": 0,
  "time": 65,
  "sol": [
   "Total follows = 330 + 270 + 210 = 810",
   "810 ÷ 600 = **1.35**"
  ],
  "short": "Add the three circle totals, divide by all residents.",
  "trap": "Dividing by those who follow at least one sport changes the base.",
  "why": [
   null,
   "Divided by the 560 who follow at least one sport",
   "Divided the total only by 3",
   "Counted people (560 ÷ 600), not sports followed"
  ],
  "calc": "(330+270+210)/600",
  "set": "di-venn-s2-sports"
 },
 {
  "id": "di-venn-23",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "approximate-value",
  "d": "Medium",
  "q": "Approximately what percent of the 600 residents follow exactly two of the three sports?",
  "opts": [
   "≈ 28%",
   "≈ 35%",
   "≈ 48%",
   "≈ 17%"
  ],
  "ans": 0,
  "time": 75,
  "sol": [
   "Cricket-hockey only = 120 − 40 = 80",
   "Hockey-kabaddi only = 90 − 40 = 50; cricket-kabaddi only = 80 − 40 = 40",
   "Exactly two = 170; 170 ÷ 600 ≈ **28%**"
  ],
  "short": "Subtract the centre (40) from each \"both\" count, then add.",
  "trap": "The \"both\" counts include those who follow all three.",
  "why": [
   null,
   "Included the 40 who follow all three",
   "Added the three \"both\" counts (120 + 90 + 80) without removing the centre",
   "That is hockey-only (100) ÷ 600"
  ],
  "calc": "Math.round(170/600*100)",
  "set": "di-venn-s2-sports"
 },
 {
  "id": "di-venn-24",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "years-above-average",
  "d": "Hard",
  "q": "The seven regions inside the circles have an average value. How many of the seven regions are strictly above it?",
  "opts": [
   "4",
   "3",
   "2",
   "5"
  ],
  "ans": 2,
  "time": 100,
  "sol": [
   "Regions: only cricket 170, only hockey 100, only kabaddi 80, C-H 80, H-K 50, C-K 40, all three 40",
   "Sum = 560, average = 80",
   "Strictly above 80: 170 and 100 = **2**"
  ],
  "short": "Average = 560 ÷ 7 = 80; only 170 and 100 beat it.",
  "trap": "Two regions equal 80 exactly and are not \"above\".",
  "why": [
   "Counted the regions equal to the average (80) as above",
   "Counted only one of the two regions equal to 80",
   null,
   "Counted every region above 50"
  ],
  "calc": "[170,100,80,80,50,40,40].filter(x=>x>560/7).length",
  "set": "di-venn-s2-sports"
 },
 {
  "id": "di-venn-25",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "pct-change-growth",
  "d": "Hard",
  "q": "Suppose the number following only hockey rises by 30% and the number following only kabaddi falls by 25%, with all other regions unchanged. How many residents now follow at least one sport?",
  "opts": [
   "590",
   "570",
   "540",
   "588"
  ],
  "ans": 1,
  "time": 100,
  "sol": [
   "Only hockey = 270 − 120 − 90 + 40 = 100, becomes 130 (+30)",
   "Only kabaddi = 210 − 90 − 80 + 40 = 80, becomes 60 (−20)",
   "560 + 30 − 20 = **570**"
  ],
  "short": "Change only the two regions that move: +30 and −20.",
  "trap": "The two percentages apply to different bases, so they do not net out.",
  "why": [
   "Applied the rise but forgot the kabaddi fall",
   null,
   "Applied the fall but forgot the hockey rise",
   "Took the net effect as +5% of 560"
  ],
  "calc": "560+0.3*100-0.25*80",
  "set": "di-venn-s2-sports"
 },
 {
  "id": "di-venn-26",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "max-min-rank",
  "d": "Easy",
  "q": "The smallest of the four regions in the diagram has how many persons?",
  "opts": [
   "40",
   "55",
   "70",
   "35"
  ],
  "ans": 3,
  "time": 35,
  "sol": [
   "Regions: 70, 35, 55, 40",
   "Smallest = **35** (both)"
  ],
  "short": "Scan the four numbers.",
  "trap": "Forgetting that the \"none\" region counts as a region.",
  "why": [
   "That is the \"neither\" region",
   "That is the coffee-only region",
   "That is the largest region, tea only",
   null
  ],
  "calc": "Math.min(70,35,55,40)",
  "set": "di-venn-s2-chai"
 },
 {
  "id": "di-venn-27",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "ratio-of-two-values",
  "d": "Medium",
  "q": "Total tea drinkers are how many times the number of persons who drink both tea and coffee?",
  "opts": [
   "2",
   "2.57",
   "3",
   "1.57"
  ],
  "ans": 2,
  "time": 55,
  "sol": [
   "Tea drinkers = 70 + 35 = 105",
   "105 ÷ 35 = **3**"
  ],
  "short": "Tea circle = 105; 105 ÷ 35 = 3.",
  "trap": "The tea circle includes the overlap.",
  "why": [
   "Used tea only (70) instead of all tea drinkers",
   "Used coffee drinkers (90) ÷ 35",
   null,
   "Used coffee only (55) ÷ 35"
  ],
  "calc": "(70+35)/35",
  "set": "di-venn-s2-chai"
 },
 {
  "id": "di-venn-28",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "combined",
  "d": "Hard",
  "q": "Every tea drinker buys one tea a day at ₹12 and every coffee drinker buys one coffee a day at ₹20. Someone who drinks both buys both. What is the canteen's total daily sale to these 200 persons?",
  "opts": [
   "₹3,060",
   "₹2,360",
   "₹1,940",
   "₹4,180"
  ],
  "ans": 0,
  "time": 100,
  "sol": [
   "Tea sales = 105 × ₹12 = ₹1,260",
   "Coffee sales = 90 × ₹20 = ₹1,800",
   "Total = **₹3,060**"
  ],
  "short": "Whole-circle totals times the price: 105 × 12 + 90 × 20.",
  "trap": "The overlap people buy both drinks.",
  "why": [
   null,
   "Counted the 35 who drink both only for tea",
   "Left out the \"both\" persons completely",
   "Counted the \"both\" persons twice in each total"
  ],
  "calc": "105*12+90*20",
  "set": "di-venn-s2-chai"
 },
 {
  "id": "di-venn-29",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "average",
  "d": "Medium",
  "q": "Taking the 200 persons together, what is the average number of drinks bought per person per day?",
  "opts": [
   "0.80",
   "1.22",
   "1.95",
   "0.975"
  ],
  "ans": 3,
  "time": 60,
  "sol": [
   "Drinks = 105 + 90 = 195",
   "195 ÷ 200 = **0.975**"
  ],
  "short": "Total drinks ÷ everyone surveyed.",
  "trap": "Non-drinkers are part of the 200.",
  "why": [
   "Counted persons who drink something (160 ÷ 200), not drinks",
   "Divided by the 160 who drink at least one",
   "Divided 195 by 100 instead of 200",
   null
  ],
  "calc": "(105+90)/200",
  "set": "di-venn-s2-chai"
 },
 {
  "id": "di-venn-30",
  "sec": "di",
  "topic": "di-venn",
  "pattern": "approximate-value",
  "d": "Hard",
  "q": "Approximately what percent of coffee drinkers also drink tea?",
  "opts": [
   "≈ 33%",
   "≈ 39%",
   "≈ 17.5%",
   "≈ 64%"
  ],
  "ans": 1,
  "time": 80,
  "sol": [
   "Coffee drinkers = 55 + 35 = 90",
   "Also tea = 35",
   "35 ÷ 90 ≈ **39%**"
  ],
  "short": "35 ÷ 90 = 7/18 ≈ 38.9%.",
  "trap": "The base is coffee drinkers (the \"given\" group).",
  "why": [
   "Divided by tea drinkers (105) instead of coffee drinkers",
   null,
   "Divided by all 200 persons",
   "Divided by coffee-only (55)"
  ],
  "calc": "Math.round(35/90*100)",
  "set": "di-venn-s2-chai"
 }
]);
