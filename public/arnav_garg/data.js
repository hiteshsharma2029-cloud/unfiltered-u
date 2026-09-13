const examConfig = {
"JEE Advanced": {
colleges: ["IIT Bombay", "IIT Delhi", "IIT Madras"],
branches: ["CSE", "Electrical", "Mechanical"],
quotas: ["All India"]
},
"JEE Main": {
colleges: ["NIT Trichy", "DTU"],
branches: ["CSE", "ECE", "Civil"],
quotas: ["Home State", "Other State"]
},
"NEET UG": {
colleges: ["AIIMS Delhi", "KGMU Lucknow"],
branches: ["MBBS", "BDS"],
quotas: ["All India Quota", "State Quota"]
},
"CLAT": {
colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "COEP Pune"],
branches: ["BA LLB", "BBA LLB"],
quotas: ["All India"]
}
}

const collegeCity = {
"IIT Bombay": "Mumbai",
"IIT Delhi": "New Delhi",
"IIT Madras": "Chennai",
"NIT Trichy": "Tiruchirappalli",
"DTU": "New Delhi",
"AIIMS Delhi": "New Delhi",
"KGMU Lucknow": "Lucknow",
"NLSIU Bangalore": "Bengaluru",
"NALSAR Hyderabad": "Hyderabad",
"COEP Pune": "Pune"
}

const categories = ["General", "OBC", "EWS", "SC", "ST"]
const rounds = ["Round 1", "Round 2", "Spot Round"]
const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

// base closing rank per year for General category, first quota
const closingRankData = {
"JEE Advanced": {
"IIT Bombay": { CSE: [65, 70, 74, 80, 86, 92, 99], Electrical: [200, 215, 230, 248, 265, 285, 305], Mechanical: [470, 495, 520, 550, 585, 620, 660] },
"IIT Delhi": { CSE: [92, 98, 104, 111, 119, 127, 136], Electrical: [255, 270, 288, 305, 325, 348, 370], Mechanical: [555, 585, 615, 648, 682, 720, 760] },
"IIT Madras": { CSE: [138, 146, 155, 165, 176, 187, 199], Electrical: [335, 355, 375, 398, 422, 448, 475], Mechanical: [695, 730, 768, 810, 855, 900, 950] }
},
"JEE Main": {
"NIT Trichy": { CSE: [840, 890, 945, 1000, 1060, 1125, 1195], ECE: [2180, 2300, 2430, 2560, 2700, 2850, 3000], Civil: [8100, 8500, 8900, 9350, 9800, 10300, 10800] },
"DTU": { CSE: [3150, 3300, 3460, 3630, 3800, 4000, 4200], ECE: [7400, 7750, 8150, 8550, 9000, 9450, 9950], Civil: [20200, 21200, 22300, 23400, 24600, 25800, 27100] }
},
"NEET UG": {
"AIIMS Delhi": { MBBS: [48, 53, 58, 63, 69, 75, 81], BDS: [3150, 3300, 3450, 3620, 3800, 3990, 4190] },
"KGMU Lucknow": { MBBS: [590, 640, 690, 745, 800, 860, 925], BDS: [5400, 5670, 5950, 6250, 6560, 6890, 7230] }
},
"CLAT": {
"NLSIU Bangalore": { "BA LLB": [55, 58, 61, 64, 68, 72, 76], "BBA LLB": [90, 95, 100, 106, 112, 118, 125] },
"NALSAR Hyderabad": { "BA LLB": [125, 132, 139, 147, 155, 163, 172], "BBA LLB": [185, 195, 205, 216, 227, 239, 251] },
"COEP Pune": { "BA LLB": [300, 316, 333, 351, 370, 390, 411], "BBA LLB": [420, 442, 466, 491, 517, 545, 574] }
}
}

// this one combo is treated as the "real" one for the demo, rest is estimated
function isVerified(exam, college, branch, category, quota){
return exam==="JEE Advanced" && college==="IIT Bombay" && branch==="CSE" && category==="General" && quota==="All India"
}

const officialQualifyingCutoff = {
years: [2026, 2025, 2024, 2023, 2022, 2021, 2020],
rows: {
"General": [93.41, 93.10, 93.24, 90.78, 88.41, 87.90, 90.38],
"EWS": [82.42, 80.38, 81.33, 75.62, 63.11, 66.22, 70.24],
"OBC-NCL": [80.92, 79.43, 79.68, 73.61, 67.01, 68.02, 72.89],
"SC": [63.92, 61.15, 60.09, 51.98, 43.08, 46.88, 50.18],
"ST": [52.02, 47.90, 46.70, 37.23, 26.78, 34.67, 39.07]
}
}

const officialSources = {
"JEE Advanced": { name: "JoSAA Official Counselling", url: "https://josaa.nic.in" },
"JEE Main": { name: "JoSAA Official Counselling", url: "https://josaa.nic.in" },
"NEET UG": { name: "MCC NEET Counselling", url: "https://mcc.nic.in" },
"CLAT": { name: "Consortium of NLUs", url: "https://consortiumofnlus.ac.in" }
}

// fixed multipliers, no random math involved
const categoryMultiplier = { "General": 1, "EWS": 1.1, "OBC": 1.35, "SC": 2.0, "ST": 2.6 }
const quotaMultiplier = { "All India": 1, "All India Quota": 1, "Home State": 1, "Other State": 1.3, "State Quota": 0.9 }
const roundMultiplier = { "Round 1": 0.85, "Round 2": 1, "Spot Round": 1.2 }

function baseSeries(exam, college, branch){
return closingRankData[exam][college][branch]
}

function getClosingRank(exam, college, branch, category, quota, round, year){
const series = baseSeries(exam, college, branch)
const idx = years.indexOf(year)
const base = series[idx]
const val = base * categoryMultiplier[category] * quotaMultiplier[quota] * roundMultiplier[round]
return Math.max(1, Math.round(val))
}

function getOpeningRank(exam, college, branch, category, quota, round, year){
return Math.max(1, Math.round(getClosingRank(exam, college, branch, category, quota, round, year) * 0.75))
}

function getTrendPct(exam, college, branch){
const series = baseSeries(exam, college, branch)
let total = 0
for(let i=1;i<series.length;i++){
total += (series[i]-series[i-1])/series[i-1]
}
return total/(series.length-1)
}

function getPredictedRank(exam, college, branch, category, quota, round){
const series = baseSeries(exam, college, branch)
const trendPct = getTrendPct(exam, college, branch)
const lastYear = years[years.length-1]
const lastVal = getClosingRank(exam, college, branch, category, quota, round, lastYear)
const predicted = Math.round(lastVal * (1+trendPct))

let diffs = []
for(let i=1;i<series.length;i++) diffs.push((series[i]-series[i-1])/series[i-1])
const mean = diffs.reduce((a,b)=>a+b,0)/diffs.length
const variance = diffs.reduce((a,b)=>a+Math.pow(b-mean,2),0)/diffs.length
const stdev = Math.sqrt(variance)
const confidence = Math.max(60, Math.min(95, Math.round(92 - stdev*400)))

return { value: predicted, confidence: confidence }
}

function getCollegeAverageRank(exam, college, category, quota, round, year){
const branches = examConfig[exam].branches
const total = branches.reduce((sum,b) => sum + getClosingRank(exam, college, b, category, quota, round, year), 0)
return Math.round(total/branches.length)
}
