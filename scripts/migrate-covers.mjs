import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'src/content/projects';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (extname(entry.name) === '.json') yield p;
  }
}

let changed = 0;
for await (const file of walk(ROOT)) {
  const json = JSON.parse(await readFile(file, 'utf8'));
  if (typeof json.cover === 'string' && json.cover.startsWith('placeholder:')) {
    delete json.cover;
    await writeFile(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    changed += 1;
    console.log(`migrated: ${file}`);
  }
}
console.log(`Done. ${changed} files migrated.`);
