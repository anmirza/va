export type CategoryKey = 'agencies' | 'production'

export interface SuggestionGroup {
  heading: string
  icon: string
  items: SuggestionItem[]
}

export interface SuggestionItem {
  label: string
  href: string
}

export interface CategoryConfig {
  key: CategoryKey
  label: string
  placeholder: string
  page: string
  groups: SuggestionGroup[]
}

export const categories: CategoryConfig[] = [
  {
    key: 'agencies',
    label: 'Agencies',
    placeholder: 'Search agencies by name, location or specialty…',
    page: '/directory',
    groups: [
      {
        heading: 'Browse by Competency',
        icon: '🎯',
        items: [
          { label: 'Digital & Social', href: '/directory?competency=digital-social' },
          { label: 'Brand Strategy', href: '/directory?competency=brand-strategy' },
          { label: 'Creative Advertising', href: '/directory?competency=creative-advertising' },
          { label: 'PR & Communications', href: '/directory?competency=pr-communications' },
          { label: 'Performance Marketing', href: '/directory?competency=performance-marketing' },
          { label: 'Design & Branding', href: '/directory?competency=design-branding' },
        ],
      },
      {
        heading: 'Most Popular Locations',
        icon: '📍',
        items: [
          { label: 'London', href: '/directory?city=London' },
          { label: 'New York', href: '/directory?city=New+York' },
          { label: 'Paris', href: '/directory?city=Paris' },
          { label: 'Berlin', href: '/directory?city=Berlin' },
          { label: 'Los Angeles', href: '/directory?city=Los+Angeles' },
          { label: 'Dubai', href: '/directory?city=Dubai' },
        ],
      },
      {
        heading: 'By Size',
        icon: '🏢',
        items: [
          { label: 'Independent Agencies', href: '/directory?size=independent' },
          { label: 'Mid-Size (50–200)', href: '/directory?size=mid' },
          { label: 'Large Networks', href: '/directory?size=large' },
        ],
      },
    ],
  },
  {
    key: 'production',
    label: 'Production Companies',
    placeholder: 'Search production companies by name or specialty…',
    page: '/production',
    groups: [
      {
        heading: 'Browse by Specialty',
        icon: '🎬',
        items: [
          { label: 'Live Action', href: '/production?specialty=live-action' },
          { label: 'Animation & Motion', href: '/production?specialty=animation' },
          { label: 'VFX & Post-Production', href: '/production?specialty=vfx' },
          { label: 'Documentary', href: '/production?specialty=documentary' },
          { label: 'Music Videos', href: '/production?specialty=music-video' },
          { label: 'Digital & Interactive', href: '/production?specialty=digital' },
        ],
      },
      {
        heading: 'Top Locations',
        icon: '📍',
        items: [
          { label: 'Los Angeles', href: '/production?city=Los+Angeles' },
          { label: 'New York', href: '/production?city=New+York' },
          { label: 'London', href: '/production?city=London' },
          { label: 'Paris', href: '/production?city=Paris' },
          { label: 'Tokyo', href: '/production?city=Tokyo' },
        ],
      },
    ],
  },
]
