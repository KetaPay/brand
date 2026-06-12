/**
 * @ketapay/brand — single source of truth for company identity.
 * Public information only. Never put secrets or internal config here.
 */

/** Registered legal entity name. */
export const COMPANY_LEGAL_NAME = "Keta Technologies Limited";

/** Public-facing trading name. */
export const TRADING_NAME = "KetaPay";

/** e.g. "Keta Technologies Limited (trading as KetaPay)" */
export const COMPANY_LEGAL_NAME_WITH_TRADING = `${COMPANY_LEGAL_NAME} (trading as ${TRADING_NAME})`;

/** e.g. "© 2026 Keta Technologies Limited. All rights reserved." */
export function copyrightLine(year: number = new Date().getFullYear()): string {
  return `© ${year} ${COMPANY_LEGAL_NAME}. All rights reserved.`;
}
