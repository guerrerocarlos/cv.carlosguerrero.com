# Polymarket application CV

Target: [Senior Web Engineer](https://jobs.ashbyhq.com/polymarket/80a2f94a-2c20-492a-8878-608671bd6c35).

The application emphasizes creating systems that enable teams and products. React, TypeScript, state management, real-time interaction, API integration, and operational tooling provide concrete technical evidence. No Next.js experience is claimed.

## Sources and editorial decisions

- rPotential: Carlos's direct account and approval in the CV planning conversation. Dates: March 2025 to August 2026. Descriptive title: Software Engineer, AI Products & Platform. Three teams used the templates; approximately half of the initial prototypes evolved into products. These are user-reported outcomes, not independently measured metrics.
- Data privacy: describe collaboration on restricted access and anonymization requirements. Do not claim sole implementation or a security certification.
- W7S: Carlos confirmed creation of the entire platform. Capabilities are supported by the [overview](https://w7s.io/docs/), [GitHub deployment](https://w7s.io/docs/deploy-from-github/), [storage](https://w7s.io/docs/storage-bindings/), [usage accounting](https://w7s.io/docs/usage-accounting/), and [Agent API](https://w7s.io/docs/agent-api/) documentation. No customer counts, cost savings, or productivity metrics are asserted.
- Democrachain: Carlos confirmed JavaScript/TypeScript authorship and independent working-prototype status. Reviewed the documentation and whitepaper in `democrachain/docs-democrachain-org` and TypeScript node components in `democrachain/node-democrachain-org`. Documentation retains older NxtFi naming; do not infer current adoption or production guarantees from its testnet descriptions. The GitHub organization is used as the project link because the supplied docs URL redirected to an unresolvable hostname during research.
- Anaconda, Masterworks, CacheP2P, education, and languages: retained or condensed from the existing `cv.json`. Omitted unverified percentage improvements, the parenting entry, and unrelated projects from this application version.
- The general CV is preserved. The tailored route and PDF share one data source; the PDF is a generated review artifact and must be regenerated after copy changes.

## Outstanding factual checks before submission

- The existing Anaconda dates overlap rPotential from March through December 2025. Both supplied date ranges are preserved; confirm whether this represents concurrent work or a date correction.
- W7S and Democrachain dates were not supplied and are omitted.
- Employment title is descriptive as requested, not independently verified as an official title.
- The posting's remote eligibility from Paraguay remains unconfirmed. No relocation or work-authorization claim is made.

## Validation

- Frozen-lockfile install and `corepack pnpm build`: passed; Astro reported zero errors, warnings, or hints. Vite reported an existing shared/dynamic `cv.json` import warning and outdated Browserslist data.
- Chromium: desktop 1280px and mobile 390px checked; no page errors or mobile horizontal overflow; print button invokes printing.
- PDF: two A4 pages, selectable text confirmed with `pdftotext`; experience on page one, projects and skills on page two.
- Merged to main and deployed on 2026-10-27: release `f6862e9`, Actions run `40547043950`. Public `/polymarket/` content and linked assets verified after propagation.

## Education and teaching expansion

Both education entries, full coursework, and AWS/Cisco certification names, issuers, years, and the available credential link are now shared from `cv.json`. Certification years are historical; current validity is not asserted. The ETI date range (2002 - 2019) is retained from the general CV and has not been independently verified. Carlos directly confirmed delivering MongoDB and Blender courses as an instructor; no teaching institutions, dates, audience counts, or syllabus details were supplied or invented.

Rebuilt successfully and repeated Chromium desktop/mobile, print-button, and PDF checks. The regenerated PDF remains two A4 pages with selectable education, certification, and teaching text.

## Approved project selection

Carlos confirmed end-to-end creation of Omattic Inbox and Invoices Templates. Both now use Creator & Developer, alongside W7S and Democrachain, replacing CacheP2P in this application. The Inbox link is explicitly described as a simulated showcase. Project copy is condensed to preserve education, certifications, and teaching. Source evidence and alternatives remain in `project-selection.md`.

SEOKeywordExplorer was also requested for this revision. Its entry describes source-supported React/TypeScript keyword research, provider integration, historical search positions, and report caching. No paid provider request or authenticated workflow was exercised. Compact project summaries preserve room for education, certifications, and instruction.

## Featured InglésConLiza project

Carlos requested InglésConLiza as a featured personal project built for his wife and confirmed its original Inbox, supporting services, Google Drive content management, and Cloudflare Containers/FFmpeg video processing. Repository state and the FFmpeg Containers dependency corroborate the architecture. Name the six supported channels rather than claiming integration with every social network. Campaign integration remains planned, not shipped. The expanded PDF now uses three pages to retain readable project detail and the full education/training section.

## Masterworks serverless frontend services

Carlos confirmed in October 2026 that he built and maintained frontend-related microservices for serverless infrastructure, including a progress bar still used in marketing emails. This continued use is user-reported; no employer systems were accessed to verify it.

## React ecosystem review and Inbox correction

Reviewed local manifests and source on 2026-10-27. Added libraries supported by actual application imports, without asserting expertise from dependencies alone:

- Inbox (support-inglesconliza-com): `src/lib/inbox-queries.ts`, `src/router.tsx`, and routes show TanStack Query and Router usage.
- SEOKeywordExplorer: `src/routes/__root.tsx`, `src/main.tsx`, and routes show TanStack Query/Router.
- Invoices Templates frontend (invoices-templates-bolt-new): invoice components consume the Radix-based shadcn Button; package and build configuration include Tailwind CSS and Vite. The invoices-templates-com repository contains its backend.
- W7S dashboard (w7s-v1/services/dashboard-app): `src/main.tsx` and pages use React Router; HomePage, OrgDetailPage, and RepoCard use Framer Motion.
- React Hook Form, Recharts, and several other packages appear in manifests or scaffold components, but were not added as skills without stronger application-use evidence.

Carlos clarified that the Inbox entry should describe the original InglesConLiza project, not the Omattic featured product. Replaced the simulated Omattic showcase link with the support console and moved planned campaign integration into Inbox. The earlier selection notes are historical and superseded by this clarification.

## Small browser-based personal projects

Carlos supplied the Compress Video URL and confirmed resize, cut, crop, and join functionality with no processing backend. KeePassWeb source (`guerrerocarlos/keepassweb`, index.html) documents local Web Crypto encryption and browser storage. Secure Channel source (`guerrerocarlos/secure-channel`, README.md, crypt.js, main.js) documents Web Crypto, encrypted links, browser-local keys and manual key disposal. Describe disposable key pairs, not private-key sharing or automatic expiry. These are implementation descriptions, not security-audit claims.
