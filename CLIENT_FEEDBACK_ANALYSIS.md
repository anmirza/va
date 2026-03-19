# Client Feedback v4 – Complete Analysis & Comparison

**Sources:** Creative Feedback_v4.pptx, Feedback v4.docx, RFI Agency-updated.xlsx, RFI Production House.xlsx  
**Priority:** Client requirements and changes take precedence over RFI structure. Where RFI and client feedback conflict, client feedback wins.

---

## Part 1: Client Requirements (Prioritized)

### 1.1 Sign-Up & Registration Flow

| # | Requirement | Source | Status |
|---|-------------|--------|--------|
| 1 | Users must first register with corporate email and password | Feedback v4.docx | ✅ Implemented in `app/signup/page.tsx` |
| 2 | After approval, users access homepage and declare as agency/production/client | Feedback v4.docx | ✅ Classify step exists; verify flow |
| 3 | Personal email domains must be blocked (Gmail, Yahoo, etc.) | Creative Feedback slide 2 | ✅ Implemented in signup + turnover-utils |
| 4 | Profile must undergo review before publication; final approval by client | Creative Feedback slide 2 | ⚠️ Verify review workflow exists |
| 5 | SUPER ADMIN/ADMIN can modify fields within sections and add new stages/sections | Creative Feedback slide 2 | ❌ Admin config not built |

**Issue:** Client says: *"If I click on SIGN UP, I am prompted to register an agency, production company, or client."*  
**Current flow:** Sign up → Classify (Vendor/Client) → Dashboard. Vendor then chooses agency or production from dashboard.  
**Action:** Confirm with client whether the classify step is correct or if they expect a different entry point.

---

### 1.2 Pre-Registration Disclaimer

| # | Requirement | Source | Status |
|---|-------------|--------|--------|
| 1 | First page before registration steps: intro + legal disclaimer | Feedback v4.docx | ❌ Not implemented |
| 2 | Disclaimer states terms are still being finalised | Feedback v4.docx | — |
| 3 | SUPER ADMIN/ADMIN can add/amend disclaimer content | Feedback v4.docx | ❌ Not implemented |

---

### 1.3 Agency Registration – Section Order (Client Table)

**Client-provided table (Feedback v4.docx):**

| Step | Section | Status | Action |
|------|---------|--------|--------|
| General Information | General Information | OK | — |
| General Information | Organization & Structure | OK | — |
| General Information | Registered Office Address | **MISSED → move here** | Move into General Info |
| General Information | About | **MISSED → move here** | Move into General Info |
| Contacts | Contact Details | OK | — |
| Contacts | Social Media | OK | — |
| — | Turnover & Clients | OK | — |
| — | Knowledge & Competencies | OK | — |
| — | Governance & SOW | OK | — |
| — | People & Talent | OK | — |
| — | Award | OK | — |
| Add-On | Other information | **MISSED → move here** | Move into Add-On |
| Add-On | Social Responsibility | OK | — |
| Add-On | Investments | OK | — |
| Add-On | Attachments | OK | — |

**Current Agency implementation (`REGISTRATION_STEPS`):**
1. General Info  
2. Contacts  
3. Turnover & Clients  
4. Knowledge & Competencies  
5. Governance & SOW  
6. People & Talent  
7. Awards & Infos  
8. Add-On  

**Gap:** Agency Step 1 (General Info) currently includes business name, org & structure. Address and About may be in Step 2 (Contacts) or elsewhere. Client wants Address and About **inside** General Information. Other information must be in Add-On (may currently be in Awards & Infos).

---

### 1.4 Production Company Registration – Section Order (Client Table)

**Client-provided table (Feedback v4.docx):**

| Step | Section | Status | Action |
|------|---------|--------|--------|
| General Information | General Information | OK | — |
| General Information | Organization & Structure | **MISSED → move here** | Move into General Info |
| General Information | Registered Office Address | **MISSED → move here** | Move into General Info |
| General Information | About | **MISSED → move here** | Move into General Info |
| Contacts | Contact Details | **MISSED → move here** | Move into Contacts |
| Contacts | Social Media | **MISSED → move here** | Move into Contacts |
| — | Turnover & Clients | OK → Fix | Same layout as Agency |
| — | Knowledge & Competencies | **NO → Fix** | Use subtitles |
| — | Post Production | **Fix** | Same layout as Agency |
| — | Activities | **Fix** | Same layout as Agency |
| — | Governance & SOW | **MISSED** | Add |
| — | People & Directors | OK | — |
| — | Award | OK | — |
| Add-On | Other information | **MISSED → move here** | Move into Add-On |
| Add-On | Social Responsibility | **MISSED → move here** | Move into Add-On |
| Add-On | Investments | **MISSED → move here** | Move into Add-On |
| Add-On | Attachments | **MISSED → move here** | Move into Add-On |

**Current Production implementation (`STEPS`):**
1. General Info  
2. Organisation  
3. Address  
4. About  
5. Contacts  
6. Social Media  
7. Turnover & Clients  
8. Competencies  
9. Post-Production  
10. People & Directors  
11. Awards & CSR  
12. Governance & AI  
13. Attachments  

**Gap:** Production has 13 separate steps; Agency has 8. Client wants **same layout for both** using Agency as reference. Production must be restructured to match Agency’s step/section grouping.

---

### 1.5 Creative Feedback (PowerPoint) – Key Points

| # | Requirement | Source | Priority |
|---|-------------|--------|----------|
| 1 | **PLEASE STANDARDISE THE SAME LAYOUT FOR BOTH REGISTRATION FORMS USING THE AGENCY ONE** | Slides 3, 4, 5 | 🔴 Critical |
| 2 | Super Admin must be able to modify fields and add new stages/sections | Slide 2 | 🔴 Critical |
| 3 | Turnover & Clients: years must update **automatically** (5-year rolling: 2026→2025–2021, 2027→2026–2022) | Slide 2 | ✅ `getTurnoverYears()` already does this |
| 4 | Use **infos from list menu in RFI** for dropdowns | Slide 3 | 🟡 Use RFI lists |
| 5 | **Remove all emoticons** – corporate layout and look & feel | Slide 3 | 🟡 Audit & remove |
| 6 | Use agency look & feel for Production, **same size of production cells** (Turnover) | Slide 5 | 🟡 Fix cell sizing |
| 7 | Currency already set from Step 1 (Org & Structure → Agency Currency) – flow through | Slide 5 | 🟡 Verify currency propagation |
| 8 | "Too small" cells in Production → use "Good size and space" as reference | Slide 5 | 🟡 Resize cells |
| 9 | Knowledge & Competencies (Production): use **subtitles** for structure | Feedback v4 | 🟡 Add subtitles |

---

### 1.6 Admin Configuration

| # | Requirement | Source | Status |
|---|-------------|--------|--------|
| 1 | Pre-set all sections with pre-set modules | Feedback v4.docx | ❌ Not built |
| 2 | Add, amend, or remove steps/sections | Feedback v4.docx | ❌ Not built |

---

### 1.7 Client Registration

| # | Requirement | Source | Status |
|---|-------------|--------|--------|
| 1 | Simplified: General Information, Organization & Structure, Registered Office Address | Feedback v4.docx | ⏳ No RFI yet |

---

## Part 2: RFI vs Implementation Comparison

### 2.1 RFI Agency-updated.xlsx – Section Structure

From shared strings and parsed_rfi_utf8.txt:

| RFI Section | Fields / Content |
|-------------|------------------|
| GENERAL INFORMATION | Registered Business Name, D-U-N-S®, VAT, Legal form, Company reg, Year Established, CEO, Parent Company, Category, Agency Currency, # Employees |
| ORGANIZATION & STRUCTURE | Company Level, Trade Organizations, # Employees, Parent Company, Category, Currency |
| REGISTERED OFFICE ADDRESS | Country Coverage, Address, Postcode, City, Country |
| ABOUT | About, Philosophy & Competitive Advantages, Network Description, Local Representation |
| CONTACT DETAILS | CEO, GM, Business Director, ECD, Executive Producer; Name, Surname, Telephone, Mobile, Email, LinkedIn |
| SOCIAL MEDIA | Official Website, X, Facebook, LinkedIn, Instagram, Tiktok, Pinterest, Tumblr, Snapchat, Reddit |
| TURNOVER & CLIENTS | Main Clients, Industry, Principal Activities, Year, Client incidence %, Exclusivity; Annual Revenue, EBITA (GLOBAL/LOCAL, NAM, EUROPE, LATAM, AFRICA, APAC) |
| KNOWLEDGE & COMPETENCIES | Communication Areas (18 sectors), Market Positioning, Main/Secondary/Additional Capabilities, Services (grouped) |
| GOVERNANCE & SOW | QA systems, client data protocols, global/local governance |
| ACTIVITIES | Activities outsourced, description, % contractual value |
| PEOPLE | # employees, # freelancers, Annual Salary; roles by department |
| TALENT | Role, LinkedIn |
| AWARD | Distinction, Awarded Ad, Brand, festivals (Cannes, One Show, D&AD, etc.) |
| OTHER INFORMATION | AI tools, AI implementations, AI benefits, AI ethics, AI risk mitigation |
| SOCIAL RESPONSIBILITY | 1.1–1.11 questions (gender equality, discrimination, human rights, etc.) |
| ATTACHMENTS | Organisational Chart, Chamber of Commerce, References, Company profile, Certifications |
| INVESTMENTS | IT Equipment, Innovation, Sustainable development, Media & advertising, Training |

### 2.2 RFI Production House.xlsx – Section Structure

| RFI Section | Fields / Content |
|-------------|------------------|
| GENERAL INFORMATION | Registered Business Name, D-U-N-S®, VAT, Legal form, Company reg, Year Established |
| REGISTERED OFFICE ADDRESS | Address, Postcode, City, Country |
| CONTACT DETAILS | Name, Surname, CEO, Parent Company, Telephone, Mobile, Email |
| TURNOVER & CLIENTS | Annual Revenue, Main Clients, Industry, Principal Activities, Year, Client incidence % |
| KNOWLEDGE & COMPETENCIES | Communication Areas, Services (Strategic & Consulting, Creative & Content, etc.) |
| ACTIVITIES | Activities outsourced, description, % contractual value |
| PEOPLE | # employees, # freelancers, Annual Salary |
| POST PRODUCTION | In-house? Services? Outsourced partners? (Location, Audio, Video) |
| DIRECTORS | Priority, Occasional collaboration, main directors |
| OTHER INFORMATION | AI tools, services/tools, etc. |
| SOCIAL RESPONSIBILITY | Same structure as Agency |
| ATTACHMENTS | References, Company profile, Certifications |
| INVESTMENTS | Same as Agency |
| GOVERNANCE & SOW | Same as Agency |
| ORGANIZATION & STRUCTURE | Company Level, Trade Organizations, Country Coverage |
| ABOUT | About, Philosophy, Network Description, Local Representation |
| SOCIAL MEDIA | Same platforms as Agency |
| AWARD | Production-specific: AICP, Ciclope, British Arrows, Shots, etc. |

**Production-specific:** Pre-Production (Director Scouting, Casting, Location, Booklet), Production (Rental, Crew, Logistics, HDDs, Delivery), Post-Production (Coordination, Broadcasters).

---

### 2.3 Implementation vs RFI – Agency

| RFI Section | In Implementation? | Notes |
|-------------|---------------------|-------|
| General Information | ✅ Step 1 | Business name, D-U-N-S, VAT, legal form, etc. |
| Organization & Structure | ✅ Step 1 | Employees, company level, parent, category, currency |
| Registered Office Address | ✅ Step 2 (Contacts) | Client wants in General Info |
| About | ✅ Step 5 (Governance) | Client wants in General Info |
| Contact Details | ✅ Step 2 | OK |
| Social Media | ✅ Step 2 | OK |
| Turnover & Clients | ✅ Step 3 | Auto years ✅ |
| Knowledge & Competencies | ✅ Step 4 | OK |
| Governance & SOW | ✅ Step 5 | OK |
| Activities | ✅ Step 4 | OK |
| People & Talent | ✅ Step 6 | OK |
| Award | ✅ Step 7 | OK |
| Other Information (AI) | ✅ Step 7 | Client wants in Add-On |
| Social Responsibility | ✅ Step 8 (Add-On) | OK |
| Investments | ✅ Step 8 | OK |
| Attachments | ❓ | Check if in Add-On |

### 2.4 Implementation vs RFI – Production

| RFI Section | In Implementation? | Notes |
|-------------|---------------------|-------|
| General Information | ✅ Step 1 | OK |
| Organization & Structure | ✅ Step 2 | Client: move to General Info |
| Registered Office Address | ✅ Step 3 | Client: move to General Info |
| About | ✅ Step 4 | Client: move to General Info |
| Contact Details | ✅ Step 5 | Client: move to Contacts (with Social Media) |
| Social Media | ✅ Step 6 | Client: move to Contacts |
| Turnover & Clients | ✅ Step 7 | Client: same layout as Agency |
| Knowledge & Competencies | ✅ Step 8 | Client: use subtitles |
| Post-Production | ✅ Step 9 | Client: same layout as Agency |
| Activities | ❓ | Check placement |
| Governance & SOW | ✅ Step 12 | Client: was MISSED, ensure present |
| People & Directors | ✅ Step 10 | OK |
| Award | ✅ Step 11 | OK |
| Other Information | ✅ Step 12 | Client: move to Add-On |
| Social Responsibility | ✅ Step 11 | Client: move to Add-On |
| Investments | ❓ | Check placement |
| Attachments | ✅ Step 13 | Client: move to Add-On |

---

## Part 3: Target Structure (Client-First)

### 3.1 Agency – Target Step Structure

Using client feedback as source of truth:

| Step | Label | Sections Included |
|------|-------|-------------------|
| 1 | General Information | General Info, Organization & Structure, Registered Office Address, About |
| 2 | Contacts | Contact Details, Social Media |
| 3 | Turnover & Clients | — |
| 4 | Knowledge & Competencies | — |
| 5 | Governance & SOW | — |
| 6 | People & Talent | — |
| 7 | Awards & Infos | Award only (move Other Info to Add-On) |
| 8 | Add-On | Other information, Social Responsibility, Investments, Attachments |

### 3.2 Production – Target Step Structure (Match Agency)

| Step | Label | Sections Included |
|------|-------|-------------------|
| 1 | General Information | General Info, Organization & Structure, Registered Office Address, About |
| 2 | Contacts | Contact Details, Social Media |
| 3 | Turnover & Clients | Same layout & cell sizes as Agency |
| 4 | Knowledge & Competencies | With subtitles (Production-specific structure) |
| 5 | Governance & SOW | Same as Agency |
| 6 | People & Directors | People, Directors |
| 7 | Awards & Infos | Award, Post-Production, Activities (same layout as Agency) |
| 8 | Add-On | Other information, Social Responsibility, Investments, Attachments |

**Note:** Post-Production and Activities in Production map to Agency’s structure. Client: "Fix with same layout" – use same visual layout/UX, not identical fields.

---

## Part 4: List Options from RFI (Use "Infos from List Menu")

From RFI Agency and Production shared strings:

| Field | Options (RFI) |
|-------|----------------|
| Agency Currency | Euro - EUR, USD, GBP, JPY, CHF, AUD + full currency list |
| # of Employees | 1 to 10, 11 to 50, 51 to 100, 101 to 250, 251 to 400, 401 + |
| Country | Full country list (194 countries) |
| Company Level | Holding Company, Worldwide Headquarter, Regional Headquarters, National Headquarters, Company, Subsidiary |
| Country Coverage | Country Level, North America, Latin America, EMEA, Europe, APAC, Global |
| Category (Agency) | ATL, Digital Marketing, Event & Experience, Full Service, Influencer Marketing, PR, Social Media, Tech Dev, Point of Sales Material |
| Communication Areas | 18 sectors (Automotive & Mobility, etc.) |
| Services | Grouped by capability area (Strategic & Consulting, Creative & Content, etc.) |
| Award Festivals (Agency) | Cannes Lions, The One Show, D&AD, Clio Awards, LIA, ADC Awards, Webby, Effie, Epica, Eurobest, NY Festival, AME |
| Award Festivals (Production) | AICP, Ciclope Festival, British Arrows, Shots, Clio, D&AD, The One Show, Creative Circle, APA Show, YDA, VES, LIA |

**Implementation:** `lib/rfi-data.ts` already has most of these. Verify all dropdowns use RFI lists; add any missing.

---

## Part 5: Implementation Checklist (Prioritized)

### Phase 1: Critical (Client-Explicit)

- [ ] **1.1** Add pre-registration disclaimer step (intro + legal) – configurable by admin  
- [ ] **1.2** Standardise Production layout with Agency (same 8-step structure, same UX)  
- [ ] **1.3** Agency: Move Registered Office Address and About into General Information  
- [ ] **1.4** Agency: Move Other information into Add-On (out of Awards & Infos if needed)  
- [ ] **1.5** Production: Consolidate to 8 steps matching Agency; move sections per client table  
- [ ] **1.6** Production: Add subtitles to Knowledge & Competencies  
- [ ] **1.7** Production: Post-Production and Activities – same layout as Agency equivalents  
- [ ] **1.8** Production: Ensure Governance & SOW is present and correctly placed  
- [ ] **1.9** Production: Turnover & Clients – same cell sizes as Agency; currency from Step 1  
- [ ] **1.10** Remove all emoticons from registration forms  

### Phase 2: High

- [ ] **2.1** Verify Turnover years auto-update (already implemented – confirm)  
- [ ] **2.2** Verify currency from Org & Structure flows to Turnover  
- [ ] **2.3** Audit all dropdowns use RFI list options  
- [ ] **2.4** Fix "Too small" Production cells – match Agency sizing  

### Phase 3: Medium

- [ ] **2.5** Profile review workflow before publication  
- [ ] **2.6** Admin: add/amend/remove steps and sections (future)  
- [ ] **2.7** Admin: edit disclaimer content  

### Phase 4: Low

- [ ] **2.8** Client registration (simplified) when RFI available  

---

## Part 6: Open Questions for Client

1. **Sign-up flow:** Is the current path (Sign up → Classify Vendor/Client → Dashboard) correct? Where exactly do you see "register agency, production company, or client" on first click?  
2. **Disclaimer:** Do you have final legal disclaimer text, or use a placeholder?  
3. **Production step count:** Should Production have exactly 8 steps like Agency, or can Post-Production and Activities be sub-sections within one step?  
4. **Admin panel:** Does an admin UI already exist for step/section configuration, or should we design it from scratch?

---

*Analysis date: March 2025. Client feedback from Creative Feedback_v4.pptx and Feedback v4.docx. RFI structure from RFI Agency-updated.xlsx and RFI Production House.xlsx.*
