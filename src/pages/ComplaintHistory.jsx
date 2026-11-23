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
  CheckCircle,
  Clock,
  Printer
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

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter complaints
  const filteredComplaints = complaints.filter((item) => {
    // 1. Search term (Ticket ID, Customer Name, Phone, Brand, Description)
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const match =
        item.id.toLowerCase().includes(term) ||
        item.customerName.toLowerCase().includes(term) ||
        item.customerPhone.includes(term) ||
        item.applianceType.toLowerCase().includes(term) ||
        (item.brand && item.brand.toLowerCase().includes(term)) ||
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

  return (
    <div className="page-container complaints-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaint History & Status Tracking</h1>
          <p className="page-subtitle">
            Comprehensive audit log of all reported appliance faults, repair stages, and service tickets.
          </p>
        </div>
        <Link to="/new-complaint" className="btn btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          <span>Register New Complaint</span>
        </Link>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="card filter-card">
        <div className="filters-grid">
          {/* Search box */}
          <div className="filter-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by ticket ID, customer name, phone, or issue..."
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

          {/* Appliance Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Appliance Type:</label>
            <select
              className="form-select form-select-sm"
              value={applianceFilter}
              onChange={(e) => setApplianceFilter(e.target.value)}
            >
              <option value="All">All Appliances</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Washing Machine">Washing Machine</option>
              <option value="Microwave Oven">Microwave Oven</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Stage Status:</label>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Inspection">Under Inspection</option>
              <option value="Repaired">Repaired</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-select-group">
            <label className="filter-label">Priority:</label>
            <select
              className="form-select form-select-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="filter-status-row">
          <span>
            Displaying <strong>{filteredComplaints.length}</strong> of{' '}
            <strong>{complaints.length}</strong> complaints
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

      {/* Complaints Table */}
      <div className="card table-container-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Registration Date</th>
                <th>Customer</th>
                <th>Appliance & Brand</th>
                <th>Fault Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
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
                        {item.applianceType}
                      </div>
                      <div className="text-xs text-muted">
                        Brand: {item.brand} {item.modelNumber !== 'N/A' && `• ${item.modelNumber}`}
                      </div>
                    </td>
                    <td>
                      <div className="fault-title font-medium text-amber-800">{item.issueCategory}</div>
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
