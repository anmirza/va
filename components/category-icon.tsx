'use client'

import { getVACategoryByName } from '@/lib/admin-store'

export function CategoryIcon({ 
  categoryName, 
  defaultIcon: DefaultIcon, 
  className = "w-6 h-6" 
}: { 
  categoryName?: string, 
  defaultIcon?: React.ElementType, 
  className?: string 
}) {
  const cat = categoryName ? getVACategoryByName(categoryName) : undefined
  
  if (cat?.iconSvg) {
    return (
      <div 
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: cat.iconSvg }}
      />
    )
  }

  if (DefaultIcon) {
    return <DefaultIcon className={className} />
  }

  return null
}
