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
