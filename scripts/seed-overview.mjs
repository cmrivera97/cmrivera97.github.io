#!/usr/bin/env node
/**
 * seed-overview.mjs
 *
 * One-off backfill: adds an `overview` field to every project JSON file that
 * lacks one. Idempotent — running a second time changes nothing.
 *
 * Usage:
 *   node scripts/seed-overview.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROJECTS_DIR = join(ROOT, 'src', 'content', 'projects');

// Desired top-level key order. Keys absent in a given file are skipped.
const KEY_ORDER = [
  'slug',
  'kind',
  'category',
  'title',
  'subtitle',
  'overview',
  'studio',
  'role',
  'sectors',
  'year',
  'cover',
  'gallery',
];

/** Recursively collect every .json path under a directory. */
function collectJson(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectJson(full));
    } else if (entry.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}

/** Rebuild an object in KEY_ORDER, then append any remaining keys. */
function reorder(data) {
  const ordered = {};
  for (const key of KEY_ORDER) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      ordered[key] = data[key];
    }
  }
  // Append any keys that are not in KEY_ORDER (future-proof).
  for (const key of Object.keys(data)) {
    if (!Object.prototype.hasOwnProperty.call(ordered, key)) {
      ordered[key] = data[key];
    }
  }
  return ordered;
}

const files = collectJson(PROJECTS_DIR);
let updated = 0;
let skipped = 0;

for (const filePath of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`ERROR: could not parse ${filePath}:`, err.message);
    process.exitCode = 1;
    continue;
  }

  if (Object.prototype.hasOwnProperty.call(data, 'overview')) {
    skipped++;
    continue;
  }

  data.overview = {
    en: `${data.title.en} — ${data.subtitle.en}. This case study walks through the brief, the process, and the final outcome of the work.`,
    es: `${data.title.es} — ${data.subtitle.es}. Este caso recorre el encargo, el proceso y el resultado final del trabajo.`,
  };

  const reordered = reorder(data);
  writeFileSync(filePath, JSON.stringify(reordered, null, 2) + '\n', 'utf-8');
  updated++;
}

console.log(
  `Done. ${updated} file(s) updated, ${skipped} already had overview (skipped).`,
);
