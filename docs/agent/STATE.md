# cv.carlosguerrero.com State

Cloned on 2026-07-20 from `https://github.com/guerrerocarlos/cv.carlosguerrero.com`.

Current runtime shape:

- Local repo: `/home/gnu/cv.carlosguerrero.com`
- GitHub remote: `https://github.com/guerrerocarlos/cv.carlosguerrero.com`
- Telegram manager topic: `cv.carlosguerrero.com` topic id `33054`, Omattic chat `-1003996402615` (registered 2026-10-27 after cloning on this host). Topic `3496` is historical.
- W7S custom domain: `cv.carlosguerrero.com`
- App framework: Astro with Tailwind
- Package manager: pnpm `10.6.3`

Current product state:

- The CV site deploys through W7S from GitHub Actions on pushes to `main`.
- The previous GitHub Pages workflow was replaced by `.github/workflows/deploy.yml`.
- The Keet QR card was removed from the hero section, and `public/keet.png` was removed.
- GitHub Actions run `29747951644` deployed commit `39992ea121ca51df3e7a586ffe9e319cf43fdccc` to W7S successfully on 2026-07-20.
- Immediately after W7S deployment, normal DNS for `cv.carlosguerrero.com` still served GitHub Pages. Verify W7S through `https://guerrerocarlos.w7s.cloud/cv.carlosguerrero.com/` until DNS is moved.
- W7S recommended adding TXT `_w7s.carlosguerrero.com=guerrerocarlos/cv.carlosguerrero.com`.

## 2026-10-27: Polymarket application CV

- Added a separate `/polymarket/` application CV, retaining the general CV and business cards.
- Content lives in `src/data/polymarket.json`; contact details are shared from `cv.json`.
- Focus: systems that enable teams, with rPotential first and W7S/Democrachain as selected platforms.
- The route has noindex metadata, visible print skills and links, and a two-page A4 layout. Noindex is not access control.
- Reviewed PDF: `docs/applications/polymarket/carlos-guerrero.pdf`.
- Source provenance and outstanding factual checks: `docs/applications/polymarket/README.md`.
- Local build, browser and PDF checks passed. Merged and deployed to production on 2026-10-27; pushing main deploys automatically.

- Production release: `f6862e9b40364be3d2d057f665826b0c098eeecd`, successful GitHub Actions run `40547043950`. Verified the public `/polymarket/` content and assets after a brief propagation delay.

- Expanded the application CV with both education entries and coursework, historical AWS/Cisco certifications, and user-confirmed MongoDB/Blender course instruction. Education and certificates are shared from `cv.json`; the regenerated PDF remains two A4 pages.
