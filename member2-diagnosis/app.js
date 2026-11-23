/**
 * SE 331 - Appliance Fault Diagnosis & Repair Cost Estimator
 * Member 2: Fault Diagnosis Engine
 * File: app.js
 * 
 * Interactive Test UI controller.
 * Binds MockDatabase and DiagnosisEngine with the DOM.
 */

document.addEventListener("DOMContentLoaded", function() {
  // DOM Elements
  const mockSelect = document.getElementById("mockComplaintSelect");
  const quickPillBtns = document.querySelectorAll(".quick-pill-btn");
  const diagnosisForm = document.getElementById("diagnosisForm");
  const applianceRadios = document.querySelectorAll('input[name="appliance"]');
  const symptomsContainer = document.getElementById("symptomsList");
  const descriptionInput = document.getElementById("complaintDescription");
  const btnReset = document.getElementById("btnReset");

  // Output Elements
  const dangerBanner = document.getElementById("dangerBanner");
  const dangerMessage = document.getElementById("dangerMessage");
  const applianceTag = document.getElementById("applianceTag");
  const resFaultName = document.getElementById("resFaultName");
  const resFaultId = document.getElementById("resFaultId");
  const resConfidenceLabel = document.getElementById("resConfidenceLabel");
  const resConfidenceBar = document.getElementById("resConfidenceBar");
  const resCausesList = document.getElementById("resCausesList");
  const resRecommendation = document.getElementById("resRecommendation");
  const jsonOutput = document.getElementById("jsonOutput");
  const btnCopyJson = document.getElementById("btnCopyJson");
  const copyStatusText = document.getElementById("copyStatusText");
  const historyList = document.getElementById("historyList");
  const btnClearHistory = document.getElementById("btnClearHistory");

  let currentDiagnosis = null;

  // 1. Initialize Mock Complaints Select Dropdown
  function initMockSelect() {
    const complaints = MockDatabase.getSampleComplaints();
    complaints.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `[${c.appliance}] ${c.title}`;
      mockSelect.appendChild(option);
    });

    mockSelect.addEventListener("change", function(e) {
      const complaintId = e.target.value;
      if (complaintId) {
        loadComplaintById(complaintId);
      }
    });
  }

  // 2. Load complaint data into form and automatically trigger diagnosis
  function loadComplaintById(complaintId) {
    const complaint = MockDatabase.getComplaintById(complaintId);
    if (!complaint) return;

    // Set appliance radio
    const targetRadio = document.querySelector(`input[name="appliance"][value="${complaint.appliance}"]`);
    if (targetRadio) {
      targetRadio.checked = true;
      renderSymptoms(complaint.appliance);
    }

    // Check symptoms
    if (Array.isArray(complaint.symptoms)) {
      complaint.symptoms.forEach(symId => {
        const checkbox = document.querySelector(`input[name="symptom"][value="${symId}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }

    // Set description
    descriptionInput.value = complaint.description || "";

    // Sync select dropdown if not already matched
    mockSelect.value = complaintId;

    // Run diagnosis
    executeDiagnosis();
  }

  // 3. Render symptom checkboxes dynamically based on selected appliance
  function renderSymptoms(appliance) {
    symptomsContainer.innerHTML = "";
    const symptoms = MockDatabase.getSymptomsForAppliance(appliance);

    symptoms.forEach(sym => {
      const label = document.createElement("label");
      label.className = "symptom-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "symptom";
      checkbox.value = sym.id;

      const span = document.createElement("span");
      span.textContent = sym.label;

      label.appendChild(checkbox);
      label.appendChild(span);
      symptomsContainer.appendChild(label);
    });
  }

  // Listen to appliance switch to refresh symptoms
  applianceRadios.forEach(radio => {
    radio.addEventListener("change", function(e) {
      if (e.target.checked) {
        renderSymptoms(e.target.value);
      }
    });
  });

  // 4. Quick Pills Click Handlers
  quickPillBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const complaintId = this.getAttribute("data-id");
      loadComplaintById(complaintId);
    });
  });

  // 5. Gather input and execute diagnosis
  function executeDiagnosis() {
    const selectedAppliance = document.querySelector('input[name="appliance"]:checked')?.value || "Refrigerator";
    const checkedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked')).map(cb => cb.value);
    const description = descriptionInput.value.trim();

    // Call Diagnosis Engine
    const diagnosis = DiagnosisEngine.diagnoseFault({
      appliance: selectedAppliance,
      symptoms: checkedSymptoms,
      description: description
    });

    currentDiagnosis = diagnosis;

    // Save to Mock Database (localStorage)
    MockDatabase.saveDiagnosisHistory(diagnosis);

    // Render results to UI
    renderDiagnosisResult(diagnosis);
    renderHistoryList();
  }

  // 6. Display diagnosis result on UI
  function renderDiagnosisResult(diag) {
    if (!diag) return;

    // Appliance Tag
    applianceTag.textContent = diag.appliance;

    // Danger Banner
    if (diag.isDangerous) {
      dangerBanner.style.display = "flex";
      dangerMessage.textContent = diag.safetyWarning || "Dangerous condition detected. Unplug appliance immediately.";
    } else {
      dangerBanner.style.display = "none";
    }

    // Title and Fault ID
    resFaultName.textContent = diag.likelyFault;
    resFaultId.textContent = diag.faultId;

    // Confidence
    const score = diag.confidenceScore || 0;
    resConfidenceLabel.textContent = diag.confidence;
    resConfidenceBar.style.width = score + "%";

    // Set Confidence Color
    resConfidenceBar.className = "confidence-bar-fill";
    if (diag.confidenceLevel === "High") {
      resConfidenceBar.classList.add("conf-high");
    } else if (diag.confidenceLevel === "Medium") {
      resConfidenceBar.classList.add("conf-medium");
    } else {
      resConfidenceBar.classList.add("conf-low");
    }

    // Causes List
    resCausesList.innerHTML = "";
    if (diag.possibleCauses && diag.possibleCauses.length > 0) {
      diag.possibleCauses.forEach(cause => {
        const li = document.createElement("li");
        li.textContent = cause;
        resCausesList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No specific causes identified.";
      resCausesList.appendChild(li);
    }

    // Recommendation
    resRecommendation.textContent = diag.recommendation;

    // JSON Output for Member 3
    jsonOutput.textContent = JSON.stringify(diag, null, 2);
    copyStatusText.textContent = "Click Copy to clipboard";
  }

  // 7. Render Recent Diagnosis History from localStorage
  function renderHistoryList() {
    const history = MockDatabase.getDiagnosisHistory();
    historyList.innerHTML = "";

    if (!history || history.length === 0) {
      historyList.innerHTML = `<div class="empty-state">No diagnosis records saved yet. Run a diagnosis above to see history.</div>`;
      return;
    }

    history.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "history-item";

      const leftDiv = document.createElement("div");
      const timeStr = new Date(item.diagnosedAt || item.savedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      leftDiv.innerHTML = `
        <div class="history-fault-name">${item.likelyFault}</div>
        <div class="history-meta">${item.appliance} • ${timeStr} • ${item.faultId}</div>
      `;

      const rightDiv = document.createElement("div");
      const badgeClass = item.isDangerous ? "badge-branch" : (item.confidenceLevel === "High" ? "badge-module" : "badge-branch");
      const badgeText = item.isDangerous ? "⚠️ DANGER" : item.confidence;
      rightDiv.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;

      itemEl.appendChild(leftDiv);
      itemEl.appendChild(rightDiv);

      itemEl.addEventListener("click", function() {
        renderDiagnosisResult(item);
      });

      historyList.appendChild(itemEl);
    });
  }

  // 8. Copy JSON to Clipboard
  btnCopyJson.addEventListener("click", function() {
    if (!currentDiagnosis) return;
    const jsonStr = JSON.stringify(currentDiagnosis, null, 2);

    navigator.clipboard.writeText(jsonStr).then(() => {
      copyStatusText.textContent = "✓ Copied to clipboard!";
      setTimeout(() => {
        copyStatusText.textContent = "Click Copy to clipboard";
      }, 2500);
    }).catch(err => {
      console.error("Failed to copy:", err);
      copyStatusText.textContent = "Failed to copy";
    });
  });

  // 9. Clear History
  btnClearHistory.addEventListener("click", function() {
    if (confirm("Are you sure you want to clear the local diagnosis history?")) {
      MockDatabase.clearDiagnosisHistory();
      renderHistoryList();
    }
  });

  // 10. Reset Form
  btnReset.addEventListener("click", function() {
    diagnosisForm.reset();
    document.querySelector('input[name="appliance"][value="Refrigerator"]').checked = true;
    renderSymptoms("Refrigerator");
    mockSelect.value = "";
    dangerBanner.style.display = "none";
    resFaultName.textContent = "Awaiting Diagnosis...";
    resFaultId.textContent = "FLT-READY";
    resConfidenceLabel.textContent = "0%";
    resConfidenceBar.style.width = "0%";
    resCausesList.innerHTML = `<li>Select an assessment complaint or enter symptoms to view probable causes.</li>`;
    resRecommendation.textContent = "Run diagnosis to generate physical inspection steps and technician testing guidelines.";
    jsonOutput.textContent = "// Diagnosis JSON payload will appear here...";
    applianceTag.textContent = "Ready";
  });

  // 11. Form Submit
  diagnosisForm.addEventListener("submit", function(e) {
    e.preventDefault();
    executeDiagnosis();
  });

  // Initialize
  initMockSelect();
  renderSymptoms("Refrigerator");
  renderHistoryList();

  // Load the first assessment test case by default for immediate preview
  loadComplaintById("CMP-REF-001");
});
