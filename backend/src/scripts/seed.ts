/**
 * seed.ts
 * Inserts all dummy data for local development and testing.
 * Run: npm run seed
 */

import 'dotenv/config'
import { db, pool } from '../db'
import {
  users, organisations, clientCompanies, clientUsers,
  vaCategories, rfiFields, config, activityLog,
} from '../db/schema'

async function seed() {
  console.log('🌱 Seeding database...\n')

  // ── VA Categories ───────────────────────────────────────────────────────────
  console.log('  → Categories...')
  await db.delete(vaCategories)
  await db.insert(vaCategories).values([
    { id: 'cat-agency',     name: 'Agencies',             iconSvg: '', orderIndex: 0 },
    { id: 'cat-production', name: 'Production Companies', iconSvg: '', orderIndex: 1 },
    { id: 'cat-consulting', name: 'Consulting',            iconSvg: '', orderIndex: 2 },
    { id: 'cat-media',      name: 'Media',                 iconSvg: '', orderIndex: 3 },
  ])

  // ── RFI Fields ──────────────────────────────────────────────────────────────
  console.log('  → RFI fields...')
  await db.delete(rfiFields)
  await db.insert(rfiFields).values([
    // Agency fields
    { id: 'rfi-a-1', categoryId: 'cat-agency', label: 'Agency Name',         type: 'text',     required: true,  section: 'Basic Info', orderIndex: 0, visible: true },
    { id: 'rfi-a-2', categoryId: 'cat-agency', label: 'Year Established',    type: 'number',   required: true,  section: 'Basic Info', orderIndex: 1, visible: true },
    { id: 'rfi-a-3', categoryId: 'cat-agency', label: 'Number of Employees', type: 'number',   required: false, section: 'Basic Info', orderIndex: 2, visible: true },
    { id: 'rfi-a-4', categoryId: 'cat-agency', label: 'Key Services',        type: 'textarea', required: true,  section: 'Services',   orderIndex: 3, visible: true },
    { id: 'rfi-a-5', categoryId: 'cat-agency', label: 'Annual Turnover',     type: 'select',   required: false, section: 'Financials', orderIndex: 4, visible: true },
    // Production fields
    { id: 'rfi-p-1', categoryId: 'cat-production', label: 'Company Name',        type: 'text',     required: true,  section: 'Basic Info', orderIndex: 0, visible: true },
    { id: 'rfi-p-2', categoryId: 'cat-production', label: 'Year Established',    type: 'number',   required: true,  section: 'Basic Info', orderIndex: 1, visible: true },
    { id: 'rfi-p-3', categoryId: 'cat-production', label: 'Production Capacity', type: 'textarea', required: false, section: 'Services',   orderIndex: 2, visible: true },
    { id: 'rfi-p-4', categoryId: 'cat-production', label: 'Equipment List',      type: 'textarea', required: false, section: 'Equipment',  orderIndex: 3, visible: true },
  ])

  // ── Internal Users (VA staff) ───────────────────────────────────────────────
  console.log('  → Internal users...')
  await db.delete(users)
  await db.insert(users).values([
    {
      id: 'superadmin-uid',
      email: 'superadmin@va-consulting.com',
      name: 'Super Admin',
      role: 'super_admin',
      accountType: 'vendor',
      mustChangePassword: false,
      status: 'active',
    },
    {
      id: 'admin-uid',
      email: 'admin@va-consulting.com',
      name: 'Admin User',
      role: 'admin',
      accountType: 'vendor',
      mustChangePassword: false,
      status: 'active',
    },
    {
      id: 'vendor-uid',
      email: 'demo@requisti.com',
      name: 'Demo Vendor',
      role: 'vendor',
      accountType: 'vendor',
      mustChangePassword: false,
      status: 'active',
    },
    {
      id: 'client-uid',
      email: 'client@requisti.com',
      name: 'Demo Client',
      role: 'client',
      accountType: 'client',
      companyId: '00000000-0000-0000-0000-000000000001',
      mustChangePassword: false,
      status: 'active',
    },
  ])

  // ── Client Companies ────────────────────────────────────────────────────────
  console.log('  → Client companies...')
  await db.delete(clientCompanies)
  await db.insert(clientCompanies).values([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Unilever MENA',
      holdingCompany: 'Unilever Global',
      regionalHub: 'Unilever MENA Hub',
      region: 'Middle East & Africa',
      localCompany: 'Unilever UAE',
      country: 'UAE',
      tokens: 12,
      tokensUsed: 3,
      packageSize: 12,
      status: 'active',
      notes: 'Premium client — annual review Q4',
      createdByAdminId: 'superadmin-uid',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'P&G Saudi Arabia',
      holdingCompany: 'Procter & Gamble',
      region: 'Middle East',
      country: 'Saudi Arabia',
      tokens: 6,
      tokensUsed: 6,
      packageSize: 6,
      status: 'active',
      notes: 'Credits exhausted — contact for renewal',
      createdByAdminId: 'superadmin-uid',
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Nestlé Egypt',
      holdingCompany: 'Nestlé S.A.',
      region: 'Africa',
      country: 'Egypt',
      tokens: 6,
      tokensUsed: 1,
      packageSize: 6,
      status: 'active',
      createdByAdminId: 'admin-uid',
    },
  ])

  // ── Client Users ────────────────────────────────────────────────────────────
  console.log('  → Client users...')
  await db.delete(clientUsers)
  await db.insert(clientUsers).values([
    {
      id: 'client-uid',
      companyId: '00000000-0000-0000-0000-000000000001',
      name: 'Demo Client',
      email: 'client@requisti.com',
      role: 'client',
      status: 'active',
    },
    {
      id: 'client2-uid',
      companyId: '00000000-0000-0000-0000-000000000002',
      name: 'Sarah Johnson',
      email: 'sarah@pg.com',
      role: 'client',
      mobile: '+966501234567',
      status: 'active',
    },
  ])

  // Also add client2 to users table
  await db.insert(users).values([
    {
      id: 'client2-uid',
      email: 'sarah@pg.com',
      name: 'Sarah Johnson',
      role: 'client',
      accountType: 'client',
      companyId: '00000000-0000-0000-0000-000000000002',
      mustChangePassword: false,
      status: 'active',
    },
  ]).onConflictDoNothing()

  // ── Organisations ───────────────────────────────────────────────────────────
  console.log('  → Organisations...')
  await db.delete(organisations)
  await db.insert(organisations).values([
    // Agencies
    {
      id: '10000000-0000-0000-0000-000000000001',
      type: 'agency',
      name: 'Leo Burnett MENA',
      country: 'UAE',
      region: 'Middle East',
      description: 'Full-service creative agency with 40+ years in the MENA region.',
      categoryId: 'cat-agency',
      status: 'active',
      memberCount: 3,
      profileData: { yearEstablished: 1979, employees: 450, services: 'Creative, Digital, PR', turnover: '$50M+' },
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      type: 'agency',
      name: 'JWT Dubai',
      country: 'UAE',
      region: 'Middle East',
      description: 'Global advertising agency with a strong regional presence.',
      categoryId: 'cat-agency',
      status: 'active',
      memberCount: 2,
      profileData: { yearEstablished: 1985, employees: 320, services: 'Advertising, Digital, Strategy', turnover: '$30M+' },
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      type: 'agency',
      name: 'Publicis Groupe KSA',
      country: 'Saudi Arabia',
      region: 'Middle East',
      description: 'Leading communications group operating across KSA.',
      categoryId: 'cat-agency',
      status: 'active',
      memberCount: 1,
      profileData: { yearEstablished: 1999, employees: 280, services: 'Creative, Media, Digital', turnover: '$25M+' },
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      type: 'agency',
      name: 'TBWA\\RAAD',
      country: 'UAE',
      region: 'Middle East',
      description: 'Creative disruption agency specialising in brand storytelling.',
      categoryId: 'cat-agency',
      status: 'active',
      memberCount: 2,
      profileData: { yearEstablished: 1997, employees: 190, services: 'Creative, Digital, OOH', turnover: '$20M+' },
    },
    {
      id: '10000000-0000-0000-0000-000000000005',
      type: 'agency',
      name: 'Horizon FCB',
      country: 'UAE',
      region: 'Middle East',
      description: 'Integrated marketing communications agency.',
      categoryId: 'cat-agency',
      status: 'active',
      memberCount: 1,
      profileData: { yearEstablished: 1994, employees: 150, services: 'Advertising, Social, Creative', turnover: '$15M+' },
    },
    // Production companies
    {
      id: '10000000-0000-0000-0000-000000000006',
      type: 'production',
      name: 'Desert Film Productions',
      country: 'UAE',
      region: 'Middle East',
      description: 'Award-winning production house specialising in TVC and digital content.',
      categoryId: 'cat-production',
      status: 'active',
      memberCount: 2,
      profileData: { yearEstablished: 2003, capacity: 'High volume TVC and digital', equipment: 'RED cameras, full lighting rigs' },
    },
    {
      id: '10000000-0000-0000-0000-000000000007',
      type: 'production',
      name: 'Filmworks Riyadh',
      country: 'Saudi Arabia',
      region: 'Middle East',
      description: 'Premium production company for advertising and brand films.',
      categoryId: 'cat-production',
      status: 'active',
      memberCount: 1,
      profileData: { yearEstablished: 2010, capacity: 'Mid-scale productions', equipment: 'ARRI Alexa, drone fleet' },
    },
    {
      id: '10000000-0000-0000-0000-000000000008',
      type: 'production',
      name: 'Cairo Creative Studio',
      country: 'Egypt',
      region: 'Africa',
      description: 'Egypt\'s leading production house with regional distribution.',
      categoryId: 'cat-production',
      status: 'active',
      memberCount: 1,
      profileData: { yearEstablished: 2001, capacity: 'Large-scale Arabic productions', equipment: 'Full studio complex, post-production suite' },
    },
    // Pending/removed examples
    {
      id: '10000000-0000-0000-0000-000000000009',
      type: 'agency',
      name: 'New Entrant Agency',
      country: 'Kuwait',
      region: 'Middle East',
      description: 'Recently registered agency awaiting full approval.',
      categoryId: 'cat-agency',
      status: 'pending',
      memberCount: 0,
    },
  ])

  // ── Disclaimers ─────────────────────────────────────────────────────────────
  console.log('  → Disclaimers...')
  await db.delete(config)
  await db.insert(config).values([
    {
      key: 'disclaimers',
      value: {
        agency: `Welcome to the VA Consulting agency registration portal.\n\nBefore proceeding with your registration, please read the following legal disclaimer carefully.\n\nBy submitting your agency profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.\n\nYour submission will be reviewed by our team before your agency appears in the directory. This process typically takes 2–5 business days.\n\nAll data submitted will be processed in accordance with our Privacy Policy and applicable data protection legislation.`,
        production: `Welcome to the VA Consulting production company registration portal.\n\nBefore proceeding with your registration, please read the following legal disclaimer carefully.\n\nBy submitting your production company profile, you confirm that all information provided is accurate, complete, and truthful. VA Consulting reserves the right to verify any information submitted and to reject or remove registrations that do not meet our quality standards or are found to be inaccurate.\n\nYour submission will be reviewed by our team before your production company appears in the directory. This process typically takes 2–5 business days.`,
        lastUpdatedAt: new Date().toISOString(),
        lastUpdatedBy: 'superadmin-uid',
      },
      updatedBy: 'superadmin-uid',
    },
  ])

  // ── Activity Log ─────────────────────────────────────────────────────────────
  console.log('  → Activity log...')
  await db.delete(activityLog)
  await db.insert(activityLog).values([
    { type: 'org_create',  description: 'Created agency: Leo Burnett MENA',    userId: 'superadmin-uid' },
    { type: 'org_create',  description: 'Created agency: JWT Dubai',            userId: 'superadmin-uid' },
    { type: 'org_create',  description: 'Created production: Desert Film',      userId: 'admin-uid'      },
    { type: 'org_create',  description: 'Created client company: Unilever MENA',userId: 'superadmin-uid' },
    { type: 'invite',      description: 'Client user created: client@requisti.com', userId: 'superadmin-uid' },
    { type: 'signup',      description: 'New agency registration: New Entrant Agency', userId: 'vendor-uid' },
  ])

  console.log('\n✅ Seed complete!\n')
  console.log('Test accounts (DEV_MODE tokens):')
  console.log('  Super Admin → Authorization: Bearer dev_superadmin-uid')
  console.log('  Admin       → Authorization: Bearer dev_admin-uid')
  console.log('  Vendor      → Authorization: Bearer dev_vendor-uid')
  console.log('  Client      → Authorization: Bearer dev_client-uid')
  console.log('\nTest: curl http://localhost:4000/api/stats -H "Authorization: Bearer dev_superadmin-uid"')
  await pool.end()
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
