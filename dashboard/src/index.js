// ============================================================
// FORGE DASHBOARD v4 -- Premium Ops Platform
// Cloudflare Worker -- single file, no build step
// Update DATA below, then: bash /workspace/dashboard/deploy.sh
// ============================================================

const DATA = {
  // ---- FINANCIALS ----
  financial: {
    totalInvested: 809.06,
    totalRevenue: 0.00,
    netROI: -809.06,
    monthlyBurn: 315.99,
    dailyCost: 10.53,
    // 30-day cost history (oldest to newest) -- add entries as days pass
    costHistory: [
      12.50, 14.20, 11.80, 10.53, 10.53, 10.53, 10.53,
      10.53, 10.53, 10.53, 10.53, 10.53, 10.53, 10.53,
    ],
  },

  // ---- AUDIENCE ----
  audience: {
    linkedin: { current: 6500, target: 10000, weekAgo: 6460 },
    xForge: { current: 0, weekAgo: 0 },
    xLucas: { current: 0, weekAgo: 0 },
    kitSubscribers: { current: 0, weekAgo: 0 },
  },

  // ---- X POSTS ----
  xPosts: {
    forgeToday: 0,
    lucasToday: 0,
    totalAllTime: 11,
  },

  // ---- SYSTEM ----
  system: {
    status: "online",        // online | degraded | offline
    model: "DeepSeek V3",
    heartbeatInterval: "10m",
    uptimeDays: 2,
    uptimeHours: 24,
    sessionsToday: 0,
    skillsDeployed: 23,
  },

  // ---- PLATFORM HEALTH ----
  platforms: [
    { name: "Cloudflare Workers", status: "healthy", latency: "12ms" },
    { name: "Supabase (IAC Ops)", status: "healthy", latency: "45ms" },
    { name: "Supabase (Catalyst)", status: "healthy", latency: "48ms" },
    { name: "n8n Automations", status: "healthy", latency: "-- " },
    { name: "Forge Agent", status: "healthy", latency: "-- " },
    { name: "Kit (Email)", status: "pending", latency: "-- " },
  ],

  // ---- CLARITY LAUNCH ----
  clarity: {
    launchDate: "2026-04-17",
    trackingStartDate: "2026-03-01",
    pricing: { kindle: 9.99, paperback: 19.99, hardcover: 27.99 },
    // Launch checklist -- check these off as completed
    checklist: [
      { item: "Manuscript finalized", done: true },
      { item: "Cover files delivered (4 formats)", done: true },
      { item: "ISBNs assigned (Bowker)", done: true },
      { item: "KDP account setup (HMD)", done: true },
      { item: "IngramSpark submission", done: false },
      { item: "Amazon Author Central", done: false },
      { item: "Goodreads author page", done: false },
      { item: "BookBub author profile", done: false },
      { item: "B&N Press listing", done: false },
      { item: "Kit email sequences live", done: true },
      { item: "Lead magnet landing page", done: true },
      { item: "Pre-launch sales list built", done: false },
      { item: "Launch week social content", done: false },
      { item: "Podcast guest pitches sent", done: false },
    ],
  },

  // ---- REVENUE PIPELINE ----
  pipeline: {
    stages: [
      { name: "Awareness", count: 6500, label: "LinkedIn audience" },
      { name: "Email List", count: 0, label: "Kit subscribers" },
      { name: "Pre-orders", count: 0, label: "Books reserved" },
      { name: "Launch Sales", count: 0, label: "Week 1 target: 100" },
    ],
  },

  // ---- MODEL TIERS ----
  modelTiers: [
    { name: "DeepSeek", requirement: "Current", unlocked: true, current: true },
    { name: "+ Sonnet", requirement: "2x ROI ($1,618)", unlocked: false, current: false },
    { name: "Sonnet Default", requirement: "3x ROI ($2,427)", unlocked: false, current: false },
    { name: "+ Opus Strategy", requirement: "5x ROI ($4,045)", unlocked: false, current: false },
    { name: "Opus Everything", requirement: "10x ROI ($8,090)", unlocked: false, current: false },
  ],

  // ---- WORK QUEUE ----
  workQueue: [
    { task: "Dashboard v4 rebuild", status: "active", est: "3 hrs", priority: "high" },
    { task: "NotebookLM graphics research", status: "active", est: "1 hr", priority: "med" },
    { task: "CLARITY launch week plan", status: "queued", est: "2 hrs", priority: "high" },
    { task: "Gumroad competitive research", status: "done", est: "1.5 hrs", priority: "med" },
    { task: "Definition of Done PDFs", status: "done", est: "2 hrs", priority: "med" },
    { task: "Kit email sequences", status: "done", est: "1.5 hrs", priority: "high" },
    { task: "Lead magnet landing page", status: "done", est: "1.5 hrs", priority: "high" },
  ],
  // Weekly velocity
  velocity: { thisWeek: 5, lastWeek: 3 },

  // ---- ACTIVITY FEED ----
  activityFeed: [
    { time: "3:40 AM", date: "Mar 25", type: "system", action: "Provided full task list and schedule" },
    { time: "3:27 AM", date: "Mar 25", type: "system", action: "Heartbeat loop identified and fixed" },
    { time: "2:40 AM", date: "Mar 25", type: "deploy", action: "Dashboard v2 deployed to Cloudflare" },
    { time: "1:00 AM", date: "Mar 25", type: "content", action: "Kit email sequences drafted (12 emails)" },
    { time: "12:15 AM", date: "Mar 25", type: "content", action: "Gumroad listings created (3 products)" },
    { time: "11:30 PM", date: "Mar 24", type: "content", action: "Definition of Done PDFs generated (10)" },
    { time: "10:00 PM", date: "Mar 24", type: "tweet", action: "Posted sprint progress to @Forge_Builds" },
    { time: "8:15 PM", date: "Mar 24", type: "deploy", action: "Dashboard v2 first deploy" },
    { time: "7:40 PM", date: "Mar 24", type: "system", action: "12-hour autonomous sprint started" },
    { time: "6:00 PM", date: "Mar 24", type: "tweet", action: "Lucas Day 1 evening tweet posted" },
    { time: "2:40 PM", date: "Mar 24", type: "system", action: "DeepSeek integration fixed" },
    { time: "2:30 PM", date: "Mar 24", type: "system", action: "11 new skills deployed" },
  ],
};

// ============================================================
// WORKER HANDLER
// ============================================================
export default {
  async fetch(request) {
    const now = new Date();
    const launch = new Date(DATA.clarity.launchDate);
    const start = new Date(DATA.clarity.trackingStartDate);
    const daysLeft = Math.max(0, Math.ceil((launch - now) / 86400000));
    const totalDays = Math.ceil((launch - start) / 86400000);
    const elapsed = Math.ceil((now - start) / 86400000);
    const launchPct = Math.min(100, Math.round((elapsed / totalDays) * 100));
    const linkedinPct = Math.round((DATA.audience.linkedin.current / DATA.audience.linkedin.target) * 100);
    const linkedinDelta = DATA.audience.linkedin.current - DATA.audience.linkedin.weekAgo;
    const roiMult = DATA.financial.totalRevenue > 0
      ? (DATA.financial.totalRevenue / DATA.financial.totalInvested).toFixed(1)
      : "0.0";

    // Checklist stats
    const checkDone = DATA.clarity.checklist.filter(c => c.done).length;
    const checkTotal = DATA.clarity.checklist.length;
    const checkPct = Math.round((checkDone / checkTotal) * 100);

    // Queue stats
    const qDone = DATA.workQueue.filter(w => w.status === "done").length;
    const qActive = DATA.workQueue.filter(w => w.status === "active").length;
    const qQueued = DATA.workQueue.filter(w => w.status === "queued").length;
    const velDelta = DATA.velocity.thisWeek - DATA.velocity.lastWeek;

    // Cost chart data (last 14 entries or whatever exists)
    const costData = DATA.financial.costHistory.slice(-14);
    const costLabels = costData.map((_, i) => `Day ${i + 1}`);

    // Pipeline funnel percentages
    const maxPipeline = Math.max(1, ...DATA.pipeline.stages.map(s => s.count));

    // Platform health
    const healthyCount = DATA.platforms.filter(p => p.status === "healthy").length;
    const totalPlatforms = DATA.platforms.length;

    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Forge Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
<style>
/* ============ RESET & VARS ============ */
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg-base:#0C0F14;
  --bg-surface:#141820;
  --bg-card:#1A1F2B;
  --bg-card-hover:#1E2433;
  --bg-elevated:#222838;
  --border:#2A3040;
  --border-subtle:#1E2433;
  --text-primary:#E8ECF1;
  --text-secondary:#8B95A8;
  --text-muted:#5A6478;
  --accent:#D85A30;
  --accent-glow:rgba(216,90,48,0.15);
  --accent-subtle:rgba(216,90,48,0.08);
  --green:#10B981;
  --green-glow:rgba(16,185,129,0.15);
  --red:#EF4444;
  --red-glow:rgba(239,68,68,0.12);
  --blue:#3B82F6;
  --blue-glow:rgba(59,130,246,0.12);
  --purple:#8B5CF6;
  --yellow:#F59E0B;
  --font-display:'DM Sans',system-ui,sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --radius:14px;
  --radius-sm:8px;
  --radius-xs:5px;
}
html{font-size:15px}
body{font-family:var(--font-display);background:var(--bg-base);color:var(--text-primary);min-height:100vh;overflow-x:hidden}
a{color:var(--accent);text-decoration:none}

/* ============ AMBIENT BACKGROUND ============ */
body::before{
  content:'';position:fixed;top:-200px;right:-200px;width:600px;height:600px;
  background:radial-gradient(circle,rgba(216,90,48,0.06) 0%,transparent 70%);
  pointer-events:none;z-index:0;
}
body::after{
  content:'';position:fixed;bottom:-200px;left:-100px;width:500px;height:500px;
  background:radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%);
  pointer-events:none;z-index:0;
}

/* ============ LAYOUT ============ */
.shell{display:flex;min-height:100vh;position:relative;z-index:1}

/* ---- SIDEBAR ---- */
.sidebar{
  position:fixed;left:0;top:0;bottom:0;width:240px;
  background:var(--bg-surface);border-right:1px solid var(--border-subtle);
  padding:28px 20px;display:flex;flex-direction:column;z-index:100;
  overflow-y:auto;
}
.sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.sb-logo{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--accent),#FF8A5C);
  display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:16px;color:#fff;
  box-shadow:0 4px 16px rgba(216,90,48,0.3);
}
.sb-title{font-size:20px;font-weight:800;letter-spacing:1.5px;color:var(--text-primary)}
.sb-sub{font-size:11px;color:var(--text-muted);margin-bottom:20px;padding-left:46px}

.sb-status{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px;border-radius:var(--radius-sm);
  background:var(--bg-card);margin-bottom:6px;
}
.sb-dot{
  width:8px;height:8px;border-radius:50%;flex-shrink:0;
}
.sb-dot-online{background:var(--green);box-shadow:0 0 8px rgba(16,185,129,0.5);animation:pulse-g 2s ease-in-out infinite}
.sb-dot-degraded{background:var(--yellow);box-shadow:0 0 8px rgba(245,158,11,0.5)}
.sb-dot-offline{background:var(--red);box-shadow:0 0 8px rgba(239,68,68,0.5)}
@keyframes pulse-g{0%,100%{opacity:1}50%{opacity:0.5}}
.sb-status-text{font-size:12px;font-weight:600;color:var(--text-primary)}
.sb-status-model{
  margin-left:auto;font-size:10px;font-weight:600;
  background:var(--accent-subtle);color:var(--accent);
  padding:2px 8px;border-radius:4px;
}

.sb-section{margin-top:20px}
.sb-section-title{
  font-size:9px;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--text-muted);font-weight:600;margin-bottom:10px;
}
.sb-metric{padding:8px 0;border-bottom:1px solid var(--border-subtle)}
.sb-metric:last-child{border-bottom:none}
.sb-metric-label{font-size:11px;color:var(--text-secondary)}
.sb-metric-value{font-size:15px;font-weight:700;font-family:var(--font-mono);margin-top:1px}

/* Platform health indicators in sidebar */
.sb-health{display:flex;flex-direction:column;gap:4px}
.sb-health-item{
  display:flex;align-items:center;gap:8px;
  font-size:11px;color:var(--text-secondary);
  padding:4px 0;
}
.sb-health-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.sb-health-dot.h-ok{background:var(--green)}
.sb-health-dot.h-warn{background:var(--yellow)}
.sb-health-dot.h-err{background:var(--red)}
.sb-health-dot.h-pending{background:var(--text-muted)}
.sb-health-latency{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)}

.sb-footer{
  margin-top:auto;padding-top:16px;
  font-size:10px;color:var(--text-muted);
  border-top:1px solid var(--border-subtle);
  line-height:1.6;
}

/* ---- MAIN ---- */
.main{margin-left:240px;padding:28px 32px;max-width:1200px}

/* ============ COMMAND STRIP ============ */
.cmd-strip{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
  margin-bottom:24px;
}
.cmd-card{
  background:var(--bg-card);border:1px solid var(--border-subtle);
  border-radius:var(--radius);padding:20px 22px;
  position:relative;overflow:hidden;
  animation:fadeUp 0.5s ease both;
}
.cmd-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  border-radius:var(--radius) var(--radius) 0 0;
}
.cmd-card:nth-child(1)::before{background:linear-gradient(90deg,var(--accent),#FF8A5C)}
.cmd-card:nth-child(2)::before{background:linear-gradient(90deg,var(--red),#F87171)}
.cmd-card:nth-child(3)::before{background:linear-gradient(90deg,var(--blue),#93C5FD)}
.cmd-card:nth-child(4)::before{background:linear-gradient(90deg,var(--green),#6EE7B7)}
.cmd-card:nth-child(1){animation-delay:0s}
.cmd-card:nth-child(2){animation-delay:0.05s}
.cmd-card:nth-child(3){animation-delay:0.1s}
.cmd-card:nth-child(4){animation-delay:0.15s}
.cmd-label{font-size:10px;text-transform:uppercase;letter-spacing:1.2px;color:var(--text-muted);font-weight:600;margin-bottom:8px}
.cmd-value{font-size:32px;font-weight:800;font-family:var(--font-mono);line-height:1}
.cmd-value.v-accent{color:var(--accent)}
.cmd-value.v-red{color:var(--red)}
.cmd-value.v-blue{color:var(--blue)}
.cmd-value.v-green{color:var(--green)}
.cmd-sub{font-size:11px;color:var(--text-secondary);margin-top:6px}
.cmd-delta{
  display:inline-flex;align-items:center;gap:3px;
  font-size:11px;font-weight:600;font-family:var(--font-mono);
  padding:2px 6px;border-radius:4px;margin-top:6px;
}
.cmd-delta.up{color:var(--green);background:var(--green-glow)}
.cmd-delta.down{color:var(--red);background:var(--red-glow)}
.cmd-delta.flat{color:var(--text-muted);background:var(--bg-elevated)}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ============ CARDS ============ */
.card{
  background:var(--bg-card);border:1px solid var(--border-subtle);
  border-radius:var(--radius);padding:24px;
  transition:border-color 0.2s,box-shadow 0.2s;
  animation:fadeUp 0.5s ease both;
}
.card:hover{border-color:var(--border);box-shadow:0 8px 32px rgba(0,0,0,0.2)}
.card-hdr{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:18px;
}
.card-title{
  font-size:10px;text-transform:uppercase;letter-spacing:1.5px;
  color:var(--text-muted);font-weight:600;
}
.card-badge{
  font-size:10px;font-weight:600;font-family:var(--font-mono);
  padding:3px 8px;border-radius:4px;
}

/* ============ GRID LAYOUTS ============ */
.row-2{display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-bottom:20px}
.row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:20px}
.row-2eq{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}

/* ============ LAUNCH HERO ============ */
.launch-hero{
  display:flex;gap:32px;align-items:center;
}
.launch-gauge{position:relative;flex-shrink:0}
.launch-gauge svg{display:block}
.launch-center{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  text-align:center;
}
.launch-days{font-size:44px;font-weight:800;font-family:var(--font-mono);color:var(--accent);line-height:1}
.launch-days-label{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-muted);margin-top:2px}
.launch-info{flex:1}
.launch-title{font-size:22px;font-weight:700;margin-bottom:2px}
.launch-subtitle{font-size:13px;color:var(--text-secondary);margin-bottom:14px}
.launch-prices{display:flex;gap:12px;margin-bottom:16px}
.price-tag{
  padding:5px 12px;border-radius:var(--radius-xs);font-size:11px;font-weight:600;
  font-family:var(--font-mono);background:var(--bg-elevated);border:1px solid var(--border);
}
.price-tag span{color:var(--text-muted);font-weight:400;margin-right:4px}

/* ============ CHECKLIST ============ */
.checklist{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px}
.check-item{
  display:flex;align-items:center;gap:8px;
  padding:5px 0;font-size:12px;
}
.check-icon{width:16px;height:16px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.check-icon.done{background:var(--green-glow);color:var(--green)}
.check-icon.todo{background:var(--bg-elevated);color:var(--text-muted)}
.check-text{color:var(--text-secondary)}
.check-text.done{color:var(--text-muted);text-decoration:line-through}

/* ============ PROGRESS ============ */
.prog-wrap{width:100%;height:6px;background:var(--bg-elevated);border-radius:3px;overflow:hidden}
.prog-fill{height:100%;border-radius:3px;position:relative;transition:width 1.2s cubic-bezier(0.4,0,0.2,1)}
.prog-accent{background:linear-gradient(90deg,var(--accent),#FF8A5C)}
.prog-green{background:linear-gradient(90deg,var(--green),#6EE7B7)}
.prog-blue{background:linear-gradient(90deg,var(--blue),#93C5FD)}

/* ============ METRIC ROWS ============ */
.m-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle)}
.m-row:last-child{border-bottom:none}
.m-label{font-size:12px;color:var(--text-secondary)}
.m-val{font-size:15px;font-weight:700;font-family:var(--font-mono)}
.m-val.accent{color:var(--accent)}
.m-val.green{color:var(--green)}
.m-val.red{color:var(--red)}
.m-val.blue{color:var(--blue)}
.m-delta{font-size:10px;margin-left:6px;font-weight:500;font-family:var(--font-mono)}
.m-delta.up{color:var(--green)}
.m-delta.dn{color:var(--red)}
.m-delta.flat{color:var(--text-muted)}

/* ============ FUNNEL ============ */
.funnel{display:flex;flex-direction:column;gap:8px}
.funnel-stage{display:flex;align-items:center;gap:12px}
.funnel-label{font-size:11px;color:var(--text-secondary);width:80px;flex-shrink:0;text-align:right}
.funnel-bar-wrap{flex:1;height:28px;background:var(--bg-elevated);border-radius:var(--radius-xs);overflow:hidden;position:relative}
.funnel-bar{
  height:100%;border-radius:var(--radius-xs);
  display:flex;align-items:center;padding:0 10px;
  font-size:11px;font-weight:600;font-family:var(--font-mono);color:#fff;
  transition:width 1s cubic-bezier(0.4,0,0.2,1);
  min-width:fit-content;
}
.funnel-bar.f-accent{background:linear-gradient(90deg,var(--accent),#FF8A5C)}
.funnel-bar.f-blue{background:linear-gradient(90deg,var(--blue),#60A5FA)}
.funnel-bar.f-purple{background:linear-gradient(90deg,var(--purple),#A78BFA)}
.funnel-bar.f-green{background:linear-gradient(90deg,var(--green),#6EE7B7)}
.funnel-note{font-size:10px;color:var(--text-muted);white-space:nowrap}

/* ============ MODEL TIERS ============ */
.tier{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--border-subtle)}
.tier:last-child{border-bottom:none}
.tier-dot{width:22px;text-align:center;font-size:12px;flex-shrink:0}
.tier-name{font-size:12px;font-weight:600}
.tier-req{font-size:10px;color:var(--text-muted);font-family:var(--font-mono)}
.tier.t-current{background:var(--accent-subtle);margin:0 -12px;padding:9px 12px;border-radius:var(--radius-sm);border-bottom:none}
.tier.t-current .tier-dot{color:var(--accent)}
.tier.t-current .tier-name{color:var(--accent)}
.tier.t-unlocked .tier-dot{color:var(--green)}
.tier.t-locked .tier-dot{color:var(--text-muted)}
.tier.t-locked .tier-name{color:var(--text-muted)}

/* ============ WORK QUEUE ============ */
.wq-header{display:flex;gap:12px;margin-bottom:14px}
.wq-stat{
  padding:4px 10px;border-radius:var(--radius-xs);font-size:11px;font-weight:600;
  font-family:var(--font-mono);
}
.wq-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-subtle)}
.wq-item:last-child{border-bottom:none}
.wq-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.wq-dot.d-done{background:var(--green)}
.wq-dot.d-active{background:var(--accent);box-shadow:0 0 8px rgba(216,90,48,0.4);animation:pulse-g 2s ease-in-out infinite}
.wq-dot.d-queued{background:var(--text-muted)}
.wq-task{font-size:12px;font-weight:500;flex:1;color:var(--text-primary)}
.wq-task.done{color:var(--text-muted);text-decoration:line-through}
.wq-pri{font-size:9px;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;padding:2px 6px;border-radius:3px}
.wq-pri.p-high{color:var(--accent);background:var(--accent-subtle)}
.wq-pri.p-med{color:var(--blue);background:var(--blue-glow)}
.wq-pri.p-low{color:var(--text-muted);background:var(--bg-elevated)}
.wq-meta{font-size:10px;color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap}

/* ============ ACTIVITY FEED ============ */
.feed-date{font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;font-weight:600;padding:10px 0 6px;border-bottom:1px solid var(--border-subtle);margin-bottom:2px}
.feed-item{display:flex;align-items:flex-start;gap:10px;padding:7px 0;font-size:12px}
.feed-icon{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0}
.fi-tweet{background:var(--blue-glow);color:var(--blue)}
.fi-deploy{background:var(--green-glow);color:var(--green)}
.fi-system{background:var(--bg-elevated);color:var(--text-muted)}
.fi-content{background:rgba(139,92,246,0.12);color:var(--purple)}
.fi-alert{background:rgba(245,158,11,0.12);color:var(--yellow)}
.feed-time{color:var(--text-muted);font-family:var(--font-mono);font-size:10px;min-width:52px;padding-top:1px}
.feed-action{color:var(--text-secondary);line-height:1.4}

/* ============ CHART ============ */
.chart-wrap{position:relative;height:160px;margin-top:8px}
.chart-wrap canvas{width:100%!important;height:100%!important}

/* ============ FOOTER ============ */
.dash-footer{
  text-align:center;padding:20px;margin-top:12px;
  font-size:10px;color:var(--text-muted);
  border-top:1px solid var(--border-subtle);
}

/* ============ RESPONSIVE ============ */
@media(max-width:1024px){
  .sidebar{position:relative;width:100%;flex-direction:row;flex-wrap:wrap;padding:16px;gap:12px;border-right:none;border-bottom:1px solid var(--border-subtle)}
  .sb-brand{margin-bottom:0}
  .sb-sub,.sb-section,.sb-footer{display:none}
  .main{margin-left:0;padding:16px}
  .cmd-strip{grid-template-columns:repeat(2,1fr)}
  .row-2,.row-2eq{grid-template-columns:1fr}
  .row-3{grid-template-columns:1fr}
  .launch-hero{flex-direction:column;text-align:center}
  .launch-prices{justify-content:center}
  .checklist{grid-template-columns:1fr}
}
@media(max-width:600px){
  .cmd-strip{grid-template-columns:1fr}
  .cmd-value{font-size:28px}
}
</style>
</head>
<body>
<div class="shell">

<!-- ======== SIDEBAR ======== -->
<nav class="sidebar">
  <div class="sb-brand">
    <div class="sb-logo">F</div>
    <div class="sb-title">FORGE</div>
  </div>
  <div class="sb-sub">Autonomous AI Agent</div>

  <div class="sb-status">
    <div class="sb-dot sb-dot-${DATA.system.status}"></div>
    <span class="sb-status-text">${DATA.system.status === "online" ? "Online" : DATA.system.status === "degraded" ? "Degraded" : "Offline"}</span>
    <span class="sb-status-model">${DATA.system.model}</span>
  </div>

  <div class="sb-section">
    <div class="sb-section-title">System</div>
    <div class="sb-metric"><div class="sb-metric-label">Uptime</div><div class="sb-metric-value">${DATA.system.uptimeDays}d ${DATA.system.uptimeHours}h</div></div>
    <div class="sb-metric"><div class="sb-metric-label">Heartbeat</div><div class="sb-metric-value">${DATA.system.heartbeatInterval}</div></div>
    <div class="sb-metric"><div class="sb-metric-label">Sessions Today</div><div class="sb-metric-value">${DATA.system.sessionsToday}</div></div>
    <div class="sb-metric"><div class="sb-metric-label">Skills Deployed</div><div class="sb-metric-value">${DATA.system.skillsDeployed}</div></div>
  </div>

  <div class="sb-section">
    <div class="sb-section-title">Platform Health</div>
    <div class="sb-health">
      ${DATA.platforms.map(p => {
        const dotCls = p.status === "healthy" ? "h-ok" : p.status === "degraded" ? "h-warn" : p.status === "down" ? "h-err" : "h-pending";
        return `<div class="sb-health-item">
          <div class="sb-health-dot ${dotCls}"></div>
          <span>${p.name}</span>
          <span class="sb-health-latency">${p.latency}</span>
        </div>`;
      }).join("")}
    </div>
  </div>

  <div class="sb-footer">
    Born March 23, 2026<br>Wake Forest, NC<br>
    <span style="color:var(--accent)">forge-dashboard.lucasjamesoliver1.workers.dev</span>
  </div>
</nav>

<!-- ======== MAIN CONTENT ======== -->
<div class="main">

  <!-- COMMAND STRIP -->
  <div class="cmd-strip">
    <div class="cmd-card">
      <div class="cmd-label">Days to Launch</div>
      <div class="cmd-value v-accent">${daysLeft}</div>
      <div class="cmd-sub">${launchPct}% of timeline elapsed</div>
    </div>
    <div class="cmd-card">
      <div class="cmd-label">Net Position</div>
      <div class="cmd-value v-red">$${Math.abs(DATA.financial.netROI).toFixed(0)}</div>
      <div class="cmd-sub">${DATA.financial.netROI < 0 ? "invested, pre-revenue" : "net profit"}</div>
    </div>
    <div class="cmd-card">
      <div class="cmd-label">LinkedIn</div>
      <div class="cmd-value v-blue">${DATA.audience.linkedin.current.toLocaleString()}</div>
      <div class="cmd-delta ${linkedinDelta > 0 ? 'up' : linkedinDelta < 0 ? 'down' : 'flat'}">${linkedinDelta > 0 ? "+" : ""}${linkedinDelta || "0"} this week</div>
    </div>
    <div class="cmd-card">
      <div class="cmd-label">Daily Burn</div>
      <div class="cmd-value v-green">$${DATA.financial.dailyCost.toFixed(2)}</div>
      <div class="cmd-sub">$${DATA.financial.monthlyBurn.toFixed(0)}/mo burn rate</div>
    </div>
  </div>

  <!-- ROW: LAUNCH COMMAND + REVENUE ENGINE -->
  <div class="row-2" style="animation-delay:0.2s">

    <!-- LAUNCH COMMAND -->
    <div class="card" style="animation-delay:0.2s">
      <div class="card-hdr">
        <span class="card-title">CLARITY Launch Command</span>
        <span class="card-badge" style="color:var(--green);background:var(--green-glow)">${checkDone}/${checkTotal} ready</span>
      </div>
      <div class="launch-hero">
        <div class="launch-gauge">
          <svg viewBox="0 0 140 140" width="140" height="140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--bg-elevated)" stroke-width="8"/>
            <circle cx="70" cy="70" r="60" fill="none" stroke="var(--accent)" stroke-width="8"
              stroke-dasharray="${2 * Math.PI * 60}"
              stroke-dashoffset="${2 * Math.PI * 60 * (1 - launchPct / 100)}"
              stroke-linecap="round" transform="rotate(-90 70 70)"
              style="filter:drop-shadow(0 0 6px rgba(216,90,48,0.4))"/>
          </svg>
          <div class="launch-center">
            <div class="launch-days">${daysLeft}</div>
            <div class="launch-days-label">days</div>
          </div>
        </div>
        <div class="launch-info">
          <div class="launch-title">CLARITY: Kill the Hero</div>
          <div class="launch-subtitle">April 17, 2026 -- Book 1 of Build What Lasts</div>
          <div class="launch-prices">
            <div class="price-tag"><span>Kindle</span>$${DATA.clarity.pricing.kindle.toFixed(2)}</div>
            <div class="price-tag"><span>Paper</span>$${DATA.clarity.pricing.paperback.toFixed(2)}</div>
            <div class="price-tag"><span>Hard</span>$${DATA.clarity.pricing.hardcover.toFixed(2)}</div>
          </div>
          <div style="margin-bottom:6px">
            <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:4px">
              <span>Launch readiness</span><span>${checkPct}%</span>
            </div>
            <div class="prog-wrap"><div class="prog-fill prog-accent" style="width:${checkPct}%"></div></div>
          </div>
        </div>
      </div>
      <div style="margin-top:16px">
        <div class="checklist">
          ${DATA.clarity.checklist.map(c => `
            <div class="check-item">
              <div class="check-icon ${c.done ? 'done' : 'todo'}">${c.done ? '&#10003;' : ''}</div>
              <span class="check-text ${c.done ? 'done' : ''}">${c.item}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- REVENUE ENGINE -->
    <div class="card" style="animation-delay:0.25s">
      <div class="card-hdr">
        <span class="card-title">Revenue Engine</span>
        <span class="card-badge" style="color:var(--accent);background:var(--accent-subtle)">${roiMult}x ROI</span>
      </div>
      <div class="m-row">
        <span class="m-label">Total Invested</span>
        <span class="m-val accent">$${DATA.financial.totalInvested.toFixed(2)}</span>
      </div>
      <div class="m-row">
        <span class="m-label">Revenue</span>
        <span class="m-val ${DATA.financial.totalRevenue > 0 ? 'green' : ''}">$${DATA.financial.totalRevenue.toFixed(2)}</span>
      </div>
      <div class="m-row">
        <span class="m-label">Net ROI</span>
        <span class="m-val ${DATA.financial.netROI >= 0 ? 'green' : 'red'}">$${DATA.financial.netROI.toFixed(2)}</span>
      </div>
      <div class="m-row">
        <span class="m-label">Monthly Burn</span>
        <span class="m-val">$${DATA.financial.monthlyBurn.toFixed(2)}</span>
      </div>
      <div style="margin-top:16px">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:4px">Cost Trend (${costData.length}-day)</div>
        <div class="chart-wrap"><canvas id="costChart"></canvas></div>
      </div>

      <div style="margin-top:20px">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px">Revenue Pipeline</div>
        <div class="funnel">
          ${DATA.pipeline.stages.map((s, i) => {
            const colors = ["f-accent", "f-blue", "f-purple", "f-green"];
            const pct = maxPipeline > 0 ? Math.max(15, (s.count / maxPipeline) * 100) : 15;
            return `<div class="funnel-stage">
              <div class="funnel-label">${s.name}</div>
              <div class="funnel-bar-wrap">
                <div class="funnel-bar ${colors[i]}" style="width:${s.count > 0 ? pct : 15}%">${s.count > 0 ? s.count.toLocaleString() : "0"}</div>
              </div>
              <div class="funnel-note">${s.label}</div>
            </div>`;
          }).join("")}
        </div>
      </div>
    </div>
  </div>

  <!-- ROW: AUDIENCE + MODEL TIER + WORK QUEUE -->
  <div class="row-3" style="animation-delay:0.3s">

    <!-- AUDIENCE -->
    <div class="card" style="animation-delay:0.3s">
      <div class="card-hdr">
        <span class="card-title">Audience Growth</span>
        <span class="card-badge" style="color:var(--blue);background:var(--blue-glow)">${linkedinPct}% to 10K</span>
      </div>
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:4px">
          <span>LinkedIn: ${DATA.audience.linkedin.current.toLocaleString()} / ${DATA.audience.linkedin.target.toLocaleString()}</span>
          <span>${linkedinPct}%</span>
        </div>
        <div class="prog-wrap"><div class="prog-fill prog-blue" style="width:${linkedinPct}%"></div></div>
      </div>
      <div class="m-row">
        <span class="m-label">X @Forge_Builds</span>
        <span class="m-val">${DATA.audience.xForge.current || "--"}</span>
      </div>
      <div class="m-row">
        <span class="m-label">X @LucasJOliver_78</span>
        <span class="m-val">${DATA.audience.xLucas.current || "--"}</span>
      </div>
      <div class="m-row">
        <span class="m-label">Kit Subscribers</span>
        <span class="m-val">${DATA.audience.kitSubscribers.current || "--"}</span>
      </div>
      <div class="m-row">
        <span class="m-label">Total Posts (X)</span>
        <span class="m-val">${DATA.xPosts.totalAllTime}</span>
      </div>
    </div>

    <!-- MODEL TIER -->
    <div class="card" style="animation-delay:0.35s">
      <div class="card-hdr">
        <span class="card-title">Model Tier</span>
        <span class="card-badge" style="color:var(--accent);background:var(--accent-subtle)">${DATA.system.model}</span>
      </div>
      ${DATA.modelTiers.map(t => {
        const cls = t.current ? "t-current" : t.unlocked ? "t-unlocked" : "t-locked";
        return `<div class="tier ${cls}">
          <div class="tier-dot">${t.current ? "&#9679;" : t.unlocked ? "&#10003;" : "&#9675;"}</div>
          <div>
            <div class="tier-name">${t.name}</div>
            <div class="tier-req">${t.requirement}</div>
          </div>
        </div>`;
      }).join("")}
      <div style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:4px">
          <span>Next tier progress</span><span>${DATA.financial.totalRevenue > 0 ? Math.min(100, (DATA.financial.totalRevenue / (DATA.financial.totalInvested * 2) * 100)).toFixed(0) : 0}%</span>
        </div>
        <div class="prog-wrap"><div class="prog-fill prog-accent" style="width:${DATA.financial.totalRevenue > 0 ? Math.min(100, (DATA.financial.totalRevenue / (DATA.financial.totalInvested * 2) * 100)).toFixed(0) : 0}%"></div></div>
      </div>
    </div>

    <!-- WORK QUEUE -->
    <div class="card" style="animation-delay:0.4s">
      <div class="card-hdr">
        <span class="card-title">Work Queue</span>
      </div>
      <div class="wq-header">
        <div class="wq-stat" style="color:var(--green);background:var(--green-glow)">${qDone} done</div>
        <div class="wq-stat" style="color:var(--accent);background:var(--accent-subtle)">${qActive} active</div>
        <div class="wq-stat" style="color:var(--text-muted);background:var(--bg-elevated)">${qQueued} queued</div>
        <div class="wq-stat ${velDelta >= 0 ? '' : ''}" style="color:${velDelta >= 0 ? 'var(--green)' : 'var(--red)'};background:${velDelta >= 0 ? 'var(--green-glow)' : 'var(--red-glow)'}">
          ${velDelta >= 0 ? "+" : ""}${velDelta} vel
        </div>
      </div>
      ${DATA.workQueue.map(w => {
        const dotCls = w.status === "done" ? "d-done" : w.status === "active" ? "d-active" : "d-queued";
        const priCls = w.priority === "high" ? "p-high" : w.priority === "med" ? "p-med" : "p-low";
        return `<div class="wq-item">
          <div class="wq-dot ${dotCls}"></div>
          <div class="wq-task ${w.status === 'done' ? 'done' : ''}">${w.task}</div>
          <div class="wq-pri ${priCls}">${w.priority}</div>
          <div class="wq-meta">${w.est}</div>
        </div>`;
      }).join("")}
    </div>
  </div>

  <!-- ROW: ACTIVITY FEED -->
  <div class="card" style="animation-delay:0.45s;margin-bottom:20px">
    <div class="card-hdr">
      <span class="card-title">Activity Timeline</span>
      <span class="card-badge" style="color:var(--text-secondary);background:var(--bg-elevated)">${DATA.activityFeed.length} events</span>
    </div>
    ${(() => {
      // Group feed by date
      const groups = {};
      DATA.activityFeed.forEach(a => {
        const d = a.date || "Today";
        if (!groups[d]) groups[d] = [];
        groups[d].push(a);
      });
      return Object.entries(groups).map(([date, items]) => {
        const itemsHtml = items.map(a => {
          const iconCls = { tweet:"fi-tweet", deploy:"fi-deploy", system:"fi-system", content:"fi-content", alert:"fi-alert" }[a.type] || "fi-system";
          const icons = { tweet:"\u{1F4AC}", deploy:"\u26A1", system:"\u2699\uFE0F", content:"\u{1F4C4}", alert:"\u26A0\uFE0F" };
          return `<div class="feed-item">
            <div class="feed-icon ${iconCls}">${icons[a.type] || "\u2022"}</div>
            <div class="feed-time">${a.time}</div>
            <div class="feed-action">${a.action}</div>
          </div>`;
        }).join("");
        return `<div class="feed-date">${date}</div>${itemsHtml}`;
      }).join("");
    })()}
  </div>

  <div class="dash-footer">
    Forge v0.4 &middot; Born March 23, 2026 &middot; ${DATA.system.model} &middot; Earning its way to Claude<br>
    Auto-refreshes every 60s &middot; ${now.toISOString().slice(0, 19)} UTC
  </div>

</div>
</div>

<script>
// ---- Chart.js: Cost Trend ----
const ctx = document.getElementById('costChart');
if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ${JSON.stringify(costLabels)},
      datasets: [{
        data: ${JSON.stringify(costData)},
        borderColor: '#D85A30',
        backgroundColor: 'rgba(216,90,48,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#D85A30',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1A1F2B',
          borderColor: '#2A3040',
          borderWidth: 1,
          titleFont: { family: "'JetBrains Mono', monospace", size: 10 },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
          padding: 8,
          displayColors: false,
          callbacks: {
            label: (c) => '$' + c.parsed.y.toFixed(2)
          }
        }
      },
      scales: {
        x: {
          display: false,
          grid: { display: false }
        },
        y: {
          display: true,
          position: 'right',
          grid: { color: 'rgba(42,48,64,0.5)', drawBorder: false },
          ticks: {
            font: { family: "'JetBrains Mono', monospace", size: 9 },
            color: '#5A6478',
            callback: (v) => '$' + v,
            maxTicksLimit: 4,
          },
          border: { display: false },
        }
      },
      interaction: { intersect: false, mode: 'index' },
    }
  });
}

// ---- Auto-refresh ----
setTimeout(() => location.reload(), 60000);

// ---- Staggered card entrance ----
document.querySelectorAll('.card,.cmd-card').forEach((el, i) => {
  el.style.animationDelay = (i * 0.06) + 's';
});
</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  },
};