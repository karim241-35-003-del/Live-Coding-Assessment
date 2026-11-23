import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  PlusCircle,
  Calendar,
  Wrench,
  CheckCircle2,
  Clock,
  Printer,
  LayoutGrid,
  Columns3,
  List,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Truck,
  Refrigerator,
  WashingMachine,
  Microwave
} from 'lucide-react';
import { useData } from '../context/DataContext';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import JobCardModal from '../components/common/JobCardModal';

export default function ComplaintHistory() {
  const { complaints, updateComplaintStatus } = useData();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [applianceFilter, setApplianceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'cards' | 'table'

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Status counts for pipeline tabs
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const inspectionCount = complaints.filter((c) => c.status === 'Under Inspection').length;
  const repairedCount = complaints.filter((c) => c.status === 'Repaired').length;
  const deliveredCount = complaints.filter((c) => c.status === 'Delivered').length;

  // Appliance counts
  const fridgeCount = complaints.filter((c) => c.applianceType === 'Refrigerator').length;
  const washerCount = complaints.filter((c) => c.applianceType === 'Washing Machine').length;
  const microwaveCount = complaints.filter((c) => c.applianceType === 'Microwave Oven').length;

  // Filter complaints
  const filteredComplaints = complaints.filter((item) => {
    // 1. Search term
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const match =
        item.id.toLowerCase().includes(term) ||
        item.customerName.toLowerCase().includes(term) ||
        item.customerPhone.includes(term) ||
        item.applianceType.toLowerCase().includes(term) ||
        (item.brand && item.brand.toLowerCase().includes(term)) ||
        item.issueCategory.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      if (!match) return false;
    }

    // 2. Appliance type filter
    if (applianceFilter !== 'All' && item.applianceType !== applianceFilter) {
      return false;
    }

    // 3. Status filter
    if (statusFilter !== 'All' && item.status !== statusFilter) {
      return false;
    }

    // 4. Priority filter
    if (priorityFilter !== 'All' && item.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // Advance status shortcut
  const handleQuickAdvance = (complaint) => {
    let nextStatus = 'Under Inspection';
    if (complaint.status === 'Pending') nextStatus = 'Under Inspection';
    else if (complaint.status === 'Under Inspection') nextStatus = 'Repaired';
    else if (complaint.status === 'Repaired') nextStatus = 'Delivered';
    updateComplaintStatus(complaint.id, nextStatus);
  };

  // Helper for appliance styling
  const getApplianceAccent = (type) => {
    switch (type) {
      case 'Refrigerator':
        return { emoji: '❄️', borderClass: 'accent-cyan', textClass: 'text-cyan-600' };
      case 'Washing Machine':
        return { emoji: '🧺', borderClass: 'accent-emerald', textClass: 'text-emerald-600' };
      case 'Microwave Oven':
        return { emoji: '⚡', borderClass: 'accent-amber', textClass: 'text-amber-600' };
      default:
        return { emoji: '🔧', borderClass: 'accent-blue', textClass: 'text-blue-600' };
    }
  };

  // 4-step progress index helper
  const getStepProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Under Inspection':
        return 2;
      case 'Repaired':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="page-container complaints-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaint History & Diagnostics Pipeline</h1>
          <p className="page-subtitle">
            Visual tracking of appliance repairs, diagnosis stages, and customer tickets.
          </p>
        </div>
        <Link to="/new-complaint" className="btn btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Register New Complaint</span>
        </Link>
      </div>

      {/* GRAPHICAL STAGE PIPELINE STAT CARDS (Interactive Filter) */}
      <div className="stage-pipeline-grid">
        <button
          className={`stage-card ${statusFilter === 'All' ? 'active' : ''}`}
          onClick={() => setStatusFilter('All')}
        >
          <div className="stage-top">
            <span className="stage-title">All Complaints</span>
            <span className="stage-pill-count bg-slate">{complaints.length}</span>
          </div>
          <span className="stage-desc">Overall shop workload</span>
        </button>

        <button
          className={`stage-card stage-pending ${statusFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
        >
          <div className="stage-top">
            <span className="stage-title flex items-center gap-1.5">
              <Clock size={16} className="text-amber-500" />
              <span>Pending</span>
            </span>
            <span className="stage-pill-count bg-amber">{pendingCount}</span>
          </div>
          <span className="stage-desc">Awaiting technician diagnostic</span>
        </button>

        <button
          className={`stage-card stage-inspection ${statusFilter === 'Under Inspection' ? 'active' : ''}`}
          onClick={() =>
            setStatusFilter(statusFilter === 'Under Inspection' ? 'All' : 'Under Inspection')
          }
        >
          <div className="stage-top">
            <span className="stage-title flex items-center gap-1.5">
              <Wrench size={16} className="text-blue-500" />
              <span>Under Inspection</span>
            </span>
            <span className="stage-pill-count bg-blue">{inspectionCount}</span>
          </div>
          <span className="stage-desc">In workshop or field visit</span>
        </button>

        <button
          className={`stage-card stage-repaired ${statusFilter === 'Repaired' ? 'active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'Repaired' ? 'All' : 'Repaired')}
        >
          <div className="stage-top">
            <span className="stage-title flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Repaired</span>
            </span>
            <span className="stage-pill-count bg-emerald">{repairedCount}</span>
          </div>
          <span className="stage-desc">Fixed & tested, ready for pickup</span>
        </button>

        <button
          className={`stage-card stage-delivered ${statusFilter === 'Delivered' ? 'active' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'Delivered' ? 'All' : 'Delivered')}
        >
          <div className="stage-top">
            <span className="stage-title flex items-center gap-1.5">
              <Truck size={16} className="text-slate-500" />
              <span>Delivered</span>
            </span>
            <span className="stage-pill-count bg-slate-subtle">{deliveredCount}</span>
          </div>
          <span className="stage-desc">Closed & returned to customer</span>
        </button>
      </div>

      {/* GRAPHICAL APPLIANCE CATEGORY SELECTOR CHIPS */}
      <div className="appliance-quick-filter-bar mt-4">
        <span className="filter-bar-label">Appliance Filter:</span>
        <div className="appliance-filter-chips">
          <button
            className={`app-filter-chip ${applianceFilter === 'All' ? 'active' : ''}`}
            onClick={() => setApplianceFilter('All')}
          >
            <span>All Categories</span>
            <span className="chip-count">({complaints.length})</span>
          </button>
          <button
            className={`app-filter-chip chip-cyan ${applianceFilter === 'Refrigerator' ? 'active' : ''}`}
            onClick={() =>
              setApplianceFilter(applianceFilter === 'Refrigerator' ? 'All' : 'Refrigerator')
            }
          >
            <span>❄️ Refrigerator</span>
            <span className="chip-count">({fridgeCount})</span>
          </button>
          <button
            className={`app-filter-chip chip-emerald ${applianceFilter === 'Washing Machine' ? 'active' : ''}`}
            onClick={() =>
              setApplianceFilter(applianceFilter === 'Washing Machine' ? 'All' : 'Washing Machine')
            }
          >
            <span>🧺 Washing Machine</span>
            <span className="chip-count">({washerCount})</span>
          </button>
          <button
            className={`app-filter-chip chip-amber ${applianceFilter === 'Microwave Oven' ? 'active' : ''}`}
            onClick={() =>
              setApplianceFilter(applianceFilter === 'Microwave Oven' ? 'All' : 'Microwave Oven')
            }
          >
            <span>⚡ Microwave Oven</span>
            <span className="chip-count">({microwaveCount})</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND VIEW CONTROLS */}
      <div className="card filter-card mt-4">
        <div className="complaint-toolbar-row">
          {/* Search box */}
          <div className="filter-search-box flex-1">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by ticket ID, customer name, mobile, fault, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="filter-select-group min-w-160">
            <select
              className="form-select form-select-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">🔥 Urgent Priority</option>
              <option value="High">⚡ High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* View Mode Toggle: Pipeline Kanban vs Cards vs Table */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
              onClick={() => setViewMode('pipeline')}
              title="Pipeline Board View"
              aria-label="Pipeline Board View"
            >
              <Columns3 size={17} />
              <span className="hide-on-mobile text-xs font-semibold ml-1">Pipeline</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Visual Cards View"
              aria-label="Visual Cards View"
            >
              <LayoutGrid size={17} />
              <span className="hide-on-mobile text-xs font-semibold ml-1">Cards</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Data Table View"
              aria-label="Data Table View"
            >
              <List size={17} />
              <span className="hide-on-mobile text-xs font-semibold ml-1">Table</span>
            </button>
          </div>
        </div>

        <div className="filter-status-row">
          <span>
            Displaying <strong>{filteredComplaints.length}</strong> of{' '}
            <strong>{complaints.length}</strong> complaints
            {statusFilter !== 'All' && ` in stage "${statusFilter}"`}
          </span>

          {(applianceFilter !== 'All' || statusFilter !== 'All' || priorityFilter !== 'All' || searchTerm) && (
            <button
              className="btn-text-action text-primary"
              onClick={() => {
                setSearchTerm('');
                setApplianceFilter('All');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: PIPELINE / KANBAN BOARD VIEW */}
      {viewMode === 'pipeline' && (
        <div className="kanban-pipeline-container mt-4">
          {/* Column: Pending */}
          <div className="kanban-column column-pending">
            <div className="kanban-column-header">
              <div className="column-title-row">
                <span className="column-dot bg-amber"></span>
                <span className="column-name">Pending Intake</span>
              </div>
              <span className="column-badge">
                {filteredComplaints.filter((c) => c.status === 'Pending').length}
              </span>
            </div>

            <div className="kanban-card-list">
              {filteredComplaints.filter((c) => c.status === 'Pending').length === 0 ? (
                <div className="kanban-empty">No pending tickets</div>
              ) : (
                filteredComplaints
                  .filter((c) => c.status === 'Pending')
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onOpenModal={() => setSelectedComplaint(item)}
                      onAdvance={() => handleQuickAdvance(item)}
                      nextLabel="Start Diagnostic ➔"
                      getAccent={getApplianceAccent}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Column: Under Inspection */}
          <div className="kanban-column column-inspection">
            <div className="kanban-column-header">
              <div className="column-title-row">
                <span className="column-dot bg-blue"></span>
                <span className="column-name">Under Inspection</span>
              </div>
              <span className="column-badge">
                {filteredComplaints.filter((c) => c.status === 'Under Inspection').length}
              </span>
            </div>

            <div className="kanban-card-list">
              {filteredComplaints.filter((c) => c.status === 'Under Inspection').length === 0 ? (
                <div className="kanban-empty">No tickets under inspection</div>
              ) : (
                filteredComplaints
                  .filter((c) => c.status === 'Under Inspection')
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onOpenModal={() => setSelectedComplaint(item)}
                      onAdvance={() => handleQuickAdvance(item)}
                      nextLabel="Mark Repaired ➔"
                      getAccent={getApplianceAccent}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Column: Repaired */}
          <div className="kanban-column column-repaired">
            <div className="kanban-column-header">
              <div className="column-title-row">
                <span className="column-dot bg-emerald"></span>
                <span className="column-name">Repaired & Tested</span>
              </div>
              <span className="column-badge">
                {filteredComplaints.filter((c) => c.status === 'Repaired').length}
              </span>
            </div>

            <div className="kanban-card-list">
              {filteredComplaints.filter((c) => c.status === 'Repaired').length === 0 ? (
                <div className="kanban-empty">No repaired tickets</div>
              ) : (
                filteredComplaints
                  .filter((c) => c.status === 'Repaired')
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onOpenModal={() => setSelectedComplaint(item)}
                      onAdvance={() => handleQuickAdvance(item)}
                      nextLabel="Mark Delivered ➔"
                      getAccent={getApplianceAccent}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Column: Delivered */}
          <div className="kanban-column column-delivered">
            <div className="kanban-column-header">
              <div className="column-title-row">
                <span className="column-dot bg-slate"></span>
                <span className="column-name">Delivered / Closed</span>
              </div>
              <span className="column-badge">
                {filteredComplaints.filter((c) => c.status === 'Delivered').length}
              </span>
            </div>

            <div className="kanban-card-list">
              {filteredComplaints.filter((c) => c.status === 'Delivered').length === 0 ? (
                <div className="kanban-empty">No delivered tickets</div>
              ) : (
                filteredComplaints
                  .filter((c) => c.status === 'Delivered')
                  .map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onOpenModal={() => setSelectedComplaint(item)}
                      getAccent={getApplianceAccent}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VISUAL PROGRESS CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="complaint-cards-grid mt-4">
          {filteredComplaints.length === 0 ? (
            <div className="card empty-state-card col-span-full">
              <ClipboardList size={40} className="text-muted mb-2" />
              <h3>No complaints found</h3>
              <p className="text-muted text-sm">
                Try clearing or adjusting your search and filter criteria.
              </p>
            </div>
          ) : (
            filteredComplaints.map((item) => {
              const accent = getApplianceAccent(item.applianceType);
              const step = getStepProgress(item.status);

              return (
                <div key={item.id} className={`card complaint-visual-card ${accent.borderClass}`}>
                  {/* Top Bar */}
                  <div className="complaint-card-top">
                    <div className="flex items-center gap-2">
                      <span className="ticket-badge font-mono">{item.id}</span>
                      <span className="text-xs text-muted">{item.serviceType}</span>
                    </div>
                    <PriorityBadge priority={item.priority} />
                  </div>

                  {/* Appliance & Fault Highlight */}
                  <div className="complaint-appliance-row">
                    <div className="app-emoji-box">{accent.emoji}</div>
                    <div>
                      <h4 className="app-title-bold">
                        {item.applianceType} • {item.brand}
                      </h4>
                      <p className="fault-title-amber">{item.issueCategory}</p>
                    </div>
                  </div>

                  {/* Customer line */}
                  <div className="complaint-customer-chip">
                    <span className="text-muted text-xs">Customer:</span>
                    <strong>{item.customerName}</strong>
                    <span className="font-mono text-xs text-muted">({item.customerPhone})</span>
                  </div>

                  {/* Description Preview */}
                  <p className="complaint-desc-snippet">{item.description}</p>

                  {/* 4-Step Visual Progress Bar */}
                  <div className="visual-repair-tracker">
                    <div className="tracker-steps-line">
                      <div
                        className="tracker-progress-fill"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      ></div>
                    </div>
                    <div className="tracker-nodes-row">
                      <div className={`tracker-node ${step >= 1 ? 'completed' : ''}`}>
                        <span className="node-circle">1</span>
                        <span className="node-text">Intake</span>
                      </div>
                      <div className={`tracker-node ${step >= 2 ? 'completed' : ''}`}>
                        <span className="node-circle">2</span>
                        <span className="node-text">Inspection</span>
                      </div>
                      <div className={`tracker-node ${step >= 3 ? 'completed' : ''}`}>
                        <span className="node-circle">3</span>
                        <span className="node-text">Repaired</span>
                      </div>
                      <div className={`tracker-node ${step >= 4 ? 'completed' : ''}`}>
                        <span className="node-circle">4</span>
                        <span className="node-text">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="complaint-card-footer">
                    <div className="status-selector-wrap">
                      <select
                        className="status-dropdown-select"
                        value={item.status}
                        onChange={(e) => updateComplaintStatus(item.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Inspection">Under Inspection</option>
                        <option value="Repaired">Repaired</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => setSelectedComplaint(item)}
                    >
                      <Eye size={14} /> Full Job Card
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 3: STRUCTURED TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="card table-container-card mt-4">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Appliance & Brand</th>
                  <th>Fault Category</th>
                  <th>Priority</th>
                  <th>Stage Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state-cell">
                      No complaints matching your selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td>
                        <span className="ticket-badge">{item.id}</span>
                        <span className="service-mode-hint block text-xs text-muted">
                          {item.serviceType}
                        </span>
                      </td>
                      <td>
                        <div className="date-subtext">{item.registeredDate}</div>
                      </td>
                      <td>
                        <div className="customer-cell-name font-bold">{item.customerName}</div>
                        <div className="customer-cell-phone font-mono">{item.customerPhone}</div>
                      </td>
                      <td>
                        <div className="appliance-cell-type font-semibold text-primary">
                          {item.applianceType === 'Refrigerator' && '❄️ '}
                          {item.applianceType === 'Washing Machine' && '🧺 '}
                          {item.applianceType === 'Microwave Oven' && '⚡ '}
                          {item.applianceType}
                        </div>
                        <div className="text-xs text-muted">Brand: {item.brand}</div>
                      </td>
                      <td>
                        <div className="fault-title font-medium text-amber-800">
                          {item.issueCategory}
                        </div>
                        <p className="fault-desc-clamp text-muted text-xs">{item.description}</p>
                      </td>
                      <td>
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td>
                        <select
                          className="status-dropdown-select"
                          value={item.status}
                          onChange={(e) => updateComplaintStatus(item.id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Under Inspection">Under Inspection</option>
                          <option value="Repaired">Repaired</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => setSelectedComplaint(item)}
                          title="View Full Job Card"
                        >
                          <Eye size={14} /> Job Card
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Card Modal */}
      {selectedComplaint && (
        <JobCardModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

// Kanban Card Component
function KanbanCard({ item, onOpenModal, onAdvance, nextLabel, getAccent }) {
  const accent = getAccent(item.applianceType);

  return (
    <div className={`kanban-card ${accent.borderClass}`}>
      <div className="kanban-card-header">
        <span className="font-mono ticket-badge-sm">{item.id}</span>
        <PriorityBadge priority={item.priority} />
      </div>

      <div className="kanban-appliance-title">
        <span className="mr-1">{accent.emoji}</span>
        <strong>{item.applianceType}</strong>
        <span className="text-muted text-xs ml-1">({item.brand})</span>
      </div>

      <div className="kanban-fault-chip">{item.issueCategory}</div>

      <p className="kanban-desc-clamp">{item.description}</p>

      <div className="kanban-customer-row">
        <span className="cust-mini-name">{item.customerName}</span>
        <span className="cust-mini-phone font-mono">{item.customerPhone}</span>
      </div>

      <div className="kanban-card-actions">
        <button className="btn-link-sm" onClick={onOpenModal}>
          <Eye size={13} /> View
        </button>

        {onAdvance && nextLabel && (
          <button className="btn btn-primary btn-xs" onClick={onAdvance}>
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
