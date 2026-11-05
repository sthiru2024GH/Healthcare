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
      columns: [["name", "Category (test panel)"], ["description", "Description"], ["parameterCount", "Parameters"], ["status", "Status"]],
      fields: [
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
    medicationLogs: [],
    labResults: [],
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
      for (const key of ["prescriptions", "prescriptionDiagnoses", "prescriptionMedications", "interventionPrescriptions", "interventionItems", "medicationLogs", "vitalReadings", "labResults"]) {
        if (!Array.isArray(parsed[key])) parsed[key] = [];
      }
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
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Groups master <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="groups-master.html">All directories</a><a href="groups-master.html?group=practiceTypes">Practice types</a><a href="groups-master.html?group=specializations">Specializations</a><a href="groups-master.html?group=userProfiles">User profiles</a><a href="groups-master.html?group=facilityTypes">Facility types</a><a href="groups-master.html?group=facilities">Facilities</a><a href="groups-master.html?group=tests">Tests</a><a href="groups-master.html?group=parameters">Health parameters</a><a href="groups-master.html?group=limitBands">Limit bands</a><a href="groups-master.html?group=vitals">Vitals</a><a href="groups-master.html?group=symptoms">Symptoms</a><a href="groups-master.html?group=interventionMethods">Intervention Method</a>${patientGroupLink}</div></div>
        ${patientLinks}
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Events <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="symptoms.html">Symptoms</a><a href="prescriptions.html">Prescriptions</a><a href="dashboard.html">Medications</a><a href="vitals.html">Vitals</a><a href="labtests.html">Lab Tests</a><a href="interventions.html">Interventions</a></div></div>
        <div class="nav-menu"><button class="nav-menu-trigger" type="button">Reports <span class="nav-caret">⌄</span></button><div class="nav-dropdown">        <a href="dashboard.html">Timeline chart</a><a href="dashboard.html">Trends</a><a href="dashboard.html">Stocks</a></div></div>
                <div class="nav-menu"><button class="nav-menu-trigger${page === "analytics" || page === "abnormal" ? " is-current" : ""}" type="button">Analytics <span class="nav-caret">⌄</span></button><div class="nav-dropdown"><a href="analytics.html">Trends</a><a href="abnormal.html">Abnormal results</a></div></div>
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
      categorySelect.innerHTML = `<option value="">All test categories</option>${state.tests.filter(item => item.status !== "Deleted").sort((a, b) => a.name.localeCompare(b.name)).map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join("")}`;
      categorySelect.value = [...categorySelect.options].some(option => option.value === current) ? current : "";
    }
    const categoryFilter = activeGroup === "parameters" ? categorySelect?.value || "" : "";
    const records = state[activeGroup].filter(record => {
      const matchesSearch = `${record.id} ${Object.values(record).join(" ")}`.toLowerCase().includes(search);
      const matchesStatus = statusFilter === "all" || String(record.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus && (!categoryFilter || record.testId === categoryFilter);
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
    const missingTests = state.parameters.filter(item => item.status !== "Deleted" && !state.tests.some(parent => parent.id === item.testId && parent.status !== "Deleted")).length;
    const missingVitals = state.vitals.filter(item => item.status !== "Deleted" && !state.vitalCategories.some(parent => parent.id === item.vitalCategoryId && parent.status !== "Deleted")).length;
    const missingSymptoms = state.symptomTests.filter(item => item.status !== "Deleted" && !state.symptoms.some(parent => parent.id === item.symptomId && parent.status !== "Deleted")).length;
    const missingBands = state.limitBands.filter(item => item.status !== "Deleted" && !measureById(item.parameterId)?.live).length;
    const missingFacilityTypes = state.facilities.filter(item => item.status !== "Deleted" && !state.facilityTypes.some(parent => parent.id === item.facilityTypeId && parent.status !== "Deleted")).length;
    return missingPractices + missingTests + missingVitals + missingSymptoms + missingFacilityTypes + missingBands;
  }

  function makeField(field, value, disabled) {
    const required = field.required && !disabled ? " required" : "";
    const isFull = field.full ? " full-width" : "";
    const val = value ?? "";
    let input;
    if (field.type === "textarea") {
      input = `<textarea name="${field.key}"${required}${disabled ? " disabled" : ""}>${htmlEscape(val)}</textarea>`;
    } else if (field.type === "measure") {
      const group = (label, list) => `<optgroup label="${label}">${list.filter(item => item.status !== "Deleted" || item.id === val).map(item => `<option value="${htmlEscape(item.id)}"${String(val) === item.id ? " selected" : ""}>${htmlEscape(measureById(item.id).name)}</option>`).join("")}</optgroup>`;
      input = `<select name="${field.key}"${required}${disabled ? " disabled" : ""}><option value="">Select…</option>${group("Lab health parameters", state.parameters)}${group("Vitals", state.vitals)}</select>`;
    } else if (field.type === "select" || field.type === "relation") {
      const options = field.type === "relation"
        ? state[field.group].filter(item => item.status !== "Deleted").map(item => [item.id, item.name])
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
    const values = record || (mode === "add" && activeGroup === "parameters" ? { testId: document.querySelector("[data-category-select]")?.value || "" } : undefined);
    fields.innerHTML = definition.fields.map(field => makeField(field, values?.[field.key], readOnly)).join("");
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
      practiceTypes: () => [["specializations", state.specializations.filter(item => item.practiceId === id && live(item))], ["practitioners", state.practitioners.filter(item => item.practiceId === id && live(item))], ["intervention methods", state.interventionMethods.filter(item => item.practiceId === id && live(item))]],
      specializations: () => [["practitioners", state.practitioners.filter(item => item.specializationId === id && live(item))]],
      facilityTypes: () => [["facilities", state.facilities.filter(item => item.facilityTypeId === id && live(item))]],
      facilities: () => [["lab test records", state.labResults.filter(item => item.facilityId === id)]],
      parameters: () => [["limit bands", state.limitBands.filter(item => item.parameterId === id && live(item))], ["lab test records", state.labResults.filter(item => item.values.some(entry => entry.parameterId === id))]],
      practitioners: () => [["prescriptions", state.prescriptions.filter(item => item.practitionerId === id)], ["intervention prescriptions", state.interventionPrescriptions.filter(item => item.practitionerId === id)], ["lab test records", state.labResults.filter(item => item.requestedBy === id)]],
      tests: () => [["parameters", state.parameters.filter(item => item.testId === id && live(item))], ["prescription diagnoses", state.prescriptionDiagnoses.filter(item => item.testId === id)], ["lab test records", state.labResults.filter(item => item.testId === id)]],
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
      let test = state.tests.find(item => item.name.toLowerCase() === category.toLowerCase() && item.status !== "Deleted");
      if (!test) {
        test = { id: createId("TEST"), name: category, description: "", status: "Active" };
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

  // First run (or old sample data): replace the sample panels with the master CSV.
  async function ensureCatalog() {
    if (state.catalogVersion === CATALOG_VERSION) return false;
    const backup = { tests: state.tests, parameters: state.parameters };
    try {
      const response = await fetch(CATALOG_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.tests = [];
      state.parameters = [];
      importCatalog(await response.text());
      if (!saveState()) throw new Error("save failed");
      return true;
    } catch (error) {
      console.error("Unable to load the master health parameters CSV.", error);
      state.tests = backup.tests;
      state.parameters = backup.parameters;
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
    const tests = state.tests.filter(test => test.status !== "Deleted" && test.name.toLowerCase().includes(search));
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
    const tests = state.tests.filter(item => item.status !== "Deleted").sort((a, b) => a.name.localeCompare(b.name));
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
    document.querySelector("[data-rx-heading]").textContent = "Add Prescription";
    document.querySelector("[data-rx-submit]").textContent = "Save prescription";
    document.querySelector("[data-rx-cancel]").hidden = true;
    document.querySelector("[data-rx-error]").hidden = true;
  }

  function fillRxPractitioners(selected) {
    const select = document.querySelector("[data-rx-form]").elements.practitionerId;
    const list = state.practitioners.filter(item => item.status !== "Deleted" || item.id === selected);
    select.innerHTML = `<option value="">Select practitioner...</option>${list.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)} · ${htmlEscape(relationLabel("specializationId", item.specializationId))}</option>`).join("")}`;
    document.querySelector("[data-rx-practitioner-hint]").hidden = list.length > 0;
  }

  function rxPractitionerName(id) {
    return state.practitioners.find(item => item.id === id)?.name || "Unknown";
  }

  function rxDescribeMed(med) {
    return `${med.drugName} · ${med.quantity} ${med.unit} · ${med.timings.join("/")} · ${med.mealQualifier}`;
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
      const date = new Date(item.issuedAt);
      const list = values => values.length ? `<ul class="rx-list">${values.map(value => `<li>${htmlEscape(value)}</li>`).join("")}</ul>` : "—";
      return `<tr><td>${htmlEscape(isNaN(date) ? item.issuedAt : formatter.format(date))}</td><td>${htmlEscape(rxPractitionerName(item.practitionerId))}</td><td class="wrap-cell">${list(dx)}</td><td class="wrap-cell">${list(meds.map(rxDescribeMed))}</td><td class="wrap-cell">${htmlEscape(item.notes)}</td>${canEdit ? `<td><div class="table-actions"><button class="table-action" type="button" data-rx-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-rx-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-rx-delete="${htmlEscape(item.id)}">Delete</button></div></td>` : ""}</tr>`;
    }).join("");
    document.querySelector("[data-rx-empty]").hidden = list.length > 0;
    document.querySelector("[data-rx-count]").textContent = `${list.length} ${list.length === 1 ? "prescription" : "prescriptions"}`;
    document.querySelector("[data-rx-actions-head]").hidden = !canEdit;
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
    const dxIds = [...form.querySelectorAll("[data-rx-diagnosis] select")].map(select => select.value);
    if (dxIds.some(value => !value)) return fail("Select a test for every diagnosis row, or remove the empty row.");
    if (new Set(dxIds).size !== dxIds.length) return fail("The same diagnosis is selected more than once.");
    if (editingRxId) {
      const usedLab = state.labResults.find(lab => lab.prescriptionId === editingRxId && !dxIds.includes(lab.testId));
      if (usedLab) return fail(`${relationLabel("testId", usedLab.testId)} already has lab results recorded against this prescription. Delete those lab results before removing this diagnosis.`);
      const moved = state.labResults.find(lab => lab.prescriptionId === editingRxId && lab.requestedBy !== practitionerId);
      if (moved) return fail("Lab results are recorded against this prescription, so its practitioner cannot be changed. Delete those lab results first.");
    }
    const meds = [];
    for (const row of form.querySelectorAll("[data-rx-medication]")) {
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
    const snapshot = { p: [...state.prescriptions], d: [...state.prescriptionDiagnoses], m: [...state.prescriptionMedications], l: state.medicationLogs.map(log => log.practitionerId) };
    const id = editingRxId || createId("RX");
    const wasEditing = Boolean(editingRxId);
    if (wasEditing) {
      state.prescriptions = state.prescriptions.filter(item => item.id !== id);
      state.prescriptionDiagnoses = state.prescriptionDiagnoses.filter(item => item.prescriptionId !== id);
      state.prescriptionMedications = state.prescriptionMedications.filter(item => item.prescriptionId !== id);
      state.medicationLogs.filter(log => log.prescriptionId === id).forEach(log => { log.practitionerId = practitionerId; });
    }
    const keys = { prescriptionId: id, patientId: patientKey(), practitionerId };
    state.prescriptions.push({ id, patientId: patientKey(), practitionerId, issuedAt, notes });
    dxIds.forEach(testId => state.prescriptionDiagnoses.push({ id: createId("RXDX"), ...keys, testId }));
    meds.forEach(med => state.prescriptionMedications.push({ ...keys, ...med, id: med.id || createId("RXMED") }));
    if (!saveState()) {
      state.prescriptions = snapshot.p;
      state.prescriptionDiagnoses = snapshot.d;
      state.prescriptionMedications = snapshot.m;
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
    form.elements.issuedAt.value = item.issuedAt;
    form.elements.notes.value = item.notes;
    state.prescriptionDiagnoses.filter(child => child.prescriptionId === id).forEach(child => addDiagnosisRow(child.testId));
    state.prescriptionMedications.filter(child => child.prescriptionId === id).forEach(addMedicationRow);
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
    const date = new Date(item.issuedAt);
    const master = [
      ["Prescription ID", item.id],
      ["Patient ID", item.patientId],
      ["Practitioner", `${rxPractitionerName(item.practitionerId)} (${item.practitionerId})`],
      ["Date and time", isNaN(date) ? item.issuedAt : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)],
      ["Notes", item.notes]
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
      <div class="symptom-actions"><button type="button" class="button button-primary" data-close-details>Close</button></div></div>`;
    dialog.classList.add("rx-dialog");
    dialog.addEventListener("close", () => dialog.classList.remove("rx-dialog"), { once: true });
    dialog.querySelector("[data-close-details]").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }

  function deleteRx(id) {
    if (!requirePatientProfile()) return;
    const loggedDoses = state.medicationLogs.filter(log => log.prescriptionId === id).length;
    if (loggedDoses) return showToast(`Cannot delete this prescription: ${loggedDoses} taken-dose ${loggedDoses === 1 ? "log depends" : "logs depend"} on it. Delete those logs first.`, true);
    const labCount = state.labResults.filter(lab => lab.prescriptionId === id).length;
    if (labCount) return showToast(`Cannot delete this prescription: ${labCount} lab test ${labCount === 1 ? "record was" : "records were"} requested through it. Delete those first.`, true);
    if (!window.confirm("Delete this prescription with its diagnoses and medications?")) return;
    const snapshot = { p: state.prescriptions, d: state.prescriptionDiagnoses, m: state.prescriptionMedications };
    state.prescriptions = state.prescriptions.filter(item => item.id !== id);
    state.prescriptionDiagnoses = state.prescriptionDiagnoses.filter(item => item.prescriptionId !== id);
    state.prescriptionMedications = state.prescriptionMedications.filter(item => item.prescriptionId !== id);
    if (!saveState()) {
      state.prescriptions = snapshot.p;
      state.prescriptionDiagnoses = snapshot.d;
      state.prescriptionMedications = snapshot.m;
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
    document.querySelector("[data-rx-actions-head]").hidden = !canEdit;
    const form = document.querySelector("[data-rx-form]");
    const datalist = document.createElement("datalist");
    datalist.id = "rx-unit-list";
    datalist.innerHTML = RX_UNITS.map(unit => `<option value="${unit}">`).join("");
    form.append(datalist);
    form.elements.issuedAt.max = nowLocalInput();
    fillRxPractitioners("");
    resetRxForm();
    form.addEventListener("submit", saveRx);
    document.addEventListener("click", event => {
      if (event.target.closest("[data-rx-add-diagnosis]")) addDiagnosisRow("");
      else if (event.target.closest("[data-rx-add-medication]")) addMedicationRow();
      else if (event.target.closest("[data-rx-remove]")) event.target.closest("[data-rx-diagnosis], [data-rx-medication]").remove();
      else if (event.target.closest("[data-rx-cancel]")) resetRxForm();
      const view = event.target.closest("[data-rx-view]");
      if (view) viewRx(view.dataset.rxView);
      const edit = event.target.closest("[data-rx-edit]");
      if (edit) editRx(edit.dataset.rxEdit);
      const del = event.target.closest("[data-rx-delete]");
      if (del) deleteRx(del.dataset.rxDelete);
    });
    ensureCatalog().then(changed => {
      if (!changed) return;
      form.querySelectorAll("[data-rx-diagnosis] select").forEach(select => { select.innerHTML = rxTestOptions(select.value); });
    });
    renderPrescriptions();
  }

  let editingIvId = null;

  function ivMethodOptions(selected) {
    const methods = state.interventionMethods.filter(item => item.status !== "Deleted" || item.id === selected).sort((a, b) => a.name.localeCompare(b.name));
    return `<option value="">Select intervention...</option>${methods.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)} · ${htmlEscape(relationLabel("practiceId", item.practiceId))}</option>`).join("")}`;
  }

  function ivMethodName(id) {
    return state.interventionMethods.find(item => item.id === id)?.name || "Unknown";
  }

  function addInterventionRow(methodId) {
    const row = document.createElement("div");
    row.className = "rx-row";
    row.dataset.ivItem = "";
    row.innerHTML = `<label class="form-field">Intervention<select name="ivMethodId" aria-label="Intervention">${ivMethodOptions(methodId)}</select></label><button type="button" class="button button-secondary button-compact" data-iv-remove>Remove intervention</button>`;
    document.querySelector("[data-iv-items]").append(row);
  }

  function resetIvForm() {
    const form = document.querySelector("[data-iv-form]");
    editingIvId = null;
    form.reset();
    form.elements.issuedAt.value = nowLocalInput();
    document.querySelector("[data-iv-items]").innerHTML = "";
    document.querySelector("[data-iv-heading]").textContent = "Add Intervention Prescription";
    document.querySelector("[data-iv-submit]").textContent = "Save prescription";
    document.querySelector("[data-iv-cancel]").hidden = true;
    document.querySelector("[data-iv-error]").hidden = true;
  }

  function fillIvPractitioners(selected) {
    const select = document.querySelector("[data-iv-form]").elements.practitionerId;
    const list = state.practitioners.filter(item => item.status !== "Deleted" || item.id === selected);
    select.innerHTML = `<option value="">Select practitioner...</option>${list.map(item => `<option value="${htmlEscape(item.id)}"${item.id === selected ? " selected" : ""}>${htmlEscape(item.name)} · ${htmlEscape(relationLabel("specializationId", item.specializationId))}</option>`).join("")}`;
    document.querySelector("[data-iv-practitioner-hint]").hidden = list.length > 0;
  }

  function renderInterventions() {
    const body = document.querySelector("[data-iv-body]");
    if (!body) return;
    const canEdit = canManageRecords();
    const list = state.interventionPrescriptions.filter(item => item.patientId === patientKey()).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
    const formatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
    body.innerHTML = list.map(item => {
      const names = state.interventionItems.filter(child => child.interventionPrescriptionId === item.id).map(child => ivMethodName(child.methodId));
      const date = new Date(item.issuedAt);
      const items = names.length ? `<ul class="rx-list">${names.map(name => `<li>${htmlEscape(name)}</li>`).join("")}</ul>` : "—";
      return `<tr><td>${htmlEscape(isNaN(date) ? item.issuedAt : formatter.format(date))}</td><td>${htmlEscape(rxPractitionerName(item.practitionerId))}</td><td class="wrap-cell">${items}</td><td class="wrap-cell">${htmlEscape(item.notes)}</td>${canEdit ? `<td><div class="table-actions"><button class="table-action" type="button" data-iv-view="${htmlEscape(item.id)}">View</button><button class="table-action" type="button" data-iv-edit="${htmlEscape(item.id)}">Edit</button><button class="table-action delete" type="button" data-iv-delete="${htmlEscape(item.id)}">Delete</button></div></td>` : ""}</tr>`;
    }).join("");
    document.querySelector("[data-iv-empty]").hidden = list.length > 0;
    document.querySelector("[data-iv-count]").textContent = `${list.length} ${list.length === 1 ? "prescription" : "prescriptions"}`;
    document.querySelector("[data-iv-actions-head]").hidden = !canEdit;
  }

  function saveIv(event) {
    event.preventDefault();
    if (!requirePatientProfile()) return;
    const form = event.currentTarget;
    const error = document.querySelector("[data-iv-error]");
    const fail = message => { error.textContent = message; error.hidden = false; };
    const practitionerId = form.elements.practitionerId.value;
    const issuedAt = form.elements.issuedAt.value;
    const notes = form.elements.notes.value.trim();
    if (!practitionerId || !issuedAt || !notes) return fail("Practitioner, date and time, and notes are required.");
    if (issuedAt > nowLocalInput()) return fail("Date and time cannot be in the future.");
    const methodIds = [...form.querySelectorAll("[data-iv-item] select")].map(select => select.value);
    if (!methodIds.length) return fail("Add at least one intervention.");
    if (methodIds.some(value => !value)) return fail("Select an intervention in every row, or remove the empty row.");
    if (new Set(methodIds).size !== methodIds.length) return fail("The same intervention is selected more than once.");
    error.hidden = true;
    const snapshot = { p: [...state.interventionPrescriptions], i: [...state.interventionItems] };
    const id = editingIvId || createId("IVRX");
    const wasEditing = Boolean(editingIvId);
    if (wasEditing) {
      state.interventionPrescriptions = state.interventionPrescriptions.filter(item => item.id !== id);
      state.interventionItems = state.interventionItems.filter(item => item.interventionPrescriptionId !== id);
    }
    state.interventionPrescriptions.push({ id, patientId: patientKey(), practitionerId, issuedAt, notes });
    methodIds.forEach(methodId => state.interventionItems.push({ id: createId("IVITEM"), interventionPrescriptionId: id, patientId: patientKey(), practitionerId, methodId }));
    if (!saveState()) {
      state.interventionPrescriptions = snapshot.p;
      state.interventionItems = snapshot.i;
      return;
    }
    resetIvForm();
    renderInterventions();
    showToast(wasEditing ? "Intervention prescription updated." : "Intervention prescription saved.");
  }

  function editIv(id) {
    if (!requirePatientProfile()) return;
    const item = state.interventionPrescriptions.find(entry => entry.id === id);
    if (!item) return;
    const form = document.querySelector("[data-iv-form]");
    resetIvForm();
    editingIvId = id;
    fillIvPractitioners(item.practitionerId);
    form.elements.issuedAt.value = item.issuedAt;
    form.elements.notes.value = item.notes;
    state.interventionItems.filter(child => child.interventionPrescriptionId === id).forEach(child => addInterventionRow(child.methodId));
    document.querySelector("[data-iv-heading]").textContent = "Edit Intervention Prescription";
    document.querySelector("[data-iv-submit]").textContent = "Update prescription";
    document.querySelector("[data-iv-cancel]").hidden = false;
    form.scrollIntoView({ block: "start" });
  }

  function viewIv(id) {
    const item = state.interventionPrescriptions.find(entry => entry.id === id);
    if (!item) return;
    const children = state.interventionItems.filter(child => child.interventionPrescriptionId === id);
    const date = new Date(item.issuedAt);
    const master = [
      ["Prescription ID", item.id],
      ["Patient ID", item.patientId],
      ["Practitioner", `${rxPractitionerName(item.practitionerId)} (${item.practitionerId})`],
      ["Date and time", isNaN(date) ? item.issuedAt : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)],
      ["Notes", item.notes]
    ];
    let dialog = document.querySelector("[data-details-dialog]");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.className = "record-dialog";
      dialog.dataset.detailsDialog = "";
      document.body.append(dialog);
    }
    const rows = children.map(child => {
      const method = state.interventionMethods.find(entry => entry.id === child.methodId);
      return `<tr><td>${htmlEscape(method?.name || "Unknown")}</td><td>${htmlEscape(method ? relationLabel("practiceId", method.practiceId) : "—")}</td></tr>`;
    }).join("");
    dialog.innerHTML = `<div class="record-form"><h2>Intervention prescription</h2>
      <section class="rx-view-box"><dl class="details-list">${master.map(([label, value]) => `<div><dt>${htmlEscape(label)}</dt><dd>${htmlEscape(value || "—")}</dd></div>`).join("")}</dl></section>
      <h3 class="rx-view-title">Interventions (${children.length})</h3>
      <div class="rx-view-box"><table class="data-table rx-mini"><thead><tr><th>Intervention</th><th>Practice type</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="symptom-actions"><button type="button" class="button button-primary" data-close-details>Close</button></div></div>`;
    dialog.classList.add("rx-dialog");
    dialog.addEventListener("close", () => dialog.classList.remove("rx-dialog"), { once: true });
    dialog.querySelector("[data-close-details]").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }

  function deleteIv(id) {
    if (!requirePatientProfile()) return;
    if (!window.confirm("Delete this intervention prescription with its interventions?")) return;
    const snapshot = { p: state.interventionPrescriptions, i: state.interventionItems };
    state.interventionPrescriptions = state.interventionPrescriptions.filter(item => item.id !== id);
    state.interventionItems = state.interventionItems.filter(item => item.interventionPrescriptionId !== id);
    if (!saveState()) {
      state.interventionPrescriptions = snapshot.p;
      state.interventionItems = snapshot.i;
      return;
    }
    if (editingIvId === id) resetIvForm();
    renderInterventions();
    showToast("Intervention prescription deleted.");
  }

  function initInterventions() {
    renderAppHeader("interventions");
    const canEdit = canManageRecords();
    document.querySelector("[data-iv-form-card]").hidden = !canEdit;
    document.querySelector("[data-iv-access-note]").hidden = canEdit;
    document.querySelector("[data-iv-actions-head]").hidden = !canEdit;
    const form = document.querySelector("[data-iv-form]");
    form.elements.issuedAt.max = nowLocalInput();
    fillIvPractitioners("");
    resetIvForm();
    form.addEventListener("submit", saveIv);
    document.addEventListener("click", event => {
      if (event.target.closest("[data-iv-add]")) addInterventionRow("");
      else if (event.target.closest("[data-iv-remove]")) event.target.closest("[data-iv-item]").remove();
      else if (event.target.closest("[data-iv-cancel]")) resetIvForm();
      const view = event.target.closest("[data-iv-view]");
      if (view) viewIv(view.dataset.ivView);
      const edit = event.target.closest("[data-iv-edit]");
      if (edit) editIv(edit.dataset.ivEdit);
      const del = event.target.closest("[data-iv-delete]");
      if (del) deleteIv(del.dataset.ivDelete);
    });
    renderInterventions();
  }

  function todayInput() {
    return nowLocalInput().slice(0, 10);
  }

  function formatDateTime(value) {
    const date = new Date(value);
    return isNaN(date) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  // Latest prescription of each practitioner for this patient drives the daily schedule.
  function medicationSchedule(day) {
    const latest = new Map();
    state.prescriptions.filter(item => item.patientId === patientKey()).forEach(item => {
      const current = latest.get(item.practitionerId);
      if (!current || item.issuedAt > current.issuedAt) latest.set(item.practitionerId, item);
    });
    const entries = [];
    latest.forEach(rx => {
      state.prescriptionMedications.filter(med => med.prescriptionId === rx.id).forEach(med => {
        med.timings.forEach(timing => {
          const taken = state.medicationLogs.some(log => log.medicationId === med.id && log.timing === timing && log.scheduledDate === day);
          if (!taken) entries.push({ med, rx, timing });
        });
      });
    });
    return entries.sort((a, b) => RX_TIMINGS.indexOf(a.timing) - RX_TIMINGS.indexOf(b.timing) || a.med.drugName.localeCompare(b.med.drugName));
  }

  function renderSchedule() {
    const box = document.querySelector("[data-schedule]");
    if (!box) return;
    const day = todayInput();
    const canEdit = canManageRecords();
    const entries = medicationSchedule(day);
    box.innerHTML = entries.map(({ med, timing }) => `
      <div class="med-item">
        <div class="med-name"><b>${htmlEscape(med.drugName)}</b> - ${htmlEscape(med.quantity)} ${htmlEscape(med.unit)}</div>
        <div class="med-time">${timing}</div>
        <div class="med-meal">${htmlEscape(med.mealQualifier)}</div>
        ${canEdit ? `<div class="med-actions"><input type="datetime-local" value="${nowLocalInput()}" max="${nowLocalInput()}" aria-label="Time taken"><button type="button" class="med-take" data-take-med="${htmlEscape(med.id)}" data-take-timing="${timing}">Mark Taken</button></div>` : ""}
      </div>`).join("");
    document.querySelector("[data-schedule-empty]").hidden = entries.length > 0;
  }

  function renderMedLog() {
    const list = document.querySelector("[data-med-log]");
    if (!list) return;
    const day = document.querySelector("[data-log-date]").value;
    const logs = state.medicationLogs.filter(log => log.patientId === patientKey() && (!day || log.takenAt.slice(0, 10) === day)).sort((a, b) => b.takenAt.localeCompare(a.takenAt));
    list.innerHTML = logs.map(log => `<div class="log-row"><div><b>${htmlEscape(log.drugName)}</b> — taken<small>${htmlEscape(formatDateTime(log.takenAt))}</small></div>${canManageRecords() ? `<div class="table-actions"><button class="table-action" type="button" data-log-view="${htmlEscape(log.id)}">View</button><button class="table-action" type="button" data-log-edit="${htmlEscape(log.id)}">Edit</button><button class="table-action delete" type="button" data-log-delete="${htmlEscape(log.id)}">Delete</button></div>` : ""}</div>`).join("");
    document.querySelector("[data-log-empty]").hidden = logs.length > 0;
  }

  function viewLog(id) {
    const log = state.medicationLogs.find(entry => entry.id === id);
    if (!log) return;
    const med = state.prescriptionMedications.find(entry => entry.id === log.medicationId);
    showDetails("Medication log", [
      ["Medicine", med ? rxDescribeMed(med) : log.drugName],
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
    dialog.innerHTML = `<form class="record-form" novalidate><h2>Edit medication log</h2><div class="symptom-form"><p class="rx-hint">${htmlEscape(log.drugName)} · ${htmlEscape(log.timing)}</p><label class="form-field">Time taken<input type="datetime-local" name="takenAt" required value="${htmlEscape(log.takenAt)}" max="${nowLocalInput()}"></label><p class="form-error" data-log-error role="alert" hidden></p><div class="symptom-actions"><button type="button" class="button button-secondary" data-log-cancel>Cancel</button><button type="submit" class="button button-primary">Update log</button></div></div></form>`;
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
      const previous = log.takenAt;
      log.takenAt = value;
      if (!saveState()) {
        log.takenAt = previous;
        return;
      }
      dialog.close();
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
    const med = state.prescriptionMedications.find(entry => entry.id === button.dataset.takeMed);
    if (!med) return;
    const log = { id: createId("MEDLOG"), patientId: patientKey(), practitionerId: med.practitionerId, prescriptionId: med.prescriptionId, medicationId: med.id, drugName: med.drugName, timing: button.dataset.takeTiming, scheduledDate: todayInput(), takenAt };
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
    const dateInput = document.querySelector("[data-log-date]");
    dateInput.addEventListener("change", renderMedLog);
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
    return state.prescriptions.filter(rx => rx.patientId === patientKey() && rx.practitionerId === practitionerId && state.prescriptionDiagnoses.some(dx => dx.prescriptionId === rx.id && dx.testId === testId)).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
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
    const tests = state.tests.filter(item => (item.status !== "Deleted" && state.parameters.some(parameter => parameter.testId === item.id && parameter.status !== "Deleted")) || item.id === existing?.testId).sort((a, b) => a.name.localeCompare(b.name));
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
    const options = withTime ? { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" } : { month: "short", day: "numeric", year: "numeric" };
    return new Intl.DateTimeFormat(undefined, options).format(new Date(ms));
  }

  // series: [{name, color, axis: "left"|"right", dashed, area, points: [{t, v}]}]; refLines: [{label, value, color}]
  function renderLineChart(container, { series, refLines = [], leftLabel = "", rightLabel = "" }) {
    const all = series.flatMap(item => item.points);
    if (!all.length) {
      container.innerHTML = '<div class="empty-state"><span>♡</span><b>Nothing to chart yet</b><p>Record a few entries to see the trend.</p></div>';
      return;
    }
    const W = 900, H = 340, left = 62, right = series.some(item => item.axis === "right") ? 62 : 24, top = 42, bottom = 62;
    let t0 = Math.min(...all.map(p => p.t)), t1 = Math.max(...all.map(p => p.t));
    if (t0 === t1) { t0 -= 43200000; t1 += 43200000; }
    const withTime = t1 - t0 <= 3 * 86400000;
    const x = t => left + ((t - t0) / (t1 - t0)) * (W - left - right);
    const scaleFor = axis => {
      const values = series.filter(item => item.axis === axis).flatMap(item => item.points.map(p => p.v));
      if (axis === "left") values.push(...refLines.map(line => line.value));
      return values.length ? niceScale(Math.min(...values), Math.max(...values)) : null;
    };
    const scales = { left: scaleFor("left"), right: scaleFor("right") };
    const y = (axis, v) => { const s = scales[axis]; return H - bottom - ((v - s.lo) / (s.hi - s.lo)) * (H - top - bottom); };
    const parts = [];
    const primary = scales.left || scales.right;
    const primaryAxis = scales.left ? "left" : "right";
    primary.ticks.forEach(v => {
      parts.push(`<line x1="${left}" x2="${W - right}" y1="${y(primaryAxis, v)}" y2="${y(primaryAxis, v)}" class="chart-grid"/>`);
      if (scales.left) parts.push(`<text x="${left - 8}" y="${y("left", v) + 4}" text-anchor="end" class="chart-tick">${v}</text>`);
    });
    if (scales.right) scales.right.ticks.forEach(v => parts.push(`<text x="${W - right + 8}" y="${y("right", v) + 4}" class="chart-tick">${v}</text>`));
    const xTicks = [...new Set(all.map(p => p.t))].sort((a, b) => a - b);
    const shown = xTicks.length <= 6 ? xTicks : Array.from({ length: 6 }, (_, i) => xTicks[Math.round(i * (xTicks.length - 1) / 5)]);
    shown.forEach(t => parts.push(`<line x1="${x(t)}" x2="${x(t)}" y1="${H - bottom}" y2="${H - bottom + 4}" class="chart-axis"/><text transform="translate(${x(t)} ${H - bottom + 14}) rotate(-40)" text-anchor="end" class="chart-tick">${htmlEscape(chartDate(t, withTime))}</text>`));
    parts.push(`<line x1="${left}" x2="${W - right}" y1="${H - bottom}" y2="${H - bottom}" class="chart-axis"/>`);
    refLines.forEach(line => parts.push(`<line x1="${left}" x2="${W - right}" y1="${y("left", line.value)}" y2="${y("left", line.value)}" stroke="${line.color}" stroke-width="1.5" stroke-dasharray="5 4"><title>${htmlEscape(line.label)}: ${line.value}</title></line>`));
    series.forEach(item => {
      const pts = item.points.slice().sort((a, b) => a.t - b.t);
      const coords = pts.map(p => `${x(p.t).toFixed(1)},${y(item.axis, p.v).toFixed(1)}`);
      if (item.area && pts.length > 1) parts.push(`<polygon points="${x(pts[0].t).toFixed(1)},${H - bottom} ${coords.join(" ")} ${x(pts[pts.length - 1].t).toFixed(1)},${H - bottom}" fill="${item.color}" opacity=".15"/>`);
      if (pts.length > 1) parts.push(`<polyline points="${coords.join(" ")}" fill="none" stroke="${item.color}" stroke-width="2.5" stroke-linejoin="round"${item.dashed ? ' stroke-dasharray="3 5" stroke-linecap="round"' : ""}/>`);
      pts.forEach(p => parts.push(`<circle cx="${x(p.t).toFixed(1)}" cy="${y(item.axis, p.v).toFixed(1)}" r="4" fill="${item.color}" stroke="#fff" stroke-width="1.5"><title>${htmlEscape(item.name)}: ${p.v} (${htmlEscape(chartDate(p.t, true))})</title></circle>`));
    });
    if (leftLabel) parts.push(`<text transform="translate(14 ${(top + H - bottom) / 2}) rotate(-90)" text-anchor="middle" class="chart-axis-label">${htmlEscape(leftLabel)}</text>`);
    if (rightLabel) parts.push(`<text transform="translate(${W - 12} ${(top + H - bottom) / 2}) rotate(90)" text-anchor="middle" class="chart-axis-label">${htmlEscape(rightLabel)}</text>`);
    const legend = [...series.map(item => ({ name: item.name, color: item.color, dashed: item.dashed })), ...refLines.map(line => ({ name: line.label, color: line.color, dashed: true }))]
      .map(item => `<span class="chart-key"><i style="background:${item.color}${item.dashed ? ";opacity:.75" : ""}"></i>${htmlEscape(item.name)}</span>`).join("");
    container.innerHTML = `<div class="chart-legend">${legend}</div><svg viewBox="0 0 ${W} ${H}" class="chart-svg" role="img" aria-label="Trend chart">${parts.join("")}</svg>`;
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
    if (!parameter) { renderLineChart(container, { series: [] }); return; }
    const points = [];
    mine.forEach(record => record.values.filter(entry => entry.parameterId === id).forEach(entry => {
      const value = Number(entry.value);
      if (Number.isFinite(value)) points.push({ t: new Date(record.recordedAt).getTime(), v: value });
    }));
    const gender = activeGender();
    const range = parseLimitRange(gender === "Female" ? parameter.femaleLimits : parameter.maleLimits);
    const refLines = range ? [{ label: "Reference Range LOW", value: range[0], color: "#e76f51" }, { label: "Reference Range HIGH", value: range[1], color: "#2a9d8f" }] : [];
    renderLineChart(container, { series: [{ name: parameter.unit && !parameter.name.includes(`(${parameter.unit})`) ? `${parameter.name} (${parameter.unit})` : parameter.name, color: "#9b51e0", axis: "left", area: true, points }], refLines, leftLabel: parameter.unit || "" });
  }

  function initAnalytics() {
    renderAppHeader("analytics");
    renderVitalsTrend();
    const select = document.querySelector("[data-lab-measure]");
    const recorded = new Set(state.labResults.filter(item => item.patientId === patientKey()).flatMap(item => item.values.map(entry => entry.parameterId)));
    const options = state.parameters.filter(item => recorded.has(item.id)).map(item => ({ id: item.id, label: `${state.tests.find(test => test.id === item.testId)?.name.replace(/\s*\(.*\)\s*$/, "") || "Unlinked"} — ${item.name}` })).sort((a, b) => a.label.localeCompare(b.label));
    select.innerHTML = options.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.label)}</option>`).join("") || '<option value="">No lab results recorded</option>';
    select.disabled = !options.length;
    select.addEventListener("change", renderLabTrend);
    renderLabTrend();
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
    const page = document.body.dataset.page;
    if (page === "analytics") initAnalytics();
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
    if (page === "interventions") initInterventions();
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
