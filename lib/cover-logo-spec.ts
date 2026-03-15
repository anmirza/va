/**
 * Shared cover + logo dimensions (Scanbook / VTSCAN alignment).
 * Client requirement: "Logo and cover must have same dimension."
 * - Cover uses a fixed aspect ratio so height is deterministic from width.
 * - Logo container sits inside the cover and uses the same height as the cover
 *   (full cover height), with proportional width, for a consistent look.
 */

/**
 * Cover aspect ratio (width : height).
 * Slightly flatter than 21:9 so the hero area doesn't dominate vertically,
 * while still feeling cinematic on the profile page.
 */
export const COVER_ASPECT_RATIO = 24 / 7

/** Tailwind-compatible aspect class for the cover (same dimensions across card and profile). */
export const COVER_ASPECT_CLASS = 'aspect-[24/7]'

/**
 * Logo container: full height of cover.
 * Card logo is a bit wider; profile logo slightly narrower so it feels lighter.
 */
export const CARD_LOGO_BOX_WIDTH_PERCENT = 40
export const CARD_LOGO_BOX_MIN_WIDTH_PX = 150
export const CARD_LOGO_BOX_MAX_WIDTH_PX = 360

export const PROFILE_LOGO_BOX_WIDTH_PERCENT = 32
export const PROFILE_LOGO_BOX_MIN_WIDTH_PX = 140
export const PROFILE_LOGO_BOX_MAX_WIDTH_PX = 320
