import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import CustomerRecords from './pages/CustomerRecords';
import ComplaintHistory from './pages/ComplaintHistory';
import DiagnosisPage from './pages/DiagnosisPage';
import CostGuardrailPage from './pages/CostGuardrailPage';

// Protected Route component: redirects unauthenticated users to login
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Layout />;
}

// Public Route: redirects already logged-in users directly to dashboard
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected Unified Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-complaint" element={<NewComplaint />} />
              <Route path="/customers" element={<CustomerRecords />} />
              <Route path="/complaints" element={<ComplaintHistory />} />
              {/* Module 2: Fault Diagnosis Engine */}
              <Route path="/diagnosis" element={<DiagnosisPage />} />
              {/* Module 3: Repair Cost Estimation System */}
              <Route path="/cost-guardrail" element={<CostGuardrailPage />} />
              <Route path="/cost-estimation" element={<CostGuardrailPage />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
