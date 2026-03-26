#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.OPENCLAW_WORKSPACE ||
  (fs.existsSync('/home/node/.openclaw/workspace') ? '/home/node/.openclaw/workspace' : path.join(__dirname, '../../../data/workspace'));
const REVIEW_DIR = path.join(WORKSPACE, 'review');
const REPORT_PATH = path.join(WORKSPACE, 'data/render-validation-report.json');
const FIX_MODE = process.argv.includes('--fix');
const MIN_VISIBLE_CHARS = 200;
const KNOWN_TYPES = new Set([
  'guide-chapter',
  'post-copy',
  'email-sequence',
  'gumroad-copy',
  'calendar',
  'linkedin-post',
  'multi-post',
  'voiceover-scripts',
  'notebooklm-output',
]);
const EXCLUDED_DIRECTORIES = new Set(['archived-forge-content']);

function parseFrontmatter(content) {
  const input = String(content || '');
  if (!input.startsWith('---\n')) {
    return { attributes: {}, body: input };
  }

  const closingIndex = input.indexOf('\n---', 4);
  if (closingIndex === -1) {
    return { attributes: {}, body: input };
  }

  const attributes = {};
  for (const line of input.slice(4, closingIndex).split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    attributes[key] = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }

  return {
    attributes,
    body: input.slice(closingIndex + 4).replace(/^\n+/, ''),
  };
}

function walkHtmlFiles(dirPath, results) {
  if (!fs.existsSync(dirPath)) {
    return results;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRECTORIES.has(entry.name)) {
        walkHtmlFiles(fullPath, results);
      }
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      results.push(fullPath);
    }
  }

  return results;
}

function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function visibleTextFromHtml(html) {
  return decodeEntities(
    String(html || '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, ' ')
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMetadataOnlyText(text) {
  return String(text || '')
    .replace(/\b(review preview|review copy|untitled post|untitled chapter|post collection|decision|notes|cta|thread|forge single|metadata|variant hidden)\b/gi, ' ')
    .replace(/\b(account|priority|pairs|pair|lesson|created by|launch slot|status|type|size|modified|created|synced)\b/gi, ' ')
    .replace(/@\w+/g, ' ')
    .replace(/\b(?:forge_builds|lucasjoliver[_0-9]*)\b/gi, ' ')
    .replace(/\b[a-z0-9._-]+\.(?:html|md|png|jpg|jpeg|webp|pdf)\b/gi, ' ')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ')
    .replace(/\b\d+\/100\b/g, ' ')
    .replace(/\bday\s+[-a-z0-9]+\b/gi, ' ')
    .replace(/[|:()[\],]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function touchFile(filePath) {
  const now = new Date();
  fs.utimesSync(filePath, now, now);
}

function ensureReportDirectory() {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
}

function relativeToWorkspace(filePath) {
  return path.relative(WORKSPACE, filePath) || path.basename(filePath);
}

function visibleTextFromMarkdown(markdown) {
  return decodeEntities(
    String(markdown || '')
      .replace(/^---\n[\s\S]*?\n---\n?/m, ' ')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/^\s*\d+[\.)]\s+/gm, '')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function validateFile(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const visibleText = visibleTextFromHtml(html);
  const visibleCharCount = visibleText.length;
  const mdPath = htmlPath.replace(/\.html$/i, '.md');
  const mdExists = fs.existsSync(mdPath);
  const markdown = mdExists ? fs.readFileSync(mdPath, 'utf8') : '';
  const frontmatter = mdExists ? parseFrontmatter(markdown).attributes : {};
  const type = String(frontmatter.type || '').trim();
  const stripped = stripMetadataOnlyText(visibleText);
  const flags = [];
  const markdownVisibleCharCount = mdExists ? visibleTextFromMarkdown(markdown).length : 0;
  const hasShortButRealContent = visibleCharCount >= 40 && markdownVisibleCharCount >= MIN_VISIBLE_CHARS;

  if (visibleCharCount < MIN_VISIBLE_CHARS && !hasShortButRealContent) {
    flags.push({
      kind: 'BLANK',
      reason: 'Visible text below minimum threshold',
    });
  } else if (stripped.length < 60) {
    flags.push({
      kind: 'BLANK',
      reason: 'Visible text appears to contain metadata only',
    });
  }

  if (type && !KNOWN_TYPES.has(type)) {
    flags.push({
      kind: 'UNKNOWN_TYPE',
      reason: 'Frontmatter type is not covered by known renderer types',
    });
  }

  return {
    path: htmlPath,
    relativePath: relativeToWorkspace(htmlPath),
    mdPath: mdExists ? mdPath : null,
    mdRelativePath: mdExists ? relativeToWorkspace(mdPath) : null,
    type: type || null,
    visibleCharCount,
    flags,
  };
}

function main() {
  const htmlFiles = walkHtmlFiles(REVIEW_DIR, []);
  const results = htmlFiles.map(validateFile);
  const flagged = results.filter((entry) => entry.flags.length);
  const blank = flagged.filter((entry) => entry.flags.some((flag) => flag.kind === 'BLANK'));
  const unknownTypes = flagged.filter((entry) => entry.flags.some((flag) => flag.kind === 'UNKNOWN_TYPE'));

  if (FIX_MODE) {
    for (const entry of flagged) {
      if (entry.mdPath && fs.existsSync(entry.mdPath)) {
        touchFile(entry.mdPath);
      }
    }
  }

  ensureReportDirectory();
  fs.writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    workspace: WORKSPACE,
    scannedHtmlFiles: htmlFiles.length,
    summary: {
      ok: htmlFiles.length - flagged.length,
      blank: blank.length,
      unknownTypes: unknownTypes.length,
      fixApplied: FIX_MODE,
    },
    flaggedFiles: flagged.map((entry) => ({
      path: entry.path,
      relativePath: entry.relativePath,
      mdPath: entry.mdPath,
      mdRelativePath: entry.mdRelativePath,
      type: entry.type,
      visibleCharCount: entry.visibleCharCount,
      flags: entry.flags,
    })),
  }, null, 2) + '\n', 'utf8');

  console.log(`${htmlFiles.length - flagged.length} files OK | ${blank.length} files BLANK | ${unknownTypes.length} unknown types`);
  for (const entry of flagged) {
    const reasons = entry.flags.map((flag) => `${flag.kind}: ${flag.reason}`).join(' | ');
    console.log(`[${entry.flags.map((flag) => flag.kind).join(',')}] ${entry.relativePath} | type=${entry.type || 'missing'} | visible=${entry.visibleCharCount} | ${reasons}`);
  }

  if (blank.length > 0) {
    process.exitCode = 1;
  }
}

main();
