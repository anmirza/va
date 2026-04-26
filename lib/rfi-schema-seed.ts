/**
 * rfi-schema-seed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Initial seed of the built-in agency / production RFI fields, mirroring the
 * scalar inputs currently hard-coded in <AgencyRfiForm /> and
 * <ProductionRfiForm />. Admins can then add / edit / remove fields on top.
 *
 * System composite blocks (turnover tables, social media grid, attachments
 * uploader, etc.) are also represented here so admins can show / hide them
 * and rename their headings, but cannot delete them.
 */

import type { RfiField } from '@/lib/admin-store'

// ────────────────────────────────────────────────────────────────────────────
// AGENCY  (8 steps)
// ────────────────────────────────────────────────────────────────────────────

export const AGENCY_RFI_SEED: RfiField[] = [
  // ── STEP 1: General Info ──
  { id: 'businessName',       label: 'Registered Business Name', type: 'text',   required: true,  stepKey: 'general-info', subSectionKey: 'legal-identity',           placeholder: 'e.g. Acme Agency Ltd.', isSystem: true,  visible: true, order: 10 },
  { id: 'dunsNumber',         label: 'D-U-N-S® Number',          type: 'text',   required: false, stepKey: 'general-info', subSectionKey: 'legal-identity',           placeholder: '9-digit number',         isSystem: true,  visible: true, order: 20 },
  { id: 'vatNumber',          label: 'VAT Registration Number',  type: 'text',   required: false, stepKey: 'general-info', subSectionKey: 'legal-identity',           placeholder: 'e.g. GB123456789',       isSystem: true,  visible: true, order: 30 },
  { id: 'legalForm',          label: 'Legal Form',               type: 'text',   required: false, stepKey: 'general-info', subSectionKey: 'legal-identity',           placeholder: 'e.g. Ltd, GmbH, S.A.S.', isSystem: true,  visible: true, order: 40 },
  { id: 'companyRegNumber',   label: 'Company Registration Number', type: 'text', required: false, stepKey: 'general-info', subSectionKey: 'legal-identity',          placeholder: 'Companies House number', isSystem: true,  visible: true, order: 50 },
  { id: 'yearEstablished',    label: 'Year Established',         type: 'number', required: false, stepKey: 'general-info', subSectionKey: 'legal-identity',           placeholder: 'e.g. 2005',              isSystem: true,  visible: true, order: 60 },
  { id: 'employees',          label: '# of Employees',           type: 'select', required: true,  stepKey: 'general-info', subSectionKey: 'organisation-structure',                                          isSystem: true,  visible: true, order: 70 },
  { id: 'companyLevel',       label: 'Company Level',            type: 'select', required: false, stepKey: 'general-info', subSectionKey: 'organisation-structure',                                          isSystem: true,  visible: true, order: 80 },
  { id: 'parentCompany',      label: 'Parent Company Name',      type: 'text',   required: false, stepKey: 'general-info', subSectionKey: 'organisation-structure',   placeholder: 'If part of a group',     isSystem: true,  visible: true, order: 90 },
  { id: 'category',           label: 'Category',                 type: 'select', required: true,  stepKey: 'general-info', subSectionKey: 'organisation-structure',                                          isSystem: true,  visible: true, order: 100 },
  { id: 'currency',           label: 'Agency Currency',          type: 'select', required: false, stepKey: 'general-info', subSectionKey: 'organisation-structure',                                          isSystem: true,  visible: true, order: 110 },
  { id: 'tradeOrganizations', label: 'Trade Organizations',      type: 'text',   required: false, stepKey: 'general-info', subSectionKey: 'organisation-structure',   placeholder: 'e.g. IPA, ISBA, EACA',   isSystem: true,  visible: true, order: 120 },

  // ── STEP 2: Contacts ──
  { id: 'contactsBlock',      label: 'Key Contacts',             type: 'table',  required: false, stepKey: 'contacts',     systemBlock: 'contacts',                                                          isSystem: true,  visible: true, order: 10 },
  { id: 'socialMediaBlock',   label: 'Social Media',             type: 'table',  required: false, stepKey: 'contacts',     systemBlock: 'social-media',                                                      isSystem: true,  visible: true, order: 20 },

  // ── STEP 3: Turnover & Clients ──
  { id: 'address',            label: 'Registered Address',       type: 'textarea', required: false, stepKey: 'turnover-clients', subSectionKey: 'address',            placeholder: 'Street, postcode, country', isSystem: true, visible: true, order: 10 },
  { id: 'agencyOverview',     label: 'Agency Overview',          type: 'textarea', required: false, stepKey: 'turnover-clients', subSectionKey: 'overview',           placeholder: 'Brief description of the agency', isSystem: true, visible: true, order: 20 },
  { id: 'turnoverBlock',      label: 'Turnover by Region',       type: 'table',  required: false, stepKey: 'turnover-clients', systemBlock: 'turnover',                                                      isSystem: true,  visible: true, order: 30 },
  { id: 'topClientsBlock',    label: 'Top Clients',              type: 'table',  required: false, stepKey: 'turnover-clients', systemBlock: 'top-clients',                                                   isSystem: true,  visible: true, order: 40 },

  // ── STEP 4: Knowledge & Competencies ──
  { id: 'communicationAreasBlock', label: 'Communication Areas', type: 'table',  required: false, stepKey: 'knowledge-competencies', systemBlock: 'communication-areas',                                    isSystem: true,  visible: true, order: 10 },
  { id: 'serviceGroupsBlock', label: 'Service Capabilities',     type: 'table',  required: false, stepKey: 'knowledge-competencies', systemBlock: 'service-groups',                                          isSystem: true,  visible: true, order: 20 },
  { id: 'capabilitiesBlock',  label: 'Capability Percentages',   type: 'table',  required: false, stepKey: 'knowledge-competencies', systemBlock: 'capabilities',                                            isSystem: true,  visible: true, order: 30 },

  // ── STEP 5: Governance & SOW ──
  { id: 'governanceQaBlock',  label: 'Governance Questions',     type: 'table',  required: false, stepKey: 'governance-sow', systemBlock: 'governance-qa',                                                  isSystem: true,  visible: true, order: 10 },
  { id: 'sowDescription',     label: 'Statement of Work — Description', type: 'textarea', required: false, stepKey: 'governance-sow', placeholder: 'Describe the SOW model you propose',                    isSystem: true,  visible: true, order: 20 },

  // ── STEP 6: People & Talent ──
  { id: 'employeeHeadcountBlock', label: 'Staff Headcount by Department', type: 'table', required: false, stepKey: 'people-talent', systemBlock: 'employee-headcount',                                       isSystem: true,  visible: true, order: 10 },
  { id: 'primaryTalent',      label: 'Primary Talent / Capabilities', type: 'textarea', required: false, stepKey: 'people-talent', placeholder: 'Describe your key talent areas',                            isSystem: true,  visible: true, order: 20 },

  // ── STEP 7: Awards & Infos ──
  { id: 'awardsBlock',        label: 'Awards',                   type: 'table',  required: false, stepKey: 'awards-infos', systemBlock: 'awards',                                                            isSystem: true,  visible: true, order: 10 },
  { id: 'aiQaBlock',          label: 'AI Usage',                 type: 'table',  required: false, stepKey: 'awards-infos', systemBlock: 'ai-qa',                                                             isSystem: true,  visible: true, order: 20 },
  { id: 'csrQaBlock',         label: 'Social Responsibility',    type: 'table',  required: false, stepKey: 'awards-infos', systemBlock: 'csr-qa',                                                            isSystem: true,  visible: true, order: 30 },

  // ── STEP 8: Add-On ──
  { id: 'investmentsBlock',   label: 'Investments',              type: 'table',  required: false, stepKey: 'add-on',       systemBlock: 'investments',                                                       isSystem: true,  visible: true, order: 10 },
  { id: 'strategicDevelopment', label: 'Strategic Development',  type: 'textarea', required: false, stepKey: 'add-on',                                                  placeholder: 'Describe your strategic plan', isSystem: true,  visible: true, order: 20 },
  { id: 'attachmentsBlock',   label: 'Attachments',              type: 'file',   required: false, stepKey: 'add-on',       systemBlock: 'attachments',                                                       isSystem: true,  visible: true, order: 30 },
]

// ────────────────────────────────────────────────────────────────────────────
// PRODUCTION  (13 steps)
// ────────────────────────────────────────────────────────────────────────────

export const PRODUCTION_RFI_SEED: RfiField[] = [
  // ── STEP 1: General Info ──
  { id: 'businessName',       label: 'Registered Business Name', type: 'text',   required: true,  stepKey: 'general-info', placeholder: 'e.g. Acme Productions Ltd.', isSystem: true, visible: true, order: 10 },
  { id: 'dunsNumber',         label: 'D-U-N-S® Number',          type: 'text',   required: false, stepKey: 'general-info', placeholder: '9-digit number',              isSystem: true, visible: true, order: 20 },
  { id: 'vatNumber',          label: 'VAT Registration Number',  type: 'text',   required: false, stepKey: 'general-info', placeholder: 'e.g. GB123456789',            isSystem: true, visible: true, order: 30 },
  { id: 'legalForm',          label: 'Legal Form',               type: 'text',   required: false, stepKey: 'general-info', placeholder: 'e.g. Ltd, GmbH, S.A.S.',      isSystem: true, visible: true, order: 40 },
  { id: 'companyRegNumber',   label: 'Company Registration Number', type: 'text', required: false, stepKey: 'general-info', placeholder: 'Companies House number',     isSystem: true, visible: true, order: 50 },
  { id: 'yearEstablished',    label: 'Year Established',         type: 'number', required: false, stepKey: 'general-info', placeholder: 'e.g. 2005',                   isSystem: true, visible: true, order: 60 },

  // ── STEP 2: Organisation ──
  { id: 'employees',          label: '# of Employees',           type: 'select', required: true,  stepKey: 'organisation', isSystem: true, visible: true, order: 10 },
  { id: 'companyLevel',       label: 'Company Level',            type: 'select', required: false, stepKey: 'organisation', isSystem: true, visible: true, order: 20 },
  { id: 'parentCompany',      label: 'Parent Company Name',      type: 'text',   required: false, stepKey: 'organisation', placeholder: 'If part of a group', isSystem: true, visible: true, order: 30 },
  { id: 'currency',           label: 'Currency',                 type: 'select', required: false, stepKey: 'organisation', isSystem: true, visible: true, order: 40 },

  // ── STEP 3: Address ──
  { id: 'addressLine1',       label: 'Street Address',           type: 'text',   required: false, stepKey: 'address',      placeholder: 'Street and number', isSystem: true, visible: true, order: 10 },
  { id: 'city',               label: 'City',                     type: 'text',   required: false, stepKey: 'address',      isSystem: true, visible: true, order: 20 },
  { id: 'postcode',           label: 'Postcode / ZIP',           type: 'text',   required: false, stepKey: 'address',      isSystem: true, visible: true, order: 30 },
  { id: 'country',            label: 'Country',                  type: 'select', required: false, stepKey: 'address',      isSystem: true, visible: true, order: 40 },
  { id: 'geographicCoverage', label: 'Geographic Coverage',      type: 'select', required: false, stepKey: 'address',      isSystem: true, visible: true, order: 50 },

  // ── STEP 4: About ──
  { id: 'companyDescription', label: 'Company Description',      type: 'textarea', required: false, stepKey: 'about', placeholder: 'Describe your production house', isSystem: true, visible: true, order: 10 },
  { id: 'networkDescription', label: 'Network & Affiliations',   type: 'textarea', required: false, stepKey: 'about', placeholder: 'Describe your partner network',  isSystem: true, visible: true, order: 20 },

  // ── STEP 5: Contacts ──
  { id: 'contactsBlock',      label: 'Key Contacts',             type: 'table',  required: false, stepKey: 'contacts',     systemBlock: 'contacts', isSystem: true, visible: true, order: 10 },

  // ── STEP 6: Social Media ──
  { id: 'socialMediaBlock',   label: 'Social Media Profiles',    type: 'table',  required: false, stepKey: 'social-media', systemBlock: 'social-media', isSystem: true, visible: true, order: 10 },
  { id: 'website',            label: 'Website',                  type: 'url',    required: false, stepKey: 'social-media', placeholder: 'https://example.com', isSystem: true, visible: true, order: 20 },

  // ── STEP 7: Turnover & Clients ──
  { id: 'turnoverBlock',      label: 'Turnover by Region',       type: 'table',  required: false, stepKey: 'turnover-clients', systemBlock: 'turnover', isSystem: true, visible: true, order: 10 },
  { id: 'topClientsBlock',    label: 'Top Clients',              type: 'table',  required: false, stepKey: 'turnover-clients', systemBlock: 'top-clients', isSystem: true, visible: true, order: 20 },

  // ── STEP 8: Competencies ──
  { id: 'communicationAreasBlock', label: 'Communication Areas', type: 'table',  required: false, stepKey: 'competencies', systemBlock: 'communication-areas', isSystem: true, visible: true, order: 10 },
  { id: 'capabilitiesBlock',  label: 'Production Capabilities',  type: 'table',  required: false, stepKey: 'competencies', systemBlock: 'capabilities', isSystem: true, visible: true, order: 20 },

  // ── STEP 9: Post-Production ──
  { id: 'postProductionBlock', label: 'Post-Production',         type: 'table',  required: false, stepKey: 'post-production', systemBlock: 'post-production', isSystem: true, visible: true, order: 10 },

  // ── STEP 10: People & Directors ──
  { id: 'employeeHeadcountBlock', label: 'Staff Headcount',      type: 'table',  required: false, stepKey: 'people-directors', systemBlock: 'employee-headcount', isSystem: true, visible: true, order: 10 },
  { id: 'directorsBlock',     label: 'Key Directors',            type: 'table',  required: false, stepKey: 'people-directors', systemBlock: 'directors', isSystem: true, visible: true, order: 20 },
  { id: 'investmentsBlock',   label: 'Investment Allocations',   type: 'table',  required: false, stepKey: 'people-directors', systemBlock: 'investments', isSystem: true, visible: true, order: 30 },

  // ── STEP 11: Awards & CSR ──
  { id: 'awardsBlock',        label: 'Awards',                   type: 'table',  required: false, stepKey: 'awards-csr',   systemBlock: 'awards', isSystem: true, visible: true, order: 10 },
  { id: 'csrQaBlock',         label: 'CSR Questions',            type: 'table',  required: false, stepKey: 'awards-csr',   systemBlock: 'csr-qa', isSystem: true, visible: true, order: 20 },

  // ── STEP 12: Governance & AI ──
  { id: 'governanceQaBlock',  label: 'Governance',               type: 'table',  required: false, stepKey: 'governance-ai', systemBlock: 'governance-qa', isSystem: true, visible: true, order: 10 },
  { id: 'aiQaBlock',          label: 'AI Approach',              type: 'table',  required: false, stepKey: 'governance-ai', systemBlock: 'ai-qa', isSystem: true, visible: true, order: 20 },

  // ── STEP 13: Attachments ──
  { id: 'attachmentsBlock',   label: 'Required Documents',       type: 'file',   required: false, stepKey: 'attachments',  systemBlock: 'attachments', isSystem: true, visible: true, order: 10 },
]

/**
 * Map of categoryId → seed schema.
 * Used by `ensureFirestoreSeedFS` to bootstrap empty Firestore docs.
 */
export const RFI_SCHEMA_SEEDS: Record<string, RfiField[]> = {
  'cat-agency':     AGENCY_RFI_SEED,
  'cat-production': PRODUCTION_RFI_SEED,
}
