// Types
export interface Company {
  id: string
  name: string
  tagline: string
  logo: string
  coverImage: string
  city: string
  country: string
  services: string[]
  sectors: string[]
  employees: number
  founded: number
  description: string
  website?: string
  about: string
  turnover?: string
  clients: string[]
  awards: number
}

export interface Campaign {
  id: string
  title: string
  agency: string
  agencyId: string
  brand: string
  year: number
  thumbnail: string
  format: string[]
  description?: string
}

export interface Person {
  id: string
  name: string
  photo: string
  role: string
  company: string
  companyId: string
}

export interface Award {
  id: string
  title: string
  festival: string
  year: number
  company: string
  companyId: string
  level: 'gold' | 'silver' | 'bronze'
  campaign?: string
}

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  thumbnail: string
  author: string
  content?: string
}

// Mock Data - Companies
export const companies: Company[] = [
  {
    id: 'wk-01',
    name: 'Wieden+Kennedy',
    tagline: 'Culture and Commerce',
    logo: 'https://via.placeholder.com/200x80?text=W+K',
    coverImage: 'https://via.placeholder.com/1200x400?text=Wieden+Kennedy',
    city: 'Portland',
    country: 'USA',
    services: ['Advertising', 'Digital', 'Strategy', 'Design'],
    sectors: ['Technology', 'Sports', 'Lifestyle', 'Entertainment'],
    employees: 450,
    founded: 1982,
    description: 'An independent advertising agency known for cultural creativity.',
    website: 'wk.com',
    about: 'Wieden+Kennedy is an independent advertising agency founded in 1982 by Dan Wieden and David Kennedy. Known for iconic campaigns and cultural leadership.',
    turnover: '$450M',
    clients: ['Nike', 'Coca-Cola', 'Pringles', 'Google'],
    awards: 247,
  },
  {
    id: '72-01',
    name: '72andSunny',
    tagline: 'Build Powerful Movements',
    logo: 'https://via.placeholder.com/200x80?text=72+Sunny',
    coverImage: 'https://via.placeholder.com/1200x400?text=72andSunny',
    city: 'Los Angeles',
    country: 'USA',
    services: ['Advertising', 'Strategy', 'Content', 'Creative'],
    sectors: ['Sports', 'Technology', 'Automotive', 'Entertainment'],
    employees: 350,
    founded: 2000,
    description: 'A creative agency focused on building powerful cultural movements.',
    website: '72andsunny.com',
    about: '72andSunny is a creative agency that specializes in brand building and cultural movements. Founded in 2000, they\'ve worked on some of the most iconic campaigns in advertising.',
    turnover: '$320M',
    clients: ['Apple', 'Adidas', 'Old Spice', 'PlayStation'],
    awards: 189,
  },
  {
    id: 'droga5-01',
    name: 'Droga5',
    tagline: 'Ideas Beyond Advertising',
    logo: 'https://via.placeholder.com/200x80?text=Droga5',
    coverImage: 'https://via.placeholder.com/1200x400?text=Droga5',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Design', 'Technology', 'Strategy'],
    sectors: ['Luxury', 'Technology', 'Sports', 'Finance'],
    employees: 420,
    founded: 2004,
    description: 'An independent full-service creative advertising agency.',
    website: 'droga5.com',
    about: 'Droga5 is an independent full-service creative advertising agency founded by Publicis in 2006. Known for integrated campaigns that go beyond traditional advertising.',
    turnover: '$380M',
    clients: ['GoPro', 'Twitter', 'The New York Times', 'Samsung'],
    awards: 203,
  },
  {
    id: 'bbh-01',
    name: 'Bartle Bogle Hegarty',
    tagline: 'The Bigger Picture',
    logo: 'https://via.placeholder.com/200x80?text=BBH',
    coverImage: 'https://via.placeholder.com/1200x400?text=BBH',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Strategy', 'Design', 'Digital'],
    sectors: ['Luxury', 'Technology', 'Finance', 'Automotive'],
    employees: 520,
    founded: 1982,
    description: 'A legendary British advertising agency known for innovative thinking.',
    website: 'bbh.co.uk',
    about: 'Bartle Bogle Hegarty (BBH) is a London-based advertising agency founded in 1982. Known for culturally relevant and innovative advertising campaigns.',
    turnover: '$420M',
    clients: ['Audi', 'Axe', 'Johnnie Walker', 'Levi\'s'],
    awards: 256,
  },
  {
    id: 'camp-01',
    name: 'Campaign',
    tagline: 'Fearlessly Creative',
    logo: 'https://via.placeholder.com/200x80?text=Campaign',
    coverImage: 'https://via.placeholder.com/1200x400?text=Campaign',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Digital', 'Strategy', 'Events'],
    sectors: ['Technology', 'Retail', 'Entertainment', 'Lifestyle'],
    employees: 280,
    founded: 2001,
    description: 'Award-winning creative and digital agency.',
    website: 'campaign.com',
    about: 'Campaign is a creative and digital agency specializing in integrated campaigns that connect brands with culture.',
    turnover: '$180M',
    clients: ['Spotify', 'Netflix', 'Red Bull', 'Heineken'],
    awards: 156,
  },
  {
    id: 'sbg-01',
    name: 'Special Group',
    tagline: 'Radical Cooperation',
    logo: 'https://via.placeholder.com/200x80?text=Special',
    coverImage: 'https://via.placeholder.com/1200x400?text=Special+Group',
    city: 'Sydney',
    country: 'Australia',
    services: ['Advertising', 'Strategy', 'Design', 'Creative'],
    sectors: ['Technology', 'Lifestyle', 'Entertainment', 'Sports'],
    employees: 180,
    founded: 2008,
    description: 'Independent creative agency known for radical cooperation.',
    website: 'specialgroup.com',
    about: 'Special Group is an independent creative agency from Sydney, Australia, known for innovative and culturally relevant work.',
    turnover: '$120M',
    clients: ['Google', 'Facebook', 'Booking.com', 'IKEA'],
    awards: 134,
  },
  {
    id: 'anomaly-01',
    name: 'Anomaly',
    tagline: 'There is a Better Way',
    logo: 'https://via.placeholder.com/200x80?text=Anomaly',
    coverImage: 'https://via.placeholder.com/1200x400?text=Anomaly',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Strategy', 'Media', 'Production'],
    sectors: ['Luxury', 'Technology', 'Automotive', 'Fashion'],
    employees: 380,
    founded: 2004,
    description: 'Independent strategic marketing and advertising company.',
    website: 'anomaly.com',
    about: 'Anomaly is an independent strategic marketing and advertising company with offices globally. Known for integrated campaigns.',
    turnover: '$340M',
    clients: ['KFC', 'Hennessy', 'Virgin Mobile', 'Warner Bros'],
    awards: 167,
  },
  {
    id: 'ff-01',
    name: 'Forsman & Bodenfors',
    tagline: 'Nordic Creativity',
    logo: 'https://via.placeholder.com/200x80?text=F+B',
    coverImage: 'https://via.placeholder.com/1200x400?text=FB',
    city: 'Gothenburg',
    country: 'Sweden',
    services: ['Advertising', 'Design', 'Strategy', 'Digital'],
    sectors: ['Technology', 'Consumer', 'Automotive', 'Lifestyle'],
    employees: 220,
    founded: 1992,
    description: 'Nordic creative agency known for innovative campaigns.',
    website: 'fb.se',
    about: 'Forsman & Bodenfors is a creative agency from Gothenburg, Sweden, known for innovative and culturally relevant advertising.',
    turnover: '$150M',
    clients: ['Sony', 'McDonald\'s', 'Volvo', 'LEGO'],
    awards: 145,
  },
  {
    id: 'vccp-01',
    name: 'VCCP',
    tagline: 'Effectiveness Unlocked',
    logo: 'https://via.placeholder.com/200x80?text=VCCP',
    coverImage: 'https://via.placeholder.com/1200x400?text=VCCP',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Data', 'Strategy', 'Digital'],
    sectors: ['Retail', 'Finance', 'Technology', 'Automotive'],
    employees: 500,
    founded: 1991,
    description: 'Leading effectiveness-driven agency.',
    website: 'vccp.com',
    about: 'VCCP is an effects-driven advertising agency with expertise in data, technology, and creative thinking.',
    turnover: '$380M',
    clients: ['Tesco', 'PlayStation', 'Snickers', 'Unilever'],
    awards: 198,
  },
  {
    id: 'rga-01',
    name: 'R/GA',
    tagline: 'Build Transformative Experiences',
    logo: 'https://via.placeholder.com/200x80?text=RGA',
    coverImage: 'https://via.placeholder.com/1200x400?text=RGA',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Technology', 'Design', 'Strategy'],
    sectors: ['Technology', 'Sports', 'Entertainment', 'Fashion'],
    employees: 820,
    founded: 1977,
    description: 'Creative, marketing, and technology agency.',
    website: 'rga.com',
    about: 'R/GA is a creative, marketing, and technology company that builds transformative digital experiences for the world\'s leading brands.',
    turnover: '$500M+',
    clients: ['Nike', 'BMW', 'Intel', 'Beats By Dre'],
    awards: 278,
  },
]

// Mock Data - Campaigns
export const campaigns: Campaign[] = [
  {
    id: 'camp-01',
    title: 'Just Do It',
    agency: 'Wieden+Kennedy',
    agencyId: 'wk-01',
    brand: 'Nike',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=Just+Do+It',
    format: ['Digital', 'Social', 'TV'],
    description: 'Iconic campaign pushing the limits of human potential',
  },
  {
    id: 'camp-02',
    title: 'Share a Coke',
    agency: '72andSunny',
    agencyId: '72-01',
    brand: 'Coca-Cola',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=Share+Coke',
    format: ['Print', 'Digital', 'OOH'],
    description: 'Personalized bottles creating human connections',
  },
  {
    id: 'camp-03',
    title: 'The Man Your Man Could Smell Like',
    agency: 'Wieden+Kennedy',
    agencyId: 'wk-01',
    brand: 'Old Spice',
    year: 2022,
    thumbnail: 'https://via.placeholder.com/400x300?text=Old+Spice',
    format: ['TV', 'Digital', 'Social'],
    description: 'Humorous campaign rebranding Old Spice for modern audiences',
  },
  {
    id: 'camp-04',
    title: 'Think Different',
    agency: '72andSunny',
    agencyId: '72-01',
    brand: 'Apple',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=Think+Different',
    format: ['TV', 'Print', 'Digital'],
    description: 'Celebrating innovative thinking and creative minds',
  },
  {
    id: 'camp-05',
    title: 'GoPro Hero',
    agency: 'Droga5',
    agencyId: 'droga5-01',
    brand: 'GoPro',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=GoPro',
    format: ['Digital', 'Social', 'Video'],
    description: 'User-generated content celebrating adventure',
  },
  {
    id: 'camp-06',
    title: 'Impossible is Nothing',
    agency: 'BBH',
    agencyId: 'bbh-01',
    brand: 'Adidas',
    year: 2022,
    thumbnail: 'https://via.placeholder.com/400x300?text=Impossible',
    format: ['TV', 'Digital', 'Print'],
    description: 'Inspirational campaign featuring athletes breaking limits',
  },
  {
    id: 'camp-07',
    title: 'Where it All Begins',
    agency: 'VCCP',
    agencyId: 'vccp-01',
    brand: 'Tesco',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=Tesco',
    format: ['TV', 'Digital', 'OOH'],
    description: 'Retail excellence campaign connecting customers to community',
  },
  {
    id: 'camp-08',
    title: 'Volvo Trucks',
    agency: 'Forsman & Bodenfors',
    agencyId: 'ff-01',
    brand: 'Volvo',
    year: 2023,
    thumbnail: 'https://via.placeholder.com/400x300?text=Volvo',
    format: ['Digital', 'Video'],
    description: 'Innovation in commercial transportation',
  },
]

// Mock Data - Talent
export const talent: Person[] = [
  {
    id: 'talent-01',
    name: 'Jane Smith',
    photo: 'https://via.placeholder.com/300x300?text=Jane+Smith',
    role: 'Creative Director',
    company: 'Wieden+Kennedy',
    companyId: 'wk-01',
  },
  {
    id: 'talent-02',
    name: 'Michael Chen',
    photo: 'https://via.placeholder.com/300x300?text=Michael+Chen',
    role: 'Chief Strategy Officer',
    company: '72andSunny',
    companyId: '72-01',
  },
  {
    id: 'talent-03',
    name: 'Emma Johnson',
    photo: 'https://via.placeholder.com/300x300?text=Emma+Johnson',
    role: 'Executive Creative Director',
    company: 'Droga5',
    companyId: 'droga5-01',
  },
  {
    id: 'talent-04',
    name: 'David Martinez',
    photo: 'https://via.placeholder.com/300x300?text=David+Martinez',
    role: 'Head of Digital',
    company: 'BBH',
    companyId: 'bbh-01',
  },
  {
    id: 'talent-05',
    name: 'Sophie Wilson',
    photo: 'https://via.placeholder.com/300x300?text=Sophie+Wilson',
    role: 'Chief Creative Officer',
    company: 'VCCP',
    companyId: 'vccp-01',
  },
  {
    id: 'talent-06',
    name: 'Alex Kim',
    photo: 'https://via.placeholder.com/300x300?text=Alex+Kim',
    role: 'Art Director',
    company: 'Special Group',
    companyId: 'sbg-01',
  },
]

// Mock Data - Awards
export const awards: Award[] = [
  {
    id: 'award-01',
    title: 'Grand Prix',
    festival: 'Cannes Lions',
    year: 2023,
    company: 'Wieden+Kennedy',
    companyId: 'wk-01',
    level: 'gold',
    campaign: 'Just Do It',
  },
  {
    id: 'award-02',
    title: 'Gold Lion',
    festival: 'Cannes Lions',
    year: 2023,
    company: '72andSunny',
    companyId: '72-01',
    level: 'gold',
    campaign: 'Think Different',
  },
  {
    id: 'award-03',
    title: 'Silver Lion',
    festival: 'Cannes Lions',
    year: 2023,
    company: 'Droga5',
    companyId: 'droga5-01',
    level: 'silver',
    campaign: 'GoPro Hero',
  },
  {
    id: 'award-04',
    title: 'One Show Gold',
    festival: 'The One Show',
    year: 2023,
    company: 'BBH',
    companyId: 'bbh-01',
    level: 'gold',
  },
  {
    id: 'award-05',
    title: 'D&AD Pencil',
    festival: 'D&AD Awards',
    year: 2023,
    company: 'VCCP',
    companyId: 'vccp-01',
    level: 'gold',
  },
  {
    id: 'award-06',
    title: 'Clio Gold',
    festival: 'Clio Awards',
    year: 2023,
    company: 'Special Group',
    companyId: 'sbg-01',
    level: 'gold',
  },
  {
    id: 'award-07',
    title: 'Webby Award',
    festival: 'Webby Awards',
    year: 2023,
    company: 'R/GA',
    companyId: 'rga-01',
    level: 'gold',
  },
]

// Mock Data - News
export const news: NewsArticle[] = [
  {
    id: 'news-01',
    title: 'Wieden+Kennedy Opens New London Office',
    excerpt: 'Legendary Portland agency expands European presence',
    category: 'Agency News',
    date: '2024-02-15',
    thumbnail: 'https://via.placeholder.com/300x200?text=WK+London',
    author: 'Sarah Anderson',
  },
  {
    id: 'news-02',
    title: 'Nike Campaign Wins Grand Prix at Cannes',
    excerpt: 'Groundbreaking sports campaign takes top prize',
    category: 'Awards',
    date: '2024-02-10',
    thumbnail: 'https://via.placeholder.com/300x200?text=Nike+Cannes',
    author: 'James Mitchell',
  },
  {
    id: 'news-03',
    title: 'The Future of Advertising: AI and Creativity',
    excerpt: 'Industry leaders discuss generative AI impact',
    category: 'Trends',
    date: '2024-02-08',
    thumbnail: 'https://via.placeholder.com/300x200?text=AI+Future',
    author: 'Emma Thompson',
  },
  {
    id: 'news-04',
    title: '72andSunny Merges with Digital Studio',
    excerpt: 'Strategic partnership strengthens capabilities',
    category: 'Business',
    date: '2024-02-05',
    thumbnail: 'https://via.placeholder.com/300x200?text=Merger',
    author: 'Robert Chen',
  },
  {
    id: 'news-05',
    title: 'Sustainability Becomes Core to Brand Strategy',
    excerpt: 'Agencies embracing environmental responsibility',
    category: 'Trends',
    date: '2024-02-01',
    thumbnail: 'https://via.placeholder.com/300x200?text=Sustainability',
    author: 'Lisa Greene',
  },
]

// Helper functions
export function getCompanyById(id: string): Company | undefined {
  return companies.find(c => c.id === id)
}

export function getCampaignsByAgency(agencyId: string): Campaign[] {
  return campaigns.filter(c => c.agencyId === agencyId)
}

export function getAwardsByCompany(companyId: string): Award[] {
  return awards.filter(a => a.companyId === companyId)
}

export function getTalentByCompany(companyId: string): Person[] {
  return talent.filter(t => t.companyId === companyId)
}

export function getNewsByCategory(category: string): NewsArticle[] {
  return news.filter(n => n.category === category)
}

export function searchCompanies(query: string, filters?: { city?: string; services?: string[]; sectors?: string[] }): Company[] {
  let results = companies.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  )

  if (filters?.city) {
    results = results.filter(c => c.city.toLowerCase() === filters.city!.toLowerCase())
  }

  if (filters?.services && filters.services.length > 0) {
    results = results.filter(c =>
      filters.services!.some(s => c.services.includes(s))
    )
  }

  if (filters?.sectors && filters.sectors.length > 0) {
    results = results.filter(c =>
      filters.sectors!.some(s => c.sectors.includes(s))
    )
  }

  return results
}
