#!/usr/bin/env node
/**
 * render-review-to-html.js
 * Converts every .md file under review/ into a styled .html card Lucas can
 * actually review in the dashboard.
 * Run standalone or call from push-state.js before the review scan.
 *
 * Usage: node scripts/render-review-to-html.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.OPENCLAW_WORKSPACE ||
  (fs.existsSync('/home/node/.openclaw/workspace') ? '/home/node/.openclaw/workspace' : path.join(__dirname, '../../../data/workspace'));

const REVIEW_DIR = path.join(WORKSPACE, 'review');
const SKIPPED_DIRECTORIES = new Set(['archived-forge-content', 'rejected-duplicates']);
const RENDERER_MTIME = fs.statSync(__filename).mtimeMs;

// Parse YAML-ish frontmatter (simple key: value, no nested)
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
  return { meta, body: match[2] };
}

// Split markdown body into named sections by ## heading
function parseSections(body) {
  const sections = {};
  let current = '_intro';
  sections[current] = [];
  body.split('\n').forEach(line => {
    const h = line.match(/^#{1,3}\s+(.+)/);
    if (h) { current = h[1].trim(); sections[current] = []; }
    else sections[current].push(line);
  });
  return Object.fromEntries(
    Object.entries(sections).map(([k, v]) => [k, v.join('\n').trim()])
  );
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function mdToSimpleHtml(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function titleFromBody(body, fallback = 'Untitled') {
  const match = String(body || '').match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function accountBadge(account) {
  if (!account || account === 'multiple') {
    return `<span class="badge multi">Multiple Accounts</span>`;
  }
  const cls = account.includes('LucasJOliver') ? 'lucas' : 'forge';
  return `<span class="badge ${cls}">${escapeHtml(account)}</span>`;
}

function priorityColor(p) {
  const n = parseInt(p || 0);
  if (n >= 90) return '#22c55e';
  if (n >= 80) return '#f97316';
  return '#888';
}

// Fuzzy section lookup -- finds first key that starts with the given prefix (case-insensitive)
function findSection(sections, ...prefixes) {
  for (const prefix of prefixes) {
    const p = prefix.toLowerCase();
    const key = Object.keys(sections).find(k => k.toLowerCase().startsWith(p));
    if (key && sections[key].trim()) return sections[key].trim();
  }
  return '';
}

function collectMarkdownFiles(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
      collectMarkdownFiles(fullPath, results);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
}

// GUMROAD listing renderer
function renderGumroad(meta, body) {
  const title = escapeHtml(meta.title || 'Gumroad Listing');
  // Parse body line by line into labeled sections
  const lines = body.split('\n');
  let sections = {};
  let cur = '_intro', buf = [];
  lines.forEach(line => {
    const h = line.match(/^#+\s+(.+)/);
    if (h) { sections[cur] = buf.join('\n').trim(); cur = h[1].trim(); buf = []; }
    else buf.push(line);
  });
  sections[cur] = buf.join('\n').trim();

  const listingTitle = sections['Title'] || meta.title || '';
  const tagline = sections['Tagline'] || '';
  const price = sections['Price'] || '$19';
  const description = sections['Description'] || '';
  const whatsInside = sections['What Is Inside'] || sections['What is inside'] || '';
  const whoForSec = sections['Who This Is For'] || sections['Who this is for'] || '';
  const aboutSec = sections['About Forge'] || '';
  const notesSec = sections['Sequence Notes for Lucas'] || sections['Note'] || '';

  // Render chapter list
  const chapterLines = whatsInside.split('\n').filter(l => l.trim().startsWith('Chapter'));
  const chaptersHtml = chapterLines.map(l => {
    const m = l.match(/Chapter\s+(\d+):\s+(.+)/i);
    if (!m) return '';
    return `<div class="chapter-item"><div class="ch-num">Ch ${m[1]}</div><div class="ch-title">${escapeHtml(m[2])}</div></div>`;
  }).join('');

  // Render audience bullets
  const audienceLines = whoForSec.split('\n').filter(l => l.trim() && !l.match(/^#+/));
  const audienceHtml = audienceLines.map(l => `<div class="for-item">${escapeHtml(l.replace(/^[-*]\s*/, ''))}</div>`).join('');

  const descHtml = description.split('\n\n').map(p => `<p>${mdToSimpleHtml(p.trim())}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:32px;max-width:860px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;background:#7c3aed;color:#fff;letter-spacing:.05em}
.priority{color:#22c55e;font-size:13px;font-weight:700}
.product-title{font-size:38px;font-weight:800;line-height:1.1;letter-spacing:-0.02em;margin-bottom:12px}
.tagline{font-size:17px;color:#999;margin-bottom:24px;line-height:1.5}
.price-badge{display:inline-block;background:#22c55e;color:#000;font-size:28px;font-weight:800;padding:10px 24px;border-radius:10px;margin-bottom:32px}
.section{margin-bottom:28px}
.section-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#444;margin-bottom:12px;border-bottom:1px solid #1a1a1a;padding-bottom:6px}
.desc p{font-size:15px;line-height:1.75;color:#bbb;margin-bottom:12px}
.chapter-item{display:flex;gap:14px;background:#111;border:1px solid #1e1e1e;border-radius:8px;padding:12px 16px;margin-bottom:6px}
.ch-num{font-size:11px;font-weight:700;color:#555;min-width:32px;padding-top:2px}
.ch-title{font-size:13px;color:#ddd;line-height:1.4}
.for-item{display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#bbb;margin-bottom:8px}
.for-item::before{content:"";width:5px;height:5px;background:#f97316;border-radius:50%;flex-shrink:0;margin-top:6px}
.about{background:#0d0d1a;border:1px solid #1a1a2e;border-radius:10px;padding:18px 20px}
.about p{font-size:13px;color:#8888cc;line-height:1.7}
.notes{background:#1a1a0a;border:1px solid #2a2a1a;border-radius:10px;padding:16px 20px}
.notes p{font-size:13px;color:#fde68a;line-height:1.6}
.copy-btn{background:#1a1a1a;border:1px solid #2a2a2a;color:#666;font-size:11px;padding:6px 14px;border-radius:6px;cursor:pointer;margin-top:8px;display:inline-block}
.copy-btn:hover{color:#fff}
</style></head>
<body>
<div class="header"><span class="badge">Gumroad Listing -- APPROVE FIRST</span><div class="priority">Priority 99/100</div></div>
<div class="product-title">${escapeHtml(listingTitle || title)}</div>
<div class="tagline">${escapeHtml(tagline)}</div>
<div class="price-badge">${escapeHtml(price)}</div>
${description ? `<div class="section"><div class="section-label">Description</div><div class="desc">${descHtml}</div><button class="copy-btn" onclick="navigator.clipboard.writeText(document.querySelector('.desc').innerText)">Copy Description</button></div>` : ''}
${chaptersHtml ? `<div class="section"><div class="section-label">What Is Inside</div>${chaptersHtml}</div>` : ''}
${audienceHtml ? `<div class="section"><div class="section-label">Who This Is For</div>${audienceHtml}</div>` : ''}
${aboutSec ? `<div class="section"><div class="section-label">About Forge</div><div class="about"><p>${mdToSimpleHtml(aboutSec)}</p></div></div>` : ''}
${notesSec ? `<div class="section"><div class="section-label">Notes for Lucas</div><div class="notes"><p>${mdToSimpleHtml(notesSec)}</p></div></div>` : ''}
</body></html>`;
}

// MULTI-POST renderer (triple-threat, lucas-crossovers, etc.)
function renderMultiPost(meta, sections) {
  const title = escapeHtml(meta.title || 'Post Collection');
  const account = meta.target_account || meta.account || '@Forge_Builds';
  const priority = meta.priority || '?';
  const postKeys = Object.keys(sections).filter(k => k.match(/^Post \d+/i));
  const noteKey = Object.keys(sections).find(k => k.toLowerCase().startsWith('note'));
  const CSS = `*{margin:0;padding:0;box-sizing:border-box}html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px;max-width:860px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
.badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;letter-spacing:.05em}
.badge.forge{background:#f97316;color:#000}.badge.lucas{background:#3b82f6;color:#fff}
.priority{color:#888;font-size:12px}.priority span{font-weight:700;font-size:14px}
h1{font-size:18px;font-weight:700;margin-bottom:20px}
.post-block{background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:18px 20px;margin-bottom:12px;position:relative}
.post-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:8px}
.post-block p{font-size:14px;line-height:1.7;color:#ddd;white-space:pre-line}
.copy-btn{position:absolute;top:14px;right:14px;background:#1e1e1e;border:1px solid #2a2a2a;color:#666;font-size:10px;padding:3px 8px;border-radius:5px;cursor:pointer}
.copy-btn:hover{color:#fff}
.note-box{background:#1a1a0a;border:1px solid #2a2a1a;border-radius:8px;padding:14px 18px;margin-top:16px}
.note-box p{font-size:12px;color:#fde68a;line-height:1.6}`;

  const postsHtml = postKeys.map(k => {
    const content = sections[k].trim();
    return `<div class="post-block">
<div class="post-label">${escapeHtml(k)}</div>
<button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<p>${mdToSimpleHtml(content)}</p>
</div>`;
  }).join('');

  const noteHtml = noteKey && sections[noteKey] ? `<div class="note-box"><p>${mdToSimpleHtml(sections[noteKey])}</p></div>` : '';
  const cls = account.includes('LucasJOliver') ? 'lucas' : 'forge';

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${CSS}</style></head><body>
<div class="header"><span class="badge ${cls}">${escapeHtml(account)}</span><div class="priority">Priority <span style="color:${priorityColor(priority)}">${priority}</span>/100</div></div>
<h1>${title}</h1>
${postsHtml}
${noteHtml}
</body></html>`;
}

// CALENDAR renderer
function renderCalendar(meta, body) {
  const titleText = meta.title || titleFromBody(body, 'Launch Calendar');
  const subtitleText = titleFromBody(body, '$809 Mistake Guide');
  const title = escapeHtml(titleText);
  const subtitle = escapeHtml(subtitleText);
  // Parse day entries: lines starting with ### date
  const lines = body.split('\n');
  let weeks = [];
  let currentWeek = null;
  let currentDay = null;
  let buf = [];

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentWeek) weeks.push(currentWeek);
      currentWeek = { label: line.replace(/^#+\s*/, ''), days: [] };
    } else if (line.startsWith('### ')) {
      if (currentDay) { currentDay.body = buf.join('\n').trim(); if (currentWeek) currentWeek.days.push(currentDay); }
      currentDay = { heading: line.replace(/^#+\s*/, ''), body: '' };
      buf = [];
    } else {
      buf.push(line);
    }
  });
  if (currentDay) { currentDay.body = buf.join('\n').trim(); if (currentWeek) currentWeek.days.push(currentDay); }
  if (currentWeek) weeks.push(currentWeek);

  const CSS = `*{margin:0;padding:0;box-sizing:border-box}html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:28px;max-width:900px;margin:0 auto}
h1{font-size:22px;font-weight:800;margin-bottom:6px}
.subtitle{color:#555;font-size:13px;margin-bottom:28px}
.week-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#444;margin:24px 0 10px;border-bottom:1px solid #1a1a1a;padding-bottom:6px}
.day-row{display:flex;gap:14px;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:12px 16px;margin-bottom:6px}
.day-row.launch-day{border-color:#22c55e;background:#001a0a}
.date-col{min-width:88px}
.date{font-size:13px;font-weight:700}
.day-num{font-size:11px;color:#444}
.content-col{flex:1}
.post-title{font-size:13px;color:#e0e0e0;margin-bottom:5px;font-weight:500}
.body-text{font-size:12px;color:#666;line-height:1.5}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}
.tag{font-size:10px;padding:2px 7px;border-radius:99px;font-weight:700}
.tag.forge{background:#3a1500;color:#f97316}.tag.lucas{background:#001233;color:#60a5fa}
.tag.launch{background:#00200a;color:#22c55e}.tag.decision{background:#1a001a;color:#c084fc}`;

  const weeksHtml = weeks.map(w => {
    const daysHtml = w.days.map(d => {
      const isLaunch = d.heading.includes('Apr 17') || d.heading.toLowerCase().includes('launch day');
      const bodyLines = d.body.split('\n').filter(l => l.trim());
      const postLine = bodyLines[0] || '';
      const isForge = postLine.toLowerCase().includes('@forge_builds') || !postLine.toLowerCase().includes('@lucas');
      const isLucas = postLine.toLowerCase().includes('@lucasolivier') || postLine.toLowerCase().includes('lucas');
      const needsApproval = postLine.toLowerCase().includes('approval') || postLine.toLowerCase().includes('needs approval');
      const bodyRest = bodyLines.slice(1).join(' ');

      return `<div class="day-row${isLaunch ? ' launch-day' : ''}">
<div class="date-col"><div class="date">${escapeHtml(d.heading.split(' (')[0])}</div><div class="day-num">${escapeHtml(d.heading.match(/\(([^)]+)\)/)?.[1] || '')}</div></div>
<div class="content-col">
<div class="post-title">${escapeHtml(postLine)}</div>
${bodyRest ? `<div class="body-text">${escapeHtml(bodyRest.slice(0, 120))}</div>` : ''}
<div class="tags">
${isForge && !isLaunch ? '<span class="tag forge">@Forge_Builds</span>' : ''}
${isLucas ? '<span class="tag lucas">@LucasJOliver</span>' : ''}
${isLaunch ? '<span class="tag launch">LAUNCH DAY</span>' : ''}
${needsApproval ? '<span class="tag decision">Needs Approval</span>' : ''}
</div>
</div>
</div>`;
    }).join('');
    return `<div class="week-label">${escapeHtml(w.label)}</div>${daysHtml}`;
  }).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${CSS}</style></head><body>
<h1>${title}</h1>
<div class="subtitle">${subtitle}</div>
${weeksHtml}
</body></html>`;
}

// POST-COPY card template
function renderPostCopy(meta, sections) {
  const title = escapeHtml(meta.title || 'Untitled Post');
  const account = meta.target_account || meta.account || '@Forge_Builds';
  const priority = meta.priority || '?';
  const lessonId = meta.lesson_id || '';
  const pairsCard = meta.pairs_with_card || '';
  const launchDay = meta.launch_day ? `Day ${meta.launch_day}` : '';
  const postDate = meta.post_date || '';
  const intro = sections._intro ? sections._intro.trim() : '';

  const single = findSection(sections, 'Forge Single') || intro;
  const thread = findSection(sections, 'Full Thread', 'Thread (6', 'Thread (5', 'Thread (7', 'Thread (4', 'Thread');
  const cta = findSection(sections, 'Suggested CTA', 'CTA');
  const note = findSection(sections, 'Note');

  // Parse thread into numbered items
  let threadHtml = '';
  if (thread) {
    const normalizedThread = thread
      .replace(/\*\*Tweet\s+(\d+\/\d+):\*\*/gi, '$1 ')
      .replace(/(^|\n)Tweet\s+(\d+\/\d+):/gi, '$1$2 ')
      .replace(/\*\*(\d+\/\d+):\*\*/g, '$1 ');
    const items = normalizedThread
      .split(/\n(?=(?:\d+\/\d+)\s)/)
      .map(item => item.trim())
      .filter(Boolean);
    threadHtml = items.map(item => {
      const numMatch = item.match(/^(\d+\/\d+)\s*/);
      const num = numMatch ? numMatch[1] : '';
      const text = item.replace(/^\d+\/\d+\s*/, '').trim();
      return `<div class="thread-item"><div class="thread-num">${escapeHtml(num)}</div><p>${mdToSimpleHtml(text)}</p></div>`;
    }).join('');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px 24px 28px;max-width:960px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;letter-spacing:.05em}
.badge.forge{background:#f97316;color:#000}
.badge.lucas{background:#3b82f6;color:#fff}
.badge.multi{background:#7c3aed;color:#fff}
.priority{color:#888;font-size:12px}.priority span{font-weight:700;font-size:15px}
.meta-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}
.tag{background:#1a1a1a;border:1px solid #222;padding:3px 10px;border-radius:6px;font-size:11px;color:#666}
h1{font-size:20px;font-weight:700;margin-bottom:24px;line-height:1.3}
.section-label{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#444;margin-bottom:10px}
.post-card{background:#161616;border:1px solid #222;border-radius:12px;padding:20px 24px;margin-bottom:20px;position:relative}
.post-card p{font-size:15px;line-height:1.7;color:#e0e0e0;white-space:pre-line}
.copy-btn{position:absolute;top:14px;right:14px;background:#1e1e1e;border:1px solid #2a2a2a;color:#666;font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer}
.copy-btn:hover{color:#fff;background:#252525}
.thread-list{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.thread-item{background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:14px 18px}
.thread-num{font-size:11px;color:#f97316;font-weight:700;margin-bottom:5px}
.thread-item p{font-size:13px;line-height:1.6;color:#bbb}
.cta-box{background:#0a1a0a;border:1px solid #1a2e1a;border-radius:10px;padding:14px 18px;margin-bottom:20px}
.cta-box p{font-size:13px;color:#86efac;line-height:1.5}
.note-box{background:#1a1a0a;border:1px solid #2a2a1a;border-radius:10px;padding:14px 18px;margin-bottom:20px}
.note-box p{font-size:13px;color:#fde68a;line-height:1.5}
.footer{border-top:1px solid #1a1a1a;padding-top:18px;display:flex;gap:20px;flex-wrap:wrap}
.footer-item{font-size:11px;color:#444}.footer-item span{color:#555;font-weight:600}
</style>
</head>
<body>
<div class="header">${accountBadge(account)}<div class="priority">Priority <span style="color:${priorityColor(priority)}">${priority}</span>/100</div></div>
<div class="meta-row">
${lessonId ? `<div class="tag">${escapeHtml(lessonId)}</div>` : ''}
${pairsCard ? `<div class="tag">Pairs: ${escapeHtml(pairsCard)}</div>` : ''}
${postDate ? `<div class="tag">${escapeHtml(postDate)}</div>` : ''}
${launchDay ? `<div class="tag">${escapeHtml(launchDay)}</div>` : ''}
</div>
<h1>${title}</h1>
${single ? `<div class="section-label">Forge Single</div>
<div class="post-card">
<button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
<p>${mdToSimpleHtml(single)}</p>
</div>` : ''}
${thread ? `<div class="section-label">Thread</div><div class="thread-list">${threadHtml}</div>` : ''}
${cta ? `<div class="section-label">CTA</div><div class="cta-box"><p>${mdToSimpleHtml(cta)}</p></div>` : ''}
${note ? `<div class="section-label">Notes</div><div class="note-box"><p>${mdToSimpleHtml(note)}</p></div>` : ''}
<div class="footer">
${lessonId ? `<div class="footer-item"><span>Lesson</span> ${escapeHtml(lessonId)}</div>` : ''}
<div class="footer-item"><span>Account</span> ${escapeHtml(account)}</div>
${launchDay ? `<div class="footer-item"><span>Launch slot</span> ${escapeHtml(launchDay)}</div>` : ''}
${pairsCard ? `<div class="footer-item"><span>Card</span> ${escapeHtml(pairsCard)}</div>` : ''}
<div class="footer-item"><span>Created by</span> Claude</div>
</div>
</body></html>`;
}

// GUIDE CHAPTER template
function renderChapter(meta, body) {
  const title = escapeHtml(meta.title || 'Untitled Chapter');
  const chapterNum = meta.chapter || '';
  const lessonId = meta.lesson_id || '';

  // Convert markdown body to simple HTML
  let html = body
    .split('\n')
    .map(line => {
      if (line.startsWith('## ')) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith('### ')) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith('# ')) return ''; // skip top title, we show it already
      if (line.startsWith('- [ ] ')) return `<div class="check-item"><div class="check-box"></div><span>${escapeHtml(line.slice(6))}</span></div>`;
      if (line.startsWith('- ')) return `<li>${escapeHtml(line.slice(2))}</li>`;
      if (line.match(/^```/)) return line.includes('```') && line.length > 3 ? '<pre class="code">' : '</pre>';
      if (line.trim() === '') return '<div class="spacer"></div>';
      return `<p>${mdToSimpleHtml(line)}</p>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:32px 32px 36px;max-width:780px;margin:0 auto}
.page-shell{background:#0a0a0a;min-height:100vh}
.chapter-header{position:relative;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #1a1a1a}
.chapter-num{font-size:100px;font-weight:800;color:#1a1a1a;position:absolute;top:-20px;right:0;line-height:1;letter-spacing:-4px}
.chapter-label{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#555;margin-bottom:8px}
.chapter-title{font-size:26px;font-weight:800;line-height:1.2;max-width:600px}
.lesson-tag{display:inline-block;background:#1a1a1a;border:1px solid #222;padding:3px 10px;border-radius:6px;font-size:11px;color:#555;margin-top:12px}
h2{font-size:18px;font-weight:700;color:#fff;margin:32px 0 12px;padding-top:4px}
h3{font-size:15px;font-weight:600;color:#ccc;margin:20px 0 8px}
p{font-size:15px;line-height:1.75;color:#c0c0c0;margin-bottom:12px}
li{font-size:15px;line-height:1.7;color:#c0c0c0;margin-left:20px;margin-bottom:6px}
.spacer{height:8px}
pre.code{background:#111;border:1px solid #222;border-radius:8px;padding:16px;font-size:13px;color:#86efac;overflow-x:auto;margin:16px 0;white-space:pre-wrap}
.check-item{display:flex;align-items:flex-start;gap:12px;margin:8px 0}
.check-box{width:18px;height:18px;border:2px solid #333;border-radius:4px;flex-shrink:0;margin-top:2px}
.check-item span{font-size:14px;color:#999;line-height:1.5}
.footer{border-top:1px solid #1a1a1a;margin-top:40px;padding-top:20px;font-size:12px;color:#444}
@media print{
  @page{size:A4;margin:0}
  html{
    background:#0a0a0a !important;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact
  }
  body{
    margin:0;
    padding:0;
    background:#0a0a0a !important;
    color:#111 !important;
    max-width:100% !important;
    min-height:100vh;
    width:100%;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact
  }
  .page-shell{background:#0a0a0a !important;min-height:100vh;padding:0}
  .chapter-header,.body-content,.footer{background:#0d1117 !important;color:#f3f6fb !important}
  .chapter-header,.footer{padding-left:0;padding-right:0}
  .body-content{max-width:100%;padding:14mm 16mm 0 16mm}
  .chapter-header{page-break-before:always;break-before:page;margin-bottom:24px;padding-bottom:18px}
  .chapter-header:first-of-type{page-break-before:auto;break-before:auto}
  .chapter-num{color:#202a35 !important}
  .chapter-label{color:#7d90a7 !important}
  .chapter-title{max-width:none}
  h2,h3,.check-item,pre.code,li,p{page-break-inside:avoid;break-inside:avoid}
  li{page-break-inside:avoid;break-inside:avoid}
  ul,ol{page-break-inside:avoid;break-inside:avoid}
  h2,h3{page-break-after:avoid;break-after:avoid}
  h2{padding-top:6mm;margin-top:8mm}
  h3{padding-top:3mm;margin-top:5mm}
  p{margin-top:4mm}
  h2,h3{color:#f5f8fc !important}
  p,li{color:#d4dbe5 !important}
  .check-item span{color:#d4dbe5 !important}
  pre.code{border-color:#273142 !important}
  .footer{border-top:1px solid #273142;padding-top:16px;color:#7d90a7 !important}
}
</style>
</head>
<body>
<div class="page-shell">
<div class="chapter-header">
${chapterNum ? `<div class="chapter-num">${chapterNum}</div>` : ''}
<div class="chapter-label">Chapter ${chapterNum || ''} of 10 -- The $809 Mistake Guide</div>
<div class="chapter-title">${title.replace(/^Chapter \d+: /, '')}</div>
${lessonId ? `<div class="lesson-tag">${escapeHtml(lessonId)}</div>` : ''}
</div>
<div class="body-content">${html}</div>
<div class="footer">Created by Claude &mdash; pending review</div>
</div>
</body></html>`;
}

// EMAIL template
function renderEmail(meta, body) {
  const title = escapeHtml(meta.title || titleFromBody(body, 'Email Sequence'));
  const html = body
    .split('\n')
    .map(line => {
      if (line.startsWith('# ')) return `<h2>${escapeHtml(line.slice(2))}</h2>`;
      if (line.startsWith('Subject: ')) return `<div class="subject-line"><span>Subject:</span> ${escapeHtml(line.slice(9))}</div>`;
      if (line.startsWith('Send: ')) return `<div class="send-when"><span>Send:</span> ${escapeHtml(line.slice(6))}</div>`;
      if (line.startsWith('---')) return '<hr>';
      if (line.trim() === '') return '<div class="spacer"></div>';
      return `<p>${mdToSimpleHtml(line)}</p>`;
    }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px 24px 28px;max-width:720px;margin:0 auto}
.header{background:#0d0d1a;border:1px solid #1a1a2e;border-radius:10px;padding:16px 20px;margin-bottom:28px}
.header h1{font-size:16px;font-weight:700;color:#c084fc}
h2{font-size:16px;font-weight:700;color:#fff;margin:28px 0 8px;padding-top:20px;border-top:1px solid #1a1a1a}
h2:first-of-type{border-top:none;margin-top:0}
.subject-line{background:#161616;border:1px solid #222;border-radius:8px;padding:10px 14px;margin:8px 0;font-size:13px;color:#fde68a}
.subject-line span{color:#555;font-weight:600;margin-right:8px}
.send-when{font-size:12px;color:#555;margin-bottom:12px}
.send-when span{font-weight:600}
p{font-size:14px;line-height:1.75;color:#bbb;margin-bottom:10px}
hr{border:none;border-top:1px solid #1a1a1a;margin:20px 0}
.spacer{height:6px}
</style>
</head>
<body>
<div class="header"><h1>${title}</h1></div>
${html}
</body></html>`;
}

function renderMarkdownDocument(meta, body, mdPath) {
  const title = escapeHtml(meta.title || titleFromBody(body, path.basename(mdPath || '', '.md') || 'Review Document'));
  const lines = String(body || '').split('\n');
  let inList = false;
  let inCode = false;
  let html = '';

  function closeList() {
    if (inList) {
      html += '</ul>';
      inList = false;
    }
  }

  lines.forEach((line) => {
    if (/^```/.test(line)) {
      closeList();
      if (!inCode) {
        html += '<pre class="code">';
        inCode = true;
      } else {
        html += '</pre>';
        inCode = false;
      }
      return;
    }

    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      return;
    }

    if (line.startsWith('# ')) {
      closeList();
      html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
      return;
    }
    if (line.startsWith('## ')) {
      closeList();
      html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
      return;
    }
    if (line.startsWith('### ')) {
      closeList();
      html += `<h3>${escapeHtml(line.slice(4))}</h3>`;
      return;
    }
    if (line.startsWith('- [x] ') || line.startsWith('- [ ] ')) {
      if (!inList) {
        html += '<ul class="check-list">';
        inList = true;
      }
      html += `<li>${mdToSimpleHtml(line.slice(6))}</li>`;
      return;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${mdToSimpleHtml(line.slice(2))}</li>`;
      return;
    }
    if (!line.trim()) {
      closeList();
      html += '<div class="spacer"></div>';
      return;
    }

    closeList();
    html += `<p>${mdToSimpleHtml(line)}</p>`;
  });

  closeList();
  if (inCode) {
    html += '</pre>';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:28px 28px 34px;max-width:860px;margin:0 auto}
.doc-shell{background:#101010;border:1px solid #1c1c1c;border-radius:18px;padding:26px 28px;box-shadow:0 24px 72px rgba(0,0,0,.28)}
.eyebrow{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#666;margin-bottom:14px}
h1{font-size:28px;font-weight:800;line-height:1.08;letter-spacing:-.03em;margin-bottom:18px}
h2{font-size:18px;font-weight:700;color:#fff;margin:24px 0 10px}
h3{font-size:15px;font-weight:700;color:#d0d0d0;margin:18px 0 8px}
p{font-size:14px;line-height:1.72;color:#d6d6d6;margin-bottom:10px}
ul{margin:8px 0 14px 20px}
li{font-size:14px;line-height:1.65;color:#c8c8c8;margin-bottom:6px}
.check-list li{list-style:'□  '}
pre.code{background:#0b1220;border:1px solid #1c2840;border-radius:10px;padding:16px;font-size:13px;line-height:1.6;color:#b8d5ff;overflow:auto;white-space:pre-wrap;margin:14px 0}
.spacer{height:10px}
</style>
</head>
<body>
  <div class="doc-shell">
    <div class="eyebrow">Rendered Markdown Review</div>
    ${html}
  </div>
</body>
</html>`;
}

function renderXThread(meta, body, sections) {
  const title = escapeHtml(meta.title || titleFromBody(body, 'X Thread Draft'));
  const account = meta.target_account || meta.account || '@Forge_Builds';
  const priority = meta.priority || '?';
  const note = findSection(sections, 'Posting Notes', 'Posting Instructions', 'Next Steps', 'Quality Check');
  const tweetEntries = Object.entries(sections)
    .filter(([key]) => /^tweet\s+\d+\/\d+/i.test(key))
    .map(([key, value]) => {
      const match = key.match(/(Tweet\s+\d+\/\d+):?\s*(.*)/i);
      return {
        label: match ? match[1] : key,
        heading: match && match[2] ? match[2] : '',
        body: String(value || '').trim(),
      };
    });

  const combinedThread = findSection(sections, 'Thread (5', 'Thread (6', 'Thread (7', 'Thread Structure');
  if (!tweetEntries.length && combinedThread) {
    combinedThread
      .replace(/\*\*Tweet\s+(\d+\/\d+):\*\*/gi, 'Tweet $1:\n')
      .split(/\n(?=Tweet\s+\d+\/\d+:)/i)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        const match = item.match(/^(Tweet\s+\d+\/\d+):\s*([\s\S]*)$/i);
        if (!match) return;
        tweetEntries.push({
          label: match[1],
          heading: '',
          body: match[2].trim(),
        });
      });
  }

  const threadHtml = tweetEntries.map((tweet) => `<div class="thread-item">
    <div class="thread-num">${escapeHtml(tweet.label)}</div>
    ${tweet.heading ? `<div class="thread-heading">${escapeHtml(tweet.heading)}</div>` : ''}
    <p>${mdToSimpleHtml(tweet.body)}</p>
  </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px 24px 30px;max-width:960px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
.badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;letter-spacing:.05em}
.badge.forge{background:#f97316;color:#000}
.badge.lucas{background:#3b82f6;color:#fff}
.badge.multi{background:#7c3aed;color:#fff}
.priority{color:#888;font-size:12px}.priority span{font-weight:700;font-size:15px}
h1{font-size:22px;font-weight:800;margin-bottom:22px;line-height:1.25}
.thread-list{display:flex;flex-direction:column;gap:12px}
.thread-item{background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:16px 18px}
.thread-num{font-size:11px;color:#f97316;font-weight:700;margin-bottom:6px;letter-spacing:.08em;text-transform:uppercase}
.thread-heading{font-size:15px;font-weight:700;color:#f3f3f3;margin-bottom:8px}
.thread-item p{font-size:14px;line-height:1.68;color:#d5d5d5}
.note-box{background:#1a1a0a;border:1px solid #2a2a1a;border-radius:10px;padding:14px 18px;margin-top:20px}
.note-box p{font-size:13px;color:#fde68a;line-height:1.6}
</style>
</head>
<body>
<div class="header">${accountBadge(account)}<div class="priority">Priority <span style="color:${priorityColor(priority)}">${priority}</span>/100</div></div>
<h1>${title}</h1>
<div class="thread-list">${threadHtml || `<div class="thread-item"><p>${mdToSimpleHtml(body)}</p></div>`}</div>
${note ? `<div class="note-box"><p>${mdToSimpleHtml(note)}</p></div>` : ''}
</body></html>`;
}

function detectTemplate(meta, body, mdPath, sections) {
  const normalizedPath = String(mdPath || '').toLowerCase();
  const normalizedBody = String(body || '').toLowerCase();
  const explicitType = String(meta.type || '').toLowerCase();
  const explicitTitle = String(meta.title || '').toLowerCase();

  if (explicitType === 'guide-chapter' || normalizedPath.includes('/mistake-guide-chapters/')) {
    return 'chapter';
  }

  if (explicitType === 'x-thread' || normalizedPath.includes('/x-threads/')) {
    return 'x-thread';
  }

  if (
    explicitType === 'email-sequence' ||
    explicitType === 'voiceover-scripts' ||
    explicitType === 'notebooklm-output' ||
    normalizedPath.includes('/email-sequences/') ||
    normalizedBody.includes('**subject:**') ||
    normalizedBody.includes('subject:') ||
    normalizedBody.includes('**body:**') ||
    normalizedBody.includes('send:') ||
    /email\s+\d+:/i.test(body)
  ) {
    return 'email';
  }

  if (
    explicitType === 'gumroad-copy' ||
    explicitTitle.includes('gumroad') ||
    normalizedPath.includes('gumroad-listing-copy')
  ) {
    return 'gumroad';
  }

  if (
    explicitType === 'calendar' ||
    explicitTitle.includes('launch calendar') ||
    normalizedPath.endsWith('/launch-calendar.md')
  ) {
    return 'calendar';
  }

  if (
    explicitType === 'multi-post' ||
    Object.keys(sections).some((key) => key.match(/^Post \d+/i)) ||
    normalizedPath.includes('triple-threat-singles') ||
    normalizedPath.includes('lucas-crossovers')
  ) {
    return 'multi-post';
  }

  if (
    explicitType === 'linkedin-post' ||
    normalizedPath.includes('linkedin-') ||
    explicitTitle.includes('linkedin')
  ) {
    return 'linkedin';
  }

  const hasPostCopySections = [
    'forge single',
    'full thread',
    'thread',
    'suggested cta',
    'cta',
    'note',
  ].some((prefix) => Object.keys(sections).some((key) => key.toLowerCase().startsWith(prefix)));

  if (!hasPostCopySections && !normalizedPath.includes('/x-threads/')) {
    return 'document';
  }

  return 'post-copy';
}

// LINKEDIN POST renderer
function renderLinkedin(meta, body) {
  const title = escapeHtml(meta.title || 'LinkedIn Post');
  const lessonId = meta.lesson_id || '';
  const charCount = meta.character_count || '';
  const account = meta.target_account || meta.account || '@LucasJOliver_78';
  const cls = account.includes('LucasJOliver') ? 'lucas' : 'forge';

  // Strip frontmatter markers, render paragraphs
  const paragraphs = body.split('\n\n').filter(p => p.trim());
  const bodyHtml = paragraphs.map(p => {
    const t = p.trim();
    if (!t) return '';
    // Hashtag line
    if (t.startsWith('#')) {
      const tags = t.split(/\s+/).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join(' ');
      return `<div class="hashtags">${tags}</div>`;
    }
    return `<p>${mdToSimpleHtml(t)}</p>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}html{background:#0a0a0a}
body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:24px;max-width:680px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.badge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;letter-spacing:.05em}
.badge.forge{background:#f97316;color:#000}.badge.lucas{background:#3b82f6;color:#fff}
.meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.tag{background:#1a1a1a;border:1px solid #222;padding:3px 10px;border-radius:6px;font-size:11px;color:#666}
.platform-badge{background:#0a66c2;color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:5px;letter-spacing:.05em}
h1{font-size:16px;font-weight:700;margin-bottom:20px;color:#bbb}
.post-body{background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:22px 24px;position:relative}
.post-body p{font-size:15px;line-height:1.75;color:#e0e0e0;margin-bottom:14px}
.post-body p:last-of-type{margin-bottom:0}
.copy-btn{position:absolute;top:14px;right:14px;background:#1e1e1e;border:1px solid #2a2a2a;color:#666;font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer}
.copy-btn:hover{color:#fff}
.hashtags{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px}
.tag-pill{font-size:12px;color:#0a66c2;font-weight:500}
.char-count{margin-top:14px;font-size:11px;color:#444;text-align:right}
.footer{border-top:1px solid #1a1a1a;padding-top:16px;margin-top:20px;display:flex;gap:16px;flex-wrap:wrap}
.footer-item{font-size:11px;color:#444}.footer-item span{color:#555;font-weight:600}
</style>
</head>
<body>
<div class="header">
  <span class="badge ${cls}">${escapeHtml(account)}</span>
  <span class="platform-badge">LinkedIn</span>
</div>
<div class="meta-row">
  ${lessonId ? `<div class="tag">${escapeHtml(lessonId)}</div>` : ''}
  ${charCount ? `<div class="tag">${escapeHtml(String(charCount))} chars</div>` : ''}
</div>
<h1>${title}</h1>
<div class="post-body">
  <button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.innerText.replace('Copy','').trim())">Copy</button>
  ${bodyHtml}
  ${charCount ? `<div class="char-count">${escapeHtml(String(charCount))} / 1300 chars</div>` : ''}
</div>
<div class="footer">
  ${lessonId ? `<div class="footer-item"><span>Lesson</span> ${escapeHtml(lessonId)}</div>` : ''}
  <div class="footer-item"><span>Account</span> ${escapeHtml(account)}</div>
  <div class="footer-item"><span>Created by</span> Forge</div>
</div>
</body></html>`;
}

// Main render loop
let rendered = 0;
let skipped = 0;

collectMarkdownFiles(REVIEW_DIR).forEach((mdPath) => {
    const file = path.relative(REVIEW_DIR, mdPath);
    const htmlPath = mdPath.replace(/\.md$/, '.html');

    // Skip if HTML is newer than MD (already up to date)
    if (fs.existsSync(htmlPath)) {
      const mdMtime = fs.statSync(mdPath).mtimeMs;
      const htmlMtime = fs.statSync(htmlPath).mtimeMs;
      if (htmlMtime >= mdMtime && htmlMtime >= RENDERER_MTIME) { skipped++; return; }
    }

    const raw = fs.readFileSync(mdPath, 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    const sections = parseSections(body);
    const template = detectTemplate(meta, body, mdPath, sections);

    let html;
    if (template === 'chapter') {
      html = renderChapter(meta, body);
    } else if (template === 'email') {
      html = renderEmail(meta, body);
    } else if (template === 'gumroad') {
      html = renderGumroad(meta, body);
    } else if (template === 'calendar') {
      html = renderCalendar(meta, body);
    } else if (template === 'multi-post') {
      html = renderMultiPost(meta, sections);
    } else if (template === 'linkedin') {
      html = renderLinkedin(meta, body);
    } else if (template === 'x-thread') {
      html = renderXThread(meta, body, sections);
    } else if (template === 'document') {
      html = renderMarkdownDocument(meta, body, mdPath);
    } else {
      html = renderPostCopy(meta, sections);
    }

    fs.writeFileSync(htmlPath, html);
    console.log(`rendered: ${file} -> ${path.basename(htmlPath)}`);
    rendered++;
});

console.log(`\ndone. rendered=${rendered} skipped=${skipped}`);
