import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CUSTOMERS, INITIAL_COMPLAINTS } from '../data/mockData';

const DataContext = createContext(null);

const STORAGE_CUSTOMERS = 'jamal_customers_records';
const STORAGE_COMPLAINTS = 'jamal_complaints_records';

export function DataProvider({ children }) {
  // Initialize customers from localStorage or initial mock data
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOMERS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    } catch (e) {
      console.error('Failed reading customers from localStorage', e);
      return INITIAL_CUSTOMERS;
    }
  });

  // Initialize complaints from localStorage or initial mock data
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPLAINTS);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    } catch (e) {
      console.error('Failed reading complaints from localStorage', e);
      return INITIAL_COMPLAINTS;
    }
  });

  // Keep localStorage synchronized whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed saving customers to localStorage', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed saving complaints to localStorage', e);
    }
  }, [complaints]);

  // Add new customer & complaint together or link existing customer
  const registerComplaint = (formData) => {
    const timestamp = new Date();
    const formattedDate = timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Check if customer already exists by phone number
    const normalizedPhone = formData.customerPhone.trim();
    const existingCustomerIndex = customers.findIndex(
      (c) => c.phone.trim() === normalizedPhone
    );

    let customerId;
    let updatedCustomers = [...customers];

    if (existingCustomerIndex >= 0) {
      // Existing customer: update details & increment complaint count
      const existing = updatedCustomers[existingCustomerIndex];
      customerId = existing.id;
      updatedCustomers[existingCustomerIndex] = {
        ...existing,
        fullName: formData.customerName.trim(),
        email: formData.customerEmail ? formData.customerEmail.trim() : existing.email,
        address: formData.customerAddress.trim(),
        complaintCount: (existing.complaintCount || 1) + 1,
        lastActiveDate: formattedDate
      };
    } else {
      // New Customer
      customerId = `CUST-${100 + updatedCustomers.length + 1}`;
      const newCustomer = {
        id: customerId,
        fullName: formData.customerName.trim(),
        phone: normalizedPhone,
        email: formData.customerEmail ? formData.customerEmail.trim() : '',
        address: formData.customerAddress.trim(),
        registeredDate: formattedDate,
        complaintCount: 1
      };
      updatedCustomers = [newCustomer, ...updatedCustomers];
    }

    // Generate unique complaint ID: JAC-2026-XXX
    const nextSeq = String(complaints.length + 1).padStart(3, '0');
    const complaintId = `JAC-2026-${nextSeq}`;

    const newComplaint = {
      id: complaintId,
      customerId,
      customerName: formData.customerName.trim(),
      customerPhone: normalizedPhone,
      customerEmail: formData.customerEmail ? formData.customerEmail.trim() : '',
      customerAddress: formData.customerAddress.trim(),
      applianceType: formData.applianceType,
      brand: formData.brand.trim() || 'Generic / Other',
      modelNumber: formData.modelNumber ? formData.modelNumber.trim() : 'N/A',
      serialNumber: formData.serialNumber ? formData.serialNumber.trim() : 'N/A',
      issueCategory: formData.issueCategory,
      description: formData.description.trim(),
      priority: formData.priority || 'Medium',
      serviceType: formData.serviceType || 'Shop Drop-off',
      status: 'Pending',
      registeredDate: formattedDate,
      estimatedInspectionFee: formData.applianceType === 'Refrigerator' ? 500 : (formData.applianceType === 'Washing Machine' ? 500 : 300),
      technicianNotes: 'Registered and awaiting technician diagnostic assignment.'
    };

    setCustomers(updatedCustomers);
    setComplaints([newComplaint, ...complaints]);

    return { customerId, complaintId, complaint: newComplaint };
  };

  // Update complaint status
  const updateComplaintStatus = (complaintId, newStatus) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === complaintId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Reset to initial mock data (useful for demonstration during live assessment)
  const resetToSampleData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setComplaints(INITIAL_COMPLAINTS);
    localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    localStorage.setItem(STORAGE_COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  };

  // Derived statistics for dashboard cards
  const stats = {
    totalCustomers: customers.length,
    totalComplaints: complaints.length,
    refrigeratorComplaints: complaints.filter((c) => c.applianceType === 'Refrigerator').length,
    washingMachineComplaints: complaints.filter((c) => c.applianceType === 'Washing Machine').length,
    microwaveComplaints: complaints.filter((c) => c.applianceType === 'Microwave Oven').length,
    pendingComplaints: complaints.filter((c) => c.status === 'Pending').length,
    inProgressComplaints: complaints.filter((c) => c.status === 'Under Inspection').length,
    completedComplaints: complaints.filter((c) => c.status === 'Repaired' || c.status === 'Delivered').length
  };

  const value = {
    customers,
    complaints,
    stats,
    registerComplaint,
    updateComplaintStatus,
    resetToSampleData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within a DataProvider');
  }
  return ctx;
}
