// ─────────────────────────────────────────────────────────────────────────────
// RFI Data Types — derived from VA Consulting RFI Excel templates
// Covers: Agency (POS variant) + Production House
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared enums ─────────────────────────────────────────────────────────────

export type EmployeeRange = '1 to 10' | '11 to 50' | '51 to 100' | '101 to 250' | '251 to 400' | '401 +'

export type CompanyLevel =
  | 'Holding Company'
  | 'Worldwide Headquarter'
  | 'Regional Headquarters'
  | 'National Headquarters'
  | 'Company'
  | 'Subsidiary'

export type CountryCoverage =
  | 'Country Level'
  | 'North America'
  | 'Latin America'
  | 'EMEA'
  | 'Europe'
  | 'APAC'
  | 'Global'

export type AgencyCategory =
  | 'ATL'
  | 'Digital Marketing'
  | 'Event & Experience'
  | 'Full Service'
  | 'Influencer Marketing'
  | 'PR'
  | 'Social Media'
  | 'Tech Dev (Web site CRM Application)'
  | 'Point of Sales Material'

// ── Contact person ────────────────────────────────────────────────────────────

export interface RFIContact {
  role: string
  firstName: string
  lastName: string
  linkedin?: string
  telephone?: string
  mobile?: string
  email?: string
}

// ── Social media ──────────────────────────────────────────────────────────────

export interface RFISocialMedia {
  website?: string
  twitter?: string
  facebook?: string
  linkedin?: string
  instagram?: string
  tiktok?: string
  pinterest?: string
  tumblr?: string
  snapchat?: string
  reddit?: string
}

// ── Industry sectors (binary flags) ──────────────────────────────────────────

export interface RFISectors {
  automotiveMobility: boolean
  beautyPersonalCare: boolean
  beverage: boolean
  consumerGoods: boolean
  corporateB2B: boolean
  electronicsTechnology: boolean
  energy: boolean
  entertainmentMedia: boolean
  fashionLuxury: boolean
  foodBeverage: boolean
  healthcarePharma: boolean
  homeLiving: boolean
  lifestyle: boolean
  mobilityTransportation: boolean
  petCare: boolean
  sportOutdoor: boolean
  tobacco: boolean
  travelTourismHospitality: boolean
}

// ── Financials ────────────────────────────────────────────────────────────────

export interface RFIYearFinancials {
  annualRevenueLocal?: number
  annualRevenueGlobal?: number
  ebitaLocal?: number
  ebitaGlobal?: number
  annualRevenueNAM?: number
  annualRevenueEurope?: number
  annualRevenueLatam?: number
  annualRevenueAfrica?: number
  annualRevenueAPAC?: number
}

export interface RFIFinancials {
  currency: string
  y2024?: RFIYearFinancials
  y2023?: RFIYearFinancials
  y2022?: RFIYearFinancials
  y2021?: RFIYearFinancials
  y2020?: RFIYearFinancials
}

export interface RFIClient {
  clientName: string
  industry?: string
  principalActivities?: string
  year?: string
  turnoverEUR?: number
  clientIncidencePct?: number
  exclusivity?: boolean
}

// ── Agency-specific competencies ──────────────────────────────────────────────

export interface RFIAgencyCompetencies {
  // Strategic & Consulting
  strategicPlanning: boolean
  brandAudit: boolean
  brandIdentityDevelopment: boolean
  positioningStrategy: boolean
  reputationManagement: boolean
  crisisManagement: boolean
  marketingResearch: boolean
  consumerInsight: boolean

  // Creative & Content
  campaignCreation: boolean
  creativeConceptDevelopment: boolean
  creativeProduction: boolean
  contentCopywriting: boolean
  graphicDesign: boolean
  pointOfSaleMaterials: boolean
  photography: boolean
  illustration: boolean
  motionGraphicsAnimation: boolean
  videoProduction: boolean
  audioProduction: boolean
  postProductionEditing: boolean

  // PR & Events
  mediaRelations: boolean
  publicRelationsStrategy: boolean
  influencerRelations: boolean
  pressReleasesKits: boolean
  eventOrganizationManagement: boolean
  sponsorshipManagement: boolean
  experientialMarketing: boolean

  // Above the Line
  mediaManagement: boolean
  mediaPlanning: boolean
  mediaBuying: boolean
  mediaAgenciesCoordination: boolean
  broadcastAdvertising: boolean
  oohDooh: boolean
  directMarketing: boolean

  // Below the Line / Trade
  promotionalMarketing: boolean
  inStoreMarketing: boolean
  samplingCampaigns: boolean
  merchandisingStrategy: boolean

  // Digital Marketing
  digitalStrategy: boolean
  seo: boolean
  sem: boolean
  displayProgrammatic: boolean
  performanceMarketing: boolean
  digitalDataAnalysis: boolean

  // Social & Influencer
  socialMediaStrategyManagement: boolean
  communityManagement: boolean
  paidSocialCampaigns: boolean
  influencerMarketingStrategy: boolean
  socialListening: boolean
  sentimentAnalysis: boolean

  // Technology & Digital
  webDevelopmentMaintenance: boolean
  appDevelopment: boolean
  ecommerceSolution: boolean
  uxUiDesign: boolean
  crmIntegration: boolean

  // Trade Marketing
  posPointOfSale: boolean
  distributionChannelAnalysis: boolean
  channelPromotions: boolean
  tradeEvents: boolean
  distributorRelationshipManagement: boolean

  // Retail
  visualMerchandising: boolean
  omnichannelRetailStrategy: boolean
  merchandisingPlanogramming: boolean
  retailSalesAnalysis: boolean
  inStoreCustomerExperience: boolean

  // Media (POS specific)
  mediaSpaceBuying: boolean
  mediaContentDevelopment: boolean
  mediaMonitoring: boolean
  editorialPlanning: boolean
  impactAnalysis: boolean
}

export interface RFICapabilityAllocation {
  strategicConsulting: number    // % 0-100
  creativeContent: number
  audioVisualProduction: number
  prEvents: number
  aboveTheLine: number
  belowTheLine: number
  digitalMarketing: number
  socialInfluencer: number
  technologyDigital: number
  analyticsReporting: number
  emailContentMarketing: number
  tradeMarketing: number
  retail: number
  media: number
}

// ── Production-specific competencies ─────────────────────────────────────────

export interface RFIProductionCompetencies {
  // Pre-Production
  directorScouting: boolean
  locationScouting: boolean
  bookletCreation: boolean
  castingScouting: boolean

  // Production
  rentalTechnicalEquipment: boolean
  crew: boolean
  logisticsClient: boolean
  purchaseHDDs: boolean
  deliveryPostProduction: boolean
  logisticsAgency: boolean

  // Post-Production
  coordinationPostProduction: boolean
  deliveryToBroadcasters: boolean
}

export interface RFIPostProductionDetail {
  hasInHouse: boolean
  services?: string   // editing, color grading, VFX, sound design, etc.
  outsourcedPartners?: Array<{
    name: string
    location: string
    audio: boolean
    video: boolean
  }>
}

export interface RFIDirector {
  name: string
  exclusivity: boolean
  priority: boolean
  occasionalCollaboration: boolean
}

export interface RFIAward {
  festival: 'AICP' | 'Ciclope Festival' | 'British Arrows' | 'Shots' | 'Clio Awards' | 'D&AD' | 'The One Show' | 'Creative Circle' | 'APA Show' | 'YDA' | 'VES' | 'LIA' | string
  distinction?: string
  category?: string
  year?: number
  awardedAd?: string
  brand?: string
}

// ── People / Org for Production Houses ───────────────────────────────────────

export interface RFIPeopleRow {
  role: string
  numEmployees?: number
  numFreelancers?: number
  avgAnnualSalary?: number
}

// ── Governance / SOW (Production) ────────────────────────────────────────────

export interface RFIGovernance {
  qualityAssuranceSystems?: string
  clientDataProtocols?: string
  globalLocalGovernance?: string
  additionalInfo?: string
}

// ── Activities outsourced ────────────────────────────────────────────────────

export interface RFIOutsourcedActivity {
  activity: string
  description?: string
  contractualValuePct?: number
}

// ── Social Responsibility (Production) ───────────────────────────────────────

export interface RFISocialResponsibility {
  genderEqualityPolicies?: boolean
  antiDiscriminationPolicies?: boolean
  humanRightsTraining?: boolean
  socialEnvironmentalProjects?: boolean
  nonprofitPartnerships?: boolean
  impactAreas?: string[]
  csrManagerAppointed?: boolean
  periodicSocialReporting?: boolean
  ethicalSupplierCriteria?: boolean
  supplierCertifications?: boolean
  csrAwareness?: boolean
}

// ── Investments ──────────────────────────────────────────────────────────────

export interface RFIInvestments {
  currency: string
  itEquipmentPct?: number
  innovationPct?: number
  sustainableDevelopmentPct?: number
  mediaAdvertisingPct?: number
  trainingPct?: number
  otherPct?: number
}

// ── AI / Other info ──────────────────────────────────────────────────────────

export interface RFIOtherInfo {
  specificServicesTools?: string
  currentAITools?: string
  futureAIImplementations?: string
  aiDeliveredBenefits?: string
  aiEthicalAspects?: string
  aiRiskMitigation?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTITY TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface RFIGeneralInfo {
  registeredBusinessName: string
  dunsNumber?: string
  vatRegistrationNumber?: string
  legalForm?: string
  companyRegistrationNumber?: string
  yearEstablished?: number
}

export interface RFIOrganization {
  numberOfEmployees: EmployeeRange
  companyLevel: CompanyLevel
  parentCompanyName?: string
  category: AgencyCategory
  currency: string
  tradeOrganizations?: string
}

export interface RFIAddress {
  countryCoverage: CountryCoverage
  address?: string
  postcode?: string
  city: string
  country: string
}

// ── Full Agency RFI ──────────────────────────────────────────────────────────

export interface AgencyRFI {
  // Meta
  id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt?: string
  createdAt: string

  // Sections
  generalInfo: RFIGeneralInfo
  organization: RFIOrganization
  address: RFIAddress
  contacts: RFIContact[]                        // CEO, GM, Business Director, ECD, Exec Producer
  socialMedia: RFISocialMedia
  marketPositioning?: string                    // free-text positioning statement
  capabilityAllocation: Partial<RFICapabilityAllocation>
  sectors: RFISectors
  competencies: Partial<RFIAgencyCompetencies>
  about?: string
  philosophy?: string
  networkDescription?: string
  localRepresentation?: string
  otherInfo?: RFIOtherInfo
}

// ── Full Production House RFI ────────────────────────────────────────────────

export interface ProductionRFI {
  // Meta
  id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt?: string
  createdAt: string

  // Sections
  generalInfo: RFIGeneralInfo
  organization: RFIOrganization
  address: RFIAddress
  contacts: RFIContact[]                        // CEO, GM, Business Director, Executive Producer
  socialMedia: RFISocialMedia
  financials?: RFIFinancials
  mainClients?: RFIClient[]
  currentClientCheck?: {
    workedWithClient: boolean
    details?: Array<{
      division: string
      activities: string
      year: string
      turnoverEUR?: number
      incidencePct?: number
    }>
    engagementDuration?: string
  }
  sectors: RFISectors
  capabilityAllocation: Partial<RFICapabilityAllocation>
  productionCompetencies: Partial<RFIProductionCompetencies>
  postProduction?: RFIPostProductionDetail
  governance?: RFIGovernance
  outsourcedActivities?: RFIOutsourcedActivity[]
  people?: {
    permanentEmployees?: number
    freelancers?: number
    roles?: RFIPeopleRow[]
  }
  directors?: RFIDirector[]
  awards?: RFIAward[]
  about?: string
  philosophy?: string
  networkDescription?: string
  localRepresentation?: string
  socialResponsibility?: RFISocialResponsibility
  investments?: RFIInvestments
  otherInfo?: RFIOtherInfo
}
