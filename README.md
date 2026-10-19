# @ketapay/brand

Single source of truth for KetaPay company and legal identity (legal name, trading name, copyright line). Public information only — never add secrets or internal config.

## Install (git dependency)

```json
"dependencies": {
  "@ketapay/brand": "github:KetaPay/brand"
}
```

Pin to a tag or commit for reproducible builds, e.g. `github:KetaPay/brand#v0.1.0`.

## Usage

```ts
import { COMPANY_LEGAL_NAME, COMPANY_LEGAL_NAME_WITH_TRADING, copyrightLine } from "@ketapay/brand";

copyrightLine();      // "© 2026 Keta Solutions Limited. All rights reserved."
copyrightLine(2025);  // "© 2025 Keta Solutions Limited. All rights reserved."
```

The package builds itself on install via the `prepare` script — no publish step needed.

## CDN (cdn.ketapay.com)

Static images for every environment. A file at `cdn/<path>` is served at `https://cdn.ketapay.com/<path>`, e.g. `cdn/email/logo-white.png`.

- Merging to `main` uploads `cdn/` (`.github/workflows/cdn.yml`). The bucket and CloudFront live in the `ketapay-cdn` stack (`api/infra/cdn.yml`).
- Never delete or rename a file under `cdn/`: sent emails keep linking to it. Add a new file instead; pull requests fail otherwise.
- Email images are drawn by `email-assets/build.mjs` (Playwright): `PLAYWRIGHT=<path to playwright/index.mjs> node email-assets/build.mjs`.
