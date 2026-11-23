import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ClipboardList
} from 'lucide-react';
import { useData } from '../context/DataContext';
import JobCardModal from '../components/common/JobCardModal';

export default function CustomerRecords() {
  const { customers, complaints } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inspectedComplaint, setInspectedComplaint] = useState(null);

  // Filter customers by search term
  const filteredCustomers = customers.filter((cust) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      cust.fullName.toLowerCase().includes(term) ||
      cust.phone.includes(term) ||
      cust.address.toLowerCase().includes(term) ||
      cust.id.toLowerCase().includes(term) ||
      (cust.email && cust.email.toLowerCase().includes(term))
    );
  });

  // Get complaints for a specific customer
  const getCustomerComplaints = (customerId) => {
    return complaints.filter((c) => c.customerId === customerId);
  };

  return (
    <div className="page-container customers-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Records Directory</h1>
          <p className="page-subtitle">
            Search, inspect registered profiles, and review repair history per customer.
          </p>
        </div>
        <Link to="/new-complaint" className="btn btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Register New Customer</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-card">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, phone (017...), address, or Customer ID..."
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
        <div className="filter-stats-text">
          Showing <strong>{filteredCustomers.length}</strong> of{' '}
          <strong>{customers.length}</strong> total customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="card table-container-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Contact Phone</th>
                <th>Address</th>
                <th>Registration Date</th>
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
                        <div className="date-subtext">{cust.registeredDate}</div>
                      </td>
                      <td>
                        <span className="badge-count-pill">
                          {customerTickets.length} Ticket{customerTickets.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => setSelectedCustomer(cust)}
                        >
                          <ClipboardList size={14} /> View History
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="profile-main-info">
                  <h3 className="profile-name">{selectedCustomer.fullName}</h3>
                  <div className="profile-meta-list">
                    <span>
                      <Phone size={14} className="inline mr-1 text-primary" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.email && (
                      <span>
                        <Mail size={14} className="inline mr-1 text-muted" />
                        {selectedCustomer.email}
                      </span>
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
                  <ClipboardList size={16} /> Linked Service Complaint Tickets
                </h4>

                {getCustomerComplaints(selectedCustomer.id).length === 0 ? (
                  <p className="text-muted py-4 text-center">No complaints recorded yet.</p>
                ) : (
                  <div className="tickets-list">
                    {getCustomerComplaints(selectedCustomer.id).map((t) => (
                      <div key={t.id} className="ticket-mini-card">
                        <div className="ticket-mini-header">
                          <span className="ticket-id-bold font-mono">{t.id}</span>
                          <span className="appliance-tag">{t.applianceType}</span>
                          <span className="status-soft-tag">{t.status}</span>
                        </div>
                        <div className="ticket-mini-body">
                          <p className="fault-label">
                            <strong>Issue:</strong> {t.issueCategory}
                          </p>
                          <p className="desc-preview">{t.description}</p>
                          <div className="ticket-mini-footer">
                            <span className="date-hint">{t.registeredDate}</span>
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
