/*
  SPR MPP 2026 — PUBLIC TURNOUT DASHBOARD
  DEMO MODE: values below are illustrative only.
  Production: replace loadDashboard() with a request to a secured, read-only
  public API that returns ONLY aggregate turnout data. Never expose voter rows,
  serial numbers, candidate totals, app secrets, or Microsoft Graph tokens here.
*/
const DEMO_MODE = true;
const REFRESH_MS = 30000;
const PROGRAMS = ["DED","DEP","DEI","DLR","DBN","DSB"];
const demoData = {
  totalVoters: 854,
  voted: 520,
  updatedAt: new Date().toISOString(),
  programs: [
    {code:"DED",total:91,voted:68},{code:"DEP",total:206,voted:140},
    {code:"DEI",total:107,voted:66},{code:"DLR",total:142,voted:78},
    {code:"DBN",total:110,voted:77},{code:"DSB",total:198,voted:91}
  ]
};
const fmt = n => Number(n).toLocaleString("ms-MY");
const pct = (n,d) => d ? Math.min(100,Math.max(0,n/d*100)) : 0;
function render(data){
  const total = Number(data.totalVoters)||0;
  const voted = Number(data.voted)||0;
  const remaining = Math.max(0,total-voted);
  const rate = pct(voted,total);
  document.getElementById("totalVoters").textContent=fmt(total);
  document.getElementById("voted").textContent=fmt(voted);
  document.getElementById("notVoted").textContent=fmt(remaining);
  document.getElementById("rate").textContent=rate.toFixed(2)+"%";
  document.getElementById("overallRate").textContent=rate.toFixed(1)+"%";
  document.getElementById("overallProgress").style.width=rate+"%";
  document.getElementById("updatedAt").textContent="Kemas kini: "+new Date(data.updatedAt||Date.now()).toLocaleString("ms-MY");
  const rows = (data.programs||[]).filter(p=>PROGRAMS.includes(p.code));
  document.getElementById("programGrid").innerHTML=rows.map(p=>{
    const r=pct(Number(p.voted)||0,Number(p.total)||0);
    return `<article class="program-card">
      <div class="program-top"><div class="program-code">${escapeHtml(p.code)}</div><div class="program-rate">${r.toFixed(1)}%</div></div>
      <div class="program-meta"><span>${fmt(p.voted)} telah mengundi</span><span>${fmt(p.total)} pengundi</span></div>
      <div class="bar"><span style="width:${r}%"></span></div>
      <div class="program-meta"><span>${fmt(Math.max(0,(Number(p.total)||0)-(Number(p.voted)||0)))} belum mengundi</span><span>Kehadiran</span></div>
    </article>`;
  }).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function loadDashboard(){
  if(DEMO_MODE){render(demoData);return;}
  // TODO: const res = await fetch("YOUR_PUBLIC_AGGREGATE_API_URL",{cache:"no-store"});
  // if(!res.ok) throw new Error("API error");
  // render(await res.json());
  // API must return only aggregate totals; no voter identifiers or candidate results.
}
loadDashboard();
setInterval(()=>loadDashboard().catch(()=>{}),REFRESH_MS);
