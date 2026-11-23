import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  ArrowRight,
  Wrench,
  Refrigerator,
  WashingMachine,
  Microwave
} from 'lucide-react';
import { useData } from '../context/DataContext';
import JobCardModal from '../components/common/JobCardModal';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';

export default function CustomerRecords() {
  const { customers, complaints } = useData();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, ACTIVE_REPAIRS, REPEAT
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inspectedComplaint, setInspectedComplaint] = useState(null);

  // Helper: Get complaints for a specific customer
  const getCustomerComplaints = (customerId) => {
    return complaints.filter((c) => c.customerId === customerId);
  };

  // Helper: Get appliance icons/badges for a customer
  const getCustomerAppliances = (customerId) => {
    const custComplaints = getCustomerComplaints(customerId);
    const types = [...new Set(custComplaints.map((c) => c.applianceType))];
    return types;
  };

  // Check if customer has an ongoing repair (Pending or Under Inspection)
  const hasActiveRepair = (customerId) => {
    const custComplaints = getCustomerComplaints(customerId);
    return custComplaints.some(
      (c) => c.status === 'Pending' || c.status === 'Under Inspection'
    );
  };

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    // 1. Search query
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const match =
        cust.fullName.toLowerCase().includes(term) ||
        cust.phone.includes(term) ||
        cust.address.toLowerCase().includes(term) ||
        cust.id.toLowerCase().includes(term) ||
        (cust.email && cust.email.toLowerCase().includes(term));
      if (!match) return false;
    }

    // 2. Filter chip
    if (filterType === 'ACTIVE_REPAIRS') {
      return hasActiveRepair(cust.id);
    }
    if (filterType === 'REPEAT') {
      const count = getCustomerComplaints(cust.id).length;
      return count >= 2;
    }

    return true;
  });

  // KPI metrics
  const totalCustomers = customers.length;
  const customersWithActiveTickets = customers.filter((c) => hasActiveRepair(c.id)).length;
  const repeatCustomersCount = customers.filter(
    (c) => getCustomerComplaints(c.id).length >= 2
  ).length;

  const handleRegisterNewTicketForCustomer = (customer) => {
    navigate('/new-complaint', {
      state: {
        prefillCustomer: {
          customerName: customer.fullName,
          customerPhone: customer.phone,
          customerEmail: customer.email || '',
          customerAddress: customer.address
        }
      }
    });
  };

  return (
    <div className="page-container customers-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Records Directory</h1>
          <p className="page-subtitle">
            Visual profiles, contact directory, and repair history per customer.
          </p>
        </div>
        <Link to="/new-complaint" className="btn btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Register New Customer</span>
        </Link>
      </div>

      {/* Graphical KPI Metric Cards */}
      <div className="customer-kpi-grid">
        <div className="kpi-mini-card">
          <div className="kpi-icon-box bg-blue-soft">
            <Users size={22} className="text-primary" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Total Customers</span>
            <span className="kpi-value">{totalCustomers}</span>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-box bg-amber-soft">
            <Clock size={22} className="text-amber-600" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Active Repairs In Progress</span>
            <span className="kpi-value">{customersWithActiveTickets}</span>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-box bg-emerald-soft">
            <Sparkles size={22} className="text-emerald-600" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Repeat Customers</span>
            <span className="kpi-value">{repeatCustomersCount}</span>
          </div>
        </div>
      </div>

      {/* Search and Interactive Filter Bar */}
      <div className="card filter-card mt-4">
        <div className="customer-toolbar-row">
          {/* Search box */}
          <div className="search-bar-wrapper flex-1">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, phone (017...), address, or ID..."
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

          {/* Quick Filter Pills */}
          <div className="filter-pill-tabs">
            <button
              className={`filter-tab-pill ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              All ({totalCustomers})
            </button>
            <button
              className={`filter-tab-pill ${filterType === 'ACTIVE_REPAIRS' ? 'active' : ''}`}
              onClick={() => setFilterType('ACTIVE_REPAIRS')}
            >
              Active Repairs ({customersWithActiveTickets})
            </button>
            <button
              className={`filter-tab-pill ${filterType === 'REPEAT' ? 'active' : ''}`}
              onClick={() => setFilterType('REPEAT')}
            >
              Repeat (2+) ({repeatCustomersCount})
            </button>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              aria-label="Card Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
              aria-label="Table View"
            >
              <List size={17} />
            </button>
          </div>
        </div>

        <div className="filter-status-row">
          <span>
            Showing <strong>{filteredCustomers.length}</strong> of{' '}
            <strong>{customers.length}</strong> customer records
          </span>
          {(searchTerm || filterType !== 'ALL') && (
            <button
              className="btn-text-action text-primary"
              onClick={() => {
                setSearchTerm('');
                setFilterType('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: GRAPHICAL CARD GRID */}
      {viewMode === 'grid' && (
        <div className="customer-cards-grid mt-4">
          {filteredCustomers.length === 0 ? (
            <div className="card empty-state-card col-span-full">
              <Users size={40} className="text-muted mb-2" />
              <h3>No matching customer records</h3>
              <p className="text-muted text-sm">
                Try refining your search keyword or clearing filter pills.
              </p>
            </div>
          ) : (
            filteredCustomers.map((cust) => {
              const customerTickets = getCustomerComplaints(cust.id);
              const appliances = getCustomerAppliances(cust.id);
              const isActive = hasActiveRepair(cust.id);

              return (
                <div key={cust.id} className="card customer-visual-card">
                  {/* Card Header */}
                  <div className="cust-card-top">
                    <div className="cust-avatar-ring">
                      <div className="cust-avatar-inner">
                        {cust.fullName.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="cust-identity-col">
                      <div className="cust-id-row">
                        <span className="font-mono cust-id-pill">{cust.id}</span>
                        {isActive && (
                          <span className="active-repair-tag">
                            <span className="pulse-dot"></span> In Repair
                          </span>
                        )}
                      </div>
                      <h3 className="cust-name-title">{cust.fullName}</h3>
                      <span className="cust-date-label">
                        Joined {cust.registeredDate.split(',')[0] || cust.registeredDate}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info Box */}
                  <div className="cust-contact-box">
                    <a
                      href={`tel:${cust.phone}`}
                      className="contact-pill-link"
                      title="Call customer"
                    >
                      <PhoneCall size={13} className="text-primary flex-shrink-0" />
                      <span className="font-mono">{cust.phone}</span>
                    </a>

                    {cust.email && (
                      <a
                        href={`mailto:${cust.email}`}
                        className="contact-pill-link text-truncate"
                        title={cust.email}
                      >
                        <Mail size={13} className="text-muted flex-shrink-0" />
                        <span className="text-truncate">{cust.email}</span>
                      </a>
                    )}

                    <div className="contact-address-row">
                      <MapPin size={13} className="text-muted flex-shrink-0 mt-0.5" />
                      <span className="address-text">{cust.address}</span>
                    </div>
                  </div>

                  {/* Appliance Serviced Badges */}
                  <div className="cust-appliances-section">
                    <span className="micro-label">Serviced Appliances:</span>
                    <div className="appliance-chips-wrap">
                      {appliances.length === 0 ? (
                        <span className="text-xs text-muted">No repair history</span>
                      ) : (
                        appliances.map((app) => (
                          <span key={app} className="appliance-micro-badge">
                            {app === 'Refrigerator' && '❄️'}
                            {app === 'Washing Machine' && '🧺'}
                            {app === 'Microwave Oven' && '⚡'}
                            <span>{app}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="cust-card-footer">
                    <div className="ticket-counter-badge">
                      <strong>{customerTickets.length}</strong>{' '}
                      {customerTickets.length === 1 ? 'Complaint' : 'Complaints'}
                    </div>

                    <div className="footer-action-buttons">
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => setSelectedCustomer(cust)}
                        title="View Full Profile & Linked Tickets"
                      >
                        <ClipboardList size={14} /> Profile
                      </button>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => handleRegisterNewTicketForCustomer(cust)}
                        title="Register New Complaint for this Customer"
                      >
                        <PlusCircle size={14} /> New Ticket
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: STRUCTURED TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="card table-container-card mt-4">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Full Name</th>
                  <th>Contact Phone</th>
                  <th>Address</th>
                  <th>Appliance Tags</th>
                  <th>Total Complaints</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state-cell">
                      No matching customer records found for "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const customerTickets = getCustomerComplaints(cust.id);
                    const appliances = getCustomerAppliances(cust.id);
                    return (
                      <tr key={cust.id} className="table-row-hover">
                        <td>
                          <span className="font-mono cust-id-pill">{cust.id}</span>
                        </td>
                        <td>
                          <div className="customer-cell-name font-bold">{cust.fullName}</div>
                          {cust.email && (
                            <div className="text-muted text-xs flex items-center gap-1">
                              <Mail size={11} /> {cust.email}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="phone-cell flex items-center gap-1 font-mono">
                            <Phone size={13} className="text-primary" /> {cust.phone}
                          </div>
                        </td>
                        <td>
                          <div className="address-cell flex items-center gap-1 text-sm max-w-xs">
                            <MapPin size={13} className="text-muted flex-shrink-0" />
                            <span className="text-truncate">{cust.address}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {appliances.map((app) => (
                              <span key={app} className="appliance-micro-badge">
                                {app === 'Refrigerator' && '❄️'}
                                {app === 'Washing Machine' && '🧺'}
                                {app === 'Microwave Oven' && '⚡'}
                                <span>{app}</span>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="badge-count-pill">
                            {customerTickets.length} Ticket{customerTickets.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => setSelectedCustomer(cust)}
                              title="Inspect Customer History"
                            >
                              <ClipboardList size={14} /> Profile
                            </button>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() => handleRegisterNewTicketForCustomer(cust)}
                              title="Register New Complaint"
                            >
                              <PlusCircle size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="ticket-id-tag">{selectedCustomer.id}</span>
                <h2>Customer Service Profile</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Profile Card Summary */}
              <div className="customer-profile-banner">
                <div className="profile-avatar-large">
                  {selectedCustomer.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="profile-main-info flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="profile-name">{selectedCustomer.fullName}</h3>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => {
                        handleRegisterNewTicketForCustomer(selectedCustomer);
                        setSelectedCustomer(null);
                      }}
                    >
                      <PlusCircle size={14} /> Log New Ticket
                    </button>
                  </div>
                  <div className="profile-meta-list">
                    <a href={`tel:${selectedCustomer.phone}`} className="meta-link">
                      <Phone size={14} className="inline mr-1 text-primary" />
                      {selectedCustomer.phone}
                    </a>
                    {selectedCustomer.email && (
                      <a href={`mailto:${selectedCustomer.email}`} className="meta-link">
                        <Mail size={14} className="inline mr-1 text-muted" />
                        {selectedCustomer.email}
                      </a>
                    )}
                    <span>
                      <MapPin size={14} className="inline mr-1 text-muted" />
                      {selectedCustomer.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linked Service Complaints List */}
              <div className="customer-tickets-section">
                <h4 className="section-title">
                  <ClipboardList size={16} /> Service Complaint History (
                  {getCustomerComplaints(selectedCustomer.id).length})
                </h4>

                {getCustomerComplaints(selectedCustomer.id).length === 0 ? (
                  <p className="text-muted py-4 text-center">No complaints recorded yet.</p>
                ) : (
                  <div className="tickets-list">
                    {getCustomerComplaints(selectedCustomer.id).map((t) => (
                      <div key={t.id} className="ticket-mini-card">
                        <div className="ticket-mini-header">
                          <span className="ticket-id-bold font-mono">{t.id}</span>
                          <span className="appliance-tag font-bold text-primary">
                            {t.applianceType === 'Refrigerator' && '❄️ '}
                            {t.applianceType === 'Washing Machine' && '🧺 '}
                            {t.applianceType === 'Microwave Oven' && '⚡ '}
                            {t.applianceType}
                          </span>
                          <StatusBadge status={t.status} />
                          <PriorityBadge priority={t.priority} />
                        </div>
                        <div className="ticket-mini-body">
                          <p className="fault-label">
                            <strong>Fault:</strong> {t.issueCategory}
                          </p>
                          <p className="desc-preview">{t.description}</p>
                          <div className="ticket-mini-footer">
                            <span className="date-hint">
                              <Calendar size={12} className="inline mr-1" />
                              {t.registeredDate}
                            </span>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() => setInspectedComplaint(t)}
                            >
                              Open Job Card
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedCustomer(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Job Card nested modal */}
      {inspectedComplaint && (
        <JobCardModal
          complaint={inspectedComplaint}
          onClose={() => setInspectedComplaint(null)}
        />
      )}
    </div>
  );
}
