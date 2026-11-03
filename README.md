# MediPulse demo prototype

A static, browser-based prototype of MediPulse, a **patient-centred** health record application. Patient health is the core focus: the Patient records their own symptoms, prescriptions, medications, vitals, interventions and lab results. Screens follow the supplied design and architecture specifications.

## Run locally

From `D:\Healthcare`:

```powershell
python -m http.server 8000
```

Open [http://localhost:8000/index.html](http://localhost:8000/index.html). Node.js or PHP static servers also work. Pages load `js/app.js?v=N` and `css/styles.css?v=N`; after an update, hard-refresh (Ctrl+F5).

## Screens

| File | Purpose |
| :--- | :--- |
| `index.html` | Public landing page (fits one viewport, no scrollbar) and role portals |
| `login.html` | Demo sign-up and sign-in. Patient sign-up also captures **Gender** and **Date of birth** |
| `dashboard.html` | **My Dashboard**: today's medication schedule (period of day and meal dependency only, no clock times) and the Medication Log |
| `symptoms.html` | Symptom events, with suggested diagnostic tests |
| `prescriptions.html` | Prescriptions: practitioner, diagnoses requested, medications (period, meal dependency, unit) |
| `interventions.html` | Interventions captured against prescriptions |
| `vitals.html` | Vitals log (BP, pulse, weight, fasting and post-meal sugar) with limit-band badges |
| `labtests.html` | Lab test results by facility, test and requesting practitioner, with limit-band badges |
| `practitioners.html` | Practitioner directory (Patient only) |
| `groups-master.html` | Group masters (see below) |
| `tests-parameters-studio.html` | Test categories and health parameters with male/female reference limits |

Shared behaviour lives in `js/app.js`, shared styling in `css/styles.css`.

### Group masters

Practice type, Specialization, User profile, Facility type, **Facilities** (type, name, multi-line address), Tests, Health parameters (filtered by test category), **Limit bands**, Vital categories, Vitals, Symptoms, Symptom diagnostic tests, Intervention method, Practitioners.

## Rules implemented

- **Roles:** only the Patient can add, edit or delete. Other roles are View-only (client-side only). Care-giver data entry is planned.
- **Every record** has View, Edit and Delete.
- **Dependent masters** appear after their parent in forms (e.g. Facility type before Facility).
- **Master-record lock:** once a master record is used by any detail record, it cannot be edited or deleted until those detail records are removed. Examples: a Facility used by a lab result, a Parameter or Vital that has limit bands, a prescription referenced by lab results.
- **Dates:** future-dated entries are rejected. No default date range is applied to lists (From/To start blank and show everything; the Medication Log view date blank means all dates).
- **Vitals:** a saved record needs at least one reading. Several records may share a timestamp, and the date/time can be edited.
- **Lab tests:** choose facility, test, then *Requested by* (Self or a practitioner); a practitioner's requested diagnoses from their prescriptions can be linked. At least one value is required.

### Limit bands

Optional per health parameter or vital, kept in the **Limit bands** master. Each band has a label, sex (All, Male, Female), optional age from/to, lower (inclusive) and upper (exclusive) limits, and a severity (Normal, Borderline, Abnormal, Critical). At least one limit is required, lower must be below upper, and age-from must not exceed age-to. Entered values show a coloured badge (green, amber, orange, red) while typing and in saved lists. The first active band that matches the patient's sex and age wins. Age is derived from the Date of birth given at sign-up; profiles without one skip age-range bands only.

## Data

Seed CSVs in `data/`, loaded on first run and re-importable by Patients:

- `master_health_parameters_reference_limits.csv`: categories, parameters, units, male/female limits
- `daily_vitals_reference_limits.csv`: vitals (includes Body Weight)
- `symptom_driven_diagnostic_tests.csv`: symptoms and diagnostic tests

Everything is stored in browser local storage:

| Key | Content |
| :--- | :--- |
| `medipulse-demo-v1` | Masters and all event records |
| `medipulse-demo-user-v1` | Current session (`username`, `fullName`, `role`, `gender`, `dob`) |
| `medipulse-demo-profiles-v1` | Sign-up profiles (gender, date of birth) |
| `medipulse-symptoms-v1` | Symptom history |

Clearing browser storage resets the sample data.

## Important limitations

This is a UI prototype only. It has no server, real authentication, authorization, encryption, audit service, email verification, captcha, password recovery, or validated clinical decision support. Sign-in accepts demo values and does not verify credentials. Role rules are a client-side demonstration, not security. Never enter real credentials or protected health information. Limit bands and badges are informational and not clinical advice. The prototype is not HIPAA compliant or for clinical use.

## Planned

Admin role with sign-up approval and profile maintenance, email verification, Forgot password, captcha, Care-giver access, Analytics, Advanced Analytics and Reports.
