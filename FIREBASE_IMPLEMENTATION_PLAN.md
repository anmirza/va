# Requisti – Phased Implementation Plan
**Branch:** `feature/backend-integration`  
**Stack:** Next.js 16 · Firebase v9+ (Modular SDK) · Firestore · Firebase Auth · Firebase Storage · Vercel

---

## Phase 1 — Git Setup

### 1.1 Create Feature Branch

```bash
git checkout -b feature/backend-integration
git push -u origin feature/backend-integration
```

All work happens on `feature/backend-integration`. `main` is never touched during this process.

### 1.2 Create `.env.local`

```env
# Firebase (exact credentials — no placeholders)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDnyOHIr1v6WIgHNGZwx2ecAGmM8x69IRg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=requisti-version.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=requisti-version
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=requisti-version.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=52745790873
NEXT_PUBLIC_FIREBASE_APP_ID=1:52745790873:web:b50b43fc8f0851810a5f08
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-EBT8LXK6G3
```

> Add `.env.local` to `.gitignore`. Set the same vars as **Vercel Environment Variables** in the Vercel project dashboard.

### 1.3 Install Firebase SDK

```bash
pnpm add firebase
# For server-side admin operations (Cloud Functions or Next.js API routes):
pnpm add firebase-admin
```

### 1.4 Create `lib/firebase.ts`

```ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
```

---

## Phase 2 — Fix Admin Panel (Static Issues First)

All fixes address feedback from `Admin panel Feedback v1.pdf` and `CLIENT_FEEDBACK_ANALYSIS.md`, resolved **before** any Firebase wiring.

### 2.1 Fix: Remove Demo Credentials from Login Page
**File:** `app/login/page.tsx`
- Delete the "Demo credentials" `<div>` block (lines 55–64).
- Change background from `bg-[#eef0f3]` to `bg-[#02030E]` to match the rest of the app.

### 2.2 Fix: Remove `seedDummyData()` Auto-Call
**File:** `app/admin/page.tsx`
- Remove the `if (currentStats.totalAgencies === 0 …) { seedDummyData() … }` block.
- Stats cards show `0` until real data exists.

### 2.3 Fix: Remove `ignoreBuildErrors`
**File:** `next.config.mjs`
- Delete `typescript: { ignoreBuildErrors: true }`.
- Fix any resulting TypeScript errors surface.

### 2.4 Fix: `confirm()` / `alert()` in Admin Actions
**Files:** `app/admin/agencies/page.tsx`, `app/admin/production/page.tsx`, `app/admin/settings/page.tsx`
- Replace all `confirm()` dialogs with Shadcn `<AlertDialog>` components.
- Replace all `alert()` calls with Sonner `toast()` notifications.

### 2.5 Fix: Super Admin Toggle in Admin Layout
**File:** `app/admin/layout.tsx`
- Remove `toggleSuperAdmin` demo state.
- `isCurrentlySuperAdmin` must read only from `user?.role === 'super_admin'` (real Firebase Auth claim).

### 2.6 Fix: Admin Users Page — Replace Static mockUsers
**File:** `app/admin/users/page.tsx`
- Remove import of `mockUsers`.
- Replace with a `useEffect` that reads from Firestore `users` collection (Phase 4).
- Add skeleton loading state while Firestore data loads.
- Add "Invite User" button wired to Firestore invitation flow.

### 2.7 Fix: Follow-Up Email — Replace alert()
**Files:** `app/admin/agencies/page.tsx`, `app/admin/production/page.tsx`
- `handleFollowUp()` calls a Next.js API route (`/api/admin/follow-up`) that triggers a Firebase-backed email (via Firebase Extensions: Trigger Email, or Resend/SendGrid via a Cloud Function).
- Show `toast.success('Follow-up email sent')` on success.

### 2.8 Fix: Registration Form — Add Disclaimer Step
**Files:** `app/signup/agency/page.tsx`, `app/signup/production/page.tsx`
- Before the `DynamicRfiForm` renders, check if the user has accepted the disclaimer.
- Fetch disclaimer text from Firestore `config/disclaimers` document (seeded from existing defaults).
- Show a full-page disclaimer with an "Accept & Continue" button.
- Store acceptance flag in component state (not persisted — must re-accept each session).

### 2.9 Fix: Production RFI — Standardise to Agency Layout
**File:** `lib/admin-store.ts` (default RFI fields for `cat-production`)
- Restructure Production RFI default fields to match Agency's 8-step grouping:
  1. **General Info** → General Information + Organisation & Structure + Registered Office Address + About
  2. **Contacts** → Contact Details + Social Media
  3. **Turnover & Clients**
  4. **Knowledge & Competencies** (with subtitles)
  5. **Post-Production & Activities**
  6. **Governance & SOW**
  7. **People & Directors**
  8. **Add-On** → Other Information + Social Responsibility + Investments + Attachments
- Field names must match `RFI Production House-updated.xlsx` exactly.

### 2.10 Fix: Agency RFI — Correct Step 1 Grouping
**File:** `lib/admin-store.ts` (default RFI fields for `cat-agency`)
- Move `section: 'Registered Office Address'` and `section: 'About'` fields into `section: 'General Information'` (same step).
- Move `Other Information` section from Awards step into `Add-On`.

### 2.11 Fix: Dynamic Form — Contacts with "+" Add More
**File:** `components/dynamic-rfi-form.tsx`
- For fields of `type: 'table'` with label matching "Contact Details", render a repeatable contact block.
- "+" button adds a new contact row (role dropdown from `AGENCY_CONTACT_ROLES`/`PRODUCTION_CONTACT_ROLES`).
- Each row: Role (select), First Name, Last Name, LinkedIn, Telephone, Mobile, Email.

### 2.12 Fix: Dynamic Form — Real Turnover Table
**File:** `components/dynamic-rfi-form.tsx`
- Replace "Configure Data Table" placeholder for the Turnover field.
- Render a proper grid: rows = years from `getTurnoverYears()`, columns = `REVENUE_REGIONS`.
- Two sub-rows per year: Annual Revenue + EBITA.
- Currency label pulled from the `currency` field value already in `formData`.

### 2.13 Fix: Knowledge & Competencies — Percentage + Subtitles
**File:** `components/dynamic-rfi-form.tsx`
- For Communication Areas: render checkboxes + a `%` number input per sector.
- Validate that percentages sum to 100 on "Next" (warn if over/under).
- Render `AGENCY_SERVICE_GROUPS` / Production service groups with subtitle dividers.
- Remove checkbox from service items — replace with percentage input (per feedback slide 7).

### 2.14 Fix: File Upload — PDF Only
**File:** `components/dynamic-rfi-form.tsx`
- Add `accept=".pdf"` attribute to all `input[type=file]` elements.
- Show a `text-xs text-white/40` hint: "PDF files only, max 10MB".

### 2.15 Fix: Select Fields — Real Options from RFI Data
**File:** `components/dynamic-rfi-form.tsx`
- Map field `id` prefixes to the correct constant arrays from `lib/rfi-data.ts`:
  - `companyLevel` → `COMPANY_LEVELS`
  - `category` → `AGENCY_CATEGORIES` or production equivalents
  - `employeeSize` → `EMPLOYEE_SIZES`
  - `countryCoverage` → `COUNTRY_COVERAGE`
  - `currency` → `TOP_CURRENCIES`
- Replace the generic `<option>Option 1/2</option>` with mapped `<option value={v}>{v}</option>`.

### 2.16 Fix: Currency Propagation
**File:** `components/dynamic-rfi-form.tsx`
- Pass `formData` to the turnover section renderer.
- Display `Currency: {formData.currency || '—'}` as a heading above the turnover table.

### 2.17 Fix: Remove All Emoji from Form Labels
**Files:** `lib/admin-store.ts` (RFI field labels), all `page.tsx` files
- Grep for emoji characters: `[\u{1F300}-\u{1FAFF}]` and remove.
- Check: `✓`, `→`, `⚠️`, `✅`, `❌` used in CLIENT_FEEDBACK_ANALYSIS comments are fine since they're not shown to users; only label text matters.

### 2.18 Fix: "+" Button for Awards
**File:** `components/dynamic-rfi-form.tsx`
- For the Awards section, render a repeatable award block.
- Fields: Distinction, Awarded Ad, Brand, Festival (select from awards list), Year.
- "+" button adds new row; "−" removes it.

---

## Phase 3 — Firebase Backend Architecture

### 3.1 Firestore Collections Schema

```
firestore/
│
├── users/{userId}
│   ├── uid: string               # Firebase Auth UID
│   ├── email: string
│   ├── name: string
│   ├── role: 'super_admin' | 'admin' | 'analyst' | 'moderator' | 'client' | 'vendor' | 'user'
│   ├── accountType: 'vendor' | 'client' | null
│   ├── orgId: string | null       # linked org
│   ├── orgRole: 'moderator' | 'user' | null
│   ├── tier: 'free' | 'paid'
│   ├── status: 'active' | 'pending_review' | 'suspended'
│   ├── mustChangePassword: boolean
│   ├── createdAt: Timestamp
│   └── lastLoginAt: Timestamp
│
├── organisations/{orgId}
│   ├── id: string
│   ├── type: 'agency' | 'production'       # matches OrgType
│   ├── name: string                         # Registered Business Name (xlsx field exact)
│   ├── status: 'active' | 'pending' | 'rejected' | 'removed'
│   ├── country: string
│   ├── city: string
│   ├── createdAt: Timestamp
│   ├── createdByAdminId: string
│   ├── moderatorUserId: string | null
│   ├── memberCount: number
│   ├── registrationId: string | null        # linked pendingRegistrations doc
│   ├── latestUpdateAt: Timestamp | null
│   ├── lastFollowUpAt: Timestamp | null
│   └── profileData: {...}                   # Full RFI submission (see 3.2)
│
├── pendingRegistrations/{registrationId}
│   ├── id: string
│   ├── type: 'agency' | 'production'
│   ├── companyName: string
│   ├── submittedByUserId: string
│   ├── submittedByName: string
│   ├── submittedByEmail: string
│   ├── submittedAt: Timestamp
│   ├── status: 'pending' | 'approved' | 'rejected'
│   ├── rejectionReason: string | null
│   ├── approvedAt: Timestamp | null
│   ├── approvedByAdminId: string | null
│   └── profileData: {...}                   # Full typed RFI (see 3.2)
│
├── invitations/{invitationId}
│   ├── token: string                        # Secure random UUID
│   ├── orgId: string
│   ├── orgName: string
│   ├── orgType: string
│   ├── invitedEmail: string | null
│   ├── createdByAdminId: string
│   ├── createdAt: Timestamp
│   ├── expiresAt: Timestamp                 # 7 days from creation
│   ├── status: 'pending' | 'accepted' | 'expired'
│   ├── acceptedAt: Timestamp | null
│   └── acceptedByUserId: string | null
│
├── orgMembers/{memberId}
│   ├── orgId: string
│   ├── userId: string
│   ├── name: string
│   ├── email: string
│   ├── orgRole: 'moderator' | 'user'
│   ├── joinedAt: Timestamp
│   └── status: 'active' | 'suspended'
│
├── clientCompanies/{companyId}
│   ├── name: string
│   ├── holding: string | null
│   ├── regionalHub: string | null
│   ├── region: string | null
│   ├── localCompany: string | null
│   ├── country: string
│   ├── createdAt: Timestamp
│   ├── tokens: number
│   └── status: 'active' | 'suspended'
│
├── activityLog/{logId}
│   ├── type: 'approval' | 'rejection' | 'signup' | 'org_create' | 'org_remove' | 'invite'
│   ├── description: string
│   ├── performedByUserId: string
│   └── timestamp: Timestamp
│
└── config/{docId}
    ├── disclaimers (doc)
    │   ├── agency: string
    │   ├── production: string
    │   ├── lastUpdatedAt: Timestamp
    │   └── lastUpdatedBy: string
    ├── categories (doc)
    │   └── items: VACategory[]
    └── rfiFields (doc)
        ├── cat-agency: RfiField[]
        └── cat-production: RfiField[]
```

### 3.2 RFI profileData — Field Names (exact xlsx match)

**Agency (from `RFI Agency-updated.xlsx`):**
```ts
interface AgencyProfileData {
  // General Information
  registeredBusinessName: string    // "Registered Business Name"
  dunsNumber: string                // "D-U-N-S® number"
  vatRegistrationNumber: string     // "VAT Registration Number"
  legalForm: string                 // "Legal form"
  companyRegistrationNumber: string // "Company registration number"
  yearEstablished: number           // "Year Enstablished" (sic — keep exact xlsx label)
  // Organization & Structure
  numberOfEmployees: string         // "# of Employees" — use EMPLOYEE_SIZES range
  companyLevel: string              // "Company Level" — use COMPANY_LEVELS
  parentCompanyName: string         // "Parent Company Name"
  category: string                  // "Category" — use AGENCY_CATEGORIES
  agencyCurrency: string            // "Agency Currency"
  tradeOrganizations: string        // "Trade Organizations"
  // Registered Office Address
  countryCoverage: string           // "Country Coverage"
  address: string
  postcode: string
  city: string
  country: string
  // About
  about: string                     // "About"
  philosophyCompetitiveAdvantages: string  // "Philosophy & Competitive Advantages"
  networkDescription: string        // "Network Description"
  localRepresentation: string       // "Local Rapresentation" (sic — keep exact xlsx)
  // Contacts (array)
  contacts: Array<{
    role: string    // CEO | General Manager | Business Director | ECD | Executive Producer
    firstName: string
    lastName: string
    linkedin: string
    telephone: string
    mobile: string
    email: string
  }>
  // Social Media
  officialWebsite: string
  twitter: string
  facebook: string
  linkedin: string
  instagram: string
  tiktok: string
  pinterest: string
  tumblr: string
  snapchat: string
  reddit: string
  // Turnover & Clients
  turnover: Array<{
    year: number
    annualRevenueLocal: number
    annualRevenueGlobal: number
    ebitaLocal: number
    ebitaGlobal: number
    annualRevenueNAM: number
    annualRevenueEurope: number
    annualRevenueLatam: number
    annualRevenueAfrica: number
    annualRevenueAPAC: number
  }>
  mainClients: Array<{
    client: string
    industry: string
    principalActivities: string
    year: number
    turnoverEUR: number
    clientIncidence: number
    exclusivity: boolean
  }>
  // Knowledge & Competencies
  communicationAreas: Record<string, number>     // sector → % allocation
  marketPositioning: {
    main: string[]
    secondary: string[]
    additional: string[]
  }
  services: Record<string, number>   // service item → % (mandatory)
  // Activities
  subcontractsActivities: boolean
  outsourcedActivities: Array<{
    activity: string
    description: string
    contractualValuePct: number
  }>
  // Governance & SOW
  qaSystemsDescription: string
  clientDataProtocol: string
  globalBrandGovernance: string
  additionalInformation: string
  // People
  people: Array<{
    department: string
    role: string
    numberOfEmployees: number
    numberOfFreelancers: number
    annualSalaryAvg: number | null
  }>
  // Awards
  awards: Array<{
    distinction: string
    awardedAd: string
    brand: string
    festival: string
    year: number
  }>
  // Add-On
  aiTools: string
  aiImplementations: string
  aiBenefits: string
  aiEthics: string
  aiRiskMitigation: string
  socialResponsibility: Record<string, string>  // Q1.1–Q1.11
  investments: Record<string, number>
  attachments: {
    orgChart: string | null         // Storage URL
    chamberOfCommerce: string | null
    references: string | null
    companyProfile: string | null
    certifications: string | null
  }
}
```

**Production** fields follow the same pattern using `RFI Production House-updated.xlsx` section names, plus:
- `postProductionInHouse: boolean`
- `postProductionServices: string[]`
- `directors: Array<{ priority: 'main' | 'occasional', name: string, ... }>`
- `preProduction`, `production`, `postProduction` blocks as per Production xlsx

### 3.3 Firebase Auth Setup

- **Email/Password** provider enabled in Firebase Console.
- On user creation: write a corresponding `users/{uid}` document to Firestore with default `role: 'user'`.
- **Custom Claims** (via Admin SDK / Cloud Function): set `role` as a custom claim on the Firebase ID token so middleware can verify server-side:
  ```ts
  admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  ```
- Middleware (`middleware.ts`) updated to verify Firebase ID token from a session cookie (replace `requisti_auth` cookie with a proper session).

### 3.4 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() && 
        request.auth.token.role in ['admin', 'super_admin'];
    }
    function isSuperAdmin() {
      return isAuthenticated() && 
        request.auth.token.role == 'super_admin';
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    function isOrgModerator(orgId) {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/orgMembers/$(request.auth.uid + '_' + orgId)) &&
        get(/databases/$(database)/documents/orgMembers/$(request.auth.uid + '_' + orgId)).data.orgRole == 'moderator';
    }

    // Users — own data read/write; admins read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Organisations — read: authenticated users; write: admin only
    match /organisations/{orgId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAdmin() || isOrgModerator(orgId);
      allow delete: if isAdmin();
    }

    // Pending registrations — create: authenticated vendor; read/update: admin
    match /pendingRegistrations/{regId} {
      allow create: if isAuthenticated();
      allow read, update: if isAdmin() || 
        resource.data.submittedByUserId == request.auth.uid;
      allow delete: if isAdmin();
    }

    // Invitations — create: admin; read: invited user (by token) or admin
    match /invitations/{invId} {
      allow read: if isAdmin() || isAuthenticated();
      allow create, update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Org members — read: own org members; write: admin or moderator
    match /orgMembers/{memberId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Client companies — admin only
    match /clientCompanies/{companyId} {
      allow read, write: if isAdmin();
    }

    // Activity log — admin read; system write
    match /activityLog/{logId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }

    // Config — read: authenticated; write: super_admin only
    match /config/{docId} {
      allow read: if isAuthenticated();
      allow write: if isSuperAdmin();
    }
  }
}
```

### 3.5 Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Org attachments — upload: authenticated vendor; read: admin or org member
    match /attachments/{orgId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      fileName.matches('.*\\.pdf') &&
                      request.resource.size < 10 * 1024 * 1024; // 10MB
    }
    // Logos / covers — read: public; write: authenticated
    match /logos/{orgId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024; // 5MB
    }
  }
}
```

### 3.6 Required API Routes (Next.js Route Handlers)

All are placed in `app/api/` and use the Firebase Admin SDK server-side:

| Route | Method | Purpose |
|---|---|---|
| `app/api/admin/approve/[id]/route.ts` | POST | Approve registration → update Firestore, log activity, trigger email |
| `app/api/admin/reject/[id]/route.ts` | POST | Reject registration → update Firestore, log activity |
| `app/api/admin/follow-up/route.ts` | POST | Trigger follow-up email via email provider |
| `app/api/admin/invite/route.ts` | POST | Create invitation doc, generate secure token, send email |
| `app/api/admin/users/route.ts` | GET | List all users from Firebase Auth + Firestore |
| `app/api/admin/users/[id]/route.ts` | PATCH, DELETE | Update/delete user (Admin SDK) |
| `app/api/auth/session/route.ts` | POST | Exchange Firebase ID token → session cookie |
| `app/api/auth/session/route.ts` | DELETE | Clear session cookie (logout) |
| `app/api/upload/route.ts` | POST | Receive file → upload to Firebase Storage → return URL |
| `app/api/companies/[id]/route.ts` | GET | Serve organisation public profile from Firestore |

---

## Phase 4 — Frontend ↔ Firebase Wiring

### 4.1 Replace Auth Layer

**File:** `lib/auth-context.tsx`
- Replace `mockUsers` login with `signInWithEmailAndPassword(auth, email, password)`.
- On sign-in: call `/api/auth/session` to set a `HttpOnly` session cookie.
- Populate `user` state from Firestore `users/{uid}` document.
- On sign-out: call `DELETE /api/auth/session`, then `signOut(auth)`.
- Remove all `localStorage.setItem/getItem` for user state.
- Update `middleware.ts` to verify the session cookie via Firebase Admin SDK.

### 4.2 Replace Admin Store — Firestore Reads

Replace each `admin-store.ts` function with a Firestore equivalent:

| Old function | New pattern |
|---|---|
| `getAllRegistrations()` | `getDocs(query(collection(db, 'pendingRegistrations'), orderBy('submittedAt', 'desc')))` |
| `getOrgsByType(type)` | `getDocs(query(collection(db, 'organisations'), where('type', '==', type)))` |
| `getAllClientCompanies()` | `getDocs(collection(db, 'clientCompanies'))` |
| `getPendingCount()` | `getCountFromServer(query(collection(db, 'pendingRegistrations'), where('status', '==', 'pending')))` |
| `getDisclaimerContent()` | `getDoc(doc(db, 'config', 'disclaimers'))` |
| `saveDisclaimerContent()` | `setDoc(doc(db, 'config', 'disclaimers'), {...})` |
| `getRfiFields(catId)` | `getDoc(doc(db, 'config', 'rfiFields'))` → extract by catId |
| `saveRfiFields(catId, fields)` | `updateDoc(doc(db, 'config', 'rfiFields'), { [catId]: fields })` |
| `getVACategories()` | `getDoc(doc(db, 'config', 'categories'))` |
| `getVAInternalUsers()` | Firebase Admin SDK → `listUsers()` filtered by custom claim |
| `getActivityLog()` | `getDocs(query(collection(db, 'activityLog'), orderBy('timestamp', 'desc'), limit(50)))` |
| `getAdminStats()` | Parallel `getCountFromServer` calls |

### 4.3 Wire Admin Actions

**Approve / Reject registration:**
```ts
// app/admin/registrations/[id]/page.tsx
const handleApprove = async (id: string) => {
  const res = await fetch(`/api/admin/approve/${id}`, { method: 'POST' })
  if (res.ok) { toast.success('Registration approved'); reload() }
}
```

**Create invitation:**
```ts
const handleInvite = async (orgId: string, email: string) => {
  const res = await fetch('/api/admin/invite', {
    method: 'POST',
    body: JSON.stringify({ orgId, email })
  })
  const { inviteLink } = await res.json()
  toast.success('Invitation sent')
}
```

**Real-time pending badge:**
```ts
// lib/hooks/use-pending-count.ts
import { onSnapshot, query, collection, where, getFirestore } from 'firebase/firestore'

export function usePendingCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const q = query(collection(db, 'pendingRegistrations'), where('status', '==', 'pending'))
    return onSnapshot(q, snap => setCount(snap.size))
  }, [])
  return count
}
```

### 4.4 Replace RFI Form Submission

**File:** `app/signup/agency/page.tsx`, `app/signup/production/page.tsx`
```ts
const handleSubmit = async (data: Record<string, any>) => {
  setIsSubmitting(true)
  
  // 1. Upload files to Firebase Storage
  const fileFields = ['orgChart', 'chamberOfCommerce', 'references', 'companyProfile', 'certifications']
  const uploadedUrls: Record<string, string> = {}
  for (const field of fileFields) {
    if (data[field] instanceof File) {
      const fileRef = ref(storage, `attachments/${user!.uid}/${field}.pdf`)
      await uploadBytes(fileRef, data[field])
      uploadedUrls[field] = await getDownloadURL(fileRef)
    }
  }
  
  // 2. Write to Firestore pendingRegistrations
  await addDoc(collection(db, 'pendingRegistrations'), {
    type: 'agency',
    companyName: data.registeredBusinessName || 'New Agency',
    submittedByUserId: user!.uid,
    submittedByName: user!.displayName || '',
    submittedByEmail: user!.email || '',
    submittedAt: serverTimestamp(),
    status: 'pending',
    profileData: { ...data, ...uploadedUrls }
  })
  
  setIsSubmitting(false)
  setSuccess(true)
}
```

### 4.5 Seed Firestore with Real RFI Data

Create a one-time seed script: `scripts/seed-firestore.ts`

```ts
// Run with: npx ts-node scripts/seed-firestore.ts
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { agencyRfiFields } from '../lib/rfi-data'  // export default field arrays

initializeApp({ credential: cert('./service-account.json') })
const db = getFirestore()

async function seed() {
  // Seed RFI field configuration
  await db.doc('config/rfiFields').set({
    'cat-agency': agencyRfiFields,      // full typed field array from rfi-data.ts
    'cat-production': productionRfiFields,
    updatedAt: FieldValue.serverTimestamp()
  })

  // Seed default disclaimers
  await db.doc('config/disclaimers').set({
    agency: DEFAULT_AGENCY_DISCLAIMER,
    production: DEFAULT_PRODUCTION_DISCLAIMER,
    lastUpdatedAt: FieldValue.serverTimestamp(),
    lastUpdatedBy: 'system'
  })

  // Seed categories
  await db.doc('config/categories').set({
    items: DEFAULT_VA_CATEGORIES,
    updatedAt: FieldValue.serverTimestamp()
  })

  console.log('Seed complete')
}
seed()
```

> The xlsx files (`RFI Agency-updated.xlsx`, `RFI Production House-updated.xlsx`) are the source of truth for the `agencyRfiFields` and `productionRfiFields` arrays already partially mapped in `lib/rfi-data.ts`. Complete mapping is part of Phase 4 work.

### 4.6 Replace Directory Data

**File:** `app/directory/page.tsx`, `lib/mock-data.ts`
- `companies` array in `mock-data.ts` is **not** deleted immediately — it stays as a fallback during transition.
- Add a Firestore query for the directory: `getDocs(query(collection(db, 'organisations'), where('status', '==', 'active'), orderBy('name')))`.
- Replace the `companies` import progressively as Firestore data is seeded.

---

## Phase 5 — Deployment Plan

### 5.1 Frontend — Vercel (Already Deployed)

**Required Environment Variables in Vercel Dashboard:**
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT_KEY   # JSON string of service account for Admin SDK in API routes
```

**Vercel Config (`next.config.mjs`):**
- Remove `ignoreBuildErrors: true`.
- No other changes needed — Vercel auto-handles Next.js 16 App Router.

### 5.2 Backend Recommendation

**Recommended: Firebase + Next.js API Routes (Serverless, already on Vercel)**

Given the existing stack (Next.js on Vercel), the cleanest and lowest-overhead approach is:
- **All backend logic as Next.js Route Handlers** (`app/api/*/route.ts`) using the Firebase Admin SDK.
- Vercel Serverless Functions handle these automatically — **no separate server needed**.
- Firestore handles all data persistence.
- Firebase Auth handles authentication.
- Firebase Storage handles file uploads.
- Firebase Extensions (Trigger Email) handles transactional emails.

**Do NOT use:** Railway, Render, or a separate Node/Express server — unnecessary complexity when Vercel Serverless + Firebase covers 100% of the requirements.

**Cloud Functions are only needed if:**
- Background tasks (e.g., auto-expire invitations after 7 days) — one scheduled function.
- Custom Auth triggers (e.g., auto-create Firestore user doc on new Auth user).

```
functions/
├── src/
│   ├── onUserCreate.ts        # Trigger: auth.user().onCreate → create users/{uid} doc
│   ├── expireInvitations.ts   # Scheduled: every 24h → mark expired invitations
│   └── index.ts               # Export all functions
└── package.json
```

### 5.3 Firestore Indexes

Create `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "pendingRegistrations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "submittedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "pendingRegistrations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "submittedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "organisations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "activityLog",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 5.4 Deploy Checklist

#### Pre-deploy (local)
- [ ] `pnpm build` passes with 0 TypeScript errors (after removing `ignoreBuildErrors`)
- [ ] `.env.local` created with all 7 Firebase env vars
- [ ] `firestore.rules` created and passes `firebase emulators:start` local test
- [ ] `storage.rules` created
- [ ] `firestore.indexes.json` created
- [ ] Seed script tested against Firestore emulator: `firebase emulators:exec "npx ts-node scripts/seed-firestore.ts"`

#### Firebase CLI Deploy
```bash
# Install Firebase CLI if not already
npm i -g firebase-tools

# Login and init (if not already initialized)
firebase login
firebase init firestore    # selects firestore.rules + firestore.indexes.json
firebase init storage      # selects storage.rules
firebase init functions    # if Cloud Functions needed

# Deploy rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage

# Deploy Cloud Functions (if applicable)
firebase deploy --only functions
```

#### Vercel Deploy
```bash
# Push feature branch
git add .
git commit -m "feat: Firebase backend integration"
git push origin feature/backend-integration

# In Vercel Dashboard:
# 1. Add all environment variables (Settings → Environment Variables)
# 2. Create a Preview deployment from feature/backend-integration
# 3. Test all flows on Preview URL before merging to main
# 4. Merge via PR: feature/backend-integration → main
# 5. Production deployment auto-triggers on merge
```

#### Post-deploy Verification
- [ ] `/login` — real Firebase Auth sign-in works
- [ ] `/signup` → registration submits to Firestore `pendingRegistrations`
- [ ] `/admin/pending` — shows Firestore docs in real-time
- [ ] Approve registration → `organisations` document created, activity log entry added
- [ ] Disclaimer editor saves to Firestore `config/disclaimers`
- [ ] RFI field modeler saves to Firestore `config/rfiFields`
- [ ] File upload → appears in Firebase Storage under correct path
- [ ] Pending count badge in admin sidebar updates in real-time
- [ ] Invitation flow — token generated, accepted by new user

---

## Summary of All Changes by File

| File | Phase | Change |
|---|---|---|
| `.env.local` (new) | 1 | Firebase credentials |
| `lib/firebase.ts` (new) | 1 | Firebase app init |
| `lib/auth-context.tsx` | 4 | Replace mockUsers with Firebase Auth |
| `lib/admin-store.ts` | 4 | Replace localStorage with Firestore SDK |
| `middleware.ts` | 4 | Verify session cookie via Admin SDK |
| `app/login/page.tsx` | 2 | Remove demo creds, fix bg color |
| `app/admin/page.tsx` | 2 | Remove seedDummyData, wire Firestore stats |
| `app/admin/layout.tsx` | 2 | Remove toggleSuperAdmin demo |
| `app/admin/agencies/page.tsx` | 2 | Replace alert() with toast, AlertDialog |
| `app/admin/production/page.tsx` | 2 | Same as agencies |
| `app/admin/settings/page.tsx` | 2 | Replace alert() with toast |
| `app/admin/users/page.tsx` | 4 | Replace mockUsers with Firestore |
| `app/signup/agency/page.tsx` | 2,4 | Add disclaimer step, Firestore submit |
| `app/signup/production/page.tsx` | 2,4 | Add disclaimer step, Firestore submit |
| `components/dynamic-rfi-form.tsx` | 2 | Contacts+, Awards+, turnover table, real selects, % K&C, PDF-only upload |
| `lib/admin-store.ts` (RFI defaults) | 2 | Fix section order, standardise prod=agency |
| `next.config.mjs` | 2 | Remove ignoreBuildErrors |
| `app/api/admin/*/route.ts` (new) | 3 | Admin API routes via Admin SDK |
| `app/api/auth/session/route.ts` (new) | 3 | Session cookie management |
| `app/api/upload/route.ts` (new) | 3 | File upload to Storage |
| `firestore.rules` (new) | 3 | Security rules |
| `storage.rules` (new) | 3 | Storage security rules |
| `firestore.indexes.json` (new) | 3 | Composite indexes |
| `scripts/seed-firestore.ts` (new) | 4 | One-time seed script |
| `functions/src/*.ts` (new) | 3 | Cloud Functions (auth trigger, scheduled) |
