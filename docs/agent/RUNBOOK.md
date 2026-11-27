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
3. Open `http://127.0.0.1:4321/cv/polymarket/`, check desktop and narrow mobile layouts, and use Print / Save PDF.
4. Use A4, 100% scale, CSS margins, and disable browser headers/footers. Save the reviewed output to `docs/applications/polymarket/carlos-guerrero.pdf`. Regenerate it whenever application copy changes.
5. Confirm three pages and selectable text using `pdfinfo` and `pdftotext -layout`. Check that experience, projects, skills, contact details, and links survive printing.
6. Commit and push a review branch. Do not merge to main until publication is authorized.

The 2026-10-27 PDF was generated with Chromium 141 using Playwright `page.pdf({ preferCSSPageSize: true, printBackground: true })`.

## CV gateway deployment

The W7S workflow publishes CV content. The dedicated Cloudflare gateway is deployed separately with the authenticated local Wrangler session after verification and commit:

```sh
corepack pnpm test:gateway
corepack pnpm build
corepack pnpm exec wrangler deploy --dry-run
corepack pnpm deploy:gateway
curl -fsS https://carlosguerrero.com/cv/health
curl -sSI https://cv.carlosguerrero.com/polymarket/
curl -fsS https://carlosguerrero.com/cv
```

The historical CNAME file is deliberately excluded from W7S artifacts after the one-time transfer of the old hostname route from w7s-io to this gateway. Gateway code/config changes require deploy:gateway; ordinary content changes continue through W7S on main. Verify CV CSS, /cv/polymarket/, /cv/print-cards and /cv/api/card.pdf after changes. The old hostname redirects to the same path under /cv; the apex homepage still redirects to www. Do not point the gateway upstream at the old public hostname, which would create a redirect loop.
