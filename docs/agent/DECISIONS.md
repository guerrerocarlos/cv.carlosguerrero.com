# cv.carlosguerrero.com Decisions

## 2026-07-20: Deploy Through W7S

The CV site deploys through W7S instead of GitHub Pages. The site is built as a static Astro artifact and deployed with `w7s-io/w7s-cloud@v1`.

## 2026-10-27: Separate application presentation

Keep the Polymarket application at `/polymarket/` with its own content data and print layout. The general CV remains available at `/`. The tailored page and PDF use the same rendered content, with shared contact data from `cv.json`.

Lead with organizational impact and reusable systems while retaining concrete React/TypeScript experience. The rPotential title is a user-approved descriptive title, not a verified HR title. Present Democrachain as an independent working prototype; do not imply production adoption.
