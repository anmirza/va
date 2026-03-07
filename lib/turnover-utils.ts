/**
 * Auto-updating turnover years — always shows a 5-year historical window.
 * In 2026: [2025, 2024, 2023, 2022, 2021]
 * In 2027: [2026, 2025, 2024, 2023, 2022]
 */
export function getTurnoverYears(): string[] {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => (currentYear - 1 - i).toString())
}

/** Revenue regions used in turnover tables */
export const REVENUE_REGIONS = ['LOCAL', 'GLOBAL', 'NAM', 'EUROPE', 'LATAM', 'AFRICA', 'APAC'] as const

/** Blocked personal email domains */
export const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
  'live.com', 'msn.com', 'me.com', 'gmx.com', 'inbox.com',
]

export function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? BLOCKED_EMAIL_DOMAINS.includes(domain) : false
}
