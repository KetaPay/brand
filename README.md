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

copyrightLine();      // "© 2026 Keta Technologies Limited. All rights reserved."
copyrightLine(2025);  // "© 2025 Keta Technologies Limited. All rights reserved."
```

The package builds itself on install via the `prepare` script — no publish step needed.
