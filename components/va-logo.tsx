'use client'

/**
 * VA logo — uses the exact logo image (logo-va.png) everywhere.
 */
export function VaLogo({
  className = '',
  width = 62,
  height = 39,
  ariaLabel = 'VA',
}: {
  className?: string
  width?: number
  height?: number
  ariaLabel?: string
}) {
  return (
    <img
      src="/logo-va.png"
      alt={ariaLabel}
      width={width}
      height={height}
      className={className}
      style={{ width, height, objectFit: 'contain' }}
      loading="eager"
      decoding="async"
    />
  )
}
