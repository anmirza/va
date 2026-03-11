// ============================================================
// TYPES
// ============================================================

export interface User {
  id: string
  email: string
  name: string
  role: 'agency_owner' | 'talent' | 'marketer' | 'admin' | 'client' | 'production'
  status?: 'pending_review' | 'active'
  companyId?: string
  talentId?: string
  avatar?: string
}

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
  offices?: string[]
  competencies?: string[]
  clientIndustries?: string[]
  socialLinks?: { twitter?: string; linkedin?: string; instagram?: string }
  featured?: boolean
  phone?: string
  address?: string
  postcode?: string
  vatNumber?: string
  network?: string
  typeTags?: string[]
  newBusinessWins?: {
    brand: string
    sector: string
    type: string
    date: string
    reach: 'National' | 'International' | 'Global'
    status: 'Won' | 'In Progress'
  }[]
  contactsByDept?: {
    department: string
    contacts: {
      name: string
      role: string
      email?: string
      phone?: string
      linkedin?: string
      photo?: string
    }[]
  }[]
}

export interface ProductionCompany {
  id: string
  name: string
  city: string
  country: string
  logo: string
  coverImage: string
  specialties: string[]
  employees: number
  website?: string
  description: string
  about: string
  founded: number
  clients: string[]
}

export interface SearchConsultant {
  id: string
  name: string
  photo: string
  firm: string
  city: string
  country: string
  bio: string
  expertise: string[]
  founded?: number
  website?: string
}

export interface AwardOrganization {
  id: string
  name: string
  logo: string
  description: string
  website: string
  country: string
  frequency: 'annual' | 'biennial'
  founded: number
  categories: string[]
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
  mediaType?: string
  awardWins?: number
  views?: number
  country?: string
  sector?: string
}

export interface Person {
  id: string
  name: string
  photo: string
  role: string
  company: string
  companyId: string
  bio?: string
  expertise?: string[]
  socialLinks?: { twitter?: string; linkedin?: string }
  featured?: boolean
  coverImage?: string
  city?: string
  country?: string
}

export interface Award {
  id: string
  title: string
  festival: string
  festivalId?: string
  year: number
  company: string
  companyId: string
  level: 'gold' | 'silver' | 'bronze' | 'grand_prix'
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
  tags?: string[]
}

export interface Interview {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  subject: string
  subjectId?: string
  subjectType: 'agency' | 'talent' | 'brand'
  date: string
  category: string
  thumbnail: string
}

export interface Insight {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  thumbnail: string
}

export interface Playlist {
  id: string
  userId: string
  name: string
  campaignIds: string[]
  isPublic: boolean
}

// ============================================================
// COMPANIES (35 agencies)
// ============================================================

export const companies: Company[] = [
  {
    id: 'wk-01',
    name: 'Wieden+Kennedy',
    tagline: 'Culture and Commerce',
    logo: '/logos/wieden-kennedy.svg',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
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
    offices: ['Portland', 'New York', 'London', 'Amsterdam', 'Tokyo', 'Shanghai'],
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
    clientIndustries: ['Sports', 'Lifestyle', 'Technology', 'FMCG'],
    featured: true,
    phone: '+1 503 937 7700',
    address: '224 NW 13th Ave',
    postcode: '97209',
    vatNumber: 'US-82-1234567',
    network: 'Independent',
    typeTags: ['Full Service', 'Independent', 'Digital', 'Creative'],
    newBusinessWins: [
      { brand: 'Nike Running', sector: 'Sports', type: 'Creative', date: 'Jan 2025', reach: 'Global', status: 'Won' },
      { brand: 'Coca-Cola Zero', sector: 'Beverages', type: 'Digital', date: 'Dec 2024', reach: 'International', status: 'Won' },
      { brand: 'Google Pixel', sector: 'Technology', type: 'Creative', date: 'Nov 2024', reach: 'Global', status: 'Won' },
      { brand: 'Uber Eats', sector: 'Technology', type: 'Social Media', date: 'Feb 2025', reach: 'National', status: 'In Progress' },
    ],
    contactsByDept: [
      { department: 'Management', contacts: [
        { name: 'Karl Lieberman', role: 'Global CEO', email: 'karl@wk.com', phone: '+1 503 937 7701' },
        { name: 'Susan Hoffman', role: 'Chief Creative Officer', email: 'susan@wk.com' },
      ]},
      { department: 'Creative', contacts: [
        { name: 'Eric Baldwin', role: 'Executive Creative Director', email: 'eric@wk.com' },
        { name: 'Jason Bagley', role: 'Creative Director', email: 'jason@wk.com' },
        { name: 'Danielle Flagg', role: 'Associate Creative Director' },
      ]},
      { department: 'Strategy', contacts: [
        { name: 'Martin Weigel', role: 'Head of Planning', email: 'martin@wk.com' },
        { name: 'Beth Shuster', role: 'Senior Strategist' },
      ]},
    ],
  },
  {
    id: '72-01',
    name: '72andSunny',
    tagline: 'Build Powerful Movements',
    logo: '/logos/72andsunny.svg',
    coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    city: 'Los Angeles',
    country: 'USA',
    services: ['Advertising', 'Strategy', 'Content', 'Creative'],
    sectors: ['Sports', 'Technology', 'Automotive', 'Entertainment'],
    employees: 350,
    founded: 2000,
    description: 'A creative agency focused on building powerful cultural movements.',
    website: '72andsunny.com',
    about: '72andSunny is a creative agency that specializes in brand building and cultural movements.',
    turnover: '$320M',
    clients: ['Apple', 'Adidas', 'Old Spice', 'PlayStation'],
    awards: 189,
    competencies: ['Full Service', 'Content', 'Brand Strategy'],
    clientIndustries: ['Sports', 'Technology', 'Automotive'],
    featured: true,
    phone: '+1 310 215 9009',
    address: '12101 W Olympic Blvd',
    postcode: '90064',
    vatNumber: 'US-95-7654321',
    network: 'Independent',
    typeTags: ['Full Service', 'Independent', 'Content'],
    newBusinessWins: [
      { brand: 'Adidas Originals', sector: 'Sports', type: 'Creative', date: 'Feb 2025', reach: 'Global', status: 'Won' },
      { brand: 'PlayStation 6', sector: 'Entertainment', type: 'Digital', date: 'Jan 2025', reach: 'Global', status: 'In Progress' },
      { brand: 'Spotify', sector: 'Technology', type: 'Social Media', date: 'Dec 2024', reach: 'International', status: 'Won' },
    ],
    contactsByDept: [
      { department: 'Management', contacts: [
        { name: 'Matt Jarvis', role: 'Co-Founder & CEO', email: 'matt@72andsunny.com' },
        { name: 'Glenn Cole', role: 'Co-Founder & CCO', email: 'glenn@72andsunny.com' },
      ]},
      { department: 'Creative', contacts: [
        { name: 'Bryan Rowles', role: 'Executive Creative Director' },
        { name: 'Jessica Shriftman', role: 'Creative Director' },
      ]},
      { department: 'Strategy', contacts: [
        { name: 'Mick DiMaria', role: 'Chief Strategy Officer' },
        { name: 'Evin Shutt', role: 'Managing Director' },
      ]},
    ],
  },
  {
    id: 'droga5-01',
    name: 'Droga5',
    tagline: 'Ideas Beyond Advertising',
    logo: '/logos/droga5.svg',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Design', 'Technology', 'Strategy'],
    sectors: ['Luxury', 'Technology', 'Sports', 'Finance'],
    employees: 420,
    founded: 2004,
    description: 'An independent full-service creative advertising agency.',
    website: 'droga5.com',
    about: 'Droga5 is an independent full-service creative advertising agency known for integrated campaigns.',
    turnover: '$380M',
    clients: ['GoPro', 'Twitter', 'The New York Times', 'Samsung'],
    awards: 203,
    competencies: ['Full Service', 'Digital', 'Design'],
    featured: true,
    phone: '+1 212 208 1560',
    address: '120 Wall St, 10th Floor',
    postcode: '10005',
    vatNumber: 'US-13-9876543',
    network: 'Accenture Song',
    typeTags: ['Full Service', 'Digital', 'Integrated'],
    newBusinessWins: [
      { brand: 'Samsung Galaxy', sector: 'Technology', type: 'Creative', date: 'Feb 2025', reach: 'Global', status: 'Won' },
      { brand: 'NYT Digital', sector: 'Media', type: 'Digital', date: 'Jan 2025', reach: 'National', status: 'Won' },
      { brand: 'Under Armour', sector: 'Sports', type: 'Creative', date: 'Dec 2024', reach: 'International', status: 'In Progress' },
      { brand: 'Hennessy', sector: 'Luxury', type: 'Creative', date: 'Nov 2024', reach: 'Global', status: 'Won' },
    ],
    contactsByDept: [
      { department: 'Management', contacts: [
        { name: 'Sarah Thompson', role: 'CEO', email: 'sarah@droga5.com' },
        { name: 'Felix Richter', role: 'President', email: 'felix@droga5.com' },
      ]},
      { department: 'Creative', contacts: [
        { name: 'Tim Gordon', role: 'Chief Creative Officer', email: 'tim@droga5.com' },
        { name: 'Leah Merken', role: 'Group Creative Director' },
        { name: 'Kevin Brady', role: 'Creative Director' },
      ]},
      { department: 'Digital', contacts: [
        { name: 'Nina Park', role: 'Head of Digital', email: 'nina@droga5.com' },
        { name: 'Alex Duval', role: 'Technology Director' },
      ]},
    ],
  },
  {
    id: 'bbh-01',
    name: 'Bartle Bogle Hegarty',
    tagline: 'The Bigger Picture',
    logo: 'https://via.placeholder.com/200x80?text=BBH',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Strategy', 'Design', 'Digital'],
    sectors: ['Luxury', 'Technology', 'Finance', 'Automotive'],
    employees: 520,
    founded: 1982,
    description: 'A legendary British advertising agency known for innovative thinking.',
    website: 'bbh.co.uk',
    about: 'Bartle Bogle Hegarty (BBH) is a London-based advertising agency founded in 1982.',
    turnover: '$420M',
    clients: ['Audi', 'Axe', 'Johnnie Walker', "Levi's"],
    awards: 256,
    competencies: ['Full Service', 'Brand Strategy', 'Luxury'],
    offices: ['London', 'New York', 'Singapore', 'Mumbai'],
    featured: true,
  },
  {
    id: 'camp-01',
    name: 'Campaign Agency',
    tagline: 'Fearlessly Creative',
    logo: 'https://via.placeholder.com/200x80?text=Campaign',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Digital', 'Strategy', 'Events'],
    sectors: ['Technology', 'Retail', 'Entertainment', 'Lifestyle'],
    employees: 280,
    founded: 2001,
    description: 'Award-winning creative and digital agency.',
    website: 'campaign.com',
    about: 'Campaign is a creative and digital agency specializing in integrated campaigns.',
    turnover: '$180M',
    clients: ['Spotify', 'Netflix', 'Red Bull', 'Heineken'],
    awards: 156,
  },
  {
    id: 'sbg-01',
    name: 'Special Group',
    tagline: 'Radical Cooperation',
    logo: 'https://via.placeholder.com/200x80?text=Special',
    coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    city: 'Sydney',
    country: 'Australia',
    services: ['Advertising', 'Strategy', 'Design', 'Creative'],
    sectors: ['Technology', 'Lifestyle', 'Entertainment', 'Sports'],
    employees: 180,
    founded: 2008,
    description: 'Independent creative agency known for radical cooperation.',
    website: 'specialgroup.com',
    about: 'Special Group is an independent creative agency from Sydney, Australia.',
    turnover: '$120M',
    clients: ['Google', 'Facebook', 'Booking.com', 'IKEA'],
    awards: 134,
  },
  {
    id: 'anomaly-01',
    name: 'Anomaly',
    tagline: 'There is a Better Way',
    logo: 'https://via.placeholder.com/200x80?text=Anomaly',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Strategy', 'Media', 'Production'],
    sectors: ['Luxury', 'Technology', 'Automotive', 'Fashion'],
    employees: 380,
    founded: 2004,
    description: 'Independent strategic marketing and advertising company.',
    website: 'anomaly.com',
    about: 'Anomaly is an independent strategic marketing and advertising company with offices globally.',
    turnover: '$340M',
    clients: ['KFC', 'Hennessy', 'Virgin Mobile', 'Warner Bros'],
    awards: 167,
  },
  {
    id: 'ff-01',
    name: 'Forsman & Bodenfors',
    tagline: 'Nordic Creativity',
    logo: 'https://via.placeholder.com/200x80?text=F+B',
    coverImage: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80',
    city: 'Gothenburg',
    country: 'Sweden',
    services: ['Advertising', 'Design', 'Strategy', 'Digital'],
    sectors: ['Technology', 'Consumer', 'Automotive', 'Lifestyle'],
    employees: 220,
    founded: 1992,
    description: 'Nordic creative agency known for innovative campaigns.',
    website: 'fb.se',
    about: 'Forsman & Bodenfors is a creative agency from Gothenburg, Sweden.',
    turnover: '$150M',
    clients: ["Sony", "McDonald's", 'Volvo', 'LEGO'],
    awards: 145,
    competencies: ['Full Service', 'Digital', 'Design'],
  },
  {
    id: 'vccp-01',
    name: 'VCCP',
    tagline: 'Effectiveness Unlocked',
    logo: 'https://via.placeholder.com/200x80?text=VCCP',
    coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
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
    coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Technology', 'Design', 'Strategy'],
    sectors: ['Technology', 'Sports', 'Entertainment', 'Fashion'],
    employees: 820,
    founded: 1977,
    description: 'Creative, marketing, and technology agency.',
    website: 'rga.com',
    about: "R/GA is a creative, marketing, and technology company that builds transformative digital experiences.",
    turnover: '$500M+',
    clients: ['Nike', 'BMW', 'Intel', 'Beats By Dre'],
    awards: 278,
    competencies: ['Digital', 'Technology', 'Full Service'],
    offices: ['New York', 'London', 'Los Angeles', 'Sydney', 'Singapore'],
  },
  // --- New agencies ---
  {
    id: 'betc-01',
    name: 'BETC Paris',
    tagline: 'Creating Culture, One Campaign at a Time',
    logo: 'https://via.placeholder.com/200x80?text=BETC',
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
    city: 'Paris',
    country: 'France',
    services: ['Advertising', 'Digital', 'Brand Strategy', 'Events'],
    sectors: ['Luxury', 'Automotive', 'Retail', 'Finance'],
    employees: 600,
    founded: 1994,
    description: 'One of the most awarded creative agencies in France.',
    website: 'betc.com',
    about: 'BETC is a leading French advertising agency with a strong track record across luxury, automotive, and consumer brands.',
    turnover: '$500M',
    clients: ['Canal+', 'Evian', 'Peugeot', 'Louis Vuitton'],
    awards: 320,
    offices: ['Paris', 'São Paulo', 'London'],
    competencies: ['Full Service', 'Luxury', 'Brand Strategy'],
    clientIndustries: ['Luxury', 'Automotive', 'Media'],
    featured: true,
    phone: '+33 1 56 41 35 00',
    address: '117-119 Rue Saint-Denis',
    postcode: '75001',
    vatNumber: 'FR-76-345678901',
    network: 'Havas Group',
    typeTags: ['Full Service', 'Luxury', 'Creative'],
    newBusinessWins: [
      { brand: 'Canal+ Series', sector: 'Media', type: 'Creative', date: 'Feb 2025', reach: 'International', status: 'Won' },
      { brand: 'Peugeot E-3008', sector: 'Automotive', type: 'Creative', date: 'Jan 2025', reach: 'Global', status: 'Won' },
      { brand: 'Evian Sparkling', sector: 'FMCG', type: 'Digital', date: 'Dec 2024', reach: 'International', status: 'Won' },
      { brand: 'Lacoste', sector: 'Fashion', type: 'Creative', date: 'Nov 2024', reach: 'Global', status: 'In Progress' },
      { brand: 'Air France Premium', sector: 'Travel', type: 'Media Planning', date: 'Oct 2024', reach: 'Global', status: 'Won' },
    ],
    contactsByDept: [
      { department: 'Management', contacts: [
        { name: 'Bertille Toledano', role: 'CEO', email: 'bertille@betc.com', phone: '+33 1 56 41 35 01' },
        { name: 'Stéphane Xiberras', role: 'Chief Creative Officer', email: 'stephane@betc.com' },
      ]},
      { department: 'Creative', contacts: [
        { name: 'Isabelle Moreau', role: 'Creative Director', email: 'isabelle@betc.com' },
        { name: 'Rémi Babinet', role: 'Founding Creative Director' },
        { name: 'Antoine Choque', role: 'Associate Creative Director' },
      ]},
      { department: 'Strategy', contacts: [
        { name: 'Clément Boisseau', role: 'Chief Strategy Officer' },
        { name: 'Marie Laroche', role: 'Senior Planner' },
      ]},
    ],
  },
  {
    id: 'havas-01',
    name: 'Havas Paris',
    tagline: 'Making a Meaningful Difference',
    logo: 'https://via.placeholder.com/200x80?text=Havas',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    city: 'Paris',
    country: 'France',
    services: ['Full Service', 'Media', 'Digital', 'PR'],
    sectors: ['Finance', 'Retail', 'Automotive', 'Healthcare'],
    employees: 1200,
    founded: 1835,
    description: 'Global communications group with deep roots in France.',
    website: 'havas.com',
    about: 'Havas is one of the world\'s largest global communications groups.',
    turnover: '$2.4B',
    clients: ['Air France', 'Renault', 'BNP Paribas', 'SFR'],
    awards: 645,
    offices: ['Paris', 'New York', 'London', 'Dubai', 'Tokyo'],
    competencies: ['Full Service', 'Media', 'PR', 'Digital'],
    featured: true,
  },
  {
    id: 'tbwa-01',
    name: 'TBWA\\Paris',
    tagline: 'Disruption on Demand',
    logo: 'https://via.placeholder.com/200x80?text=TBWA',
    coverImage: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80',
    city: 'Paris',
    country: 'France',
    services: ['Advertising', 'Strategy', 'Digital', 'Media'],
    sectors: ['Automotive', 'Technology', 'Retail', 'Healthcare'],
    employees: 480,
    founded: 1970,
    description: 'Home of Disruption® - redefining how brands grow.',
    website: 'tbwa.com',
    about: 'TBWA is the Disruption® company, producing work that creates value for our clients.',
    turnover: '$380M',
    clients: ['Apple', 'Nissan', 'Adidas', 'PlayStation'],
    awards: 275,
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
  },
  {
    id: 'ogilvy-01',
    name: 'Ogilvy London',
    tagline: 'We Make Brands Matter',
    logo: 'https://via.placeholder.com/200x80?text=Ogilvy',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'PR', 'Digital', 'Brand Consulting'],
    sectors: ['Finance', 'FMCG', 'Technology', 'Luxury'],
    employees: 900,
    founded: 1948,
    description: 'One of the world\'s most awarded advertising agencies.',
    website: 'ogilvy.com',
    about: 'Ogilvy inspires brands and people to impact the world through creativity and effectiveness.',
    turnover: '$800M',
    clients: ['IBM', 'Dove', 'American Express', 'Coca-Cola'],
    awards: 430,
    offices: ['London', 'New York', 'Paris', 'Mumbai', 'Shanghai'],
    competencies: ['Full Service', 'PR', 'Digital', 'Brand Consulting'],
    featured: true,
    phone: '+44 20 7345 3000',
    address: 'Sea Containers, 18 Upper Ground',
    postcode: 'SE1 9ET',
    vatNumber: 'GB-123456789',
    network: 'WPP',
    typeTags: ['Full Service', 'PR', 'Digital', 'Brand Consulting'],
    newBusinessWins: [
      { brand: 'Dove Men+Care', sector: 'FMCG', type: 'Creative', date: 'Feb 2025', reach: 'Global', status: 'Won' },
      { brand: 'IBM Cloud', sector: 'Technology', type: 'Digital', date: 'Jan 2025', reach: 'Global', status: 'Won' },
      { brand: 'American Express UK', sector: 'Finance', type: 'Media Planning', date: 'Dec 2024', reach: 'National', status: 'In Progress' },
      { brand: 'Prada', sector: 'Luxury', type: 'PR', date: 'Nov 2024', reach: 'International', status: 'Won' },
    ],
    contactsByDept: [
      { department: 'Management', contacts: [
        { name: 'Devika Bulchandani', role: 'Global CEO', email: 'devika@ogilvy.com', phone: '+44 20 7345 3001' },
        { name: 'Liz Taylor', role: 'Global Chief Creative Officer', email: 'liz@ogilvy.com' },
      ]},
      { department: 'Creative', contacts: [
        { name: 'Daniel Fisher', role: 'UK Chief Creative Officer', email: 'daniel@ogilvy.com' },
        { name: 'Marcos Kotlhar', role: 'Executive Creative Director' },
        { name: 'Sarah Coleman', role: 'Creative Director' },
      ]},
      { department: 'PR & Influence', contacts: [
        { name: 'James Baldwin', role: 'Head of PR', email: 'james@ogilvy.com' },
        { name: 'Sophie Chen', role: 'Senior Account Director' },
      ]},
    ],
  },
  {
    id: 'ddb-01',
    name: 'DDB Worldwide',
    tagline: 'Unexpected Works',
    logo: 'https://via.placeholder.com/200x80?text=DDB',
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Digital', 'Social Media', 'PR'],
    sectors: ['Automotive', 'FMCG', 'Finance', 'Healthcare'],
    employees: 700,
    founded: 1949,
    description: 'Creative agency pioneering unexpected advertising work.',
    website: 'ddb.com',
    about: 'DDB is a global advertising agency network known for unexpected, high-impact work.',
    turnover: '$650M',
    clients: ['Volkswagen', 'Budweiser', "McDonald's", 'Philips'],
    awards: 380,
    offices: ['New York', 'Chicago', 'Berlin', 'Paris', 'Tokyo'],
    competencies: ['Full Service', 'Digital', 'Social Media'],
  },
  {
    id: 'grey-01',
    name: 'Grey',
    tagline: 'Famously Effective',
    logo: 'https://via.placeholder.com/200x80?text=Grey',
    coverImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Design', 'Content', 'Digital'],
    sectors: ['Healthcare', 'FMCG', 'Finance', 'Retail'],
    employees: 650,
    founded: 1917,
    description: 'Famously effective advertising since 1917.',
    website: 'grey.com',
    about: 'Grey is a global advertising agency known for its effectiveness-first philosophy.',
    turnover: '$600M',
    clients: ['P&G', 'Volvo', 'T-Mobile', 'Bayer'],
    awards: 290,
    competencies: ['Full Service', 'Healthcare', 'Brand Strategy'],
  },
  {
    id: 'mccann-01',
    name: 'McCann Worldgroup',
    tagline: 'Truth Well Told',
    logo: 'https://via.placeholder.com/200x80?text=McCann',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Healthcare', 'Digital', 'Media'],
    sectors: ['Healthcare', 'FMCG', 'Automotive', 'Finance'],
    employees: 1500,
    founded: 1902,
    description: 'One of the largest and most storied global agency networks.',
    website: 'mccann.com',
    about: 'McCann is a global advertising and marketing services network operating in over 120 countries.',
    turnover: '$2B+',
    clients: ['Coca-Cola', 'Microsoft', 'L\'Oréal', 'Nestlé'],
    awards: 510,
    offices: ['New York', 'London', 'Paris', 'Tokyo', 'São Paulo', 'Mumbai'],
    competencies: ['Full Service', 'Healthcare', 'Media'],
  },
  {
    id: 'dentsu-01',
    name: 'DENTSU CREATIVE',
    tagline: 'Innovating to Impact',
    logo: 'https://via.placeholder.com/200x80?text=Dentsu',
    coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    city: 'Tokyo',
    country: 'Japan',
    services: ['Full Service', 'Technology', 'Digital', 'Strategy'],
    sectors: ['Automotive', 'Electronics', 'FMCG', 'Sports'],
    employees: 2000,
    founded: 1901,
    description: "Japan's leading creative and advertising agency.",
    website: 'dentsu.com',
    about: 'Dentsu is a global integrated communications group with roots in Tokyo, Japan.',
    turnover: '$5B+',
    clients: ['Toyota', 'Sony', 'Canon', 'Panasonic'],
    awards: 480,
    offices: ['Tokyo', 'London', 'New York', 'Mumbai', 'Sydney'],
    competencies: ['Full Service', 'Digital', 'Technology'],
    featured: true,
  },
  {
    id: 'publicis-01',
    name: 'Publicis Conseil',
    tagline: 'Viva la Différence',
    logo: 'https://via.placeholder.com/200x80?text=Publicis',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    city: 'Paris',
    country: 'France',
    services: ['Advertising', 'Digital', 'Brand Strategy', 'Media'],
    sectors: ['Retail', 'Luxury', 'Automotive', 'FMCG'],
    employees: 800,
    founded: 1926,
    description: 'The flagship agency of the Publicis Groupe.',
    website: 'publicisgroupe.com',
    about: 'Publicis Conseil is the flagship creative agency of Publicis Groupe, one of the world\'s leading communications groups.',
    turnover: '$700M',
    clients: ['Renault', 'L\'Oréal', 'Orange', 'BNP Paribas'],
    awards: 365,
    offices: ['Paris', 'London', 'New York'],
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
  },
  {
    id: 'leoburnett-01',
    name: 'Leo Burnett',
    tagline: 'Human Kind',
    logo: 'https://via.placeholder.com/200x80?text=Leo',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    city: 'Chicago',
    country: 'USA',
    services: ['Advertising', 'Brand Strategy', 'Digital', 'Social Media'],
    sectors: ['FMCG', 'Food', 'Beverages', 'Retail'],
    employees: 750,
    founded: 1935,
    description: 'Creating humankind-inspired advertising since 1935.',
    website: 'leoburnett.com',
    about: 'Leo Burnett is a global advertising agency network that creates human-centered brand work.',
    turnover: '$680M',
    clients: ["McDonald's", 'Samsung', 'Marlboro', 'Kellogg\'s'],
    awards: 340,
    offices: ['Chicago', 'London', 'Toronto', 'Dubai', 'Seoul'],
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
  },
  {
    id: 'adam-01',
    name: 'adam&eveDDB',
    tagline: 'If In Doubt, Don\'t',
    logo: 'https://via.placeholder.com/200x80?text=adam%26eve',
    coverImage: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Digital', 'Content', 'Events'],
    sectors: ['FMCG', 'Retail', 'Finance', 'Automotive'],
    employees: 350,
    founded: 2008,
    description: 'One of the UK\'s most creatively ambitious agencies.',
    website: 'adamandeveddb.com',
    about: 'adam&eveDDB is a London-based creative agency known for emotionally intelligent advertising.',
    turnover: '$300M',
    clients: ['John Lewis', 'Amazon', 'Volkswagen', 'Harvey Nichols'],
    awards: 280,
    competencies: ['Full Service', 'Brand Strategy'],
    featured: true,
  },
  {
    id: 'motherny-01',
    name: 'Mother New York',
    tagline: 'Make the Mother of All Ads',
    logo: 'https://via.placeholder.com/200x80?text=Mother',
    coverImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    city: 'New York',
    country: 'USA',
    services: ['Advertising', 'Digital', 'Brand Strategy'],
    sectors: ['Fashion', 'Lifestyle', 'Entertainment', 'Technology'],
    employees: 250,
    founded: 1996,
    description: 'An independent creative agency with no conventional departments.',
    website: 'motherne.com',
    about: 'Mother is an independent creative agency with offices in New York, London, and Buenos Aires.',
    turnover: '$200M',
    clients: ['Beck\'s Beer', 'IKEA', 'Stella Artois', 'Sour Patch Kids'],
    awards: 175,
    offices: ['New York', 'London', 'Buenos Aires'],
  },
  {
    id: 'serviceplan-01',
    name: 'Serviceplan Group',
    tagline: 'The House of Communication',
    logo: 'https://via.placeholder.com/200x80?text=Serviceplan',
    coverImage: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800&q=80',
    city: 'Munich',
    country: 'Germany',
    services: ['Advertising', 'PR', 'Media', 'Digital', 'Strategy'],
    sectors: ['Automotive', 'Retail', 'Healthcare', 'FMCG'],
    employees: 3500,
    founded: 1970,
    description: 'Europe\'s largest independent agency group.',
    website: 'serviceplan.com',
    about: 'Serviceplan Group is Europe\'s largest owner-managed agency group, with 23 "Houses of Communication" worldwide.',
    turnover: '$1.5B',
    clients: ['BMW', 'Procter & Gamble', 'Penny', 'Siemens'],
    awards: 520,
    offices: ['Munich', 'Hamburg', 'Berlin', 'Paris', 'London', 'Brussels'],
    competencies: ['Full Service', 'Media', 'PR', 'Digital'],
  },
  {
    id: 'junkvonmatt-01',
    name: 'Jung von Matt',
    tagline: 'Ideas That Hurt',
    logo: 'https://via.placeholder.com/200x80?text=JvM',
    coverImage: 'https://images.unsplash.com/photo-1444159652248-9e21ef449ef6?w=800&q=80',
    city: 'Hamburg',
    country: 'Germany',
    services: ['Advertising', 'Digital', 'Brand Strategy', 'Design'],
    sectors: ['Automotive', 'Sports', 'Technology', 'Retail'],
    employees: 900,
    founded: 1991,
    description: 'Germany\'s most creatively decorated independent agency.',
    website: 'jvm.com',
    about: 'Jung von Matt is an independent creative agency network headquartered in Hamburg.',
    turnover: '$600M',
    clients: ['Mercedes-Benz', 'Burger King', 'Edeka', 'Puma'],
    awards: 400,
    offices: ['Hamburg', 'Berlin', 'Vienna', 'Stockholm', 'Athens'],
    competencies: ['Full Service', 'Digital', 'Brand Strategy'],
    featured: true,
  },
  {
    id: 'lola-01',
    name: 'LOLA MullenLowe',
    tagline: 'Hyper-Bundled Creativity',
    logo: 'https://via.placeholder.com/200x80?text=LOLA',
    coverImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    city: 'Madrid',
    country: 'Spain',
    services: ['Advertising', 'Digital', 'Brand Strategy', 'Social Media'],
    sectors: ['Beverages', 'FMCG', 'Retail', 'Automotive'],
    employees: 320,
    founded: 2000,
    description: 'Madrid-based agency known for culturally vibrant work.',
    website: 'lolamullenlowe.com',
    about: 'LOLA MullenLowe is a Madrid-based creative agency famous for bold, culturally-charged advertising.',
    turnover: '$250M',
    clients: ['Burger King', 'IKEA', 'Magnum', 'Solán de Cabras'],
    awards: 310,
    competencies: ['Full Service', 'Social Media', 'Brand Strategy'],
  },
  {
    id: 'almapbbdo-01',
    name: 'AlmapBBDO',
    tagline: 'The Most Creative Agency in Brazil',
    logo: 'https://via.placeholder.com/200x80?text=AlmapBBDO',
    coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    city: 'São Paulo',
    country: 'Brazil',
    services: ['Advertising', 'Digital', 'Strategy', 'Social Media'],
    sectors: ['Beverages', 'FMCG', 'Automotive', 'Finance'],
    employees: 450,
    founded: 1993,
    description: 'Brazil\'s most consistently awarded creative agency.',
    website: 'almapbbdo.com.br',
    about: 'AlmapBBDO is Brazil\'s most celebrated creative agency and part of the BBDO Worldwide network.',
    turnover: '$350M',
    clients: ['Volkswagen', 'Audi', 'Getty Images', 'Pepsi'],
    awards: 480,
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
    featured: true,
  },
  {
    id: 'clemenger-01',
    name: 'Clemenger BBDO',
    tagline: 'Work That Changes Things',
    logo: 'https://via.placeholder.com/200x80?text=Clemenger',
    coverImage: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&q=80',
    city: 'Melbourne',
    country: 'Australia',
    services: ['Advertising', 'Digital', 'Design', 'Strategy'],
    sectors: ['FMCG', 'Healthcare', 'Finance', 'Retail'],
    employees: 380,
    founded: 1964,
    description: 'Australia\'s leading creative agency.',
    website: 'clemengerbbdo.com.au',
    about: 'Clemenger BBDO is Australia\'s leading advertising agency, consistently ranked among the most creative in the world.',
    turnover: '$280M',
    clients: ['ANZ Bank', 'Cadbury', 'Carlton Draught', 'VB'],
    awards: 290,
    competencies: ['Full Service', 'Brand Strategy'],
  },
  {
    id: 'lucky-01',
    name: 'Lucky Generals',
    tagline: 'Advertising for the Long Run',
    logo: 'https://via.placeholder.com/200x80?text=Lucky+Generals',
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Advertising', 'Digital', 'Brand Strategy'],
    sectors: ['Retail', 'Finance', 'FMCG', 'Technology'],
    employees: 120,
    founded: 2013,
    description: 'Independent London agency built for the long run.',
    website: 'luckygenerals.com',
    about: 'Lucky Generals is a fully independent creative agency committed to doing advertising that works long into the future.',
    turnover: '$90M',
    clients: ['Amazon', 'Yorkshire Tea', 'Greggs', 'the7stars'],
    awards: 138,
    competencies: ['Full Service', 'Brand Strategy'],
  },
  {
    id: 'iris-01',
    name: 'iris Worldwide',
    tagline: 'Participation Brand Strategy',
    logo: 'https://via.placeholder.com/200x80?text=iris',
    coverImage: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=800&q=80',
    city: 'London',
    country: 'UK',
    services: ['Digital', 'Experiential', 'Social Media', 'Strategy'],
    sectors: ['Beverages', 'Sports', 'Technology', 'Retail'],
    employees: 900,
    founded: 1999,
    description: 'Global independent creative innovation agency.',
    website: 'iris-worldwide.com',
    about: 'iris is a global creative innovation agency focused on participation brand strategy.',
    turnover: '$300M',
    clients: ['adidas', 'Samsung', 'Johnnie Walker', 'Shell'],
    awards: 210,
    offices: ['London', 'New York', 'Singapore', 'Atlanta'],
    competencies: ['Digital', 'Experiential', 'Social Media'],
  },
  {
    id: 'fk-01',
    name: 'Fallon',
    tagline: 'Doing Things Differently',
    logo: 'https://via.placeholder.com/200x80?text=Fallon',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    city: 'Minneapolis',
    country: 'USA',
    services: ['Advertising', 'Digital', 'Brand Strategy'],
    sectors: ['Automotive', 'Finance', 'Technology', 'Retail'],
    employees: 200,
    founded: 1981,
    description: 'Award-winning independent creative agency in Minneapolis.',
    website: 'fallon.com',
    about: 'Fallon is an independent creative agency headquartered in Minneapolis, known for bold, original thinking.',
    turnover: '$160M',
    clients: ['BMW', 'United Airlines', 'Citibank', 'NBC Sports'],
    awards: 230,
    competencies: ['Full Service', 'Brand Strategy'],
  },
  {
    id: 'colenso-01',
    name: 'Colenso BBDO',
    tagline: 'Brave, New Ideas',
    logo: 'https://via.placeholder.com/200x80?text=Colenso',
    coverImage: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
    city: 'Auckland',
    country: 'New Zealand',
    services: ['Advertising', 'Digital', 'Design', 'Strategy'],
    sectors: ['FMCG', 'Retail', 'Healthcare', 'Finance'],
    employees: 150,
    founded: 1987,
    description: 'New Zealand\'s most internationally recognised creative agency.',
    website: 'colensobbdo.co.nz',
    about: 'Colenso BBDO is one of the most recognised advertising agencies in New Zealand and Asia-Pacific.',
    turnover: '$110M',
    clients: ['DB Breweries', 'Spark', 'The Warehouse', 'Air New Zealand'],
    awards: 195,
    competencies: ['Full Service', 'Digital', 'Design'],
  },
  {
    id: 'heimat-01',
    name: 'Heimat Berlin',
    tagline: 'Sharply Focused Creativity',
    logo: 'https://via.placeholder.com/200x80?text=Heimat',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc57?w=800&q=80',
    city: 'Berlin',
    country: 'Germany',
    services: ['Advertising', 'Digital', 'Brand Strategy'],
    sectors: ['Retail', 'Food', 'FMCG', 'Technology'],
    employees: 200,
    founded: 1999,
    description: 'Berlin\'s leading independent creative agency.',
    website: 'heimat.de',
    about: 'Heimat is an independent creative agency in Berlin known for culturally resonant, ideas-driven work.',
    turnover: '$140M',
    clients: ['HORNBACH', 'Edeka', 'Sixt', 'Mercedes-Benz'],
    awards: 160,
    competencies: ['Full Service', 'Brand Strategy', 'Digital'],
  },
  {
    id: 'sid-01',
    name: 'SID LEE',
    tagline: 'Transformative Creativity',
    logo: 'https://via.placeholder.com/200x80?text=SID+LEE',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    city: 'Montreal',
    country: 'Canada',
    services: ['Advertising', 'Design', 'Architecture', 'Digital'],
    sectors: ['Sports', 'Lifestyle', 'Retail', 'Entertainment'],
    employees: 600,
    founded: 1993,
    description: 'Multidisciplinary creative agency from Montreal.',
    website: 'sidlee.com',
    about: 'Sid Lee is a multidisciplinary creative agency with offices in Montreal, Amsterdam, Paris, Los Angeles, and Toronto.',
    turnover: '$280M',
    clients: ['Adidas', 'Red Bull', 'Cirque du Soleil', 'Ubisoft'],
    awards: 245,
    offices: ['Montreal', 'Amsterdam', 'Paris', 'Los Angeles', 'Toronto'],
    competencies: ['Full Service', 'Design', 'Experiential'],
    featured: true,
  },
]

// ============================================================
// PRODUCTION COMPANIES
// ============================================================

export const productionCompanies: ProductionCompany[] = [
  {
    id: 'prod-01',
    name: 'MJZ',
    city: 'Los Angeles',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=MJZ',
    coverImage: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&q=80',
    specialties: ['Live Action', 'Commercials', 'Music Videos'],
    employees: 120,
    website: 'mjz.com',
    description: 'Award-winning global production company.',
    about: 'MJZ is a global production company representing leading commercial directors. Known for cinematic storytelling.',
    founded: 1990,
    clients: ['Nike', 'Apple', 'Google', 'Coca-Cola'],
  },
  {
    id: 'prod-02',
    name: 'Rattling Stick',
    city: 'London',
    country: 'UK',
    logo: 'https://via.placeholder.com/200x80?text=Rattling+Stick',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    specialties: ['Live Action', 'VFX', 'Commercials'],
    employees: 80,
    website: 'rattlingstick.com',
    description: 'Boutique production company based in London.',
    about: 'Rattling Stick is a London-based production company working with world-class directors.',
    founded: 2006,
    clients: ['Johnnie Walker', 'Three', 'Sky', 'Waitrose'],
  },
  {
    id: 'prod-03',
    name: 'Biscuit Filmworks',
    city: 'Los Angeles',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=Biscuit',
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    specialties: ['Live Action', 'Commercials', 'VFX'],
    employees: 95,
    website: 'biscuitfilmworks.com',
    description: 'Production company representing award-winning commercial directors.',
    about: 'Biscuit Filmworks is a production company representing award-winning directors worldwide.',
    founded: 2004,
    clients: ['Old Spice', 'State Farm', 'AT&T', 'Jeep'],
  },
  {
    id: 'prod-04',
    name: 'Les Télécréateurs',
    city: 'Paris',
    country: 'France',
    logo: 'https://via.placeholder.com/200x80?text=LTC',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    specialties: ['Live Action', 'Animation', 'Commercials'],
    employees: 60,
    website: 'lestele.fr',
    description: 'Creative production house based in Paris.',
    about: 'Les Télécréateurs is a Parisian production company known for its creative and cinematic approach.',
    founded: 2005,
    clients: ['Canal+', 'Renault', 'BETC', 'Publicis'],
  },
  {
    id: 'prod-05',
    name: 'Partizan',
    city: 'Paris',
    country: 'France',
    logo: 'https://via.placeholder.com/200x80?text=Partizan',
    coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80',
    specialties: ['Music Videos', 'Commercials', 'Live Action', 'Animation'],
    employees: 150,
    website: 'partizan.com',
    description: 'Global production company renowned for music video and commercial work.',
    about: 'Partizan is a multi-award-winning production company working in music video, commercials, and film.',
    founded: 1991,
    clients: ['Daft Punk', 'Nike', 'Samsung', 'Hermès'],
  },
  {
    id: 'prod-06',
    name: 'Academy Films',
    city: 'London',
    country: 'UK',
    logo: 'https://via.placeholder.com/200x80?text=Academy',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
    specialties: ['Commercials', 'Music Videos', 'Film'],
    employees: 70,
    website: 'academyfilms.com',
    description: 'Award-winning creative production company.',
    about: 'Academy Films has been producing award-winning commercials and music videos since 1986.',
    founded: 1986,
    clients: ['Volkswagen', 'Sony', 'O2', 'BT'],
  },
]

// ============================================================
// SEARCH CONSULTANTS
// ============================================================

export const searchConsultants: SearchConsultant[] = [
  {
    id: 'cons-01',
    name: 'Sarah Mitchell',
    photo: 'https://via.placeholder.com/300x300?text=Sarah+Mitchell',
    firm: 'Mitchell & Partners',
    city: 'London',
    country: 'UK',
    bio: 'Sarah is a leading agency search consultant with 20+ years of experience facilitating agency-client relationships across EMEA.',
    expertise: ['Agency Search', 'Pitch Management', 'Brand Strategy', 'Creative Assessment'],
    founded: 2005,
    website: 'mitchellandpartners.co.uk',
  },
  {
    id: 'cons-02',
    name: 'Pierre Dubois',
    photo: 'https://via.placeholder.com/300x300?text=Pierre+Dubois',
    firm: 'Dubois Conseil',
    city: 'Paris',
    country: 'France',
    bio: 'Pierre specialises in agency selection and brand consultancy for French and European brands.',
    expertise: ['Agency Selection', 'Brand Consultancy', 'Luxury', 'Retail'],
    founded: 2010,
    website: 'duboisconseil.fr',
  },
  {
    id: 'cons-03',
    name: 'Mark Wainwright',
    photo: 'https://via.placeholder.com/300x300?text=Mark+Wainwright',
    firm: 'Wainwright Consulting',
    city: 'New York',
    country: 'USA',
    bio: 'Mark is a veteran pitch consultant helping Fortune 500 marketers find and manage their agency relationships.',
    expertise: ['Agency Search', 'Contract Negotiation', 'Agency Relationships', 'Performance Metrics'],
    founded: 2003,
    website: 'wainwrightconsulting.com',
  },
  {
    id: 'cons-04',
    name: 'Elena Rossi',
    photo: 'https://via.placeholder.com/300x300?text=Elena+Rossi',
    firm: 'Rossi & Co.',
    city: 'Milan',
    country: 'Italy',
    bio: 'Elena advises Italian and European multinationals on agency ecosystems and pitch processes.',
    expertise: ['Pitch Management', 'Agency Ecosystem Design', 'Brand Strategy'],
    founded: 2008,
    website: 'rossico.it',
  },
]

// ============================================================
// AWARD ORGANIZATIONS
// ============================================================

export const awardOrganizations: AwardOrganization[] = [
  {
    id: 'cannes-01',
    name: 'Cannes Lions',
    logo: 'https://via.placeholder.com/200x80?text=Cannes+Lions',
    description: 'The International Festival of Creativity, the world\'s biggest awards show celebrating the best in advertising and creative communications.',
    website: 'canneslions.com',
    country: 'France',
    frequency: 'annual',
    founded: 1954,
    categories: ['Film', 'Print & Publishing', 'Outdoor', 'Health & Wellness', 'Titanium', 'Grand Prix'],
  },
  {
    id: 'oneshow-01',
    name: 'The One Show',
    logo: 'https://via.placeholder.com/200x80?text=One+Show',
    description: 'One of the most prestigious award shows in advertising and design, presented by the One Club for Creativity.',
    website: 'oneclub.org/the-one-show',
    country: 'USA',
    frequency: 'annual',
    founded: 1975,
    categories: ['Advertising', 'Design', 'Digital', 'Interactive'],
  },
  {
    id: 'dad-01',
    name: 'D&AD Awards',
    logo: 'https://via.placeholder.com/200x80?text=D%26AD',
    description: 'British organisation promoting excellence in design and advertising, recognising the best creative work worldwide.',
    website: 'dandad.org',
    country: 'UK',
    frequency: 'annual',
    founded: 1962,
    categories: ['Graphic Design', 'Advertising', 'Film Craft', 'Digital Design'],
  },
  {
    id: 'clio-01',
    name: 'Clio Awards',
    logo: 'https://via.placeholder.com/200x80?text=Clio',
    description: 'One of the most recognized and respected international advertising awards programmes.',
    website: 'clioawards.com',
    country: 'USA',
    frequency: 'annual',
    founded: 1959,
    categories: ['Film', 'Print', 'Digital', 'Out of Home', 'Radio/Audio'],
  },
  {
    id: 'epica-01',
    name: 'Epica Awards',
    logo: 'https://via.placeholder.com/200x80?text=Epica',
    description: 'The only global creative advertising award judged by journalists working in the marketing and communications press.',
    website: 'epica-awards.com',
    country: 'France',
    frequency: 'annual',
    founded: 1987,
    categories: ['Film', 'Digital', 'Design', 'PR', 'Branded Content'],
  },
  {
    id: 'effie-01',
    name: 'Effie Awards',
    logo: 'https://via.placeholder.com/200x80?text=Effie',
    description: 'Recognizing marketing effectiveness - the most meaningful metric of marketing success.',
    website: 'effie.org',
    country: 'USA',
    frequency: 'annual',
    founded: 1968,
    categories: ['Consumer Goods', 'Corporate', 'Financial', 'Media', 'Travel'],
  },
]

// ============================================================
// CAMPAIGNS (expanded to 20)
// ============================================================

export const campaigns: Campaign[] = [
  {
    id: 'camp-01',
    title: 'Just Do It',
    agency: 'Wieden+Kennedy',
    agencyId: 'wk-01',
    brand: 'Nike',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    format: ['Digital', 'Social', 'TV'],
    description: 'Iconic campaign pushing the limits of human potential',
    mediaType: 'TV / Digital',
    awardWins: 12,
    views: 45000000,
    country: 'USA',
    sector: 'Sports',
  },
  {
    id: 'camp-02',
    title: 'Share a Coke',
    agency: '72andSunny',
    agencyId: '72-01',
    brand: 'Coca-Cola',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1566898009320-4b3be00e305c?w=800&q=80',
    format: ['Print', 'Digital', 'OOH'],
    description: 'Personalized bottles creating human connections',
    mediaType: 'Print / OOH',
    awardWins: 8,
    views: 30000000,
    country: 'USA',
    sector: 'Beverages',
  },
  {
    id: 'camp-03',
    title: 'The Man Your Man Could Smell Like',
    agency: 'Wieden+Kennedy',
    agencyId: 'wk-01',
    brand: 'Old Spice',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    format: ['TV', 'Digital', 'Social'],
    description: 'Humorous campaign rebranding Old Spice for modern audiences',
    mediaType: 'TV / Social',
    awardWins: 15,
    views: 60000000,
    country: 'USA',
    sector: 'FMCG',
  },
  {
    id: 'camp-04',
    title: 'Think Different',
    agency: '72andSunny',
    agencyId: '72-01',
    brand: 'Apple',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    format: ['TV', 'Print', 'Digital'],
    description: 'Celebrating innovative thinking and creative minds',
    mediaType: 'TV / Print',
    awardWins: 10,
    views: 25000000,
    country: 'USA',
    sector: 'Technology',
  },
  {
    id: 'camp-05',
    title: 'GoPro Hero',
    agency: 'Droga5',
    agencyId: 'droga5-01',
    brand: 'GoPro',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    format: ['Digital', 'Social', 'Video'],
    description: 'User-generated content celebrating adventure',
    mediaType: 'Digital / Video',
    awardWins: 6,
    views: 18000000,
    country: 'USA',
    sector: 'Technology',
  },
  {
    id: 'camp-06',
    title: 'Impossible is Nothing',
    agency: 'BBH',
    agencyId: 'bbh-01',
    brand: 'Adidas',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1556906781-9a412961a28d?w=800&q=80',
    format: ['TV', 'Digital', 'Print'],
    description: 'Inspirational campaign featuring athletes breaking limits',
    mediaType: 'TV / Print',
    awardWins: 9,
    views: 35000000,
    country: 'UK',
    sector: 'Sports',
  },
  {
    id: 'camp-07',
    title: 'Where it All Begins',
    agency: 'VCCP',
    agencyId: 'vccp-01',
    brand: 'Tesco',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    format: ['TV', 'Digital', 'OOH'],
    description: 'Retail excellence campaign connecting customers to community',
    mediaType: 'TV / OOH',
    awardWins: 4,
    views: 12000000,
    country: 'UK',
    sector: 'Retail',
  },
  {
    id: 'camp-08',
    title: 'The Epic Split',
    agency: 'Forsman & Bodenfors',
    agencyId: 'ff-01',
    brand: 'Volvo',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    format: ['Digital', 'Video'],
    description: 'Innovation in commercial transportation',
    mediaType: 'Digital / Video',
    awardWins: 7,
    views: 100000000,
    country: 'Sweden',
    sector: 'Automotive',
  },
  {
    id: 'camp-09',
    title: 'Fearless Girl',
    agency: 'BETC Paris',
    agencyId: 'betc-01',
    brand: 'State Street Global Advisors',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80',
    format: ['OOH', 'PR', 'Digital'],
    description: 'Iconic sculpture and campaign addressing gender diversity',
    mediaType: 'OOH / PR',
    awardWins: 22,
    views: 80000000,
    country: 'France',
    sector: 'Finance',
  },
  {
    id: 'camp-10',
    title: 'Monoprix Speaks to You',
    agency: 'BETC Paris',
    agencyId: 'betc-01',
    brand: 'Monoprix',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
    format: ['Print', 'OOH', 'Social'],
    description: 'Playful packaging copy that turned grocery shopping into poetry',
    mediaType: 'Print / OOH',
    awardWins: 5,
    views: 20000000,
    country: 'France',
    sector: 'Retail',
  },
  {
    id: 'camp-11',
    title: 'Long Live the King',
    agency: 'LOLA MullenLowe',
    agencyId: 'lola-01',
    brand: 'Burger King',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    format: ['Digital', 'Social', 'OOH'],
    description: 'Bold campaign reclaiming Burger King\'s royal crown',
    mediaType: 'Digital / OOH',
    awardWins: 11,
    views: 40000000,
    country: 'Spain',
    sector: 'Food',
  },
  {
    id: 'camp-12',
    title: 'Penny Price Packs',
    agency: 'Serviceplan Group',
    agencyId: 'serviceplan-01',
    brand: 'PENNY',
    year: 2024,
    thumbnail: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=80',
    format: ['TV', 'OOH', 'Social'],
    description: 'The most awarded campaign of 2025 - tackling food inflation head on',
    mediaType: 'TV / OOH',
    awardWins: 28,
    views: 55000000,
    country: 'Germany',
    sector: 'Retail',
  },
  {
    id: 'camp-13',
    title: 'Dumb Ways to Die',
    agency: 'McCann Worldgroup',
    agencyId: 'mccann-01',
    brand: 'Metro Trains Melbourne',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    format: ['Digital', 'Social', 'Music'],
    description: 'Viral public safety campaign turned beloved cultural touchstone',
    mediaType: 'Digital / Music',
    awardWins: 30,
    views: 200000000,
    country: 'Australia',
    sector: 'Public Service',
  },
  {
    id: 'camp-14',
    title: 'The Christmas Ad',
    agency: 'adam&eveDDB',
    agencyId: 'adam-01',
    brand: 'John Lewis',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80',
    format: ['TV', 'Digital', 'Social'],
    description: 'Annual emotionally charged Christmas film that became a cultural tradition',
    mediaType: 'TV',
    awardWins: 14,
    views: 75000000,
    country: 'UK',
    sector: 'Retail',
  },
  {
    id: 'camp-15',
    title: 'Decoded',
    agency: 'Ogilvy London',
    agencyId: 'ogilvy-01',
    brand: 'Jay-Z',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1626854612450-8a1d07a7f36c?w=800&q=80',
    format: ['OOH', 'Print', 'Digital'],
    description: 'Ingenious campaign for Jay-Z\'s autobiography hidden across America',
    mediaType: 'OOH / Print',
    awardWins: 19,
    views: 50000000,
    country: 'USA',
    sector: 'Entertainment',
  },
  {
    id: 'camp-16',
    title: 'You Can\'t Stop Us',
    agency: 'Wieden+Kennedy',
    agencyId: 'wk-01',
    brand: 'Nike',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    format: ['Digital', 'Social', 'TV'],
    description: 'Split-screen film celebrating sport as a unifying force',
    mediaType: 'Digital / TV',
    awardWins: 16,
    views: 90000000,
    country: 'USA',
    sector: 'Sports',
  },
  {
    id: 'camp-17',
    title: 'Like A Girl',
    agency: 'Leo Burnett',
    agencyId: 'leoburnett-01',
    brand: 'Always',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80',
    format: ['Digital', 'TV', 'Social'],
    description: 'Empowering campaign redefining what it means to do something "like a girl"',
    mediaType: 'Digital / TV',
    awardWins: 20,
    views: 85000000,
    country: 'USA',
    sector: 'Healthcare',
  },
  {
    id: 'camp-18',
    title: 'Kia Telluride Winter Olympics',
    agency: 'DDB Worldwide',
    agencyId: 'ddb-01',
    brand: 'Kia',
    year: 2026,
    thumbnail: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    format: ['TV', 'Digital'],
    description: 'Cinematic Winter Olympics launch campaign for the new Kia Telluride',
    mediaType: 'TV',
    awardWins: 3,
    views: 20000000,
    country: 'USA',
    sector: 'Automotive',
  },
  {
    id: 'camp-19',
    title: 'Berlin - Open Your Mind',
    agency: 'Jung von Matt',
    agencyId: 'junkvonmatt-01',
    brand: 'Visit Berlin',
    year: 2023,
    thumbnail: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
    format: ['Digital', 'OOH', 'Social'],
    description: 'Tourism campaign celebrating Berlin\'s cultural richness',
    mediaType: 'Digital / OOH',
    awardWins: 8,
    views: 25000000,
    country: 'Germany',
    sector: 'Travel & Tourism',
  },
  {
    id: 'camp-20',
    title: 'The Whopper Detour',
    agency: 'LOLA MullenLowe',
    agencyId: 'lola-01',
    brand: 'Burger King',
    year: 2022,
    thumbnail: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80',
    format: ['Digital', 'Mobile', 'Social'],
    description: 'Geo-targeted mobile campaign driving customers from McDonald\'s to Burger King',
    mediaType: 'Mobile / Digital',
    awardWins: 25,
    views: 60000000,
    country: 'USA',
    sector: 'Food',
  },
]

// ============================================================
// TALENT (expanded to 20)
// ============================================================

export const talent: Person[] = [
  {
    id: 'talent-01',
    name: 'Jane Smith',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    role: 'Creative Director',
    company: 'Wieden+Kennedy',
    companyId: 'wk-01',
    bio: 'Jane is an award-winning Creative Director with 15 years at Wieden+Kennedy, responsible for Nike\'s global campaign strategy.',
    expertise: ['Creative Direction', 'Brand Strategy', 'Art Direction', 'TV Production'],
    city: 'Portland',
    country: 'USA',
    featured: true,
  },
  {
    id: 'talent-02',
    name: 'Michael Chen',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    role: 'Chief Strategy Officer',
    company: '72andSunny',
    companyId: '72-01',
    bio: 'Michael is a data-driven strategist who has shaped breakthrough campaigns for Apple, Adidas, and Samsung.',
    expertise: ['Brand Strategy', 'Consumer Insight', 'Digital Strategy'],
    city: 'Los Angeles',
    country: 'USA',
    featured: true,
  },
  {
    id: 'talent-03',
    name: 'Emma Johnson',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    role: 'Executive Creative Director',
    company: 'Droga5',
    companyId: 'droga5-01',
    bio: 'Emma has led some of the most celebrated integrated campaigns of the past decade across technology and luxury brands.',
    expertise: ['Creative Direction', 'Brand Identity', 'Integrated Campaigns'],
    city: 'New York',
    country: 'USA',
    featured: true,
  },
  {
    id: 'talent-04',
    name: 'David Martinez',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    role: 'Head of Digital',
    company: 'BBH',
    companyId: 'bbh-01',
    bio: 'David specialises in digital transformation, helping legacy brands reimagine their digital presence.',
    expertise: ['Digital Marketing', 'UX Strategy', 'Programmatic', 'Performance Marketing'],
    city: 'London',
    country: 'UK',
  },
  {
    id: 'talent-05',
    name: 'Sophie Wilson',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    role: 'Chief Creative Officer',
    company: 'VCCP',
    companyId: 'vccp-01',
    bio: 'Sophie has built VCCP\'s reputation for effectiveness-first creativity, winning effectiveness awards across FMCG and retail.',
    expertise: ['Creative Direction', 'Effectiveness', 'Brand Strategy'],
    city: 'London',
    country: 'UK',
    featured: true,
  },
  {
    id: 'talent-06',
    name: 'Alex Kim',
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80',
    role: 'Art Director',
    company: 'Special Group',
    companyId: 'sbg-01',
    bio: 'Alex creates visually arresting campaigns that blend craft with cultural insight.',
    expertise: ['Art Direction', 'Visual Identity', 'Photography', 'Design'],
    city: 'Sydney',
    country: 'Australia',
  },
  {
    id: 'talent-07',
    name: 'Isabelle Moreau',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    role: 'Creative Director',
    company: 'BETC Paris',
    companyId: 'betc-01',
    bio: 'Isabelle has defined the visual language of French luxury advertising for the past decade.',
    expertise: ['Creative Direction', 'Luxury', 'Brand Identity', 'Film'],
    city: 'Paris',
    country: 'France',
    featured: true,
  },
  {
    id: 'talent-08',
    name: 'Lars Eriksson',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    role: 'Executive Creative Director',
    company: 'Jung von Matt',
    companyId: 'junkvonmatt-01',
    bio: 'Lars is behind some of Germany\'s most iconic advertising of the past 15 years.',
    expertise: ['Creative Direction', 'Automotive', 'Brand Strategy'],
    city: 'Hamburg',
    country: 'Germany',
  },
  {
    id: 'talent-09',
    name: 'Camila Santos',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    role: 'Chief Creative Officer',
    company: 'AlmapBBDO',
    companyId: 'almapbbdo-01',
    bio: 'Camila has steered AlmapBBDO to over 480 international awards, becoming one of Brazil\'s most celebrated creative leaders.',
    expertise: ['Creative Direction', 'Brand Strategy', 'Integrated Campaigns'],
    city: 'São Paulo',
    country: 'Brazil',
    featured: true,
  },
  {
    id: 'talent-10',
    name: 'Kenji Tanaka',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    role: 'Creative Director',
    company: 'DENTSU CREATIVE',
    companyId: 'dentsu-01',
    bio: 'Kenji bridges Japanese cultural insight with global creative ambition, specialising in tech and automotive campaigns.',
    expertise: ['Creative Direction', 'Digital', 'Technology', 'Automotive'],
    city: 'Tokyo',
    country: 'Japan',
  },
  {
    id: 'talent-11',
    name: 'Rachel Adams',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
    role: 'Head of Strategy',
    company: 'Ogilvy London',
    companyId: 'ogilvy-01',
    bio: 'Rachel specialises in brand purpose and social impact strategy for global brands.',
    expertise: ['Brand Purpose', 'Social Impact', 'Strategy', 'Consumer Research'],
    city: 'London',
    country: 'UK',
  },
  {
    id: 'talent-12',
    name: 'Tom Bauer',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    role: 'Creative Director',
    company: 'Serviceplan Group',
    companyId: 'serviceplan-01',
    bio: 'Tom is the creative force behind Serviceplan\'s most awarded retail and FMCG work.',
    expertise: ['Creative Direction', 'Retail', 'FMCG', 'Performance Marketing'],
    city: 'Munich',
    country: 'Germany',
  },
]

// ============================================================
// AWARDS (expanded)
// ============================================================

export const awards: Award[] = [
  {
    id: 'award-01',
    title: 'Grand Prix',
    festival: 'Cannes Lions',
    festivalId: 'cannes-01',
    year: 2023,
    company: 'Wieden+Kennedy',
    companyId: 'wk-01',
    level: 'grand_prix',
    campaign: 'Just Do It',
  },
  {
    id: 'award-02',
    title: 'Gold Lion',
    festival: 'Cannes Lions',
    festivalId: 'cannes-01',
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
    festivalId: 'cannes-01',
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
    festivalId: 'oneshow-01',
    year: 2023,
    company: 'BBH',
    companyId: 'bbh-01',
    level: 'gold',
  },
  {
    id: 'award-05',
    title: 'D&AD Black Pencil',
    festival: 'D&AD Awards',
    festivalId: 'dad-01',
    year: 2023,
    company: 'VCCP',
    companyId: 'vccp-01',
    level: 'grand_prix',
  },
  {
    id: 'award-06',
    title: 'Clio Gold',
    festival: 'Clio Awards',
    festivalId: 'clio-01',
    year: 2023,
    company: 'Special Group',
    companyId: 'sbg-01',
    level: 'gold',
  },
  {
    id: 'award-07',
    title: 'Effie Gold',
    festival: 'Effie Awards',
    festivalId: 'effie-01',
    year: 2023,
    company: 'R/GA',
    companyId: 'rga-01',
    level: 'gold',
  },
  {
    id: 'award-08',
    title: 'Grand Prix',
    festival: 'Cannes Lions',
    festivalId: 'cannes-01',
    year: 2024,
    company: 'BETC Paris',
    companyId: 'betc-01',
    level: 'grand_prix',
    campaign: 'Fearless Girl',
  },
  {
    id: 'award-09',
    title: 'Gold Lion',
    festival: 'Cannes Lions',
    festivalId: 'cannes-01',
    year: 2024,
    company: 'Ogilvy London',
    companyId: 'ogilvy-01',
    level: 'gold',
    campaign: 'Decoded',
  },
  {
    id: 'award-10',
    title: 'Grand Prix',
    festival: 'Epica Awards',
    festivalId: 'epica-01',
    year: 2024,
    company: 'Serviceplan Group',
    companyId: 'serviceplan-01',
    level: 'grand_prix',
    campaign: 'Penny Price Packs',
  },
  {
    id: 'award-11',
    title: 'D&AD Yellow Pencil',
    festival: 'D&AD Awards',
    festivalId: 'dad-01',
    year: 2023,
    company: 'adam&eveDDB',
    companyId: 'adam-01',
    level: 'gold',
    campaign: 'The Christmas Ad',
  },
  {
    id: 'award-12',
    title: 'One Show Gold',
    festival: 'The One Show',
    festivalId: 'oneshow-01',
    year: 2023,
    company: 'Leo Burnett',
    companyId: 'leoburnett-01',
    level: 'gold',
    campaign: 'Like A Girl',
  },
]

// ============================================================
// NEWS (expanded to 10)
// ============================================================

export const news: NewsArticle[] = [
  {
    id: 'news-01',
    title: 'Wieden+Kennedy Opens New London Office',
    excerpt: 'Legendary Portland agency expands European presence with state-of-the-art creative studio.',
    category: 'Agency News',
    date: '2024-02-15',
    thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    author: 'Sarah Anderson',
    content: 'Wieden+Kennedy has announced the opening of a new flagship office in London\'s Shoreditch district. The 30,000 sq ft space will house over 200 creatives and strategists working across some of the world\'s most iconic brands. The expansion reflects the agency\'s commitment to strengthening its European creative output.\n\n"London has always been central to our global vision," said Global CEO. "This new home will allow us to attract the best creative talent and deliver world-class work for our clients across the EMEA region."\n\nThe London office joins W+K\'s growing global network which spans Portland, New York, Amsterdam, Tokyo, Shanghai, and São Paulo.',
    tags: ['Agency News', 'Wieden+Kennedy', 'London', 'Expansion'],
  },
  {
    id: 'news-02',
    title: 'Nike Campaign Wins Grand Prix at Cannes',
    excerpt: "Wieden+Kennedy's groundbreaking 'You Can't Stop Us' split-screen film takes the top prize at Cannes Lions.",
    category: 'Awards',
    date: '2024-02-10',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    author: 'James Mitchell',
    content: "Nike's 'You Can't Stop Us' campaign by Wieden+Kennedy has been awarded the Film Grand Prix at the Cannes Lions International Festival of Creativity. The campaign, which used a groundbreaking split-screen technique to juxtapose 53 pairs of athletes, was praised by jurors for its technical brilliance and emotional resonance.\n\nThe film, which featured over 4,000 video clips assembled seamlessly, became one of the most-watched sports commercials in history with over 90 million views.",
    tags: ['Awards', 'Cannes Lions', 'Nike', 'Wieden+Kennedy'],
  },
  {
    id: 'news-03',
    title: 'The Future of Advertising: AI and Creativity',
    excerpt: 'Industry leaders discuss how generative AI is reshaping the creative process - and whether it\'s a threat or an opportunity.',
    category: 'Trends',
    date: '2024-02-08',
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    author: 'Emma Thompson',
    content: 'As generative AI tools become increasingly sophisticated, the advertising industry is grappling with fundamental questions about the future of creative work. From automated copy generation to AI-produced visual assets, the technology is already changing how agencies operate.\n\nLeading creative directors from Wieden+Kennedy, Ogilvy, and Droga5 shared their perspectives at the AdForum Summit this week, with most agreeing that AI is a powerful tool but cannot replace the human insight and cultural understanding that drives great advertising.',
    tags: ['Trends', 'AI', 'Technology', 'Creativity'],
  },
  {
    id: 'news-04',
    title: '72andSunny Merges with Digital Studio',
    excerpt: 'Strategic merger strengthens data and technology capabilities as the agency pursues ambitious growth plans.',
    category: 'Business',
    date: '2024-02-05',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    author: 'Robert Chen',
    content: '72andSunny has announced a strategic merger with Berlin-based digital studio and data analytics firm DataCreative. The deal, valued at an undisclosed amount, will significantly bolster 72andSunny\'s technology and data capabilities as clients increasingly demand proof of ROI from their creative investments.\n\nThe combined entity will operate under the 72andSunny name and will immediately begin working on unified data-led creative campaigns for existing clients including Apple and Adidas.',
    tags: ['Business', 'Merger', '72andSunny', 'Digital'],
  },
  {
    id: 'news-05',
    title: 'Sustainability Becomes Core to Brand Strategy',
    excerpt: 'As consumers demand authenticity, agencies are building sustainability expertise into their core offering.',
    category: 'Trends',
    date: '2024-02-01',
    thumbnail: 'https://images.unsplash.com/photo-1542601906897-c1a5ccbf1e21?w=600&q=80',
    author: 'Lisa Greene',
    content: 'A new study from the Advertising Standards Authority reveals that 73% of consumers say they are more likely to purchase from brands that can demonstrate a genuine commitment to sustainability. As a result, agencies across the globe are rapidly building expertise in purpose-led and sustainability-focused brand strategy.',
    tags: ['Trends', 'Sustainability', 'Brand Strategy', 'Consumer'],
  },
  {
    id: 'news-06',
    title: 'BETC Wins Agency of the Year at Epica',
    excerpt: 'The Paris powerhouse takes home Agency of the Year after a record-breaking haul at the 2024 Epica Awards.',
    category: 'Awards',
    date: '2024-01-28',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80',
    author: 'Marie Leblanc',
    content: 'BETC Paris has been crowned Agency of the Year at the Epica Awards after winning an unprecedented 12 awards including three Grand Prix for its work for Canal+, Evian, and Peugeot. The agency\'s Creative Director Isabelle Moreau accepted the award calling it a "celebration of the power of French creative culture."',
    tags: ['Awards', 'BETC', 'Epica', 'Agency of the Year'],
  },
  {
    id: 'news-07',
    title: 'Serviceplan\'s Penny Campaign Tops Global Effectiveness Rankings',
    excerpt: 'The Price Packs campaign for German retailer PENNY is named the most awarded campaign of 2025 by AdForum.',
    category: 'Awards',
    date: '2024-01-20',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    author: 'Hans Mueller',
    content: 'Serviceplan Group\'s campaign for German discount retailer PENNY, which directly addressed food inflation by printing real product price increases on packaging, has been named the most awarded campaign globally by AdForum\'s Business Creative Report.',
    tags: ['Awards', 'Serviceplan', 'Penny', 'Effectiveness'],
  },
  {
    id: 'news-08',
    title: 'Jung von Matt Revamps Creative Strategy Across All Offices',
    excerpt: 'The German network appoints new CCO and signals a shift towards a more culturally connected creative approach.',
    category: 'Agency News',
    date: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1444159652248-9e21ef449ef6?w=600&q=80',
    author: 'Klaus Braun',
    content: 'Jung von Matt has announced the appointment of a new Global Chief Creative Officer who will lead a transformation of the agency\'s creative philosophy across its 11 offices worldwide. The move signals the agency\'s ambition to become the most culturally connected agency in Europe.',
    tags: ['Agency News', 'Jung von Matt', 'Creative Strategy'],
  },
  {
    id: 'news-09',
    title: 'The Rise of Creator Partnerships in Brand Strategy',
    excerpt: 'How agencies are rethinking the role of influencers and creators in integrated campaigns.',
    category: 'Trends',
    date: '2024-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80',
    author: 'Anya Patel',
    content: 'The creator economy has matured significantly, and agencies are now developing sophisticated frameworks for integrating creator partnerships into broader brand strategy. Rather than treating creators as paid media channels, leading agencies are co-developing campaign concepts with creators from the earliest stages.',
    tags: ['Trends', 'Creator Economy', 'Influencers', 'Brand Strategy'],
  },
  {
    id: 'news-10',
    title: 'Havas Paris Wins Renault Global Account',
    excerpt: 'Havas consolidates its position as France\'s leading agency group with a landmark win for the iconic French automaker.',
    category: 'Business',
    date: '2024-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    author: 'Pierre Fontaine',
    content: 'Havas Paris has been appointed as the global creative agency of record for Renault following a competitive pitch that reportedly included McCann, TBWA, and Publicis Conseil. The win is one of the most significant account moves in France in recent years.',
    tags: ['Business', 'Account Win', 'Havas', 'Renault'],
  },
]

// ============================================================
// INTERVIEWS
// ============================================================

export const interviews: Interview[] = [
  {
    id: 'int-01',
    title: 'Jane Smith: Why Great Advertising Still Starts with a Single Human Truth',
    excerpt: 'The Wieden+Kennedy Creative Director on Nike, culture, and why data should inform but never lead.',
    content: `Jane Smith has been at the helm of some of Nike's most celebrated global campaigns for the past decade. We sat down with her at W+K Portland to discuss what separates good advertising from truly great advertising.\n\n**How do you define great advertising in 2024?**\n\nFor me, great advertising is work that doesn't feel like advertising. It feels like a contribution to culture. Whether it makes you laugh, cry, or think differently about something - it has to add something to the world, not just extract attention from it.\n\n**Nike is arguably the most creatively ambitious brand in the world. What's the secret?**\n\nNike is built on a belief - that every human being is an athlete. That's a powerful, generous idea. Our job is to find new ways to express that truth. When you have a client that believes creativity can change the world, extraordinary things happen.\n\n**What role does data play in your creative process?**\n\nData is a brilliant starting point and a useful validator - but it's a terrible creative director. The greatest creative work often contradicts the data. You have to be willing to listen to your gut and stand behind an idea that the spreadsheet might not support.`,
    author: 'Mark Tungate',
    subject: 'Jane Smith',
    subjectId: 'talent-01',
    subjectType: 'talent',
    date: '2024-02-12',
    category: 'Creative',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    id: 'int-02',
    title: 'Isabelle Moreau: Luxury Advertising in the Age of Social Media',
    excerpt: 'BETC\'s Creative Director on why luxury brands must resist the urge to be "relatable" on social media.',
    content: `Isabelle Moreau is the Creative Director responsible for BETC Paris's luxury portfolio, including campaigns for Louis Vuitton and Canal+. She spoke to us about the tension between exclusivity and digital accessibility.\n\n**Luxury brands are under pressure to be more present on social media. How do you square that with maintaining exclusivity?**\n\nThe danger is when luxury brands try to be "relatable" in the way that consumer brands are. Luxury is about aspiration, not relatability. The best luxury social media content invites you into a world you want to be part of - it doesn't try to be your friend.\n\n**What's the biggest creative mistake luxury brands make?**\n\nChasing trends. Luxury brands define trends - they don't follow them. When a luxury brand starts copying what's popular on TikTok, they've already lost.`,
    author: 'Sophie Bernard',
    subject: 'Isabelle Moreau',
    subjectId: 'talent-07',
    subjectType: 'talent',
    date: '2024-01-30',
    category: 'Luxury',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
  },
  {
    id: 'int-03',
    title: 'The Story Behind PENNY\'s Most Awarded Campaign',
    excerpt: 'Serviceplan Group\'s CCO walks us through the brief, the risk, and the extraordinary result.',
    content: `When German retailer PENNY asked Serviceplan Group to address food inflation in a campaign, nobody expected the result would become the most awarded piece of advertising in the world in 2025.\n\n**Tell us about the brief.**\n\nIt was actually a very simple brief: help Germans understand that food inflation is real and that PENNY is doing something about it. The initial impulse was to make a feel-good campaign about affordability. But we pushed harder.\n\n**How did you arrive at printing the actual price increases on packaging?**\n\nThe breakthrough came when we asked ourselves: what if we didn't talk about the problem but made it physically visible? Printing the actual inflationary cost increase directly on the product - so you could literally see it at the shelf - was radical. The client had the courage to do it.`,
    author: 'Hans Mueller',
    subject: 'Serviceplan Group',
    subjectId: 'serviceplan-01',
    subjectType: 'agency',
    date: '2024-01-18',
    category: 'Case Study',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
  },
  {
    id: 'int-04',
    title: 'Camila Santos on Leading AlmapBBDO to 480+ International Awards',
    excerpt: 'The Chief Creative Officer of Brazil\'s most celebrated agency on cultural insight, creative leadership, and why advertising in Brazil is uniquely emotional.',
    content: `Camila Santos became CCO of AlmapBBDO at 38, making her one of the youngest chief creative officers at a major global agency. Under her leadership, the agency has won over 480 international awards.\n\n**What makes Brazilian advertising so distinctive?**\n\nBrazilians have a unique relationship with emotion. We're an incredibly warm, expressive culture. Our advertising reflects that. We're not afraid to be sentimental, funny, or politically charged. That emotional directness connects with people everywhere.\n\n**How do you maintain creative standards at that scale?**\n\nYou have to be ruthlessly honest about the work. I tell every creative team: if you wouldn't be proud to put your name on it forever, we're not sending it.`,
    author: 'Ana Oliveira',
    subject: 'Camila Santos',
    subjectId: 'talent-09',
    subjectType: 'talent',
    date: '2024-01-08',
    category: 'Leadership',
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
  },
]

// ============================================================
// INSIGHTS
// ============================================================

export const insights: Insight[] = [
  {
    id: 'insight-01',
    title: '2026: In Search of Clarity',
    excerpt: 'After years of disruption, the advertising industry is searching for a new creative north star. Where will it come from?',
    content: `The advertising industry has never been more technically capable - or more creatively confused. After years of chasing digital transformation, performance marketing, and data-driven everything, many in the industry are asking a simple question: where is the great advertising?\n\nThe data is clear. Brands that invest in long-term brand building consistently outperform those focused purely on short-term activation. The work of Les Binet and Peter Field has proved this conclusively. Yet the industry continues to over-invest in performance and under-invest in brand.\n\n**The pendulum swings back**\n\nIn 2026, we're seeing the early signs of a creative renaissance. The runaway success of emotionally led campaigns - from PENNY's price packs to John Lewis's annual Christmas film - is reminding clients that human connection drives business results.\n\nThe agencies that will win the next decade are those that can combine data intelligence with genuine creative ambition. Not one or the other - both.`,
    author: 'Mark Tungate',
    date: '2026-01-26',
    category: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
  },
  {
    id: 'insight-02',
    title: 'Why Purpose-Washing is the Biggest Threat to Brand Trust',
    excerpt: 'As consumers become more sophisticated, brands that claim values they don\'t live face serious reputational consequences.',
    content: `Purpose has become one of the most abused words in marketing. Every brand claims to have a purpose beyond profit. Very few can demonstrate it convincingly.\n\nThe problem isn't that brands want to stand for something - that's admirable. The problem is when the claimed purpose has no connection to what the brand actually does or believes. Consumers are increasingly sophisticated at detecting this disconnect, and the reputational cost is severe.\n\n**What authentic purpose looks like**\n\nThe most credible purpose-driven brands share three characteristics: their purpose is rooted in what they actually do (not grafted on), it's reflected in business decisions as well as advertising, and it's consistent over time.\n\nPatagonia doesn't need to run campaigns about environmental responsibility because their entire business model demonstrates it. That's the standard all brands should aspire to.`,
    author: 'Rachel Adams',
    date: '2026-01-15',
    category: 'Brand Strategy',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80',
  },
  {
    id: 'insight-03',
    title: 'The Creative Renaissance of German Advertising',
    excerpt: 'From Serviceplan to Jung von Matt, Germany\'s agencies are producing some of the world\'s most awarded and effective work.',
    content: `For decades, German advertising was characterised by a utilitarian, product-focused approach that prioritised information over emotion. That era is definitively over.\n\nThe success of Serviceplan's PENNY campaign - named the most awarded campaign globally by AdForum - is the most visible sign of a deep creative transformation happening across Germany's agency landscape. But it's not an isolated case.\n\nJung von Matt's work for Mercedes-Benz and Edeka, Heimat's campaigns for HORNBACH, and a new generation of boutique Berlin agencies are producing work that wins at Cannes, D&AD, and the One Show while simultaneously driving measurable business results.\n\n**What changed?**\n\nThree things: client bravery, creative talent recruitment, and a willingness to embrace emotion. German marketers, long cautious about emotional advertising, have discovered what their counterparts in the UK and Brazil have known for years - that emotion is not opposed to effectiveness, it is the engine of it.`,
    author: 'Klaus Braun',
    date: '2026-01-05',
    category: 'Markets',
    thumbnail: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80',
  },
  {
    id: 'insight-04',
    title: "Welcome to the Winter Bowl: Brands at the 2026 Olympics",
    excerpt: 'The Milano-Cortina Winter Olympics are proving to be a major creative opportunity. Who\'s doing it best?',
    content: `The Winter Olympics have always offered brands a rare combination of global scale and emotional storytelling. The 2026 edition in Milano-Cortina is proving no different, with a number of campaigns already establishing themselves as early front-runners for this year's awards season.\n\nKia's Telluride campaign, DDB Worldwide's epic cinematic debut for the all-new SUV, sets the gold standard for automotive advertising at major sporting events.\n\nNike's athlete-led campaign maintains its tradition of finding the human story within the competitive spectacle. BBC Creative's imagery is exceptional.\n\nBut the most talked-about work is coming from challenger brands without the mega-budgets - smaller, more targeted activations that find genuine creative hooks within the Olympic narrative rather than simply buying visibility.`,
    author: 'Mark Tungate',
    date: '2026-02-09',
    category: 'Industry',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
  },
]

// ============================================================
// MOCK USERS
// ============================================================

export const mockUsers: User[] = [
  {
    id: 'user-01',
    email: 'demo@requisti.com',
    name: 'Demo User',
    role: 'agency_owner',
    companyId: 'wk-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  },
  {
    id: 'user-02',
    email: 'talent@requisti.com',
    name: 'Jane Smith',
    role: 'talent',
    talentId: 'talent-01',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    id: 'user-03',
    email: 'brand@requisti.com',
    name: 'Brand Manager',
    role: 'marketer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 'user-04',
    email: 'client@requisti.com',
    name: 'Client User',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
  },
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================

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

export function getNewsByAgency(agencyName: string): NewsArticle[] {
  const q = agencyName.toLowerCase()
  return news.filter(n =>
    n.tags?.some(tag => tag.toLowerCase().includes(q)) ||
    n.title.toLowerCase().includes(q) ||
    n.excerpt.toLowerCase().includes(q)
  )
}

export function getNewsById(id: string): NewsArticle | undefined {
  return news.find(n => n.id === id)
}

export function getCampaignById(id: string): Campaign | undefined {
  return campaigns.find(c => c.id === id)
}

export function getTalentById(id: string): Person | undefined {
  return talent.find(t => t.id === id)
}

export function getInterviewById(id: string): Interview | undefined {
  return interviews.find(i => i.id === id)
}

export function getInsightById(id: string): Insight | undefined {
  return insights.find(i => i.id === id)
}

export function getProductionCompanyById(id: string): ProductionCompany | undefined {
  return productionCompanies.find(p => p.id === id)
}

export function getConsultantById(id: string): SearchConsultant | undefined {
  return searchConsultants.find(c => c.id === id)
}

export function getAwardOrganizationById(id: string): AwardOrganization | undefined {
  return awardOrganizations.find(a => a.id === id)
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

// ============================================================
// ACADEMIC INSTITUTIONS
// ============================================================

export interface AcademicInstitution {
  id: string
  name: string
  type: 'Ad School' | 'University' | 'Online Course' | 'Workshop'
  city: string
  country: string
  logo: string
  coverImage: string
  description: string
  about: string
  programs: string[]
  website: string
  founded: number
  notableAlumni?: string[]
}

export const academicInstitutions: AcademicInstitution[] = [
  {
    id: 'ac-01',
    name: 'Miami Ad School',
    type: 'Ad School',
    city: 'Miami',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=Miami+Ad+School',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    description: 'One of the world\'s most respected creative schools, with campuses across the globe.',
    about: 'Miami Ad School is an international network of portfolio schools dedicated to producing the next generation of advertising creatives. Known for its "boot camps" and real-world briefs from major agencies.',
    programs: ['Art Direction', 'Copywriting', 'Creative Technology', 'Strategic Planning', 'Design'],
    website: 'miamiadschool.com',
    founded: 1993,
    notableAlumni: ['Award-winning creatives at Wieden+Kennedy, BBDO, DDB'],
  },
  {
    id: 'ac-02',
    name: 'VCU Brandcenter',
    type: 'University',
    city: 'Richmond',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=VCU+Brandcenter',
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    description: 'Graduate school dedicated to advertising and brand communications.',
    about: 'The VCU Brandcenter is consistently ranked among the top graduate programs in advertising. Located in Richmond, Virginia, it trains future creative directors, strategists, and brand managers.',
    programs: ['Creative Brand Management', 'Art Direction', 'Copywriting', 'Experience Design', 'Strategy'],
    website: 'brandcenter.vcu.edu',
    founded: 1996,
    notableAlumni: ['Top creative leaders at Ogilvy, R/GA, Droga5'],
  },
  {
    id: 'ac-03',
    name: 'School of Visual Arts (SVA)',
    type: 'University',
    city: 'New York',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=SVA',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    description: 'New York\'s leading arts and design school with a world-class advertising programme.',
    about: 'The School of Visual Arts in New York City offers undergraduate and graduate programmes in advertising, graphic design, and digital media. Faculty includes some of New York\'s most accomplished working professionals.',
    programs: ['Advertising', 'Graphic Design', 'Branding', 'Digital Photography', 'Motion Graphics'],
    website: 'sva.edu',
    founded: 1947,
    notableAlumni: ['Designers and creatives at top NYC agencies'],
  },
  {
    id: 'ac-04',
    name: 'D&AD New Blood Academy',
    type: 'Workshop',
    city: 'London',
    country: 'UK',
    logo: 'https://via.placeholder.com/200x80?text=D%26AD+New+Blood',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    description: 'Intensive workshops connecting emerging talent with industry professionals.',
    about: 'D&AD New Blood is a series of intensive workshops and competitions that bridge the gap between creative education and the professional world. Run by D&AD in partnership with top agencies.',
    programs: ['Creative Workshops', 'Industry Mentorship', 'Brief Competitions', 'Networking Events'],
    website: 'dandad.org/new-blood',
    founded: 2001,
  },
  {
    id: 'ac-05',
    name: 'Cannes Lions School of Creativity',
    type: 'Workshop',
    city: 'Cannes',
    country: 'France',
    logo: 'https://via.placeholder.com/200x80?text=Lions+School',
    coverImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80',
    description: 'World-class creative education programme run alongside the Cannes Lions festival.',
    about: 'The Cannes Lions School of Creativity runs the Young Lions Competitions and Cannes School programmes during the Cannes Lions International Festival of Creativity, providing emerging talent with world-class education and networking.',
    programs: ['Young Lions Competition', 'Creative Bootcamp', 'Strategy Masterclass', 'Emerging Voices'],
    website: 'canneslions.com/learn',
    founded: 2010,
  },
  {
    id: 'ac-06',
    name: 'Hyper Island',
    type: 'Ad School',
    city: 'Stockholm',
    country: 'Sweden',
    logo: 'https://via.placeholder.com/200x80?text=Hyper+Island',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    description: 'A world-renowned digital and creative business school.',
    about: 'Hyper Island is a forward-thinking school and knowledge company that combines technology, digital media, and leadership. Known for its hands-on, project-based learning methodology and strong industry connections.',
    programs: ['Digital Experience Design', 'Business Transformation', 'Digital Marketing', 'Motion Design', 'Data Strategy'],
    website: 'hyperisland.com',
    founded: 1996,
    notableAlumni: ['Creative and digital leaders at Spotify, IKEA, and major agency networks'],
  },
  {
    id: 'ac-07',
    name: 'ESCP Business School',
    type: 'University',
    city: 'Paris',
    country: 'France',
    logo: 'https://via.placeholder.com/200x80?text=ESCP',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    description: 'Europe\'s oldest business school with a renowned marketing and communications programme.',
    about: 'ESCP Business School, founded in 1819, is Europe\'s oldest business school. Its marketing and communications programme is highly regarded, training students across six European campuses.',
    programs: ['Master in Marketing & Creativity', 'Brand Management', 'Digital Marketing', 'Luxury Brand Management'],
    website: 'escp.eu',
    founded: 1819,
  },
  {
    id: 'ac-08',
    name: 'The One Club for Creativity',
    type: 'Online Course',
    city: 'New York',
    country: 'USA',
    logo: 'https://via.placeholder.com/200x80?text=One+Club',
    coverImage: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800&q=80',
    description: 'Online and in-person education programmes from the organisation behind The One Show.',
    about: 'The One Club for Creativity provides education programmes, mentorship, and resources for advertising and design professionals worldwide. Includes the prestigious One Show awards programme.',
    programs: ['Creative Masterclasses', 'Portfolio Reviews', 'Diversity & Inclusion Programmes', 'ADC Young Guns'],
    website: 'oneclub.org',
    founded: 1975,
  },
  {
    id: 'ac-09',
    name: 'Berlin School of Creative Leadership',
    type: 'University',
    city: 'Berlin',
    country: 'Germany',
    logo: 'https://via.placeholder.com/200x80?text=Berlin+School',
    coverImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc57?w=800&q=80',
    description: 'Executive MBA programme designed specifically for creative industry leaders.',
    about: 'The Berlin School of Creative Leadership offers an Executive MBA programme for creative professionals looking to step into leadership roles. Taught by world-class faculty from advertising, design, and business.',
    programs: ['Executive MBA', 'Creative Leadership', 'Brand Strategy', 'Innovation Management'],
    website: 'berlin-school.com',
    founded: 2006,
  },
  {
    id: 'ac-10',
    name: 'Google Digital Garage',
    type: 'Online Course',
    city: 'London',
    country: 'UK',
    logo: 'https://via.placeholder.com/200x80?text=Google+Garage',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    description: 'Free online courses covering digital marketing, data, and career development.',
    about: 'Google Digital Garage offers free online courses in digital marketing, data and tech, and career development. Accredited by industry bodies and the Interactive Advertising Bureau Europe.',
    programs: ['Fundamentals of Digital Marketing', 'Google Ads', 'Data Analytics', 'Career Development', 'AI for Marketers'],
    website: 'learndigital.withgoogle.com',
    founded: 2015,
  },
]

export function getAcademicById(id: string): AcademicInstitution | undefined {
  return academicInstitutions.find(a => a.id === id)
}

export function globalSearch(query: string) {
  const q = query.toLowerCase()
  return {
    companies: companies.filter(c =>
      c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    ).slice(0, 5),
    campaigns: campaigns.filter(c =>
      c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.agency.toLowerCase().includes(q)
    ).slice(0, 5),
    talent: talent.filter(t =>
      t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)
    ).slice(0, 5),
    news: news.filter(n =>
      n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q)
    ).slice(0, 5),
  }
}
