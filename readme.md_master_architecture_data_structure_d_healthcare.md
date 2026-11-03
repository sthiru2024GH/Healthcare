# MediPulse Healthcare Web Application — Master Architecture & Deployment Specification
**Target Deployment Directory: `D:\Healthcare`**
**Documentation Version:** `v4.9.0-Master`  
**Target design goals:** HIPAA-aligned controls · HL7 FHIR R4 · LOINC / SNOMED-CT alignment · TLS 1.3

> **Prototype status:** This document describes the intended architecture, not deployed or certified capabilities. The browser-only prototype in this directory has no backend, real authentication, encryption, audit service, NTP synchronization, WebRTC, or validated clinical decision support. It is not HIPAA compliant and must not be used with real credentials, protected health information, or for clinical care. See `README.md` for local run instructions and limitations.

---

## 1. Executive Overview & System Topology

MediPulse is a patient-centered clinical web operating system for outpatient healthcare delivery, tele-consultations, and relational clinical master data management (MDM). The landing experience keeps the patient's health and care team at its center. The intended product uses role-aware access; in the current demonstration, Patient profiles may add, edit, and soft-delete master records while all other profiles are view-only.

```
D:\Healthcare\
├── index.html                   # 1. Healthcare Public Landing Page & Role Portals
├── login.html                   # 2. Unified Authentication & Registration Gateway
├── dashboard.html               # 3. Post-Login Clinician Workspace & Outpatient Appointments
├── groups-master.html           # 4. Groups Master Data Hub (7 Submenus A/E/D/V Directory)
├── tests-parameters-studio.html # 5. Tests & Health Parameters Studio (Fixed/Staggered Ranges)
├── symptoms.html                # 6. Symptom events
├── prescriptions.html           # 7. Prescriptions (diagnoses, medications)
├── interventions.html           # 8. Interventions
├── vitals.html                  # 9. Vitals log with limit-band badges
├── labtests.html                # 10. Lab test results
├── practitioners.html           # 11. Practitioner directory
├── README.md                    # Run instructions, rules, limitations
├── data/                        # Seed CSVs (parameters, vitals, symptom tests)
├── css/
│   └── styles.css               # Shared Tailwind / Custom Theme Tokens
└── js/
    └── app.js                   # Client State Management (Auth, Clocks, Filter Utilities)
```

---

## 1a. Current Prototype Implementation Status (supersedes the sections below where they differ)

**Patient-first model.** The Patient records all event data; other roles are View-only. Care-giver entry, Admin approval, email verification, Forgot password and captcha are planned.

**Screens built:** Landing, Login/Sign-up (Patients give Gender and Date of birth), My Dashboard (medication schedule showing period of day and meal dependency only, plus Medication Log), Symptoms, Prescriptions, Interventions, Vitals, Lab Tests, Practitioners, Groups Master, Tests & Parameters Studio. Analytics, Advanced Analytics and Reports are not yet built.

**Group masters (14):** Practice type, Specialization, User profile, Facility type, Facilities, Tests, Health parameters, Limit bands, Vital categories, Vitals, Symptoms, Symptom diagnostic tests, Intervention method, Practitioners.

**Event entities (local storage, key `medipulse-demo-v1`):**

| Collection | Key fields |
| :--- | :--- |
| `prescriptions` | patient, practitioner, date |
| `prescriptionDiagnoses` | prescription, requested diagnosis/test |
| `prescriptionMedications` | prescription, medicine, dose, unit, periods (Morning/Afternoon/Evening/Night), meal dependency |
| `medicationLogs` | medication, date, period, taken status |
| `interventionPrescriptions`, `interventionItems` | prescription-linked interventions, method |
| `vitalReadings` | patient, recordedAt, readings[{vitalId, value}] (at least one) |
| `labResults` | patient, facilityId, testId, recordedAt, requestedBy (`SELF` or practitioner), prescriptionId, values[{parameterId, value}] |
| `limitBands` | parameterId (a health parameter or vital), name, sex, ageFrom, ageTo, lower, upper, severity, status |
| `facilities` | facility type, name (required), address |

**Referential rules.**
- *Master lock:* a master record in use cannot be edited or deleted until the detail records using its key are removed (Facility, Test, Parameter, Vital, Practitioner, Facility type, Prescription and diagnosis links).
- No future-dated entries; no default date window on lists.
- Every record offers View, Edit, Delete.

**Limit bands (answers the staggered-range question).** The staggered tier model in section 5 is implemented as optional child rows in `limitBands`, one row per tier, attached to a parameter or vital. Matching is by value (lower inclusive, upper exclusive), sex, and age derived from the patient's Date of birth. The first active match is shown as a coloured badge (Normal green, Borderline amber, Abnormal orange, Critical red) in the Vitals and Lab Tests forms and lists. The free-text limit columns from the CSVs are display-only and are not parsed.

---

## 2. Complete Screen Suite & Interface Blueprints

| Screen Filename | Title / Purpose | Core Components & User Actions |
| :--- | :--- | :--- |
| `index.html` | **Patient-Centered Healthcare Landing Page** | • Patient-first introduction and patient portal entry<br>• Compact desktop layout designed to fit a single viewport<br>• Portal links for Patient, Practitioner, Care-giver, and Guest<br>• Global Header with direct Log In & Sign Up triggers |
| `login.html` | **Login & Registration Portal** | • Tabbed toggle between **Log In** and **New Sign Up**<br>• Role Authorization selector (Practitioner, Patient, Care-giver, Guest)<br>• Credential inputs: Username, Full Legal Name, Password (with eye toggle), Confirm Password<br>• State-preserving session handover to `dashboard.html` |
| `dashboard.html` | **Clinician Workspace (Appointments)** | • Top Clinical OS navigation bar with nested dropdowns<br>• Outpatient appointment schedule filtered by **All (6)**, **Tele-Consults (4)**, and **In-Person (2)**<br>• Direct contextual actions: `Join Tele-Consult`, `Start Exam / Check-In`, `Patient Chart`<br>• Dr. Vance WebRTC Virtual Examination Room launcher<br>• Pending clinical task checklist |
| `groups-master.html` | **Groups Master Data Hub** | • Master ribbon across all 7 canonical groups<br>• Search, category filtering, and status ledger (Active / Draft / Staged)<br>• Patient-only **Add / Edit / Delete**; all other roles receive **View-only** access<br>• Referential integrity checks for linked records |
| `tests-parameters-studio.html` | **Tests & Health Parameters Studio** | • Target Laboratory selector (multi-facility calibration)<br>• Left panel: Diagnostic Test Panels catalog (`Lipid`, `CBC`, `CMP`, `HbA1c`, `TSH`)<br>• Right panel: Bound Health Parameters & Threshold Spectrum<br>• Patient-only parameter editing with Fixed vs. Staggered range validation |

---

## 3. Global Navigation Hierarchy & Submenu Structure

MediPulse employs a standardized top menu hierarchy accessible across all post-login workspaces:

### A. GROUPS Master (7 Canonical Submenus)
1. **Practice Type:** Modality definitions (`Allopathy`, `Ayurveda`, `Homeopathy`, `Naturopathy & Yoga`, `Unani Tibb`, `Acupuncture & Moxibustion`).
2. **Specialization:** Clinical domains (`Cardiology`, `Nephrology`, `Neurology`, `Oncology`, `Pediatrics`, `Orthopedics`, etc.).
3. **User Profile:** Identity and authorization tiers (`Practitioner`, `Patient`, `Care-giver`, `Guest / Consulting Specialist`, `Laboratory Technician`).
4. **Facility Type:** Operational care sites (`Super-Speciality Hospital`, `Outpatient Clinic`, `Diagnostic Test Lab`, `Imaging & Scan Centre`).
5. **Tests:** Standardized laboratory panels and order sets (`CBC`, `Lipid Profile`, `Comprehensive Metabolic Panel`, `HbA1c`, `Thyroid Panel`).
6. **Health Parameters:** Specific measurable biomarkers (`Total Cholesterol`, `HDL`, `LDL`, `Triglycerides`, `Fasting Glucose`, `Serum Creatinine`).
7. **Interventions:** Procedural catalog (`Surgical Procedures`, `Dialysis Protocols`, `Therapies`, `Physical Rehabilitation`).

### B. EVENTS Menu
- `Symptoms`
- `Diagnosis` (ICD-10 / SNOMED-CT mapped)
- `Prescriptions`
- `Medications`
- `Vitals`
- `Interventions`

### C. REPORTS Menu
- `Timeline Chart` (Patient chronological event flow)
- `Trends` (Longitudinal biomarker trajectories)
- `Abnormal Results` (High/Low out-of-bounds alerts)
- `Stocks` (Pharmacy & testing consumable inventory)

### D. ANALYTICS Menu
- Outpatient volume, tele-consult adherence, clinic room utilization, and encounter durations.

### E. HELP Menu
- `User Manual`
- `Version (v4.8.2 / v4.9.0)`
- `Feedback & Issue Reporter`

---

## 4. Master Relational Data Models & Entity Dictionaries

### Entity 1: Practice Type (`mst_practice_type`)
*Defines systemic medical disciplines. Pre-fixed canonical system codes.*
```json
{
  "practice_id": "PRAC-ALLO-01",
  "name": "Allopathy",
  "description": "Modern Evidence-Based Medicine (Pharmacopeia & Surgery)",
  "classification_type": "Standard Pre-fixed",
  "is_active": true,
  "bound_specializations_count": 28,
  "created_at": "2026-10-28T02:14:00Z"
}
```

### Entity 2: Specialization (`mst_specialization`)
*Clinical departments linked to parent Practice Types.*
```json
{
  "specialization_id": "SPEC-CARD-04",
  "practice_id": "PRAC-ALLO-01",
  "name": "Cardiology",
  "clinical_scope": "Cardiovascular medicine, electrophysiology, coronary care",
  "standard_code": "SNOMED-394579002",
  "is_active": true
}
```

### Entity 3: Facility (`mst_facility`)
*Physical and diagnostic locations with laboratory capabilities.*
```json
{
  "facility_id": "FAC-LAB-04",
  "facility_name": "Metropolitan Central Diagnostic Core",
  "facility_type": "Diagnostic Test Lab",
  "clia_number": "10D992488A",
  "is_reference_lab": true,
  "address": "450 Medical Heights Blvd, Suite 100"
}
```

### Entity 4: Diagnostic Test (`mst_test`)
*Ordered medical examination panels.*
```json
{
  "test_id": "TEST-LIPID-02",
  "test_name": "Lipid Profile Panel (Expanded)",
  "loinc_code": "24331-1",
  "specimen_type": "Serum SST Gold",
  "fasting_required": true,
  "fasting_hours": 12,
  "status": "ACTIVE",
  "bound_parameters_count": 5
}
```

### Entity 5: Health Parameter (`mst_health_parameter`)
*Atomic biochemical or physiological biomarkers.*
```json
{
  "parameter_id": "PARAM-CHOL-01",
  "test_id": "TEST-LIPID-02",
  "parameter_name": "Total Cholesterol",
  "system_code": "PARAM-CHOL-01",
  "loinc_code": "2093-3",
  "specimen_matrix": "Venous Blood Serum",
  "unit_of_measure": "mg/dL",
  "datatype": "QUANTITATIVE_FLOAT",
  "range_architecture": "STAGGERED_MULTI_TIER",
  "facility_overrides": {
    "FAC-LAB-04": "ACTIVE_CALIBRATED"
  }
}
```

---

## 5. Reference Range Architecture: Fixed vs. Staggered Models

MediPulse supports two distinct paradigms for clinical decision support thresholds:

### Model A: Fixed Bilateral Cutoff Model (`FIXED_BILATERAL`)
Ideal for markers with binary normal vs. abnormal thresholds (e.g., HDL Cholesterol or Serum Creatinine).
- **Lower Cutoff Ceiling:** Below this value flags as `ABNORMAL LOW`.
- **Upper Cutoff Ceiling:** Above this value flags as `ABNORMAL HIGH`.
- **Demographic Stratification:** Allows sex-stratified (Male $\ge 40.0\text{ mg/dL}$, Female $\ge 50.0\text{ mg/dL}$) and age-stratified criteria.

```text
  [ < 40.0 mg/dL ]       [ 40.0 – 100.0 mg/dL ]       [ > 100.0 mg/dL ]
  ◄─────────────────────┼────────────────────────────┼────────────────►
     CRITICAL LOW                   NORMAL               PHYSIOLOGIC HIGH
```

### Model B: Staggered Multi-Tier Interval Model (`STAGGERED_TIER`)
Ideal for continuous gradient risk factors (e.g., Total Cholesterol, LDL, hs-CRP, HbA1c).
- **Tier 1 (Normal / Desirable):** $< 200\text{ mg/dL}$ (Low cardiovascular risk index).
- **Tier 2 (Caution / Borderline High):** $200 - 239\text{ mg/dL}$ (Dietary & lifestyle review).
- **Tier 3 (Elevated / High Risk):** $240 - 299\text{ mg/dL}$ (Pharmacotherapy consideration).
- **Tier 4 (Panic Critical / Alert):** $\ge 300\text{ mg/dL}$ (Automated clinician notification trigger).

---

## 6. Action Matrix: Standardized CRUD (A / E / D / V)

The prototype applies this role rule to every master directory and the tests/parameters studio:
- **Patient profile:** `[ + Add (A) ]`, `[ ✏️ Edit (E) ]`, and `[ 🗑️ Delete (D) ]` are available. Edit and delete are blocked while detail records use the master record's key (master lock).
- **All other profiles:** `[ 👁️ View (V) ]` only. Create, edit, and delete controls are not shown and mutation handlers reject those actions.

This is a client-side prototype rule only. A production implementation must enforce authorization on the server for every operation; the demo role selector and browser storage are not an authentication or security boundary.

---

## 7. Local Deployment & Run Instructions (`D:\Healthcare`)

### Step 1: Directory Setup
Verify the presence of files in `D:\Healthcare`:
```powershell
cd D:\Healthcare
dir
```

### Step 2: Running with HTTP Server (Recommended)
Launch a local server using Python, Node.js, or PHP:

```powershell
# Using Python:
python -m http.server 8000

# Using Node (http-server / npx):
npx serve -l 8000

# Using PHP:
php -S localhost:8000
```

### Step 3: Accessing the Application
Open your web browser and navigate to:
```text
http://localhost:8000/index.html
```
Use the local HTTP server for consistent browser storage and navigation behavior. Direct `file://` access may not support all prototype features consistently.
