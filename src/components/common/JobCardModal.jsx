import React, { useState } from 'react';
import {
  X,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Tag,
  Wrench,
  AlertTriangle,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { useData } from '../../context/DataContext';

export default function JobCardModal({ complaint, onClose }) {
  const { updateComplaintStatus } = useData();
  const [currentStatus, setCurrentStatus] = useState(complaint?.status || 'Pending');
  const [statusUpdated, setStatusUpdated] = useState(false);

  if (!complaint) return null;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    updateComplaintStatus(complaint.id, newStatus);
    setStatusUpdated(true);
    setTimeout(() => setStatusUpdated(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container printable-jobcard" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="ticket-id-tag">{complaint.id}</span>
            <h2>Appliance Service Job Card</h2>
          </div>
          <div className="modal-actions no-print">
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> Print Job Card
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Shop Header (Visible on screen and print) */}
          <div className="jobcard-shop-banner">
            <div>
              <h3 className="shop-name">Jamal's Appliance Care</h3>
              <p className="shop-sub">Specialized Appliance Fault Diagnostics & Quality Repairs</p>
              <p className="shop-contact">Hotline: +880 1700-000000 | Email: support@jamalappliance.com</p>
            </div>
            <div className="jobcard-meta">
              <div className="meta-row">
                <span className="meta-label">Date:</span>
                <span className="meta-val">{complaint.registeredDate}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Service Type:</span>
                <span className="meta-val badge-soft">{complaint.serviceType}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Est. Inspection:</span>
                <span className="meta-val text-primary font-bold">৳ {complaint.estimatedInspectionFee} BDT</span>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="jobcard-status-bar no-print">
            <div className="status-current">
              <span>Current Status:</span>
              <StatusBadge status={currentStatus} />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <div className="status-update-control">
              <label htmlFor="status-select">Update Status:</label>
              <select
                id="status-select"
                className="form-select form-select-sm"
                value={currentStatus}
                onChange={handleStatusChange}
              >
                <option value="Pending">Pending</option>
                <option value="Under Inspection">Under Inspection</option>
                <option value="Repaired">Repaired</option>
                <option value="Delivered">Delivered</option>
              </select>
              {statusUpdated && (
                <span className="text-success text-sm flex items-center gap-1">
                  <CheckCircle size={14} /> Saved
                </span>
              )}
            </div>
          </div>

          <div className="jobcard-grid">
            {/* Customer Details Box */}
            <div className="jobcard-section">
              <h4 className="section-title">
                <User size={16} /> Customer Information
              </h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Customer ID</span>
                  <span className="info-value font-mono">{complaint.customerId}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value font-semibold">{complaint.customerName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{complaint.customerPhone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{complaint.customerEmail || 'Not Provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">{complaint.customerAddress}</span>
                </div>
              </div>
            </div>

            {/* Appliance Details Box */}
            <div className="jobcard-section">
              <h4 className="section-title">
                <Wrench size={16} /> Appliance Specification
              </h4>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Appliance Type</span>
                  <span className="info-value text-primary font-bold">{complaint.applianceType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Brand</span>
                  <span className="info-value">{complaint.brand || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Model Number</span>
                  <span className="info-value font-mono">{complaint.modelNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Serial Number</span>
                  <span className="info-value font-mono">{complaint.serialNumber || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fault Category</span>
                  <span className="info-value text-amber-700 font-semibold">{complaint.issueCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Issue & Complaint Description */}
          <div className="jobcard-section full-width">
            <h4 className="section-title">
              <AlertTriangle size={16} /> Customer Complaint & Symptoms Description
            </h4>
            <div className="complaint-desc-box">
              <p>{complaint.description}</p>
            </div>
          </div>

          {/* Technician Notes */}
          <div className="jobcard-section full-width">
            <h4 className="section-title">
              <FileText size={16} /> Technician Diagnostic Log & Notes
            </h4>
            <div className="technician-notes-box">
              <p>{complaint.technicianNotes || 'Initial diagnostic scheduled upon technician intake.'}</p>
            </div>
          </div>

          {/* Signatures for Print */}
          <div className="jobcard-signatures print-only">
            <div className="signature-box">
              <div className="sig-line"></div>
              <span>Customer Signature</span>
            </div>
            <div className="signature-box">
              <div className="sig-line"></div>
              <span>Service Technician Signature</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
