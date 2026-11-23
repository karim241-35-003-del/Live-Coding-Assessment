import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Tag,
  ArrowRight,
  RotateCcw,
  Clock,
  Printer,
  FileCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ApplianceCardSelector from '../components/forms/ApplianceCardSelector';
import { APPLIANCE_TYPES } from '../data/mockData';
import JobCardModal from '../components/common/JobCardModal';

export default function NewComplaint() {
  const { registerComplaint, customers } = useData();
  const navigate = useNavigate();

  // Current live formatted registration timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimestamp(
        now.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    applianceType: 'Refrigerator',
    brand: 'Walton',
    customBrand: '',
    modelNumber: '',
    serialNumber: '',
    issueCategory: 'Not Cooling',
    customIssue: '',
    description: '',
    priority: 'Medium',
    serviceType: 'Home Visit'
  });

  const [errors, setErrors] = useState({});
  const [createdResult, setCreatedResult] = useState(null);
  const [showJobCardModal, setShowJobCardModal] = useState(false);

  // Selected appliance object definition
  const currentAppliance =
    APPLIANCE_TYPES.find((a) => a.id === formData.applianceType) || APPLIANCE_TYPES[0];

  // Auto-switch fault categories when appliance type changes
  const handleApplianceSelect = (typeId) => {
    const appDef = APPLIANCE_TYPES.find((a) => a.id === typeId);
    setFormData((prev) => ({
      ...prev,
      applianceType: typeId,
      brand: appDef ? appDef.popularBrands[0] : 'Generic',
      issueCategory: appDef && appDef.commonFaults.length ? appDef.commonFaults[0] : 'Other Issue'
    }));
  };

  // Lookup existing customer when typing phone number
  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setFormData((prev) => ({ ...prev, customerPhone: inputPhone }));

    if (errors.customerPhone) {
      setErrors((prev) => ({ ...prev, customerPhone: null }));
    }

    // Auto-fill customer if already in records
    const cleanPhone = inputPhone.trim();
    if (cleanPhone.length >= 11) {
      const found = customers.find((c) => c.phone.trim() === cleanPhone);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          customerName: found.fullName,
          customerEmail: found.email || '',
          customerAddress: found.address
        }));
      }
    }
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Customer Full Name: Required
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer Full Name is required';
    } else if (formData.customerName.trim().length < 3) {
      newErrors.customerName = 'Name must be at least 3 characters long';
    }

    // 2. Phone Number: Required, Bangladesh Format 01XXXXXXXXX (11 digits starting with 013-019)
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    const cleanPhone = formData.customerPhone.trim();
    if (!cleanPhone) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!bdPhoneRegex.test(cleanPhone)) {
      newErrors.customerPhone =
        'Please enter a valid Bangladesh phone number (11 digits, e.g. 01712345678)';
    }

    // 3. Email: Optional, but if provided must be valid format
    if (formData.customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail.trim())) {
        newErrors.customerEmail = 'Please enter a valid email address (or leave empty)';
      }
    }

    // 4. Customer Address: Required
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Customer service/pickup address is required';
    } else if (formData.customerAddress.trim().length < 5) {
      newErrors.customerAddress = 'Please provide a complete address';
    }

    // 5. Appliance Brand
    const finalBrand = formData.brand === 'Other' ? formData.customBrand : formData.brand;
    if (!finalBrand || !finalBrand.trim()) {
      newErrors.brand = 'Please specify appliance brand';
    }

    // 6. Complaint Description: Required
    if (!formData.description.trim()) {
      newErrors.description = 'Please describe the fault or complaint symptoms';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters for proper diagnosis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    const finalBrand = formData.brand === 'Other' ? formData.customBrand.trim() : formData.brand;
    const finalIssue =
      formData.issueCategory === 'Other' ? formData.customIssue.trim() : formData.issueCategory;

    const payload = {
      ...formData,
      brand: finalBrand,
      issueCategory: finalIssue || 'General Fault'
    };

    const result = registerComplaint(payload);
    setCreatedResult(result);
  };

  const handleResetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      applianceType: 'Refrigerator',
      brand: 'Walton',
      customBrand: '',
      modelNumber: '',
      serialNumber: '',
      issueCategory: 'Not Cooling',
      customIssue: '',
      description: '',
      priority: 'Medium',
      serviceType: 'Home Visit'
    });
    setErrors({});
    setCreatedResult(null);
  };

  return (
    <div className="page-container new-complaint-page">
      {/* Page Title */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer & Complaint Registration</h1>
          <p className="page-subtitle">
            Collect customer contact details, diagnose appliance category, and log service tickets.
          </p>
        </div>
        <div className="live-clock-badge">
          <Calendar size={15} />
          <span>Intake Date: {currentTimestamp}</span>
        </div>
      </div>

      {/* Success Notification Banner when ticket is logged */}
      {createdResult && (
        <div className="card registration-success-card">
          <div className="success-banner-content">
            <div className="success-icon-badge">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h2 className="success-title">Service Complaint Registered Successfully!</h2>
              <p className="success-desc">
                Ticket <strong className="font-mono text-primary">{createdResult.complaintId}</strong> generated for customer{' '}
                <strong>{createdResult.complaint.customerName}</strong>.
              </p>
              <div className="success-meta-pills">
                <span className="meta-pill">Customer ID: {createdResult.customerId}</span>
                <span className="meta-pill">Appliance: {createdResult.complaint.applianceType}</span>
                <span className="meta-pill">Priority: {createdResult.complaint.priority}</span>
              </div>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setShowJobCardModal(true)}
            >
              <Printer size={16} /> View & Print Job Card
            </button>
            <button
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => navigate('/complaints')}
            >
              <FileCheck size={16} /> View in Complaints List
            </button>
            <button className="btn btn-outline" onClick={handleResetForm}>
              <RotateCcw size={15} /> Register Another Ticket
            </button>
          </div>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="complaint-form" noValidate>
        {/* SECTION 1: Customer Information */}
        <div className="form-card card">
          <div className="form-card-header">
            <div className="section-number-pill">1</div>
            <div>
              <h3 className="section-heading">Customer Information Collection</h3>
              <p className="section-subtext">
                Enter customer contact and residential details for field service or shop updates
              </p>
            </div>
          </div>

          <div className="form-grid-two">
            {/* Customer Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="cust-name">
                Customer Full Name <span className="text-danger">*</span>
              </label>
              <div className={`input-icon-wrapper ${errors.customerName ? 'has-error' : ''}`}>
                <User className="input-icon" size={18} />
                <input
                  id="cust-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tanvir Ahmed"
                  value={formData.customerName}
                  onChange={(e) => {
                    setFormData({ ...formData, customerName: e.target.value });
                    if (errors.customerName) setErrors({ ...errors, customerName: null });
                  }}
                  required
                />
              </div>
              {errors.customerName && (
                <span className="field-error-msg">{errors.customerName}</span>
              )}
            </div>

            {/* Phone Number (Bangladesh format) */}
            <div className="form-group">
              <label className="form-label" htmlFor="cust-phone">
                Phone Number (Bangladesh 01XXXXXXXXX) <span className="text-danger">*</span>
              </label>
              <div className={`input-icon-wrapper ${errors.customerPhone ? 'has-error' : ''}`}>
                <Phone className="input-icon" size={18} />
                <input
                  id="cust-phone"
                  type="tel"
                  className="form-input"
                  placeholder="017XXXXXXXX / 018XXXXXXXX"
                  value={formData.customerPhone}
                  onChange={handlePhoneChange}
                  maxLength={11}
                  required
                />
              </div>
              {errors.customerPhone ? (
                <span className="field-error-msg">{errors.customerPhone}</span>
              ) : (
                <span className="field-hint">
                  Existing customer auto-fills when entering registered 11-digit mobile number.
                </span>
              )}
            </div>

            {/* Email Address (Optional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="cust-email">
                Email Address <span className="optional-tag">(Optional)</span>
              </label>
              <div className={`input-icon-wrapper ${errors.customerEmail ? 'has-error' : ''}`}>
                <Mail className="input-icon" size={18} />
                <input
                  id="cust-email"
                  type="email"
                  className="form-input"
                  placeholder="e.g. customer@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, customerEmail: e.target.value });
                    if (errors.customerEmail) setErrors({ ...errors, customerEmail: null });
                  }}
                />
              </div>
              {errors.customerEmail && (
                <span className="field-error-msg">{errors.customerEmail}</span>
              )}
            </div>

            {/* Automatically Generated Registration Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="cust-date">
                Registration Timestamp <span className="badge-auto">Auto-Generated</span>
              </label>
              <div className="input-icon-wrapper readonly-wrapper">
                <Clock className="input-icon text-muted" size={18} />
                <input
                  id="cust-date"
                  type="text"
                  className="form-input readonly-input"
                  value={currentTimestamp}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Customer Address (Full Width) */}
            <div className="form-group full-grid-width">
              <label className="form-label" htmlFor="cust-address">
                Customer Service / Residential Address <span className="text-danger">*</span>
              </label>
              <div className={`input-icon-wrapper ${errors.customerAddress ? 'has-error' : ''}`}>
                <MapPin className="input-icon textarea-icon" size={18} />
                <textarea
                  id="cust-address"
                  rows={2}
                  className="form-input form-textarea"
                  placeholder="e.g. House 14, Road 5, Block B, Mirpur-10, Dhaka"
                  value={formData.customerAddress}
                  onChange={(e) => {
                    setFormData({ ...formData, customerAddress: e.target.value });
                    if (errors.customerAddress) setErrors({ ...errors, customerAddress: null });
                  }}
                  required
                />
              </div>
              {errors.customerAddress && (
                <span className="field-error-msg">{errors.customerAddress}</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Appliance Selection (Interactive Cards) */}
        <div className="form-card card">
          <div className="form-card-header">
            <div className="section-number-pill">2</div>
            <div>
              <h3 className="section-heading">Appliance Information</h3>
              <p className="section-subtext">
                Select the faulty appliance category and technical hardware specifications
              </p>
            </div>
          </div>

          {/* Interactive Selectable Cards */}
          <ApplianceCardSelector
            selectedType={formData.applianceType}
            onSelect={handleApplianceSelect}
          />

          {/* Appliance Brand & Identification Grid */}
          <div className="form-grid-three mt-6">
            {/* Brand Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Appliance Brand <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={formData.brand}
                onChange={(e) => {
                  setFormData({ ...formData, brand: e.target.value });
                  if (errors.brand) setErrors({ ...errors, brand: null });
                }}
              >
                {currentAppliance.popularBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="Other">Other / Unlisted Brand</option>
              </select>
            </div>

            {/* Custom brand input if Other */}
            {formData.brand === 'Other' && (
              <div className="form-group">
                <label className="form-label">Specify Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter brand name"
                  value={formData.customBrand}
                  onChange={(e) => setFormData({ ...formData, customBrand: e.target.value })}
                />
              </div>
            )}

            {/* Model Number */}
            <div className="form-group">
              <label className="form-label">
                Model Number <span className="optional-tag">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. WFD-1B6 or Front-Load 7Kg"
                value={formData.modelNumber}
                onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
              />
            </div>

            {/* Serial Number */}
            <div className="form-group">
              <label className="form-label">
                Serial / Tag Number <span className="optional-tag">(Optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. WAL-RF-2024-X"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Complaint Symptoms & Logistics */}
        <div className="form-card card">
          <div className="form-card-header">
            <div className="section-number-pill">3</div>
            <div>
              <h3 className="section-heading">Complaint Details & Service Logistics</h3>
              <p className="section-subtext">
                Record exact fault symptoms reported by customer and urgency level
              </p>
            </div>
          </div>

          <div className="form-grid-two">
            {/* Fault Category Selection */}
            <div className="form-group">
              <label className="form-label">Primary Fault Category</label>
              <select
                className="form-select"
                value={formData.issueCategory}
                onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
              >
                {currentAppliance.commonFaults.map((fault) => (
                  <option key={fault} value={fault}>
                    {fault}
                  </option>
                ))}
                <option value="Other">Other Specific Issue</option>
              </select>
            </div>

            {/* Urgency / Priority */}
            <div className="form-group">
              <label className="form-label">Urgency / Priority Level</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Low - Routine inspection / Non-critical</option>
                <option value="Medium">Medium - Normal turnaround (24-48 hrs)</option>
                <option value="High">High - Same-day diagnostic needed</option>
                <option value="Urgent">Urgent - Emergency breakdown / Food spoiling</option>
              </select>
            </div>

            {/* Service Delivery Mode */}
            <div className="form-group full-grid-width">
              <label className="form-label">Service Type Preference</label>
              <div className="radio-pill-group">
                <label
                  className={`radio-pill ${formData.serviceType === 'Home Visit' ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="Home Visit"
                    checked={formData.serviceType === 'Home Visit'}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                  <span>Home Visit / Technician Dispatch (Recommended for Refrigerator/Washer)</span>
                </label>
                <label
                  className={`radio-pill ${formData.serviceType === 'Shop Drop-off' ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value="Shop Drop-off"
                    checked={formData.serviceType === 'Shop Drop-off'}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  />
                  <span>Shop Counter Drop-off (Recommended for Microwave)</span>
                </label>
              </div>
            </div>

            {/* Detailed Complaint Description */}
            <div className="form-group full-grid-width">
              <label className="form-label" htmlFor="complaint-desc">
                Detailed Complaint & Symptoms Description <span className="text-danger">*</span>
              </label>
              <div className={`input-icon-wrapper ${errors.description ? 'has-error' : ''}`}>
                <AlertTriangle className="input-icon textarea-icon" size={18} />
                <textarea
                  id="complaint-desc"
                  rows={4}
                  className="form-input form-textarea"
                  placeholder="Describe what occurs: noises, burning smell, leak points, display error codes, or temperature status..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: null });
                  }}
                  required
                />
              </div>
              {errors.description && (
                <span className="field-error-msg">{errors.description}</span>
              )}
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="form-submit-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetForm}
            >
              <RotateCcw size={16} /> Reset Form
            </button>
            <button type="submit" className="btn btn-primary btn-lg flex items-center gap-2">
              <span>Register Complaint & Generate Ticket</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>

      {/* Generated Ticket Modal Preview */}
      {showJobCardModal && createdResult && (
        <JobCardModal
          complaint={createdResult.complaint}
          onClose={() => setShowJobCardModal(false)}
        />
      )}
    </div>
  );
}
