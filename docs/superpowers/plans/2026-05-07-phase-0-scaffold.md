# Phase 0 Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring up the deployable empty shell of Carolina M. Rivera's portfolio — Astro project, Jericho-aligned tooling, content collections, EN/ES routing, theme system, and a GitHub Pages CI pipeline — so subsequent design phases can land without paying scaffolding tax.

**Architecture:** Astro static-output site with vanilla TypeScript islands. JSON files validated by zod via Astro content collections drive 9 category subpages × 2 locales (18) + 2 home pages = 20 routes. Theming is a single `data-theme` attribute on `<html>` with a no-FOUC inline bootstrap. Husky enforces Jericho commit-message verbs; `lint-staged` keeps `pre-commit` light. CI deploys `dist/` to GitHub Pages on push to `main`. Site/base read from env vars to support migration to Carolina's GitHub account later.

**Tech Stack:** Astro 5.x, TypeScript 5.x (strict), zod, ESLint 8.x (legacy `.eslintrc.cjs`) + `airbnb-base` + `@typescript-eslint/strict` + `plugin:astro/recommended`, Husky 9.x, lint-staged 15.x, GitHub Actions (`actions/deploy-pages@v4`), Google Fonts CDN, npm only with exact pinning.

**Spec reference:** `docs/superpowers/specs/2026-05-07-phase-0-scaffold-design.md`

---

## File Structure

The plan creates this tree. Every file has one clear responsibility — no barrel files (Jericho non-negotiable).

```
portfolio-web-app-ciruela/
├─ .github/workflows/deploy.yml          [Task 17]
├─ .husky/
│  ├─ pre-commit                         [Task 3]
│  └─ commit-msg                         [Task 3]
├─ .nvmrc                                [Task 1]
├─ .npmrc                                [Task 1]
├─ .gitignore                            [Task 1 — extends Astro default]
├─ .eslintrc.cjs                         [Task 2]
├─ .eslintignore                         [Task 2]
├─ astro.config.mjs                      [Task 8]
├─ tsconfig.json                         [Task 1]
├─ package.json                          [Task 1, scripts in Task 2, husky in Task 3]
├─ public/
│  ├─ favicon.svg                        [Task 5]
│  └─ icons/
│     ├─ behance.svg                     [Task 14]
│     ├─ instagram.svg                   [Task 14]
│     ├─ linkedin.svg                    [Task 14]
│     └─ whatsapp.svg                    [Task 14]
├─ src/
│  ├─ components/
│  │  └─ layout/
│  │     ├─ Header.astro                 [Task 13]
│  │     ├─ Footer.astro                 [Task 14]
│  │     ├─ ThemeToggle.astro            [Task 15]
│  │     └─ LangToggle.astro             [Task 16]
│  ├─ content/
│  │  ├─ config.ts                       [Task 7]
│  │  ├─ categories/
│  │  │  ├─ design/
│  │  │  │  ├─ branding.json             [Task 7]
│  │  │  │  ├─ social-media.json         [Task 7]
│  │  │  │  ├─ ai-designs.json           [Task 7]
│  │  │  │  ├─ print.json                [Task 7]
│  │  │  │  ├─ illustration.json         [Task 7]
│  │  │  │  └─ ui-design.json            [Task 7]
│  │  │  └─ artwork/
│  │  │     ├─ drawing.json              [Task 7]
│  │  │     ├─ painting.json             [Task 7]
│  │  │     └─ photography.json          [Task 7]
│  │  └─ projects/
│  │     ├─ design/branding/sample.json  [Task 7]
│  │     └─ artwork/drawing/sample.json  [Task 7]
│  ├─ i18n/
│  │  ├─ en.json                         [Task 6]
│  │  ├─ es.json                         [Task 6]
│  │  └─ getT.ts                         [Task 6]
│  ├─ layouts/
│  │  └─ BaseLayout.astro                [Task 5]
│  ├─ pages/
│  │  ├─ index.astro                     [Task 9]
│  │  ├─ design/[category].astro         [Task 11]
│  │  ├─ artwork/[category].astro        [Task 11]
│  │  └─ es/
│  │     ├─ index.astro                  [Task 9]
│  │     ├─ design/[category].astro      [Task 11]
│  │     └─ artwork/[category].astro     [Task 11]
│  ├─ scripts/
│  │  ├─ theme.ts                        [Task 15]
│  │  └─ lang.ts                         [Task 16]
│  ├─ styles/
│  │  ├─ tokens.css                      [Task 4]
│  │  ├─ reset.css                       [Task 4]
│  │  └─ global.css                      [Task 4]
│  └─ utils/
│     └─ localizedHref.ts                [Task 8]
├─ docs/superpowers/
│  ├─ specs/2026-05-07-phase-0-scaffold-design.md     [exists]
│  └─ plans/2026-05-07-phase-0-scaffold.md            [this file]
├─ README.md                             [Task 18 — overwritten]
└─ LICENSE                               [exists]
```

**Branch:** `feature/phase-0-scaffold` (already created and signed by `Jose Ríos <josed.riosc@gmail.com>` ed25519 `365602820FC1B86C`).

**Co-Authored-By trailer policy:** Phase 0 is scaffolding work, so every commit in this plan adds:
```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```
Phases 1+ drop the trailer per project memory rule.

**Commit message style:** Jericho — capitalized infinitive verb, no period, ≤72 chars subject, body explains *why*. Husky `commit-msg` validator enforces the verb.

---

## Tasks

### Task 1: Initialize Astro project, npm config, and TypeScript config

**Files:**
- Create: `package.json`
- Create: `package-lock.json` (generated)
- Create: `.nvmrc`
- Create: `.npmrc`
- Create: `.gitignore`
- Create: `tsconfig.json`
- Create: `src/env.d.ts` (Astro types reference)

- [ ] **Step 1: Capture exact Astro and TypeScript versions to pin**

Run from repo root:
```bash
echo "Astro:      $(npm view astro version)"
echo "TypeScript: $(npm view typescript version)"
echo "Node LTS:   $(curl -s https://nodejs.org/dist/index.json | python3 -c 'import json,sys; v=[r for r in json.load(sys.stdin) if r["lts"]][0]; print(v["version"].lstrip("v"))')"
```

Expected: three version strings echoed. Record them — you will paste them into `.nvmrc`, `package.json`, and `tsconfig.json`. Throughout this plan, `<ASTRO_VERSION>`, `<TS_VERSION>`, and `<NODE_LTS_VERSION>` refer to these captured values.

- [ ] **Step 2: Write `.nvmrc`**

```
<NODE_LTS_VERSION>
```

- [ ] **Step 3: Write `.npmrc`**

```
save-exact=true
engine-strict=true
fund=false
audit=false
```

- [ ] **Step 4: Write `.gitignore`**

```
# build output
dist/
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
*.log

# environment
.env
.env.*
!.env.example

# editor
.idea/
.vscode/
.DS_Store

# misc
*.tsbuildinfo
.cache/
```

- [ ] **Step 5: Write `package.json`**

```json
{
  "name": "portfolio-web-app-ciruela",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "description": "Carolina M. Rivera — Graphic Designer & Visual Artist portfolio.",
  "engines": {
    "node": "<NODE_LTS_VERSION>"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "typecheck": "astro check",
    "lint": "eslint --max-warnings=0 \"src/**/*.{ts,astro}\" \"*.{cjs,mjs}\""
  },
  "dependencies": {
    "astro": "<ASTRO_VERSION>"
  },
  "devDependencies": {
    "typescript": "<TS_VERSION>"
  }
}
```

Replace the three `<...>` placeholders with the values captured in Step 1.

- [ ] **Step 6: Install pinned dependencies**

```bash
npm install
```

Expected output: `added N packages, and audited N+1 packages in Xs`. `package-lock.json` is created.

- [ ] **Step 7: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "src/env.d.ts"],
  "exclude": ["dist", ".astro", "node_modules"]
}
```

- [ ] **Step 8: Write `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 9: Verify typecheck passes on the empty project**

```bash
npm run typecheck
```

Expected: `0 errors, 0 warnings` from `astro check`. (It may also report `Result (0 files): 0 errors` — that is fine for an empty project.)

- [ ] **Step 10: Commit**

```bash
git add .nvmrc .npmrc .gitignore package.json package-lock.json tsconfig.json src/env.d.ts
git commit -m "$(cat <<'EOF'
Initialize Astro project with pinned dependencies and strict TypeScript

Sets up the npm/Node baseline (.nvmrc, .npmrc with save-exact and
engine-strict), an exact-pinned package.json, the strict tsconfig that
extends Astro's strict preset and adds noUnused* + verbatimModuleSyntax,
and the Astro types reference. No source files yet — npm run typecheck
returns clean.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: commit hash printed; signature verified by `gpg`.

---

### Task 2: ESLint legacy config and lint script

**Files:**
- Create: `.eslintrc.cjs`
- Create: `.eslintignore`

- [ ] **Step 1: Capture exact ESLint plugin versions to pin**

```bash
for pkg in eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-astro eslint-config-airbnb-base eslint-plugin-astro astro-eslint-parser; do
  printf '%-45s %s\n' "$pkg" "$(npm view "$pkg" version)"
done
```

Expected: eight version strings. Record them as `<ESLINT_VERSION>`, `<TS_PARSER_VERSION>`, `<TS_PLUGIN_VERSION>`, `<IMPORT_PLUGIN_VERSION>`, `<ASTRO_PLUGIN_VERSION>`, `<AIRBNB_BASE_VERSION>`, `<ASTRO_PARSER_VERSION>`.

> **Note:** `eslint-config-airbnb-base` is currently maintained against ESLint 8 — pin ESLint to its latest 8.x release if `npm view eslint version` returns 9.x. Check with `npm view eslint@8 version` and use that.

- [ ] **Step 2: Install ESLint and plugins as exact-pinned dev deps**

```bash
npm install --save-dev --save-exact \
  eslint@<ESLINT_VERSION> \
  @typescript-eslint/parser@<TS_PARSER_VERSION> \
  @typescript-eslint/eslint-plugin@<TS_PLUGIN_VERSION> \
  eslint-plugin-import@<IMPORT_PLUGIN_VERSION> \
  eslint-plugin-astro@<ASTRO_PLUGIN_VERSION> \
  astro-eslint-parser@<ASTRO_PARSER_VERSION> \
  eslint-config-airbnb-base@<AIRBNB_BASE_VERSION>
```

Expected: `added N packages` and zero peer-dependency warnings (or only the airbnb-base peer-warning about ESLint version, which is acceptable when pinned to ESLint 8).

- [ ] **Step 3: Write `.eslintrc.cjs`**

```js
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.astro'],
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:astro/recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/no-cycle': 'error',
    'import/no-default-export': 'off',
    'import/extensions': 'off',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
      'newlines-between': 'always',
    }],
    'eqeqeq': ['error', 'always'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-shadow': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['*.cjs', '*.mjs'],
      parserOptions: {
        project: null,
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
      node: true,
    },
  },
};
```

- [ ] **Step 4: Write `.eslintignore`**

```
dist/
.astro/
node_modules/
public/
*.log
```

- [ ] **Step 5: Run lint to verify config loads with no errors**

```bash
npm run lint
```

Expected: command exits 0. Output may be empty (no source files to lint yet) or report `0 problems`.

- [ ] **Step 6: Commit**

```bash
git add .eslintrc.cjs .eslintignore package.json package-lock.json
git commit -m "$(cat <<'EOF'
Configure ESLint with airbnb-base and TypeScript-strict for Astro

Adds the legacy .eslintrc.cjs config required by Jericho TYPESCRIPT.md
and JAVASCRIPT.md: airbnb-base + @typescript-eslint/strict + import +
astro plugins, labelled import groups, explicit return types, no-var,
prefer-const, eqeqeq, no-shadow. Astro single-file components and
top-level config files (.cjs, .mjs) get scoped overrides so the
explicit-return-type rule does not trip on Astro frontmatter or
build-time configs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Husky and lint-staged with Jericho commit-msg validator

**Files:**
- Create: `.husky/pre-commit`
- Create: `.husky/commit-msg`
- Modify: `package.json` (add `prepare` script and `lint-staged` block)

- [ ] **Step 1: Capture exact Husky and lint-staged versions**

```bash
echo "husky:       $(npm view husky version)"
echo "lint-staged: $(npm view lint-staged version)"
```

Record as `<HUSKY_VERSION>` and `<LINT_STAGED_VERSION>`.

- [ ] **Step 2: Install Husky and lint-staged as exact-pinned dev deps**

```bash
npm install --save-dev --save-exact husky@<HUSKY_VERSION> lint-staged@<LINT_STAGED_VERSION>
```

- [ ] **Step 3: Add the `prepare` script and `lint-staged` block to `package.json`**

Open `package.json` and merge the following keys (preserve existing ones):

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,astro}": "eslint --max-warnings=0",
    "*.{js,cjs,mjs}": "eslint --max-warnings=0"
  }
}
```

The full `scripts` block after this step is:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "typecheck": "astro check",
    "lint": "eslint --max-warnings=0 \"src/**/*.{ts,astro}\" \"*.{cjs,mjs}\"",
    "prepare": "husky"
  }
}
```

- [ ] **Step 4: Initialize Husky**

```bash
npx husky init
```

Expected output: `husky - Git hooks installed`. A `.husky/` directory and a default `.husky/pre-commit` are created. Discard the auto-generated `pre-commit` content — the next step overwrites it.

- [ ] **Step 5: Write `.husky/pre-commit`**

```sh
#!/usr/bin/env sh

npx --no-install lint-staged
```

Make it executable:
```bash
chmod +x .husky/pre-commit
```

- [ ] **Step 6: Write `.husky/commit-msg`**

```sh
#!/usr/bin/env sh

COMMIT_MSG=$(head -n 1 "$1")

VERB_PATTERN="^(Add|Fix|Update|Create|Remove|Delete|Improve|Refactor|Move|Rename|Revert|Merge|Configure|Enable|Disable|Extract|Simplify|Optimize|Implement|Integrate|Replace|Resolve|Validate|Document|Init|Apply|Enforce|Extend|Handle|Introduce|Prepare|Release|Run|Skip|Split|Support|Use|Verify|Set|Clean|Correct|Lock|Reduce|Test) .+"

if ! printf '%s' "$COMMIT_MSG" | grep -qE "$VERB_PATTERN"; then
  printf '\n  ✗ Invalid commit message subject: "%s"\n\n' "$COMMIT_MSG"
  printf '  Format : <Verb> <description>\n'
  printf '  Example: Add user authentication middleware\n'
  printf '           Fix null pointer in payment flow\n'
  printf '           Update Axios to version 1.7.0\n\n'
  printf '  Subject must start with a capitalized infinitive verb.\n'
  printf '  See docs/superpowers/specs/2026-05-07-phase-0-scaffold-design.md\n'
  printf '  and Jericho GIT.md for the approved-verb list.\n\n'
  exit 1
fi
```

Make it executable:
```bash
chmod +x .husky/commit-msg
```

- [ ] **Step 7: Smoke-test the commit-msg validator (negative case)**

Stage nothing. Try a bad commit message:
```bash
git commit --allow-empty -m "added stuff" 2>&1 | head -20
```

Expected: hook prints `✗ Invalid commit message subject: "added stuff"` and exits non-zero. The commit is **rejected** — verify with `git status` (no new commit on branch).

- [ ] **Step 8: Smoke-test the commit-msg validator (positive case)**

```bash
git commit --allow-empty -m "Verify husky commit-msg hook accepts approved verbs"
```

Expected: empty commit lands cleanly with a signature. Inspect:
```bash
git log --show-signature -1 | head -10
```

You should see `gpg: Good signature from "Jose Ríos <josed.riosc@gmail.com>"`.

- [ ] **Step 9: Drop the smoke-test commit**

```bash
git reset --soft HEAD~1 && git status
```

Expected: working tree returned to pre-smoke state, no staged files.

- [ ] **Step 10: Commit the husky setup**

```bash
git add .husky/pre-commit .husky/commit-msg package.json package-lock.json
git commit -m "$(cat <<'EOF'
Configure Husky with lint-staged and Jericho commit-msg validator

Adds two git hooks: pre-commit runs lint-staged on changed .ts/.astro/
.js/.cjs/.mjs files only (keeps the loop fast — no full lint sweep, no
test runner per the Phase 0 spec), and commit-msg validates the subject
line against the Jericho GIT.md verb regex. Husky and lint-staged are
exact-pinned dev deps; package.json gains a prepare script so npm install
re-installs the hooks for fresh clones.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: CSS tokens, reset, and global stylesheet

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/reset.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  --c-accent: #7A8FF7;
  --c-ink: #34363f;
  --c-ink-soft: #5a5d6a;
  --c-bg: #f4f6fc;
  --c-bg-elev: #ffffff;
  --c-line: rgba(52, 54, 63, 0.12);

  --font-body: 'Montserrat', system-ui, sans-serif;
  --font-display: 'Fraunces', Georgia, serif;
  --font-name: 'Jost', 'Montserrat', sans-serif;
  --font-script: 'Caveat', cursive;

  --radius-sm: 6px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  --motion-fast: 180ms;
  --motion-base: 280ms;
  --motion-slow: 520ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
}

:root[data-theme='dark'] {
  --c-ink: #e6e7ee;
  --c-ink-soft: #a3a6b8;
  --c-bg: #0c0e1c;
  --c-bg-elev: #14172a;
  --c-line: rgba(230, 231, 238, 0.12);
}
```

- [ ] **Step 2: Write `src/styles/reset.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd {
  margin: 0;
}

ul[role='list'], ol[role='list'] {
  list-style: none;
  padding: 0;
}

html:focus-within {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
}

img, picture, svg, video, canvas {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Write `src/styles/global.css`**

```css
@import './tokens.css';
@import './reset.css';

html {
  color-scheme: light;
  background: var(--c-bg);
  color: var(--c-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--motion-base) var(--ease-standard),
              color var(--motion-base) var(--ease-standard);
}

html[data-theme='dark'] {
  color-scheme: dark;
}

body {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.005em;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 2px solid var(--c-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 4: Verify lint passes**

```bash
npm run lint
```

Expected: exits 0. CSS files are not lint targets but ESLint should still run cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/styles/
git commit -m "$(cat <<'EOF'
Add CSS tokens, reset, and global stylesheet

Defines design tokens as CSS custom properties (accent #7A8FF7, light ink
#34363f, light bg #f4f6fc, dark bg #0c0e1c, font families, radii, motion
timings) with a single data-theme attribute on :root driving the dark
override. Adds a modern reset (Andy Bell style) with prefers-reduced-
motion respected, and a global stylesheet that wires color-scheme to
data-theme so native form controls follow the theme.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: BaseLayout with no-FOUC bootstrap and Google Fonts preconnect

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Write `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#7A8FF7"/>
  <text x="16" y="22" font-family="Fraunces, Georgia, serif" font-size="20" font-style="italic" font-weight="400" fill="#ffffff" text-anchor="middle">C</text>
</svg>
```

- [ ] **Step 2: Write `src/layouts/BaseLayout.astro`**

```astro
---
// packages
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  lang: 'en' | 'es';
}

const { title, description, lang } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#7A8FF7" />
    <title>{title}</title>

    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=Jost:wght@400;500;600&family=Caveat:wght@400&display=swap"
    />

    <script is:inline>
      (function () {
        try {
          var stored = localStorage.getItem('theme');
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
          var theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Verify typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both exit 0. Astro's `astro check` should report `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ public/favicon.svg
git commit -m "$(cat <<'EOF'
Add BaseLayout with no-FOUC theme bootstrap and Google Fonts preconnect

Single layout that owns the document head: charset/viewport meta,
description, theme-color, favicon, Google Fonts preconnect plus a single
weighted stylesheet (Montserrat 300-600, Fraunces ital/opsz/wght 300-500,
Jost 400-600, Caveat 400, display=swap), and an inline no-FOUC script
that resolves data-theme from localStorage then prefers-color-scheme
before paint. Body renders a slot so pages stay focused on content.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: i18n string store and typed accessor

**Files:**
- Create: `src/i18n/en.json`
- Create: `src/i18n/es.json`
- Create: `src/i18n/getT.ts`

- [ ] **Step 1: Write `src/i18n/en.json`**

```json
{
  "site": {
    "title": "Carolina M. Rivera — Portfolio",
    "description": "Carolina M. Rivera, Graphic Designer & Visual Artist."
  },
  "nav": {
    "home": "Home",
    "design": "Design",
    "artwork": "Artwork",
    "contact": "Contact"
  },
  "home": {
    "name": {
      "first": "Carolina",
      "last": "Rivera"
    },
    "tagline": "Graphic Designer & Visual Artist"
  },
  "design": {
    "eyebrow": "Design Portfolio",
    "selected": "Selected"
  },
  "artwork": {
    "eyebrow": "Personal Portfolio",
    "studio": "Studio"
  },
  "contact": {
    "heading": "Get in touch",
    "ctaCopy": "Copy email"
  },
  "theme": {
    "toggle": "Toggle theme",
    "light": "Light",
    "dark": "Dark"
  },
  "lang": {
    "toggle": "Toggle language",
    "en": "English",
    "es": "Spanish"
  }
}
```

- [ ] **Step 2: Write `src/i18n/es.json`**

```json
{
  "site": {
    "title": "Carolina M. Rivera — Portafolio",
    "description": "Carolina M. Rivera, Diseñadora Gráfica y Artista Visual."
  },
  "nav": {
    "home": "Inicio",
    "design": "Diseño",
    "artwork": "Obra",
    "contact": "Contacto"
  },
  "home": {
    "name": {
      "first": "Carolina",
      "last": "Rivera"
    },
    "tagline": "Diseñadora Gráfica y Artista Visual"
  },
  "design": {
    "eyebrow": "Portafolio de Diseño",
    "selected": "Seleccionado"
  },
  "artwork": {
    "eyebrow": "Portafolio Personal",
    "studio": "Estudio"
  },
  "contact": {
    "heading": "Contáctame",
    "ctaCopy": "Copiar correo"
  },
  "theme": {
    "toggle": "Cambiar tema",
    "light": "Claro",
    "dark": "Oscuro"
  },
  "lang": {
    "toggle": "Cambiar idioma",
    "en": "Inglés",
    "es": "Español"
  }
}
```

- [ ] **Step 3: Write `src/i18n/getT.ts`**

```ts
// packages
import enStrings from './en.json';
import esStrings from './es.json';

export type Lang = 'en' | 'es';

export type Translations = typeof enStrings;

const dictionaries: Record<Lang, Translations> = {
  en: enStrings,
  es: esStrings as Translations,
};

type Path<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${Path<T[K]>}` : never }[keyof T]
  : never;

export type TKey = Path<Translations>;

const resolve = (dict: Translations, key: TKey): string => {
  const segments = key.split('.');
  let cursor: unknown = dict;
  for (const segment of segments) {
    if (cursor !== null && typeof cursor === 'object' && segment in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[segment];
    } else {
      throw new Error(`i18n: missing key "${key}"`);
    }
  }
  if (typeof cursor !== 'string') {
    throw new Error(`i18n: key "${key}" did not resolve to a string`);
  }
  return cursor;
};

export const getT = (lang: Lang): ((key: TKey) => string) => {
  const dict = dictionaries[lang];
  return (key: TKey): string => resolve(dict, key);
};
```

> **Note:** `es.json` is cast through `as Translations` because `verbatimModuleSyntax` + JSON imports do not enforce shape parity at compile time. Spanish parity is enforced by the runtime `resolve` (any missing key throws during build) — see Task 19's verification step.

- [ ] **Step 4: Verify typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "$(cat <<'EOF'
Add i18n string store with typed dot-path accessor

Two JSON dictionaries (en, es) carry every UI string the scaffold needs.
getT(lang) returns a typed accessor whose key parameter is a recursive
dot-path inferred from the English dictionary, so calling sites get
autocomplete and TypeScript errors for typos. Spanish parity is enforced
at build time — resolve throws if a key is missing — keeping the two
files honest without a separate validation pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Content collections, zod schemas, category JSONs, and stub projects

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/categories/design/branding.json`
- Create: `src/content/categories/design/social-media.json`
- Create: `src/content/categories/design/ai-designs.json`
- Create: `src/content/categories/design/print.json`
- Create: `src/content/categories/design/illustration.json`
- Create: `src/content/categories/design/ui-design.json`
- Create: `src/content/categories/artwork/drawing.json`
- Create: `src/content/categories/artwork/painting.json`
- Create: `src/content/categories/artwork/photography.json`
- Create: `src/content/projects/design/branding/sample.json`
- Create: `src/content/projects/artwork/drawing/sample.json`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
// packages
import { defineCollection, z } from 'astro:content';

const langString = z.object({
  en: z.string(),
  es: z.string(),
});

const categories = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    kind: z.enum(['design', 'artwork']),
    label: langString,
    blurb: langString,
    sisterCategories: z.array(z.string()),
  }),
});

const galleryItem = z.object({
  src: z.string(),
  alt: langString,
  kind: z.enum(['image', 'video']),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    kind: z.enum(['design', 'artwork']),
    category: z.string(),
    title: langString,
    subtitle: langString,
    studio: z.string(),
    role: langString,
    sectors: z.array(z.string()),
    year: z.number().int(),
    cover: z.string(),
    gallery: z.array(galleryItem),
  }),
});

export const collections = { categories, projects };
```

- [ ] **Step 2: Write the six design category JSONs**

`src/content/categories/design/branding.json`:
```json
{
  "slug": "branding",
  "kind": "design",
  "label": { "en": "Branding", "es": "Branding" },
  "blurb": {
    "en": "Identity systems and visual languages for studios, products, and people.",
    "es": "Sistemas de identidad y lenguajes visuales para estudios, productos y personas."
  },
  "sisterCategories": ["social-media", "print", "ui-design"]
}
```

`src/content/categories/design/social-media.json`:
```json
{
  "slug": "social-media",
  "kind": "design",
  "label": { "en": "Social Media", "es": "Redes Sociales" },
  "blurb": {
    "en": "Editorial templates, campaign assets, and motion-ready content for social channels.",
    "es": "Plantillas editoriales, piezas de campaña y contenido para redes sociales."
  },
  "sisterCategories": ["branding", "illustration", "ai-designs"]
}
```

`src/content/categories/design/ai-designs.json`:
```json
{
  "slug": "ai-designs",
  "kind": "design",
  "label": { "en": "AI Designs / Image Editing", "es": "Diseños IA / Edición" },
  "blurb": {
    "en": "Generative imagery and post-production paired with a designer's eye.",
    "es": "Imagen generativa y postproducción con mirada de diseñadora."
  },
  "sisterCategories": ["illustration", "social-media", "print"]
}
```

`src/content/categories/design/print.json`:
```json
{
  "slug": "print",
  "kind": "design",
  "label": { "en": "Print", "es": "Impresión" },
  "blurb": {
    "en": "Editorial layouts, packaging, and tactile print pieces.",
    "es": "Maquetación editorial, packaging y piezas impresas con presencia."
  },
  "sisterCategories": ["branding", "illustration", "ui-design"]
}
```

`src/content/categories/design/illustration.json`:
```json
{
  "slug": "illustration",
  "kind": "design",
  "label": { "en": "Illustration", "es": "Ilustración" },
  "blurb": {
    "en": "Editorial and brand illustration with a soft, considered hand.",
    "es": "Ilustración editorial y de marca con trazo cuidado."
  },
  "sisterCategories": ["ai-designs", "social-media", "branding"]
}
```

`src/content/categories/design/ui-design.json`:
```json
{
  "slug": "ui-design",
  "kind": "design",
  "label": { "en": "UI Design", "es": "Diseño UI" },
  "blurb": {
    "en": "Product surfaces and interactive systems that stay out of the user's way.",
    "es": "Productos digitales y sistemas interactivos que no estorban al usuario."
  },
  "sisterCategories": ["branding", "print", "social-media"]
}
```

- [ ] **Step 3: Write the three artwork category JSONs**

`src/content/categories/artwork/drawing.json`:
```json
{
  "slug": "drawing",
  "kind": "artwork",
  "label": { "en": "Drawing", "es": "Dibujo" },
  "blurb": {
    "en": "Pencil, ink, and mixed-media studies from the personal sketchbook.",
    "es": "Estudios a lápiz, tinta y técnica mixta desde el cuaderno personal."
  },
  "sisterCategories": ["painting", "photography"]
}
```

`src/content/categories/artwork/painting.json`:
```json
{
  "slug": "painting",
  "kind": "artwork",
  "label": { "en": "Painting", "es": "Pintura" },
  "blurb": {
    "en": "Watercolor and acrylic work — figurative pieces and abstract studies.",
    "es": "Acuarela y acrílico — piezas figurativas y estudios abstractos."
  },
  "sisterCategories": ["drawing", "photography"]
}
```

`src/content/categories/artwork/photography.json`:
```json
{
  "slug": "photography",
  "kind": "artwork",
  "label": { "en": "Photography", "es": "Fotografía" },
  "blurb": {
    "en": "Quiet observations from travel, studio, and the everyday.",
    "es": "Observaciones tranquilas desde el viaje, el estudio y lo cotidiano."
  },
  "sisterCategories": ["drawing", "painting"]
}
```

- [ ] **Step 4: Write the two stub project JSONs**

`src/content/projects/design/branding/sample.json`:
```json
{
  "slug": "sample",
  "kind": "design",
  "category": "branding",
  "title": { "en": "Sample Brand", "es": "Marca de Muestra" },
  "subtitle": { "en": "Placeholder identity system", "es": "Sistema de identidad placeholder" },
  "studio": "Independent",
  "role": { "en": "Designer", "es": "Diseñadora" },
  "sectors": ["placeholder"],
  "year": 2026,
  "cover": "/placeholder-cover.svg",
  "gallery": []
}
```

`src/content/projects/artwork/drawing/sample.json`:
```json
{
  "slug": "sample",
  "kind": "artwork",
  "category": "drawing",
  "title": { "en": "Sample Drawing", "es": "Dibujo de Muestra" },
  "subtitle": { "en": "Placeholder sketch", "es": "Boceto placeholder" },
  "studio": "Independent",
  "role": { "en": "Artist", "es": "Artista" },
  "sectors": ["placeholder"],
  "year": 2026,
  "cover": "/placeholder-cover.svg",
  "gallery": []
}
```

- [ ] **Step 5: Verify content collection validation**

```bash
npm run typecheck
```

Expected: 0 errors. `astro check` validates JSON files against the zod schema and reports any drift. If any file is malformed it errors with the file path and the failing zod path.

- [ ] **Step 6: Commit**

```bash
git add src/content/
git commit -m "$(cat <<'EOF'
Add content collections for categories and projects with zod schemas

Two collections drive the site's data plane: categories (9 entries — 6
design, 3 artwork) and projects (2 stubs that exercise the pipeline).
Both are type=data so JSON is the source of truth, validated by zod via
defineCollection so a malformed entry fails the build, not silently the
runtime. Sister-category lists power the bubble selectors in later
phases. Real photos do not land here yet — Phase 0 stubs only — and the
metadata-hygiene rule from the spec applies the moment they do.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Astro i18n config, env-driven site/base, and localizedHref helper

**Files:**
- Create: `astro.config.mjs`
- Create: `src/utils/localizedHref.ts`
- Create: `.env.example`

- [ ] **Step 1: Write `.env.example`**

```
# Site origin used for absolute URLs (canonical, sitemap, etc.)
PORTFOLIO_SITE=https://jorius.github.io

# Base path under which the site is served. Empty for a custom domain.
PORTFOLIO_BASE=/portfolio-web-app-ciruela
```

- [ ] **Step 2: Write `astro.config.mjs`**

```mjs
// packages
import { defineConfig } from 'astro/config';

const site = process.env.PORTFOLIO_SITE ?? 'https://jorius.github.io';
const base = process.env.PORTFOLIO_BASE ?? '/portfolio-web-app-ciruela';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

- [ ] **Step 3: Write `src/utils/localizedHref.ts`**

```ts
// types
import type { Lang } from '../i18n/getT';

const ensureLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

const stripTrailingSlashes = (path: string): string => path.replace(/\/+$/u, '');

export const localizedHref = (lang: Lang, path: string): string => {
  const normalized = ensureLeadingSlash(path);
  const base = stripTrailingSlashes(import.meta.env.BASE_URL);
  const localePrefix = lang === 'es' ? '/es' : '';
  const composed = `${base}${localePrefix}${normalized}`;
  return composed.endsWith('/') ? composed : `${composed}/`;
};
```

- [ ] **Step 4: Verify typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/utils/localizedHref.ts .env.example
git commit -m "$(cat <<'EOF'
Configure Astro i18n routing with env-driven site and base

astro.config.mjs reads site and base from PORTFOLIO_SITE and
PORTFOLIO_BASE env vars (defaults target the placeholder GitHub Pages
host), enables the two-locale i18n routing with English at root and
Spanish under /es/, and pins trailingSlash always with directory format
so generated URLs are stable. localizedHref(lang, path) is the single
source of truth for internal links — composes BASE_URL with the locale
prefix and a trailing slash so callers cannot drift apart from
astro.config.mjs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Home page stubs (English at /, Spanish at /es/)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/es/index.astro`

- [ ] **Step 1: Write `src/pages/index.astro`**

```astro
---
// layouts
import BaseLayout from '../layouts/BaseLayout.astro';

// i18n
import { getT } from '../i18n/getT';

const lang = 'en' as const;
const t = getT(lang);
---
<BaseLayout title={t('site.title')} description={t('site.description')} lang={lang}>
  <main>
    <h1>{t('home.name.first')} {t('home.name.last')}</h1>
    <p>{t('home.tagline')}</p>
    <p>
      <em>Phase 0 stub — design lands in Phase 1.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/es/index.astro`**

```astro
---
// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// i18n
import { getT } from '../../i18n/getT';

const lang = 'es' as const;
const t = getT(lang);
---
<BaseLayout title={t('site.title')} description={t('site.description')} lang={lang}>
  <main>
    <h1>{t('home.name.first')} {t('home.name.last')}</h1>
    <p>{t('home.tagline')}</p>
    <p>
      <em>Phase 0 stub — el diseño llega en la Fase 1.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Run dev server and verify both routes render**

```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/portfolio-web-app-ciruela/ | grep -E '<title>|home\.name' | head -3
curl -s http://localhost:4321/portfolio-web-app-ciruela/es/ | grep -E '<title>|home\.name' | head -3
kill %1 2>/dev/null
```

Expected: English `<title>` reads `Carolina M. Rivera — Portfolio` and the page contains `Carolina Rivera`. Spanish `<title>` reads `Carolina M. Rivera — Portafolio`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/es/index.astro
git commit -m "$(cat <<'EOF'
Add English and Spanish home page stubs

Both home pages are intentionally empty — they wire BaseLayout, the i18n
accessor, and the locale prefix so the routing pipeline can be exercised
end-to-end. Phase 1 replaces the body content with the jellyfish hero
and Carolina Rivera wordmark; this commit only proves that two locales
render through the same layout and that getT picks the right dictionary.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Lint and typecheck checkpoint

This is a checkpoint task — no new files, no commit unless something is wrong.

- [ ] **Step 1: Run the full check suite**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all three exit 0. `npm run build` reports `building static routes` and emits at minimum:
- `dist/index.html`
- `dist/es/index.html`

If anything errors, fix the underlying issue (do not skip the check). Once green, proceed.

---

### Task 11: Design and Artwork dynamic category routes (both locales)

**Files:**
- Create: `src/pages/design/[category].astro`
- Create: `src/pages/artwork/[category].astro`
- Create: `src/pages/es/design/[category].astro`
- Create: `src/pages/es/artwork/[category].astro`

- [ ] **Step 1: Write `src/pages/design/[category].astro`**

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// i18n
import { getT } from '../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'design');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug } = Astro.props;
const lang = 'en' as const;
const t = getT(lang);
const category = await getEntry('categories', `design/${categorySlug}`);

if (!category) {
  throw new Error(`Missing design category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <main>
    <p><small>{t('design.eyebrow')} · {t('design.selected')}</small></p>
    <h1>{label}</h1>
    <p>{blurb}</p>
    <p>
      <em>Phase 0 stub — full subpage template lands in Phase 5.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Write `src/pages/artwork/[category].astro`**

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../layouts/BaseLayout.astro';

// i18n
import { getT } from '../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'artwork');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug } = Astro.props;
const lang = 'en' as const;
const t = getT(lang);
const category = await getEntry('categories', `artwork/${categorySlug}`);

if (!category) {
  throw new Error(`Missing artwork category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <main>
    <p><small>{t('artwork.eyebrow')} · {t('artwork.studio')}</small></p>
    <h1>{label}</h1>
    <p>{blurb}</p>
    <p>
      <em>Phase 0 stub — full subpage template lands in Phase 5.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/es/design/[category].astro`**

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../../layouts/BaseLayout.astro';

// i18n
import { getT } from '../../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'design');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug } = Astro.props;
const lang = 'es' as const;
const t = getT(lang);
const category = await getEntry('categories', `design/${categorySlug}`);

if (!category) {
  throw new Error(`Missing design category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <main>
    <p><small>{t('design.eyebrow')} · {t('design.selected')}</small></p>
    <h1>{label}</h1>
    <p>{blurb}</p>
    <p>
      <em>Phase 0 stub — la plantilla completa llega en la Fase 5.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/es/artwork/[category].astro`**

```astro
---
// packages
import { getCollection, getEntry } from 'astro:content';

// layouts
import BaseLayout from '../../../layouts/BaseLayout.astro';

// i18n
import { getT } from '../../../i18n/getT';

export async function getStaticPaths() {
  const all = await getCollection('categories', ({ data }) => data.kind === 'artwork');
  return all.map((entry) => ({
    params: { category: entry.data.slug },
    props: { categorySlug: entry.data.slug },
  }));
}

interface Props {
  categorySlug: string;
}

const { categorySlug } = Astro.props;
const lang = 'es' as const;
const t = getT(lang);
const category = await getEntry('categories', `artwork/${categorySlug}`);

if (!category) {
  throw new Error(`Missing artwork category entry: ${categorySlug}`);
}

const label = category.data.label[lang];
const blurb = category.data.blurb[lang];
const pageTitle = `${label} · ${t('site.title')}`;
---
<BaseLayout title={pageTitle} description={blurb} lang={lang}>
  <main>
    <p><small>{t('artwork.eyebrow')} · {t('artwork.studio')}</small></p>
    <h1>{label}</h1>
    <p>{blurb}</p>
    <p>
      <em>Phase 0 stub — la plantilla completa llega en la Fase 5.</em>
    </p>
  </main>
</BaseLayout>
```

- [ ] **Step 5: Verify all 18 routes generate**

```bash
npm run build
ls dist/design/ dist/artwork/ dist/es/design/ dist/es/artwork/ | sort
```

Expected: each of the four directories contains exactly the slug subdirectories from the matching collection — `branding`, `social-media`, `ai-designs`, `print`, `illustration`, `ui-design` under `design/`; `drawing`, `painting`, `photography` under `artwork/`. Spanish mirrors the same.

Also verify the route count:
```bash
find dist -name 'index.html' | wc -l
```
Expected: `20` (2 home + 6 design EN + 6 design ES + 3 artwork EN + 3 artwork ES).

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "$(cat <<'EOF'
Add dynamic category routes for Design and Artwork in both locales

Four [category].astro pages (English + Spanish, design + artwork)
generate one route per category entry via getStaticPaths over the
categories collection. Each page resolves its category through
getEntry, pulls the localized label and blurb, and renders a stub body
that advertises the eventual subpage template. The build now emits 20
routes total — verified by find dist -name index.html | wc -l = 20.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Header component with mega-menu nav structure

**Files:**
- Create: `src/components/layout/Header.astro`
- Modify: `src/layouts/BaseLayout.astro` (mount `<Header />` above the slot)

- [ ] **Step 1: Write `src/components/layout/Header.astro`**

```astro
---
// utils
import { localizedHref } from '../../utils/localizedHref';

// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);

const designSlugs = ['social-media', 'branding', 'ai-designs', 'print', 'illustration', 'ui-design'] as const;
const artworkSlugs = ['drawing', 'painting', 'photography'] as const;
---
<header class="site-header">
  <a class="brand" href={localizedHref(lang, '/')}>Carolina Rivera</a>
  <nav aria-label={t('nav.home')}>
    <ul role="list" class="nav-primary">
      <li><a href={localizedHref(lang, '/')}>{t('nav.home')}</a></li>
      <li class="has-submenu">
        <a href={`${localizedHref(lang, '/')}#design`}>{t('nav.design')}</a>
        <ul role="list" class="nav-submenu">
          {designSlugs.map((slug) => (
            <li><a href={localizedHref(lang, `/design/${slug}`)}>{slug}</a></li>
          ))}
        </ul>
      </li>
      <li class="has-submenu">
        <a href={`${localizedHref(lang, '/')}#artwork`}>{t('nav.artwork')}</a>
        <ul role="list" class="nav-submenu">
          {artworkSlugs.map((slug) => (
            <li><a href={localizedHref(lang, `/artwork/${slug}`)}>{slug}</a></li>
          ))}
        </ul>
      </li>
      <li><a href={`${localizedHref(lang, '/')}#contact`}>{t('nav.contact')}</a></li>
    </ul>
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--c-line);
  }
  .brand {
    font-family: var(--font-name);
    font-weight: 500;
    font-size: 1.125rem;
  }
  .nav-primary {
    display: flex;
    gap: 1.5rem;
    margin: 0;
  }
  .has-submenu .nav-submenu {
    display: none;
    position: absolute;
    background: var(--c-bg-elev);
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);
    margin-top: 0.5rem;
  }
  .has-submenu:hover .nav-submenu,
  .has-submenu:focus-within .nav-submenu {
    display: block;
  }
  .nav-submenu li {
    padding: 0.25rem 0;
    text-transform: capitalize;
  }
</style>
```

> **Note:** The submenu styling here is intentionally minimal — Phase 5 (subpages) replaces this with the full mega-menu treatment. The structure (4 top items, 6 design subitems, 3 artwork subitems) is locked.

- [ ] **Step 2: Modify `src/layouts/BaseLayout.astro` to mount the header**

Replace the `<body>` block with:

```astro
  <body>
    <Header lang={lang} />
    <slot />
  </body>
```

And add to the layout's frontmatter (after the existing imports):

```astro
// components
import Header from '../components/layout/Header.astro';
```

The full updated frontmatter is:

```astro
---
// packages
import '../styles/global.css';

// components
import Header from '../components/layout/Header.astro';

interface Props {
  title: string;
  description: string;
  lang: 'en' | 'es';
}

const { title, description, lang } = Astro.props;
---
```

- [ ] **Step 3: Verify lint, typecheck, and build all pass**

```bash
npm run lint && npm run typecheck && npm run build
```

Expected: all three exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.astro src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
Add Header component with mega-menu nav structure

Header wires the four primary nav links — Home, Design, Artwork,
Contact — with hover/focus submenus listing the six design categories
and three artwork categories. Internal links route through
localizedHref so the locale prefix follows the active language. Submenu
styling is minimal Phase 0 placeholder; Phase 5 replaces it with the
full mega-menu treatment from the design bundle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Footer component with social icons

**Files:**
- Create: `public/icons/behance.svg`
- Create: `public/icons/instagram.svg`
- Create: `public/icons/linkedin.svg`
- Create: `public/icons/whatsapp.svg`
- Create: `src/components/layout/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` (mount `<Footer />` below the slot)

- [ ] **Step 1: Write the four social icon SVGs**

`public/icons/behance.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 5h6a3 3 0 0 1 0 6H2z"/>
  <path d="M2 11h6.5a3 3 0 0 1 0 6H2z"/>
  <path d="M14 8h6"/>
  <path d="M14 17a4 4 0 0 0 8 0v-1h-8a4 4 0 0 1 8 0"/>
</svg>
```

`public/icons/instagram.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="5"/>
  <circle cx="12" cy="12" r="4"/>
  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/>
</svg>
```

`public/icons/linkedin.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="18" height="18" rx="3"/>
  <path d="M8 10v8"/>
  <circle cx="8" cy="7" r="0.8" fill="currentColor"/>
  <path d="M12 18v-5a3 3 0 0 1 6 0v5"/>
  <path d="M12 13v5"/>
</svg>
```

`public/icons/whatsapp.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12a9 9 0 0 1-13.6 7.7L3 21l1.4-4.3A9 9 0 1 1 21 12z"/>
  <path d="M8.5 9.5c.2 1.4.9 2.7 2 3.7s2.3 1.7 3.7 2c.5.1 1-.1 1.3-.5l.6-.7c.3-.4.2-.9-.2-1.2l-1.3-.9a.9.9 0 0 0-1 0l-.5.4a4.7 4.7 0 0 1-2.2-2.2l.4-.5a.9.9 0 0 0 0-1l-.9-1.3c-.3-.4-.8-.5-1.2-.2l-.7.6c-.4.3-.6.8-.5 1.3z"/>
</svg>
```

- [ ] **Step 2: Write `src/components/layout/Footer.astro`**

```astro
---
// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);

const socials: ReadonlyArray<{ key: string; href: string; icon: string; label: string }> = [
  { key: 'behance',   href: 'https://www.behance.net/',  icon: 'behance.svg',   label: 'Behance'   },
  { key: 'instagram', href: 'https://www.instagram.com/', icon: 'instagram.svg', label: 'Instagram' },
  { key: 'linkedin',  href: 'https://www.linkedin.com/',  icon: 'linkedin.svg',  label: 'LinkedIn'  },
  { key: 'whatsapp',  href: 'https://wa.me/',             icon: 'whatsapp.svg',  label: 'WhatsApp'  },
];
---
<footer class="site-footer">
  <p><small>© {new Date().getFullYear()} · {t('home.name.first')} {t('home.name.last')}</small></p>
  <ul role="list" class="socials">
    {socials.map((item) => (
      <li>
        <a href={item.href} aria-label={item.label} rel="noopener noreferrer" target="_blank">
          <img src={`${import.meta.env.BASE_URL}icons/${item.icon}`} alt="" width="20" height="20" />
        </a>
      </li>
    ))}
  </ul>
</footer>

<style>
  .site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-top: 1px solid var(--c-line);
    margin-top: 4rem;
  }
  .socials {
    display: flex;
    gap: 1rem;
    margin: 0;
  }
  .socials a {
    display: inline-flex;
    color: var(--c-ink);
  }
</style>
```

> **Note:** Real social URLs replace the placeholder root URLs in Phase 4. The order — Behance · Instagram · LinkedIn · WhatsApp — is locked from the design chat.

- [ ] **Step 3: Modify `src/layouts/BaseLayout.astro` to mount the footer**

Update the frontmatter import block:
```astro
// components
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
```

Update the `<body>` block:
```astro
  <body>
    <Header lang={lang} />
    <slot />
    <Footer lang={lang} />
  </body>
```

- [ ] **Step 4: Verify build and inspect output**

```bash
npm run build
grep -l 'icons/instagram.svg' dist/index.html dist/es/index.html
```

Expected: both home pages reference the icon path. Also confirm icons copied to dist:
```bash
ls dist/icons/
```
Expected: four `.svg` files.

- [ ] **Step 5: Commit**

```bash
git add public/icons/ src/components/layout/Footer.astro src/layouts/BaseLayout.astro
git commit -m "$(cat <<'EOF'
Add Footer component with the four locked social icons

Footer carries the year stamp, the artist's name from the i18n
dictionary, and the four social links in their canonical order:
Behance, Instagram, LinkedIn, WhatsApp. Icons are minimal-stroke SVGs
inheriting currentColor so they pick up the active theme. Real social
URLs replace the rooted placeholders during Phase 4 (Contact).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: ThemeToggle component with island script

**Files:**
- Create: `src/scripts/theme.ts`
- Create: `src/components/layout/ThemeToggle.astro`
- Modify: `src/components/layout/Header.astro` (mount `<ThemeToggle />` in the header right side)

- [ ] **Step 1: Write `src/scripts/theme.ts`**

```ts
type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

const readStored = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    return null;
  }
};

const writeStored = (theme: Theme): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage blocked (private mode, etc.) — fall back to in-memory only
  }
};

const apply = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const initThemeToggle = (root: HTMLElement): void => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-theme-button]');
  const sync = (active: Theme): void => {
    apply(active);
    writeStored(active);
    buttons.forEach((btn) => {
      const value = btn.dataset.themeButton as Theme | undefined;
      btn.setAttribute('aria-pressed', value === active ? 'true' : 'false');
    });
  };

  const initial: Theme = readStored()
    ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  sync(initial);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.themeButton as Theme | undefined;
      if (isTheme(next)) {
        sync(next);
      }
    });
  });
};
```

- [ ] **Step 2: Write `src/components/layout/ThemeToggle.astro`**

```astro
---
// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);
---
<div class="theme-toggle" role="group" aria-label={t('theme.toggle')}>
  <button type="button" data-theme-button="light" aria-pressed="false">{t('theme.light')}</button>
  <button type="button" data-theme-button="dark"  aria-pressed="false">{t('theme.dark')}</button>
</div>

<script>
  import { initThemeToggle } from '../../scripts/theme';

  document.querySelectorAll<HTMLElement>('.theme-toggle').forEach((root) => {
    initThemeToggle(root);
  });
</script>

<style>
  .theme-toggle {
    display: inline-flex;
    gap: 1px;
    background: var(--c-line);
    border-radius: var(--radius-pill);
    padding: 2px;
  }
  .theme-toggle button {
    border: 0;
    background: transparent;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    border-radius: var(--radius-pill);
    color: var(--c-ink-soft);
    cursor: pointer;
  }
  .theme-toggle button[aria-pressed='true'] {
    background: var(--c-bg-elev);
    color: var(--c-ink);
  }
</style>
```

- [ ] **Step 3: Modify `src/components/layout/Header.astro` to mount the toggle**

Update the frontmatter to import the toggle:
```astro
// components
import ThemeToggle from './ThemeToggle.astro';
```

Update the JSX so the header has a right-side controls cluster:
```astro
<header class="site-header">
  <a class="brand" href={localizedHref(lang, '/')}>Carolina Rivera</a>
  <nav aria-label={t('nav.home')}>
    <!-- existing primary nav unchanged -->
  </nav>
  <div class="header-controls">
    <ThemeToggle lang={lang} />
  </div>
</header>
```

Update the `<style>` block to add:
```css
  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
```

- [ ] **Step 4: Verify build and dev-server behavior**

```bash
npm run build
```

Expected: 0 errors. Then:

```bash
npm run dev &
sleep 3
curl -s http://localhost:4321/portfolio-web-app-ciruela/ | grep -E 'data-theme-button|theme-toggle' | head
kill %1 2>/dev/null
```

Expected: HTML contains both buttons. Manual check: open the dev URL in a browser, click `Dark`, watch `<html data-theme>` flip to `dark` and persist across reloads.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/theme.ts src/components/layout/ThemeToggle.astro src/components/layout/Header.astro
git commit -m "$(cat <<'EOF'
Add ThemeToggle island that flips data-theme and persists choice

A small vanilla TS island reads the current theme from localStorage,
falls back to prefers-color-scheme, and toggles the data-theme
attribute on documentElement. Two buttons (Light / Dark) emit
aria-pressed so assistive tech reads the active state. Storage failures
(private mode, etc.) degrade to in-memory only without throwing. The
no-FOUC bootstrap in BaseLayout still owns first-paint; this island
takes over interaction.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: LangToggle component with island script

**Files:**
- Create: `src/scripts/lang.ts`
- Create: `src/components/layout/LangToggle.astro`
- Modify: `src/components/layout/Header.astro` (mount `<LangToggle />` in the header controls)

- [ ] **Step 1: Write `src/scripts/lang.ts`**

```ts
type Lang = 'en' | 'es';

const isLang = (value: unknown): value is Lang => value === 'en' || value === 'es';

const stripBase = (pathname: string, base: string): string => {
  if (base === '' || base === '/') return pathname;
  const normalizedBase = base.replace(/\/+$/u, '');
  return pathname.startsWith(normalizedBase) ? pathname.slice(normalizedBase.length) : pathname;
};

const swapLocale = (pathname: string, base: string, target: Lang): string => {
  const stripped = stripBase(pathname, base);
  const withoutEs = stripped.replace(/^\/es(\/|$)/u, '/');
  const next = target === 'es' ? `/es${withoutEs === '/' ? '/' : withoutEs}` : withoutEs;
  const joined = `${base.replace(/\/+$/u, '')}${next}`;
  return joined.endsWith('/') ? joined : `${joined}/`;
};

export const initLangToggle = (root: HTMLElement, base: string, currentLang: Lang): void => {
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-lang-button]');
  buttons.forEach((btn) => {
    const value = btn.dataset.langButton;
    btn.setAttribute('aria-pressed', value === currentLang ? 'true' : 'false');
    btn.addEventListener('click', () => {
      const next = btn.dataset.langButton;
      if (isLang(next) && next !== currentLang) {
        const target = swapLocale(window.location.pathname, base, next);
        window.location.assign(target);
      }
    });
  });
};
```

- [ ] **Step 2: Write `src/components/layout/LangToggle.astro`**

```astro
---
// i18n
import { getT, type Lang } from '../../i18n/getT';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const t = getT(lang);
const base = import.meta.env.BASE_URL;
---
<div class="lang-toggle" role="group" aria-label={t('lang.toggle')} data-lang-current={lang} data-lang-base={base}>
  <button type="button" data-lang-button="en" aria-pressed={lang === 'en'}>EN</button>
  <button type="button" data-lang-button="es" aria-pressed={lang === 'es'}>ES</button>
</div>

<script>
  import { initLangToggle } from '../../scripts/lang';

  document.querySelectorAll<HTMLElement>('.lang-toggle').forEach((root) => {
    const current = root.dataset.langCurrent === 'es' ? 'es' : 'en';
    const base = root.dataset.langBase ?? '/';
    initLangToggle(root, base, current);
  });
</script>

<style>
  .lang-toggle {
    display: inline-flex;
    gap: 1px;
    background: var(--c-line);
    border-radius: var(--radius-pill);
    padding: 2px;
    font-family: var(--font-name);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
  }
  .lang-toggle button {
    border: 0;
    background: transparent;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-pill);
    color: var(--c-ink-soft);
    cursor: pointer;
  }
  .lang-toggle button[aria-pressed='true'] {
    background: var(--c-bg-elev);
    color: var(--c-ink);
  }
</style>
```

- [ ] **Step 3: Modify `src/components/layout/Header.astro` to mount the toggle**

Update the frontmatter to import:
```astro
// components
import LangToggle from './LangToggle.astro';
import ThemeToggle from './ThemeToggle.astro';
```

Update the controls cluster:
```astro
  <div class="header-controls">
    <LangToggle lang={lang} />
    <ThemeToggle lang={lang} />
  </div>
```

- [ ] **Step 4: Verify build and exercise the toggle**

```bash
npm run build
```

Then:
```bash
npm run dev &
sleep 3
echo "--- EN home ---"; curl -s http://localhost:4321/portfolio-web-app-ciruela/    | grep 'data-lang-current'
echo "--- ES home ---"; curl -s http://localhost:4321/portfolio-web-app-ciruela/es/ | grep 'data-lang-current'
kill %1 2>/dev/null
```

Expected: English home shows `data-lang-current="en"`, Spanish home shows `data-lang-current="es"`. Manual browser check: clicking ES on `/portfolio-web-app-ciruela/design/branding/` lands on `/portfolio-web-app-ciruela/es/design/branding/`.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/lang.ts src/components/layout/LangToggle.astro src/components/layout/Header.astro
git commit -m "$(cat <<'EOF'
Add LangToggle island that swaps EN and ES on the current path

Vanilla TS island reads the current locale and BASE_URL from data
attributes set by Astro at build time, then rewrites the current
pathname so EN ↔ ES navigation lands on the matching localized route.
Strips and re-inserts the /es prefix exactly once, preserves the base
path, and always emits a trailing slash to match astro.config.mjs.
Buttons surface aria-pressed for the active locale.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PORTFOLIO_SITE: https://jorius.github.io
      PORTFOLIO_BASE: /portfolio-web-app-ciruela
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "$(cat <<'EOF'
Configure GitHub Actions workflow to deploy Astro build to Pages

Pipeline runs on push to main and workflow_dispatch: checkout, setup
Node from .nvmrc with npm cache, npm ci, lint, typecheck, build, upload
the dist/ artifact, then deploy via actions/deploy-pages. PORTFOLIO_SITE
and PORTFOLIO_BASE are set in workflow env so a future repo migration
needs no code change — only the env values flip. Concurrency group
"pages" cancels in-flight runs to avoid stale deploys.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

> **Manual one-time step (not part of any commit):** in the GitHub repo UI, go to `Settings → Pages → Build and deployment → Source: GitHub Actions`. The first push to `main` after the merge will populate the `github-pages` environment. Document this in Task 18's README rewrite.

---

### Task 17: README rewrite with project intent, quickstart, and migration checklist

**Files:**
- Modify: `README.md` (full rewrite — was a single-line title at session start)

- [ ] **Step 1: Overwrite `README.md`**

```markdown
# Carolina M. Rivera — Portfolio

Personal portfolio for **Carolina M. Rivera**, Graphic Designer & Visual Artist. Built from a Claude Design handoff bundle as an Astro static site with vanilla TypeScript islands.

## Quickstart

```bash
npm ci          # exact-pinned install
npm run dev     # dev server on http://localhost:4321
npm run build   # static build to dist/
npm run preview # preview the production build locally
```

Other scripts:
- `npm run lint` — ESLint with airbnb-base + TypeScript-strict rules
- `npm run typecheck` — `astro check`, validates content collections too

## Project structure

See `docs/superpowers/specs/2026-05-07-phase-0-scaffold-design.md` §4 for the canonical tree. Headlines:

- `src/pages/` — file-based routing, English at root, Spanish under `/es/`
- `src/content/` — JSON-backed content collections (`categories`, `projects`) validated by zod
- `src/i18n/` — `en.json` + `es.json` + typed `getT(lang)` accessor
- `src/styles/` — design tokens, modern reset, global stylesheet
- `src/components/layout/` — Header, Footer, ThemeToggle, LangToggle (the only Phase 0 components)
- `src/scripts/` — vanilla TypeScript islands hydrated by Astro

## Stack

| | |
|---|---|
| Framework | Astro (static output) |
| Language | TypeScript strict |
| Styling | Plain CSS with custom properties; no Tailwind, no CSS-in-JS |
| Content | JSON files validated by zod via Astro content collections |
| i18n | Astro built-in routing, prefix-default-locale=false |
| Hosting | GitHub Pages (initial) → Netlify with custom domain (planned) |
| CI | GitHub Actions, `actions/deploy-pages@v4` |
| Hooks | Husky + lint-staged + Jericho `commit-msg` verb validator |

## Contributing

This repo follows **Jericho Digital** TypeScript and Git standards.

Commit messages start with a capitalized infinitive verb (`Add`, `Fix`, `Update`, `Configure`, `Document`, …) — the `commit-msg` hook rejects anything else. See [Jericho `GIT.md`](https://example.invalid/jericho-git-md) for the full verb list.

Branching: `feature/*`, `fix/*`, `hotfix/*` → PR → `main`. There is no `develop` or `sandbox` for this project.

## Migration checklist (when transferring to Carolina's GitHub account)

1. Transfer the repo via GitHub repo settings.
2. Update the `PORTFOLIO_SITE` and `PORTFOLIO_BASE` env vars in `.github/workflows/deploy.yml` (and any local `.env` you keep) to the new account/domain.
3. In the new repo: `Settings → Pages → Source: GitHub Actions`.
4. Push any commit to `main`; the deploy workflow runs end-to-end.
5. (Optional) When a custom domain lands on Netlify, set `PORTFOLIO_BASE=` (empty) and `PORTFOLIO_SITE` to the canonical domain.

## License

See `LICENSE`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
Document project intent, quickstart, and migration checklist in README

README replaces the single-line scaffold placeholder with project
context, the Phase 0 file map, the locked stack table, contribution
rules anchored in Jericho TS and GIT standards, and the migration
checklist for transferring the repo to Carolina's GitHub account
without touching code.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 18: Phase 0 verification — final lint, typecheck, build, and route audit

This task produces no commit unless a fix is needed. Its job is to confirm the spec's §11 exit criteria.

- [ ] **Step 1: Clean install**

```bash
rm -rf node_modules dist .astro
npm ci
```

Expected: install succeeds with the locked versions.

- [ ] **Step 2: Run the full check suite**

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all three exit 0. `npm run build` reports `Generating static routes` and prints route-by-route timing.

- [ ] **Step 3: Confirm the 20-route count**

```bash
find dist -name 'index.html' | sort
find dist -name 'index.html' | wc -l
```

Expected output (sorted, exactly these paths):
```
dist/artwork/drawing/index.html
dist/artwork/painting/index.html
dist/artwork/photography/index.html
dist/design/ai-designs/index.html
dist/design/branding/index.html
dist/design/illustration/index.html
dist/design/print/index.html
dist/design/social-media/index.html
dist/design/ui-design/index.html
dist/es/artwork/drawing/index.html
dist/es/artwork/painting/index.html
dist/es/artwork/photography/index.html
dist/es/design/ai-designs/index.html
dist/es/design/branding/index.html
dist/es/design/illustration/index.html
dist/es/design/print/index.html
dist/es/design/social-media/index.html
dist/es/design/ui-design/index.html
dist/es/index.html
dist/index.html
```

The count line must read `20`.

- [ ] **Step 4: Spot-check theme bootstrap and lang toggle markup are present**

```bash
grep -l 'data-theme' dist/index.html
grep -l 'data-lang-current' dist/index.html dist/es/index.html
```

Expected: `dist/index.html` for the first command; both files for the second.

- [ ] **Step 5: Spot-check i18n parity by attempting a build with a deliberately-broken Spanish key**

Temporarily remove `nav` from `src/i18n/es.json`:
```bash
node -e "const fs=require('fs'); const p='src/i18n/es.json'; const j=JSON.parse(fs.readFileSync(p)); delete j.nav; fs.writeFileSync(p, JSON.stringify(j, null, 2));"
npm run build || echo "BUILD FAILED AS EXPECTED"
```

Expected: build fails with `i18n: missing key "nav.home"` (or similar, thrown from `getT.ts`'s `resolve`). This proves the parity guard works.

Restore the file:
```bash
git checkout -- src/i18n/es.json
npm run build
```

Expected: build succeeds again.

- [ ] **Step 6: Smoke-check the dev server**

```bash
npm run dev &
sleep 3
for path in '/' '/es/' '/design/branding/' '/es/artwork/painting/'; do
  url="http://localhost:4321/portfolio-web-app-ciruela${path}"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  printf '%-50s %s\n' "$url" "$status"
done
kill %1 2>/dev/null
```

Expected: every path returns `200`.

- [ ] **Step 7: Open a Pull Request from `feature/phase-0-scaffold` to `main`**

```bash
git push -u origin feature/phase-0-scaffold
gh pr create \
  --title "Phase 0 — scaffold portfolio-web-app-ciruela" \
  --body "$(cat <<'EOF'
## Summary

- Astro static-output scaffold with vanilla TypeScript islands
- Jericho-aligned tooling: TypeScript strict, ESLint legacy config, Husky commit-msg validator, lint-staged pre-commit
- Content collections (categories + projects) with zod schemas and 9 + 2 starter JSONs
- EN/ES i18n routing with typed string accessor and a parity guard
- Theme system: data-theme attribute, no-FOUC bootstrap, ThemeToggle + LangToggle islands
- GitHub Actions deploys dist/ to GitHub Pages on push to main

## Test plan

- [ ] `npm ci && npm run lint && npm run typecheck && npm run build` all green locally
- [ ] `find dist -name 'index.html' | wc -l` returns 20
- [ ] Manual: ThemeToggle flips data-theme and persists across reloads
- [ ] Manual: LangToggle navigates EN ↔ ES on subpages
- [ ] After merge: GitHub Pages source is set to GitHub Actions, deploy workflow runs cleanly, the live URL renders all 20 routes
- [ ] After merge: open a smoke commit with a bad subject ("added stuff") and confirm the commit-msg hook rejects it on a fresh clone

## References

- Spec: `docs/superpowers/specs/2026-05-07-phase-0-scaffold-design.md`
- Plan: `docs/superpowers/plans/2026-05-07-phase-0-scaffold.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

> **Manual GitHub UI step before merging:** `Settings → Pages → Source: GitHub Actions`. Without this the deploy workflow will succeed but no live site appears.

---

## Self-review (run after the plan is written, before handing back)

**Spec coverage** — every `In scope` bullet from the spec maps to at least one task above. Mapping table:

| Spec §2 in-scope item | Task(s) |
|---|---|
| Astro project + exact-pinned deps | 1 |
| TypeScript strict + ESLint flat / legacy + Jericho rules | 1, 2 |
| File-based routing for home + 9 categories × 2 locales | 9, 11 |
| Content collections (`projects`, `categories`) + zod | 7 |
| i18n string store + typed accessor | 6 |
| Theme system (CSS custom properties + data-theme + no-FOUC bootstrap) | 4, 5 |
| Lang toggle and theme toggle as vanilla TS islands | 14, 15 |
| GitHub Actions deploy to GH Pages | 16 |
| One sample project per kind | 7 |
| All checks green; site deploys publicly | 18 |
| Husky `commit-msg` + light `pre-commit` (lint-staged) | 3 |

**Out-of-scope guard rails** — no task adds: jellyfish, custom cursor, paint splash, marquee, scroll reveals, tilted cards, glassy carousel, contact form beyond mailto-ready stubs, Tweaks panel, real photographs, analytics, sitemap. Confirmed clean.

**Placeholder scan** — no `TBD` / `TODO` / "implement later" / "similar to Task N" anywhere in the plan. The three placeholder tokens `<ASTRO_VERSION>`, `<TS_VERSION>`, `<NODE_LTS_VERSION>` (and the ESLint plugin set in Task 2) are intentional — they capture exact versions at scaffolding time and are the only sensible way to handle "latest stable, exact-pinned" without freezing a specific number into the plan.

**Type and naming consistency** —
- `Lang = 'en' | 'es'` is defined once in `src/i18n/getT.ts` (Task 6) and reused everywhere (Tasks 8, 11, 12, 13, 14, 15).
- `localizedHref(lang, path)` signature stable across all callers.
- Content collection keys (`'categories'`, `'projects'`) and slug shape (`<kind>/<slug>`) consistent across schemas (Task 7) and `getEntry` calls (Task 11).
- `data-theme-button` / `data-lang-button` data attribute names match between component templates and island scripts.

**Hard requirement carried forward (asset metadata hygiene)** — Phase 0 ships only the favicon and stub icons. No real photographs land. The rule binds the plans for Phases 1–5; the spec records it.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-07-phase-0-scaffold.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

Tell me which approach you prefer.
