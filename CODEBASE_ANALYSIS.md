# Requisti – Full Codebase Analysis Report
**Date:** April 26, 2026  
**Analyst:** GitHub Copilot  
**Stack:** Next.js 16 / React 19 / TypeScript / Tailwind CSS / Radix UI / localStorage-backed mock store

---

## 1. Folder & File Structure Overview

```
requisti-version/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Public home page (static mock data)
│   ├── layout.tsx              # Root layout (AuthProvider, ThemeProvider, FollowProvider)
│   ├── globals.css             # Global styles
│   ├── admin/                  # Admin panel (role-gated)
│   │   ├── layout.tsx          # Admin sidebar layout
│   │   ├── page.tsx            # Admin dashboard (stats + activity feed)
│   │   ├── agencies/           # Agency management list + create
│   │   ├── production/         # Production company management list + create
│   │   ├── pending/            # Pending registrations list
│   │   ├── registrations/[id]/ # Registration detail + approve/reject
│   │   ├── clients/            # Client company management
│   │   ├── users/              # User list (from mock data)
│   │   ├── internal-users/     # VA staff management
│   │   ├── disclaimer/         # Editable disclaimer content
│   │   ├── settings/           # Category manager + RFI field modeler
│   │   └── listing/[categoryId]/ # Generic org listing by category
│   ├── signup/                 # Registration flow
│   │   ├── page.tsx            # Step 1: Create account (corp email validation)
│   │   ├── classify/           # Step 2: Choose vendor or client
│   │   ├── agency/             # Agency RFI form (dynamic fields)
│   │   ├── production/         # Production RFI form (dynamic fields)
│   │   ├── client/             # Client registration
│   │   ├── talent/             # Talent registration
│   │   ├── register/           # Re-registration after rejection
│   │   └── accept-invite/      # Invitation token acceptance
│   ├── login/                  # Login page
│   ├── setup-password/         # First-login password change
│   ├── dashboard/              # Post-login dashboards
│   │   ├── page.tsx            # Client dashboard
│   │   ├── vendor/             # Vendor dashboard
│   │   ├── agency/             # Agency profile management
│   │   ├── production/         # Production profile management
│   │   └── settings/, talent/, team/, vendor/
│   ├── directory/              # Public agency directory
│   ├── campaigns/              # Campaign browser
│   ├── awards/, rankings/, news/, insights/, interviews/
│   └── api/companies/[id]/     # Route handler (thin wrapper)
├── components/
│   ├── dynamic-rfi-form.tsx    # Multi-step form engine (renders RfiField[])
│   ├── dynamic-rfi-fields.tsx  # Individual field renderers
│   ├── auth-guard.tsx          # Client-side auth guard
│   ├── header.tsx, footer.tsx  # Global layout pieces
│   ├── company-card.tsx        # Agency directory card
│   ├── campaign-card.tsx       # Campaign display card
│   └── ui/                     # Full Shadcn/Radix component set
├── lib/
│   ├── auth-context.tsx        # Auth state (localStorage + cookies, mock login)
│   ├── admin-store.ts          # ALL admin data layer (localStorage only, no backend)
│   ├── mock-data.ts            # ALL static/demo content (companies, campaigns, news…)
│   ├── rfi-data.ts             # RFI reference data extracted from xlsx files
│   ├── rfi-types.ts            # TypeScript types for RFI forms
│   └── turnover-utils.ts       # Rolling 5-year window + email domain block list
├── middleware.ts               # Cookie-based auth/role routing guard
└── public/                     # Static assets (logos, uploads placeholder)
```

---

## 2. All Pages & Their Current State

| Route | Page | State | Notes |
|---|---|---|---|
| `/` | Home | **Static** | Renders `mock-data.ts` companies/campaigns |
| `/login` | Login | **Static** | Matches against `mockUsers` array |
| `/signup` | Sign Up | **Semi-dynamic** | Corporate email validation works; stores to localStorage only |
| `/signup/classify` | Account type | **Static** | Sets `accountType` in localStorage |
| `/signup/agency` | Agency RFI | **Dynamic UI, no backend** | Reads `getRfiFields('cat-agency')` from localStorage; submits to localStorage |
| `/signup/production` | Production RFI | **Dynamic UI, no backend** | Same as agency |
| `/signup/client` | Client form | **Static/partial** | Simplified, no backend |
| `/signup/accept-invite` | Invite accept | **Mock** | Reads invitation tokens from localStorage |
| `/setup-password` | Password setup | **Mock** | Sets `mustChangePassword = false` in localStorage |
| `/dashboard` | Client dashboard | **Static** | Shows mock followed agencies/campaigns |
| `/dashboard/vendor` | Vendor dashboard | **Semi-dynamic** | Shows registrations from localStorage |
| `/dashboard/agency` | Agency profile | **Static** | Shows mock company data |
| `/dashboard/production` | Production profile | **Static** | Shows mock company data |
| `/admin` | Admin dashboard | **Mock-dynamic** | Stats from localStorage, seeds dummy data on first load |
| `/admin/agencies` | Agencies list | **Mock-dynamic** | `getOrgsByType('agency')` from localStorage |
| `/admin/production` | Production list | **Mock-dynamic** | `getOrgsByType('production')` from localStorage |
| `/admin/pending` | Pending approvals | **Mock-dynamic** | `getAllRegistrations()` from localStorage |
| `/admin/registrations/[id]` | Registration detail | **Mock-dynamic** | Approve/reject writes to localStorage |
| `/admin/clients` | Client companies | **Mock-dynamic** | `getAllClientCompanies()` from localStorage |
| `/admin/users` | Users list | **Static** | Hard-coded `mockUsers` array, no CRUD |
| `/admin/internal-users` | VA Staff | **Mock-dynamic** | Create/read from localStorage |
| `/admin/disclaimer` | Disclaimer editor | **Mock-dynamic** | Saves to localStorage |
| `/admin/settings` | Categories + RFI modeler | **Mock-dynamic** | CRUD saved to localStorage |
| `/admin/listing/[categoryId]` | Generic org list | **Mock-dynamic** | Reads all orgs filtered by category |
| `/directory` | Agency directory | **Static** | Hard-coded `companies` from mock-data |
| `/campaigns` | Campaigns | **Static** | Hard-coded `campaigns` from mock-data |
| `/news`, `/insights`, `/interviews` | Content pages | **Static** | Hard-coded arrays |
| `/awards`, `/rankings` | Rankings | **Static** | Hard-coded arrays |

---

## 3. Existing Firebase/Backend Infrastructure

**There is NO Firebase integration anywhere in the codebase.** No Firebase SDK is installed. The `package.json` contains zero Firebase packages. The entire data layer is:

- **`localStorage`** via `admin-store.ts` — admin operations, registrations, orgs, invitations, disclaimers, categories, RFI fields
- **In-memory `mockUsers` array** — authentication and user data in `mock-data.ts`
- **Hard-coded `companies`, `campaigns`, `news`, etc.** — all public-facing content in `mock-data.ts`
- **Cookies** — lightweight auth/role state for middleware (`requisti_auth`, `requisti_role`, `requisti_setup`)

**No API routes exist.** `app/api/companies/[id]/` directory exists but contains no `route.ts` file.

---

## 4. Routing Structure & Auth Flow

```
Middleware (middleware.ts)
│
├── Public paths: /, /login, /signup, /news/*, /insights/*, /interviews/*
│
├── /admin/* → requires cookie requisti_auth=1 AND requisti_role=admin|super_admin
│   └── Non-admin authenticated → redirect /dashboard
│   └── Unauthenticated → redirect /login?redirect=...
│
├── /dashboard/*, /directory/*, /signup/classify, /signup/agency|production|client|talent
│   └── requires requisti_auth=1
│   └── Unauthenticated → redirect /login?redirect=...
│
└── requisti_setup=1 → intercept all requests → redirect /setup-password
```

**Auth state flow:**
1. `AuthProvider` reads `localStorage.requisti_user` on mount
2. `login()` matches email against `mockUsers` or accepts `password` = "password" for any corporate email
3. `persistUser()` writes to `localStorage` + sets cookies (`requisti_auth`, `requisti_role`)
4. `middleware.ts` reads cookies for server-side routing protection
5. **Critical gap**: Cookies expire after 86400s but localStorage has no expiry — state can diverge

**Role hierarchy in code:**
- `super_admin` → all features + Internal Staff, Client Management, Settings, Categories
- `admin` → most admin features (no super-admin-only items)
- `moderator` → org-level management
- `client`, `vendor`, `talent`, `user` → dashboard-only

---

## 5. Admin Panel Issues (mapped to files from feedback)

### 5.1 Issues from `Admin panel Feedback v1.pdf` / `feedback_content.txt` / `CLIENT_FEEDBACK_ANALYSIS.md`

| # | Issue | File(s) Responsible | Severity |
|---|---|---|---|
| 1 | **Sign-up entry asks vendor/client too early** — users see agency/production/client choice before basic registration | `app/signup/classify/page.tsx` | High |
| 2 | **No disclaimer page** before agency/production registration starts | `app/signup/agency/page.tsx`, `app/signup/production/page.tsx` | High |
| 3 | **Agency RFI step order wrong** — Registered Office Address and About are not inside General Info step | `components/dynamic-rfi-form.tsx`, `lib/admin-store.ts` (getRfiFields) | High |
| 4 | **Production RFI completely unstructured** — 13 separate flat steps vs agency's 8 grouped steps | `app/signup/production/page.tsx`, `lib/admin-store.ts` | Critical |
| 5 | **Production must match agency layout** (standardise both) | `components/dynamic-rfi-form.tsx` | Critical |
| 6 | **"Other Information" section missing from Add-On** — currently not in the Add-On step | `lib/admin-store.ts` (getRfiFields defaults) | Medium |
| 7 | **Emoticons present** in form labels/UI — must be corporate, no emoji | Multiple form components | Medium |
| 8 | **Percentage mandatory in K&C** — checkboxes should be replaced or percentage required | `components/dynamic-rfi-form.tsx`, `lib/rfi-data.ts` | High |
| 9 | **"+" button to add more contacts** — contacts section allows only fixed count | `components/dynamic-rfi-form.tsx` | High |
| 10 | **"+" button to add more awards** | `components/dynamic-rfi-form.tsx` | Medium |
| 11 | **Awards section missing a section divider** | `components/dynamic-rfi-form.tsx` | Low |
| 12 | **Social Responsibility under Awards** — should be in Add-On | `lib/admin-store.ts` | Medium |
| 13 | **Attachments: PDF only** restriction missing | `components/dynamic-rfi-form.tsx` (file upload) | Medium |
| 14 | **Admin Users page shows only static mockUsers** — no CRUD, no invite capability displayed | `app/admin/users/page.tsx` | High |
| 15 | **Admin Dashboard seeds dummy data** on first load — should show real zeros until real data exists | `app/admin/page.tsx` (`seedDummyData()` call) | High |
| 16 | **Follow-up email is mock** — `alert()` used instead of real action | `app/admin/agencies/page.tsx`, `app/admin/production/page.tsx` | High |
| 17 | **Remove org uses `confirm()`** — browser native dialog, not accessible | `app/admin/agencies/page.tsx`, `app/admin/production/page.tsx` | Medium |
| 18 | **Super Admin toggle is a demo button** — `toggleSuperAdmin` state instead of real auth role | `app/admin/layout.tsx` | High |
| 19 | **Settings/Categories save via `alert()`** — not production appropriate | `app/admin/settings/page.tsx` | Medium |
| 20 | **RFI field modeler "select" options are hard-coded** ("Option 1", "Option 2") | `components/dynamic-rfi-form.tsx` | High |
| 21 | **Currency not propagated** from Step 1 Org & Structure through Turnover table | `components/dynamic-rfi-form.tsx` | High |
| 22 | **Turnover table cells "too small"** — layout needs responsive full-width grid | `components/dynamic-rfi-form.tsx` | High |
| 23 | **Table field type renders placeholder** ("Configure Data Table") not a real table | `components/dynamic-rfi-form.tsx` | Critical |
| 24 | **`next.config.mjs` has `ignoreBuildErrors: true`** — hides TypeScript errors | `next.config.mjs` | Medium |
| 25 | **No Firestore indexes or security rules** file anywhere in project | (missing files) | Critical |
| 26 | **No `.env.local`** with Firebase credentials | (missing file) | Critical |
| 27 | **Background color mismatch** — login page uses `#eef0f3`, should be `#02030E` | `app/login/page.tsx` | Low |
| 28 | **Demo credentials shown on login screen** in production this must be removed | `app/login/page.tsx` | Critical |

---

## 6. Hardcoded / Dummy Data Locations

| Location | Content | Lines |
|---|---|---|
| `lib/mock-data.ts` | All companies (agencies), campaigns, news, interviews, insights, awards, people, consultants — entire directory dataset | ~2200+ lines |
| `lib/mock-data.ts` (line 2108) | `mockUsers` array — all demo accounts incl. admin/superadmin | ~50 lines |
| `app/admin/page.tsx` | `seedDummyData()` call on first load populates localStorage with fake registrations/orgs | lines 62-66 |
| `app/login/page.tsx` | Demo credentials block hardcoded in JSX | lines 55-64 |
| `app/page.tsx` | `companies.length`, `campaigns.length` stats displayed as real platform stats | line 60 |
| `components/dynamic-rfi-form.tsx` | `select` field has `<option>Option 1</option>, <option>Option 2</option>` | ~line 135 |
| `lib/admin-store.ts` | Default disclaimer text hardcoded as `const DEFAULT_AGENCY_DISCLAIMER` | lines ~165-195 |
| `app/admin/agencies/page.tsx` | `alert()` for follow-up email | ~line 54 |
| `app/admin/production/page.tsx` | `alert()` for follow-up email | ~line 45 |
| `app/admin/settings/page.tsx` | `alert('Category saved')` | ~line 50 |
| `lib/admin-store.ts` | `getCurrentInternalUserRole()` returns hardcoded `'admin'` | ~line 130 |

---

## 7. Gaps vs. Proposal Requirements

### 7.1 Authentication & Identity
| Requirement | Gap |
|---|---|
| Firebase Authentication with real user accounts | Entirely missing — mock-only auth |
| Role-based access with Firestore user records | Missing — roles stored in localStorage/cookies |
| Password hashing and secure storage | Missing — no password verification at all currently |
| Corporate email enforcement at backend | Client-side only, easily bypassed |
| Invitation system with secure tokens | Mock only — tokens in localStorage |

### 7.2 Data Persistence
| Requirement | Gap |
|---|---|
| Firestore as primary database | No Firebase SDK installed |
| Registration submissions stored in Firestore | Stored in localStorage only (lost on browser clear) |
| Admin actions (approve/reject) persisted | localStorage only |
| RFI field configuration saved server-side | localStorage only |
| Disclaimer content saved server-side | localStorage only |
| File uploads (org charts, certificates) | No upload infrastructure at all — `input[type=file]` stores only filename |

### 7.3 Admin Panel
| Requirement | Gap |
|---|---|
| Real counts from Firestore for stats cards | All seeded from `seedDummyData()` |
| Approve/reject triggers email notification | No email service wired |
| Follow-up email to agency | `alert()` mock only |
| Pagination on all list views | No pagination anywhere |
| Export/download RFI data | No export feature |
| Admin can modify RFI sections and fields | Settings page built but saves to localStorage only |

### 7.4 Registration Forms
| Requirement | Gap |
|---|---|
| Disclaimer step before registration | Not implemented |
| Standardised layout (agency == production) | Production has 13 flat steps, agency has 8 grouped |
| Dynamic sections configurable by admin | Settings exist in UI but no persistence/backend |
| Turnover table: full Excel-like grid | Renders placeholder "Configure Data Table" |
| Knowledge & Competencies with % and subtitles | Percentages mandatory but UI shows basic checkbox |
| Contacts: add multiple entries | Form renders fixed set only |
| File uploads: PDF only | No restriction and no real upload |
| Currency propagation from Step 1 | Not implemented |

### 7.5 Frontend–Backend Wiring
| Requirement | Gap |
|---|---|
| Live directory data from Firestore | Hard-coded `mock-data.ts` |
| Campaign/news/awards from Firestore | Hard-coded `mock-data.ts` |
| Real-time pending count badge in sidebar | `getPendingCount()` from localStorage |
| Profile page editing with approval workflow | No edit-and-resubmit flow built |

---

## 8. Summary — Tech Debt Severity

| Category | Rating |
|---|---|
| No backend whatsoever | 🔴 Critical |
| All data in localStorage (ephemeral) | 🔴 Critical |
| Demo credentials in production login page | 🔴 Critical |
| Entire directory is mock data | 🔴 Critical |
| File uploads not wired | 🔴 Critical |
| Production RFI form does not match spec | 🔴 Critical |
| `ignoreBuildErrors: true` hides bugs | 🟠 High |
| `seedDummyData()` auto-runs in admin | 🟠 High |
| `confirm()` / `alert()` for admin actions | 🟡 Medium |
| Login page style mismatch (#eef0f3 vs #02030E) | 🟢 Low |
