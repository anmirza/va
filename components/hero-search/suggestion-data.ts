export type CategoryKey =
  | 'agencies'
  | 'production'
  | 'consultants'
  | 'ads'
  | 'awards'
  | 'talent'
  | 'academic'

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
    placeholder: 'Search production companies…',
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
  {
    key: 'consultants',
    label: 'Pitch Consultants',
    placeholder: 'Search pitch consultants…',
    page: '/consultants',
    groups: [
      {
        heading: 'Browse by Expertise',
        icon: '💼',
        items: [
          { label: 'Pitch Strategy', href: '/consultants?expertise=pitch-strategy' },
          { label: 'Agency Selection', href: '/consultants?expertise=agency-selection' },
          { label: 'Contract Negotiation', href: '/consultants?expertise=contract-negotiation' },
          { label: 'Brand Consultancy', href: '/consultants?expertise=brand-consultancy' },
          { label: 'Procurement Advisory', href: '/consultants?expertise=procurement' },
        ],
      },
      {
        heading: 'Top Regions',
        icon: '🌍',
        items: [
          { label: 'Europe', href: '/consultants?region=europe' },
          { label: 'North America', href: '/consultants?region=north-america' },
          { label: 'Asia Pacific', href: '/consultants?region=apac' },
          { label: 'Middle East & Africa', href: '/consultants?region=mea' },
        ],
      },
    ],
  },
  {
    key: 'ads',
    label: 'Ads',
    placeholder: 'Search ads by brand, product or theme…',
    page: '/creative-library',
    groups: [
      {
        heading: 'Browse by Format',
        icon: '📺',
        items: [
          { label: 'TV Commercial', href: '/creative-library?format=tv' },
          { label: 'Online Video', href: '/creative-library?format=online-video' },
          { label: 'Print & Outdoor', href: '/creative-library?format=print' },
          { label: 'Digital & Interactive', href: '/creative-library?format=digital' },
          { label: 'Social Media', href: '/creative-library?format=social' },
          { label: 'Experiential', href: '/creative-library?format=experiential' },
        ],
      },
      {
        heading: 'Browse by Sector',
        icon: '🏷️',
        items: [
          { label: 'Automotive', href: '/creative-library?sector=automotive' },
          { label: 'FMCG & Food', href: '/creative-library?sector=fmcg' },
          { label: 'Tech & Telecoms', href: '/creative-library?sector=tech' },
          { label: 'Fashion & Luxury', href: '/creative-library?sector=fashion' },
          { label: 'Charity & Social', href: '/creative-library?sector=charity' },
          { label: 'Finance', href: '/creative-library?sector=finance' },
        ],
      },
      {
        heading: 'Trending Now',
        icon: '🔥',
        items: [
          { label: 'Most Awarded', href: '/creative-library?sort=awarded' },
          { label: 'Recent Releases', href: '/creative-library?sort=recent' },
          { label: 'Viral Campaigns', href: '/creative-library?sort=viral' },
        ],
      },
    ],
  },
  {
    key: 'awards',
    label: 'Awards',
    placeholder: 'Search award shows and winners…',
    page: '/awards',
    groups: [
      {
        heading: 'Browse by Show',
        icon: '🏆',
        items: [
          { label: 'Cannes Lions', href: '/awards?show=cannes-lions' },
          { label: 'D&AD', href: '/awards?show=dandad' },
          { label: 'One Show', href: '/awards?show=one-show' },
          { label: 'Effie Awards', href: '/awards?show=effie' },
          { label: 'Clio Awards', href: '/awards?show=clio' },
          { label: 'Grand Prix', href: '/awards?level=grand_prix' },
        ],
      },
      {
        heading: 'Browse by Level',
        icon: '🥇',
        items: [
          { label: 'Grand Prix Winners', href: '/awards?level=grand_prix' },
          { label: 'Gold Winners', href: '/awards?level=gold' },
          { label: 'Silver Winners', href: '/awards?level=silver' },
          { label: 'Bronze Winners', href: '/awards?level=bronze' },
        ],
      },
    ],
  },
  {
    key: 'talent',
    label: 'Talent',
    placeholder: 'Search creative talent by role or name…',
    page: '/talent',
    groups: [
      {
        heading: 'Browse by Role',
        icon: '👤',
        items: [
          { label: 'Creative Directors', href: '/talent?role=Creative+Director' },
          { label: 'Art Directors', href: '/talent?role=Art+Director' },
          { label: 'Copywriters', href: '/talent?role=Copywriter' },
          { label: 'Strategists', href: '/talent?role=Strategist' },
          { label: 'Motion Designers', href: '/talent?role=Motion+Designer' },
          { label: 'UX Designers', href: '/talent?role=UX+Designer' },
        ],
      },
      {
        heading: 'Browse by Availability',
        icon: '📅',
        items: [
          { label: 'Available for Hire', href: '/talent?available=true' },
          { label: 'Freelance', href: '/talent?type=freelance' },
          { label: 'Open to Relocation', href: '/talent?relocate=true' },
        ],
      },
    ],
  },
  {
    key: 'academic',
    label: 'Academic',
    placeholder: 'Search schools, courses and programmes…',
    page: '/academic',
    groups: [
      {
        heading: 'Browse by Type',
        icon: '🎓',
        items: [
          { label: 'Ad Schools', href: '/academic?type=Ad+School' },
          { label: 'Universities', href: '/academic?type=University' },
          { label: 'Online Courses', href: '/academic?type=Online+Course' },
          { label: 'Workshops', href: '/academic?type=Workshop' },
        ],
      },
      {
        heading: 'Browse by Programme',
        icon: '📚',
        items: [
          { label: 'Creative Advertising', href: '/academic?programme=creative-advertising' },
          { label: 'Brand Strategy', href: '/academic?programme=brand-strategy' },
          { label: 'Digital Marketing', href: '/academic?programme=digital-marketing' },
          { label: 'Design & Art Direction', href: '/academic?programme=design-art-direction' },
          { label: 'Executive & MBA', href: '/academic?programme=executive-mba' },
        ],
      },
      {
        heading: 'Top Locations',
        icon: '📍',
        items: [
          { label: 'USA', href: '/academic?country=USA' },
          { label: 'UK', href: '/academic?country=UK' },
          { label: 'Europe', href: '/academic?country=europe' },
          { label: 'Online / Global', href: '/academic?country=global' },
        ],
      },
    ],
  },
]
