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
