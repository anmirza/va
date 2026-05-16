# Feedback Round 4 — Detailed Implementation Plan

> Prepared after deep analysis of:
> - `feedback/Feedback Round 4.pptx` (8 slides + 5 annotated screenshots)
> - `feedback/Aura_Admin_Panel_Review_Notes_v2.docx` (12 sections, 30-item priority list)
> - Full codebase audit of affected files

---

## Executive Summary

The client has reviewed both the **Client-facing dashboard** and the **Admin panel**. The feedback falls into four categories:

1. **Critical / Pre-go-live blockers** — Brand confusion, exposed demo credentials, account type bugs, and a visible dev API key message. These must be resolved before any client demo.
2. **Data model correctness** — The Add Client Company form has structural flaws: static `Operate As` dropdown, mixed Regional Hub/Region values, wrong Country placeholder, and missing Legal Entity Name + Address Type.
3. **Client dashboard UX** — Missing "Find Your Production Company" CTA; the location filter on the Directory needs to be hierarchical (Region → Country → City).
4. **Admin panel polish** — Terminology inconsistencies across Production, Agencies, Internal Staff, and Users sections; inline Add User form needs to move to modal/drawer; Dashboard missing Client Companies metric card.

---

## Phase 1 — MUST: Critical Blockers (Resolve Before Any Demo)

### 1.1 — Brand Unification

**Problem:** Three different brand names exist simultaneously:
- Login page (`app/login/page.tsx` line ~75): `"Sign in to your Requisti account"`
- Admin panel header (`app/admin/layout.tsx`): renders "VA Consulting" subtitle under "ADMIN PANEL"
- Public site header uses "AURA" / "VA" logo

**Files to change:**
- `app/login/page.tsx` — Update tagline from "Sign in to your Requisti account" → "Sign in to your Aura account"
- `app/admin/layout.tsx` — Confirm the header subtitle "VA Consulting" is intentional for the internal admin-facing view, or unify to "Aura Admin"
- All email copy in mock data / Firestore seeds

**Action:** Decide the single canonical brand name (client indicates final brand is **AURA**). Apply across:
- `app/login/page.tsx` subtitle
- `app/admin/layout.tsx` header subtitle
- Any placeholder/copy text referencing "Requisti"

---

### 1.2 — Remove / Gate Demo Credentials from Login Page

**Problem:** `app/login/page.tsx` exposes hardcoded demo credentials in a visible block on the login page. This is a critical security risk on any publicly-facing environment.

```tsx
// CURRENT (lines ~77-87 in app/login/page.tsx) — REMOVE THIS
<div className="bg-white/[0.03] border ...">
  <p>Demo Credentials</p>
  <p>Vendor: demo@requisti.com / password</p>
  <p>Client: client@requisti.com / password</p>
  <p>Admin: admin@va-consulting.com / password</p>
  <p>Super Admin: superadmin@va-consulting.com / password</p>
</div>
```

**Fix:** Gate this block behind a `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS` env flag:

```tsx
// Replace the demo block with:
{process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === 'true' && (
  <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6 text-sm">
    {/* demo credentials */}
  </div>
)}
```

Set `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true` only in `.env.local` (never in `.env.production`).

---

### 1.3 — Fix Account Type Bug: Super Admin & Admin Show as "Vendor"

**Problem (confirmed visually in image4.png):** In the Users table (`app/admin/users/page.tsx`), Super Admin and Admin users have `accountType = "—"` (blank/undefined), causing them to display with no Account Type. The filter dropdown also only has `Vendor / Client / va-consulting` — it's missing `Internal`.

**Root cause:** When VA Consulting accounts are created (via `createVAInternalUserFS`), `accountType` is not being set to `"internal"` on the Firestore user document.

**Files to change:**
- `lib/admin-firestore.ts` → `createVAInternalUserFS`: ensure it sets `accountType: "internal"` on the user record
- `app/admin/users/page.tsx` — Add `"internal"` to Account Type filter dropdown, and add `"Internal"` to `ROLE_LABELS` / display map
- Any existing seed data / Firestore records for admin/superadmin users needs a one-time migration to set `accountType: "internal"`

---

### 1.4 — Fix Google Maps API Key Dev Message

**Problem (visible in image5.png):** The Add Client Company form displays the raw dev warning:
```
⚠ Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local for autocomplete
```

**File:** `components/google-places-autocomplete.tsx`

**Fix:** Replace the visible dev warning with a silent graceful fallback — show a plain text input without autocomplete if the API key is missing, with no visible error message:

```tsx
// Instead of showing dev warning, silently degrade to plain input
if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  return (
    <input
      type="text"
      placeholder="Enter address..."
      className={inputClassName}
      {...props}
    />
  );
}
```

---

## Phase 2 — MUST: Add Client Company Form Restructure

This is the most structurally significant change. The current form (`app/admin/clients/create/page.tsx`) has multiple issues.

### 2.1 — Rename Section: "Global / Holding Company" → "Geographic & Operating Structure"

**Current code (line ~158):**
```tsx
<h2 className="text-sm font-semibold text-white">Global / Holding Company</h2>
```

**Change to:**
```tsx
<h2 className="text-sm font-semibold text-white">Geographic & Operating Structure</h2>
```

Also rename the CTA button on the client list page:
- `app/admin/clients/page.tsx`: Rename `"Add Company"` → `"Add Client Company"`

---

### 2.2 — Make "Operate As" a Dynamic Form Driver

**Problem:** Currently `operateAs` select does nothing — all fields are always shown. The client requires that required fields change dynamically based on selection.

**Required dynamic field mapping:**

| Operate As | Required Fields |
|---|---|
| `regional_hub` | Parent Company, Regional Hub, Covered Regions (multi-select), Covered Countries (multi-select) |
| `multi_country` | Parent Company, Regional Hub, Region, Covered Countries (multi-select) |
| `country_company` | Parent Company, Regional Hub, Region, Country (single, ISO list), Local Legal Entity Name, Address |

**Implementation approach in `app/admin/clients/create/page.tsx`:**

```tsx
// Add new state for dynamic fields
const [coveredRegions, setCoveredRegions] = useState<string[]>([]);
const [coveredCountries, setCoveredCountries] = useState<string[]>([]);
const [legalEntityName, setLegalEntityName] = useState('');
const [addressType, setAddressType] = useState('');

// Conditional rendering based on operateAs
{operateAs === 'regional_hub' && (
  <>
    <ParentCompanyField />
    <RegionalHubField />
    <CoveredRegionsMultiSelect />
    <CoveredCountriesMultiSelect />
  </>
)}

{operateAs === 'multi_country' && (
  <>
    <ParentCompanyField />
    <RegionalHubField />
    <RegionField />
    <CoveredCountriesMultiSelect />
  </>
)}

{operateAs === 'country_company' && (
  <>
    <ParentCompanyField />
    <RegionalHubField />
    <RegionField />
    <CountryField /> {/* ISO 3166-1 country list only */}
    <LegalEntityNameField />
    <AddressSection />
  </>
)}
```

---

### 2.3 — Split Regional Hub Dropdown into Two Distinct Fields

**Problem:** The current `REGIONAL_HUBS` array mixes operational hubs (EMEA, APAC), geographical regions (Southern Europe, MENA), continents (Africa, Americas), and commercial categories (Emerging Markets, Global Travel Retail). Client says to split into:

- **Regional Hub** (operational scope): EMEA, APAC, Americas, Global, LATAM, MEA, etc.
- **Region** (geographical sub-scope): Southern Europe, MENA, ANZ, Western Europe, etc.

**New arrays in `app/admin/clients/create/page.tsx`:**

```tsx
const REGIONAL_HUB_OPTIONS = [
  "Global",
  "EMEA",
  "Americas",
  "APAC",
  "LATAM",
  "MEA",
  "North America",
  "Other",
];

const REGION_OPTIONS = [
  "Western Europe",
  "Eastern Europe",
  "Central Europe",
  "Northern Europe",
  "Southern Europe",
  "Nordics",
  "DACH",
  "Benelux",
  "Iberia",
  "UK & Ireland",
  "Mediterranean",
  "Middle East",
  "North Africa",
  "Sub-Saharan Africa",
  "East Asia",
  "South Asia",
  "Southeast Asia",
  "Greater China",
  "Japan & Korea",
  "India Subcontinent",
  "ANZ",
  "Oceania",
  "Central America",
  "South America",
  "Caribbean",
  "Other",
];
```

---

### 2.4 — Fix Country Field

**Problem (visible in image5.png):** Country field has placeholder `"e.g. Southern Europe"` — a region, not a country. Must use:
- A controlled dropdown of ISO 3166-1 countries (not free text)
- Placeholder: `"e.g. Italy"`

**Implementation:** Add a `COUNTRIES` constant (ISO 3166-1 alpha-2 list) and render as a `<select>` element:

```tsx
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", /* ... full ISO 3166-1 list ... */
  "United Kingdom", "United States", "Italy", /* ... */
];

// Replace current input with:
<select value={country} onChange={e => setCountry(e.target.value)} className={selectCls}>
  <option value="">Select country... e.g. Italy</option>
  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
</select>
```

---

### 2.5 — Add Separate Fields: Legal Entity Name + Address Type

**New fields to add to the form:**

```tsx
// Legal Entity Name (shown for country_company and multi_country)
<div>
  <label>Legal Entity Name</label>
  <input
    value={legalEntityName}
    onChange={e => setLegalEntityName(e.target.value)}
    placeholder="e.g. Coca-Cola Italia S.p.A."
    className={inputCls}
  />
</div>

// Address Type selector (shown when address is visible)
const ADDRESS_TYPES = [
  "Headquarters",
  "Legal Office",
  "Local Office",
  "Billing",
  "Operational Office",
];

<div>
  <label>Address Type</label>
  <select value={addressType} onChange={e => setAddressType(e.target.value)} className={selectCls}>
    <option value="">Select type...</option>
    {ADDRESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
  </select>
</div>
```

---

### 2.6 — Fix Hierarchy Hint Text

**Current hint (line ~233):**
```
Holding Company → Regional Hub → Region → Local Company → Country → Client
```

**Correct to:**
```
Parent Company → Regional Hub → Region → Country → Local Legal Entity
```

---

### 2.7 — Update Firestore Data Model

**File:** `lib/admin-store.ts` and `lib/admin-firestore.ts`

Add new fields to `ClientCompany` type:

```typescript
export interface ClientCompany {
  id: string;
  name: string;
  legalEntityName?: string;          // NEW
  operateAs?: 'regional_hub' | 'multi_country' | 'country_company';
  holdingCompany?: string;           // = parentCompany
  regionalHub?: string;              // operational hub only (EMEA, APAC...)
  region?: string;                   // geographical region (Southern Europe...)
  coveredRegions?: string[];         // NEW (for regional_hub type)
  coveredCountries?: string[];       // NEW (for regional_hub and multi_country)
  country?: string;                  // ISO country name (country_company only)
  localCompany?: string;
  address?: string;
  addressType?: string;              // NEW: HQ / Legal / Local / Billing / Operational
  tokens: number;
  tokensUsed: number;
  packageSize: number;
  status: 'active' | 'pending' | 'suspended' | 'removed';
  notes?: string;
  // Audit fields (§9.1)
  createdBy?: string;                // NEW
  createdAt: string;
  updatedBy?: string;                // NEW
  updatedAt?: string;                // NEW
}
```

---

## Phase 3 — MUST: Admin Panel Terminology Fixes

### 3.1 — Agencies Section

| Location | Current | Change To |
|---|---|---|
| `app/admin/agencies/page.tsx` header | "Agencies" | "Agencies" (OK — but verify) |
| `app/admin/agencies/page.tsx` CTA button | "Create Agency" | "Add Agency" |
| Agency cards | Missing Category, Country, City | Add these three fields |
| Empty state text | Current | "No agencies registered yet." |

**Agencies card enhancement** — Currently only shows members count + date + status. Add:
```tsx
{org.category && (
  <span className="flex items-center gap-1">
    <Tag className="w-3 h-3" />{org.category}
  </span>
)}
{org.city && (
  <span className="flex items-center gap-1">
    <MapPin className="w-3 h-3" />{org.city}
  </span>
)}
// country already shown
```

---

### 3.2 — Production Section

**File:** `app/admin/production/page.tsx`

| Element | Current | Required |
|---|---|---|
| Page h1 | "Production Companies" | ✓ Already correct |
| Page subtitle | "Manage all registered production houses." | → "Manage and monitor all registered production companies." |
| CTA button | "Create Production Co." | → "Add Production Company" |
| Empty state text | "No production companies registered yet." | ✓ Already correct |
| Link href | `/admin/production/create` | → Also update create page CTA |

Check `app/admin/production/create/page.tsx` for its button text.

---

### 3.3 — Client Management Section

**File:** `app/admin/clients/page.tsx`

| Element | Current | Required |
|---|---|---|
| CTA button | "Add Company" | → "Add Client Company" |
| Page title | (verify) | "Client Management" (OK) |

---

### 3.4 — Internal Staff Section

**File:** `app/admin/internal-users/page.tsx`

| Element | Current | Required |
|---|---|---|
| Page `<h1>` | "Internal Users" | → "Internal Staff" |
| Sidebar nav label | "Internal Staff" | ✓ Already correct (in layout.tsx) |
| System Role options | super_admin, admin, analyst | Add: reviewer, editor, viewer |
| Form location | Inline inside table (noisy) | → Move to modal/drawer |
| Form fields | Name, Email, Role | Add: Status, Department/Function, Internal Notes |

**Extended role options:**
```tsx
<option value="super_admin">Super Admin</option>
<option value="admin">Admin</option>
<option value="reviewer">Reviewer</option>
<option value="editor">Editor</option>
<option value="viewer">Viewer</option>
{/* Keep analyst if it's defined in your system */}
<option value="analyst">Analyst</option>
```

---

## Phase 4 — MUST: Admin Dashboard Enhancement

### 4.1 — Add "Client Companies" Metric Card

**File:** `app/admin/page.tsx`

**Problem:** Dashboard currently has 4 stat cards: Active Agencies, Production Companies, Pending Approvals, Team Members. The client says to add a "Client Companies" card for symmetry.

**Current stats fetch:**
```tsx
const [stats, setStats] = useState({
  totalAgencies: 0,
  totalProduction: 0,
  pendingApprovals: 0,
  totalUsers: 0,
  // ADD:
  totalClients: 0,
  ...
})
```

**Changes needed:**

1. **`lib/admin-firestore.ts`** — `getAdminStatsFS()` must query `clientCompanies` collection and include `totalClients` in return value.

2. **`app/admin/page.tsx`** — Add stat card:
```tsx
// Change grid to 5 columns on xl screens, or wrap to 2 rows
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
  <StatCard label="Active Agencies" ... />
  <StatCard label="Production Companies" ... />
  <StatCard label="Client Companies" value={stats.totalClients} icon={Briefcase} color="bg-emerald-500/10 text-emerald-400" href="/admin/clients" />
  <StatCard label="Pending Approvals" ... />
  <StatCard label="Team Members" ... />
</div>
```

---

### 4.2 — Remove "Create Client Company" from Quick Actions

**Current Quick Actions in `app/admin/page.tsx`:** Review Pending Requests, Create Agency, Create Production Co., Edit Disclaimer Text.

The doc says: "Avoid duplicating 'Create Client Company' here — Client Management remains the single source of truth." The current Quick Actions don't have "Create Client Company" so this is ✓ OK. Keep as-is.

---

## Phase 5 — MUST: Client Dashboard - Add "Find Your Production Company" CTA

### 5.1 — Client Dashboard Quick Actions

**File:** `app/dashboard/page.tsx`

**Problem (Slide 2 / image1.png):** Current dashboard has 4 CTAs in a 2×2 grid. Client wants 5:
1. Find Your Agency ✓
2. **Find Your Production Company** ← MISSING
3. Latest Creative Updates ✓
4. AI Agent ✓
5. Account Settings ✓

**Change the grid layout to accommodate 5 items** (e.g. 2×3 grid or first row 3-column, second row 2-column):

```tsx
{/* Add after Find Your Agency CTA */}
<Link
  href="/production"  // or appropriate route
  className="group glass-card p-5 flex items-start gap-4 hover:border-[#0763d8]/30 transition-all rounded-xl"
>
  <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-lg flex items-center justify-center shrink-0">
    <Film className="w-5 h-5 text-[#7c3aed]" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="font-medium text-white group-hover:text-[#7c3aed] transition-colors">
      Find Your Production Company
    </p>
    <p className="text-xs text-white/30 mt-0.5">
      Discover production houses worldwide
    </p>
  </div>
  <ChevronRight className="w-4 h-4 text-white/10 shrink-0 self-center group-hover:text-[#7c3aed] transition-colors" />
</Link>
```

---

## Phase 6 — MUST: Directory Page — Hierarchical Location Filters

### 6.1 — Replace Flat City Filter with Region → Country → City Cascade

**File:** `app/directory/page.tsx`

**Problem (Slide 3 / image2.png):** Current filter has a flat `City: All Cities` dropdown listing every city in an endless list. Client wants a cascading geographic filter:

```
Region → (select) → Country → (select) → City → (select)
```

**Implementation:**

```tsx
// Replace current selectedCities state with cascading state:
const [selectedRegion, setSelectedRegion] = useState('');
const [selectedCountry, setSelectedCountry] = useState('');
const [selectedCity, setSelectedCity] = useState('');

// Derive available countries from companies filtered by region
const availableCountries = useMemo(() => {
  if (!selectedRegion) return [...new Set(companies.map(c => c.country))].filter(Boolean).sort();
  return [...new Set(companies.filter(c => c.region === selectedRegion).map(c => c.country))].filter(Boolean).sort();
}, [selectedRegion]);

// Derive available cities from companies filtered by country
const availableCities = useMemo(() => {
  const base = selectedCountry
    ? companies.filter(c => c.country === selectedCountry)
    : selectedRegion
    ? companies.filter(c => c.region === selectedRegion)
    : companies;
  return [...new Set(base.map(c => c.city))].filter(Boolean).sort();
}, [selectedRegion, selectedCountry]);

// Filter logic update:
const filteredCompanies = useMemo(() => {
  let results = companies;
  if (selectedRegion) results = results.filter(c => c.region === selectedRegion);
  if (selectedCountry) results = results.filter(c => c.country === selectedCountry);
  if (selectedCity) results = results.filter(c => c.city === selectedCity);
  // ... other filters
}, [selectedRegion, selectedCountry, selectedCity, ...]);
```

**UI — three chained dropdowns:**
```tsx
{/* Region */}
<select value={selectedRegion} onChange={e => { setSelectedRegion(e.target.value); setSelectedCountry(''); setSelectedCity(''); }}>
  <option value="">All Regions</option>
  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
</select>

{/* Country — only enabled after region is selected */}
<select
  value={selectedCountry}
  onChange={e => { setSelectedCountry(e.target.value); setSelectedCity(''); }}
  disabled={!selectedRegion}
>
  <option value="">All Countries</option>
  {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
</select>

{/* City — only enabled after country is selected */}
<select
  value={selectedCity}
  onChange={e => setSelectedCity(e.target.value)}
  disabled={!selectedCountry}
>
  <option value="">All Cities</option>
  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
</select>
```

**Note:** The `companies` mock data in `lib/mock-data.ts` must have `region` and `country` fields on each record for this to work. Audit that file and add these fields.

Also: Multi-select is required for Industries, Cities, and Services (PPTX Slide 3). Consider converting single-select dropdowns to multi-select checkboxes or a multi-select component from `components/ui`.

---

## Phase 7 — SHOULD: Internal Staff — Move Add User to Modal

### 7.1 — Refactor Inline Form to Modal/Drawer

**File:** `app/admin/internal-users/page.tsx`

**Problem:** The Add User form currently expands inline inside the table, which is "visually noisy and inconsistent."

**Implementation:** Use the existing `Dialog` component from `components/ui/dialog` (shadcn/ui):

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// State
const [modalOpen, setModalOpen] = useState(false);

// Trigger
<button onClick={() => setModalOpen(true)} className="...">
  <Plus className="w-4 h-4" /> Add User
</button>

// Modal
<Dialog open={modalOpen} onOpenChange={setModalOpen}>
  <DialogContent className="bg-[#0a0b1a] border border-white/10 max-w-lg">
    <DialogHeader>
      <DialogTitle className="text-white">Add Internal Staff Member</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleAdd} className="space-y-4 mt-4">
      {/* Full Name */}
      {/* Corporate Email */}
      {/* System Role */}
      {/* Status */}
      {/* Department / Function */}
      {/* Internal Notes */}
      <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
        <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
        <button type="submit">Create User</button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

**Extended fields for the modal:**
```tsx
const [newUser, setNewUser] = useState({
  name: '',
  email: '',
  role: 'admin' as 'super_admin' | 'admin' | 'reviewer' | 'editor' | 'viewer' | 'analyst',
  status: 'active',
  department: '',
  notes: '',
});
```

---

## Phase 8 — SHOULD: Global Audit Fields

### 8.1 — Add Audit Fields to All Entities

**Files:** `lib/admin-store.ts`, `lib/admin-firestore.ts`

**Standard audit fields to add to every entity interface:**

```typescript
// Add to OrgRecord, ClientCompany, VAInternalUser, User:
createdBy?: string;    // user ID who created
createdAt: string;     // ISO timestamp
updatedBy?: string;    // user ID who last updated
updatedAt?: string;    // ISO timestamp
```

**In `admin-firestore.ts`**, every create/update function must write these:
```typescript
// On create:
createdBy: adminUserId,
createdAt: new Date().toISOString(),

// On update:
updatedBy: adminUserId,
updatedAt: new Date().toISOString(),
```

---

## Phase 9 — SHOULD: Pending Approvals — Type Filter

### 9.1 — Add Type Filter to Pending Approvals

**File:** `app/admin/pending/page.tsx` (or `app/admin/registrations/`)

**Add a Type filter** once scope is decided:
```tsx
const [typeFilter, setTypeFilter] = useState('all');

<select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
  <option value="all">All Types</option>
  <option value="agency">Agency</option>
  <option value="production">Production Company</option>
  {/* Add these once in scope: */}
  {/* <option value="client">Client</option> */}
  {/* <option value="amendment">Amendment</option> */}
  {/* <option value="access_request">Access Request</option> */}
</select>
```

---

## Phase 10 — SHOULD: Users Page — Account Type Fix

### 10.1 — Fix Account Type Display for Internal Users

**File:** `app/admin/users/page.tsx`

**Problem:** Super Admin and Admin users show `accountType = "—"`. The Account Type filter dropdown is missing `"Internal"`.

**Changes:**
```tsx
// Add to filter select:
<option value="internal">Internal</option>

// Add to display logic — map "internal" accountType to badge:
const ACCOUNT_TYPE_COLORS = {
  vendor: 'bg-white/[0.06] text-white/60',
  client: 'bg-purple-500/10 text-purple-400',
  internal: 'bg-amber-500/10 text-amber-400',  // NEW
};
```

Also add validation to prevent "orphan" users (users without an accountType):
- Block user creation/registration if `accountType` is not set
- Flag existing orphan users (e.g., `test@va.com`) for cleanup

---

## Phase 11 — SHOULD: Status Taxonomy Standardization

### 11.1 — Apply Consistent Status Values Across All Entities

The doc defines a canonical status taxonomy. Verify and align across all admin list pages:

| Status | Meaning | Current State |
|---|---|---|
| `active` | Operational, fully visible | ✓ Used |
| `pending` | Submitted, not yet approved | ✓ Used |
| `invited` | Account created but not activated | ✗ Missing |
| `suspended` | Temporarily disabled, reversible | ✓ Used in users |
| `removed` | Soft-deleted, hidden by default | ✓ Used |
| `rejected` | Approval explicitly denied | ✓ Used |

**Add `invited` status** to the OrgRecord/User status union type in `lib/admin-store.ts`.

---

## Phase 12 — SHOULD: Creative Library / "Get Inspired" Filters

### 12.1 — Align Filters with Directory Guidelines

**File:** `app/creative-library/page.tsx` (or wherever the "Get Inspired" page lives)

**From Slide 4 feedback:** "Ok for these filters, but please follow the same guidelines of the previous chart." The client also notes that metadata for articles and videos (tags, industry, format, etc.) needs to be discussed before implementation.

**Immediate action:** Ensure filter structure uses the same Region → Country → City hierarchical pattern for geographic filters if applicable. Leave article/video metadata for a separate spec session.

---

## Phase 13 — NICE: Roles & Permissions Matrix Implementation

### 13.1 — Implement Role-Based Access Control

**From §10 of the doc:** A full CRUD matrix per role per entity:

| Entity | Super Admin | Admin | Reviewer | Editor | Viewer |
|---|---|---|---|---|---|
| Internal Staff | C/R/U/D | R/U | R | R | R |
| Client Companies | C/R/U/D | C/R/U | R | R/U | R |
| Agencies | C/R/U/D | C/R/U | R/Approve | R/U | R |
| Production Co. | C/R/U/D | C/R/U | R/Approve | R/U | R |
| Pending Approvals | R/Approve/Reject | R/Approve/Reject | R/Approve/Reject | — | R |
| Disclaimer | C/R/U/D/Publish | R/U | R | R/U | R |
| Users | C/R/U/D | R/U | R | R | R |
| Settings & RFI | C/R/U/D | R | — | — | — |

**Implementation:** Create a `lib/permissions.ts` utility:

```typescript
type Role = 'super_admin' | 'admin' | 'reviewer' | 'editor' | 'viewer';
type Entity = 'internal_staff' | 'client_companies' | 'agencies' | 'production' | 'approvals' | 'disclaimer' | 'users' | 'settings';
type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'publish';

const PERMISSIONS: Record<Entity, Record<Role, Action[]>> = {
  agencies: {
    super_admin: ['create', 'read', 'update', 'delete', 'approve'],
    admin: ['create', 'read', 'update', 'approve'],
    reviewer: ['read', 'approve'],
    editor: ['read', 'update'],
    viewer: ['read'],
  },
  // ... etc.
};

export function can(role: Role, entity: Entity, action: Action): boolean {
  return PERMISSIONS[entity]?.[role]?.includes(action) ?? false;
}
```

Use `can()` to conditionally show/hide buttons and protect API routes.

---

## Phase 14 — NICE: Bulk Import/Export

### 14.1 — CSV/Excel Import & Export for Client Companies and Agencies

**Files to create:**
- `app/admin/clients/import/page.tsx` — Import wizard
- `app/api/admin/clients/export/route.ts` — CSV export endpoint
- `app/api/admin/agencies/export/route.ts` — CSV export endpoint

**Implementation pattern for CSV export:**
```typescript
// app/api/admin/clients/export/route.ts
import { NextResponse } from 'next/server';
import { getClientCompaniesFS } from '@/lib/admin-firestore';

export async function GET() {
  const companies = await getClientCompaniesFS();
  const csv = convertToCSV(companies);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="client-companies.csv"',
    },
  });
}
```

---

## Summary: Complete Priority Order

### 🔴 MUST — Blocking (Do These First)

| # | Task | File(s) |
|---|---|---|
| 1 | Fix Account Type: Super Admin/Admin → "Internal" | `lib/admin-firestore.ts`, `app/admin/users/page.tsx` |
| 2 | Gate demo credentials behind ENV flag | `app/login/page.tsx` |
| 3 | Unify brand: "Requisti" → "Aura" on login page | `app/login/page.tsx` |
| 4 | Replace Google Maps dev warning with silent fallback | `components/google-places-autocomplete.tsx` |
| 5 | Rename "Add Agencies" CTA → "Add Agency" | `app/admin/agencies/page.tsx` |
| 6 | Fix Production subtitle and CTA text | `app/admin/production/page.tsx` |
| 7 | Normalize placeholder names (data cleanup) | Firestore seed/data |
| 8 | Rename "Add Company" → "Add Client Company" | `app/admin/clients/page.tsx` |
| 9 | Restructure Add Client form (Geographic & Operating Structure, dynamic Operate As) | `app/admin/clients/create/page.tsx` |
| 10 | Split Regional Hub into Regional Hub + Region | `app/admin/clients/create/page.tsx` |
| 11 | Fix Country field to ISO list only | `app/admin/clients/create/page.tsx` |
| 12 | Add "Find Your Production Company" CTA to Client Dashboard | `app/dashboard/page.tsx` |
| 13 | Directory: Replace flat City filter with Region→Country→City cascade | `app/directory/page.tsx` |

### 🟡 SHOULD — High Value (Do Immediately After MUST)

| # | Task | File(s) |
|---|---|---|
| 14 | Add "Client Companies" metric card to Admin Dashboard | `app/admin/page.tsx`, `lib/admin-firestore.ts` |
| 15 | Move Internal Staff Add User form to modal | `app/admin/internal-users/page.tsx` |
| 16 | Rename "Internal Users" page title → "Internal Staff" | `app/admin/internal-users/page.tsx` |
| 17 | Extend System Roles: add Reviewer, Editor, Viewer | `app/admin/internal-users/page.tsx` |
| 18 | Add audit fields globally (createdBy/At, updatedBy/At) | `lib/admin-store.ts`, `lib/admin-firestore.ts` |
| 19 | Add type filter to Pending Approvals | `app/admin/pending/page.tsx` |
| 20 | Extend agency cards: Category/Type, Country, City | `app/admin/agencies/page.tsx` |
| 21 | Add Legal Entity Name + Address Type to client form | `app/admin/clients/create/page.tsx` |
| 22 | Fix hierarchy hint text | `app/admin/clients/create/page.tsx` |
| 23 | Fix orphan user test@va.com + add accountType validation | `app/admin/users/page.tsx`, `lib/admin-firestore.ts` |
| 24 | Apply "Add [Singular Entity]" naming convention everywhere | All admin pages |

### 🟢 NICE — Enhancements (After Foundation is Stable)

| # | Task | File(s) |
|---|---|---|
| 25 | Roles & Permissions matrix implementation | `lib/permissions.ts`, all admin pages |
| 26 | Bulk import (CSV/Excel) for Client Companies + Agencies | New import pages |
| 27 | Bulk export for all list views | New API routes |
| 28 | Advanced search + filters on all list views | All admin list pages |
| 29 | Notifications + SLA on Pending Approvals | New notification system |
| 30 | Disclaimer version history | `app/admin/disclaimer/page.tsx` |
| 31 | MFA + session timeout + password policy | Auth system |
| 32 | Document data residency per legal entity | Architecture/infra |

---

## Files Modified — Quick Reference

```
app/login/page.tsx                     — Brand fix + gate demo credentials
app/dashboard/page.tsx                 — Add "Find Your Production Company" CTA
app/directory/page.tsx                 — Hierarchical Region→Country→City filter
app/admin/page.tsx                     — Add "Client Companies" metric card
app/admin/layout.tsx                   — (verify brand in header)
app/admin/agencies/page.tsx            — Rename CTA, extend card fields
app/admin/production/page.tsx          — Fix subtitle + CTA text
app/admin/clients/page.tsx             — Rename "Add Company" CTA
app/admin/clients/create/page.tsx      — Full form restructure (Phases 2.1–2.7)
app/admin/internal-users/page.tsx      — Rename title, modal, extended roles/fields
app/admin/users/page.tsx               — Fix Account Type display + filter
app/admin/pending/page.tsx             — Add type filter
components/google-places-autocomplete.tsx  — Silent fallback (no API key warning)
lib/admin-store.ts                     — ClientCompany type + audit fields
lib/admin-firestore.ts                 — createVAInternalUserFS + audit fields + stats
lib/mock-data.ts                       — Add region/country fields to company records
```

---

## Notes for Development Team

1. **Brand Decision is a prerequisite** — The PPTX and doc both point to "Aura" as the final brand. Confirm with the client before changing any brand strings.
2. **ISO Country List** — Use a well-maintained npm package (`country-list`, `i18n-iso-countries`) rather than a hardcoded array to ensure completeness and maintenance.
3. **Multi-select components** — The directory filter needs multi-select for Industries, Cities, and Services. Use the `components/ui/` multi-select if available, or add one (Radix UI `Combobox` is already in the stack via shadcn/ui).
4. **Data model migration** — When adding new fields (`legalEntityName`, `addressType`, `coveredRegions`, etc.) to Firestore, existing records will simply have `undefined` for new fields. No migration script needed — just ensure UI handles `undefined` gracefully.
5. **Token Allocation** — The client flagged this as "On Hold." Do not remove the section; keep it visible with the "On Hold" state but add an internal note about the timeline decision needed.
6. **Test@va.com orphan** — Delete or fix this record in Firestore directly via the Firebase console before the next demo.
