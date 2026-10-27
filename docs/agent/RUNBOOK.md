# cv.carlosguerrero.com Runbook

## Install

```sh
corepack pnpm install --frozen-lockfile
```

## Local Checks

```sh
corepack pnpm build
```

## Deploy

Push to `main`. GitHub Actions builds the Astro site, assembles `.w7s-deploy/`, and deploys through `w7s-io/w7s-cloud@v1`.

The deploy artifact includes:

- `dist`
- `CNAME`
- `w7s.json`

## Domain

The repo declares:

```text
cv.carlosguerrero.com
```

in `CNAME`.

After deployment, verify the W7S path while DNS is being moved:

```sh
curl -fsS -D - https://guerrerocarlos.w7s.cloud/cv.carlosguerrero.com/ -o /tmp/cv-w7s-home.html
rg -n "Keet|keet|keet-card" /tmp/cv-w7s-home.html
```

The `rg` command should return no matches.

W7S recommended TXT ownership record:

```text
_w7s.carlosguerrero.com=guerrerocarlos/cv.carlosguerrero.com
```

## Application CV review

1. Edit `src/data/polymarket.json` and, if needed, `src/pages/polymarket.astro`.
2. Run `corepack pnpm build`, then `corepack pnpm preview --host 127.0.0.1`.
3. Open `http://127.0.0.1:4321/polymarket/`, check desktop and narrow mobile layouts, and use Print / Save PDF.
4. Use A4, 100% scale, CSS margins, and disable browser headers/footers. Save the reviewed output to `docs/applications/polymarket/carlos-guerrero.pdf`. Regenerate it whenever application copy changes.
5. Confirm three pages and selectable text using `pdfinfo` and `pdftotext -layout`. Check that experience, projects, skills, contact details, and links survive printing.
6. Commit and push a review branch. Do not merge to main until publication is authorized.

The 2026-10-27 PDF was generated with Chromium 141 using Playwright `page.pdf({ preferCSSPageSize: true, printBackground: true })`.
