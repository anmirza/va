/**
 * RFI Reference Data — centralized dropdown and form field data
 * Extracted from RFI Agency.xlsx, RFI Production House.xlsx, RFI POS.xlsx
 */

// ── Agency Categories (from Settings sheet) ────────────────────────────────
export const AGENCY_CATEGORIES = [
  'ATL', 'Digital Marketing', 'Event & Experience', 'Full Service',
  'Influencer Marketing', 'PR', 'Social Media',
  'Tech Dev (Web site CRM Application)', 'Point of Sales Material',
] as const

// ── Currencies (top 6 + full list from Drop-down sheet) ────────────────────
export const TOP_CURRENCIES = [
  'Euro - EUR', 'US Dollar - USD', 'British Pound - GBP',
  'Swiss Franc - CHF', 'Japanese Yen - JPY', 'Australian Dollar - AUD',
] as const

// ── Employee Size Ranges ───────────────────────────────────────────────────
export const EMPLOYEE_SIZES = ['1 to 10', '11 to 50', '51 to 100', '101 to 250', '251 to 400', '401 +'] as const

// ── Country Coverage ───────────────────────────────────────────────────────
export const COUNTRY_COVERAGE = ['Country Level', 'North America', 'Latin America', 'EMEA', 'Europe', 'APAC', 'Global'] as const

// ── Company Levels ─────────────────────────────────────────────────────────
export const COMPANY_LEVELS = ['Holding Company', 'Worldwide Headquarter', 'Regional Headquarters', 'National Headquarters', 'Company', 'Subsidiary'] as const

// ── Communication Areas / Sectors (18 checkboxes) ──────────────────────────
export const COMMUNICATION_AREAS = [
  'Automotive & Mobility', 'Beauty & Personal Care', 'Beverage', 'Consumer Goods',
  'Corporate & B2B', 'Electronics & Technology', 'Energy', 'Entertainment & Media',
  'Fashion & Luxury', 'Food & Beverage', 'Healthcare & Pharma', 'Home & Living',
  'Lifestyle', 'Mobility & Transportation', 'Pet Care', 'Sport & Outdoor',
  'Tobacco', 'Travel, Tourism & Hospitality',
] as const

// ── Agency Contact Roles ───────────────────────────────────────────────────
export const AGENCY_CONTACT_ROLES = ['CEO', 'General Manager', 'Business Director', 'ECD', 'Executive Producer'] as const
export const PRODUCTION_CONTACT_ROLES = ['CEO', 'General Manager', 'Business Director', 'Executive Producer'] as const

// ── Capability Areas ───────────────────────────────────────────────────────
export const CAPABILITY_AREAS = [
  'Strategic & Consulting', 'Creative & Content', 'Audio / Visual Production',
  'PR & Events', 'Above the Line', 'Below the Line', 'Digital Marketing',
  'Social Media & Influencer Marketing', 'Technology & Digital',
  'Analytics & Reporting', 'Email & Content Marketing', 'Trade Marketing',
  'Retail', 'Media',
] as const

// ── Agency Services by Group (86 individual services) ──────────────────────
export const AGENCY_SERVICE_GROUPS = [
  {
    label: 'Strategic & Consulting',
    items: ['Strategic Planning', 'Brand Audit', 'Brand Identity Development', 'Positioning Strategy Development', 'Reputation Management', 'Crisis Management', 'Marketing Research', 'Consumer Insight'],
  },
  {
    label: 'Creative & Content',
    items: ['Campaign Creation', 'Creative Concept Development', 'Creative Production', 'Content Creation Copywriting', 'Graphic Design', 'Point of Sale Materials', 'Photography', 'Illustration', 'Motion Graphics & Animation'],
  },
  {
    label: 'Audio / Visual Production',
    items: ['Video Production', 'Audio Production', 'Post Production & Editing'],
  },
  {
    label: 'PR & Events',
    items: ['Media Relations', 'Public Relations Strategy', 'Influencer Relations', 'Press Releases & Press Kits', 'Event Organization & Management', 'Sponsorship Management', 'Experiential Marketing'],
  },
  {
    label: 'Above the Line',
    items: ['Media Management', 'Media Planning', 'Media Buying', 'Media Agencies Coordination', 'Broadcast Advertising', 'OOH / DOOH'],
  },
  {
    label: 'Below the Line',
    items: ['Direct Marketing', 'Promotional Marketing', 'In-store Marketing', 'Sampling Campaigns', 'Merchandising Strategy'],
  },
  {
    label: 'Digital Marketing',
    items: ['Digital Strategy', 'SEO', 'SEM', 'Display & Programmatic Advertising', 'Performance Marketing', 'Digital Data Analysis / Reporting'],
  },
  {
    label: 'Social Media & Influencer Marketing',
    items: ['Social Media Strategy & Management', 'Community Management', 'Paid Social Campaigns', 'Content Creation Copywriting', 'Influencer Marketing Strategy', 'Social Listening', 'Sentiment Analysis'],
  },
  {
    label: 'Technology & Digital',
    items: ['Web Development & Maintenance', 'App Development', 'E-commerce Solution', 'UX/UI Design', 'CRM Integration & Management', 'Marketing Automation', 'Martech Implementation'],
  },
  {
    label: 'Analytics & Reporting',
    items: ['Results & Campaign Analysis', 'Data-driven Marketing Insights', 'Consumer Behavior Analysis', 'ROI & Performance Measurement'],
  },
  {
    label: 'Email & Content Marketing',
    items: ['Email Marketing Campaigns', 'Newsletter Development', 'Content Marketing Strategy', 'Blog & Article Creation', 'White Papers & E-books'],
  },
  {
    label: 'Trade Marketing',
    items: ['Point-of-Sale (POS) Materials', 'Trade Events', 'Distribution Channel Analysis', 'Distributor Relationship Management', 'Channel Promotions'],
  },
  {
    label: 'Retail',
    items: ['Visual Merchandising', 'Retail Sales Analysis', 'Omnichannel Retail Strategy', 'In-Store Customer Experience', 'Merchandising & Planogramming'],
  },
  {
    label: 'Media',
    items: ['Media Space Buying', 'Editorial Planning', 'Media Content Development', 'Impact Analysis', 'Media Monitoring'],
  },
] as const

// ── Production House Services ──────────────────────────────────────────────
export const PRODUCTION_SERVICE_GROUPS = [
  {
    label: 'Pre-Production',
    items: ['Director Scouting', 'Casting Scouting', 'Location Scouting', 'Booklet Creation'],
  },
  {
    label: 'Production',
    items: ['Rental of Technical Equipment', 'Crew', 'Purchase of HDDs for Footage', 'Delivery to Post-Production', 'Logistics for the Client', 'Logistics for the Agency'],
  },
  {
    label: 'Post-Production',
    items: ['Coordination of Post-Production', 'Possibility of Delivering to Broadcasters'],
  },
] as const

// ── POS Services (simplified) ──────────────────────────────────────────────
export const POS_SERVICE_GROUPS = [
  {
    label: 'Trade Marketing',
    items: ['Point-of-Sale (POS) Materials', 'Distribution Channel Analysis', 'Channel Promotions', 'Trade Events', 'Distributor Relationship Management'],
  },
  {
    label: 'Retail',
    items: ['Visual Merchandising', 'Omnichannel Retail Strategy', 'Merchandising & Planogramming', 'Retail Sales Analysis', 'In-Store Customer Experience'],
  },
  {
    label: 'Media',
    items: ['Media Space Buying', 'Media Content Development', 'Media Monitoring', 'Editorial Planning', 'Impact Analysis'],
  },
] as const

// ── Agency People Departments & Roles ──────────────────────────────────────
export const AGENCY_PEOPLE_DEPARTMENTS = [
  {
    label: 'Executive & Operation',
    roles: ['Chairman', 'Chief Executive Officer (CEO)', 'Chief Operating Officer (COO)', 'Chief Financial Officer (CFO)', 'Chief Technology Officer (CTO)', 'Chief Digital Officer (CDO)', 'Chief Creative Officer (CCO)', 'Chief Strategy Officer (CSO)', 'President (US markets)', 'President (non-US markets)', 'Partner', 'Operations Director'],
  },
  {
    label: 'Account Management & Client Service',
    roles: ['Business/Group Director', 'Group Account Director', 'Regional Director', 'Account Director', 'Associate Account Director', 'Junior Account Director', 'Senior Account Manager', 'Account Manager', 'Account Supervisor', 'Account Executive'],
  },
  {
    label: 'Project Management',
    roles: ['Head of Project Management', 'Group Project Manager', 'Project Director', 'Senior Project Manager', 'Lead Project Manager', 'Project Manager', 'Associate Project Manager', 'Project Executive'],
  },
  {
    label: 'Creative & Design',
    roles: ['Chief Creative Director', 'Executive Creative Director', 'Creative Director', 'Senior Art Director', 'Art Director', 'Design Director', 'Senior Graphic Designer', 'Graphic Designer', 'Senior Copywriter', 'Copywriter', 'Content Writer'],
  },
  {
    label: 'Strategy Team',
    roles: ['Head of Planning', 'Strategy Director', 'Planning Director', 'Senior Brand Strategist', 'Brand Planner', 'Strategic Planner', 'Content Strategist', 'Senior Planner', 'Media Planner', 'Data Analyst'],
  },
  {
    label: 'Social Media',
    roles: ['Head of Social', 'Social Media Director', 'Social Media Strategist', 'Community Manager', 'Social Media Manager', 'Social Media Executive', 'Social Media Editor'],
  },
  {
    label: 'Technology Development',
    roles: ['Technology Director', 'Head of Technology', 'Head of Digital', 'Senior Developer', 'Web Developer', 'Front End Developer', 'Software Engineer', 'UX Architect', 'Head of UX', 'SEO Manager'],
  },
  {
    label: 'Production',
    roles: ['Head of Production', 'Senior Producer', 'Producer', 'Junior Producer', 'Creative Producer', 'Director of Photography', 'Senior Editor', 'Production Assistant', 'Art Buyer'],
  },
] as const

// ── Production House People Roles ──────────────────────────────────────────
export const PRODUCTION_PEOPLE_ROLES = [
  'Executive Producer', 'Senior Producer', 'Junior Producer',
  'Creative Research Lead', 'Production Manager', 'Production Coordinator',
  'Production Supervisor', 'Coordinator',
] as const

// ── Agency Awards ──────────────────────────────────────────────────────────
export const AGENCY_AWARDS = [
  'Cannes Lions', 'The One Show', 'D&AD', 'Clio Awards', 'LIA',
  'ADC Awards', 'Webby Awards', 'Effie Awards', 'Epica Awards',
  'Eurobest', 'NY Festival Adv', 'AME',
] as const

// ── Production House Awards ────────────────────────────────────────────────
export const PRODUCTION_AWARDS = [
  'AICP', 'Ciclope Festival', 'British Arrows', 'Shots', 'Clio Awards',
  'D&AD', 'The One Show', 'Creative Circle', 'APA Show', 'YDA', 'VES', 'LIA',
] as const

// ── Social Responsibility Questions ────────────────────────────────────────
export const SOCIAL_RESPONSIBILITY_QUESTIONS = [
  'Does your company have gender equality policies in place?',
  'Does your company adopt policies and control systems against discrimination?',
  'Does your company provide human rights education and training programmes?',
  'Does your company run projects in the social and environmental sectors?',
  'Has your company established partnerships with non-profits, social enterprises, or similar organisations?',
  'In the case of activated projects, what are the impact areas?',
  'Has your company appointed a CSR Manager or established a dedicated organisational unit for Corporate Social Responsibility?',
  'Does your company conduct periodic social reporting?',
  'Does your company apply ethical and environmental criteria when selecting suppliers?',
  'Does your company require its suppliers to hold social and/or environmental certifications?',
] as const

// ── AI Questions ───────────────────────────────────────────────────────────
export const AI_QUESTIONS = [
  'Does your company propose specific services and/or tool(s) and/or app(s) you\'d like to mention?',
  'Which AI tools are your agencies currently utilising?',
  'Are there any AI implementations your agencies anticipate adopting in the foreseeable future?',
  'Please describe the benefits that the utilisation of AI can deliver, providing specific case examples.',
  'Please elaborate on the ethical aspects of AI usage, specifically describing your compliance with ethical standards and privacy protection principles.',
  'Kindly describe your approach to the mitigation of risks associated with AI use.',
] as const

// ── Investment Categories ──────────────────────────────────────────────────
export const INVESTMENT_CATEGORIES = [
  'IT Equipment', 'Innovation', 'Sustainable Development',
  'Media & Advertising', 'Training', 'Other',
] as const

// ── Registration steps (8 steps per client feedback) ───────────────────────
export const REGISTRATION_STEPS = [
  { key: 'general-info', label: 'General Info', shortLabel: 'General' },
  { key: 'contacts', label: 'Contacts', shortLabel: 'Contacts' },
  { key: 'turnover-clients', label: 'Turnover & Clients', shortLabel: 'Turnover' },
  { key: 'knowledge-competencies', label: 'Knowledge & Competencies', shortLabel: 'Knowledge' },
  { key: 'governance-sow', label: 'Governance & SOW', shortLabel: 'Governance' },
  { key: 'people-talent', label: 'People & Talent', shortLabel: 'People' },
  { key: 'awards-infos', label: 'Awards & Infos', shortLabel: 'Awards' },
  { key: 'add-on', label: 'Add-On', shortLabel: 'Add-On' },
] as const

// ── Countries (full list from Drop-down sheet) ─────────────────────────────
export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina', 'Burma (Myanmar)', 'Burundi', 'Cambodia', 'Cameroon', 'Canada',
  'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo', 'Congo, Democratic Republic of', 'Costa Rica', 'Croatia',
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
  'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
  'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania',
  'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
  'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
] as const

// ── Social Media fields ────────────────────────────────────────────────────
export const SOCIAL_MEDIA_FIELDS = [
  { key: 'website', label: 'Official Website' },
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'pinterest', label: 'Pinterest' },
  { key: 'tumblr', label: 'Tumblr' },
  { key: 'snapchat', label: 'Snapchat' },
  { key: 'reddit', label: 'Reddit' },
] as const

// ── Talent Roles (Agency) ──────────────────────────────────────────────────
export const AGENCY_TALENT_ROLES = [
  'Executive Creative Director', 'Creative Director', 'Chief Strategy Officer',
] as const
