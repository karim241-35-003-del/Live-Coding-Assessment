import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  PlusCircle,
  LogOut,
  User,
  RotateCcw,
  Menu,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { resetToSampleData } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo customers and complaints to initial sample records?')) {
      resetToSampleData();
    }
  };

  return (
    <header className="app-navbar no-print">
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <Wrench size={20} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Jamal's Appliance Care</span>
            <span className="brand-subtitle">Diagnostics & Repair Portal</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Quick Demo Reset */}
        <button
          type="button"
          onClick={handleResetData}
          className="btn-icon-text text-muted"
          title="Reset to fresh demo sample records"
        >
          <RotateCcw size={15} />
          <span className="hide-on-mobile">Reset Demo Data</span>
        </button>

        {/* Quick Action Button */}
        <Link to="/new-complaint" className="btn btn-primary btn-sm flex items-center gap-1">
          <PlusCircle size={16} />
          <span className="hide-on-mobile">Register New Complaint</span>
        </Link>

        {/* User Profile Tag */}
        <div className="user-profile-badge">
          <div className="avatar-circle">
            <User size={16} />
          </div>
          <div className="user-details hide-on-mobile">
            <span className="user-name">{user?.name || 'Jamal Uddin'}</span>
            <span className="user-role">
              <ShieldCheck size={12} className="inline text-emerald-500 mr-0.5" />
              Service Admin
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn-logout-icon"
          title="Sign out of system"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
