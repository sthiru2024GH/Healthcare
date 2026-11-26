(() => {
  "use strict";

  const STORE_KEY = "medipulse-demo-v1";
  const USER_KEY = "medipulse-demo-user-v1";
  const PROFILES_KEY = "medipulse-demo-profiles-v1";
  const avatarColors = ["", "avatar-peach", "avatar-blue", "avatar-green", "avatar-rose", "avatar-lilac"];
  const groups = {
    practiceTypes: {
      label: "Practice type", icon: "PT", prefix: "PRAC",
      columns: [["name", "Practice type"], ["description", "Description"], ["specializations", "Specializations"], ["status", "Status"]],
      fields: [
        { key: "name", label: "Practice type", required: true },
        { key: "description", label: "Description", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    prescriptionTypes: {
      label: "Prescription type", icon: "RX", prefix: "RXT",
      columns: [["practiceIds", "Practice types"], ["name", "Prescription type"], ["status", "Status"]],
      fields: [
        { key: "practiceIds", label: "Practice types", type: "relations", group: "practiceTypes", required: true, full: true },
        { key: "name", label: "Prescription type", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    specializations: {
      label: "Specialization", icon: "SP", prefix: "SPEC",
      columns: [["name", "Specialization"], ["practiceId", "Practice type"], ["standardCode", "Standard code"], ["status", "Status"]],
      fields: [
        { key: "practiceId", label: "Parent practice type", type: "relation", group: "practiceTypes", required: true },
        { key: "name", label: "Specialization", required: true },
        { key: "clinicalScope", label: "Clinical scope", type: "textarea", full: true },
        { key: "standardCode", label: "SNOMED-CT code" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    userProfiles: {
      label: "User profile", icon: "UP", prefix: "USER",
      columns: [["name", "User profile"], ["access", "Access tier"], ["description", "Description"], ["status", "Status"]],
      fields: [
        { key: "name", label: "User profile", required: true },
        { key: "access", label: "Access tier" },
        { key: "description", label: "Description", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    facilityTypes: {
      label: "Facility type", icon: "FT", prefix: "FAC",
      columns: [["name", "Facility type"], ["description", "Description"], ["capabilities", "Capabilities"], ["status", "Status"]],
      fields: [
        { key: "name", label: "Facility type", required: true },
        { key: "description", label: "Description", type: "textarea", full: true },
        { key: "capabilities", label: "Capabilities" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    facilities: {
      label: "Facilities", icon: "FC", prefix: "FCLT",
      columns: [["facilityTypeId", "Facility type"], ["name", "Facility name"], ["address", "Address"], ["status", "Status"]],
      fields: [
        { key: "facilityTypeId", label: "Facility type", type: "relation", group: "facilityTypes", required: true },
        { key: "name", label: "Facility name", required: true },
        { key: "address", label: "Address", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    tests: {
      label: "Tests", icon: "TS", prefix: "TEST",
      columns: [["testSubgroup", "Subgroup"], ["name", "Category (test panel)"], ["description", "Description"], ["parameterCount", "Parameters"], ["status", "Status"]],
      fields: [
        { key: "testSubgroup", label: "Test subgroup", type: "select", options: ["Clinical", "Interventional"], required: true },
        { key: "name", label: "Category (test panel)", required: true },
        { key: "description", label: "Description", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    parameters: {
      label: "Health parameters", icon: "HP", prefix: "PARAM",
      columns: [["testId", "Category"], ["name", "Parameter"], ["unit", "Unit"], ["maleLimits", "Male reference limits"], ["femaleLimits", "Female reference limits"], ["status", "Status"]],
      fields: [
        { key: "testId", label: "Category", type: "relation", group: "tests", required: true },
        { key: "name", label: "Parameter name", required: true },
        { key: "unit", label: "Standard unit" },
        { key: "maleLimits", label: "Male reference limits", required: true },
        { key: "femaleLimits", label: "Female reference limits", required: true },
        { key: "significance", label: "Clinical significance", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    limitBands: {
      label: "Limit bands", icon: "LB", prefix: "BAND",
      columns: [["parameterId", "Parameter / vital"], ["name", "Band"], ["sex", "Applies to"], ["ageRange", "Age (years)"], ["range", "Range"], ["severity", "Severity"], ["status", "Status"]],
      fields: [
        { key: "parameterId", label: "Health parameter / Vital", type: "measure", required: true },
        { key: "name", label: "Band label (e.g. Prediabetes)", required: true },
        { key: "sex", label: "Applies to", type: "select", options: ["All", "Male", "Female"] },
        { key: "ageFrom", label: "Age from (years)", type: "number" },
        { key: "ageTo", label: "Age to (years)", type: "number" },
        { key: "lower", label: "Lower limit (from)", type: "number" },
        { key: "upper", label: "Upper limit (up to)", type: "number" },
        { key: "severity", label: "Severity", type: "select", options: ["Normal", "Borderline", "Abnormal", "Critical"] },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    vitalCategories: {
      label: "Vital categories", icon: "VC", prefix: "VCAT",
      columns: [["name", "Vital category"], ["vitalCount", "Vitals"], ["status", "Status"]],
      fields: [
        { key: "name", label: "Vital category", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    vitals: {
      label: "Vitals", icon: "VT", prefix: "VITAL",
      columns: [["vitalCategoryId", "Category"], ["name", "Vital"], ["unit", "Unit"], ["maleLimits", "Adult male limits"], ["femaleLimits", "Adult female limits"], ["status", "Status"]],
      fields: [
        { key: "vitalCategoryId", label: "Category", type: "relation", group: "vitalCategories", required: true },
        { key: "name", label: "Vital name", required: true },
        { key: "unit", label: "Standard unit" },
        { key: "maleLimits", label: "Adult male limits", required: true },
        { key: "femaleLimits", label: "Adult female limits", required: true },
        { key: "thresholds", label: "Target / clinical thresholds", type: "textarea", full: true },
        { key: "significance", label: "Clinical significance", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    symptoms: {
      label: "Symptoms", icon: "SY", prefix: "SYMP",
      columns: [["name", "Symptom / presentation"], ["source", "Source"], ["testCount", "Diagnostic tests"], ["status", "Status"]],
      fields: [
        { key: "name", label: "Symptom / presentation", required: true },
        { key: "source", label: "Source", type: "select", options: ["Standard", "Patient"] },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    symptomTests: {
      label: "Symptom diagnostic tests", icon: "ST", prefix: "SYTS",
      columns: [["symptomId", "Symptom"], ["name", "Diagnostic test"], ["category", "Category"], ["purpose", "Primary purpose / indication"], ["status", "Status"]],
      fields: [
        { key: "symptomId", label: "Symptom / presentation", type: "relation", group: "symptoms", required: true },
        { key: "name", label: "Diagnostic test name", required: true },
        { key: "category", label: "Category" },
        { key: "purpose", label: "Primary purpose / indication", type: "textarea", full: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    interventionMethods: {
      label: "Intervention Method", icon: "IM", prefix: "METH",
      columns: [["practiceId", "Practice type"], ["name", "Intervention Method"], ["status", "Status"]],
      fields: [
        { key: "practiceId", label: "Practice type", type: "relation", group: "practiceTypes", required: true },
        { key: "name", label: "Intervention Method", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    },
    practitioners: {
      label: "Practitioners", icon: "PR", prefix: "PRCT", patientOnly: true,
      columns: [["name", "Name"], ["specializationId", "Specialization"], ["practiceId", "Medical practice"], ["status", "Status"]],
      fields: [
        { key: "practiceId", label: "Medical practice", type: "relation", group: "practiceTypes", required: true },
        { key: "specializationId", label: "Specialization", type: "relation", group: "specializations", required: true },
        { key: "name", label: "Name", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Draft", "Staged"] }
      ]
    }
  };

  function visibleGroups() {
    const isPatient = getUser()?.role === "Patient";
    return Object.entries(groups).filter(([, group]) => !group.patientOnly || isPatient);
  }

  const seed = {
    practiceTypes: [
      { id: "PRAC-ALLO-01", name: "Allopathy", description: "Modern evidence-based medicine", status: "Active" },
      { id: "PRAC-AYUR-02", name: "Ayurveda", description: "Traditional Indian system of medicine", status: "Active" },
      { id: "PRAC-HOME-03", name: "Homeopathy", description: "Individualized complementary practice", status: "Draft" },
      { id: "PRAC-NATU-04", name: "Naturopathy & Yoga", description: "Lifestyle-led integrative practice", status: "Active" }
    ],
    specializations: [
      { id: "SPEC-CARD-04", name: "Cardiology", practiceId: "PRAC-ALLO-01", clinicalScope: "Cardiovascular medicine and coronary care", standardCode: "SNOMED-394579002", status: "Active" },
      { id: "SPEC-NEPH-05", name: "Nephrology", practiceId: "PRAC-ALLO-01", clinicalScope: "Kidney health and renal medicine", standardCode: "SNOMED-394589003", status: "Active" },
      { id: "SPEC-PEDI-06", name: "Pediatrics", practiceId: "PRAC-ALLO-01", clinicalScope: "Health and care for children", standardCode: "SNOMED-394537008", status: "Active" },
      { id: "SPEC-ORTH-07", name: "Orthopedics", practiceId: "PRAC-ALLO-01", clinicalScope: "Musculoskeletal health", standardCode: "SNOMED-394801008", status: "Draft" }
    ],
    userProfiles: [
      { id: "USER-PRACT-01", name: "Practitioner", access: "Clinical workspace", description: "Care team member", status: "Active" },
      { id: "USER-PAT-02", name: "Patient", access: "Personal care portal", description: "Person receiving care", status: "Active" },
      { id: "USER-CARE-03", name: "Care-giver", access: "Delegated support", description: "Authorized care support", status: "Active" },
      { id: "USER-GUEST-04", name: "Guest / Consulting Specialist", access: "Shared visit", description: "Invited collaborating specialist", status: "Staged" }
    ],
    facilityTypes: [
      { id: "FAC-HOSP-01", name: "Super-Speciality Hospital", description: "Multidisciplinary inpatient and outpatient care", capabilities: "Inpatient · Diagnostics", status: "Active" },
      { id: "FAC-CLIN-02", name: "Outpatient Clinic", description: "Ambulatory and follow-up visits", capabilities: "Consultations · Vitals", status: "Active" },
      { id: "FAC-LAB-04", name: "Diagnostic Test Lab", description: "Clinical laboratory services", capabilities: "Laboratory · Calibration", status: "Active" },
      { id: "FAC-IMG-05", name: "Imaging & Scan Centre", description: "Diagnostic imaging services", capabilities: "Imaging · Reporting", status: "Draft" }
    ],
    facilities: [],
    prescriptionTypes: [],
    limitBands: [],
    tests: [],
    parameters: [],
    vitalCategories: [],
    vitals: [],
    symptoms: [],
    symptomTests: [],
    interventionMethods: [
      { id: "METH-DIAG-01", name: "Diagnosis", practiceId: "PRAC-ALLO-01", status: "Active" },
      { id: "METH-SURG-02", name: "Surgery", practiceId: "PRAC-ALLO-01", status: "Active" },
      { id: "METH-PROC-03", name: "Procedure", practiceId: "PRAC-ALLO-01", status: "Active" },
      { id: "METH-LAB-04", name: "Lab Test", practiceId: "PRAC-ALLO-01", status: "Active" }
    ],
    practitioners: [],
    prescriptions: [],
    prescriptionDiagnoses: [],
    prescriptionMedications: [],
    interventionPrescriptions: [],
    interventionItems: [],
    interventionReports: [],
    ipdEncounters: [],
    medicationLogs: [],
    labResults: [],
    openingStocks: [],
    stockReceipts: [],
    vitalReadings: []  };

  const appointments = [
    { time: "09:30", duration: "30 min", name: "Jordan Mitchell", initials: "JM", color: "", detail: "Follow-up · Cardiology", type: "tele", action: "Join tele-consult", primary: true, badge: "UP NEXT" },
    { time: "10:15", duration: "45 min", name: "Alex Lee", initials: "AL", color: "avatar-lilac", detail: "Initial visit · General", type: "inperson", action: "Start exam / check-in", primary: false },
    { time: "11:00", duration: "30 min", name: "Casey Patel", initials: "CP", color: "avatar-peach", detail: "Medication review · Cardiology", type: "tele", action: "Join tele-consult", primary: true },
    { time: "13:15", duration: "30 min", name: "Sam Rivera", initials: "SR", color: "avatar-blue", detail: "Care plan · General", type: "tele", action: "Join tele-consult", primary: true },
    { time: "14:00", duration: "45 min", name: "Taylor Brooks", initials: "TB", color: "avatar-green", detail: "Follow-up · Nephrology", type: "inperson", action: "Start exam / check-in", primary: false },
    { time: "15:30", duration: "30 min", name: "Morgan Chen", initials: "MC", color: "avatar-rose", detail: "Results review · Cardiology", type: "tele", action: "Join tele-consult", primary: true }
  ];

  let state = null;
  let activeGroup = "practiceTypes";
  let activeTestId = "TEST-LIPID-02";
  let editingRecordId = null;
  let dialogMode = "edit";

  function showToast(message, isError) {
    const region = document.querySelector(".toast-region");
    if (!region) return;
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " toast-error" : ""}`;
    toast.textContent = message;
    region.append(toast);
    window.setTimeout(() => toast.remove(), 4200);
  }

  function loadState() {
    try {
      const saved = window.localStorage.getItem(STORE_KEY);
      if (!saved) return structuredClone(seed);
      const parsed = JSON.parse(saved);
      for (const key of Object.keys(groups)) {
        if (parsed[key] === undefined && seed[key]) parsed[key] = structuredClone(seed[key]);
        if (!Array.isArray(parsed[key])) throw new Error(`Saved demo data is missing the ${key} directory.`);
      }
      for (const key of ["prescriptions", "prescriptionDiagnoses", "prescriptionMedications", "interventionPrescriptions", "interventionItems", "medicationLogs", "vitalReadings", "labResults", "openingStocks"]) {
        if (!Array.isArray(parsed[key])) parsed[key] = [];
      }
      if (parsed.stockReceipts === undefined) parsed.stockReceipts = [];
      else if (!Array.isArray(parsed.stockReceipts)) throw new Error("Saved receipt data is invalid.");
      if (parsed.interventionReports === undefined) parsed.interventionReports = [];
      else if (!Array.isArray(parsed.interventionReports)) throw new Error("Saved intervention report data is invalid.");
      if (parsed.ipdEncounters === undefined) parsed.ipdEncounters = [];
      else if (!Array.isArray(parsed.ipdEncounters)) throw new Error("Saved admission data is invalid.");
      return parsed;
    } catch (error) {
      if (error instanceof SyntaxError || error instanceof TypeError || error instanceof Error) {
        console.error("Unable to load MediPulse demo data.", error);
        window.setTimeout(() => showToast("Saved demo data could not be read. Showing the sample records for this visit.", true), 0);
        return structuredClone(seed);
      }
      throw error;
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
      const stamp = document.querySelector("[data-last-updated]");
      if (stamp) stamp.innerHTML = 'Just now <i>in this browser</i>';
      return true;
    } catch (error) {
      console.error("Unable to save MediPulse demo data.", error);
      showToast("The browser could not save this change. Check local storage permissions.", true);
      return false;
    }
  }

  function migratePrescriptions() {
    if (state.prescriptionTypesMigrationVersion === 1) return true;
    const ids = new Set(state.prescriptions.map(item => item.id));
    if (state.interventionPrescriptions.some(item => ids.has(item.id))) {
      showToast("Prescription migration stopped: duplicate prescription IDs require review.", true);
      console.error("Prescription migration stopped: duplicate prescription IDs.");
      return false;
    }
    const old = state;
    const legacyInterventions = structuredClone(state.interventionPrescriptions);
    state = {
      ...state,
      legacyInterventionBackup: { prescriptions: legacyInterventions, items: structuredClone(state.interventionItems) },
      prescriptions: [
        ...state.prescriptions.map(item => ({ ...item, typeName: item.typeName || "Clinical" })),
        ...state.interventionPrescriptions.map(item => ({ ...item, typeName: "Interventional", closed: false }))
      ],
      interventionItems: state.interventionItems.map(item => ({ ...item, prescriptionId: item.interventionPrescriptionId })),
      interventionPrescriptions: [],
      prescriptionTypesMigrationVersion: 1
    };
    if (saveState()) return true;
    state = old;
    return false;
  }

  function getUser() {
    try {
      const value = window.localStorage.getItem(USER_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Unable to load the local demo profile.", error);
      showToast("The local demo profile could not be read.", true);
      return null;
    }
  }

  function canManageRecords() {
    return getUser()?.role === "Patient";
  }

  function requirePatientProfile() {
    if (canManageRecords()) return true;
    showToast("Only Patient profiles can add, edit or delete demo records. This profile is view-only.", true);
    return false;
  }

  function htmlEscape(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function initials(name) {
    return String(name || "Demo User").trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join("").toUpperCase();
  }

  function renderSiteHeader() {
    const mount = document.querySelector("[data-site-header]");
    if (!mount) return;
    mount.innerHTML = `
      <a class="brand" href="index.html" aria-label="MediPulse home"><span class="brand-symbol">✳</span><span>MediPulse</span></a>
      <nav class="site-nav" aria-label="Main navigation"><a href="#care">Your care</a><a href="#portals">Care portals</a><a href="login.html?role=Patient">About MediPulse</a></nav>
      <div class="site-header-actions"><a class="button button-secondary" href="login.html?role=Patient">Log in</a><a class="button button-primary" href="login.html?mode=signup&amp;role=Patient">Get started <span aria-hidden="true">→</span></a></div>`;
  }

  function renderAppHeader(page) {
    const mount = document.querySelector("[data-app-header]");
    if (!mount) return;
    const user = getUser();
    const displayName = user?.fullName || (user?.role === "Practitioner" ? "Dr. Morgan" : user?.role || "Dr. Morgan");
    const role = user?.role || "Practitioner";
    const current = page === "groups" ? "groups-master.html" : page === "tests" ? "tests-parameters-studio.html" : "dashboard.html";
    const patientLinks = role === "Patient" ? '<a href="practitioners.html">Practitioners</a>' : "";
    const patientGroupLink = role === "Patient" ? '<a href="groups-master.html?group=practitioners">Practitioners</a>' : "";
    mount.innerHTML = `
      <a class="brand brand-small" href="dashboard.html"><span class="brand-symbol">✳</span><span>MediPulse</span></a>
      <nav class="app-nav" aria-label="Clinical workspace navigation">
        <a href="dashboard.html" class="${current === "dashboard.html" ? "is-current" : ""}">Workspace</a>
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Groups master <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="groups-master.html">All directories</a><a href="groups-master.html?group=practiceTypes">Practice types</a><a href="groups-master.html?group=prescriptionTypes">Prescription type</a><a href="groups-master.html?group=specializations">Specializations</a><a href="groups-master.html?group=userProfiles">User profiles</a><a href="groups-master.html?group=facilityTypes">Facility types</a><a href="groups-master.html?group=facilities">Facilities</a><a href="groups-master.html?group=tests">Tests</a><a href="groups-master.html?group=parameters">Health parameters</a><a href="groups-master.html?group=limitBands">Limit bands</a><a href="groups-master.html?group=vitals">Vitals</a><a href="groups-master.html?group=symptoms">Symptoms</a><a href="groups-master.html?group=interventionMethods">Intervention Method</a>${patientGroupLink}</div></div>
        ${patientLinks}
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Events <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="symptoms.html">Symptoms</a><a href="prescriptions.html">Prescriptions</a><a href="dashboard.html">Medications</a><a href="vitals.html">Vitals</a><a href="labtests.html">Lab Tests</a><a href="interventions.html">Interventions</a><a href="inpatient.html">In-Patient Admissions</a></div></div>
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Reports <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="dashboard.html">Timeline chart</a><a href="dashboard.html">Trends</a><a href="safety-stock.html">Stocks — Safety stock</a></div></div>
                <div class="nav-menu"><button class="nav-menu-trigger${page === "analytics" || page === "abnormal" || page === "advanced-analytics" ? " is-current" : ""}" type="button">Analytics <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="analytics.html">Trends</a><a href="advanced-analytics.html">Advanced Analytics</a><a href="abnormal.html">Abnormal results</a></div></div>
                <a href="dashboard.html">Help</a>
      </nav>
      <div class="app-header-right"><span class="demo-pill"><span class="live-dot"></span> DEMO</span><button class="profile-button" type="button" data-action="sign-out" aria-label="Sign out of demo session"><span class="profile-avatar">${htmlEscape(initials(displayName))}</span><span class="profile-meta"><b>${htmlEscape(displayName)}</b><small>${htmlEscape(role)}${user?.gender ? ` · ${htmlEscape(user.gender.split(" ")[0])}` : ""}</small></span><span class="nav-caret">⌄</span></button></div>`;
  }

  function renderAppointments(filter) {
    const mount = document.querySelector("[data-appointment-list]");
    if (!mount) return;
    const visible = appointments.filter(item => filter === "all" || item.type === filter);
    mount.innerHTML = visible.map((item, index) => `
      <article class="appointment-card${item.primary && item.badge ? " is-next" : ""}">
        <div class="appointment-timeblock"><b>${item.time}</b><small>${item.duration}</small></div>
        <div class="appointment-person"><span class="patient-avatar ${item.color}">${item.initials}</span><div><b>${item.name}</b><small>${item.detail}</small></div></div>
        <div class="appointment-actions">${item.badge ? `<span class="status status-active appointment-badge">${item.badge}</span>` : ""}<button type="button" class="appointment-action${item.primary ? " action-primary" : ""}" data-appointment-action="${htmlEscape(item.action)}" data-patient="${htmlEscape(item.name)}">${htmlEscape(item.action)}</button><button type="button" class="appointment-action" data-appointment-action="Patient chart" data-patient="${htmlEscape(item.name)}">Patient chart</button></div>
      </article>`).join("");
    mount.dataset.count = String(visible.length);
  }

  function relationLabel(field, value) {
    if (field === "parameterId") return measureById(value)?.name || "Unlinked";
    if (field === "practiceId") return state.practiceTypes.find(record => record.id === value)?.name || "Unlinked";
    if (field === "facilityTypeId") return state.facilityTypes.find(record => record.id === value)?.name || "Unlinked";
    if (field === "testId") return state.tests.find(record => record.id === value)?.name || "Unlinked";
    if (field === "vitalCategoryId") return state.vitalCategories.find(record => record.id === value)?.name || "Unlinked";
    if (field === "symptomId") return state.symptoms.find(record => record.id === value)?.name || "Unlinked";
    if (field === "specializationId") return state.specializations.find(record => record.id === value)?.name || "Unlinked";
    return value;
  }

  function isClinicalTest(test) {
    return test && (!test.testSubgroup || test.testSubgroup === "Clinical");
  }

  function statusClass(status) {
    const value = String(status || "").toLowerCase();
    if (value === "active") return "status-active";
    if (value === "draft" || value === "staged") return "status-warning";
    if (value === "deleted") return "status-neutral";
    return "status-neutral";
  }

  function relatedCount(groupKey, record) {
    if (groupKey === "practiceTypes") return state.specializations.filter(child => child.practiceId === record.id && child.status !== "Deleted").length;
    if (groupKey === "tests") return state.parameters.filter(child => child.testId === record.id && child.status !== "Deleted").length;
    if (groupKey === "vitalCategories") return state.vitals.filter(child => child.vitalCategoryId === record.id && child.status !== "Deleted").length;
    if (groupKey === "symptoms") return state.symptomTests.filter(child => child.symptomId === record.id && child.status !== "Deleted").length;
    if (groupKey === "parameters") return null;
    return null;
  }

  // A limit band targets either a lab health parameter or a vital; their ids never overlap.
  function measureById(id) {
    const parameter = state.parameters.find(item => item.id === id);
    if (parameter) return { kind: "parameter", name: `${state.tests.find(test => test.id === parameter.testId)?.name || "Unlinked"} — ${parameter.name}`, live: parameter.status !== "Deleted" };
    const vital = state.vitals.find(item => item.id === id);
    if (vital) return { kind: "vital", name: `${state.vitalCategories.find(category => category.id === vital.vitalCategoryId)?.name || "Unlinked"} — ${vital.name}`, live: vital.status !== "Deleted" };
    return null;
  }

  function activeAge() {
    const user = getUser();
    if (user?.role !== "Patient" || !user.dob) return null;
    const born = new Date(`${user.dob}T00:00:00`);
    if (Number.isNaN(born.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - born.getFullYear();
    if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) age -= 1;
    return age < 0 ? null : age;
  }

  // Bands with an age range apply only when the patient's age is known (from date of birth).
  function bandFor(measureId, rawValue) {
    const value = Number(rawValue);
    if (rawValue === "" || rawValue === null || rawValue === undefined || Number.isNaN(value)) return null;
    const gender = activeGender();
    const age = activeAge();
    const hasAge = band => band.ageFrom !== undefined || band.ageTo !== undefined;
    const ageOk = band => !hasAge(band) || (age !== null
      && (band.ageFrom === undefined || age >= band.ageFrom) && (band.ageTo === undefined || age <= band.ageTo));
    return state.limitBands.find(band => band.parameterId === measureId && band.status === "Active" && ageOk(band)
      && (!band.sex || band.sex === "All" || band.sex === gender)
      && (band.lower === undefined || value >= band.lower) && (band.upper === undefined || value < band.upper)) || null;
  }

  function bandBadge(measureId, rawValue) {
    const band = bandFor(measureId, rawValue);
    return band ? `<span class="band-badge band-${htmlEscape(String(band.severity || "Normal").toLowerCase())}">${htmlEscape(band.name)}</span>` : "";
  }

  function boundsText(lower, upper, empty) {
    const has = value => value !== undefined && value !== null && value !== "";
    if (has(lower) && has(upper)) return `${lower} – ${upper}`;
    if (has(lower)) return `≥ ${lower}`;
    if (has(upper)) return `< ${upper}`;
    return empty;
  }

  function displayValue(groupKey, record, field) {
    if (field === "status") return `<span class="status ${statusClass(record.status)}">${htmlEscape(record.status || "Active").toUpperCase()}</span>`;
    if (field === "specializationId" && !record.specializationId) return htmlEscape(record.specialization || "—");
    if (field === "practiceIds") return htmlEscape((record.practiceIds || []).map(id => relationLabel("practiceId", id)).join(", ") || "—");
    if (field === "testSubgroup") return htmlEscape(record.testSubgroup || "Clinical");
    if (field === "parameterCount" && !isClinicalTest(record)) return "Not configured";
    if (field === "parameterId") return htmlEscape(relationLabel(field, record[field]));
    if (field === "sex") return htmlEscape(record.sex || "All");
    if (field === "ageRange") return htmlEscape(boundsText(record.ageFrom, record.ageTo, "Any age"));
    if (field === "range") return htmlEscape(boundsText(record.lower, record.upper, "—"));
    if (field === "testId" || field === "vitalCategoryId" || field === "symptomId" || field === "facilityTypeId") return htmlEscape(relationLabel(field, record[field]));
    if (field === "testCount") return `${relatedCount(groupKey, record)} linked`;
    if (field === "practiceId" || field === "specializationId") return htmlEscape(relationLabel(field, record[field]));
    if (field === "specializations") return `${relatedCount(groupKey, record)} linked`;
    if (field === "vitalCount") return `${relatedCount(groupKey, record)} bound`;
    if (field === "parameterCount") return `${relatedCount(groupKey, record)} bound`;
    return htmlEscape(record[field] || "—");
  }

  function renderGroups() {
    const tabs = document.querySelector("[data-directory-tabs]");
    const head = document.querySelector("[data-table-head]");
    const body = document.querySelector("[data-table-body]");
    if (!tabs || !head || !body) return;
    const canManage = canManageRecords();
    if (groups[activeGroup].patientOnly && !canManage) activeGroup = "practiceTypes";
    const addButton = document.querySelector("[data-action='add-record']");
    if (addButton) addButton.hidden = !canManage;
    const importButton = document.querySelector("[data-import-vitals]");
    if (importButton) importButton.hidden = !canManage || !activeGroup.startsWith("vital");
    const symptomsImport = document.querySelector("[data-import-symptoms]");
    if (symptomsImport) symptomsImport.hidden = !canManage || !activeGroup.startsWith("symptom");
    const accessNote = document.querySelector("[data-master-access-note]");
    if (accessNote) accessNote.hidden = canManage;
    tabs.innerHTML = visibleGroups().map(([key, group]) => `<button type="button" role="tab" aria-selected="${activeGroup === key}" class="directory-tab${activeGroup === key ? " is-active" : ""}" data-group="${key}">${group.label}<span>${state[key].filter(record => record.status !== "Deleted").length}</span></button>`).join("");
    const definition = groups[activeGroup];
    head.innerHTML = `<tr>${definition.columns.map(([, label]) => `<th>${htmlEscape(label.toUpperCase())}</th>`).join("")}<th>ACTIONS</th></tr>`;
    const search = (document.querySelector("[data-record-search]")?.value || "").trim().toLowerCase();
    const statusFilter = document.querySelector("[data-status-filter]")?.value || "all";
    const categoryWrap = document.querySelector("[data-category-filter]");
    const categorySelect = document.querySelector("[data-category-select]");
    if (categoryWrap && categorySelect) {
      categoryWrap.hidden = activeGroup !== "parameters";
      const current = categorySelect.value;
      categorySelect.innerHTML = `<option value="">All test categories</option>${state.tests.filter(item => item.status !== "Deleted" && isClinicalTest(item)).sort((a, b) => a.name.localeCompare(b.name)).map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
      categorySelect.value = [...categorySelect.options].some(option => option.value === current) ? current : "";
    }
    const categoryFilter = activeGroup === "parameters" ? categorySelect?.value || "" : "";
    const subgroupFilter = activeGroup === "tests" ? document.querySelector("[data-test-subgroup-filter]")?.value || "all" : "all";
    const subgroupWrap = document.querySelector("[data-test-subgroup-wrap]");
    if (subgroupWrap) subgroupWrap.hidden = activeGroup !== "tests";
    const records = state[activeGroup].filter(record => {
      const matchesSearch = `${record.id} ${Object.values(record).join(" ")}`.toLowerCase().includes(search);
      const matchesStatus = statusFilter === "all" || String(record.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus && (!categoryFilter || record.testId === categoryFilter) && (subgroupFilter === "all" || (record.testSubgroup || "Clinical") === subgroupFilter);
    });
    body.innerHTML = records.map(record => `<tr data-record-id="${htmlEscape(record.id)}">${definition.columns.map(([field]) => `<td${["description", "purpose", "address"].includes(field) ? ' class="wrap-cell"' : ""}>${displayValue(activeGroup, record, field)}</td>`).join("")}<td><div class="table-actions"><button class="table-action" type="button" data-record-action="view" data-id="${htmlEscape(record.id)}" aria-label="View ${htmlEscape(record.name)}">V</button>${canManage ? `<button class="table-action" type="button" data-record-action="edit" data-id="${htmlEscape(record.id)}" aria-label="Edit ${htmlEscape(record.name)}">E</button><button class="table-action delete" type="button" data-record-action="delete" data-id="${htmlEscape(record.id)}" aria-label="Delete ${htmlEscape(record.name)}"${record.status === "Deleted" ? " disabled" : ""}>D</button>` : ""}</div></td></tr>`).join("");
    document.querySelector("[data-record-count]").textContent = `${records.length} ${records.length === 1 ? "record" : "records"}`;
    document.querySelector("[data-empty-state]").hidden = records.length > 0;
    const orphanCount = countOrphans();
    const groupTotal = document.querySelector("[data-group-total]");
    if (groupTotal) groupTotal.textContent = String(visibleGroups().length).padStart(2, "0");
    document.querySelector("[data-orphan-count]").textContent = String(orphanCount);
  }

  function countOrphans() {
    const missingPractices = [...state.specializations, ...state.practitioners, ...state.interventionMethods].filter(item => item.status !== "Deleted" && !state.practiceTypes.some(parent => parent.id === item.practiceId && parent.status !== "Deleted")).length;
    const missingPrescriptionPractices = state.prescriptionTypes.filter(item => item.status !== "Deleted").reduce((count, item) => count + (item.practiceIds || []).filter(id => !state.practiceTypes.some(parent => parent.id === id && parent.status !== "Deleted")).length, 0);
    const missingTests = state.parameters.filter(item => item.status !== "Deleted" && !state.tests.some(parent => parent.id === item.testId && parent.status !== "Deleted")).length;
    const missingVitals = state.vitals.filter(item => item.status !== "Deleted" && !state.vitalCategories.some(parent => parent.id === item.vitalCategoryId && parent.status !== "Deleted")).length;
    const missingSymptoms = state.symptomTests.filter(item => item.status !== "Deleted" && !state.symptoms.some(parent => parent.id === item.symptomId && parent.status !== "Deleted")).length;
    const missingBands = state.limitBands.filter(item => item.status !== "Deleted" && !measureById(item.parameterId)?.live).length;
    const missingFacilityTypes = state.facilities.filter(item => item.status !== "Deleted" && !state.facilityTypes.some(parent => parent.id === item.facilityTypeId && parent.status !== "Deleted")).length;
    return missingPractices + missingPrescriptionPractices + missingTests + missingVitals + missingSymptoms + missingFacilityTypes + missingBands;
  }

  function makeField(field, value, disabled) {
    const required = field.required && !disabled ? " required" : "";
    const isFull = field.full ? " full-width" : "";
    const val = value ?? "";
    let input;
    if (field.type === "relations") {
      const selected = Array.isArray(value) ? value : [];
      const options = state[field.group].filter(item => item.status !== "Deleted" || selected.includes(item.id));
      const choices = options.map(item => `<label class="symptom-option"><input type="checkbox" name="${field.key}" value="${htmlEscape(item.id)}"${selected.includes(item.id) ? " checked" : ""}${disabled ? " disabled" : ""}><span>${htmlEscape(item.name)}</span></label>`).join("");
      return `<fieldset class="record-field symptom-picker${isFull}"><legend>${htmlEscape(field.label)}${field.required && !disabled ? " *" : ""}</legend><details><summary>Select practice types</summary><div class="symptom-options">${choices || '<p class="symptom-empty-options">No practice types available.</p>'}</div></details><p class="rx-hint">Select one or more practice types.</p></fieldset>`;
    }
    if (field.type === "textarea") {
      input = `<textarea name="${field.key}"${required}${disabled ? " disabled" : ""}>${htmlEscape(val)}</textarea>`;
    } else if (field.type === "measure") {
      const group = (label, list) => `<optgroup label="${label}">${list.filter(item => item.status !== "Deleted" || item.id === val).map(item => `<option value="${htmlEscape(item.id)}"${String(val) === item.id ? " selected" : ""}>${htmlEscape(measureById(item.id).name)}</option>`).join("")}</optgroup>`;
      input = `<select name="${field.key}"${required}${disabled ? " disabled" : ""}><option value="">Select…</option>${group("Lab health parameters", state.parameters)}${group("Vitals", state.vitals)}</select>`;
    } else if (field.type === "select" || field.type === "relation") {
      const options = field.type === "relation"
        ? state[field.group].filter(item => item.status !== "Deleted" && (field.group !== "tests" || isClinicalTest(item))).map(item => [item.id, item.name])
        : field.options.map(option => [option, option]);
      input = `<select name="${field.key}"${required}${disabled ? " disabled" : ""}><option value="">Select…</option>${options.map(([optionValue, label]) => `<option value="${htmlEscape(optionValue)}"${String(val) === String(optionValue) ? " selected" : ""}>${htmlEscape(label)}</option>`).join("")}</select>`;
    } else {
      const type = field.type === "number" ? "number" : "text";
      input = `<input name="${field.key}" type="${type}" value="${htmlEscape(val)}"${type === "number" ? ' step="any"' : ""}${required}${disabled ? " disabled" : ""}>`;
    }
    return `<label class="record-field${isFull}"><span>${htmlEscape(field.label)}${field.required && !disabled ? " *" : ""}</span>${input}</label>`;
  }

  function linkSpecializationToPractice(container, selectedId) {
    const practice = container.querySelector('[name="practiceId"]');
    const specialization = container.querySelector('[name="specializationId"]');
    const fill = keepId => {
      const options = state.specializations.filter(item => item.status !== "Deleted" && item.practiceId === practice.value);
      specialization.innerHTML = `<option value="">Select…</option>${options.map(item => `<option value="${htmlEscape(item.id)}"${item.id === keepId ? " selected" : ""}>${htmlEscape(item.name)}</option>`).join("")}`;
    };
    practice.addEventListener("change", () => fill(""));
    fill(selectedId);
  }

  function openRecordDialog(mode, record) {
    if (mode !== "view" && !requirePatientProfile()) return;
    if (mode === "edit" && blockIfInUse(activeGroup, record, "edit")) return;
    const definition = groups[activeGroup];
    const dialog = document.querySelector("[data-record-dialog]");
    const form = document.querySelector("[data-record-form]");
    const heading = document.querySelector("#record-dialog-title");
    const desc = document.querySelector("[data-dialog-description]");
    const fields = document.querySelector("[data-record-form-fields]");
    const error = document.querySelector("[data-record-error]");
    dialogMode = mode;
    editingRecordId = record?.id || null;
    const readOnly = mode === "view";
    heading.textContent = mode === "add" ? `Add ${definition.label.toLowerCase()}` : mode === "view" ? `View ${definition.label.toLowerCase()}` : `Edit ${definition.label.toLowerCase()}`;
    desc.textContent = readOnly ? `Record details · ${record.id}` : mode === "add" ? "Enter the record details below." : "Update the fields below. The record ID will remain unchanged.";
    document.querySelector("[data-dialog-kicker]").textContent = definition.label.toUpperCase() + " DIRECTORY";
    document.querySelector("[data-record-submit]").textContent = mode === "add" ? "Save record" : "Save changes";
    document.querySelector("[data-record-submit]").closest("button").hidden = readOnly;
    error.hidden = true;
    // New parameters start in the category chosen in the filter.
    const values = record || (mode === "add" && activeGroup === "parameters" ? { testId: document.querySelector("[data-category-select]")?.value || "" } : mode === "add" && activeGroup === "tests" ? { testSubgroup: document.querySelector("[data-test-subgroup-filter]")?.value === "Interventional" ? "Interventional" : "Clinical" } : undefined);
    fields.innerHTML = definition.fields.map(field => makeField(field, field.key === "testSubgroup" ? values?.testSubgroup || "Clinical" : values?.[field.key], readOnly || (activeGroup === "tests" && mode === "edit" && field.key === "testSubgroup"))).join("");
    if (activeGroup === "practitioners" && !readOnly) linkSpecializationToPractice(fields, record?.specializationId);
    if (readOnly) {
      fields.insertAdjacentHTML("beforeend", makeField({ key: "recordId", label: "Record ID" }, record.id, true));
      form.querySelector('[data-action="close-record-dialog"]')?.focus();
    }
    if (!dialog.open) dialog.showModal();
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  // Detail records (in any entity) that reference this master record by key. Soft-deleted masters are ignored.
  function masterUsage(groupKey, id) {
    const live = item => item.status !== "Deleted";
    const rules = {
      practiceTypes: () => [["specializations", state.specializations.filter(item => item.practiceId === id && live(item))], ["practitioners", state.practitioners.filter(item => item.practiceId === id && live(item))], ["intervention methods", state.interventionMethods.filter(item => item.practiceId === id && live(item))], ["prescription types", state.prescriptionTypes.filter(item => (item.practiceIds || []).includes(id) && live(item))]],
      specializations: () => [["practitioners", state.practitioners.filter(item => item.specializationId === id && live(item))]],
      facilityTypes: () => [["facilities", state.facilities.filter(item => item.facilityTypeId === id && live(item))]],
      facilities: () => [["lab test records", state.labResults.filter(item => item.facilityId === id)], ["intervention reports", state.interventionReports.filter(item => item.facilityId === id)], ["inpatient admissions", state.ipdEncounters.filter(item => item.facilityId === id)]],
      parameters: () => [["limit bands", state.limitBands.filter(item => item.parameterId === id && live(item))], ["lab test records", state.labResults.filter(item => item.values.some(entry => entry.parameterId === id))]],
      practitioners: () => [["prescriptions", state.prescriptions.filter(item => item.practitionerId === id)], ["lab test records", state.labResults.filter(item => item.requestedBy === id)], ["intervention reports", state.interventionReports.filter(item => item.interventionistId === id || item.specialistId === id)], ["inpatient admissions", state.ipdEncounters.filter(item => item.practitionerId === id)]],
      prescriptionTypes: () => [["prescriptions", state.prescriptions.filter(item => item.prescriptionTypeId === id)]],
      tests: () => [["parameters", state.parameters.filter(item => item.testId === id && live(item))], ["prescription diagnoses", state.prescriptionDiagnoses.filter(item => item.testId === id)], ["lab test records", state.labResults.filter(item => item.testId === id)], ["intervention reports", state.interventionReports.filter(item => item.testId === id)]],
      vitalCategories: () => [["vitals", state.vitals.filter(item => item.vitalCategoryId === id && live(item))]],
      vitals: () => [["vitals readings", state.vitalReadings.filter(reading => reading.readings.some(entry => entry.vitalId === id))], ["limit bands", state.limitBands.filter(item => item.parameterId === id && live(item))]],
      symptoms: () => [["symptom tests", state.symptomTests.filter(item => item.symptomId === id && live(item))], ["symptom entries", loadSymptoms().filter(entry => Array.isArray(entry.symptoms) && entry.symptoms.some(symptom => symptom.id === id))]],
      interventionMethods: () => [["intervention prescriptions", state.interventionItems.filter(item => item.methodId === id)]]
    };
    const found = (rules[groupKey]?.() || []).filter(([, list]) => list.length);
    return { count: found.reduce((sum, [, list]) => sum + list.length, 0), text: found.map(([label, list]) => `${list.length} ${label}`).join(", ") };
  }

  function blockIfInUse(groupKey, record, action) {
    const usage = masterUsage(groupKey, record.id);
    if (!usage.count) return false;
    showToast(`Cannot ${action} ${record.name}: it is used by ${usage.text}. Remove those records first.`, true);
    return true;
  }

  function deleteRecord(id) {
    if (!requirePatientProfile()) return;
    const record = state[activeGroup].find(item => item.id === id);
    if (!record || record.status === "Deleted") return;
    if (blockIfInUse(activeGroup, record, "delete")) return;
    if (!window.confirm(`Mark “${record.name}” as deleted? This demo record will be soft-deleted.`)) return;
    const previousStatus = record.status;
    record.status = "Deleted";
    if (!saveState()) {
      record.status = previousStatus;
      return;
    }
    renderGroups();
    showToast(`${record.name} was marked as deleted.`);
  }

  function saveRecord(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (activeGroup === "tests" && !editingRecordId && !["Clinical", "Interventional"].includes(data.testSubgroup)) {
      const error = document.querySelector("[data-record-error]");
      error.textContent = "Select a valid test subgroup.";
      error.hidden = false;
      return;
    }
    if (activeGroup === "prescriptionTypes") {
      data.practiceIds = new FormData(form).getAll("practiceIds");
      const error = document.querySelector("[data-record-error]");
      if (!data.practiceIds.length || data.practiceIds.some(id => !state.practiceTypes.some(item => item.id === id && item.status !== "Deleted"))) {
        error.textContent = "Select at least one available practice type.";
        error.hidden = false;
        return;
      }
      const name = data.name.trim();
      if (!name) {
        error.textContent = "Enter a prescription type.";
        error.hidden = false;
        return;
      }
      if (state.prescriptionTypes.some(item => item.id !== editingRecordId && item.status !== "Deleted" && item.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
        error.textContent = "This prescription type already exists. Edit it to select additional practice types.";
        error.hidden = false;
        return;
      }
      data.name = name;
    }
    const numericFields = groups[activeGroup].fields.filter(field => field.type === "number").map(field => field.key);
    for (const field of numericFields) {
      if (data[field] !== "") data[field] = Number(data[field]);
      else delete data[field];
    }
    if (activeGroup === "practitioners") {
      const spec = state.specializations.find(item => item.id === data.specializationId);
      if (!spec || spec.practiceId !== data.practiceId) {
        const error = document.querySelector("[data-record-error]");
        error.textContent = "The selected specialization does not belong to the chosen medical practice.";
        error.hidden = false;
        return;
      }
    }
    const existing = editingRecordId ? state[activeGroup].find(item => item.id === editingRecordId) : null;
    if (existing && blockIfInUse(activeGroup, existing, "edit")) return;
    if (activeGroup === "limitBands") {
      const error = document.querySelector("[data-record-error]");
      const has = value => value !== undefined;
      const problem = !has(data.lower) && !has(data.upper) ? "Enter a lower limit, an upper limit, or both."
        : has(data.lower) && has(data.upper) && data.lower >= data.upper ? "The lower limit must be below the upper limit."
        : has(data.ageFrom) && has(data.ageTo) && data.ageFrom > data.ageTo ? "Age from cannot be above age to."
        : "";
      if (problem) { error.textContent = problem; error.hidden = false; return; }
      data.sex = data.sex || "All";
      data.severity = data.severity || "Normal";
      // Clearing a bound on edit must remove it from the saved record.
      if (existing) ["ageFrom", "ageTo", "lower", "upper"].forEach(key => { if (!has(data[key])) delete existing[key]; });
    }
    const previous = existing ? { ...existing } : null;
    if (existing) Object.assign(existing, data);
    else state[activeGroup].push({ ...data, id: createId(groups[activeGroup].prefix), status: data.status || "Active" });
    if (!saveState()) {
      if (existing && previous) Object.assign(existing, previous);
      else state[activeGroup].pop();
      return;
    }
    document.querySelector("[data-record-dialog]").close();
    if (document.body.dataset.page === "tests") renderTests(document.querySelector("[data-test-search]").value);
    else renderGroups();
    showToast(existing ? "Record updated." : "Record added.");
  }

  const CATALOG_VERSION = 2;
  const CATALOG_URL = "data/master_health_parameters_reference_limits.csv";
  const CATALOG_COLUMNS = ["Category", "Parameter Name", "Standard Unit", "Male Reference Limits", "Female Reference Limits", "Clinical Significance"];

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    const source = text.replace(/^\uFEFF/, "");
    for (let index = 0; index < source.length; index++) {
      const character = source[index];
      if (quoted) {
        if (character === '"' && source[index + 1] === '"') { cell += '"'; index++; }
        else if (character === '"') quoted = false;
        else cell += character;
      } else if (character === '"') quoted = true;
      else if (character === ",") { row.push(cell); cell = ""; }
      else if (character === "\n" || character === "\r") {
        if (character === "\r" && source[index + 1] === "\n") index++;
        row.push(cell); cell = "";
        if (row.some(value => value.trim() !== "")) rows.push(row);
        row = [];
      } else cell += character;
    }
    row.push(cell);
    if (row.some(value => value.trim() !== "")) rows.push(row);
    return rows;
  }

  // Upserts categories (as tests) and parameters from the master CSV; returns counts.
  function importCatalog(text) {
    const rows = parseCsv(text);
    const header = (rows.shift() || []).map(value => value.trim());
    const missing = CATALOG_COLUMNS.filter(column => !header.includes(column));
    if (missing.length) throw new Error(`The CSV is missing these columns: ${missing.join(", ")}.`);
    const col = Object.fromEntries(CATALOG_COLUMNS.map(column => [column, header.indexOf(column)]));
    const counts = { categories: 0, added: 0, updated: 0 };
    for (const row of rows) {
      const get = column => (row[col[column]] ?? "").trim();
      const category = get("Category");
      const name = get("Parameter Name");
      if (!category || !name) continue;
      let test = state.tests.find(item => isClinicalTest(item) && item.name.toLowerCase() === category.toLowerCase() && item.status !== "Deleted");
      if (!test) {
        test = { id: createId("TEST"), name: category, testSubgroup: "Clinical", description: "", status: "Active" };
        state.tests.push(test);
        counts.categories++;
      }
      const values = { unit: get("Standard Unit"), maleLimits: get("Male Reference Limits"), femaleLimits: get("Female Reference Limits"), significance: get("Clinical Significance") };
      const existing = state.parameters.find(item => item.testId === test.id && item.name.toLowerCase() === name.toLowerCase() && item.status !== "Deleted");
      if (existing) { Object.assign(existing, values); counts.updated++; }
      else { state.parameters.push({ id: createId("PARAM"), testId: test.id, name, ...values, status: "Active" }); counts.added++; }
    }
    state.catalogVersion = CATALOG_VERSION;
    return counts;
  }

  // Upsert the clinical catalogue without replacing existing tests or their linked records.
  async function ensureCatalog() {
    if (state.catalogVersion === CATALOG_VERSION) return false;
    const backup = structuredClone({ tests: state.tests, parameters: state.parameters, catalogVersion: state.catalogVersion });
    try {
      const response = await fetch(CATALOG_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      importCatalog(await response.text());
      if (!saveState()) throw new Error("save failed");
      return true;
    } catch (error) {
      console.error("Unable to load the master health parameters CSV.", error);
      state.tests = backup.tests;
      state.parameters = backup.parameters;
      state.catalogVersion = backup.catalogVersion;
      showToast("The master health parameters CSV could not be loaded automatically. Use Import CSV instead.", true);
      return false;
    }
  }

  const VITALS_VERSION = 2;
  const VITALS_URL = "data/daily_vitals_reference_limits.csv";
  const VITALS_COLUMNS = ["Category", "Parameter Name", "Standard Unit", "Adult Male Limits", "Adult Female Limits", "Target / Clinical Thresholds", "Clinical Significance"];

  // Upserts vital categories and vitals from the daily vitals CSV; returns counts.
  function importVitals(text) {
    const rows = parseCsv(text);
    const header = (rows.shift() || []).map(value => value.trim());
    const missing = VITALS_COLUMNS.filter(column => !header.includes(column));
    if (missing.length) throw new Error(`The CSV is missing these columns: ${missing.join(", ")}.`);
    const col = Object.fromEntries(VITALS_COLUMNS.map(column => [column, header.indexOf(column)]));
    const counts = { categories: 0, added: 0, updated: 0 };
    for (const row of rows) {
      const get = column => (row[col[column]] ?? "").trim();
      const category = get("Category");
      const name = get("Parameter Name");
      if (!category || !name) continue;
      let parent = state.vitalCategories.find(item => item.name.toLowerCase() === category.toLowerCase() && item.status !== "Deleted");
      if (!parent) {
        parent = { id: createId("VCAT"), name: category, status: "Active" };
        state.vitalCategories.push(parent);
        counts.categories++;
      }
      const values = { unit: get("Standard Unit"), maleLimits: get("Adult Male Limits"), femaleLimits: get("Adult Female Limits"), thresholds: get("Target / Clinical Thresholds"), significance: get("Clinical Significance") };
      const existing = state.vitals.find(item => item.vitalCategoryId === parent.id && item.name.toLowerCase() === name.toLowerCase() && item.status !== "Deleted");
      if (existing) { Object.assign(existing, values); counts.updated++; }
      else { state.vitals.push({ id: createId("VITAL"), vitalCategoryId: parent.id, name, ...values, status: "Active" }); counts.added++; }
    }
    state.vitalsVersion = VITALS_VERSION;
    return counts;
  }

  async function ensureVitals() {
    if (state.vitalsVersion === VITALS_VERSION) return false;
    const backup = { vitalCategories: state.vitalCategories, vitals: state.vitals };
    try {
      const response = await fetch(VITALS_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      // Upsert only, so existing vital ids (used by logged readings) stay stable.
      importVitals(await response.text());
      if (!saveState()) throw new Error("save failed");
      return true;
    } catch (error) {
      console.error("Unable to load the daily vitals CSV.", error);
      Object.assign(state, backup);
      showToast("The daily vitals CSV could not be loaded automatically. Use Import vitals CSV instead.", true);
      return false;
    }
  }

  function importVitalsFile(file) {
    if (!requirePatientProfile() || !file) return;
    const reader = new FileReader();
    reader.onerror = () => showToast("The CSV file could not be read.", true);
    reader.onload = () => {
      const snapshot = structuredClone({ vitalCategories: state.vitalCategories, vitals: state.vitals, vitalsVersion: state.vitalsVersion });
      try {
        const counts = importVitals(String(reader.result));
        if (!saveState()) throw new Error("The browser could not save the imported data.");
        renderGroups();
        showToast(`Imported: ${counts.added} added, ${counts.updated} updated, ${counts.categories} new ${counts.categories === 1 ? "category" : "categories"}.`);
      } catch (error) {
        Object.assign(state, snapshot);
        showToast(error.message, true);
      }
    };
    reader.readAsText(file);
  }

  const SYMPTOMS_VERSION = 1;
  const SYMPTOMS_URL = "data/symptom_driven_diagnostic_tests.csv";
  const SYMPTOMS_COLUMNS = ["Symptom / Presentation", "Diagnostic Test Name", "Category", "Primary Purpose / Indication"];

  // Upserts symptoms and their suggested diagnostic tests from the CSV; returns counts.
  function importSymptoms(text) {
    const rows = parseCsv(text);
    const header = (rows.shift() || []).map(value => value.trim());
    const missing = SYMPTOMS_COLUMNS.filter(column => !header.includes(column));
    if (missing.length) throw new Error(`The CSV is missing these columns: ${missing.join(", ")}.`);
    const col = Object.fromEntries(SYMPTOMS_COLUMNS.map(column => [column, header.indexOf(column)]));
    const counts = { categories: 0, added: 0, updated: 0 };
    for (const row of rows) {
      const get = column => (row[col[column]] ?? "").trim();
      const symptomName = get("Symptom / Presentation");
      const name = get("Diagnostic Test Name");
      if (!symptomName || !name) continue;
      let symptom = state.symptoms.find(item => item.name.toLowerCase() === symptomName.toLowerCase() && item.status !== "Deleted");
      if (!symptom) {
        symptom = { id: createId("SYMP"), name: symptomName, source: "Standard", status: "Active" };
        state.symptoms.push(symptom);
        counts.categories++;
      }
      const values = { category: get("Category"), purpose: get("Primary Purpose / Indication") };
      const existing = state.symptomTests.find(item => item.symptomId === symptom.id && item.name.toLowerCase() === name.toLowerCase() && item.status !== "Deleted");
      if (existing) { Object.assign(existing, values); counts.updated++; }
      else { state.symptomTests.push({ id: createId("SYTS"), symptomId: symptom.id, name, ...values, status: "Active" }); counts.added++; }
    }
    state.symptomsVersion = SYMPTOMS_VERSION;
    return counts;
  }

  // Replaces the old sample symptom master, keeping symptoms that Patients added themselves.
  async function ensureSymptoms() {
    if (state.symptomsVersion === SYMPTOMS_VERSION) return false;
    const backup = { symptoms: state.symptoms, symptomTests: state.symptomTests };
    try {
      const response = await fetch(SYMPTOMS_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.symptoms = state.symptoms.filter(item => item.source === "Patient" && item.status !== "Deleted");
      state.symptomTests = [];
      importSymptoms(await response.text());
      if (!saveState()) throw new Error("save failed");
      return true;
    } catch (error) {
      console.error("Unable to load the symptoms CSV.", error);
      Object.assign(state, backup);
      showToast("The symptoms CSV could not be loaded automatically. Use Import symptoms CSV instead.", true);
      return false;
    }
  }

  function importSymptomsFile(file) {
    if (!requirePatientProfile() || !file) return;
    const reader = new FileReader();
    reader.onerror = () => showToast("The CSV file could not be read.", true);
    reader.onload = () => {
      const snapshot = structuredClone({ symptoms: state.symptoms, symptomTests: state.symptomTests, symptomsVersion: state.symptomsVersion });
      try {
        const counts = importSymptoms(String(reader.result));
        if (!saveState()) throw new Error("The browser could not save the imported data.");
        renderGroups();
        showToast(`Imported: ${counts.added} tests added, ${counts.updated} updated, ${counts.categories} new ${counts.categories === 1 ? "symptom" : "symptoms"}.`);
      } catch (error) {
        Object.assign(state, snapshot);
        showToast(error.message, true);
      }
    };
    reader.readAsText(file);
  }

  function importCatalogFile(file) {
    if (!requirePatientProfile() || !file) return;
    const reader = new FileReader();
    reader.onerror = () => showToast("The CSV file could not be read.", true);
    reader.onload = () => {
      const snapshot = structuredClone({ tests: state.tests, parameters: state.parameters, catalogVersion: state.catalogVersion });
      try {
        const counts = importCatalog(String(reader.result));
        if (!saveState()) throw new Error("The browser could not save the imported data.");
        if (document.body.dataset.page === "tests") renderTests(document.querySelector("[data-test-search]").value);
        else renderGroups();
        showToast(`Imported: ${counts.added} added, ${counts.updated} updated, ${counts.categories} new ${counts.categories === 1 ? "category" : "categories"}.`);
      } catch (error) {
        Object.assign(state, snapshot);
        showToast(error.message, true);
      }
    };
    reader.readAsText(file);
  }

  function activeGender() {
    const gender = getUser()?.role === "Patient" ? getUser()?.gender : "";
    return gender === "Male" || gender === "Female" ? gender : "";
  }

  function limitsMarkup(parameter) {
    const own = activeGender();
    const limit = (label, value) => `<span class="limit-chip${own === label ? " is-own" : ""}"><small>${label.toUpperCase()}${own === label ? " · YOUR REFERENCE" : ""}</small><b>${htmlEscape(value || "—")}</b>${parameter.unit ? `<i>${htmlEscape(parameter.unit)}</i>` : ""}</span>`;
    return `<div class="limit-row">${limit("Male", parameter.maleLimits)}${limit("Female", parameter.femaleLimits)}</div>${parameter.significance ? `<p class="parameter-significance">${htmlEscape(parameter.significance)}</p>` : ""}`;
  }

  function renderTests(searchTerm) {
    const catalog = document.querySelector("[data-test-catalog]");
    if (!catalog) return;
    const canManage = canManageRecords();
    document.querySelectorAll("[data-action='add-parameter'], [data-action='edit-selected-test'], [data-import-catalog]").forEach(button => {
      button.hidden = !canManage;
    });
    const accessNote = document.querySelector("[data-master-access-note]");
    if (accessNote) accessNote.hidden = canManage;
    const search = (searchTerm || "").trim().toLowerCase();
    const tests = state.tests.filter(test => test.status !== "Deleted" && isClinicalTest(test) && test.name.toLowerCase().includes(search));
    if (!tests.some(test => test.id === activeTestId)) activeTestId = tests[0]?.id || "";
    document.querySelector("[data-test-count]").textContent = String(tests.length).padStart(2, "0");
    catalog.innerHTML = tests.map(test => {
      const count = state.parameters.filter(parameter => parameter.testId === test.id && parameter.status !== "Deleted").length;
      const badge = (test.name.match(/\(([A-Z]{2,4})\)/)?.[1] || initials(test.name)).slice(0, 3);
      return `<button type="button" class="test-catalog-row${test.id === activeTestId ? " is-selected" : ""}" data-test-id="${htmlEscape(test.id)}"><span class="test-icon">${htmlEscape(badge)}</span><span class="test-catalog-copy"><b>${htmlEscape(test.name)}</b><small>${count} parameters</small></span><span class="test-catalog-count">${String(count).padStart(2, "0")}</span></button>`;
    }).join("");
    const foot = document.querySelector("[data-catalog-foot]");
    if (foot) foot.innerHTML = `<span class="live-dot"></span> ${tests.length} ${tests.length === 1 ? "category" : "categories"} · ${state.parameters.filter(parameter => parameter.status !== "Deleted").length} parameters`;
    renderSelectedTest();
  }

  function renderSelectedTest() {
    const selected = state.tests.find(test => test.id === activeTestId);
    const list = document.querySelector("[data-parameter-list]");
    if (!list) return;
    if (!selected) {
      document.querySelector("[data-selected-test-title]").textContent = "No test panels";
      document.querySelector("[data-selected-test-description]").textContent = "Add a test in Groups master to begin.";
      document.querySelector("[data-test-metadata]").innerHTML = "";
      list.innerHTML = '<div class="parameter-empty">No test panel is available. Add a test panel first.</div>';
      return;
    }
    document.querySelector("[data-selected-test-title]").textContent = selected.name;
    document.querySelector("[data-selected-test-description]").textContent = selected.description || "Reference limits for this category.";
    const params = state.parameters.filter(parameter => parameter.testId === selected.id && parameter.status !== "Deleted");
    document.querySelector("[data-test-metadata]").innerHTML = [
      ["PARAMETERS", String(params.length).padStart(2, "0")],
      ["REFERENCE LIMITS", "Male · Female"],
      ["SOURCE", "Master CSV"]
    ].map(([label, value]) => `<div class="metadata-item"><small>${label}</small><b title="${htmlEscape(value)}">${htmlEscape(value)}</b></div>`).join("");
    if (!params.length) {
      list.innerHTML = '<div class="parameter-empty">No active parameters are bound to this category. Add a parameter or import the CSV.</div>';
      return;
    }
    list.innerHTML = params.map(parameter => `
      <article class="parameter-row">
        <div class="parameter-row-head"><div class="parameter-row-title"><b>${htmlEscape(parameter.name)}</b><small>${htmlEscape(parameter.unit || "No unit")} · ${htmlEscape(String(parameter.status || "Active").toUpperCase())}</small></div><div class="parameter-row-actions"><button type="button" class="table-action" data-parameter-action="view" data-id="${htmlEscape(parameter.id)}" aria-label="View ${htmlEscape(parameter.name)}">V</button>${canManageRecords() ? `<button type="button" class="table-action" data-parameter-action="edit" data-id="${htmlEscape(parameter.id)}" aria-label="Edit ${htmlEscape(parameter.name)}">E</button><button type="button" class="table-action delete" data-parameter-action="delete" data-id="${htmlEscape(parameter.id)}" aria-label="Delete ${htmlEscape(parameter.name)}">D</button>` : ""}</div></div>
        ${limitsMarkup(parameter)}
      </article>`).join("");
  }

  function makeParameterFields(parameter, disabled) {
    const fields = groups.parameters.fields.map(field => field.key === "testId" ? { ...field, label: "Bound category" } : field);
    return fields.map(field => makeField(field, parameter?.[field.key], disabled)).join("");
  }

  function openParameterDialog(mode, parameter) {
    if (mode !== "view" && !requirePatientProfile()) return;
    const dialog = document.querySelector("[data-parameter-dialog]");
    const form = document.querySelector("[data-parameter-form]");
    const readOnly = mode === "view";
    editingRecordId = parameter?.id || null;
    document.querySelector("#parameter-dialog-title").textContent = mode === "add" ? "Add parameter" : mode === "view" ? "View parameter" : "Edit parameter";
    document.querySelector("[data-parameter-submit]").textContent = mode === "add" ? "Save parameter" : "Save changes";
    document.querySelector("[data-parameter-submit]").hidden = readOnly;
    document.querySelector("[data-parameter-error]").hidden = true;
    document.querySelector("[data-parameter-fields]").innerHTML = makeParameterFields(parameter || { testId: activeTestId, status: "Active" }, readOnly);
    if (readOnly) {
      document.querySelector("[data-parameter-fields]").insertAdjacentHTML("beforeend", makeField({ key: "recordId", label: "Record ID" }, parameter.id, true));
      form.querySelector('[data-action="close-parameter-dialog"]')?.focus();
    }
    if (!dialog.open) dialog.showModal();
  }

  function saveParameter(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const existing = editingRecordId ? state.parameters.find(item => item.id === editingRecordId) : null;
    if (existing && blockIfInUse("parameters", existing, "edit")) return;
    const previous = existing ? { ...existing } : null;
    if (existing) Object.assign(existing, data);
    else state.parameters.push({ ...data, id: createId("PARAM"), status: data.status || "Active" });
    if (!saveState()) {
      if (existing && previous) Object.assign(existing, previous);
      else state.parameters.pop();
      return;
    }
    document.querySelector("[data-parameter-dialog]").close();
    renderTests(document.querySelector("[data-test-search]").value);
    showToast(existing ? "Parameter updated." : "Parameter added.");
  }

  function deleteParameter(id) {
    if (!requirePatientProfile()) return;
    const record = state.parameters.find(item => item.id === id);
    if (!record || record.status === "Deleted") return;
    if (blockIfInUse("parameters", record, "delete")) return;
    if (!window.confirm(`Mark “${record.name}” as deleted? This demo record will be soft-deleted.`)) return;
    const previousStatus = record.status;
    record.status = "Deleted";
    if (!saveState()) {
      record.status = previousStatus;
      return;
    }
    renderTests(document.querySelector("[data-test-search]").value);
    showToast("Parameter was marked as deleted.");
  }

  function syncGenderField() {
    const field = document.querySelector("[data-gender-field]");
    if (!field) return;
    const show = document.querySelector("#auth-form")?.dataset.mode === "signup" && document.querySelector('[name="role"]').value === "Patient";
    field.hidden = !show;
    const select = field.querySelector("select");
    select.required = show;
    if (!show) select.value = "";
    const dob = document.querySelector("[data-dob-field]");
    if (dob) {
      dob.hidden = !show;
      const input = dob.querySelector("input");
      input.required = show;
      input.max = todayInput();
      if (!show) input.value = "";
    }
  }

  function readProfiles() {
    try { return JSON.parse(window.localStorage.getItem(PROFILES_KEY) || "{}"); } catch (error) { return {}; }
  }

  function setAuthMode(mode) {
    document.querySelector("#auth-form").dataset.mode = mode;
    const isSignup = mode === "signup";
    document.querySelectorAll("[data-auth-tab]").forEach(tab => {
      const active = tab.dataset.authTab === mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".signup-only").forEach(field => {
      field.hidden = !isSignup;
      const input = field.querySelector("input");
      input.required = isSignup;
      if (!isSignup) input.value = "";
    });
    syncGenderField();
    const password = document.querySelector('[name="password"]');
    password.autocomplete = isSignup ? "new-password" : "current-password";
    document.querySelector("[data-submit-label]").textContent = isSignup ? "Create demo profile" : "Log in to workspace";
    document.querySelector("#auth-error").hidden = true;
    document.querySelector(".auth-heading h2").textContent = isSignup ? "Let’s get you started." : "Good to have you here.";
    document.querySelector(".auth-heading p").textContent = isSignup ? "Create a local demo profile to explore the workspace." : "Sign in to your workspace or create a demo profile.";
    document.querySelector("#auth-form").dataset.mode = mode;
  }

  function submitAuth(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const error = document.querySelector("#auth-error");
    if (form.dataset.mode === "signup" && values.password !== values.confirmPassword) {
      error.textContent = "The passwords do not match.";
      error.hidden = false;
      return;
    }
    if (form.dataset.mode === "signup" && values.password.length < 6) {
      error.textContent = "For this demo profile, use at least 6 characters.";
      error.hidden = false;
      return;
    }
    const displayName = form.dataset.mode === "signup" ? values.fullName.trim() : values.username.trim();
    const username = values.username.trim();
    const profiles = readProfiles();
    let gender = "";
    let dob = "";
    if (values.role === "Patient") {
      if (form.dataset.mode === "signup") {
        gender = values.gender || "";
        dob = values.dob || "";
        if (dob > todayInput()) {
          error.textContent = "Date of birth cannot be in the future.";
          error.hidden = false;
          return;
        }
        profiles[username.toLowerCase()] = { gender, dob };
      } else {
        gender = profiles[username.toLowerCase()]?.gender || "";
        dob = profiles[username.toLowerCase()]?.dob || "";
      }
    }
    try {
      if (form.dataset.mode === "signup") window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
      window.localStorage.setItem(USER_KEY, JSON.stringify({ username, fullName: displayName, role: values.role, gender, dob }));
    } catch (storageError) {
      console.error("Unable to create the local demo profile.", storageError);
      error.textContent = "The browser could not save your demo profile. Check local storage permissions.";
      error.hidden = false;
      return;
    }
    window.location.href = "dashboard.html";
  }

  function handleClick(event) {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.matches("[data-appointment-filter]")) {
      document.querySelectorAll("[data-appointment-filter]").forEach(button => button.classList.toggle("is-selected", button === target));
      renderAppointments(target.dataset.appointmentFilter);
    } else if (target.matches("[data-appointment-action]")) {
      const action = target.dataset.appointmentAction;
      showToast(`${action} opened for ${target.dataset.patient}. This prototype does not connect to clinical systems.`);
    } else if (target.matches("[data-action='video-room']")) {
      showToast("Virtual examination room preview is not connected in this demo.");
    } else if (target.matches("[data-action='schedule']")) {
      showToast("Appointment scheduling is a design preview and is not connected.");
    } else if (target.matches(".banner-dismiss")) {
      target.closest(".demo-banner").remove();
    } else if (target.matches("[data-group]")) {
      activeGroup = target.dataset.group;
      renderGroups();
    } else if (target.matches("[data-action='add-record']")) {
      openRecordDialog("add");
    } else if (target.matches("[data-record-action]")) {
      const record = state[activeGroup].find(item => item.id === target.dataset.id);
      if (!record) return;
      if (target.dataset.recordAction === "delete") deleteRecord(record.id);
      else openRecordDialog(target.dataset.recordAction, record);
    } else if (target.matches("[data-action='close-record-dialog']")) {
      document.querySelector("[data-record-dialog]").close();
    } else if (target.matches("[data-test-id]")) {
      activeTestId = target.dataset.testId;
      renderTests(document.querySelector("[data-test-search]").value);
    } else if (target.matches("[data-action='add-parameter']")) {
      activeGroup = "parameters";
      openParameterDialog("add");
    } else if (target.matches("[data-action='edit-selected-test']")) {
      activeGroup = "tests";
      const test = state.tests.find(item => item.id === activeTestId);
      if (test) openRecordDialog("edit", test);
    } else if (target.matches("[data-parameter-action]")) {
      const parameter = state.parameters.find(item => item.id === target.dataset.id);
      if (!parameter) return;
      if (target.dataset.parameterAction === "delete") deleteParameter(parameter.id);
      else openParameterDialog(target.dataset.parameterAction, parameter);
    } else if (target.matches("[data-action='close-parameter-dialog']")) {
      document.querySelector("[data-parameter-dialog]").close();
    } else if (target.matches("[data-action='sign-out']")) {
      try {
        window.localStorage.removeItem(USER_KEY);
      } catch (error) {
        console.error("Unable to clear the local demo profile.", error);
        showToast("The local demo profile could not be cleared.", true);
        return;
      }
      window.location.href = "index.html";
    }
  }

  const SYMPTOM_KEY = "medipulse-symptoms-v1";
  const LEGACY_SYMPTOM_OWNER = "sthiru2024@gmail.com";

  function loadSymptoms() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(SYMPTOM_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      // One-time migration: entries saved before per-patient storage belong to this patient.
      if (parsed.some(entry => !entry.patientId)) {
        parsed.forEach(entry => { if (!entry.patientId) entry.patientId = LEGACY_SYMPTOM_OWNER; });
        window.localStorage.setItem(SYMPTOM_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (error) {
      console.error("Unable to load symptoms.", error);
      showToast("Saved symptoms could not be read.", true);
      return [];
    }
  }

  // Entries are stored for all patients; each screen only sees the signed-in patient's own entries.
  function mySymptoms() {
    return loadSymptoms().filter(entry => entry.patientId && entry.patientId === patientKey());
  }

  function storeSymptoms(list) {
    try {
      window.localStorage.setItem(SYMPTOM_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      console.error("Unable to save symptoms.", error);
      showToast("The browser could not save this entry. Check local storage permissions.", true);
      return false;
    }
  }

  function nowLocalInput() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  function renderSymptomOptions() {
    const box = document.querySelector("[data-symptom-options]");
    if (!box) return;
    const checked = new Set([...box.querySelectorAll("input:checked")].map(input => input.value));
    const term = (document.querySelector("[data-symptom-filter]")?.value || "").trim().toLowerCase();
    const options = state.symptoms.filter(item => item.status !== "Deleted").sort((a, b) => a.name.localeCompare(b.name));
    box.innerHTML = options.map(item => `<label class="symptom-option"${term && !item.name.toLowerCase().includes(term) && !checked.has(item.id) ? " hidden" : ""}><input type="checkbox" name="symptomIds" value="${htmlEscape(item.id)}"${checked.has(item.id) ? " checked" : ""}><span>${htmlEscape(item.name)}${item.source === "Patient" ? " <i>(added by you)</i>" : ""}</span></label>`).join("") || '<p class="symptom-empty-options">No symptoms in the master yet. Add one below.</p>';
  }

  function renderSymptoms() {
    const body = document.querySelector("[data-symptom-body]");
    if (!body) return;
    const canEdit = canManageRecords();
    const list = mySymptoms().sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
    body.innerHTML = list.map(item => {
      const date = new Date(item.recordedAt);
      const tone = item.severity === "Severe" ? "status-critical" : item.severity === "Moderate" ? "status-warning" : "status-success";
      const text = Array.isArray(item.symptoms) && item.symptoms.length ? item.symptoms.map(symptom => symptom.name).join(", ") : item.description;
      return `<tr><td>${htmlEscape(isNaN(date) ? item.recordedAt : formatter.format(date))}</td><td><span class="status ${tone}">${htmlEscape(item.severity.toUpperCase())}</span></td><td class="symptom-text">${htmlEscape(text)}</td>${canEdit ? `<td><div class="table-actions"><button class="table-action" type="button" data-symptom-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-symptom-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-symptom-delete="${htmlEscape(item.id)}">Delete</button></div></td>` : ""}</tr>`;
    }).join("");
    document.querySelector("[data-symptom-empty]").hidden = list.length > 0;
    document.querySelector("[data-symptom-count]").textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"}`;
    document.querySelector("[data-symptom-actions-head]").hidden = !canEdit;
  }

  function saveSymptom(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-symptom-error]");
    const values = Object.fromEntries(new FormData(form));
    const selectedIds = new FormData(form).getAll("symptomIds");
    const others = String(values.otherSymptoms || "").split(",").map(value => value.trim()).filter(Boolean);
    if (!values.recordedAt || !values.severity || (!selectedIds.length && !others.length)) {
      error.textContent = "Date and time, severity and at least one symptom (listed or added) are required.";
      error.hidden = false;
      return;
    }
    if (new Date(values.recordedAt) > new Date()) {
      error.textContent = "Date and time cannot be in the future.";
      error.hidden = false;
      return;
    }
    error.hidden = true;
    const previousSymptoms = state.symptoms.length;
    const chosen = selectedIds.map(id => state.symptoms.find(item => item.id === id)).filter(Boolean);
    for (const name of others) {
      let match = state.symptoms.find(item => item.name.toLowerCase() === name.toLowerCase() && item.status !== "Deleted");
      if (!match) {
        match = { id: createId("SYMP"), name, source: "Patient", status: "Active" };
        state.symptoms.push(match);
      }
      if (!chosen.includes(match)) chosen.push(match);
    }
    if (state.symptoms.length !== previousSymptoms && !saveState()) {
      state.symptoms.length = previousSymptoms;
      return;
    }
    const list = loadSymptoms();
    const entry = { id: editingSymptomId || createId("SYM"), patientId: patientKey(), recordedAt: values.recordedAt, severity: values.severity, symptoms: chosen.map(item => ({ id: item.id, name: item.name })), description: chosen.map(item => item.name).join(", ") };
    const index = editingSymptomId ? list.findIndex(item => item.id === editingSymptomId && item.patientId === patientKey()) : -1;
    if (index >= 0) list[index] = entry;
    else list.push(entry);
    if (!storeSymptoms(list)) return;
    const wasEditing = index >= 0;
    resetSymptomForm();
    renderSymptomOptions();
    renderSymptoms();
    showToast(wasEditing ? "Symptom entry updated." : "Symptoms saved.");
  }

  let editingSymptomId = null;

  function resetSymptomForm() {
    const form = document.querySelector("[data-symptom-form]");
    editingSymptomId = null;
    form.reset();
    form.elements.recordedAt.value = nowLocalInput();
    document.querySelector("[data-symptom-heading]").textContent = "Record Symptoms";
    document.querySelector("[data-symptom-submit]").textContent = "Save symptoms";
    document.querySelector("[data-symptom-cancel]").hidden = true;
    document.querySelector("[data-symptom-error]").hidden = true;
  }

  function editSymptom(id) {
    if (!requirePatientProfile()) return;
    const item = mySymptoms().find(entry => entry.id === id);
    if (!item) return;
    const form = document.querySelector("[data-symptom-form]");
    form.reset();
    editingSymptomId = id;
    form.querySelector("[data-symptom-filter]").value = "";
    renderSymptomOptions();
    form.elements.recordedAt.value = item.recordedAt;
    form.elements.severity.value = item.severity;
    const known = new Set((item.symptoms || []).map(symptom => symptom.id));
    form.querySelectorAll('[name="symptomIds"]').forEach(box => { box.checked = known.has(box.value); });
    const missing = (item.symptoms || []).filter(symptom => !state.symptoms.some(master => master.id === symptom.id && master.status !== "Deleted")).map(symptom => symptom.name);
    form.elements.otherSymptoms.value = (item.symptoms ? missing : [item.description]).join(", ");
    document.querySelector("[data-symptom-heading]").textContent = "Edit Symptoms";
    document.querySelector("[data-symptom-submit]").textContent = "Update symptoms";
    document.querySelector("[data-symptom-cancel]").hidden = false;
    document.querySelector("[data-symptom-error]").hidden = true;
    form.scrollIntoView({ block: "center" });
  }

  function showDetails(title, rows) {
    let dialog = document.querySelector("[data-details-dialog]");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "record-dialog";
      dialog.dataset.detailsDialog = "";
      document.body.append(dialog);
    }
    dialog.innerHTML = `<div class="record-form"><h2>${htmlEscape(title)}</h2><dl class="details-list">${rows.map(([label, value]) => `<div><dt>${htmlEscape(label)}</dt><dd>${htmlEscape(value || "—")}</dd></div>`).join("")}</dl><div class="symptom-actions"><button type="button" class="button button-primary" data-close-details>Close</button></div></div>`;
    dialog.querySelector("[data-close-details]").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }

  function viewSymptom(id) {
    const item = mySymptoms().find(entry => entry.id === id);
    if (!item) return;
    const date = new Date(item.recordedAt);
    showDetails("Symptom entry", [
      ["Date and time", isNaN(date) ? item.recordedAt : new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(date)],
      ["Severity", item.severity],
      ["Symptoms", Array.isArray(item.symptoms) && item.symptoms.length ? item.symptoms.map(symptom => symptom.name).join(", ") : item.description],
      ["Record ID", item.id]
    ]);
  }

  function deleteSymptom(id) {
    if (!requirePatientProfile()) return;
    if (!window.confirm("Delete this symptom entry?")) return;
    if (editingSymptomId === id) resetSymptomForm();
    if (storeSymptoms(loadSymptoms().filter(item => !(item.id === id && item.patientId === patientKey())))) {
      renderSymptoms();
      showToast("Symptom entry deleted.");
    }
  }

  function initSymptoms() {
    renderAppHeader("symptoms");
    const canEdit = canManageRecords();
    document.querySelector("[data-symptom-form-card]").hidden = !canEdit;
    document.querySelector("[data-symptom-access-note]").hidden = canEdit;
    const form = document.querySelector("[data-symptom-form]");
    form.elements.recordedAt.value = nowLocalInput();
    form.elements.recordedAt.max = nowLocalInput();
    form.addEventListener("submit", saveSymptom);
    form.querySelector("[data-symptom-filter]").addEventListener("input", renderSymptomOptions);
    renderSymptomOptions();
    ensureSymptoms().then(changed => { if (changed) renderSymptomOptions(); });
    document.addEventListener("click", event => {
      const del = event.target.closest("[data-symptom-delete]");
      if (del) deleteSymptom(del.dataset.symptomDelete);
      const edit = event.target.closest("[data-symptom-edit]");
      if (edit) editSymptom(edit.dataset.symptomEdit);
      const view = event.target.closest("[data-symptom-view]");
      if (view) viewSymptom(view.dataset.symptomView);
      if (event.target.closest("[data-symptom-cancel]")) { resetSymptomForm(); renderSymptomOptions(); }
    });
    renderSymptoms();
  }

  function renderPractitioners() {
    const body = document.querySelector("[data-practitioner-body]");
    if (!body) return;
    const canEdit = canManageRecords();
    const list = state.practitioners.filter(item => item.status !== "Deleted");
    body.innerHTML = list.map(item => `<tr><td>${htmlEscape(item.name)}</td><td>${displayValue("practitioners", item, "specializationId")}</td><td>${htmlEscape(relationLabel("practiceId", item.practiceId))}</td>${canEdit ? `<td><div class="table-actions"><button class="table-action" type="button" data-practitioner-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-practitioner-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-practitioner-delete="${htmlEscape(item.id)}">Delete</button></div></td>` : ""}</tr>`).join("");
    document.querySelector("[data-practitioner-empty]").hidden = list.length > 0;
    document.querySelector("[data-practitioner-count]").textContent = `${list.length} ${list.length === 1 ? "practitioner" : "practitioners"}`;
    document.querySelector("[data-practitioner-actions-head]").hidden = !canEdit;
  }

  function savePractitioner(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-practitioner-error]");
    const values = Object.fromEntries(new FormData(form));
    const name = String(values.name || "").trim();
    const specialization = state.specializations.find(item => item.id === values.specializationId && item.status !== "Deleted");
    if (!name || !specialization || !values.practiceId) {
      error.textContent = "Name, specialization and medical practice are required.";
      error.hidden = false;
      return;
    }
    error.hidden = true;
    if (specialization.practiceId !== values.practiceId) {
      error.textContent = "The selected specialization does not belong to the chosen medical practice.";
      error.hidden = false;
      return;
    }
    const existing = editingPractitionerId ? state.practitioners.find(item => item.id === editingPractitionerId) : null;
    const previous = existing ? { ...existing } : null;
    if (existing) Object.assign(existing, { name, specializationId: specialization.id, practiceId: values.practiceId });
    else state.practitioners.push({ id: createId(groups.practitioners.prefix), name, specializationId: specialization.id, practiceId: values.practiceId, status: "Active" });
    if (!saveState()) {
      if (existing) Object.assign(existing, previous);
      else state.practitioners.pop();
      return;
    }
    resetPractitionerForm();
    renderPractitioners();
    showToast(existing ? "Practitioner updated." : "Practitioner saved.");
  }

  let editingPractitionerId = null;

  function fillPractitionerSpecializations(selectedId) {
    const form = document.querySelector("[data-practitioner-form]");
    const options = state.specializations.filter(item => item.status !== "Deleted" && item.practiceId === form.elements.practiceId.value);
    form.elements.specializationId.innerHTML = `<option value="">Select specialization...</option>${options.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selectedId ? " selected" : ""}>${htmlEscape(item.name)}</option>`).join("")}`;
  }

  function resetPractitionerForm() {
    const form = document.querySelector("[data-practitioner-form]");
    editingPractitionerId = null;
    form.reset();
    fillPractitionerSpecializations("");
    document.querySelector("[data-practitioner-heading]").textContent = "Add Practitioner";
    document.querySelector("[data-practitioner-submit]").textContent = "Save Practitioner";
    document.querySelector("[data-practitioner-cancel]").hidden = true;
    document.querySelector("[data-practitioner-error]").hidden = true;
  }

  function editPractitioner(id) {
    if (!requirePatientProfile()) return;
    const item = state.practitioners.find(record => record.id === id && record.status !== "Deleted");
    if (!item || blockIfInUse("practitioners", item, "edit")) return;
    const form = document.querySelector("[data-practitioner-form]");
    editingPractitionerId = id;
    form.elements.practiceId.value = item.practiceId;
    fillPractitionerSpecializations(item.specializationId);
    form.elements.name.value = item.name;
    document.querySelector("[data-practitioner-heading]").textContent = "Edit Practitioner";
    document.querySelector("[data-practitioner-submit]").textContent = "Update Practitioner";
    document.querySelector("[data-practitioner-cancel]").hidden = false;
    document.querySelector("[data-practitioner-error]").hidden = true;
    form.scrollIntoView({ block: "center" });
  }

  function viewPractitioner(id) {
    const item = state.practitioners.find(record => record.id === id);
    if (!item) return;
    showDetails("Practitioner", [
      ["Name", item.name],
      ["Medical practice", relationLabel("practiceId", item.practiceId)],
      ["Specialization", relationLabel("specializationId", item.specializationId)],
      ["Record ID", item.id]
    ]);
  }

  function deletePractitioner(id) {
    if (!requirePatientProfile()) return;
    const record = state.practitioners.find(item => item.id === id);
    if (!record) return;
    if (blockIfInUse("practitioners", record, "remove")) return;
    if (!window.confirm(`Remove ${record.name} from your practitioners?`)) return;
    if (editingPractitionerId === id) resetPractitionerForm();
    record.status = "Deleted";
    if (!saveState()) {
      record.status = "Active";
      return;
    }
    renderPractitioners();
    showToast("Practitioner removed.");
  }

  function initPractitioners() {
    renderAppHeader("practitioners");
    const canEdit = canManageRecords();
    document.querySelector("[data-practitioner-form-card]").hidden = !canEdit;
    document.querySelector("[data-practitioner-access-note]").hidden = canEdit;
    document.querySelector("[data-practitioner-access-note]").textContent = "Practitioners are available to Patient profiles only.";
    document.querySelector("[data-practitioner-list-card]").hidden = !canEdit;
    const form = document.querySelector("[data-practitioner-form]");
    form.elements.practiceId.innerHTML = state.practiceTypes.filter(item => item.status !== "Deleted").map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("");
    const fillSpecializations = () => fillPractitionerSpecializations("");
    form.elements.practiceId.addEventListener("change", fillSpecializations);
    fillSpecializations();
    form.addEventListener("submit", savePractitioner);
    document.addEventListener("click", event => {
      const del = event.target.closest("[data-practitioner-delete]");
      if (del) deletePractitioner(del.dataset.practitionerDelete);
      const edit = event.target.closest("[data-practitioner-edit]");
      if (edit) editPractitioner(edit.dataset.practitionerEdit);
      const view = event.target.closest("[data-practitioner-view]");
      if (view) viewPractitioner(view.dataset.practitionerView);
      if (event.target.closest("[data-practitioner-cancel]")) resetPractitionerForm();
    });
    renderPractitioners();
  }

  const RX_TIMINGS = ["Morning", "Afternoon", "Evening", "Night"];
  const RX_MEALS = ["Before meal", "After meal", "Independent of meal"];
  const RX_UNITS = ["Tablet", "Capsule", "ml", "Drops", "Puff", "Teaspoon", "Injection", "Sachet", "Unit"];
  let editingRxId = null;

  function patientKey() {
    return getUser()?.username || "patient";
  }

  function rxTestOptions(selected) {
    const tests = state.tests.filter(item => item.status !== "Deleted" && isClinicalTest(item)).sort((a, b) => a.name.localeCompare(b.name));
    return `<option value="">Select test...</option>${tests.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)}</option>`).join("")}`;
  }

  function addDiagnosisRow(testId) {
    const row = document.createElement("div");
    row.className = "rx-row";
    row.dataset.rxDiagnosis = "";
    row.innerHTML = `<label class="form-field">Diagnosis<select name="dxTestId" aria-label="Diagnosis test">${rxTestOptions(testId)}</select></label><button type="button" class="button button-secondary button-compact" data-rx-remove>Remove diagnosis</button>`;
    document.querySelector("[data-rx-diagnoses]").append(row);
  }

  function addMedicationRow(med = {}) {
    const row = document.createElement("div");
    row.className = "rx-med";
    row.dataset.rxMedication = "";
    if (med.id) row.dataset.medId = med.id;
    const timings = med.timings || [];
    row.innerHTML = `
      <div class="rx-med-main">
        <label class="form-field">Drug name<input type="text" name="medName" maxlength="120" placeholder="Drug name" value="${htmlEscape(med.drugName || "")}"></label>
        <label class="form-field">Qty<input type="number" name="medQty" min="0" step="any" placeholder="e.g. 1" value="${htmlEscape(med.quantity ?? "")}"></label>
        <label class="form-field">Unit<input type="text" name="medUnit" maxlength="30" list="rx-unit-list" placeholder="e.g. tablet" value="${htmlEscape(med.unit || "")}"></label>
      </div>
      <div class="rx-timings" role="group" aria-label="When to take">${RX_TIMINGS.map(time => `<label class="rx-check"><input type="checkbox" data-timing value="${time}"${timings.includes(time) ? " checked" : ""}><span>${time}</span></label>`).join("")}</div>
      <div class="rx-med-foot"><label class="form-field"><span class="sr-only">Meal qualifier</span><select name="medMeal" aria-label="Meal qualifier">${RX_MEALS.map(meal => `<option${(med.mealQualifier || "Independent of meal") === meal ? " selected" : ""}>${meal}</option>`).join("")}</select></label><button type="button" class="button button-secondary button-compact" data-rx-remove>Remove medication</button></div>`;
    document.querySelector("[data-rx-medications]").append(row);
  }

  function resetRxForm() {
    const form = document.querySelector("[data-rx-form]");
    editingRxId = null;
    form.reset();
    form.elements.issuedAt.value = nowLocalInput();
    document.querySelector("[data-rx-diagnoses]").innerHTML = "";
    document.querySelector("[data-rx-medications]").innerHTML = "";
    document.querySelector("[data-iv-items]").innerHTML = "";
    renderIvSymptoms();
    fillRxTypes();
    document.querySelector("[data-rx-heading]").textContent = "Add Prescription";
    document.querySelector("[data-rx-submit]").textContent = "Save prescription";
    document.querySelector("[data-rx-cancel]").hidden = true;
    document.querySelector("[data-rx-error]").hidden = true;
  }

  function fillRxPractitioners(selected) {
    const select = document.querySelector("[data-rx-form]").elements.practitionerId;
    const list = state.practitioners.filter(item => item.status !== "Deleted" || item.id === selected);
    select.innerHTML = `<option value="">Select practitioner...</option>${list.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)} · ${htmlEscape(relationLabel("specializationId", item.specializationId))}</option>`).join("")}`;
    select.dataset.previousPractitioner = select.value;
    document.querySelector("[data-rx-practitioner-hint]").hidden = list.length > 0;
  }

  function rxPractitionerName(id) {
    return state.practitioners.find(item => item.id === id)?.name || "Unknown";
  }

  function rxDescribeMed(med) {
    return `${med.drugName} · ${med.quantity} ${med.unit} · ${med.timings.join("/")} · ${med.mealQualifier}`;
  }

  function isClinicalRx(rx) {
    return (rx.typeName || "Clinical").trim().toLocaleLowerCase() === "clinical";
  }

  function fillRxTypes(existing = null) {
    const form = document.querySelector("[data-rx-form]");
    const select = form.elements.prescriptionTypeId;
    const practitioner = state.practitioners.find(item => item.id === form.elements.practitionerId.value);
    const types = state.prescriptionTypes.filter(item => item.status !== "Deleted" && practitioner && (item.practiceIds || []).includes(practitioner.practiceId)).sort((a, b) => a.name.localeCompare(b.name));
    const previous = existing?.prescriptionTypeId || select.value;
    select.innerHTML = `<option value="">Select prescription type...</option>${types.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
    if (existing && !existing.prescriptionTypeId) {
      select.insertAdjacentHTML("beforeend", `<option value="__legacy">${htmlEscape(existing.typeName || "Clinical")} (existing record)</option>`);
      select.value = "__legacy";
    } else if (existing && !types.some(item => item.id === previous)) {
      select.insertAdjacentHTML("beforeend", `<option value="${htmlEscape(previous)}">${htmlEscape(existing.typeName)} (existing record; not available for this practice)</option>`);
      select.value = previous;
    } else select.value = previous;
    select.disabled = Boolean(existing);
    select.dataset.previousType = select.value;
    document.querySelector("[data-rx-type-hint]").hidden = Boolean(practitioner && types.length);
    updateRxTypeSections();
  }

  function updateRxTypeSections() {
    const form = document.querySelector("[data-rx-form]");
    const existing = editingRxId && state.prescriptions.find(item => item.id === editingRxId && item.patientId === patientKey());
    const type = existing || state.prescriptionTypes.find(item => item.id === form.elements.prescriptionTypeId.value);
    document.querySelector("[data-rx-clinical]").hidden = !type || !isClinicalRx(existing || { typeName: type.name });
    document.querySelector("[data-rx-interventional]").hidden = !type || isClinicalRx(existing || { typeName: type.name });
  }

  function renderPrescriptions() {
    const body = document.querySelector("[data-rx-body]");
    if (!body) return;
    const canEdit = canManageRecords();
    const list = state.prescriptions.filter(item => item.patientId === patientKey()).    sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
        const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
    body.innerHTML = list.map(item => {
      const dx = state.prescriptionDiagnoses.filter(child => child.prescriptionId === item.id).map(child => relationLabel("testId", child.testId));
      const meds = state.prescriptionMedications.filter(child => child.prescriptionId === item.id);
      const interventions = state.interventionItems.filter(child => child.prescriptionId === item.id).map(child => `${ivMethodName(child.methodId)}${child.name ? ` — ${child.name}` : ""}`);
      const date = new Date(item.issuedAt);
      const list = values => values.length ? `<ul class="rx-list">${values.map(value => `<li>${htmlEscape(value)}</li>`).join("")}</ul>` : "—";
      return `<tr><td>${htmlEscape(isNaN(date) ? item.issuedAt : formatter.format(date))}</td><td>${htmlEscape(rxPractitionerName(item.practitionerId))}</td><td>${htmlEscape(item.typeName || "Clinical")}</td><td class="wrap-cell">${list(dx)}</td><td class="wrap-cell">${list([...meds.map(rxDescribeMed), ...interventions])}</td><td class="wrap-cell">${htmlEscape(item.notes)}</td><td><span class="status ${item.closed ? "status-warning" : "status-success"}">${item.closed ? "CLOSED" : "OPEN"}</span></td><td><div class="table-actions"><button class="table-action" type="button" data-rx-view="${htmlEscape(item.id)}">View</button>${canEdit ? `<button class="table-action" type="button" data-rx-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action" type="button" data-rx-toggle="${htmlEscape(item.id)}">${item.closed ? "Reopen" : "Close"}</button><button class="table-action delete" type="button" data-rx-delete="${htmlEscape(item.id)}">Delete</button>` : ""}</div></td></tr>`;
    }).join("");
    document.querySelector("[data-rx-empty]").hidden = list.length > 0;
    document.querySelector("[data-rx-count]").textContent = `${list.length} ${list.length === 1 ? "prescription" : "prescriptions"}`;
  }

  function saveRx(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-rx-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const practitionerId = form.elements.practitionerId.value;
    const issuedAt = form.elements.issuedAt.value;
    const notes = form.elements.notes.value.trim();
    if (!practitionerId || !issuedAt || !notes) return fail("Practitioner, date and time, and notes are required.");
    if (issuedAt > nowLocalInput()) return fail("Date and time cannot be in the future.");
    const previousRx = editingRxId && state.prescriptions.find(item => item.id === editingRxId && item.patientId === patientKey());
    if (editingRxId && !previousRx) return fail("This prescription is no longer available. Reload the page and try again.");
    const type = state.prescriptionTypes.find(item => item.id === form.elements.prescriptionTypeId.value && item.status !== "Deleted");
    const practitioner = state.practitioners.find(item => item.id === practitionerId);
    if (!previousRx && (!type || !practitioner || !(type.practiceIds || []).includes(practitioner.practiceId))) return fail("Select a prescription type available for the practitioner's practice.");
    if (previousRx && previousRx.practitionerId !== practitionerId && previousRx.prescriptionTypeId && (!type || !practitioner || !(type.practiceIds || []).includes(practitioner.practiceId))) return fail("The prescription type is not available for the selected practitioner's practice.");
    const clinical = previousRx ? isClinicalRx(previousRx) : isClinicalRx({ typeName: type.name });
    const ivItems = [];
    let symptomEntries = [];
    if (!clinical) {
      const existing = state.interventionItems.filter(item => item.prescriptionId === editingRxId);
      for (const row of form.querySelectorAll("[data-iv-item]")) {
        const item = { id: row.dataset.ivItemId, methodId: row.querySelector('[name="ivMethodId"]').value, name: row.querySelector('[name="ivName"]').value.trim() };
        if (!item.methodId) return fail("Select an intervention method in every row.");
        if (!item.name && !existing.some(old => old.id === item.id && !old.name)) return fail("Enter an intervention name in every new row.");
        ivItems.push(item);
      }
      if (!ivItems.length) return fail("Add at least one intervention.");
      if (existing.some(item => state.interventionReports.some(report => report.interventionItemId === item.id) && !ivItems.some(current => current.id === item.id && current.methodId === item.methodId && current.name === (item.name || "")))) return fail("An intervention linked to a report cannot be removed or changed. Relink or delete the report first.");
      if (previousRx && previousRx.practitionerId !== practitionerId && existing.some(item => state.interventionReports.some(report => report.interventionItemId === item.id))) return fail("The prescribing practitioner cannot be changed while intervention reports refer to this prescription. Relink or delete the reports first.");
      const itemKeys = ivItems.map(item => JSON.stringify([item.methodId, item.name.toLocaleLowerCase()]));
      if (new Set(itemKeys).size !== itemKeys.length) return fail("The same intervention method and name are entered more than once.");
      const available = [...(previousRx?.symptomEntries || []), ...mySymptoms()];
      symptomEntries = [...form.querySelectorAll('[name="ivSymptomId"]:checked')].map(input => available.find(entry => entry.id === input.value));
      if (symptomEntries.some(entry => !entry)) return fail("A selected symptom entry is no longer available. Refresh and select it again.");
    }
    const dxIds = clinical ? [...form.querySelectorAll("[data-rx-diagnosis] select")].map(select => select.value) : [];
    if (dxIds.some(value => !value)) return fail("Select a test for every diagnosis row, or remove the empty row.");
    if (new Set(dxIds).size !== dxIds.length) return fail("The same diagnosis is selected more than once.");
    if (editingRxId) {
      const usedLab = state.labResults.find(lab => lab.prescriptionId === editingRxId && !dxIds.includes(lab.testId));
      if (usedLab) return fail(`${relationLabel("testId", usedLab.testId)} already has lab results recorded against this prescription. Delete those lab results before removing this diagnosis.`);
      const moved = state.labResults.find(lab => lab.prescriptionId === editingRxId && lab.requestedBy !== practitionerId);
      if (moved) return fail("Lab results are recorded against this prescription, so its practitioner cannot be changed. Delete those lab results first.");
    }
    const meds = [];
    for (const row of clinical ? form.querySelectorAll("[data-rx-medication]") : []) {
      const med = {
        drugName: row.querySelector('[name="medName"]').value.trim(),
        quantity: Number(row.querySelector('[name="medQty"]').value),
        unit: row.querySelector('[name="medUnit"]').value.trim(),
        timings: [...row.querySelectorAll("[data-timing]:checked")].map(box => box.value),
        mealQualifier: row.querySelector('[name="medMeal"]').value,
        id: row.dataset.medId || ""
      };
      if (!med.drugName || !(med.quantity > 0) || !med.unit || !med.timings.length) return fail("Each medication needs a drug name, a quantity above zero, a unit and at least one time of day.");
      meds.push(med);
    }
    if (editingRxId) {
      const blocked = state.medicationLogs.find(log => log.prescriptionId === editingRxId && !meds.some(med => med.id === log.medicationId && med.timings.includes(log.timing)));
      if (blocked) return fail(`${blocked.drugName} (${blocked.timing}) already has a taken-dose log. Delete that log from the dashboard before removing this medication or time of day.`);
    }
    error.hidden = true;
    const snapshot = { p: [...state.prescriptions], d: [...state.prescriptionDiagnoses], m: [...state.prescriptionMedications], i: [...state.interventionItems], l: state.medicationLogs.map(log => log.practitionerId) };
    const id = editingRxId || createId("RX");
    const wasEditing = Boolean(editingRxId);
    if (wasEditing) {
      state.prescriptions = state.prescriptions.filter(item => item.id !== id);
      state.prescriptionDiagnoses = state.prescriptionDiagnoses.filter(item => item.prescriptionId !== id);
      state.prescriptionMedications = state.prescriptionMedications.filter(item => item.prescriptionId !== id);
      state.interventionItems = state.interventionItems.filter(item => item.prescriptionId !== id);
      state.medicationLogs.filter(log => log.prescriptionId === id).forEach(log => { log.practitionerId = practitionerId; });
    }
    const keys = { prescriptionId: id, patientId: patientKey(), practitionerId };
    state.prescriptions.push({ ...(previousRx || {}), id, patientId: patientKey(), practitionerId, issuedAt, notes, closed: Boolean(previousRx?.closed), prescriptionTypeId: previousRx ? previousRx.prescriptionTypeId || "" : type.id, typeName: previousRx?.typeName || type.name, symptomEntries: symptomEntries.map(entry => ({ id: entry.id, recordedAt: entry.recordedAt, severity: entry.severity, symptoms: entry.symptoms, description: entry.description })) });
    dxIds.forEach(testId => state.prescriptionDiagnoses.push({ id: createId("RXDX"), ...keys, testId }));
    meds.forEach(med => state.prescriptionMedications.push({ ...keys, ...med, id: med.id || createId("RXMED") }));
    ivItems.forEach(item => state.interventionItems.push({ ...keys, ...item, id: item.id || createId("IVITEM") }));
    if (!saveState()) {
      state.prescriptions = snapshot.p;
      state.prescriptionDiagnoses = snapshot.d;
      state.prescriptionMedications = snapshot.m;
      state.interventionItems = snapshot.i;
      state.medicationLogs.forEach((log, index) => { log.practitionerId = snapshot.l[index]; });
      return;
    }
    resetRxForm();
    renderPrescriptions();
    showToast(wasEditing ? "Prescription updated." : "Prescription saved.");
  }

  function editRx(id) {
    if (!requirePatientProfile()) return;
    const item = state.prescriptions.find(entry => entry.id === id);
    if (!item) return;
    const form = document.querySelector("[data-rx-form]");
    resetRxForm();
    editingRxId = id;
    fillRxPractitioners(item.practitionerId);
    fillRxTypes(item);
    form.elements.issuedAt.value = item.issuedAt;
    form.elements.notes.value = item.notes;
    state.prescriptionDiagnoses.filter(child => child.prescriptionId === id).forEach(child => addDiagnosisRow(child.testId));
    state.prescriptionMedications.filter(child => child.prescriptionId === id).forEach(addMedicationRow);
    renderIvSymptoms(item.symptomEntries || []);
    state.interventionItems.filter(child => child.prescriptionId === id).forEach(addInterventionRow);
    document.querySelector("[data-rx-heading]").textContent = "Edit Prescription";
    document.querySelector("[data-rx-submit]").textContent = "Update prescription";
    document.querySelector("[data-rx-cancel]").hidden = false;
    form.scrollIntoView({ block: "start" });
  }

  function viewRx(id) {
    const item = state.prescriptions.find(entry => entry.id === id);
    if (!item) return;
    const dx = state.prescriptionDiagnoses.filter(child => child.prescriptionId === id);
    const meds = state.prescriptionMedications.filter(child => child.prescriptionId === id);
    const interventions = state.interventionItems.filter(child => child.prescriptionId === id);
    const date = new Date(item.issuedAt);
    const master = [
      ["Prescription ID", item.id],
      ["Patient ID", item.patientId],
      ["Practitioner", `${rxPractitionerName(item.practitionerId)} (${item.practitionerId})`],
      ["Prescription type", item.typeName || "Clinical"],
      ["Date and time", isNaN(date) ? item.issuedAt : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)],
      ["Status", item.closed ? "Closed" : "Open"],
      ["Notes", item.notes],
      ["Related symptom entries", (item.symptomEntries || []).map(ivSymptomLabel).join("; ")]
    ];
    let dialog = document.querySelector("[data-details-dialog]");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "record-dialog";
      dialog.dataset.detailsDialog = "";
      document.body.append(dialog);
    }
    const table = (heads, rows) => rows.length
      ? `<table class="data-table rx-mini"><thead><tr>${heads.map(head => `<th>${head}</th>`).join("")}</tr></thead><tbody>${rows.map(cells => `<tr>${cells.map(cell => `<td>${htmlEscape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      : `<p class="rx-hint">None recorded.</p>`;
    dialog.innerHTML = `<div class="record-form"><h2>Prescription</h2>
      <section class="rx-view-box"><dl class="details-list">${master.map(([label, value]) => `<div><dt>${htmlEscape(label)}</dt><dd>${htmlEscape(value || "—")}</dd></div>`).join("")}</dl></section>
      <h3 class="rx-view-title">Diagnoses (${dx.length})</h3>
      <div class="rx-view-box">${table(["Diagnosis (test)"], dx.map(child => [relationLabel("testId", child.testId)]))}</div>
      <h3 class="rx-view-title">Medications (${meds.length})</h3>
      <div class="rx-view-box">${table(["Drug", "Qty", "Unit", "When", "Meal"], meds.map(med => [med.drugName, med.quantity, med.unit, med.timings.join(", "), med.mealQualifier]))}</div>
      <h3 class="rx-view-title">Interventions (${interventions.length})</h3>
      <div class="rx-view-box">${table(["Intervention Method", "Intervention name"], interventions.map(child => [ivMethodName(child.methodId), child.name || "—"]))}</div>
      <div class="symptom-actions"><button type="button" class="button button-primary" data-close-details>Close</button></div></div>`;
    dialog.classList.add("rx-dialog");
    dialog.addEventListener("close", () => dialog.classList.remove("rx-dialog"), { once: true });
    dialog.querySelector("[data-close-details]").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }

  function toggleRx(id) {
    if (!requirePatientProfile()) return;
    const item = state.prescriptions.find(entry => entry.id === id && entry.patientId === patientKey());
    if (!item) return showToast("This prescription is no longer available.", true);
    const closing = !item.closed;
    const message = !isClinicalRx(item) ? `${closing ? "Close" : "Reopen"} this prescription?` : closing
      ? "Close this prescription? Its medications will no longer appear in the schedule. Older prescriptions will not restart automatically."
      : "Reopen this prescription? Its medications appear only if it is the latest prescription from this practitioner.";
    if (!window.confirm(message)) return;
    const previous = item.closed;
    item.closed = closing;
    if (!saveState()) {
      item.closed = previous;
      return;
    }
    renderPrescriptions();
    showToast(closing ? "Prescription closed." : "Prescription reopened.");
  }

  function deleteRx(id) {
    if (!requirePatientProfile()) return;
    if (state.interventionReports.some(report => state.interventionItems.some(item => item.prescriptionId === id && item.id === report.interventionItemId))) return showToast("Cannot delete this prescription while intervention reports refer to it. Relink or delete the reports first.", true);
    const loggedDoses = state.medicationLogs.filter(log => log.prescriptionId === id).length;
    if (loggedDoses) return showToast(`Cannot delete this prescription: ${loggedDoses} taken-dose ${loggedDoses === 1 ? "log depends" : "logs depend"} on it. Delete those logs first.`, true);
    const labCount = state.labResults.filter(lab => lab.prescriptionId === id).length;
    if (labCount) return showToast(`Cannot delete this prescription: ${labCount} lab test ${labCount === 1 ? "record was" : "records were"} requested through it. Delete those first.`, true);
    if (!window.confirm("Delete this prescription and its associated details?")) return;
    const snapshot = { p: state.prescriptions, d: state.prescriptionDiagnoses, m: state.prescriptionMedications, i: state.interventionItems };
    state.prescriptions = state.prescriptions.filter(item => item.id !== id);
    state.prescriptionDiagnoses = state.prescriptionDiagnoses.filter(item => item.prescriptionId !== id);
    state.prescriptionMedications = state.prescriptionMedications.filter(item => item.prescriptionId !== id);
    state.interventionItems = state.interventionItems.filter(item => item.prescriptionId !== id);
    if (!saveState()) {
      state.prescriptions = snapshot.p;
      state.prescriptionDiagnoses = snapshot.d;
      state.prescriptionMedications = snapshot.m;
      state.interventionItems = snapshot.i;
      return;
    }
    if (editingRxId === id) resetRxForm();
    renderPrescriptions();
    showToast("Prescription deleted.");
  }

  function initPrescriptions() {
    renderAppHeader("prescriptions");
    const canEdit = canManageRecords();
    document.querySelector("[data-rx-form-card]").hidden = !canEdit;
    document.querySelector("[data-rx-access-note]").hidden = canEdit;
    const form = document.querySelector("[data-rx-form]");
    const datalist = document.createElement("datalist");
    datalist.id = "rx-unit-list";
    datalist.innerHTML = RX_UNITS.map(unit => `<option value="${unit}">`).join("");
    form.append(datalist);
    form.elements.issuedAt.max = nowLocalInput();
    fillRxPractitioners("");
    resetRxForm();
    form.addEventListener("submit", saveRx);
    form.elements.practitionerId.addEventListener("change", () => {
      const practitionerSelect = form.elements.practitionerId;
      if (!editingRxId && practitionerSelect.value !== practitionerSelect.dataset.previousPractitioner && form.querySelector("[data-rx-diagnosis], [data-rx-medication], [data-iv-item], [name='ivSymptomId']:checked")) {
        if (!window.confirm("Changing practitioner will clear the current diagnosis, medication, intervention and symptom selections. Continue?")) {
          practitionerSelect.value = practitionerSelect.dataset.previousPractitioner;
          return;
        }
        document.querySelector("[data-rx-diagnoses]").innerHTML = "";
        document.querySelector("[data-rx-medications]").innerHTML = "";
        document.querySelector("[data-iv-items]").innerHTML = "";
        renderIvSymptoms();
      }
      practitionerSelect.dataset.previousPractitioner = practitionerSelect.value;
      const existing = editingRxId && state.prescriptions.find(item => item.id === editingRxId && item.patientId === patientKey());
      fillRxTypes(existing);
    });
    form.elements.prescriptionTypeId.addEventListener("change", () => {
      const select = form.elements.prescriptionTypeId;
      const before = state.prescriptionTypes.find(item => item.id === select.dataset.previousType);
      const after = state.prescriptionTypes.find(item => item.id === select.value);
      if (before && after && isClinicalRx({ typeName: before.name }) !== isClinicalRx({ typeName: after.name })) {
        const hasDetails = form.querySelector("[data-rx-diagnosis], [data-rx-medication], [data-iv-item], [name='ivSymptomId']:checked");
        if (hasDetails && !window.confirm("Changing type will clear the current diagnosis, medication, intervention and symptom selections. Continue?")) {
          select.value = select.dataset.previousType;
          return;
        }
        document.querySelector("[data-rx-diagnoses]").innerHTML = "";
        document.querySelector("[data-rx-medications]").innerHTML = "";
        document.querySelector("[data-iv-items]").innerHTML = "";
        renderIvSymptoms();
      }
      if (select.value) select.dataset.previousType = select.value;
      updateRxTypeSections();
    });
    form.querySelector("[data-iv-symptom-filter]").addEventListener("input", () => {
      const selectedIds = new Set([...form.querySelectorAll('[name="ivSymptomId"]:checked')].map(input => input.value));
      const previous = state.prescriptions.find(item => item.id === editingRxId && item.patientId === patientKey());
      const available = [...(previous?.symptomEntries || []), ...mySymptoms()];
      renderIvSymptoms([...selectedIds].map(id => available.find(entry => entry.id === id)).filter(Boolean));
    });
    document.addEventListener("click", event => {
      if (event.target.closest("[data-rx-add-diagnosis]")) addDiagnosisRow("");
      else if (event.target.closest("[data-rx-add-medication]")) addMedicationRow();
      else if (event.target.closest("[data-iv-add]")) addInterventionRow();
      else if (event.target.closest("[data-iv-remove]")) event.target.closest("[data-iv-item]").remove();
      else if (event.target.closest("[data-rx-remove]")) event.target.closest("[data-rx-diagnosis], [data-rx-medication]").remove();
      else if (event.target.closest("[data-rx-cancel]")) resetRxForm();
      const view = event.target.closest("[data-rx-view]");
      if (view) viewRx(view.dataset.rxView);
      const edit = event.target.closest("[data-rx-edit]");
      if (edit) editRx(edit.dataset.rxEdit);
      const toggle = event.target.closest("[data-rx-toggle]");
      if (toggle) toggleRx(toggle.dataset.rxToggle);
      const del = event.target.closest("[data-rx-delete]");
      if (del) deleteRx(del.dataset.rxDelete);
    });
    ensureCatalog().then(changed => {
      if (!changed) return;
      form.querySelectorAll("[data-rx-diagnosis] select").forEach(select => { select.innerHTML = rxTestOptions(select.value); });
    });
    renderPrescriptions();
  }


  function ivMethodOptions(selected) {
    const methods = state.interventionMethods.filter(item => item.status !== "Deleted" || item.id === selected).sort((a, b) => a.name.localeCompare(b.name));
    return `<option value="">Select intervention method...</option>${methods.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)} · ${htmlEscape(relationLabel("practiceId", item.practiceId))}</option>`).join("")}`;
  }

  function ivMethodName(id) {
    return state.interventionMethods.find(item => item.id === id)?.name || "Unknown";
  }

  function addInterventionRow(item = {}) {
    const row = document.createElement("div");
    row.className = "rx-row iv-row";
    row.dataset.ivItem = "";
    row.dataset.ivItemId = item.id || "";
    row.innerHTML = `<label class="form-field">Intervention Method<select name="ivMethodId">${ivMethodOptions(item.methodId)}</select></label><label class="form-field">Intervention name<input type="text" name="ivName" maxlength="200" value="${htmlEscape(item.name || "")}" placeholder="Clinical name of intervention"></label><button type="button" class="button button-secondary button-compact" data-iv-remove>Remove intervention</button>`;
    document.querySelector("[data-iv-items]").append(row);
  }

  function ivSymptomLabel(entry) {
    const symptoms = Array.isArray(entry.symptoms) && entry.symptoms.length ? entry.symptoms.map(symptom => symptom.name).join(", ") : entry.description || "Symptoms unavailable";
    return `${formatDateTime(entry.recordedAt)} — ${symptoms}${entry.severity ? ` (${entry.severity})` : ""}`;
  }

  function renderIvSymptoms(selected = []) {
    const box = document.querySelector("[data-iv-symptoms]");
    const entries = mySymptoms().sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    const byId = new Map(selected.map(entry => [entry.id, entry]));
    const selectedIds = new Set(byId.keys());
    const options = entries.map(entry => byId.get(entry.id) || entry);
    selected.filter(entry => !entries.some(current => current.id === entry.id)).forEach(entry => options.push(entry));
    const term = document.querySelector("[data-iv-symptom-filter]").value.trim().toLowerCase();
    box.innerHTML = options.map(entry => {
      const label = ivSymptomLabel(entry);
      return `<label class="symptom-option"${term && !label.toLowerCase().includes(term) && !selectedIds.has(entry.id) ? " hidden" : ""}><input type="checkbox" name="ivSymptomId" value="${htmlEscape(entry.id)}"${selectedIds.has(entry.id) ? " checked" : ""}><span>${htmlEscape(label)}</span></label>`;
    }).join("") || '<p class="symptom-empty-options">No symptom entries recorded yet. <a href="symptoms.html">Record symptoms</a> first.</p>';
  }

  function todayInput() {
    return nowLocalInput().slice(0, 10);
  }

  function formatDateTime(value) {
    const date = new Date(value);
    return isNaN(date) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  const REPORT_TEMPLATES = {
    vasculitis: [
      ["Autoantibodies", "MPO-ANCA", "numeric"], ["Autoantibodies", "PR3-ANCA", "numeric"],
      ["Autoantibodies", "ANCA IFA Pattern", "coded"], ["Autoantibodies", "ANCA IFA Titer", "text"],
      ["Autoantibodies", "Anti-GBM Antibody", "numeric"], ["Complement", "Complement C3", "numeric"],
      ["Complement", "Complement C4", "numeric"], ["Autoantibodies", "ANA Screen / Titer", "text"],
      ["Autoantibodies", "Anti-dsDNA", "numeric"], ["Inflammatory Markers", "CRP", "numeric"], ["Inflammatory Markers", "ESR", "numeric"]
    ],
    immunotyping: [
      ["Electrophoresis Fractions", "Serum Total Protein", "numeric"], ["Electrophoresis Fractions", "Albumin", "numeric"],
      ["Electrophoresis Fractions", "Alpha-1", "numeric"], ["Electrophoresis Fractions", "Alpha-2", "numeric"],
      ["Electrophoresis Fractions", "Beta-1", "numeric"], ["Electrophoresis Fractions", "Beta-2", "numeric"],
      ["Electrophoresis Fractions", "Gamma Globulin", "numeric"], ["Electrophoresis Fractions", "M-Spike", "numeric"],
      ["Immunosubtraction / Chains", "Heavy Chain Identified", "coded"], ["Immunosubtraction / Chains", "Light Chain Identified", "coded"],
      ["Immunosubtraction / Chains", "Pattern / Interpretation", "text"]
    ],
    biopsy: [
      ["Specimen Adequacy", "Total Glomeruli Sampled", "numeric"], ["Specimen Adequacy", "Globally Sclerotic Glomeruli", "numeric"],
      ["Specimen Adequacy", "Segmentally Sclerotic Glomeruli", "numeric"], ["Specimen Adequacy", "Cellular / Fibrocellular Crescents Count", "numeric"],
      ["Light Microscopy", "Glomeruli Findings", "text"], ["Light Microscopy", "Tubules & Interstitium", "text"], ["Light Microscopy", "Blood Vessels", "text"],
      ...["IgG", "IgA", "IgM", "C3", "C1q", "Kappa", "Lambda", "Fibrinogen"].map(name => ["Immunofluorescence", `IF ${name}`, "scale"]),
      ["Immunofluorescence", "IF Staining Pattern", "text"], ["Electron Microscopy", "GBM Thickness / Alterations", "text"],
      ["Electron Microscopy", "Podocyte Foot Process Effacement", "coded"], ["Electron Microscopy", "Electron-Dense Deposits Location", "text"]
    ]
  };
  const REPORT_TYPES = [["numeric", "Numeric"], ["coded", "Coded / qualitative"], ["scale", "Semi-quantitative scale"], ["text", "Text / narrative"]];
  let editingReportId = null;

  function formatReportDate(value) {
    if (!value) return "—";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(`${value}T00:00`));
    }
    return formatDateTime(value);
  }

  function reportOptionList(list, selected, placeholder, label) {
    return `<option value="">${htmlEscape(placeholder)}</option>${list.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(label(item))}</option>`).join("")}`;
  }

  const IPD_FIELDS = ["facilityId", "practitionerId", "admissionDate", "admissionTime", "admissionType", "admissionSource", "admittingDiagnosis", "admittingCode", "ward", "room", "bed", "status", "chiefComplaint", "dischargeDate", "dischargeTime", "disposition", "finalDiagnosis", "finalCode", "dischargeSummary", "followUp"];
  let editingEncounterId = null;

  function resetInpatientForm() {
    const form = document.querySelector("[data-ipd-form]");
    editingEncounterId = null;
    form.reset();
    form.elements.facilityId.innerHTML = reportOptionList(state.facilities.filter(item => item.status !== "Deleted"), "", "Select facility...", item => item.name);
    form.elements.practitionerId.innerHTML = reportOptionList(state.practitioners.filter(item => item.status !== "Deleted"), "", "Not recorded", item => item.name);
    document.querySelector("[data-ipd-heading]").textContent = "Add admission";
    document.querySelector("[data-ipd-submit]").textContent = "Save admission";
    document.querySelector("[data-ipd-cancel]").hidden = true;
    document.querySelector("[data-ipd-error]").hidden = true;
  }

  function inpatientDate(date, time) {
    return date ? formatReportDate(date + (time ? `T${time}` : "")) : "—";
  }

  function renderInpatient() {
    const entries = state.ipdEncounters.filter(item => item.patientId === patientKey()).sort((a, b) => b.admissionDate.localeCompare(a.admissionDate) || (b.admissionTime || "").localeCompare(a.admissionTime || "") || b.createdAt.localeCompare(a.createdAt));
    const editable = canManageRecords();
    document.querySelector("[data-ipd-body]").innerHTML = entries.map(item => {
      const facility = state.facilities.find(entry => entry.id === item.facilityId)?.name || "Unknown facility";
      return `<tr><td>${htmlEscape(facility)}</td><td>${htmlEscape(inpatientDate(item.admissionDate, item.admissionTime))}</td><td>${htmlEscape(inpatientDate(item.dischargeDate, item.dischargeTime))}</td><td>${htmlEscape(item.status)}</td><td><div class="table-actions"><button type="button" class="table-action" data-ipd-view="${htmlEscape(item.id)}">View</button>${editable ? `<button type="button" class="table-action" data-ipd-edit="${htmlEscape(item.id)}">Edit</button><button type="button" class="table-action delete" data-ipd-delete="${htmlEscape(item.id)}">Delete</button>` : ""}</div></td></tr>`;
    }).join("");
    document.querySelector("[data-ipd-count]").textContent = `${entries.length} ${entries.length === 1 ? "admission" : "admissions"}`;
    document.querySelector("[data-ipd-empty]").hidden = entries.length > 0;
  }

  function saveInpatient(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const fail = text => { const error = document.querySelector("[data-ipd-error]"); error.textContent = text; error.hidden = false; error.focus(); };
    const data = Object.fromEntries(IPD_FIELDS.map(key => [key, form.elements[key].value.trim()]));
    const old = editingEncounterId ? state.ipdEncounters.find(item => item.id === editingEncounterId && item.patientId === patientKey()) : null;
    if (editingEncounterId && !old) return fail("This admission is no longer available. Reload the page.");
    if (!state.facilities.some(item => item.id === data.facilityId && item.status !== "Deleted")) return fail("Select an available facility.");
    if (data.practitionerId && !state.practitioners.some(item => item.id === data.practitionerId && item.status !== "Deleted")) return fail("Select an available practitioner.");
    for (const key of ["admissionType", "admissionSource", "status", "disposition"]) {
      if (!Array.from(form.elements[key].options).some(option => option.value === data[key])) return fail("Select a valid admission or discharge option.");
    }
    if (["admissionDate", "admissionTime", "dischargeDate", "dischargeTime"].some(key => !form.elements[key].validity.valid)) return fail("Enter valid dates and times, or leave optional fields blank.");
    if (!data.admissionDate) return fail("Enter the admission date.");
    if (data.dischargeTime && !data.dischargeDate) return fail("Enter a discharge date when a discharge time is provided.");
    if (data.status === "Discharged" && (!data.dischargeDate || !data.disposition)) return fail("Enter the discharge date and disposition for a discharged admission.");
    const nowDate = new Date();
    nowDate.setMinutes(nowDate.getMinutes() - nowDate.getTimezoneOffset());
    const now = nowDate.toISOString().slice(0, -1);
    const stamp = (date, time) => date + (time ? `T${time}` : "");
    if ([[data.admissionDate, data.admissionTime], [data.dischargeDate, data.dischargeTime]].some(([date, time]) => date && stamp(date, time) > (time ? now : now.slice(0, 10)))) return fail("Admission and discharge dates cannot be in the future.");
    const seconds = value => { const [hours, minutes, seconds = 0] = value.split(":").map(Number); return hours * 3600 + minutes * 60 + seconds; };
    if (data.dischargeDate && (data.dischargeDate < data.admissionDate || (data.dischargeDate === data.admissionDate && data.admissionTime && data.dischargeTime && seconds(data.dischargeTime) < seconds(data.admissionTime)))) return fail("Discharge cannot be before admission.");
    const record = { id: old?.id || createId("IPD"), patientId: patientKey(), ...data, createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    const previous = state.ipdEncounters;
    state.ipdEncounters = [...previous.filter(item => item.id !== record.id), record];
    if (!saveState()) { state.ipdEncounters = previous; return; }
    resetInpatientForm();
    renderInpatient();
    showToast(old ? "Admission updated." : "Admission saved.");
  }

  function editInpatient(id) {
    if (!requirePatientProfile()) return;
    const item = state.ipdEncounters.find(entry => entry.id === id && entry.patientId === patientKey());
    if (!item) return showToast("This admission is no longer available.", true);
    resetInpatientForm();
    editingEncounterId = id;
    const form = document.querySelector("[data-ipd-form]");
    IPD_FIELDS.forEach(key => { form.elements[key].value = item[key] || ""; });
    document.querySelector("[data-ipd-heading]").textContent = "Edit admission";
    document.querySelector("[data-ipd-submit]").textContent = "Update admission";
    document.querySelector("[data-ipd-cancel]").hidden = false;
    form.scrollIntoView({ block: "start" });
  }

  function viewInpatient(id) {
    const item = state.ipdEncounters.find(entry => entry.id === id && entry.patientId === patientKey());
    if (!item) return showToast("This admission is no longer available.", true);
    showDetails("Admission and discharge", [
      ["Encounter ID", item.id], ["Facility", state.facilities.find(entry => entry.id === item.facilityId)?.name || "Unknown facility"],
      ["Primary practitioner", item.practitionerId ? rxPractitionerName(item.practitionerId) : "—"],
      ["Status", item.status], ["Admission", inpatientDate(item.admissionDate, item.admissionTime)],
      ["Admission type", item.admissionType], ["Admission source", item.admissionSource],
      ["Admitting diagnosis", item.admittingDiagnosis], ["Admitting diagnosis ICD-10 code", item.admittingCode], ["Chief complaint", item.chiefComplaint],
      ["Ward", item.ward], ["Room", item.room], ["Bed", item.bed],
      ["Discharge", inpatientDate(item.dischargeDate, item.dischargeTime)], ["Disposition", item.disposition],
      ["Final diagnosis", item.finalDiagnosis], ["Final diagnosis ICD-10 code", item.finalCode],
      ["Discharge summary", item.dischargeSummary], ["Follow-up instructions", item.followUp]
    ]);
  }

  function initInpatient() {
    renderAppHeader("inpatient");
    const form = document.querySelector("[data-ipd-form]");
    document.querySelector("[data-ipd-form-card]").hidden = !canManageRecords();
    document.querySelector("[data-ipd-access]").hidden = canManageRecords();
    resetInpatientForm();
    renderInpatient();
    form.addEventListener("submit", saveInpatient);
    form.querySelector("[data-ipd-cancel]").addEventListener("click", resetInpatientForm);
    document.querySelector("[data-ipd-body]").addEventListener("click", event => {
      const view = event.target.closest("[data-ipd-view]"), edit = event.target.closest("[data-ipd-edit]"), del = event.target.closest("[data-ipd-delete]");
      if (view) viewInpatient(view.dataset.ipdView);
      if (edit) editInpatient(edit.dataset.ipdEdit);
      if (del && requirePatientProfile()) {
        const id = del.dataset.ipdDelete;
        if (!state.ipdEncounters.some(item => item.id === id && item.patientId === patientKey())) return showToast("This admission is no longer available.", true);
        if (!window.confirm("Delete this admission and its discharge details?")) return;
        const previous = state.ipdEncounters;
        state.ipdEncounters = previous.filter(item => item.id !== id || item.patientId !== patientKey());
        if (!saveState()) { state.ipdEncounters = previous; return; }
        if (editingEncounterId === id) resetInpatientForm();
        renderInpatient();
        showToast("Admission deleted.");
      }
    });
  }

  function reportPrescriptionItems() {
    return state.interventionItems.filter(item => {
      const rx = state.prescriptions.find(record => record.id === item.prescriptionId && record.patientId === patientKey());
      return rx && !isClinicalRx(rx);
    }).map(item => {
      const rx = state.prescriptions.find(record => record.id === item.prescriptionId);
      return { id: item.id, name: item.name || ivMethodName(item.methodId), method: ivMethodName(item.methodId), practitioner: rxPractitionerName(rx.practitionerId), prescriptionId: rx.id, label: `${item.name || ivMethodName(item.methodId)} · ${ivMethodName(item.methodId)} · ${rxPractitionerName(rx.practitionerId)} · ${formatDateTime(rx.issuedAt)} · ${rx.id}` };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }

  function updateReportPrescription() {
    const form = document.querySelector("[data-report-form]");
    const item = reportPrescriptionItems().find(entry => entry.id === form.elements.interventionItemId.value);
    form.querySelector("[data-report-method]").value = item ? item.method : "Select a prescribed intervention";
    form.querySelector("[data-report-prescriber]").value = item ? item.practitioner : "Select a prescribed intervention";
  }

  function reportLegacyTest(item) {
    if (!item.testId) return "";
    return state.tests.find(test => test.id === item.testId)?.name || `Unavailable test (${item.testId})`;
  }

  function addReportObservation(item = {}) {
    const row = document.createElement("div");
    row.className = "report-observation";
    row.dataset.reportObservation = "";
    row.dataset.id = item.id || "";
    row.dataset.template = item.template ? "true" : "false";
    const types = REPORT_TYPES.map(([value, label]) => `<option value="${value}"${(item.type || "text") === value ? " selected" : ""}>${label}</option>`).join("");
    const qualifiers = ["", "<", "≤", ">", "≥", "="].map(value => `<option value="${value}"${(item.qualifier || "") === value ? " selected" : ""}>${value || "None"}</option>`).join("");
    const flags = ["", "Normal", "Low", "High", "Positive/Abnormal", "Critical", "Not applicable"].map(value => `<option value="${value}"${(item.flag || "") === value ? " selected" : ""}>${value || "Not recorded"}</option>`).join("");
    row.innerHTML = `<div class="report-grid">
      <label class="form-field">Section / group<input name="section" value="${htmlEscape(item.section || "")}" maxlength="160"></label>
      <label class="form-field">Parameter name<input name="parameter" value="${htmlEscape(item.parameter || "")}" maxlength="200"></label>
      <label class="form-field">Parameter code (optional)<input name="code" value="${htmlEscape(item.code || "")}" maxlength="80"></label>
      <label class="form-field">Code system (optional)<input name="codeSystem" value="${htmlEscape(item.codeSystem || "")}" maxlength="80"></label>
      <label class="form-field">Result type<select name="type">${types}</select></label>
      <label class="form-field">Result value<textarea name="value" rows="2" placeholder="Enter the reported value">${htmlEscape(item.value || "")}</textarea></label>
      <label class="form-field">Numeric qualifier<select name="qualifier">${qualifiers}</select></label>
      <label class="form-field">Unit<input name="unit" value="${htmlEscape(item.unit || "")}" maxlength="80"></label>
      <label class="form-field">Reference low<input name="referenceLow" value="${htmlEscape(item.referenceLow || "")}" inputmode="decimal"></label>
      <label class="form-field">Reference high<input name="referenceHigh" value="${htmlEscape(item.referenceHigh || "")}" inputmode="decimal"></label>
      <label class="form-field">Reference text<input name="referenceText" value="${htmlEscape(item.referenceText || "")}"></label>
      <label class="form-field">Reported flag<select name="flag">${flags}</select></label>
    </div><label class="form-field">Observation note<textarea name="note" rows="2">${htmlEscape(item.note || "")}</textarea></label><button type="button" class="button button-secondary button-compact" data-report-remove>Remove observation</button>`;
    document.querySelector("[data-report-observations]").append(row);
  }

  function addReportNarrative(item = {}) {
    const row = document.createElement("div");
    row.className = "report-narrative";
    row.dataset.reportNarrative = "";
    row.dataset.id = item.id || "";
    row.innerHTML = `<label class="form-field">Section name<input name="title" value="${htmlEscape(item.title || "")}" maxlength="160" placeholder="e.g. Light Microscopy"></label><label class="form-field">Narrative<textarea name="text" rows="4">${htmlEscape(item.text || "")}</textarea></label><button type="button" class="button button-secondary button-compact" data-report-remove>Remove section</button>`;
    document.querySelector("[data-report-narratives]").append(row);
  }

  function resetReportForm() {
    const form = document.querySelector("[data-report-form]");
    editingReportId = null;
    form.reset();
    form.elements.facilityId.innerHTML = reportOptionList(state.facilities.filter(item => item.status !== "Deleted"), "", "Select facility...", item => item.name);
    const people = state.practitioners.filter(item => item.status !== "Deleted");
    form.elements.interventionistId.innerHTML = reportOptionList(people, "", "Not recorded", item => item.name);
    form.elements.specialistId.innerHTML = reportOptionList(people, "", "Not recorded", item => item.name);
    form.elements.interventionItemId.innerHTML = reportOptionList(reportPrescriptionItems(), "", "Select prescribed intervention...", item => item.label);
    updateReportPrescription();
    document.querySelector("[data-report-legacy-test]").hidden = true;
    document.querySelector("[data-report-observations]").innerHTML = "";
    document.querySelector("[data-report-narratives]").innerHTML = "";
    document.querySelector("[data-report-heading]").textContent = "Add intervention report";
    document.querySelector("[data-report-submit]").textContent = "Save report";
    document.querySelector("[data-report-cancel]").hidden = true;
    document.querySelector("[data-report-error]").hidden = true;
  }

  function renderReports() {
    const list = state.interventionReports.filter(item => item.patientId === patientKey()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const editable = canManageRecords();
    const facilityName = id => state.facilities.find(item => item.id === id)?.name || "Unknown facility";
    const prescribed = new Map(reportPrescriptionItems().map(item => [item.id, item]));
    document.querySelector("[data-report-body]").innerHTML = list.map(item => `<tr><td>${htmlEscape(prescribed.get(item.interventionItemId)?.name || (reportLegacyTest(item) ? `${reportLegacyTest(item)} (legacy; link required)` : "Prescription unavailable"))}</td><td>${htmlEscape(facilityName(item.facilityId))}</td><td>${htmlEscape(formatReportDate(item.collectedAt))}</td><td>${htmlEscape(formatReportDate(item.reportedAt))}</td><td>${htmlEscape(item.status)}</td><td><div class="table-actions"><button type="button" class="table-action" data-report-view="${htmlEscape(item.id)}">View</button>${editable ? `<button type="button" class="table-action" data-report-edit="${htmlEscape(item.id)}">Edit</button><button type="button" class="table-action delete" data-report-delete="${htmlEscape(item.id)}">Delete</button>` : ""}</div></td></tr>`).join("");
    document.querySelector("[data-report-empty]").hidden = list.length > 0;
    document.querySelector("[data-report-count]").textContent = `${list.length} ${list.length === 1 ? "report" : "reports"}`;
  }

  function saveReport(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const fail = text => { const error = document.querySelector("[data-report-error]"); error.textContent = text; error.hidden = false; error.focus(); };
    const header = ["facilityId", "interventionistId", "specialistId", "workflow", "domain", "interventionItemId", "status", "specimen", "site", "standardCode", "codeSystem", "indication", "impression"];
    const data = Object.fromEntries(header.map(key => [key, form.querySelector(`[name="${key}"]`).value.trim()]));
    const old = editingReportId ? state.interventionReports.find(item => item.id === editingReportId && item.patientId === patientKey()) : null;
    if (editingReportId && !old) return fail("This report is no longer available. Reload the page.");
    if (!data.interventionItemId || !reportPrescriptionItems().some(item => item.id === data.interventionItemId)) return fail("Select an available prescribed intervention for this patient.");
    if (!state.facilities.some(item => item.id === data.facilityId && item.status !== "Deleted")) return fail("Select an available facility.");
    if (!["Pathology", "Histopathology"].includes(data.workflow)) return fail("Select a workflow type.");
    if (!["Ordered", "In Progress", "Preliminary", "Final", "Amended", "Cancelled"].includes(data.status)) return fail("Select a report status.");
    if (["collectedDate", "collectedTime", "reportedDate", "reportedTime"].some(key => !form.elements[key].validity.valid)) return fail("Enter valid collection and reported dates and times, or leave them blank.");
    const collectedDate = form.elements.collectedDate.value, collectedTime = form.elements.collectedTime.value;
    const reportedDate = form.elements.reportedDate.value, reportedTime = form.elements.reportedTime.value;
    if ((!collectedDate && collectedTime) || (!reportedDate && reportedTime)) return fail("Enter a date for each time, or leave the time blank.");
    data.collectedAt = collectedDate + (collectedTime ? `T${collectedTime}` : "");
    data.reportedAt = reportedDate + (reportedTime ? `T${reportedTime}` : "");
    const nowDate = new Date();
    nowDate.setMinutes(nowDate.getMinutes() - nowDate.getTimezoneOffset());
    const now = nowDate.toISOString().slice(0, -1);
    if ([data.collectedAt, data.reportedAt].some(value => value && value > (value.length > 10 ? now : now.slice(0, 10)))) return fail("Collection and reported dates cannot be in the future.");
    const timeSeconds = value => { const [hours, minutes, seconds = 0] = value.split(":").map(Number); return hours * 3600 + minutes * 60 + seconds; };
    if (collectedDate && reportedDate && (reportedDate < collectedDate || (reportedDate === collectedDate && collectedTime && reportedTime && timeSeconds(reportedTime) < timeSeconds(collectedTime)))) return fail("Reported date and time cannot be before collection.");
    if ([data.interventionistId, data.specialistId].some(id => id && !state.practitioners.some(item => item.id === id && item.status !== "Deleted"))) return fail("Select an available practitioner.");
    if (Boolean(data.standardCode.trim()) !== Boolean(data.codeSystem.trim())) return fail("Enter both the test code and its code system, or leave both blank.");
    const observations = [];
    for (const row of form.querySelectorAll("[data-report-observation]")) {
      const get = name => row.querySelector(`[name="${name}"]`).value.trim();
      const item = Object.fromEntries(["section", "parameter", "code", "codeSystem", "type", "value", "qualifier", "unit", "referenceLow", "referenceHigh", "referenceText", "flag", "note"].map(name => [name, get(name)]));
      if (!item.value && !item.code && !item.codeSystem && !item.qualifier && !item.unit && !item.referenceLow && !item.referenceHigh && !item.referenceText && !item.flag && !item.note) {
        if (row.dataset.template === "true" || (!item.section && !item.parameter)) continue;
        return fail("Enter a result value or remove the empty observation.");
      }
      if (!item.parameter || !item.value) return fail("Each observation with details needs a parameter name and result value.");
      if (!REPORT_TYPES.some(([type]) => type === item.type)) return fail("Select a valid observation type.");
      if (item.type === "numeric" && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(item.value)) return fail(`Enter a numeric value for ${item.parameter}; use the qualifier field for < or >.`);
      if (item.type !== "numeric" && item.qualifier) return fail(`Numeric qualifiers apply only to numeric values: ${item.parameter}.`);
      if ([item.referenceLow, item.referenceHigh].some(value => value && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))) return fail(`Reference bounds for ${item.parameter} must be numbers.`);
      if (item.referenceLow && item.referenceHigh && Number(item.referenceLow) > Number(item.referenceHigh)) return fail(`Reference low exceeds reference high for ${item.parameter}.`);
      if (Boolean(item.code) !== Boolean(item.codeSystem)) return fail(`Enter both the parameter code and code system for ${item.parameter}, or leave both blank.`);
      observations.push({ id: row.dataset.id || createId("IOBS"), ...item });
    }
    const narratives = [];
    for (const row of form.querySelectorAll("[data-report-narrative]")) {
      const title = row.querySelector('[name="title"]').value.trim(), text = row.querySelector('[name="text"]').value.trim();
      if (!title && !text) continue;
      if (!title || !text) return fail("Each narrative section needs a name and text.");
      narratives.push({ id: row.dataset.id || createId("INAR"), title, text });
    }
    const starterTemplate = form.querySelector("[data-report-template]").value;
    if (starterTemplate && !Object.keys(REPORT_TEMPLATES).includes(starterTemplate)) return fail("Select a valid starter template.");
    const record = { ...(old || {}), id: old?.id || createId("IREP"), patientId: patientKey(), ...data, starterTemplate, observations, narratives, createdAt: old?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    const previous = state.interventionReports;
    state.interventionReports = [...previous.filter(item => item.id !== record.id), record];
    if (!saveState()) { state.interventionReports = previous; return; }
    resetReportForm();
    renderReports();
    showToast(old ? "Intervention report updated." : "Intervention report saved.");
  }

  function editReport(id) {
    if (!requirePatientProfile()) return;
    const item = state.interventionReports.find(entry => entry.id === id && entry.patientId === patientKey());
    if (!item) return showToast("This report is no longer available.", true);
    resetReportForm();
    editingReportId = id;
    const form = document.querySelector("[data-report-form]");
    ["facilityId", "interventionistId", "specialistId", "workflow", "domain", "interventionItemId", "status", "specimen", "site", "standardCode", "codeSystem", "indication", "impression"].forEach(key => { form.elements[key].value = item[key] || ""; });
    updateReportPrescription();
    const legacy = reportLegacyTest(item);
    const legacyNote = document.querySelector("[data-report-legacy-test]");
    legacyNote.hidden = !legacy;
    legacyNote.textContent = `Previously recorded test: ${legacy}. Select the correct prescribed intervention; no automatic match has been made.`;
    [["collectedAt", "collectedDate", "collectedTime"], ["reportedAt", "reportedDate", "reportedTime"]].forEach(([key, date, time]) => {
      const [dateValue, timeValue = ""] = (item[key] || "").split("T");
      form.elements[date].value = dateValue;
      form.elements[time].value = timeValue;
    });
    form.querySelector("[data-report-template]").value = item.starterTemplate || "";
    item.observations.forEach(addReportObservation);
    item.narratives.forEach(addReportNarrative);
    document.querySelector("[data-report-heading]").textContent = "Edit intervention report";
    document.querySelector("[data-report-submit]").textContent = "Update report";
    document.querySelector("[data-report-cancel]").hidden = false;
    form.scrollIntoView({ block: "start" });
  }

  function viewReport(id) {
    const item = state.interventionReports.find(entry => entry.id === id && entry.patientId === patientKey());
    if (!item) return showToast("This report is no longer available.", true);
    const practitioner = id => id ? rxPractitionerName(id) : "—";
    const linked = reportPrescriptionItems().find(entry => entry.id === item.interventionItemId);
    const rows = [
      ["Prescribed intervention", linked?.name || (item.interventionItemId ? "Prescription unavailable" : "Not linked")],
      ["Intervention method", linked?.method], ["Prescribing practitioner", linked?.practitioner], ["Prescription ID", linked?.prescriptionId],
      ...(item.testId ? [["Previously recorded test", reportLegacyTest(item)]] : []), ["Facility", state.facilities.find(facility => facility.id === item.facilityId)?.name || "Unknown facility"],
      ["Interventionist", practitioner(item.interventionistId)], ["Interpreting specialist", practitioner(item.specialistId)],
      ["Workflow / domain", [item.workflow, item.domain].filter(Boolean).join(" — ")],
      ["Status", item.status], ["Collected", formatReportDate(item.collectedAt)], ["Reported", formatReportDate(item.reportedAt)],
      ["Selected starter template", Array.from(document.querySelector("[data-report-template]").options).find(option => option.value && option.value === item.starterTemplate)?.textContent || "—"],
      ["Specimen / site", [item.specimen, item.site].filter(Boolean).join(" — ")], ["Code", [item.codeSystem, item.standardCode].filter(Boolean).join(": ")],
      ["Clinical indication", item.indication], ["Overall impression", item.impression],
      ...item.observations.map(obs => [`${obs.section ? `${obs.section} — ` : ""}${obs.parameter}`, `${REPORT_TYPES.find(([type]) => type === obs.type)?.[1] || obs.type}: ${obs.qualifier || ""}${obs.value}${obs.unit ? ` ${obs.unit}` : ""}${obs.flag ? ` · ${obs.flag}` : ""}${obs.referenceLow || obs.referenceHigh ? ` · Range: ${obs.referenceLow || "—"} to ${obs.referenceHigh || "—"}` : ""}${obs.referenceText ? ` · ${obs.referenceText}` : ""}${obs.code ? ` · ${obs.codeSystem}: ${obs.code}` : ""}${obs.note ? ` · ${obs.note}` : ""}`]),
      ...item.narratives.map(section => [section.title, section.text]), ["Report ID", item.id]
    ];
    showDetails("Intervention report", rows);
  }

  function initInterventionReports() {
    renderAppHeader("interventions");
    const form = document.querySelector("[data-report-form]");
    document.querySelector("[data-report-form-card]").hidden = !canManageRecords();
    document.querySelector("[data-report-access]").hidden = canManageRecords();
    resetReportForm();
    renderReports();
    form.addEventListener("submit", saveReport);
    form.elements.interventionItemId.addEventListener("change", updateReportPrescription);
    form.addEventListener("click", event => {
      if (event.target.closest("[data-report-add-observation]")) addReportObservation();
      else if (event.target.closest("[data-report-add-narrative]")) addReportNarrative();
      else if (event.target.closest("[data-report-remove]")) event.target.closest("[data-report-observation], [data-report-narrative]").remove();
      else if (event.target.closest("[data-report-cancel]")) resetReportForm();
      else if (event.target.closest("[data-report-apply]")) {
        const key = form.querySelector("[data-report-template]").value;
        if (!REPORT_TEMPLATES[key]) return showToast("Select a starter template first.", true);
        REPORT_TEMPLATES[key].forEach(([section, parameter, type]) => addReportObservation({ section, parameter, type, template: true }));
      }
    });
    document.querySelector("[data-report-body]").addEventListener("click", event => {
      const view = event.target.closest("[data-report-view]"), edit = event.target.closest("[data-report-edit]"), del = event.target.closest("[data-report-delete]");
      if (view) viewReport(view.dataset.reportView);
      if (edit) editReport(edit.dataset.reportEdit);
      if (del && requirePatientProfile()) {
        const id = del.dataset.reportDelete;
        if (!state.interventionReports.some(item => item.id === id && item.patientId === patientKey())) return showToast("This report is no longer available.", true);
        if (!window.confirm("Delete this intervention report and its observations?")) return;
        const previous = state.interventionReports;
        state.interventionReports = previous.filter(item => item.id !== id || item.patientId !== patientKey());
        if (!saveState()) { state.interventionReports = previous; return; }
        if (editingReportId === id) resetReportForm();
        renderReports();
        showToast("Intervention report deleted.");
      }
    });
  }

  function latestOpenPrescriptions() {
    const latest = new Map();
    state.prescriptions.filter(item => item.patientId === patientKey() && isClinicalRx(item)).forEach(item => {
      const current = latest.get(item.practitionerId);
      if (!current || item.issuedAt > current.issuedAt) latest.set(item.practitionerId, item);
    });
    return [...latest.values()].filter(rx => !rx.closed);
  }

  // Latest prescription of each practitioner for this patient drives the daily schedule.
  function medicationSchedule(day) {
    const entries = [];
    latestOpenPrescriptions().forEach(rx => {
      state.prescriptionMedications.filter(med => med.prescriptionId === rx.id).forEach(med => {
        med.timings.forEach(timing => {
          const taken = state.medicationLogs.some(log => log.medicationId === med.id && log.timing === timing && log.scheduledDate === day);
          if (!taken) entries.push({ med, rx, timing });
        });
      });
    });
    return entries.sort((a, b) => RX_TIMINGS.indexOf(a.timing) - RX_TIMINGS.indexOf(b.timing) || a.med.drugName.localeCompare(b.med.drugName));
  }

  let editingOpeningStockId = null;

  function availableStockMedications() {
    const prescriptions = new Map(latestOpenPrescriptions().map(rx => [rx.id, rx]));
    const groups = new Map();
    state.prescriptionMedications
      .filter(med => med.patientId === patientKey() && prescriptions.has(med.prescriptionId))
      .forEach(med => {
        const key = med.drugName.trim().toLowerCase();
        if (!groups.has(key)) groups.set(key, { name: med.drugName.trim(), rows: [] });
        groups.get(key).rows.push({ med, rx: prescriptions.get(med.prescriptionId) });
      });
    return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function stockPracticeFilter() {
    return document.querySelector("[data-stock-practice-filter]").value;
  }

  function fillStockPracticeFilter() {
    const select = document.querySelector("[data-stock-practice-filter]");
    const selected = select.value;
    const practices = new Map();
    availableStockMedications().forEach(group => group.rows.forEach(({ rx }) => {
      const practice = medicationPractice(rx.practitionerId);
      if (practice.key !== null) practices.set(practice.key, practice.name);
    }));
    select.innerHTML = '<option value="">All practice types</option>' +
      [...practices].sort((a, b) => a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]))
        .map(([id, name]) => `<option value="${htmlEscape(id)}">${htmlEscape(name)}</option>`).join("");
    if (practices.has(selected)) select.value = selected;
  }

  function matchesStockPractice(group, practiceId, unit) {
    if (!practiceId) return true;
    return Boolean(group && group.rows.some(({ med, rx }) =>
      medicationPractice(rx.practitionerId).key === practiceId &&
      (!unit || (typeof med.unit === "string" && med.unit.trim().toLowerCase() === unit.trim().toLowerCase()))));
  }

  function matchingStockEntries(practiceId) {
    const medicines = new Map(availableStockMedications().map(group => [group.name.toLowerCase(), group]));
    return state.openingStocks.filter(item => item.patientId === patientKey() &&
      matchesStockPractice(medicines.get(item.drugName.trim().toLowerCase()), practiceId, item.consumptionUnit))
      .sort((a, b) => a.drugName.localeCompare(b.drugName));
  }

  function fillOpeningStockMedicines() {
    const form = document.querySelector("[data-stock-form]");
    const selected = form.elements.medicationId.value;
    const medicines = availableStockMedications().filter(group => matchesStockPractice(group, stockPracticeFilter()));
    form.elements.medicationId.innerHTML = '<option value="">Select a prescribed medicine...</option>' + medicines.map(group =>
      `<option value="${htmlEscape(group.name.toLowerCase())}">${htmlEscape(group.name)}</option>`
    ).join("");
    form.elements.medicationId.value = medicines.some(group => group.name.toLowerCase() === selected) ? selected : "";
    form.elements.medicationId.dispatchEvent(new Event("change"));
  }

  function resetOpeningStock() {
    editingOpeningStockId = null;
    document.querySelector("[data-stock-practice-filter]").disabled = false;
    const form = document.querySelector("[data-stock-form]");
    form.reset();
    form.elements.openingDate.value = todayInput();
    form.elements.openingDate.max = todayInput();
    form.elements.medicationId.disabled = false;
    fillOpeningStockMedicines();
    document.querySelector("[data-stock-heading]").textContent = "Add opening stock";
    document.querySelector("[data-stock-submit]").textContent = "Save opening stock";
    document.querySelector("[data-stock-cancel]").hidden = true;
    document.querySelector("[data-stock-error]").hidden = true;
  }

  function renderOpeningStocks() {
    const list = matchingStockEntries(stockPracticeFilter()).sort((a, b) => b.openingDate.localeCompare(a.openingDate));
    const body = document.querySelector("[data-stock-body]");
    body.innerHTML = list.map(item => `<tr><td>${htmlEscape(item.openingDate)}</td><td>${htmlEscape(item.drugName)}</td><td>${htmlEscape(item.practitionerName)}</td><td>${htmlEscape(item.quantity)} ${htmlEscape(item.consumptionUnit)}</td><td>${htmlEscape(item.orderUnit)}</td><td>1 ${htmlEscape(item.orderUnit)} = ${htmlEscape(item.conversion)} ${htmlEscape(item.consumptionUnit)}</td><td>${htmlEscape(item.reorderLevel)} ${htmlEscape(item.consumptionUnit)}</td><td>${item.leadTimeDays == null ? "Not set" : `${htmlEscape(item.leadTimeDays)} days`}</td><td><div class="table-actions"><button type="button" class="table-action" data-stock-view="${htmlEscape(item.id)}">View</button>${canManageRecords() ? `<button type="button" class="table-action" data-stock-edit="${htmlEscape(item.id)}">Edit</button><button type="button" class="table-action delete" data-stock-delete="${htmlEscape(item.id)}">Delete</button>` : ""}</div></td></tr>`).join("");
    document.querySelector("[data-stock-count]").textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"}`;
    document.querySelector("[data-stock-empty]").hidden = list.length > 0;
  }

  function saveOpeningStock(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-stock-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const values = form.elements;
    const openingDate = values.openingDate.value;
    const quantity = Number(values.quantity.value);
    const conversion = Number(values.conversion.value);
    const reorderLevel = Number(values.reorderLevel.value);
    const leadTimeDays = Number(values.leadTimeDays.value);
    const orderUnit = values.orderUnit.value.trim();
    if (!openingDate || openingDate > todayInput()) return fail("Enter an opening date that is not in the future.");
    if (values.quantity.value === "" || !Number.isFinite(quantity) || quantity < 0) return fail("Enter an opening quantity of zero or more.");
    if (!orderUnit || values.conversion.value === "" || !Number.isFinite(conversion) || conversion <= 0) return fail("Enter an order unit and a conversion greater than zero.");
    if (values.reorderLevel.value === "" || !Number.isFinite(reorderLevel) || reorderLevel < 0) return fail("Enter a reorder level of zero or more.");
    if (values.leadTimeDays.value === "" || !Number.isSafeInteger(leadTimeDays) || leadTimeDays < 0) return fail("Enter lead time as a whole number of days, zero or more.");
    state = loadState();
    const previous = editingOpeningStockId && state.openingStocks.find(item => item.id === editingOpeningStockId && item.patientId === patientKey());
    if (editingOpeningStockId && !previous) return fail("This entry is no longer available. Reload the page and try again.");
    if (previous && state.stockReceipts.some(receipt => receipt.patientId === patientKey() && receipt.openingStockId === previous.id && receipt.receivedAt.slice(0, 10) < openingDate)) {
      return fail("The opening date cannot be after an existing receipt. Edit the receipt first.");
    }
    const selected = !previous && availableStockMedications().find(item => item.name.toLowerCase() === values.medicationId.value && matchesStockPractice(item, stockPracticeFilter()));
    if (!previous && !selected) return fail("Select a medicine from a current open prescription.");
    if (selected && new Set(selected.rows.map(({ med }) => med.unit.trim().toLowerCase())).size !== 1) {
      return fail("This medicine has different consumption units across its prescriptions. Correct the prescription units before recording opening stock.");
    }
    const source = previous || {
      medicationId: selected.rows[0].med.id,
      prescriptionId: selected.rows[0].rx.id,
      medicationIds: selected.rows.map(({ med }) => med.id),
      prescriptionIds: [...new Set(selected.rows.map(({ rx }) => rx.id))],
      drugName: selected.name,
      consumptionUnit: selected.rows[0].med.unit,
      practitionerName: [...new Set(selected.rows.map(({ rx }) => rxPractitionerName(rx.practitionerId)))].join(", ")
    };
    const duplicate = state.openingStocks.find(item => item.patientId === patientKey() && item.id !== editingOpeningStockId &&
      item.drugName.trim().toLowerCase() === source.drugName.trim().toLowerCase() &&
      item.consumptionUnit.trim().toLowerCase() === source.consumptionUnit.trim().toLowerCase());
    if (duplicate) return fail("An opening balance already exists for this medicine and unit. Edit the existing entry instead of counting the same stock twice.");
    const entry = { ...source, id: editingOpeningStockId || createId("OPEN"), patientId: patientKey(), openingDate, quantity, orderUnit, conversion, reorderLevel, leadTimeDays };
    const before = state.openingStocks.slice();
    if (previous) state.openingStocks = state.openingStocks.map(item => item.id === previous.id && item.patientId === patientKey() ? entry : item);
    else state.openingStocks.push(entry);
    if (!saveState()) { state.openingStocks = before; return; }
    resetOpeningStock();
    renderOpeningStocks();
    showToast(previous ? "Opening stock updated." : "Opening stock saved.");
  }

  function initOpeningStock() {
    renderAppHeader("dashboard");
    const canEdit = canManageRecords();
    document.querySelector("[data-stock-form-card]").hidden = !canEdit;
    document.querySelector("[data-stock-access]").hidden = canEdit;
    const form = document.querySelector("[data-stock-form]");
    form.elements.medicationId.addEventListener("change", () => {
      const selected = availableStockMedications().find(item => item.name.toLowerCase() === form.elements.medicationId.value);
      document.querySelector("[data-stock-prescription]").textContent = selected
        ? `Prescribed: ${selected.rows.map(({ med, rx }) => `${rxPractitionerName(rx.practitionerId)} — ${rxDescribeMed(med)}`).join("; ")}`
        : form.elements.medicationId.options.length > 1 ? "Select a medicine to see its prescribed doses." : "No current prescribed medicines match this filter.";
    });
    fillStockPracticeFilter();
    resetOpeningStock();
    document.querySelector("[data-stock-practice-filter]").addEventListener("change", () => {
      state = loadState();
      fillStockPracticeFilter();
      fillOpeningStockMedicines();
      renderOpeningStocks();
    });
    form.addEventListener("submit", saveOpeningStock);
    document.addEventListener("click", event => {
      if (event.target.closest("[data-stock-cancel]")) { resetOpeningStock(); return; }
      const button = event.target.closest("[data-stock-view], [data-stock-edit], [data-stock-delete]");
      if (!button) return;
      const id = button.dataset.stockView || button.dataset.stockEdit || button.dataset.stockDelete;
      const item = state.openingStocks.find(entry => entry.id === id && entry.patientId === patientKey());
      if (!item) return showToast("This opening stock entry is no longer available.", true);
      if (button.dataset.stockView) {
        showDetails("Opening stock", [["Medicine", item.drugName], ["Practitioner", item.practitionerName], ["Opening date", item.openingDate], ["Opening quantity", `${item.quantity} ${item.consumptionUnit}`], ["Order unit", item.orderUnit], ["Conversion", `1 ${item.orderUnit} = ${item.conversion} ${item.consumptionUnit}`], ["Reorder level", `${item.reorderLevel} ${item.consumptionUnit}`], ["Lead time", item.leadTimeDays == null ? "Not set" : `${item.leadTimeDays} days`]]);
      } else if (button.dataset.stockEdit) {
        if (!requirePatientProfile()) return;
        resetOpeningStock();
        editingOpeningStockId = item.id;
        document.querySelector("[data-stock-practice-filter]").disabled = true;
        form.elements.medicationId.innerHTML = `<option value="${htmlEscape(item.medicationId)}">${htmlEscape(item.drugName)} · ${htmlEscape(item.practitionerName)}</option>`;
        form.elements.medicationId.disabled = true;
        form.elements.openingDate.value = item.openingDate;
        form.elements.quantity.value = item.quantity;
        form.elements.orderUnit.value = item.orderUnit;
        form.elements.conversion.value = item.conversion;
        form.elements.reorderLevel.value = item.reorderLevel;
        form.elements.leadTimeDays.value = item.leadTimeDays ?? "";
        document.querySelector("[data-stock-prescription]").textContent = `Consumption unit: ${item.consumptionUnit}`;
        document.querySelector("[data-stock-heading]").textContent = "Edit opening stock";
        document.querySelector("[data-stock-submit]").textContent = "Update opening stock";
        document.querySelector("[data-stock-cancel]").hidden = false;
        form.scrollIntoView({ block: "start" });
      } else {
        if (!requirePatientProfile()) return;
        state = loadState();
        if (state.stockReceipts.some(receipt => receipt.patientId === patientKey() && receipt.openingStockId === id)) {
          return showToast("Cannot delete this opening stock entry while receipts refer to it. Delete the receipts first.", true);
        }
        if (!window.confirm("Delete this opening stock entry?")) return;
        const before = state.openingStocks;
        state.openingStocks = before.filter(entry => !(entry.id === id && entry.patientId === patientKey()));
        if (!saveState()) { state.openingStocks = before; return; }
        if (editingOpeningStockId === id) resetOpeningStock();
        renderOpeningStocks();
        showToast("Opening stock deleted.");
      }
    });
    renderOpeningStocks();
  }

  let editingReceiptId = null;

  function fillReceiptMedicines() {
    const form = document.querySelector("[data-receipt-form]");
    const selected = form.elements.openingStockId.value;
    const items = matchingStockEntries(stockPracticeFilter());
    form.elements.openingStockId.innerHTML = '<option value="">Select an opening stock entry...</option>' + items.map(item =>
      `<option value="${htmlEscape(item.id)}">${htmlEscape(item.drugName)} (${htmlEscape(item.consumptionUnit)})</option>`
    ).join("");
    form.elements.openingStockId.value = items.some(item => item.id === selected) ? selected : "";
    form.elements.openingStockId.dispatchEvent(new Event("change"));
  }

  function resetReceiptForm() {
    editingReceiptId = null;
    document.querySelector("[data-stock-practice-filter]").disabled = false;
    const form = document.querySelector("[data-receipt-form]");
    form.reset();
    form.elements.receivedAt.value = nowLocalInput();
    form.elements.receivedAt.max = nowLocalInput();
    form.elements.openingStockId.disabled = false;
    fillReceiptMedicines();
    document.querySelector("[data-receipt-heading]").textContent = "Add receipt";
    document.querySelector("[data-receipt-submit]").textContent = "Save receipt";
    document.querySelector("[data-receipt-cancel]").hidden = true;
    document.querySelector("[data-receipt-error]").hidden = true;
  }

  function renderReceipts() {
    const practiceId = stockPracticeFilter();
    const stockIds = new Set(matchingStockEntries(practiceId).map(item => item.id));
    const receipts = state.stockReceipts.filter(item => item.patientId === patientKey() && (!practiceId || stockIds.has(item.openingStockId))).sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
    document.querySelector("[data-receipt-body]").innerHTML = receipts.map(item => `<tr><td>${htmlEscape(formatDateTime(item.receivedAt))}</td><td>${htmlEscape(item.vendor)}</td><td>${htmlEscape(item.drugName)}</td><td>${htmlEscape(item.quantity)} ${htmlEscape(item.receivingUnit)}</td><td>${htmlEscape(item.quantity * item.conversion)} ${htmlEscape(item.consumptionUnit)}</td><td><div class="table-actions"><button type="button" class="table-action" data-receipt-view="${htmlEscape(item.id)}">View</button>${canManageRecords() ? `<button type="button" class="table-action" data-receipt-edit="${htmlEscape(item.id)}">Edit</button><button type="button" class="table-action delete" data-receipt-delete="${htmlEscape(item.id)}">Delete</button>` : ""}</div></td></tr>`).join("");
    document.querySelector("[data-receipt-count]").textContent = `${receipts.length} ${receipts.length === 1 ? "receipt" : "receipts"}`;
    document.querySelector("[data-receipt-empty]").hidden = receipts.length > 0;
  }

  function saveReceipt(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-receipt-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const receivedAt = form.elements.receivedAt.value;
    const vendor = form.elements.vendor.value.trim();
    const quantity = Number(form.elements.quantity.value);
    if (!vendor) return fail("Enter the vendor name.");
    if (!receivedAt || receivedAt > nowLocalInput()) return fail("Enter a receipt date and time that is not in the future.");
    if (!form.elements.quantity.value || !Number.isFinite(quantity) || quantity <= 0) return fail("Enter a receipt quantity greater than zero.");
    state = loadState();
    const previous = editingReceiptId && state.stockReceipts.find(item => item.id === editingReceiptId && item.patientId === patientKey());
    if (editingReceiptId && !previous) return fail("This receipt is no longer available. Reload the page and try again.");
    const stockId = previous ? previous.openingStockId : form.elements.openingStockId.value;
    const stock = state.openingStocks.find(item => item.id === stockId && item.patientId === patientKey());
    if (!stock) return fail("Select an available opening stock entry.");
    if (!previous && !matchingStockEntries(stockPracticeFilter()).some(item => item.id === stock.id)) return fail("This medicine no longer matches the selected practice type. Refresh the selection and try again.");
    if (receivedAt.slice(0, 10) < stock.openingDate) return fail("The receipt date cannot be before the opening stock date.");
    const receivingUnit = previous ? previous.receivingUnit : stock.orderUnit;
    const conversion = previous ? previous.conversion : stock.conversion;
    const consumptionUnit = previous ? previous.consumptionUnit : stock.consumptionUnit;
    if (typeof receivingUnit !== "string" || !receivingUnit.trim() || typeof consumptionUnit !== "string" || !consumptionUnit.trim() ||
        !Number.isFinite(conversion) || conversion <= 0 || !Number.isFinite(quantity * conversion)) {
      return fail("The receiving unit or conversion is invalid. Check the opening stock entry.");
    }
    const receipt = { id: previous ? previous.id : createId("RECEIPT"), patientId: patientKey(), openingStockId: stock.id,
      drugName: stock.drugName, receivedAt, vendor, quantity, receivingUnit, conversion, consumptionUnit };
    const before = state.stockReceipts.slice();
    if (previous) state.stockReceipts = state.stockReceipts.map(item => item.id === previous.id && item.patientId === patientKey() ? receipt : item);
    else state.stockReceipts.push(receipt);
    if (!saveState()) { state.stockReceipts = before; return; }
    resetReceiptForm();
    renderReceipts();
    showToast(previous ? "Receipt updated." : "Receipt saved.");
  }

  function initReceipts() {
    renderAppHeader("dashboard");
    const canEdit = canManageRecords();
    document.querySelector("[data-receipt-form-card]").hidden = !canEdit;
    document.querySelector("[data-receipt-access]").hidden = canEdit;
    const form = document.querySelector("[data-receipt-form]");
    form.elements.openingStockId.addEventListener("change", () => {
      const item = state.openingStocks.find(stock => stock.id === form.elements.openingStockId.value && stock.patientId === patientKey());
      document.querySelector("[data-receipt-unit]").textContent = item
        ? `Receiving unit: ${item.orderUnit}. 1 ${item.orderUnit} = ${item.conversion} ${item.consumptionUnit}. Opening date: ${item.openingDate}.`
        : form.elements.openingStockId.options.length > 1 ? "Select a medicine to see its receiving unit and conversion." : "No opening stock entries match this filter.";
    });
    fillStockPracticeFilter();
    resetReceiptForm();
    document.querySelector("[data-stock-practice-filter]").addEventListener("change", () => {
      state = loadState();
      fillStockPracticeFilter();
      fillReceiptMedicines();
      renderReceipts();
    });
    form.addEventListener("submit", saveReceipt);
    document.addEventListener("click", event => {
      if (event.target.closest("[data-receipt-cancel]")) { resetReceiptForm(); return; }
      const button = event.target.closest("[data-receipt-view], [data-receipt-edit], [data-receipt-delete]");
      if (!button) return;
      state = loadState();
      const id = button.dataset.receiptView || button.dataset.receiptEdit || button.dataset.receiptDelete;
      const item = state.stockReceipts.find(receipt => receipt.id === id && receipt.patientId === patientKey());
      if (!item) { renderReceipts(); return showToast("This receipt is no longer available.", true); }
      if (button.dataset.receiptView) {
        showDetails("Receipt", [["Medicine", item.drugName], ["Vendor", item.vendor], ["Received at", formatDateTime(item.receivedAt)],
          ["Quantity", `${item.quantity} ${item.receivingUnit}`], ["Conversion", `1 ${item.receivingUnit} = ${item.conversion} ${item.consumptionUnit}`],
          ["Consumption quantity", `${item.quantity * item.conversion} ${item.consumptionUnit}`], ["Order", "No linked order"]]);
      } else if (button.dataset.receiptEdit) {
        if (!requirePatientProfile()) return;
        resetReceiptForm();
        editingReceiptId = id;
        document.querySelector("[data-stock-practice-filter]").disabled = true;
        form.elements.openingStockId.value = item.openingStockId;
        form.elements.openingStockId.disabled = true;
        form.elements.receivedAt.value = item.receivedAt;
        form.elements.vendor.value = item.vendor;
        form.elements.quantity.value = item.quantity;
        document.querySelector("[data-receipt-unit]").textContent = `Receiving unit: ${item.receivingUnit}. 1 ${item.receivingUnit} = ${item.conversion} ${item.consumptionUnit} (recorded conversion).`;
        document.querySelector("[data-receipt-heading]").textContent = "Edit receipt";
        document.querySelector("[data-receipt-submit]").textContent = "Update receipt";
        document.querySelector("[data-receipt-cancel]").hidden = false;
        form.scrollIntoView({ block: "start" });
      } else {
        if (!requirePatientProfile() || !window.confirm("Delete this receipt? Its quantity will be removed from estimated stock.")) return;
        const before = state.stockReceipts;
        state.stockReceipts = before.filter(receipt => !(receipt.id === id && receipt.patientId === patientKey()));
        if (!saveState()) { state.stockReceipts = before; return; }
        if (editingReceiptId === id) resetReceiptForm();
        renderReceipts();
        showToast("Receipt deleted.");
      }
    });
    renderReceipts();
  }

  function estimatedStock(item) {
    const opening = item.quantity;
    if (!Number.isFinite(opening) || opening < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(item.openingDate) || item.openingDate > todayInput()) {
      return { value: null, reason: "Invalid opening balance or date" };
    }
    let consumed = 0;
    for (const log of state.medicationLogs) {
      if (log.patientId !== patientKey() || typeof log.drugName !== "string" ||
          log.drugName.trim().toLowerCase() !== item.drugName.trim().toLowerCase()) continue;
      if (typeof log.takenAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(log.takenAt)) {
        return { value: null, reason: "Check medication log dates" };
      }
      if (log.takenAt.slice(0, 10) < item.openingDate) continue;
      if (log.takenAt > nowLocalInput()) return { value: null, reason: "Check future medication log dates" };
      if (!Number.isFinite(log.quantity) || log.quantity <= 0 ||
          typeof log.unit !== "string" || log.unit.trim().toLowerCase() !== item.consumptionUnit.trim().toLowerCase()) {
        return { value: null, reason: "Check quantity and unit on medication logs" };
      }
      consumed += log.quantity;
    }
    let received = 0;
    for (const receipt of state.stockReceipts) {
      if (receipt.patientId !== patientKey() || receipt.openingStockId !== item.id) continue;
      if (typeof receipt.receivedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(receipt.receivedAt) ||
          receipt.receivedAt.slice(0, 10) < item.openingDate || receipt.receivedAt > nowLocalInput() ||
          !Number.isFinite(receipt.quantity) || receipt.quantity <= 0 ||
          !Number.isFinite(receipt.conversion) || receipt.conversion <= 0 ||
          typeof receipt.consumptionUnit !== "string" || receipt.consumptionUnit.trim().toLowerCase() !== item.consumptionUnit.trim().toLowerCase()) {
        return { value: null, reason: "Check receipt dates, quantities and units" };
      }
      received += receipt.quantity * receipt.conversion;
    }
    const value = opening + received - consumed;
    return Number.isFinite(value) ? { value, reason: "" } : { value: null, reason: "Stock movements are too large to calculate" };
  }

  function stockPracticeGroup(medicine) {
    if (!medicine) return { key: "no-prescription", label: "No current prescription", rank: 2 };
    const practices = new Map(medicine.rows.map(({ rx }) => {
      const practice = medicationPractice(rx.practitionerId);
      return [practice.key, practice];
    }));
    const sorted = [...practices.values()].sort((a, b) => a.name.localeCompare(b.name) || String(a.key).localeCompare(String(b.key)));
    const names = sorted.map(practice => practice.name).join(" + ");
    return {
      key: JSON.stringify(sorted.map(practice => practice.key).sort()),
      label: sorted.length > 1 ? `Shared: ${names}` : names,
      rank: sorted.some(practice => practice.key === null) ? 1 : 0
    };
  }

  function stockGroupedRows(rows, columns) {
    const groups = new Map();
    rows.forEach(({ group, row }) => {
      if (!groups.has(group.key)) groups.set(group.key, { ...group, rows: [] });
      groups.get(group.key).rows.push(row);
    });
    return [...groups.values()].sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label) || a.key.localeCompare(b.key))
      .map(group => `<tr class="stock-group-heading"><th scope="row" colspan="${columns}">${htmlEscape(group.label)}</th></tr>${group.rows.join("")}`).join("");
  }

  function renderSafetyStock() {
    const medicines = new Map(availableStockMedications().map(group => [group.name.toLowerCase(), group]));
    const entries = state.openingStocks.filter(item => item.patientId === patientKey())
      .sort((a, b) => a.drugName.localeCompare(b.drugName));
    const format = value => new Intl.NumberFormat(undefined, { maximumSignificantDigits: 15 }).format(value);
    const orders = [];
    const stockRows = entries.map(item => {
      const group = medicines.get(item.drugName.trim().toLowerCase());
      const practiceGroup = stockPracticeGroup(group);
      const matchesUnit = group && typeof item.consumptionUnit === "string" && item.consumptionUnit.trim() &&
        group.rows.every(({ med }) => typeof med.unit === "string" && med.unit.trim().toLowerCase() === item.consumptionUnit.trim().toLowerCase());
      const validDoses = matchesUnit && group.rows.every(({ med }) => Number.isFinite(Number(med.quantity)) && Number(med.quantity) > 0 &&
        Array.isArray(med.timings) && med.timings.length > 0 && new Set(med.timings).size === med.timings.length && med.timings.every(timing => RX_TIMINGS.includes(timing)));
      const sum = validDoses ? group.rows.reduce((total, { med }) => total + Number(med.quantity) * med.timings.length, 0) : null;
      const dosage = Number.isFinite(sum) ? sum : null;
      const unit = htmlEscape(item.consumptionUnit);
      const dosageText = dosage === null ? (group ? "Unavailable: check dose or units" : "No current prescription") : `${format(dosage)} ${unit}/day`;
      const quantityText = value => Number.isFinite(value) ? `${format(value)} ${unit}` : "Unavailable";
      const safety = dosage === null ? "Unavailable" : quantityText(dosage);
      const lead = item.leadTimeDays;
      const hasLead = Number.isSafeInteger(lead) && lead >= 0;
      const demand = dosage !== null && hasLead ? quantityText(dosage * lead) : "Unavailable";
      const thresholdValue = dosage !== null && hasLead ? dosage * (lead + 1) : null;
      const threshold = thresholdValue !== null ? quantityText(thresholdValue) : "Unavailable";
      const stock = typeof item.consumptionUnit === "string" && item.consumptionUnit.trim()
        ? estimatedStock(item) : { value: null, reason: "Check opening stock unit" };
      const stockText = stock.value === null ? `Unavailable: ${htmlEscape(stock.reason)}` : quantityText(stock.value);
      const coverage = stock.value !== null && stock.value >= 0 && dosage !== null && dosage > 0
        ? Math.floor(stock.value / dosage) : null;
      const daysText = Number.isSafeInteger(coverage) ? `${format(coverage)} days` : "Unavailable";
      let status = "Not available: check stock, dosage and lead time";
      if (stock.value !== null && Number.isFinite(thresholdValue)) {
        if (stock.value > thresholdValue) {
          status = "Above reorder threshold";
        } else {
          const conversion = Number(item.conversion);
          const required = dosage * (30 + lead) - stock.value;
          const orderUnits = Math.ceil(required / conversion);
          if (Number.isFinite(conversion) && conversion > 0 && typeof item.orderUnit === "string" && item.orderUnit.trim() &&
              Number.isSafeInteger(orderUnits) && orderUnits > 0) {
            const risk = stock.value < dosage * lead ? "May run out before delivery" : "Reorder";
            status = risk;
            orders.push({ group: practiceGroup, row: `<tr><td>${htmlEscape(item.drugName)}</td><td>${htmlEscape(risk)}</td><td>${format(orderUnits)} ${htmlEscape(item.orderUnit)}</td><td>${quantityText(orderUnits * conversion)}</td></tr>` });
          } else {
            status = "Reorder: check order unit and conversion";
          }
        }
      }
      return { group: practiceGroup, row: `<tr><td>${htmlEscape(item.drugName)}</td><td>${dosageText}</td><td>${stockText}</td><td>${threshold}</td><td>${daysText}</td><td>${hasLead ? `${lead} days` : "Not set"}</td><td>Not available</td><td>${safety}</td><td>${demand}</td><td>${htmlEscape(item.reorderLevel)} ${unit}</td><td>${status}</td></tr>` };
    });
    document.querySelector("[data-safety-body]").innerHTML = stockGroupedRows(stockRows, 11);
    document.querySelector("[data-safety-empty]").hidden = entries.length > 0;
    document.querySelector("[data-order-body]").innerHTML = stockGroupedRows(orders, 4);
    document.querySelector("[data-order-empty]").hidden = orders.length > 0;
  }

  function initSafetyStock() {
    renderAppHeader("safety-stock");
    const refresh = () => { state = loadState(); renderSafetyStock(); };
    renderSafetyStock();
    window.addEventListener("storage", event => {
      if (event.key === STORE_KEY || event.key === USER_KEY || event.key === null) refresh();
    });
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
  }

  function displayedMedicationLogs() {
    const day = document.querySelector("[data-log-date]").value;
    return state.medicationLogs.filter(log => log.patientId === patientKey() && (!day || log.takenAt.slice(0, 10) === day))
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt));
  }

  function medicationPractice(practitionerId) {
    const practitioner = state.practitioners.find(item => item.id === practitionerId);
    const practice = practitioner && state.practiceTypes.find(item => item.id === practitioner.practiceId);
    return practice ? { key: practice.id, name: practice.name } : { key: null, name: "Practice type unavailable" };
  }

  function medicationColumns() {
    const groups = new Map();
    const getGroup = practitionerId => {
      const practice = medicationPractice(practitionerId);
      if (!groups.has(practice.key)) groups.set(practice.key, { ...practice, schedule: [], logs: [] });
      return groups.get(practice.key);
    };
    const prescriptions = latestOpenPrescriptions();
    prescriptions.forEach(rx => {
      if (state.prescriptionMedications.some(med => med.prescriptionId === rx.id)) getGroup(rx.practitionerId);
    });
    medicationSchedule(todayInput()).forEach(entry => getGroup(entry.rx.practitionerId).schedule.push(entry));
    displayedMedicationLogs().forEach(log => {
      const rx = state.prescriptions.find(item => item.id === log.prescriptionId && item.patientId === log.patientId);
      getGroup(log.practitionerId || rx?.practitionerId).logs.push(log);
    });
    return [...groups.values()].sort((a, b) => {
      if (a.key === null) return b.key === null ? 0 : 1;
      if (b.key === null) return -1;
      return a.name.localeCompare(b.name) || a.key.localeCompare(b.key);
    });
  }

  function renderSchedule() {
    const box = document.querySelector("[data-schedule]");
    if (!box) return;
    const canEdit = canManageRecords();
    const columns = medicationColumns();
    box.innerHTML = columns.map(column => `<section class="med-practice-column"><h3>${htmlEscape(column.name)}</h3><div class="med-practice-list">${column.schedule.map(({ med, rx, timing }) => `
      <div class="med-item">
        <div class="med-name"><b>${htmlEscape(med.drugName)}</b> - ${htmlEscape(med.quantity)} ${htmlEscape(med.unit)}</div>
        <div class="med-practitioner">${htmlEscape(rxPractitionerName(rx.practitionerId))}</div>
        <div class="med-time">${timing}</div>
        <div class="med-meal">${htmlEscape(med.mealQualifier)}</div>
        ${canEdit ? `<div class="med-actions"><input type="datetime-local" value="${nowLocalInput()}" max="${nowLocalInput()}" aria-label="Time taken"><button type="button" class="med-take" data-take-med="${htmlEscape(med.id)}" data-take-timing="${timing}">Mark Taken</button></div>` : ""}
      </div>`).join("") || '<p class="med-practice-empty">No medications due.</p>'}</div></section>`).join("");
    document.querySelector("[data-schedule-empty]").hidden = columns.length > 0;
  }

  function renderMedLog() {
    const list = document.querySelector("[data-med-log]");
    if (!list) return;
    const columns = medicationColumns();
    list.innerHTML = columns.map(column => `<section class="med-practice-column"><h3>${htmlEscape(column.name)}</h3><div class="med-practice-list">${column.logs.map(log => {
      const dose = Number.isFinite(log.quantity) && log.quantity > 0 && typeof log.unit === "string" && log.unit.trim()
        ? `${htmlEscape(log.quantity)} ${htmlEscape(log.unit)} taken`
        : "taken (quantity not recorded)";
      const rx = state.prescriptions.find(item => item.id === log.prescriptionId && item.patientId === log.patientId);
      return `<div class="log-row"><div><b>${htmlEscape(log.drugName)}</b> — ${dose}<small>${htmlEscape(rxPractitionerName(log.practitionerId || rx?.practitionerId))} · ${htmlEscape(formatDateTime(log.takenAt))}</small></div>${canManageRecords() ? `<div class="table-actions"><button class="table-action" type="button" data-log-view="${htmlEscape(log.id)}">View</button><button class="table-action" type="button" data-log-edit="${htmlEscape(log.id)}">Edit</button><button class="table-action delete" type="button" data-log-delete="${htmlEscape(log.id)}">Delete</button></div>` : ""}</div>`;
    }).join("") || '<p class="med-practice-empty">No medication logs for this selection.</p>'}</div></section>`).join("");
    document.querySelector("[data-log-empty]").hidden = columns.length > 0;
  }

  function viewLog(id) {
    const log = state.medicationLogs.find(entry => entry.id === id);
    if (!log) return;
    showDetails("Medication log", [
      ["Medicine", log.drugName],
      ["Quantity taken", Number.isFinite(log.quantity) && log.unit ? `${log.quantity} ${log.unit}` : "Not recorded — edit the log if known"],
      ["Scheduled", `${log.scheduledDate} · ${log.timing}`],
      ["Taken at", formatDateTime(log.takenAt)],
      ["Practitioner", rxPractitionerName(log.practitionerId)],
      ["Prescription ID", log.prescriptionId],
      ["Log ID", log.id]
    ]);
  }

  function editLog(id) {
    if (!requirePatientProfile()) return;
    const log = state.medicationLogs.find(entry => entry.id === id);
    if (!log) return;
    if (!state.prescriptionMedications.some(entry => entry.id === log.medicationId)) return showToast("This log's medication no longer exists, so it can only be deleted.", true);
    let dialog = document.querySelector("[data-log-edit-dialog]");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "record-dialog";
      dialog.dataset.logEditDialog = "";
      document.body.append(dialog);
    }
    dialog.innerHTML = `<form class="record-form" novalidate><h2>Edit medication log</h2><div class="symptom-form"><p class="rx-hint">${htmlEscape(log.drugName)} · ${htmlEscape(log.timing)}</p><label class="form-field">Time taken<input type="datetime-local" name="takenAt" required value="${htmlEscape(log.takenAt)}" max="${nowLocalInput()}"></label><p class="rx-hint">Enter the actual quantity and unit taken if known. Older logs without these details cannot be included in estimated stock.</p><div class="symptom-row"><label class="form-field">Quantity taken<input type="number" name="quantity" min="0" step="any" value="${htmlEscape(log.quantity ?? "")}"></label><label class="form-field">Unit taken<input name="unit" maxlength="30" value="${htmlEscape(log.unit ?? "")}"></label></div><p class="form-error" data-log-error role="alert" hidden></p><div class="symptom-actions"><button type="button" class="button button-secondary" data-log-cancel>Cancel</button><button type="submit" class="button button-primary">Update log</button></div></div></form>`;
    dialog.querySelector("[data-log-cancel]").addEventListener("click", () => dialog.close());
    dialog.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      const value = event.currentTarget.elements.takenAt.value;
      const error = dialog.querySelector("[data-log-error]");
      if (!value || value > nowLocalInput()) {
        error.textContent = value ? "Time taken cannot be in the future." : "Time taken is required.";
        error.hidden = false;
        return;
      }
      const quantityValue = event.currentTarget.elements.quantity.value;
      const unit = event.currentTarget.elements.unit.value.trim();
      const quantity = Number(quantityValue);
      if ((quantityValue || unit) && (!quantityValue || !Number.isFinite(quantity) || quantity <= 0 || !unit)) {
        error.textContent = "Enter both a quantity greater than zero and its unit, or leave both blank if unknown.";
        error.hidden = false;
        return;
      }
      const previous = { ...log };
      log.takenAt = value;
      if (quantityValue) { log.quantity = quantity; log.unit = unit; }
      else { delete log.quantity; delete log.unit; }
      if (!saveState()) {
        Object.keys(log).forEach(key => delete log[key]);
        Object.assign(log, previous);
        return;
      }
      dialog.close();
      renderSchedule();
      renderMedLog();
      showToast("Medication log updated.");
    });
    dialog.showModal();
  }

  function deleteLog(id) {
    if (!requirePatientProfile()) return;
    if (!window.confirm("Delete this log? The dose will return to today's schedule if it was due today.")) return;
    const index = state.medicationLogs.findIndex(entry => entry.id === id);
    if (index < 0) return;
    const [removed] = state.medicationLogs.splice(index, 1);
    if (!saveState()) {
      state.medicationLogs.splice(index, 0, removed);
      return;
    }
    renderSchedule();
    renderMedLog();
    showToast("Medication log deleted.");
  }

  function markTaken(button) {
    if (!requirePatientProfile()) return;
    const item = button.closest(".med-item");
    const takenAt = item.querySelector('input[type="datetime-local"]').value;
    if (!takenAt) return showToast("Enter the time the medication was taken.", true);
    if (takenAt > nowLocalInput()) return showToast("Time taken cannot be in the future.", true);
    state = loadState();
    const med = state.prescriptionMedications.find(entry => entry.id === button.dataset.takeMed);
    if (!med || !medicationSchedule(todayInput()).some(entry => entry.med.id === med.id && entry.timing === button.dataset.takeTiming)) {
      renderSchedule();
      return showToast("This dose is no longer due in the current schedule.", true);
    }
    if (!Number.isFinite(Number(med.quantity)) || Number(med.quantity) <= 0 || typeof med.unit !== "string" || !med.unit.trim()) {
      return showToast("The prescribed dose or unit is invalid. Correct the prescription before marking it taken.", true);
    }
    const log = { id: createId("MEDLOG"), patientId: patientKey(), practitionerId: med.practitionerId, prescriptionId: med.prescriptionId, medicationId: med.id, drugName: med.drugName, quantity: Number(med.quantity), unit: med.unit, timing: button.dataset.takeTiming, scheduledDate: todayInput(), takenAt };
    state.medicationLogs.push(log);
    if (!saveState()) {
      state.medicationLogs.pop();
      return;
    }
    renderSchedule();
    renderMedLog();
    showToast(`${med.drugName} marked as taken.`);
  }

  function initDashboard() {
    renderAppHeader("dashboard");
    let displayedState = window.localStorage.getItem(STORE_KEY);
    const refreshSavedDashboard = () => {
      const saved = window.localStorage.getItem(STORE_KEY);
      if (saved === displayedState) return;
      state = loadState();
      displayedState = saved;
      renderSchedule();
      renderMedLog();
    };
    const dateInput = document.querySelector("[data-log-date]");
    dateInput.addEventListener("change", () => { renderSchedule(); renderMedLog(); });
    document.addEventListener("click", event => {
      const take = event.target.closest("[data-take-med]");
      if (take) markTaken(take);
      const view = event.target.closest("[data-log-view]");
      if (view) viewLog(view.dataset.logView);
      const edit = event.target.closest("[data-log-edit]");
      if (edit) editLog(edit.dataset.logEdit);
      const del = event.target.closest("[data-log-delete]");
      if (del) deleteLog(del.dataset.logDelete);
    });
    renderSchedule();
    renderMedLog();
    window.addEventListener("storage", event => {
      if (event.key === STORE_KEY || event.key === null) refreshSavedDashboard();
    });
    window.addEventListener("pageshow", refreshSavedDashboard);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshSavedDashboard();
    });
  }

  const VITAL_PATTERNS = { systolic: /systolic/i, diastolic: /diastolic/i, heart: /heart rate|pulse/i, sugar: /blood sugar|glucose/i, weight: /weight/i };

  function vitalInfo(vitalId) {
    return state.vitals.find(item => item.id === vitalId);
  }

  function vitalShortName(vital) {
    if (VITAL_PATTERNS.heart.test(vital.name)) return "HR";
    const abbreviation = vital.name.match(/\(([^)]+)\)\s*$/);
    return abbreviation && !/\d/.test(abbreviation[1]) && abbreviation[1].length <= 8 ? abbreviation[1] : vital.name;
  }

  function vitalChips(reading) {
    const values = reading.readings.map(entry => ({ ...entry, vital: vitalInfo(entry.vitalId) })).filter(entry => entry.vital);
    const sys = values.find(entry => VITAL_PATTERNS.systolic.test(entry.vital.name));
    const dia = values.find(entry => VITAL_PATTERNS.diastolic.test(entry.vital.name));
    const chips = [];
    if (sys && dia) chips.push(`BP: ${sys.value}/${dia.value} mmHg`);
    values.filter(entry => !(sys && dia && (entry === sys || entry === dia))).forEach(entry => chips.push(`${vitalShortName(entry.vital)}: ${entry.value}${entry.vital.unit ? ` ${entry.vital.unit}` : ""}`));
    return chips;
  }

  function vitalBadges(reading) {
    const parts = reading.readings.map(entry => {
      const vital = vitalInfo(entry.vitalId);
      const badge = bandBadge(entry.vitalId, entry.value);
      return vital && badge ? `<span class="band-line">${htmlEscape(vitalShortName(vital))} ${badge}</span>` : "";
    }).filter(Boolean);
    return parts.length ? `<div class="band-row">${parts.join("")}</div>` : "";
  }

  function latestVital(test) {
    const sorted = state.vitalReadings.filter(item => item.patientId === patientKey()).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    for (const reading of sorted) {
      const found = reading.readings.find(entry => vitalInfo(entry.vitalId) && test(vitalInfo(entry.vitalId).name));
      if (found) return { found, reading };
    }
    return null;
  }

  function renderVitals() {
    const list = document.querySelector("[data-vital-list]");
    if (!list) return;
    const mine = state.vitalReadings.filter(item => item.patientId === patientKey());
    const bp = mine.slice().sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)).find(reading => {
      const names = reading.readings.map(entry => vitalInfo(entry.vitalId)?.name || "");
      return names.some(name => VITAL_PATTERNS.systolic.test(name)) && names.some(name => VITAL_PATTERNS.diastolic.test(name));
    });
    const bpValue = bp ? `${bp.readings.find(entry => VITAL_PATTERNS.systolic.test(vitalInfo(entry.vitalId)?.name || "")).value}/${bp.readings.find(entry => VITAL_PATTERNS.diastolic.test(vitalInfo(entry.vitalId)?.name || "")).value}` : "--";
    const hr = latestVital(name => VITAL_PATTERNS.heart.test(name));
    const sugar = latestVital(name => VITAL_PATTERNS.sugar.test(name));
    const weight = latestVital(name => VITAL_PATTERNS.weight.test(name));
    document.querySelector("[data-stat-bp]").textContent = bpValue;
    document.querySelector("[data-stat-hr]").textContent = hr ? hr.found.value : "--";
    document.querySelector("[data-stat-sugar]").textContent = sugar ? sugar.found.value : "--";
    document.querySelector("[data-stat-weight]").textContent = weight ? weight.found.value : "--";
    const from = document.querySelector("[data-vital-from]").value;
    const to = document.querySelector("[data-vital-to]").value;
    const rows = mine.filter(item => (!from || item.recordedAt.slice(0, 10) >= from) && (!to || item.recordedAt.slice(0, 10) <= to)).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    list.innerHTML = rows.map(item => `<div class="vital-reading"><div class="vital-head"><div><b>Vitals Reading</b> <small>(${htmlEscape(formatDateTime(item.recordedAt))})</small></div>${canManageRecords() ? `<div class="table-actions"><button class="table-action" type="button" data-vital-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-vital-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-vital-delete="${htmlEscape(item.id)}">Delete</button></div>` : ""}</div><div class="vital-chips">${vitalChips(item).map(chip => { const [label, ...rest] = chip.split(": "); return `<span class="vital-chip"><b>${htmlEscape(label)}:</b> ${htmlEscape(rest.join(": "))}</span>`; }).join("")}</div>${vitalBadges(item)}</div>`).join("");
    document.querySelector("[data-vital-empty]").hidden = rows.length > 0;
  }

  let editingVitalId = null;

  function viewVital(id) {
    const item = state.vitalReadings.find(entry => entry.id === id);
    if (!item) return;
    showDetails("Vitals reading", [
      ["Date and time", formatDateTime(item.recordedAt)],
      ["Patient ID", item.patientId],
      ...item.readings.map(entry => {
        const vital = vitalInfo(entry.vitalId);
        return [vital ? vital.name : "Unknown vital", `${entry.value}${vital?.unit ? ` ${vital.unit}` : ""}${bandFor(entry.vitalId, entry.value) ? ` — ${bandFor(entry.vitalId, entry.value).name}` : ""}`];
      }),
      ["Reading ID", item.id]
    ]);
  }

  function editVital(id) {
    const item = state.vitalReadings.find(entry => entry.id === id);
    if (!item || !requirePatientProfile()) return;
    openVitalDialog(item);
  }

  function deleteVital(id) {
    if (!requirePatientProfile()) return;
    if (!window.confirm("Delete this vitals reading?")) return;
    const index = state.vitalReadings.findIndex(entry => entry.id === id);
    if (index < 0) return;
    const [removed] = state.vitalReadings.splice(index, 1);
    if (!saveState()) {
      state.vitalReadings.splice(index, 0, removed);
      return;
    }
    renderVitals();
    showToast("Vitals reading deleted.");
  }

  function vitalOptions(selected) {
    const vitals = state.vitals.filter(item => item.status !== "Deleted").sort((a, b) => a.name.localeCompare(b.name));
    return `<option value="">Select vital...</option>${vitals.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)}${item.unit ? ` (${htmlEscape(item.unit)})` : ""}</option>`).join("")}`;
  }

  function addVitalRow(vitalId = "", value = "") {
    const row = document.createElement("div");
    row.className = "rx-row vital-row";
    row.dataset.vitalRow = "";
    row.innerHTML = `<label class="form-field">Vital<select name="vitalId" aria-label="Vital">${vitalOptions(vitalId)}</select></label>    <label class="form-field">Value<input type="number" name="vitalValue" step="any" min="0" placeholder="Value" value="${htmlEscape(value)}"><span data-band></span></label><button type="button" class="button button-secondary button-compact" data-vital-remove>Remove</button>`;
    document.querySelector("[data-vital-rows]").append(row);
        updateBadge(row);
      }

      // Refreshes the limit-band badge of a vital or lab parameter row.
      function updateBadge(row) {
        const slot = row.querySelector("[data-band]");
        if (!slot) return;
        const id = row.dataset.labParam || row.querySelector('[name="vitalId"]')?.value || "";
        slot.innerHTML = bandBadge(id, row.querySelector("input").value);
      }

  function openVitalDialog(existing) {
    if (!requirePatientProfile()) return;
    const dialog = document.querySelector("[data-vital-dialog]");
    const form = dialog.querySelector("form");
    form.reset();
    editingVitalId = existing?.id || null;
    dialog.querySelector("[data-vital-heading]").textContent = existing ? "Edit Vitals" : "Log Vitals";
    form.elements.recordedAt.value = existing ? existing.recordedAt : nowLocalInput();
    form.elements.recordedAt.max = nowLocalInput();
    document.querySelector("[data-vital-rows]").innerHTML = "";
    document.querySelector("[data-vital-error]").hidden = true;
    if (existing) existing.readings.forEach(entry => addVitalRow(entry.vitalId, entry.value));
    else [VITAL_PATTERNS.systolic, VITAL_PATTERNS.diastolic, VITAL_PATTERNS.heart, VITAL_PATTERNS.weight, /fasting/i, /post-prandial|post.?meal/i].forEach(pattern => addVitalRow(state.vitals.find(item => item.status !== "Deleted" && pattern.test(item.name))?.id || ""));
    dialog.showModal();
  }

  function saveVitals(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-vital-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const recordedAt = form.elements.recordedAt.value;
    if (!recordedAt) return fail("Date and time are required.");
    if (recordedAt > nowLocalInput()) return fail("Date and time cannot be in the future.");
    const readings = [];
    for (const row of form.querySelectorAll("[data-vital-row]")) {
      const vitalId = row.querySelector('[name="vitalId"]').value;
      const raw = row.querySelector('[name="vitalValue"]').value;
      if (raw === "") continue;
      if (!vitalId || !(Number(raw) > 0)) return fail("Each reading needs a vital and a value above zero.");
      readings.push({ vitalId, value: Number(raw) });
    }
    if (!readings.length) return fail("Enter at least one reading (blood pressure, pulse, weight or blood sugar) for this date and time.");
    if (new Set(readings.map(entry => entry.vitalId)).size !== readings.length) return fail("The same vital is entered more than once.");
    const wasEditing = Boolean(editingVitalId);
    const record = { id: editingVitalId || createId("VREAD"), patientId: patientKey(), recordedAt, readings };
    const index = wasEditing ? state.vitalReadings.findIndex(entry => entry.id === editingVitalId) : -1;
    const previous = index >= 0 ? state.vitalReadings[index] : null;
    if (index >= 0) state.vitalReadings[index] = record;
    else state.vitalReadings.push(record);
    if (!saveState()) {
      if (previous) state.vitalReadings[index] = previous;
      else state.vitalReadings.pop();
      return;
    }
    document.querySelector("[data-vital-dialog]").close();
    renderVitals();
    showToast(wasEditing ? "Vitals updated." : "Vitals logged.");
  }

  function initVitals() {
    renderAppHeader("vitals");
    const canEdit = canManageRecords();
    document.querySelector("[data-log-vitals]").hidden = !canEdit;
    const to = document.querySelector("[data-vital-to]");
    const from = document.querySelector("[data-vital-from]");
    [from, to].forEach(input => input.addEventListener("change", renderVitals));
    document.querySelector("[data-log-vitals]").addEventListener("click", () => openVitalDialog());
    document.querySelector("[data-vital-form]").addEventListener("submit", saveVitals);
    document.querySelector("[data-vital-rows]").addEventListener("input", event => { const row = event.target.closest("[data-vital-row]"); if (row) updateBadge(row); });
    document.querySelector("[data-vital-rows]").addEventListener("change", event => { const row = event.target.closest("[data-vital-row]"); if (row) updateBadge(row); });
    document.addEventListener("click", event => {
      const view = event.target.closest("[data-vital-view]");
      if (view) viewVital(view.dataset.vitalView);
      const edit = event.target.closest("[data-vital-edit]");
      if (edit) editVital(edit.dataset.vitalEdit);
      const del = event.target.closest("[data-vital-delete]");
      if (del) deleteVital(del.dataset.vitalDelete);
      if (event.target.closest("[data-vital-add]")) addVitalRow();
      else if (event.target.closest("[data-vital-remove]")) event.target.closest("[data-vital-row]").remove();
      else if (event.target.closest("[data-vital-cancel]")) document.querySelector("[data-vital-dialog]").close();
    });
    renderVitals();
    ensureVitals().then(changed => { if (changed) renderVitals(); });
  }

  // ---- Lab tests: health parameter readings logged against a facility and a test category ----
  const labRef = id => state.labResults.find(item => item.id === id);
  const labFacilityName = id => state.facilities.find(item => item.id === id)?.name || "Unknown facility";
  const labTestName = id => state.tests.find(item => item.id === id)?.name || "Unknown test";
  const labRequesterName = item => item.requestedBy === "SELF" || !item.requestedBy ? "Self" : state.practitioners.find(entry => entry.id === item.requestedBy)?.name || "Unknown practitioner";

  // Prescriptions of this patient from the practitioner that request the given test.
  function labRequests(practitionerId, testId) {
    return state.prescriptions.filter(rx => rx.patientId === patientKey() && isClinicalRx(rx) && rx.practitionerId === practitionerId && state.prescriptionDiagnoses.some(dx => dx.prescriptionId === rx.id && dx.testId === testId)).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  }

  function refreshLabRequests(selectedRx = "") {
    const form = document.querySelector("[data-lab-form]");
    const practitionerId = form.elements.requestedBy.value;
    const testId = editingLabId ? labRef(editingLabId).testId : form.elements.testId.value;
    const field = document.querySelector("[data-lab-rx-field]");
    const select = document.querySelector("[data-lab-rx]");
    field.hidden = practitionerId === "SELF" || !practitionerId;
    if (field.hidden) { select.innerHTML = ""; return; }
    const requests = testId ? labRequests(practitionerId, testId) : [];
    select.innerHTML = `<option value="">${!testId ? "Select the test first" : requests.length ? "Select requested diagnosis..." : "No prescription requests this test"}</option>${requests.map(rx => `<option value="${htmlEscape(rx.id)}">${htmlEscape(labTestName(testId))} · Rx ${htmlEscape(formatDateTime(rx.issuedAt))}</option>`).join("")}`;
    select.value = selectedRx;
  }

  function renderLabs() {
    const list = document.querySelector("[data-lab-list]");
    if (!list) return;
    const from = document.querySelector("[data-lab-from]").value;
    const to = document.querySelector("[data-lab-to]").value;
    const rows = state.labResults.filter(item => item.patientId === patientKey() && (!from || item.recordedAt.slice(0, 10) >= from) && (!to || item.recordedAt.slice(0, 10) <= to)).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));
    list.innerHTML = rows.map(item => `<div class="vital-reading"><div class="vital-head"><div><b>${htmlEscape(labTestName(item.testId))}</b> <small>· Requested by ${htmlEscape(labRequesterName(item))} · ${htmlEscape(labFacilityName(item.facilityId))} · ${htmlEscape(formatDateTime(item.recordedAt))}</small></div>${canManageRecords() ? `<div class="table-actions"><button class="table-action" type="button" data-lab-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-lab-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-lab-delete="${htmlEscape(item.id)}">Delete</button></div>` : `<div class="table-actions"><button class="table-action" type="button" data-lab-view="${htmlEscape(item.id)}">View</button></div>`}</div></div>`).join("");
    document.querySelector("[data-lab-empty]").hidden = rows.length > 0;
  }

  function viewLab(id) {
    const item = labRef(id);
    if (!item) return;
    const rx = state.prescriptions.find(entry => entry.id === item.prescriptionId);
    showDetails("Lab test", [
      ["Test name", labTestName(item.testId)],
      ["Requested by", labRequesterName(item)],
      ["Prescription", rx ? formatDateTime(rx.issuedAt) : "—"],
      ["Facility", labFacilityName(item.facilityId)],
      ["Recorded at", formatDateTime(item.recordedAt)],
      ["Patient ID", item.patientId],
      ...item.values.map(entry => {
        const parameter = state.parameters.find(candidate => candidate.id === entry.parameterId);
        return [parameter?.name || "Unknown parameter", `${entry.value}${parameter?.unit ? ` ${parameter.unit}` : ""}${bandFor(entry.parameterId, entry.value) ? ` — ${bandFor(entry.parameterId, entry.value).name}` : ""}`];
      }),
      ["Record ID", item.id]
    ]);
  }

  function deleteLab(id) {
    if (!requirePatientProfile()) return;
    if (!window.confirm("Delete this lab test record?")) return;
    const index = state.labResults.findIndex(entry => entry.id === id);
    if (index < 0) return;
    const [removed] = state.labResults.splice(index, 1);
    if (!saveState()) {
      state.labResults.splice(index, 0, removed);
      return;
    }
    renderLabs();
    showToast("Lab test deleted.");
  }

  let editingLabId = null;

  function labParameterRows(testId, values = []) {
    const container = document.querySelector("[data-lab-params]");
    const saved = new Map(values.map(entry => [entry.parameterId, entry.value]));
    const parameters = state.parameters.filter(item => item.testId === testId && (item.status !== "Deleted" || saved.has(item.id)));
    if (!testId) { container.innerHTML = '<p class="muted-note">Select a test to list its parameters.</p>'; return; }
    if (!parameters.length) { container.innerHTML = '<p class="muted-note">This test has no parameters yet. Add them in the Health parameters master.</p>'; return; }
    const gender = activeGender();
    container.innerHTML = `<div class="lab-params-box">${parameters.map(parameter => {
      const range = gender === "Male" ? `Male: ${parameter.maleLimits || "—"}` : gender === "Female" ? `Female: ${parameter.femaleLimits || "—"}` : `Male: ${parameter.maleLimits || "—"} · Female: ${parameter.femaleLimits || "—"}`;
      return `<div class="lab-param" data-lab-param="${htmlEscape(parameter.id)}"><div><b>${htmlEscape(parameter.name)}</b><small>Reference — ${htmlEscape(range)}</small><span data-band></span></div>
<input type="number" step="any" min="0" name="labValue" placeholder="Value" aria-label="${htmlEscape(parameter.name)} value" value="${htmlEscape(saved.get(parameter.id) ?? "")}"><span class="lab-unit">${htmlEscape(parameter.unit || "")}</span></div>`;
    }).join("")}</div>`;
          container.querySelectorAll("[data-lab-param]").forEach(updateBadge);
        }

  function openLabDialog(existing) {
    if (!requirePatientProfile()) return;
    const dialog = document.querySelector("[data-lab-dialog]");
    const form = dialog.querySelector("form");
    form.reset();
    editingLabId = existing?.id || null;
    dialog.querySelector("[data-lab-heading]").textContent = existing ? "Edit Lab Test" : "Log Lab Test";
    const facilities = state.facilities.filter(item => item.status !== "Deleted" || item.id === existing?.facilityId).sort((a, b) => a.name.localeCompare(b.name));
    const tests = state.tests.filter(item => (isClinicalTest(item) && item.status !== "Deleted" && state.parameters.some(parameter => parameter.testId === item.id && parameter.status !== "Deleted")) || item.id === existing?.testId).sort((a, b) => a.name.localeCompare(b.name));
    form.elements.facilityId.innerHTML = `<option value="">Select facility...</option>${facilities.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
    form.elements.testId.innerHTML = `<option value="">Select test...</option>${tests.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
    form.elements.facilityId.value = existing?.facilityId || "";
    form.elements.testId.value = existing?.testId || "";
    form.elements.testId.disabled = Boolean(existing);
    form.elements.recordedAt.value = existing ? existing.recordedAt : nowLocalInput();
    form.elements.recordedAt.max = nowLocalInput();
    const requesters = state.practitioners.filter(item => item.status !== "Deleted" || item.id === existing?.requestedBy).sort((a, b) => a.name.localeCompare(b.name));
    form.elements.requestedBy.innerHTML = `<option value="SELF">Self</option>${requesters.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
    form.elements.requestedBy.value = existing?.requestedBy || "SELF";
    refreshLabRequests(existing?.prescriptionId || "");
    labParameterRows(existing?.testId || "", existing?.values || []);
    const error = document.querySelector("[data-lab-error]");
    error.hidden = !facilities.length;
    error.textContent = facilities.length ? "" : "No facilities yet. Add one in Groups master → Facilities first.";
    dialog.showModal();
  }

  function saveLab(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-lab-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const facilityId = form.elements.facilityId.value;
    const testId = editingLabId ? labRef(editingLabId).testId : form.elements.testId.value;
    const recordedAt = form.elements.recordedAt.value;
    if (!facilityId) return fail("Select the facility.");
    if (!testId) return fail("Select the test name.");
    if (!recordedAt) return fail("Date and time are required.");
    const requestedBy = form.elements.requestedBy.value || "SELF";
    const prescriptionId = requestedBy === "SELF" ? "" : form.elements.prescriptionId.value;
    if (requestedBy !== "SELF" && !prescriptionId) return fail("Select the requested diagnosis from the practitioner's prescription, or choose Self.");
    if (recordedAt > nowLocalInput()) return fail("Date and time cannot be in the future.");
    const values = [];
    for (const row of form.querySelectorAll("[data-lab-param]")) {
      const raw = row.querySelector("input").value;
      if (raw === "") continue;
      if (!(Number(raw) >= 0)) return fail("Values must be numbers of zero or more.");
      values.push({ parameterId: row.dataset.labParam, value: Number(raw) });
    }
    if (!values.length) return fail("Enter at least one parameter value.");
    const wasEditing = Boolean(editingLabId);
    const record = { id: editingLabId || createId("LAB"), patientId: patientKey(), facilityId, testId, recordedAt, requestedBy, prescriptionId, values };
    const index = wasEditing ? state.labResults.findIndex(entry => entry.id === editingLabId) : -1;
    const previous = index >= 0 ? state.labResults[index] : null;
    if (index >= 0) state.labResults[index] = record;
    else state.labResults.push(record);
    if (!saveState()) {
      if (previous) state.labResults[index] = previous;
      else state.labResults.pop();
      return;
    }
    document.querySelector("[data-lab-dialog]").close();
    renderLabs();
    showToast(wasEditing ? "Lab test updated." : "Lab test logged.");
  }

  function initLabTests() {
    renderAppHeader("labtests");
    document.querySelector("[data-log-lab]").hidden = !canManageRecords();
    const to = document.querySelector("[data-lab-to]");
    const from = document.querySelector("[data-lab-from]");
    [from, to].forEach(input => input.addEventListener("change", renderLabs));
    document.querySelector("[data-log-lab]").addEventListener("click", () => openLabDialog());
    document.querySelector("[data-lab-form]").addEventListener("submit", saveLab);
    document.querySelector("[data-lab-test]").addEventListener("change", event => { labParameterRows(event.target.value); refreshLabRequests(); });
    document.querySelector("[data-lab-requester]").addEventListener("change", () => refreshLabRequests());
    document.querySelector("[data-lab-params]").addEventListener("input", event => { const row = event.target.closest("[data-lab-param]"); if (row) updateBadge(row); });
    document.addEventListener("click", event => {
      const view = event.target.closest("[data-lab-view]");
      if (view) viewLab(view.dataset.labView);
      const edit = event.target.closest("[data-lab-edit]");
      if (edit && requirePatientProfile()) openLabDialog(labRef(edit.dataset.labEdit));
      const del = event.target.closest("[data-lab-delete]");
      if (del) deleteLab(del.dataset.labDelete);
      if (event.target.closest("[data-lab-cancel]")) document.querySelector("[data-lab-dialog]").close();
    });
    renderLabs();
    ensureCatalog().then(changed => { if (changed) renderLabs(); });
  }

  function updateClock() {
    const clock = document.querySelector("[data-clock]");
    if (clock) clock.textContent = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  }

  // ---- Analytics: dependency-free SVG line charts ----
  const CHART_COLORS = ["#e91e8c", "#4f5bd5", "#6ec6f0", "#f5b800", "#f97316", "#16a34a", "#9333ea", "#0d9488"];

  function niceScale(min, max, count = 6) {
    if (min === max) { min -= 1; max += 1; }
    const raw = (max - min) / count;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map(m => m * magnitude).find(s => s >= raw) || raw;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = lo; v <= hi + step / 1000; v += step) ticks.push(Number(v.toFixed(6)));
    return { lo, hi, ticks };
  }

  function chartDate(ms, withTime) {
    const options = withTime ? { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" } : { month: "short", day: "numeric", year: "numeric" };
    return new Intl.DateTimeFormat(undefined, options).format(new Date(ms));
  }

  // series: [{name, color, axis: "left"|"right", dashed, area, points: [{t, v}]}]; refLines: [{label, value, color}]
  function renderLineChart(container, { series, refLines = [], leftLabel = "", rightLabel = "", recordedDatesOnly = false, fixedLeftAxis = false }) {
    const all = series.flatMap(item => item.points);
    if (!all.length) {
      container.innerHTML = '<div class="empty-state"><span>♡</span><b>Nothing to chart yet</b><p>Record a few entries to see the trend.</p></div>';
      return;
    }
    const H = 365, left = 90, right = series.some(item => item.axis === "right") ? 62 : 24, top = 42, bottom = 88;
    const dateSource = all.map(p => p.t);
    const first = new Date(Math.min(...dateSource));
    const last = new Date(Math.max(...dateSource));
    first.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    const dayStart = time => { const date = new Date(time); date.setHours(0, 0, 0, 0); return date.getTime(); };
    const xTicks = [];
    if (recordedDatesOnly) {
      xTicks.push(...new Set(all.map(point => dayStart(point.t))));
      xTicks.sort((a, b) => a - b);
    } else {
      for (const date = new Date(first); date <= last; date.setDate(date.getDate() + 1)) xTicks.push(date.getTime());
    }
    const end = new Date(last);
    end.setDate(end.getDate() + 1);
    const t0 = first.getTime(), t1 = end.getTime();
    const W = Math.max(900, left + right + xTicks.length * (recordedDatesOnly ? 110 : 75));
    const dayIndexes = new Map(xTicks.map((time, index) => [time, index]));
    const slot = (W - left - right) / xTicks.length;
    const x = t => {
      if (!recordedDatesOnly) return left + ((t - t0) / (t1 - t0)) * (W - left - right);
      const start = dayStart(t);
      const next = new Date(start);
      next.setDate(next.getDate() + 1);
      const fraction = (t - start) / (next.getTime() - start);
      return left + (dayIndexes.get(start) + 0.2 + fraction * 0.6) * slot;
    };
    const tickX = t => recordedDatesOnly ? left + (dayIndexes.get(t) + 0.5) * slot : x(t);
    const scaleFor = axis => {
      const values = series.filter(item => item.axis === axis).flatMap(item => item.points.map(p => p.v));
      if (axis === "left") values.push(...refLines.map(line => line.value));
      return values.length ? niceScale(Math.min(...values), Math.max(...values)) : null;
    };
    const scales = { left: scaleFor("left"), right: scaleFor("right") };
    const y = (axis, v) => { const s = scales[axis]; return H - bottom - ((v - s.lo) / (s.hi - s.lo)) * (H - top - bottom); };
    const parts = [], leftAxisParts = [];
    const primary = scales.left || scales.right;
    const primaryAxis = scales.left ? "left" : "right";
    primary.ticks.forEach(v => {
      parts.push(`<line x1="${left}" x2="${W - right}" y1="${y(primaryAxis, v)}" y2="${y(primaryAxis, v)}" class="chart-grid"/>`);
      if (scales.left) (fixedLeftAxis ? leftAxisParts : parts).push(`<text x="${left - 8}" y="${y("left", v) + 4}" text-anchor="end" class="chart-tick">${v}</text>`);
    });
    if (scales.right) scales.right.ticks.forEach(v => parts.push(`<text x="${W - right + 8}" y="${y("right", v) + 4}" class="chart-tick">${v}</text>`));
    xTicks.forEach(t => {
      const position = tickX(t);
      parts.push(`<line x1="${position}" x2="${position}" y1="${H - bottom}" y2="${H - bottom + 4}" class="chart-axis"/><text transform="translate(${position} ${H - bottom + 14}) rotate(-40)" text-anchor="end" class="chart-tick">${htmlEscape(chartDate(t, false))}</text>`);
    });
    parts.push(`<line x1="${left}" x2="${W - right}" y1="${H - bottom}" y2="${H - bottom}" class="chart-axis"/>`);
    refLines.forEach(line => parts.push(`<line x1="${left}" x2="${W - right}" y1="${y("left", line.value)}" y2="${y("left", line.value)}" stroke="${line.color}" stroke-width="1.5" stroke-dasharray="5 4"><title>${htmlEscape(line.label)}: ${line.value}</title></line>`));
    series.forEach(item => {
      const pts = item.points.slice().sort((a, b) => a.t - b.t);
      const coords = pts.map(p => `${x(p.t).toFixed(1)},${y(item.axis, p.v).toFixed(1)}`);
      if (item.area && pts.length > 1) parts.push(`<polygon points="${x(pts[0].t).toFixed(1)},${H - bottom} ${coords.join(" ")} ${x(pts[pts.length - 1].t).toFixed(1)},${H - bottom}" fill="${item.color}" opacity=".15"/>`);
      if (pts.length > 1) parts.push(`<polyline points="${coords.join(" ")}" fill="none" stroke="${item.color}" stroke-width="2.5" stroke-linejoin="round"${item.dashed ? ' stroke-dasharray="3 5" stroke-linecap="round"' : ""}/>`);
      pts.forEach(p => parts.push(`<circle cx="${x(p.t).toFixed(1)}" cy="${y(item.axis, p.v).toFixed(1)}" r="4" fill="${item.color}" stroke="#fff" stroke-width="1.5"><title>${htmlEscape(item.name)}: ${p.v} (${htmlEscape(chartDate(p.t, true))})</title></circle>`));
    });
    if (leftLabel) (fixedLeftAxis ? leftAxisParts : parts).push(`<text transform="translate(14 ${(top + H - bottom) / 2}) rotate(-90)" text-anchor="middle" class="chart-axis-label">${htmlEscape(leftLabel)}</text>`);
    if (rightLabel) parts.push(`<text transform="translate(${W - 12} ${(top + H - bottom) / 2}) rotate(90)" text-anchor="middle" class="chart-axis-label">${htmlEscape(rightLabel)}</text>`);
    const legend = [...series.map(item => ({ name: item.name, color: item.color, dashed: item.dashed })), ...refLines.map(line => ({ name: line.label, color: line.color, dashed: true }))]
      .map(item => `<span class="chart-key"><i style="background:${item.color}${item.dashed ? ";opacity:.75" : ""}"></i>${htmlEscape(item.name)}</span>`).join("");
    const axisDescription = `Vertical scale${leftLabel ? ` in ${leftLabel}` : ""}: ${scales.left ? scales.left.ticks.join(", ") : ""}`;
    const fixedAxis = fixedLeftAxis ? `<svg class="chart-fixed-axis" viewBox="0 0 ${left} ${H}" role="img" aria-label="${htmlEscape(axisDescription)}">${leftAxisParts.join("")}</svg>` : "";
    const viewLeft = fixedLeftAxis ? left : 0;
    const viewWidth = W - viewLeft;
    const chartWidth = fixedLeftAxis ? `width:${viewWidth}px;min-width:${viewWidth}px` : `min-width:${W}px`;
    container.innerHTML = `<div class="chart-legend">${legend}</div><div class="${fixedLeftAxis ? "chart-with-fixed-axis" : ""}">${fixedAxis}<div class="chart-scroll" tabindex="0" role="region" aria-label="Trend chart, scroll horizontally to see all dates"><svg viewBox="${viewLeft} 0 ${viewWidth} ${H}" class="chart-svg" style="${chartWidth}" role="img" aria-label="Trend chart">${parts.join("")}</svg></div></div>`;
  }

  function parseLimitRange(text) {
    const match = String(text || "").match(/(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/);
    return match ? [Number(match[1]), Number(match[2])] : null;
  }

  function renderVitalsTrend() {
    const mine = state.vitalReadings.filter(item => item.patientId === patientKey());
    const byVital = new Map();
    mine.forEach(record => record.readings.forEach(entry => {
      const value = Number(entry.value);
      if (!Number.isFinite(value)) return;
      if (!byVital.has(entry.vitalId)) byVital.set(entry.vitalId, []);
      byVital.get(entry.vitalId).push({ t: new Date(record.recordedAt).getTime(), v: value });
    }));
    const order = [VITAL_PATTERNS.systolic, VITAL_PATTERNS.diastolic, VITAL_PATTERNS.heart, VITAL_PATTERNS.weight];
    const ids = [...byVital.keys()].filter(id => vitalInfo(id)).sort((a, b) => {
      const rank = id => { const i = order.findIndex(p => p.test(vitalInfo(id).name)); return i < 0 ? order.length : i; };
      return rank(a) - rank(b);
    });
    // Weight (kg) has a very different scale from BP, pulse and sugar, so it gets the right-hand axis.
    const series = ids.map((id, index) => {
      const vital = vitalInfo(id);
      const isWeight = VITAL_PATTERNS.weight.test(vital.name);
      const named = vital.name.replace(/\s*\(.*\)\s*$/, "");
      return { name: `${named}${vital.unit ? ` (${vital.unit})` : ""}`, color: CHART_COLORS[index % CHART_COLORS.length], axis: isWeight ? "right" : "left", dashed: isWeight, points: byVital.get(id) };
    });
    const leftUnits = [...new Set(ids.filter(id => !VITAL_PATTERNS.weight.test(vitalInfo(id).name)).map(id => vitalInfo(id).unit).filter(Boolean))];
    renderLineChart(document.querySelector("[data-vitals-chart]"), { series, leftLabel: leftUnits.join(" / "), rightLabel: series.some(item => item.axis === "right") ? "Weight (kg)" : "" });
  }

  function renderLabTrend() {
    const select = document.querySelector("[data-lab-measure]");
    const mine = state.labResults.filter(item => item.patientId === patientKey());
    const id = select.value;
    const parameter = state.parameters.find(item => item.id === id);
    const container = document.querySelector("[data-lab-chart]");
    const latest = document.querySelector("[data-lab-latest]");
    if (!parameter) { latest.textContent = ""; renderLineChart(container, { series: [] }); return; }
    const points = [];
    mine.forEach(record => record.values.filter(entry => entry.parameterId === id).forEach(entry => {
      const value = Number(entry.value);
      const time = new Date(record.recordedAt).getTime();
      if (Number.isFinite(value) && Number.isFinite(time)) points.push({ t: time, v: value });
    }));
    latest.textContent = points.length ? `Latest recorded result: ${chartDate(Math.max(...points.map(point => point.t)), true)}` : "No recorded results for this parameter.";
    const gender = activeGender();
    const range = parseLimitRange(gender === "Female" ? parameter.femaleLimits : parameter.maleLimits);
    const refLines = range ? [{ label: "Reference Range LOW", value: range[0], color: "#e76f51" }, { label: "Reference Range HIGH", value: range[1], color: "#2a9d8f" }] : [];
    renderLineChart(container, { series: [{ name: parameter.unit && !parameter.name.includes(`(${parameter.unit})`) ? `${parameter.name} (${parameter.unit})` : parameter.name, color: "#9b51e0", axis: "left", area: true, points }], refLines, leftLabel: parameter.unit || "", recordedDatesOnly: true });
  }

  function initAnalytics() {
    renderAppHeader("analytics");
    const select = document.querySelector("[data-lab-measure]");
    const search = document.querySelector("[data-lab-search]");
    let selectedLabId = "";
    let labOptions = [];
    const filterLabOptions = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = labOptions.filter(item => item.label.toLocaleLowerCase().includes(query));
      const selected = matches.find(item => item.id === selectedLabId);
      select.innerHTML = matches.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.label)}</option>`).join("") ||
        `<option value="">${labOptions.length ? "No matching lab results" : "No lab results recorded"}</option>`;
      select.disabled = !matches.length;
      if (selected) select.value = selected.id;
      else if (matches.length) selectedLabId = select.value;
      else selectedLabId = "";
      renderLabTrend();
    };
    const render = () => {
      const recorded = new Set(state.labResults.filter(item => item.patientId === patientKey()).flatMap(item => item.values.map(entry => entry.parameterId)));
      labOptions = state.parameters.filter(item => recorded.has(item.id)).map(item => ({ id: item.id, label: `${state.tests.find(test => test.id === item.testId)?.name.replace(/\s*\(.*\)\s*$/, "") || "Unlinked"} — ${item.name}` })).sort((a, b) => a.label.localeCompare(b.label));
      renderVitalsTrend();
      filterLabOptions();
    };
    let displayedState = window.localStorage.getItem(STORE_KEY);
    let displayedUser = window.localStorage.getItem(USER_KEY);
    const refresh = () => {
      const saved = window.localStorage.getItem(STORE_KEY);
      const user = window.localStorage.getItem(USER_KEY);
      if (saved === displayedState && user === displayedUser) return;
      const containers = ["[data-vitals-chart]", "[data-lab-chart]"];
      const positions = containers.map(selector => {
        const chart = document.querySelector(`${selector} .chart-scroll`);
        return chart ? { left: chart.scrollLeft, atEnd: chart.scrollWidth - chart.clientWidth - chart.scrollLeft <= 1 } : null;
      });
      state = loadState();
      displayedState = saved;
      displayedUser = user;
      render();
      containers.forEach((selector, index) => {
        const chart = document.querySelector(`${selector} .chart-scroll`);
        if (chart && positions[index]) chart.scrollLeft = positions[index].atEnd ? chart.scrollWidth : positions[index].left;
      });
    };
    select.addEventListener("change", () => { selectedLabId = select.value; renderLabTrend(); });
    search.addEventListener("input", filterLabOptions);
    render();
    window.addEventListener("storage", event => {
      if (event.key === STORE_KEY || event.key === USER_KEY || event.key === null) refresh();
    });
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
  }

  function initAdvancedAnalytics() {
    renderAppHeader("advanced-analytics");
    const search = document.querySelector("[data-compare-search]");
    const choices = document.querySelector("[data-compare-choices]");
    const charts = document.querySelector("[data-compare-charts]");
    const message = document.querySelector("[data-compare-message]");
    let selected = new Set();
    let options = [];
    let currentUser = window.localStorage.getItem(USER_KEY);
    let currentState = window.localStorage.getItem(STORE_KEY);

    const renderChoices = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = options.filter(option => option.label.toLocaleLowerCase().includes(query));
      choices.innerHTML = matches.map(option =>
        `<label class="compare-choice"><input type="checkbox" value="${htmlEscape(option.id)}"${selected.has(option.id) ? " checked" : ""}><span>${htmlEscape(option.label)}</span></label>`
      ).join("") || `<p class="rx-hint">${options.length ? "No matching parameters." : "No recorded lab parameters are available."}</p>`;
      document.querySelector("[data-compare-count]").textContent = `${selected.size} selected`;
    };

    const renderCharts = () => {
      const chosen = options.filter(option => selected.has(option.id));
      const datasets = chosen.map(option => {
        const points = [];
        state.labResults.filter(record => record.patientId === patientKey()).forEach(record => {
          const time = record.recordedAt ? new Date(record.recordedAt).getTime() : NaN;
          record.values.filter(entry => entry.parameterId === option.id).forEach(entry => {
            if (entry.value == null || (typeof entry.value === "string" && !entry.value.trim())) return;
            const value = Number(entry.value);
            if (Number.isFinite(value) && Number.isFinite(time)) points.push({ t: time, v: value });
          });
        });
        return { ...option, points };
      });
      const hasReadings = datasets.some(item => item.points.length);
      message.textContent = chosen.length ? (hasReadings ? "" : "No valid recorded values are available for the selected parameters.") : "Select lab parameters to compare their recorded trends.";
      charts.innerHTML = datasets.map((item, index) => `<section class="card chart-card compare-chart"><h2>${htmlEscape(item.label)}</h2><p class="rx-hint">${item.points.length ? `${item.points.length} recorded ${item.points.length === 1 ? "reading" : "readings"}` : "No valid recorded readings"}</p><div data-compare-chart="${index}"></div></section>`).join("");
      datasets.forEach((item, index) => {
        const parameter = state.parameters.find(candidate => candidate.id === item.id);
        renderLineChart(charts.querySelector(`[data-compare-chart="${index}"]`), {
          series: [{ name: `${parameter.name}${parameter.unit ? ` (${parameter.unit})` : ""}`, color: CHART_COLORS[index % CHART_COLORS.length], axis: "left", points: item.points }],
          leftLabel: parameter.unit || "", recordedDatesOnly: true, fixedLeftAxis: true
        });
      });
    };

    const render = () => {
      const recorded = new Set(state.labResults.filter(record => record.patientId === patientKey()).flatMap(record => record.values.map(entry => entry.parameterId)));
      options = state.parameters.filter(parameter => recorded.has(parameter.id)).map(parameter => ({
        id: parameter.id, label: `${state.tests.find(test => test.id === parameter.testId)?.name || "Unlinked"} — ${parameter.name}`
      })).sort((a, b) => a.label.localeCompare(b.label));
      selected = new Set([...selected].filter(id => options.some(option => option.id === id)));
      renderChoices();
      renderCharts();
    };
    const refresh = () => {
      const saved = window.localStorage.getItem(STORE_KEY);
      const user = window.localStorage.getItem(USER_KEY);
      if (saved === currentState && user === currentUser) return;
      if (user !== currentUser) selected.clear();
      state = loadState();
      currentState = saved;
      currentUser = user;
      render();
    };
    search.addEventListener("input", renderChoices);
    choices.addEventListener("change", event => {
      if (event.target.type !== "checkbox") return;
      if (event.target.checked) selected.add(event.target.value);
      else selected.delete(event.target.value);
      document.querySelector("[data-compare-count]").textContent = `${selected.size} selected`;
      renderCharts();
    });
    document.querySelector("[data-compare-clear]").addEventListener("click", () => { selected.clear(); renderChoices(); renderCharts(); });
    window.addEventListener("storage", event => { if (event.key === STORE_KEY || event.key === USER_KEY || event.key === null) refresh(); });
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
    render();
  }

  // ---- Abnormal results ----
  // Returns the abnormal finding for one reading, or null when it is normal or cannot be judged.
  function judgeReading(measureId, rawValue) {
    const band = bandFor(measureId, rawValue);
    if (band) {
      if (band.severity === "Normal") return null;
      return { label: band.name, severity: band.severity || "Abnormal", range: boundsText(band.lower, band.upper, "") };
    }
    const parameter = state.parameters.find(item => item.id === measureId);
    if (!parameter) return null;
    const range = parseLimitRange(activeGender() === "Female" ? parameter.femaleLimits : parameter.maleLimits);
    const value = Number(rawValue);
    if (!range || rawValue === "" || !Number.isFinite(value)) return null;
    if (value < range[0]) return { label: "Low", severity: "Abnormal", range: `${range[0]} – ${range[1]}` };
    if (value > range[1]) return { label: "High", severity: "Abnormal", range: `${range[0]} – ${range[1]}` };
    return null;
  }

  function abnormalGroups() {
    const me = patientKey();
    const groupsOut = [];
    state.vitalReadings.filter(item => item.patientId === me).forEach(record => {
      const items = record.readings.map(entry => {
        const vital = vitalInfo(entry.vitalId);
        const found = vital ? judgeReading(entry.vitalId, entry.value) : null;
        return found ? { ...found, name: vitalShortName(vital), value: entry.value, unit: vital.unit || "" } : null;
      }).filter(Boolean);
      if (items.length) groupsOut.push({ kind: "vital", id: record.id, title: "Vitals", at: record.recordedAt, sub: "", items });
    });
    state.labResults.filter(item => item.patientId === me).forEach(record => {
      const items = record.values.map(entry => {
        const parameter = state.parameters.find(item => item.id === entry.parameterId);
        const found = parameter ? judgeReading(entry.parameterId, entry.value) : null;
        return found ? { ...found, name: parameter.name, value: entry.value, unit: parameter.unit || "" } : null;
      }).filter(Boolean);
      if (!items.length) return;
      const facility = state.facilities.find(item => item.id === record.facilityId);
      groupsOut.push({ kind: "lab", id: record.id, title: state.tests.find(test => test.id === record.testId)?.name || "Lab test", at: record.recordedAt, sub: facility?.name || "", items });
    });
    return groupsOut.sort((a, b) => b.at.localeCompare(a.at));
  }

  function abnormalCards(list) {
    return list.map(group => `<div class="abn-card"><div class="abn-card-head"><span><b>${htmlEscape(group.title)}</b> <small>(${htmlEscape(formatDateTime(group.at))}${group.sub ? ` · ${htmlEscape(group.sub)}` : ""})</small></span><button type="button" class="table-action" data-abn-view="${htmlEscape(group.kind)}:${htmlEscape(group.id)}">View record</button></div><div class="abn-pills">${group.items.map(item => `<span class="abn-pill abn-${htmlEscape(item.severity.toLowerCase())}"><b>${htmlEscape(item.name)}:</b> ${htmlEscape(item.value)}${item.unit ? ` ${htmlEscape(item.unit)}` : ""} <em>${htmlEscape(item.label)}</em>${item.range ? ` <small>(range ${htmlEscape(item.range)})</small>` : ""}</span>`).join("")}</div></div>`).join("");
  }

  function renderAbnormal() {
    const from = document.querySelector("[data-abn-from]").value;
    const to = document.querySelector("[data-abn-to]").value;
    const list = abnormalGroups().filter(group => (!from || group.at.slice(0, 10) >= from) && (!to || group.at.slice(0, 10) <= to));
    const view = document.querySelector("[data-abn-tab].is-active").dataset.abnTab;
    document.querySelector("[data-abn-empty]").hidden = list.length > 0;
    document.querySelector("[data-abn-list]").hidden = view !== "list" || !list.length;
    document.querySelector("[data-abn-chart]").hidden = view !== "chart" || !list.length;
    document.querySelector("[data-abn-list]").innerHTML = abnormalCards(list);
    if (view !== "chart" || !list.length) return;
    const counts = new Map();
    list.forEach(group => { const key = group.at.slice(0, 7); counts.set(key, (counts.get(key) || 0) + group.items.length); });
    const months = [...counts.keys()].sort();
    if (!months.includes(abnormalMonth)) abnormalMonth = months[months.length - 1];
    const max = Math.max(...counts.values());
    const scale = niceScale(0, max, Math.min(max, 5) || 1);
    const W = 900, H = 300, left = 46, bottom = 54, top = 16;
    const slot = (W - left - 20) / months.length;
    const barW = Math.min(56, slot * 0.6);
    const y = v => H - bottom - (v / scale.hi) * (H - top - bottom);
    const parts = scale.ticks.map(v => `<line x1="${left}" x2="${W - 20}" y1="${y(v)}" y2="${y(v)}" class="chart-grid"/><text x="${left - 8}" y="${y(v) + 4}" text-anchor="end" class="chart-tick">${v}</text>`);
    months.forEach((key, index) => {
      const cx = left + slot * index + slot / 2;
      const count = counts.get(key);
      const label = new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(new Date(`${key}-01T00:00:00`));
      parts.push(`<g class="abn-bar${key === abnormalMonth ? " is-selected" : ""}" data-abn-month="${key}" tabindex="0" role="button" aria-label="${htmlEscape(label)}: ${count} abnormal"><rect x="${cx - barW / 2}" y="${y(count)}" width="${barW}" height="${H - bottom - y(count)}" rx="4"/><text x="${cx}" y="${y(count) - 6}" text-anchor="middle" class="chart-tick">${count}</text><text x="${cx}" y="${H - bottom + 18}" text-anchor="middle" class="chart-tick">${htmlEscape(label)}</text></g>`);
    });
    parts.push(`<line x1="${left}" x2="${W - 20}" y1="${H - bottom}" y2="${H - bottom}" class="chart-axis"/>`);
    document.querySelector("[data-abn-bars]").innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="chart-svg" role="img" aria-label="Abnormal readings per month">${parts.join("")}</svg>`;
    const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date(`${abnormalMonth}-01T00:00:00`));
    document.querySelector("[data-abn-month-title]").textContent = `${monthLabel} — ${counts.get(abnormalMonth)} abnormal ${counts.get(abnormalMonth) === 1 ? "reading" : "readings"}`;
    document.querySelector("[data-abn-month-list]").innerHTML = abnormalCards(list.filter(group => group.at.startsWith(abnormalMonth)));
  }

  let abnormalMonth = null;

  function initAbnormal() {
    renderAppHeader("abnormal");
    document.querySelector("[data-abn-from]").addEventListener("change", renderAbnormal);
    document.querySelector("[data-abn-to]").addEventListener("change", renderAbnormal);
    document.addEventListener("click", event => {
      const tab = event.target.closest("[data-abn-tab]");
      if (tab) {
        document.querySelectorAll("[data-abn-tab]").forEach(item => item.classList.toggle("is-active", item === tab));
        renderAbnormal();
        return;
      }
      const bar = event.target.closest("[data-abn-month]");
      if (bar) { abnormalMonth = bar.dataset.abnMonth; renderAbnormal(); return; }
      const view = event.target.closest("[data-abn-view]");
      if (view) {
        const text = view.dataset.abnView;
        const split = text.indexOf(":");
        const kind = text.slice(0, split), id = text.slice(split + 1);
        if (kind === "lab") viewLab(id); else viewVital(id);
      }
    });
    document.addEventListener("keydown", event => {
      const bar = event.target.closest?.("[data-abn-month]");
      if (bar && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); abnormalMonth = bar.dataset.abnMonth; renderAbnormal(); }
    });
    renderAbnormal();
  }

  function init() {
    state = loadState();
    if (!migratePrescriptions()) return;
    const page = document.body.dataset.page;
    if (page === "analytics") initAnalytics();
    if (page === "advanced-analytics") initAdvancedAnalytics();
    if (page === "abnormal") initAbnormal();
    if (page === "home") {
      renderSiteHeader();
      updateClock();
      window.setInterval(updateClock, 1000);
      document.querySelectorAll('a[href="#care"]').forEach(link => link.addEventListener("click", () => document.querySelector(".landing-details")?.scrollIntoView()));
      document.querySelectorAll('a[href="#portals"]').forEach(link => link.addEventListener("click", () => document.querySelector(".portal-grid")?.scrollIntoView()));
    }
    if (page === "login") {
      renderSiteHeader();
      const params = new URLSearchParams(window.location.search);
      setAuthMode(params.get("mode") === "signup" ? "signup" : "login");
      if (params.get("role")) {
        const role = [...document.querySelector('[name="role"]').options].find(option => option.text === params.get("role"));
        if (role) role.selected = true;
      }
      syncGenderField();
    }
    if (page === "dashboard") initDashboard();
    if (page === "opening-stock") initOpeningStock();
    if (page === "receipts") initReceipts();
    if (page === "safety-stock") initSafetyStock();
    if (page === "vitals") initVitals();
    if (page === "labtests") initLabTests();
    if (page === "groups") {
      renderAppHeader(page);
      const requestedGroup = new URLSearchParams(window.location.search).get("group");
      if (requestedGroup && groups[requestedGroup]) activeGroup = requestedGroup;
      renderGroups();
    }
    if (page === "symptoms") initSymptoms();
    if (page === "practitioners") initPractitioners();
    if (page === "prescriptions") initPrescriptions();
    if (page === "interventions") initInterventionReports();
    if (page === "inpatient") initInpatient();
    if (page === "tests") {
      renderAppHeader(page);
      renderTests("");
      ensureCatalog().then(changed => { if (changed) renderTests(document.querySelector("[data-test-search]").value); });
    }
    if (page === "groups") {
      ensureCatalog().then(changed => { if (changed) renderGroups(); });
      ensureVitals().then(changed => { if (changed) renderGroups(); });
      ensureSymptoms().then(changed => { if (changed) renderGroups(); });
    }
    document.querySelectorAll("[data-symptoms-file]").forEach(input => input.addEventListener("change", event => {
      importSymptomsFile(event.target.files[0]);
      event.target.value = "";
    }));
    document.querySelectorAll("[data-vitals-file]").forEach(input => input.addEventListener("change", event => {
      importVitalsFile(event.target.files[0]);
      event.target.value = "";
    }));
    document.querySelector('[name="role"]')?.addEventListener("change", syncGenderField);
    document.querySelectorAll("[data-catalog-file]").forEach(input => input.addEventListener("change", event => {
      importCatalogFile(event.target.files[0]);
      event.target.value = "";
    }));
    document.addEventListener("click", handleClick);
    document.querySelector("[data-auth-tab]")?.closest(".auth-tabs")?.addEventListener("click", event => {
      const tab = event.target.closest("[data-auth-tab]");
      if (tab) setAuthMode(tab.dataset.authTab);
    });
    document.querySelector("#auth-form")?.addEventListener("submit", submitAuth);
    document.querySelector("[data-record-form]")?.addEventListener("submit", saveRecord);
    document.querySelector("[data-parameter-form]")?.addEventListener("submit", saveParameter);
    document.querySelector("[data-record-search]")?.addEventListener("input", renderGroups);
    document.querySelector("[data-status-filter]")?.addEventListener("change", renderGroups);
    document.querySelector("[data-category-select]")?.addEventListener("change", renderGroups);
    document.querySelector("[data-test-subgroup-filter]")?.addEventListener("change", renderGroups);
    document.querySelector("[data-test-search]")?.addEventListener("input", event => renderTests(event.target.value));
    document.querySelector('[name="password"]')?.closest(".password-wrap")?.querySelector(".password-toggle")?.addEventListener("click", event => {
      const input = document.querySelector('[name="password"]');
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      event.currentTarget.textContent = show ? "Hide" : "Show";
      event.currentTarget.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
    document.querySelector("[data-record-dialog]")?.addEventListener("close", () => {
      if (dialogMode === "view") document.querySelector("[data-record-submit]").closest("button").hidden = false;
    });
  }

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();
