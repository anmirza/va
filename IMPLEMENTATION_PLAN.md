# Client Feedback v4 – Implementation Plan

This document consolidates and analyzes all client feedback from **Creative Feedback_v4.pptx** and **Feedback v4.docx**, and provides a structured implementation plan to address the requested changes.

> **See also:** `CLIENT_FEEDBACK_ANALYSIS.md` for a detailed analysis that prioritizes client requirements, compares RFI Agency/Production structure with the current implementation, and includes the target step structure. **Client requirements always take precedence** over RFI structure when they conflict.

---

## Executive Summary

The client has provided detailed feedback across three main areas:
1. **Sign-up & Registration Flow** – Clarifications and UX improvements
2. **Agency Registration** – Section ordering, layout, and content fixes
3. **Production Company Registration** – Alignment with Agency layout, section fixes, and new requirements

A recurring theme is **standardizing both registration forms** using the Agency layout as the reference, and ensuring SUPER ADMIN/ADMIN can fully configure registration sections and fields.

---

## Part 1: Feedback Analysis

### 1.1 Sign-Up Flow (BY SUPER ADMIN / ADMIN)

**Current Understanding (from Feedback v4.docx):**
- SUPER ADMIN/ADMIN users are registered using corporate emails and have individual profiles with database management permissions.
- SUPER ADMIN/ADMIN can create agencies or production companies.
- Once created, they must **invite** the first user to register as MODERATOR.
- The MODERATOR assumes ownership and can add team members (as MODERATOR or standard users).
- SUPER ADMIN/ADMIN can remove agencies and production companies; MODERATOR/USER cannot.

**Issue Identified:**
> "This is where the first issue arises: if I click on SIGN UP, I am prompted to register an agency, production company, or client."

**Expected Flow:**
- Users should **first** register with corporate email and password.
- After registration and approval, they access their homepage.
- On the homepage, they **declare** themselves as agency, production company, or client.
- Once registered and company is created, they can invite/add other members to their organisation.

**Status:** The current app flow (signup → classify → dashboard) appears aligned with this. The client may be referring to a different screen or an older version. **Verify** the actual SIGN UP entry point and ensure it does not immediately ask for agency/production/client choice before basic registration.

---

### 1.2 Before Agency or Production Company Registration

**New Requirement:**
- Before joining the registration steps, the first page must be a **disclaimer** (intro page + legal disclaimer).
- The disclaimer should state that terms are still being finalised.
- SUPER ADMIN/ADMIN must be able to **add and/or amend** this disclaimer content.

**Implementation:** Add a configurable intro/disclaimer step before the first registration step. Store content in a format editable by SUPER ADMIN/ADMIN.

---

### 1.3 Agency Registration – Section Order & Status

The client provided a detailed table of steps/sections and their status. Below is the consolidated view.

#### Sections marked **MISSED → move here** (reorder/relocate)

| Step              | Section                 | Current Status | Action                                      |
|-------------------|-------------------------|----------------|---------------------------------------------|
| General Info      | Registered Office Address| MISSED         | Move to correct position in General Info    |
| General Info      | About                   | MISSED         | Move to correct position in General Info    |
| Add-On            | Other information       | MISSED         | Move to correct position in Add-On          |

#### Sections marked **OK** (no change)

- General Information
- Organization & Structure
- Contact Details
- Social Media
- Turnover & Clients
- Knowledge & Competencies
- Governance & SOW
- People & Talent
- Award
- Social Responsibility (under Add-On)
- Investments (under Add-On)
- Attachments (under Add-On)

---

### 1.4 Production Company Registration – Section Order & Status

#### Sections marked **MISSED → move here**

| Step              | Section                 | Action                                      |
|-------------------|-------------------------|---------------------------------------------|
| General Info      | Organization & Structure| Move to correct position                    |
| General Info      | Registered Office Address| Move to correct position                   |
| General Info      | About                   | Move to correct position                    |
| Contacts          | Contact Details         | Move to correct position                    |
| Contacts          | Social Media            | Move to correct position                    |
| Add-On            | Other information       | Move to correct position                    |
| Add-On            | Social Responsibility   | Move to correct position                    |
| Add-On            | Investments             | Move to correct position                    |
| Add-On            | Attachments             | Move to correct position                    |

#### Sections marked **Fix**

| Section                 | Status   | Action                                                                 |
|-------------------------|---------|------------------------------------------------------------------------|
| Turnover & Clients       | OK→Fix  | Align with Agency layout (same structure as agency)                    |
| Knowledge & Competencies | NO→Fix  | Use subtitles for structure                                            |
| Post Production         | Fix     | Same layout as Agency equivalent                                       |
| Activities              | Fix     | Same layout as Agency equivalent                                       |
| Governance & SOW         | MISSED  | Add/move to correct position                                            |

---

### 1.5 Creative Feedback (PowerPoint) – Key Points

#### Slide 2 – Functional Requirements
- **Super Admin must be able to:** Modify fields within registration sections and/or add new stages with additional sections.
- **Turnover & Clients:** Years must update **automatically**. Require a 5-year historical view (e.g. 2026 → 2025, 2024, 2023, 2022, 2021; 2027 → 2026, 2025, 2024, 2023, 2022).
- **Profile review:** When a user completes registration, the profile must undergo review before publication. Final approval and publication must be granted by the client.
- **Email restriction:** Users must not be allowed to register with personal email addresses. Implement restriction to accept only corporate domains.

#### Slide 3 – Visual/UX Feedback
- **PLEASE STANDARDISE THE SAME LAYOUT FOR BOTH REGISTRATION FORMS USING THE AGENCY ONE**
- **Remove all emoticons** – Keep a corporate layout and look & feel.
- **Use "infos" from list menu in RFI** – Suggests using predefined options/lists from the RFI specification for certain fields.

#### Slide 4 – Production-Specific
- **PLEASE STANDARDISE THE SAME LAYOUT FOR BOTH REGISTRATION FORMS USING THE AGENCY ONE** (repeated)
- **Use agency look & feel** but with the **same size of production cells** (Turnover section).
- **Currency** is already set up from Step 1 (Organization & Structure → Agency Currency) – ensure it flows through.
- **"Too small"** – Some production form cells are too small; **"Good size and space"** – Reference the correct sizing from another section.

---

### 1.6 Relevant Point (Feedback v4.docx)

**SUPER ADMIN / ADMIN must be able to:**
1. **Pre-set** all sections with pre-set modules.
2. **Add, amend, or remove** steps/sections.

This implies a configurable registration builder in the admin panel.

---

### 1.7 Client Registration

**Current state:** No specific RFI for clients yet.

**Suggestion:** Client registration should be **simplified** with:
- General Information
- Organization & Structure
- Registered Office Address

---

## Part 2: Implementation Plan

### Phase 1: Sign-Up & Access Control (Priority: High)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 1.1 | Verify sign-up flow | Ensure SIGN UP leads to: (1) email/password registration, (2) classify, (3) dashboard. No premature agency/production/client choice. | S |
| 1.2 | Corporate email enforcement | Confirm personal domains are blocked (Gmail, Yahoo, etc.). Already implemented in `app/signup/page.tsx` – verify completeness. | S |
| 1.3 | Profile review before publication | Implement review workflow: submitted profiles require admin approval before being published/visible. | M |

---

### Phase 2: Pre-Registration Disclaimer (Priority: High)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 2.1 | Add disclaimer step | Add first page before registration steps: intro + legal disclaimer (configurable text). | M |
| 2.2 | Admin-editable disclaimer | Allow SUPER ADMIN/ADMIN to add/amend disclaimer content via settings or CMS. | M |

---

### Phase 3: Agency Registration – Section Order & Content (Priority: High)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 3.1 | Reorder General Information | Ensure order: General Information → Organization & Structure → Registered Office Address → About. | M |
| 3.2 | Reorder Add-On | Ensure Add-On includes: Other information, Social Responsibility, Investments, Attachments in correct order. | S |
| 3.3 | Turnover & Clients – auto years | Implement automatic 5-year rolling window (current year -1 to -5). | M |
| 3.4 | Use RFI list options | Where applicable, use "infos from list menu in RFI" for dropdowns/selects. | M |

---

### Phase 4: Production Company Registration – Standardisation (Priority: High)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 4.1 | Standardise layout with Agency | Use Agency registration layout as template. Same structure, sections, and visual hierarchy. | L |
| 4.2 | Reorder sections | Apply same section order as Agency (General Info, Contacts, Add-On structure). | M |
| 4.3 | Fix Knowledge & Competencies | Add subtitles for structure (Production-specific sub-sections). | M |
| 4.4 | Fix Post Production & Activities | Align layout with Agency equivalent sections. | M |
| 4.5 | Add Governance & SOW | Ensure Governance & SOW is present and correctly placed. | S |
| 4.6 | Turnover & Clients – sizing | Use same cell sizes as Agency; ensure currency from Step 1 flows through. | M |
| 4.7 | Fix "Too small" cells | Identify and resize production form cells to match "Good size and space" reference. | S |

---

### Phase 5: UI/UX – Corporate Look & Feel (Priority: Medium)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 5.1 | Remove emoticons | Audit all registration forms and remove any emoticons. Maintain corporate layout. | S |
| 5.2 | Consistent styling | Ensure Agency and Production forms share identical styling (spacing, typography, borders). | M |

---

### Phase 6: Admin Configuration (Priority: Medium)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 6.1 | Pre-set modules | Allow SUPER ADMIN to pre-set sections with pre-set modules. | L |
| 6.2 | Add/amend/remove steps | Build admin UI to add, amend, or remove registration steps/sections. | L |
| 6.3 | Field-level configuration | Allow modification of fields within sections (add, remove, reorder). | L |

---

### Phase 7: Client Registration (Priority: Low)

| # | Task | Description | Effort |
|---|------|-------------|--------|
| 7.1 | Simplified client RFI | Create simplified client registration: General Information, Organization & Structure, Registered Office Address. | M |

---

## Part 3: Recommended Execution Order

1. **Phase 1** – Ensure sign-up flow and email validation are correct.
2. **Phase 2** – Add disclaimer step (required before any registration).
3. **Phase 4.1 + 4.2** – Standardise Production layout with Agency (foundation for other fixes).
4. **Phase 3** – Agency section reordering and Turnover auto-years.
5. **Phase 4.3–4.7** – Production-specific fixes.
6. **Phase 5** – Remove emoticons and polish styling.
7. **Phase 6** – Admin configuration (can be iterative).
8. **Phase 7** – Client registration when RFI is finalised.

---

## Part 4: Files to Modify (Preliminary)

Based on the codebase structure:

| Area | Likely Files |
|------|--------------|
| Sign-up flow | `app/signup/page.tsx`, `app/signup/classify/page.tsx` |
| Agency registration | `app/signup/agency/page.tsx`, `lib/rfi-data.ts`, `lib/rfi-types.ts` |
| Production registration | `app/signup/production/page.tsx`, `lib/rfi-data.ts` |
| Auth & review | `lib/auth-context.tsx`, `middleware.ts` |
| Admin settings | `app/dashboard/settings/page.tsx` (or new admin routes) |

---

## Part 5: Open Questions for Client

1. **SIGN UP flow:** Is the current flow (signup → classify → dashboard) correct, or should the classify step appear at a different point?
2. **Disclaimer content:** Do you have the exact legal disclaimer text, or should we use a placeholder?
3. **RFI list options:** Which specific fields should use "infos from list menu in RFI"? Can you share the RFI document or a list of allowed values?
4. **Admin panel:** Does an admin/settings UI already exist, or should we build it from scratch for section/field configuration?

---

*Document generated from analysis of Creative Feedback_v4.pptx and Feedback v4.docx. Last updated: March 2025.*
