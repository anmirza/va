import {
  pgTable, text, integer, boolean, timestamp, jsonb, uuid, varchar,
} from 'drizzle-orm/pg-core'

// ── Organisations (agencies & production companies) ───────────────────────────
export const organisations = pgTable('organisations', {
  id:               uuid('id').primaryKey().defaultRandom(),
  type:             text('type').notNull(),                       // 'agency' | 'production' | categoryId
  name:             text('name').notNull(),
  country:          text('country'),
  region:           text('region'),
  description:      text('description'),
  category:         text('category'),
  categoryId:       text('category_id'),
  status:           text('status').default('active').notNull(),   // 'active' | 'pending' | 'rejected' | 'removed'
  memberCount:      integer('member_count').default(0).notNull(),
  registrationId:   text('registration_id'),
  profileData:      jsonb('profile_data'),
  latestUpdateAt:   timestamp('latest_update_at'),
  lastFollowUpAt:   timestamp('last_follow_up_at'),
  createdByAdminId: text('created_by_admin_id'),
  moderatorUserId:  text('moderator_user_id'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
})

// ── Client Companies ──────────────────────────────────────────────────────────
export const clientCompanies = pgTable('client_companies', {
  id:               uuid('id').primaryKey().defaultRandom(),
  name:             text('name').notNull(),
  holdingCompany:   text('holding_company'),
  regionalHub:      text('regional_hub'),
  region:           text('region'),
  localCompany:     text('local_company'),
  country:          text('country'),
  tokens:           integer('tokens').default(0).notNull(),
  tokensUsed:       integer('tokens_used').default(0).notNull(),
  packageSize:      integer('package_size').default(6).notNull(),
  status:           text('status').default('active').notNull(),
  notes:            text('notes'),
  createdByAdminId: text('created_by_admin_id'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
})

// ── Users (all platform users — vendor, client, admin, super_admin) ───────────
export const users = pgTable('users', {
  id:                 text('id').primaryKey(),   // Firebase UID
  email:              text('email').notNull().unique(),
  name:               text('name'),
  role:               text('role').default('vendor').notNull(),
  accountType:        text('account_type'),
  orgRole:            text('org_role'),
  companyId:          uuid('company_id'),
  mobile:             text('mobile'),
  region:             text('region'),
  country:            text('country'),
  mustChangePassword: boolean('must_change_password').default(false).notNull(),
  status:             text('status').default('active').notNull(),
  companyIds:         jsonb('company_ids').$type<string[]>().default([]),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
  updatedAt:          timestamp('updated_at').defaultNow().notNull(),
})

// ── Client Users (users that belong to a client company) ──────────────────────
export const clientUsers = pgTable('client_users', {
  id:        text('id').primaryKey(),   // Firebase UID (same as users.id)
  companyId: uuid('company_id').notNull().references(() => clientCompanies.id),
  name:      text('name').notNull(),
  email:     text('email').notNull(),
  role:      text('role').default('client').notNull(),
  mobile:    text('mobile'),
  region:    text('region'),
  country:   text('country'),
  status:    text('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Pending Registrations ─────────────────────────────────────────────────────
export const pendingRegistrations = pgTable('pending_registrations', {
  id:                  text('id').primaryKey(),
  type:                text('type').notNull(),
  companyName:         text('company_name').notNull(),
  submittedByUserId:   text('submitted_by_user_id').notNull(),
  submittedByName:     text('submitted_by_name').notNull(),
  submittedByEmail:    text('submitted_by_email').notNull(),
  submittedAt:         timestamp('submitted_at').defaultNow().notNull(),
  status:              text('status').default('pending').notNull(),
  profileData:         jsonb('profile_data'),
  rejectionReason:     text('rejection_reason'),
  approvedAt:          timestamp('approved_at'),
  approvedByAdminId:   text('approved_by_admin_id'),
  rejectedAt:          timestamp('rejected_at'),
  rejectedByAdminId:   text('rejected_by_admin_id'),
})

// ── Invitations ───────────────────────────────────────────────────────────────
export const invitations = pgTable('invitations', {
  id:                 text('id').primaryKey(),
  token:              text('token').unique().notNull(),
  orgId:              text('org_id').notNull(),
  orgName:            text('org_name').notNull(),
  orgType:            text('org_type').notNull(),
  invitedEmail:       text('invited_email'),
  createdByAdminId:   text('created_by_admin_id').notNull(),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
  acceptedAt:         timestamp('accepted_at'),
  acceptedByUserId:   text('accepted_by_user_id'),
  status:             text('status').default('pending').notNull(),
})

// ── VA Categories ─────────────────────────────────────────────────────────────
export const vaCategories = pgTable('va_categories', {
  id:      text('id').primaryKey(),
  name:    text('name').notNull(),
  iconSvg: text('icon_svg').default(''),
  orderIndex: integer('order_index').default(0),
})

// ── RFI Fields (per category) ─────────────────────────────────────────────────
export const rfiFields = pgTable('rfi_fields', {
  id:         text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  label:      text('label').notNull(),
  type:       text('type').notNull(),   // 'text' | 'number' | 'date' | 'textarea' | 'checkbox' | 'select' | 'table' | 'file'
  required:   boolean('required').default(false).notNull(),
  section:    text('section'),
  orderIndex: integer('order_index').default(0).notNull(),
  visible:    boolean('visible').default(true).notNull(),
})

// ── Config (disclaimers, settings) ───────────────────────────────────────────
export const config = pgTable('config', {
  key:       text('key').primaryKey(),
  value:     jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: text('updated_by'),
})

// ── Activity Log ──────────────────────────────────────────────────────────────
export const activityLog = pgTable('activity_log', {
  id:          uuid('id').primaryKey().defaultRandom(),
  type:        text('type').notNull(),
  description: text('description').notNull(),
  userId:      text('user_id'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})
