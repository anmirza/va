/**
 * Shared cover + logo layout for directory cards and agency profile.
 * - Cover uses a fixed aspect ratio so height follows width.
 * - Logo is a square; size scales with viewport via clamp().
 * - The logo is centered on the bottom edge of the cover and overlaps the
 *   content below (~50/50), similar to common agency profile references.
 */

/**
 * Cover aspect ratio (width : height).
 * Flatter / shorter banner than 24:7 — less vertical space, more “cinematic strip”
 * (closer to reference layouts where the logo dominates relative to cover height).
 */
export const COVER_ASPECT_RATIO = 40 / 7

/** Tailwind-compatible aspect class for the cover. */
export const COVER_ASPECT_CLASS = 'aspect-[40/7]'

/**
 * Square logo edge length (CSS length).
 * Sized up vs earlier pass so the mark reads closer to reference cards (large
 * square vs short cover). Cards use a stronger vw term for narrow columns.
 */
export const CARD_LOGO_SQUARE_SIZE = 'clamp(7rem, 38vw, 12rem)'

/**
 * Profile hero — full width: larger square (~similar order to “logo height >
 * cover height” references when paired with the flatter aspect above).
 */
export const PROFILE_LOGO_SQUARE_SIZE = 'clamp(8.5rem, 24vw, 17rem)'

/**
 * Extra padding-top for the body block below the cover so headings clear the
 * half of the logo that overlaps the content area. Mirrors half of each logo
 * clamp range plus a small gap.
 */
export const CARD_CONTENT_PAD_TOP = 'calc(clamp(3.5rem, 19vw, 6rem) + 0.5rem)'

export const PROFILE_CONTENT_PAD_TOP = 'calc(clamp(4.25rem, 12vw, 8.5rem) + 0.75rem)'
