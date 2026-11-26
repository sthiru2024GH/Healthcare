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
| `abnormal.html` | Abnormal vital and lab results within a selected date range |
| `opening-stock.html` | Opening stock entries for medicines from the latest open prescription per practitioner |
| `receipts.html` | Patient-entered medicine receipts without a linked order |
| `safety-stock.html` | Patient-specific estimated stock and suggested orders using manually entered lead times |
| `symptoms.html` | Symptom events, with suggested diagnostic tests |
| `prescriptions.html` | Prescriptions: practitioner, diagnoses requested, medications (period, meal dependency, unit) |
| `interventions.html` | Patient-entered intervention reports with flexible observations and narrative sections |
| `inpatient.html` | Inpatient admission and discharge entry and history |
| `vitals.html` | Vitals log (BP, pulse, weight, fasting and post-meal sugar) with limit-band badges |
| `labtests.html` | Lab test results by facility, test and requesting practitioner, with limit-band badges |
| `analytics.html` | Vitals and lab trends, refreshed when saved records change. Search recorded lab tests or parameters to filter the trend selector. Vitals show every calendar date in the recorded span; lab trends show only recorded dates for the selected parameter, equally spaced rather than proportional to elapsed time. Scroll horizontally for long spans |
| `advanced-analytics.html` | Compare selected recorded lab parameters in independently scaled charts, with recorded dates equally spaced as in Lab Test Trend |
| `practitioners.html` | Practitioner directory (Patient only) |
| `groups-master.html` | Group masters (see below) |
| `tests-parameters-studio.html` | Test categories and health parameters with male/female reference limits |

Shared behaviour lives in `js/app.js`, shared styling in `css/styles.css`.

### Group masters

Practice type, Prescription type (one or more practice types), Specialization, User profile, Facility type, **Facilities** (type, name, multi-line address), Tests, Health parameters (filtered by test category), **Limit bands**, Vital categories, Vitals, Symptoms, Symptom diagnostic tests, Intervention method, Practitioners.

## Rules implemented

- **Roles:** only the Patient can add, edit or delete. Other roles are View-only (client-side only). Care-giver data entry is planned.
- **Every record** has View, Edit and Delete.
- **Dependent masters** appear after their parent in forms (e.g. Facility type before Facility).
- **Prescription type master:** Patients add named types and select one or more practice types. Prescription entry offers types assigned to the practitioner's practice. The type named Clinical (case-insensitive) uses the medication and lab workflow; all other types use intervention details. A type in use cannot be edited or deleted.
- **Test subgroups:** Tests are classified as Clinical or Interventional. Existing tests without a subgroup are treated as Clinical without rewriting them. New tests select a subgroup, which is fixed after creation. Clinical parameters, prescriptions, lab entry, and the Tests & Parameters studio use Clinical tests only. Intervention reports select a prescribed intervention line rather than a test; historical test references are retained.
- **Master-record lock:** once a master record is used by any detail record, it cannot be edited or deleted until those detail records are removed. Examples: a Facility used by a lab result, a Parameter or Vital that has limit bands, a prescription referenced by lab results.
- **Dates:** future-dated entries are rejected. No default date range is applied to lists (From/To start blank and show everything; the Medication Log view date blank means all dates).
- **Prescriptions and schedule:** Existing prescriptions are classified Clinical. Patients can close or reopen a prescription in its history. The latest Clinical prescription by issue date for each practitioner determines the schedule; if it is closed, no older prescription is automatically resumed. Other types do not displace Clinical prescriptions or supply lab requests. Prescription type is fixed after saving. Previously saved Clinical prescriptions without a master link can still be edited as Clinical.
- **Interventions:** Existing intervention prescriptions are migrated into the shared prescription list as Interventional, with their IDs, intervention items and symptom snapshots retained. A backup of the original intervention records is retained in browser storage; migration is saved atomically. New non-Clinical prescriptions use intervention method and clinical name fields, with optional links to recorded symptom events. Report entry is separate from prescriptions and Clinical Trends.
- **Intervention report schema:** Each `interventionReports` entry has its own ID, patient, facility, required prescribed-intervention-item ID for new or updated reports, optional practitioner IDs, workflow, domain, specimen and site, optional collection and reported local timestamps, report status, optional code/system, indication and impression, selected starter template, and creation/update timestamps. The intervention method, prescription ID and prescribing practitioner are derived from the selected prescription line; the workflow is independently selected. Ordered `observations` embed their own IDs, section, parameter name, optional code/system, result type, reported value (stored as text to preserve decimal precision), qualifier, unit, reference bounds/text, reported flag and note. Ordered `narratives` contain IDs, titles and text. Empty starter rows are not saved; reported values, units and ranges are snapshots and are not interpreted automatically. The three starter templates only provide editable names and types; selecting a template does not add or replace rows until Append template rows is pressed. Attachments are deferred. Data is saved in browser localStorage, not PostgreSQL; timestamps entered without a timezone must not be interpreted as UTC. Reference ranges are as reported, not automatically selected or calculated.
- **Report links and access:** Only Patients can create, edit or delete reports; other profiles can view. Historical reports retain their original test reference and remain viewable even if unlinked; an appropriate prescription line must be selected manually before saving an edit, with no automatic name matching. Referenced tests, facilities and practitioners are locked using existing master rules. A linked prescription line cannot be changed or deleted, and the prescription's practitioner cannot be changed, until its reports are relinked or deleted. These prototype controls are not secure authorization or an audit trail.
- **Intervention report dates:** Collection and reported dates can be saved without times; a time requires its corresponding date. Date-only values are stored as `YYYY-MM-DD` and displayed without an invented time. Existing local date/time values remain editable. The report chronology check compares times only when both are known on the same day.
- **Inpatient admission and discharge:** Each `ipdEncounters` entry represents one hospital stay and has an ID, patient and facility IDs, optional primary practitioner ID, admission date and optional time, admission type/source, diagnosis text and optional unvalidated ICD-10 code, complaint, ward/room/bed, status, optional discharge date/time, disposition, final diagnosis/code, summary, follow-up, and creation/update timestamps. Facility and admission date are required; status Discharged also requires a discharge date and disposition. Dates cannot be in the future or discharge before admission; same-day times are compared only when both are known. Dates and times are stored separately without inferring a timezone. Other discharge details can be saved while a discharge is being prepared. Referenced facilities and practitioners use the existing master locks. Patient profiles can add, view, edit and delete; other profiles can view only. Inpatient sub-events, linked stays and a complete stay summary are deferred; the View action displays admission/discharge details only. No inpatient data is included in outpatient Trends.
- **Opening stock prototype:** Patients can record, view, edit or delete opening balances in the prescribed consumption unit, with order unit, conversion, reorder level and lead time. Opening quantities apply at the start of the opening date. The medicine list groups matching drug names from current prescriptions, regardless of dosing time or practitioner; all matching units must agree. Entries are snapshots, not a separate inventory master. An existing opening balance for the same medicine and unit must be edited rather than entered twice. Opening stock with receipts cannot be deleted, or moved to a date later than a linked receipt.
- **Receipts:** Patients can record, view, edit or delete receipts without a linked order, selecting an existing opening-stock medicine and entering vendor, date/time and quantity in its configured order/receipt unit. Each receipt snapshots the receiving unit, conversion and consumption unit; changing the opening-stock conversion does not change existing receipts. A receipt cannot predate the opening date; receipts on that date are added to the start-of-day balance, so they must not already be included in the opening count. Order-linked receipts will be added when orders are implemented.
- **Practice-type filters:** Opening stock and receipts can be filtered by the practice type of matching current prescriptions. The filter applies to both the medicine selector and saved entries. A shared medicine appears under each matching practice type without creating separate balances. Entries without a matching current prescription remain visible under All; filtering does not change saved data or stock calculations.
- **Safety stock report:** Daily dosage sums quantity × daily periods across latest open prescriptions with matching medicine names and units. Report and order rows are grouped by current prescription practice types; medicines shared across practice types appear once in a labelled shared group, and items with no current prescription appear separately. Estimated stock is opening quantity plus recorded receipts in consumption units less matching quantities logged as taken on or after the opening date, including logs from prescriptions subsequently closed or superseded. Complete days of stock is the estimated stock divided by daily dosage, rounded down; negative or unavailable stock and unavailable dosage do not yield a coverage estimate. New logs snapshot the prescribed quantity and unit; older logs with unknown quantities make the estimate unavailable. Patients can edit a log to enter the actual quantity and unit if known. The reorder trigger is dosage × (lead time + one day), separate from the manually entered reorder level. At or below the trigger, suggested orders target 30 days of supply after delivery, rounded up to whole order units. The report flags possible shortages before delivery and negative estimates.
- **Stock limitations:** Unrecorded receipts and purchases, adjustments, outstanding orders and unlogged consumption are not included. Estimates can differ from physical stock, and suggestions can repeat until the receipt is recorded. System-suggested lead time remains unavailable without linked order/receipt history. Medicines are matched by name, not formulation or strength; check physical stock and concurrent prescriptions. Not for clinical use.
- **Advanced Analytics:** Search and select multiple recorded lab parameters for the current patient. Each chart uses its own unit and vertical scale based on its readings, which remains visible while scrolling; reference ranges are not shown. As in Lab Test Trend, charts show only that parameter's recorded dates, equally spaced rather than proportional to elapsed time. Charts scroll independently; their date labels and positions can differ. The plotted points are actual readings; connecting lines do not represent additional measurements, and comparisons do not establish causation. Selection lasts only for the current page visit. The existing Trends page is unchanged.
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

Admin role with sign-up approval and profile maintenance, email verification, Forgot password, captcha, Care-giver access, a patient timeline, and additional reports.
