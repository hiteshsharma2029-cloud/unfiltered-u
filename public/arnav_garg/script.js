let currentExam = Object.keys(examConfig)[0]
let currentCollege = examConfig[currentExam].colleges[0]
let currentBranch = examConfig[currentExam].branches[0]
let currentCategory = categories[0]
let currentQuota = examConfig[currentExam].quotas[0]
let currentRound = rounds[0]
let currentYear = years[years.length-1]
let trendMode = "years"
let chartType = "line"
let categoryChartType = "pie"
let selectedCompareBranches = []

let trendChartObj = null
let roundChartObj = null
let compareChartObj = null
let categoryChartObj = null
let quotaChartObj = null
let glanceCityChartObj = null
let glanceCollegeChartObj = null

const purple = "#7c5cff"
const purpleLight = "#c9befa"
const colorList = ["#7c5cff","#a48bff","#43c98b","#e0a326","#e15b5b","#4dc0e0"]

function buildExamTabs(){
const wrap = document.getElementById("examTabs")
wrap.innerHTML = ""
Object.keys(examConfig).forEach(exam => {
const btn = document.createElement("button")
btn.className = "examtab" + (exam===currentExam ? " active" : "")
btn.textContent = exam
btn.onclick = function(){
currentExam = exam
currentCollege = examConfig[exam].colleges[0]
currentBranch = examConfig[exam].branches[0]
currentQuota = examConfig[exam].quotas[0]
document.getElementById("collegeSearch").value = currentCollege
buildExamTabs()
buildFilters()
renderQualifying()
renderAll()
}
wrap.appendChild(btn)
})
}

function buildYearPills(){
const wrap = document.getElementById("yearPills")
wrap.innerHTML = ""
years.forEach(y => {
const btn = document.createElement("button")
btn.className = "yearpill" + (y===currentYear ? " active" : "")
btn.textContent = y
btn.onclick = function(){
currentYear = y
buildYearPills()
renderAll()
}
wrap.appendChild(btn)
})
}

function fillSelect(id, options, current){
const el = document.getElementById(id)
el.innerHTML = ""
options.forEach(o => {
const opt = document.createElement("option")
opt.value = o
opt.textContent = o
if(o===current) opt.selected = true
el.appendChild(opt)
})
}

function buildFilters(){
const cfg = examConfig[currentExam]
document.getElementById("collegeSearch").value = currentCollege
fillSelect("branchSelect", cfg.branches, currentBranch)
fillSelect("categorySelect", categories, currentCategory)
fillSelect("quotaSelect", cfg.quotas, currentQuota)
fillSelect("roundSelect", rounds, currentRound)
fillSelect("chanceCategory", categories, currentCategory)
fillSelect("chanceQuota", cfg.quotas, currentQuota)
selectedCompareBranches = cfg.branches.slice()
buildBranchChecks()
}

function buildBranchChecks(){
const cfg = examConfig[currentExam]
const wrap = document.getElementById("branchChecks")
wrap.innerHTML = ""
cfg.branches.forEach(b => {
const label = document.createElement("label")
label.className = "checkitem"
const input = document.createElement("input")
input.type = "checkbox"
input.value = b
input.checked = selectedCompareBranches.includes(b)
input.onchange = function(){
if(input.checked){
selectedCompareBranches.push(b)
}else{
selectedCompareBranches = selectedCompareBranches.filter(x => x!==b)
}
renderCompare()
}
label.appendChild(input)
label.appendChild(document.createTextNode(b))
wrap.appendChild(label)
})
}

function setupCollegeSearch(){
const input = document.getElementById("collegeSearch")
const box = document.getElementById("collegeSuggestions")
input.addEventListener("input", function(){
const cfg = examConfig[currentExam]
const val = input.value.toLowerCase()
const matches = cfg.colleges.filter(c => c.toLowerCase().includes(val))
box.innerHTML = ""
if(val.length===0){ box.style.display = "none"; return }
if(matches.length===0){
box.innerHTML = "<div class='suggestitem noresult'>No college found</div>"
box.style.display = "block"
return
}
matches.forEach(m => {
const item = document.createElement("div")
item.className = "suggestitem"
item.textContent = m
item.onclick = function(){
currentCollege = m
input.value = m
box.style.display = "none"
renderAll()
}
box.appendChild(item)
})
box.style.display = "block"
})
document.addEventListener("click", function(e){
if(e.target!==input) box.style.display = "none"
})
}

function bindEvents(){
document.getElementById("branchSelect").onchange = e => { currentBranch = e.target.value; renderAll() }
document.getElementById("categorySelect").onchange = e => { currentCategory = e.target.value; renderAll() }
document.getElementById("quotaSelect").onchange = e => { currentQuota = e.target.value; renderAll() }
document.getElementById("roundSelect").onchange = e => { currentRound = e.target.value; renderAll() }
document.getElementById("chartType").onchange = e => { chartType = e.target.value; renderTrendChart() }
document.getElementById("categoryChartType").onchange = e => { categoryChartType = e.target.value; renderCategoryChart() }
document.querySelectorAll(".modebtn").forEach(btn => {
btn.onclick = function(){
document.querySelectorAll(".modebtn").forEach(b => b.classList.remove("active"))
btn.classList.add("active")
trendMode = btn.dataset.mode
renderTrendChart()
}
})
document.getElementById("resetBtn").onclick = function(){
const cfg = examConfig[currentExam]
currentBranch = cfg.branches[0]
currentCategory = categories[0]
currentQuota = cfg.quotas[0]
currentRound = rounds[0]
buildFilters()
renderAll()
}
document.getElementById("chanceBtn").onclick = renderChances
}

function renderQualifying(){
const card = document.getElementById("qualifyingCard")
if(currentExam!=="JEE Advanced" && currentExam!=="JEE Main"){
card.style.display = "none"
return
}
card.style.display = "block"
let html = "<tr><th>Category</th>" + officialQualifyingCutoff.years.map(y => "<th>"+y+"</th>").join("") + "</tr>"
Object.keys(officialQualifyingCutoff.rows).forEach(cat => {
html += "<tr><td>"+cat+"</td>" + officialQualifyingCutoff.rows[cat].map(v => "<td>"+v+"</td>").join("") + "</tr>"
})
document.getElementById("qualifyingTable").innerHTML = html
}

function renderGlance(){
const cfg = examConfig[currentExam]
const stats = document.getElementById("glanceStats")
const avgAll = Math.round(cfg.colleges.reduce((s,c) => s + getCollegeAverageRank(currentExam, c, currentCategory, currentQuota, currentRound, currentYear), 0) / cfg.colleges.length)
stats.innerHTML = "<div class='statbox'><div class='statnum'>"+cfg.colleges.length+"</div><div class='statlabel'>Colleges</div></div>" +
"<div class='statbox'><div class='statnum'>"+cfg.branches.length+"</div><div class='statlabel'>Branches</div></div>" +
"<div class='statbox'><div class='statnum'>"+cfg.quotas.length+"</div><div class='statlabel'>Quota Types</div></div>" +
"<div class='statbox'><div class='statnum'>"+avgAll.toLocaleString()+"</div><div class='statlabel'>Avg Rank</div></div>"

const cityCounts = {}
cfg.colleges.forEach(c => {
const city = collegeCity[c] || "Other"
cityCounts[city] = (cityCounts[city]||0)+1
})
const cityCtx = document.getElementById("glanceCityChart")
if(glanceCityChartObj) glanceCityChartObj.destroy()
glanceCityChartObj = new Chart(cityCtx, {
type: "doughnut",
data: {
labels: Object.keys(cityCounts),
datasets: [{ data: Object.values(cityCounts), backgroundColor: colorList }]
}
})

const collegeCtx = document.getElementById("glanceCollegeChart")
const collegeVals = cfg.colleges.map(c => getCollegeAverageRank(currentExam, c, currentCategory, currentQuota, currentRound, currentYear))
if(glanceCollegeChartObj) glanceCollegeChartObj.destroy()
glanceCollegeChartObj = new Chart(collegeCtx, {
type: "bar",
data: {
labels: cfg.colleges,
datasets: [{ label: "Avg Closing Rank", data: collegeVals, backgroundColor: colorList }]
},
options: { plugins: { legend: { display: false } }, scales: { y: { reverse: true } } }
})
}

function renderTrendChart(){
const verified = isVerified(currentExam, currentCollege, currentBranch, currentCategory, currentQuota)
const badge = verified ? "<span class='verifiedtag'>VERIFIED</span>" : "<span class='estimatedtag'>ESTIMATED</span>"
document.getElementById("trendBranchLabel").innerHTML = badge + " " + currentBranch + " at " + currentCollege
const ctx = document.getElementById("trendChart")
let labels = []
let values = []
if(trendMode==="years"){
labels = years.map(y => y.toString())
values = years.map(y => getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, currentRound, y))
}else{
labels = rounds
values = rounds.map(r => getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, r, currentYear))
}
if(trendChartObj) trendChartObj.destroy()
trendChartObj = new Chart(ctx, {
type: chartType,
data: {
labels: labels,
datasets: [{
label: "Closing Rank",
data: values,
borderColor: purple,
backgroundColor: chartType==="bar" ? purpleLight : "rgba(124,92,255,0.15)",
fill: chartType==="line"
}]
},
options: {
plugins: { legend: { display: false } },
scales: { y: { reverse: true, title: { display: true, text: "Rank (lower is better)" } } }
}
})
const summary = document.getElementById("trendSummary")
if(trendMode==="years"){
const first = values[0]
const last = values[values.length-1]
const pctChange = (((last-first)/first)*100).toFixed(1)
const direction = last<first ? "tightened" : "loosened"
const arrow = last<first ? "▼" : "▲"
summary.innerHTML = "<span class='"+(last<first?"green":"red")+"'>"+arrow+" "+Math.abs(pctChange)+"%</span> the cutoff has "+direction+" from "+years[0]+" to "+years[years.length-1]
}else{
summary.textContent = "Showing round wise closing rank for " + currentYear
}
}

function renderRoundTable(){
document.getElementById("roundYearLabel").textContent = currentYear
const verified = isVerified(currentExam, currentCollege, currentBranch, currentCategory, currentQuota)
let html = "<tr><th>Round</th><th>Opening Rank</th><th>Closing Rank</th><th>Source</th></tr>"
rounds.forEach(r => {
const open = getOpeningRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, r, currentYear)
const close = getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, r, currentYear)
const tag = verified ? "<span class='rowverified'>VERIFIED</span>" : "<span class='rowestimated'>ESTIMATED</span>"
html += "<tr><td>"+r+"</td><td>"+open.toLocaleString()+"</td><td>"+close.toLocaleString()+"</td><td>"+tag+"</td></tr>"
})
document.getElementById("roundTable").innerHTML = html

const ctx = document.getElementById("roundChart")
const closeVals = rounds.map(r => getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, r, currentYear))
if(roundChartObj) roundChartObj.destroy()
roundChartObj = new Chart(ctx, {
type: "bar",
data: { labels: rounds, datasets: [{ label: "Closing Rank", data: closeVals, backgroundColor: colorList }] },
options: { plugins: { legend: { display: false } }, scales: { y: { reverse: true } } }
})

const flow = document.getElementById("roundFlow")
flow.innerHTML = rounds.map((r,i) => {
const close = getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, r, currentYear)
return "<div class='flowstep'><div class='flowlabel'>"+r+"</div><div class='flowvalue'>"+close.toLocaleString()+"</div></div>" + (i<rounds.length-1 ? "<div class='flowarrow'>→</div>" : "")
}).join("")
}

function renderCompare(){
const ctx = document.getElementById("compareChart")
const cfg = examConfig[currentExam]
const branchesToShow = selectedCompareBranches.length ? selectedCompareBranches : cfg.branches
const values = branchesToShow.map(b => getClosingRank(currentExam, currentCollege, b, currentCategory, currentQuota, currentRound, currentYear))
if(compareChartObj) compareChartObj.destroy()
compareChartObj = new Chart(ctx, {
type: "bar",
data: {
labels: branchesToShow,
datasets: [{ label: "Closing Rank " + currentYear, data: values, backgroundColor: colorList }]
},
options: { plugins: { legend: { display: false } }, scales: { y: { reverse: true } } }
})
let html = "<tr><th>Branch</th><th>Closing Rank</th><th>5Y Trend</th></tr>"
branchesToShow.forEach(b => {
const trend = getTrendPct(currentExam, currentCollege, b)
const close = getClosingRank(currentExam, currentCollege, b, currentCategory, currentQuota, currentRound, currentYear)
const arrow = trend<-0.02 ? "↑↑ tightening" : trend>0.02 ? "↓ loosening" : "→ stable"
html += "<tr><td>"+b+"</td><td>"+close.toLocaleString()+"</td><td>"+arrow+"</td></tr>"
})
document.getElementById("compareTable").innerHTML = html
}

function renderCategoryChart(){
const ctx = document.getElementById("categoryChart")
const values = categories.map(c => getClosingRank(currentExam, currentCollege, currentBranch, c, currentQuota, currentRound, currentYear))
if(categoryChartObj) categoryChartObj.destroy()
categoryChartObj = new Chart(ctx, {
type: categoryChartType,
data: { labels: categories, datasets: [{ data: values, backgroundColor: colorList }] },
options: { plugins: { legend: { display: categoryChartType!=="bar" } }, scales: categoryChartType==="bar" ? { y: { reverse: true } } : {} }
})
}

function renderQuotaChart(){
const ctx = document.getElementById("quotaChart")
const cfg = examConfig[currentExam]
const values = cfg.quotas.map(q => getClosingRank(currentExam, currentCollege, currentBranch, currentCategory, q, currentRound, currentYear))
if(quotaChartObj) quotaChartObj.destroy()
quotaChartObj = new Chart(ctx, {
type: "bar",
data: { labels: cfg.quotas, datasets: [{ label: "Closing Rank", data: values, backgroundColor: colorList }] },
options: { plugins: { legend: { display: false } }, scales: { y: { reverse: true } } }
})
document.getElementById("quotaNote").textContent = "Higher quota multiplier usually means a more relaxed (higher) closing rank number"
}

function renderPrediction(){
const p = getPredictedRank(currentExam, currentCollege, currentBranch, currentCategory, currentQuota, currentRound)
const lastRealYear = years[years.length-1]
const anchoredOnReal = isVerified(currentExam, currentCollege, currentBranch, currentCategory, currentQuota)
const box = document.getElementById("predictBox")
box.innerHTML = "<div class='predictvalue'>"+p.value.toLocaleString()+"</div>" +
"<div class='predictmeta'>Predicted closing rank for "+currentBranch+" at "+currentCollege+" ("+currentCategory+", "+currentQuota+")</div>" +
"<div class='confidencebar'><div class='confidencefill' style='width:"+p.confidence+"%'></div></div>" +
"<div class='predictmeta'>Confidence: "+p.confidence+"% "+(anchoredOnReal ? "— based on the verified series" : "— fully estimated, no real anchor for this combination")+"</div>"
}

function renderWhy(){
const trend = getTrendPct(currentExam, currentCollege, currentBranch)
const box = document.getElementById("whyBox")
let reasons = []
if(trend<0){
reasons = ["fewer seats were offered this cycle","more students applied for this branch","the branch has become more popular in placements"]
}else{
reasons = ["seats for this branch were increased","fewer applications came in this cycle","a newer branch pulled some demand away"]
}
const pct = Math.abs(trend*100).toFixed(1)
const direction = trend<0 ? "dropped" : "gone up"
box.innerHTML = "<p>Cutoff for <b>"+currentBranch+"</b> has roughly "+direction+" by <b>"+pct+"%</b> per year on average. Possible factors:</p>" +
"<ul>"+reasons.map(r => "<li>"+r+"</li>").join("")+"</ul>" +
"<p class='notesmall'>These are generated estimates based on historical patterns, not confirmed reasons from the counselling authority.</p>"
}

function renderChances(){
const rank = parseInt(document.getElementById("chanceRank").value)
const category = document.getElementById("chanceCategory").value
const quota = document.getElementById("chanceQuota").value
const cfg = examConfig[currentExam]
const results = document.getElementById("chanceResults")
if(!rank || rank<=0){
results.innerHTML = "<p class='notesmall'>Please enter a valid rank first</p>"
return
}
let html = ""
cfg.branches.forEach(b => {
const r1 = getClosingRank(currentExam, currentCollege, b, category, quota, "Round 1", currentYear)
const spot = getClosingRank(currentExam, currentCollege, b, category, quota, "Spot Round", currentYear)
let status = "low"
let label = "LOW CHANCE"
if(rank<=r1*0.9){ status="high"; label="HIGH CHANCE" }
else if(rank<=spot*1.05){ status="mid"; label="BORDERLINE" }
html += "<div class='chancepill "+status+"'><span class='dot'></span>"+label+" — "+b+"</div>"
})
results.innerHTML = html
}

function renderSources(){
const wrap = document.getElementById("sourceLinks")
const l = officialSources[currentExam]
wrap.innerHTML = "<a href='"+l.url+"' target='_blank' class='sourcelink'>"+l.name+" ↗</a><p class='notesmall'>Always cross check against this official counselling authority page before making a final decision.</p>"
}

function renderFaq(){
const faqs = [
["What is opening rank?","Opening rank is the best rank at which the first candidate was offered admission into that branch and category in a particular round."],
["What is closing rank?","Closing rank is the rank of the last candidate who got admission in that branch and category in a particular round. This is what most students track."],
["Can cutoffs decrease in later rounds?","Yes. As more candidates from earlier rounds get admitted elsewhere or leave seats vacant, closing ranks usually go up in later rounds, meaning more people become eligible."],
["Does cutoff differ by category?","Yes, cutoffs are declared separately for General, OBC, EWS, SC and ST categories, and also differ by home state or other state quota."]
]
const wrap = document.getElementById("faqList")
wrap.innerHTML = ""
faqs.forEach(f => {
const item = document.createElement("div")
item.className = "faqitem"
item.innerHTML = "<div class='faqq'>"+f[0]+" <span class='faqicon'>+</span></div><div class='faqa'>"+f[1]+"</div>"
item.querySelector(".faqq").onclick = () => item.classList.toggle("open")
wrap.appendChild(item)
})
}

function renderAll(){
renderTrendChart()
renderRoundTable()
renderCompare()
renderCategoryChart()
renderQuotaChart()
renderGlance()
renderPrediction()
renderWhy()
renderSources()
document.getElementById("chanceResults").innerHTML = ""
}

buildExamTabs()
buildYearPills()
buildFilters()
setupCollegeSearch()
bindEvents()
renderFaq()
renderQualifying()
renderAll()
