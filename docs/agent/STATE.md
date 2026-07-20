# cv.carlosguerrero.com State

Cloned on 2026-07-20 from `https://github.com/guerrerocarlos/cv.carlosguerrero.com`.

Current runtime shape:

- Local repo: `/home/gnu/cv.carlosguerrero.com`
- GitHub remote: `https://github.com/guerrerocarlos/cv.carlosguerrero.com`
- Telegram manager topic: `cv.carlosguerrero.com` topic id `3496`
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
