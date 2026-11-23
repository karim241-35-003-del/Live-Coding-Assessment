/**
 * SE 331 - Appliance Fault Diagnosis & Repair Cost Estimator
 * Member 2: Fault Diagnosis Engine
 * File: app.js
 * 
 * Controller for Member 2's Fault Diagnosis Engine UI.
 * Connects simulated Member 1 intake queue (MockDatabase) with DiagnosisEngine.
 */

import "./style.css";
import MockDatabaseModule from "./mock.js";
import DiagnosisEngineModule from "./diagnosisEngine.js";

const MockDatabase = MockDatabaseModule || (typeof window !== "undefined" ? window.MockDatabase : null);
const DiagnosisEngine = DiagnosisEngineModule || (typeof window !== "undefined" ? window.DiagnosisEngine : null);

document.addEventListener("DOMContentLoaded", function() {
  // DOM Elements - Queue
  const complaintsQueue = document.getElementById("complaintsQueue");
  const filterPills = document.querySelectorAll(".filter-pill");

  // DOM Elements - Diagnosis Output
  const dangerBanner = document.getElementById("dangerBanner");
  const dangerMessage = document.getElementById("dangerMessage");
  const applianceTag = document.getElementById("applianceTag");
  const activeComplaintInfo = document.getElementById("activeComplaintInfo");
  const infoComplaintId = document.getElementById("infoComplaintId");
  const infoCustomerName = document.getElementById("infoCustomerName");
  const resFaultName = document.getElementById("resFaultName");
  const resFaultId = document.getElementById("resFaultId");
  const resConfidenceLabel = document.getElementById("resConfidenceLabel");
  const resConfidenceBar = document.getElementById("resConfidenceBar");
  const resCausesList = document.getElementById("resCausesList");
  const resRecommendation = document.getElementById("resRecommendation");

  // DOM Elements - History
  const historyList = document.getElementById("historyList");
  const btnClearHistory = document.getElementById("btnClearHistory");

  let activeFilter = "all";
  let activeComplaintId = null;

  // 1. Render the Incoming Complaints Queue
  function renderComplaintsQueue() {
    const complaints = MockDatabase.getIncomingComplaints();
    complaintsQueue.innerHTML = "";

    const filtered = complaints.filter(c => {
      if (activeFilter === "all") return true;
      if (activeFilter === "Refrigerator") return c.applianceType === "Refrigerator";
      if (activeFilter === "Washing Machine") return c.applianceType === "Washing Machine";
      if (activeFilter === "Microwave Oven") return c.applianceType.includes("Microwave");
      return true;
    });

    if (filtered.length === 0) {
      complaintsQueue.innerHTML = `<div class="empty-state">No complaints matching filter.</div>`;
      return;
    }

    filtered.forEach(c => {
      const card = document.createElement("div");
      card.className = "complaint-card" + (c.id === activeComplaintId ? " active" : "");
      card.setAttribute("data-id", c.id);

      const priorityClass = `priority-${(c.priority || "medium").toLowerCase()}`;
      const applianceIcon = c.applianceType.includes("Fridge") || c.applianceType.includes("Refrigerator")
        ? "❄️"
        : (c.applianceType.includes("Wash") ? "🌀" : "⚡");

      card.innerHTML = `
        <div class="complaint-top">
          <span class="complaint-id">${c.id}</span>
          <span class="priority-badge ${priorityClass}">${c.priority || "Normal"}</span>
        </div>
        <div class="complaint-customer">${c.customerName} • ${c.brand || c.applianceType}</div>
        <div class="complaint-category">${c.issueCategory || "Reported Issue"}</div>
        <div class="complaint-desc">"${c.description}"</div>
        <div class="complaint-footer">
          <span>${applianceIcon} ${c.applianceType}</span>
          <span class="action-hint">Run Diagnosis →</span>
        </div>
      `;

      card.addEventListener("click", () => {
        handleSelectComplaint(c.id);
      });

      complaintsQueue.appendChild(card);
    });
  }

  // 2. Filter Pills Handler
  filterPills.forEach(pill => {
    pill.addEventListener("click", function() {
      filterPills.forEach(p => p.classList.remove("active"));
      this.classList.add("active");
      activeFilter = this.getAttribute("data-filter");
      renderComplaintsQueue();
    });
  });

  // 3. Handle selection of a complaint
  function handleSelectComplaint(complaintId) {
    const complaint = MockDatabase.getComplaintById(complaintId);
    if (!complaint) return;

    activeComplaintId = complaintId;

    // Highlight active card
    document.querySelectorAll(".complaint-card").forEach(el => {
      if (el.getAttribute("data-id") === complaintId) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    // Update active complaint banner
    infoComplaintId.textContent = complaint.id;
    infoCustomerName.textContent = `(${complaint.customerName} — ${complaint.brand || ""} ${complaint.applianceType})`;

    // Run Member 2 Diagnosis Engine
    const diagnosis = DiagnosisEngine.diagnoseFault(complaint);

    // Save to localStorage history
    MockDatabase.saveDiagnosisHistory(diagnosis);

    // Render results
    renderDiagnosisResult(diagnosis);
    renderHistoryList();
  }

  // 4. Render Diagnosis Results on UI
  function renderDiagnosisResult(diag) {
    if (!diag) return;

    // Appliance Tag
    applianceTag.textContent = diag.appliance;

    // Danger Alert Banner (Priority Safety)
    if (diag.isDangerous) {
      dangerBanner.style.display = "flex";
      dangerMessage.textContent = diag.safetyWarning || "Critical safety condition detected. Disconnect power immediately!";
    } else {
      dangerBanner.style.display = "none";
    }

    // Title and Fault ID
    resFaultName.textContent = diag.likelyFault;
    resFaultId.textContent = diag.faultId;

    // Diagnostic Confidence Meter
    const score = diag.confidenceScore || 0;
    resConfidenceLabel.textContent = diag.confidence;
    resConfidenceBar.style.width = score + "%";

    resConfidenceBar.className = "confidence-bar-fill";
    if (diag.confidenceLevel === "High") {
      resConfidenceBar.classList.add("conf-high");
    } else if (diag.confidenceLevel === "Medium") {
      resConfidenceBar.classList.add("conf-medium");
    } else {
      resConfidenceBar.classList.add("conf-low");
    }

    // Probable Causes List
    resCausesList.innerHTML = "";
    if (diag.possibleCauses && diag.possibleCauses.length > 0) {
      diag.possibleCauses.forEach(cause => {
        const li = document.createElement("li");
        li.textContent = cause;
        resCausesList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No specific cause identified.";
      resCausesList.appendChild(li);
    }

    // Recommended Action / Inspection
    resRecommendation.textContent = diag.recommendation;
  }

  // 5. Render Recent Diagnosis History from localStorage
  function renderHistoryList() {
    const history = MockDatabase.getDiagnosisHistory();
    historyList.innerHTML = "";

    if (!history || history.length === 0) {
      historyList.innerHTML = `<div class="empty-state">No diagnosis records saved yet. Click any complaint in the queue to run diagnosis.</div>`;
      return;
    }

    history.forEach(item => {
      const itemEl = document.createElement("div");
      itemEl.className = "history-item";

      const leftDiv = document.createElement("div");
      const timeStr = new Date(item.diagnosedAt || item.savedAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const complaintPrefix = item.complaintId ? `${item.complaintId} • ` : "";

      leftDiv.innerHTML = `
        <div class="history-fault-name">${item.likelyFault}</div>
        <div class="history-meta">${complaintPrefix}${item.appliance} • ${timeStr} • ${item.faultId}</div>
      `;

      const rightDiv = document.createElement("div");
      const badgeClass = item.isDangerous ? "badge-branch" : (item.confidenceLevel === "High" ? "badge-module" : "badge-branch");
      const badgeText = item.isDangerous ? "⚠️ DANGER" : item.confidence;
      rightDiv.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;

      itemEl.appendChild(leftDiv);
      itemEl.appendChild(rightDiv);

      itemEl.addEventListener("click", function() {
        renderDiagnosisResult(item);
        if (item.complaintId) {
          infoComplaintId.textContent = item.complaintId;
          infoCustomerName.textContent = item.customerName ? `(${item.customerName})` : "";
        }
      });

      historyList.appendChild(itemEl);
    });
  }

  // 6. Clear History Handler
  btnClearHistory.addEventListener("click", function() {
    if (confirm("Are you sure you want to clear the local diagnosis history?")) {
      MockDatabase.clearDiagnosisHistory();
      renderHistoryList();
    }
  });

  // Initial Load
  renderComplaintsQueue();
  renderHistoryList();

  // Load first complaint automatically
  handleSelectComplaint("JAC-2026-001");
});
