/*
  SPR MPP 2026 — PUBLIC TURNOUT DASHBOARD
  DEMO MODE: values below are illustrative only.
  Production: replace loadDashboard() with a request to a secured, read-only
  public API that returns ONLY aggregate turnout data. Never expose voter rows,
  serial numbers, candidate totals, app secrets, or Microsoft Graph tokens here.
*/
const DEMO_MODE = false;
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
function render(data) {
  const total = Number(data.totalPengundi) || 0;
  const voted = Number(data.telahMengundi) || 0;
  const remaining = Number(data.belumMengundi) || Math.max(0, total - voted);
  const rate = Number(data.peratusKehadiran) || 0;

  document.getElementById("totalVoters").textContent = fmt(total);
  document.getElementById("voted").textContent = fmt(voted);
  document.getElementById("notVoted").textContent = fmt(remaining);
  document.getElementById("rate").textContent = rate.toFixed(2) + "%";
  document.getElementById("overallRate").textContent = rate.toFixed(1) + "%";
  document.getElementById("overallProgress").style.width = rate + "%";

  document.getElementById("updatedAt").textContent =
    "Kemas kini: " + new Date().toLocaleString("ms-MY");

const rows = (data.program || []).filter(p =>
    PROGRAMS.includes(p.nama)
);

document.getElementById("programGrid").innerHTML = rows.map(p => {
    const programTotal = Number(p.jumlah) || 0;
    const programVoted = Number(p.telahMengundi) || 0;

    const programRemaining = Math.max(
        0,
        programTotal - programVoted
    );

    const programRate = programTotal > 0
        ? (programVoted / programTotal) * 100
        : 0;

    return `<article class="program-card">
        <div class="program-top">
            <div class="program-code">${escapeHtml(p.nama)}</div>
            <div class="program-rate">${programRate.toFixed(1)}%</div>
        </div>

        <div class="program-meta">
            <span>${fmt(programVoted)} telah mengundi</span>
            <span>${fmt(programTotal)} pengundi</span>
        </div>

        <div class="bar">
            <span style="width:${Math.min(100, programRate)}%"></span>
        </div>

        <div class="program-meta">
            <span>${fmt(programRemaining)} belum mengundi</span>
            <span>Kehadiran</span>
        </div>
    </article>`;
}).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
async function loadDashboard() {
  try {
    const res = await fetch("./dashboard.json", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Gagal membaca dashboard.json: HTTP " + res.status);
    }

    const data = await res.json();

    console.log("Data dashboard:", data);

    render(data);
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
    // Paparkan data sebaik sahaja halaman dibuka
    loadDashboard();

    // Kemas kini data setiap 3 minit
    setInterval(() => {
        loadDashboard();
    }, 3 * 60 * 1000);
});
