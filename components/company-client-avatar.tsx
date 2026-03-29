'use client'

export function CompanyClientAvatar({
  name,
  logoUrl,
  className = 'w-9 h-9 rounded-lg',
}: {
  name: string
  logoUrl?: string | null
  className?: string
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  if (logoUrl) {
    return (
      <div
        className={`${className} overflow-hidden border border-[#0763d8]/20 bg-white/[0.06] flex items-center justify-center`}
      >
        <img src={logoUrl} alt="" className="max-w-[85%] max-h-[85%] object-contain" />
      </div>
    )
  }
  return (
    <div
      className={`${className} flex items-center justify-center text-[11px] font-extrabold text-[#0763d8] border border-[#0763d8]/20`}
      style={{ background: 'rgba(7,99,216,0.08)' }}
    >
      {initials || '?'}
    </div>
  )
}
