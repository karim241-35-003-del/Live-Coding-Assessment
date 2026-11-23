import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Refrigerator,
  WashingMachine,
  Microwave,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCircle,
  ChevronRight,
  PhoneCall,
  MapPin,
  Calendar
} from 'lucide-react';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import JobCardModal from '../components/common/JobCardModal';

export default function Dashboard() {
  const { stats, complaints, customers } = useData();
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Recent complaints (latest 5)
  const recentComplaints = complaints.slice(0, 5);
  // Latest registered customers (latest 4)
  const latestCustomers = customers.slice(0, 4);

  // Compute percentages for appliance statistics
  const total = stats.totalComplaints || 1;
  const fridgePct = Math.round((stats.refrigeratorComplaints / total) * 100);
  const washerPct = Math.round((stats.washingMachineComplaints / total) * 100);
  const microwavePct = Math.round((stats.microwaveComplaints / total) * 100);

  return (
    <div className="page-container dashboard-page">
      {/* Page Title & Quick Action */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Operations Dashboard</h1>
          <p className="page-subtitle">
            Real-time overview of customer registrations, appliance intake, and diagnostics.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/new-complaint" className="btn btn-primary flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Register New Complaint</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          subtitle="Registered customer base"
          icon={Users}
          colorTheme="blue"
          trend="+ Active"
        />

        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          subtitle={`${stats.pendingComplaints} Pending • ${stats.inProgressComplaints} In Progress`}
          icon={ClipboardList}
          colorTheme="indigo"
          trend="All Time"
        />

        <StatCard
          title="Refrigerator"
          value={stats.refrigeratorComplaints}
          subtitle="Cooling & seal diagnostics"
          icon={Refrigerator}
          colorTheme="cyan"
          trend={`${fridgePct}% volume`}
        />

        <StatCard
          title="Washing Machine"
          value={stats.washingMachineComplaints}
          subtitle="Drum, motor & drain issues"
          icon={WashingMachine}
          colorTheme="emerald"
          trend={`${washerPct}% volume`}
        />

        <StatCard
          title="Microwave Oven"
          value={stats.microwaveComplaints}
          subtitle="Magnetron & keypad repairs"
          icon={Microwave}
          colorTheme="amber"
          trend={`${microwavePct}% volume`}
        />
      </div>

      {/* Appliance Distribution Bar */}
      <div className="card breakdown-card">
        <div className="breakdown-header">
          <div>
            <h3 className="section-heading">Appliance Intake Distribution</h3>
            <span className="section-subtext">Breakdown by current complaint volume</span>
          </div>
          <div className="breakdown-badges">
            <span className="legend-item">
              <span className="legend-dot bg-cyan"></span> Refrigerator ({stats.refrigeratorComplaints})
            </span>
            <span className="legend-item">
              <span className="legend-dot bg-emerald"></span> Washing Machine ({stats.washingMachineComplaints})
            </span>
            <span className="legend-item">
              <span className="legend-dot bg-amber"></span> Microwave ({stats.microwaveComplaints})
            </span>
          </div>
        </div>

        <div className="progress-stacked">
          <div
            className="progress-bar bar-cyan"
            style={{ width: `${fridgePct}%` }}
            title={`Refrigerator: ${fridgePct}%`}
          >
            {fridgePct > 10 && `${fridgePct}%`}
          </div>
          <div
            className="progress-bar bar-emerald"
            style={{ width: `${washerPct}%` }}
            title={`Washing Machine: ${washerPct}%`}
          >
            {washerPct > 10 && `${washerPct}%`}
          </div>
          <div
            className="progress-bar bar-amber"
            style={{ width: `${microwavePct}%` }}
            title={`Microwave Oven: ${microwavePct}%`}
          >
            {microwavePct > 10 && `${microwavePct}%`}
          </div>
        </div>
      </div>

      {/* Dashboard Main Columns: Recent Complaints + Latest Customers */}
      <div className="dashboard-columns-grid">
        {/* Recent Complaints Table */}
        <div className="card dashboard-table-card">
          <div className="card-header-row">
            <div>
              <h3 className="section-heading">Recent Customer Complaints</h3>
              <span className="section-subtext">Latest registered fault tickets</span>
            </div>
            <Link to="/complaints" className="card-header-link">
              <span>View All Complaints</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Customer</th>
                  <th>Appliance</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state-cell">
                      No complaints registered yet.
                    </td>
                  </tr>
                ) : (
                  recentComplaints.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td>
                        <span className="ticket-badge">{item.id}</span>
                        <div className="date-subtext">{item.registeredDate}</div>
                      </td>
                      <td>
                        <div className="customer-cell-name">{item.customerName}</div>
                        <div className="customer-cell-phone">{item.customerPhone}</div>
                      </td>
                      <td>
                        <div className="appliance-cell-type">{item.applianceType}</div>
                        <div className="appliance-cell-fault">{item.issueCategory}</div>
                      </td>
                      <td>
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => setSelectedComplaint(item)}
                          title="Inspect Job Card"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Registered Customers Column */}
        <div className="card dashboard-side-card">
          <div className="card-header-row">
            <div>
              <h3 className="section-heading">Recent Customers</h3>
              <span className="section-subtext">Newly onboarded profiles</span>
            </div>
            <Link to="/customers" className="card-header-link">
              <span>All ({customers.length})</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="customer-activity-list">
            {latestCustomers.map((cust) => (
              <div key={cust.id} className="customer-activity-item">
                <div className="customer-avatar-small">
                  {cust.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="customer-info-col">
                  <div className="customer-name-row">
                    <span className="cust-title">{cust.fullName}</span>
                    <span className="cust-tag font-mono">{cust.id}</span>
                  </div>
                  <div className="cust-meta-row">
                    <span className="meta-icon-text">
                      <PhoneCall size={12} /> {cust.phone}
                    </span>
                  </div>
                  <div className="cust-meta-row text-truncate">
                    <span className="meta-icon-text">
                      <MapPin size={12} /> {cust.address}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-bottom-action">
            <Link to="/new-complaint" className="btn btn-outline btn-block btn-sm">
              <PlusCircle size={15} /> Add New Customer & Ticket
            </Link>
          </div>
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
