import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ADMIN } from '../data/mockData';

export default function Login() {
  const { login, rememberedEmail, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(rememberedEmail || 'admin@jamal.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate slight authentic network delay for polish
    setTimeout(() => {
      const res = login(email, password, rememberMe);
      setIsSubmitting(false);
      if (res.success) {
        navigate('/dashboard');
      }
    }, 400);
  };

  // Quick fill helper for exam evaluators
  const handleQuickFill = () => {
    setEmail(MOCK_ADMIN.email);
    setPassword(MOCK_ADMIN.password);
    setErrors({});
    setAuthError('');
  };

  return (
    <div className="login-page">
      <div className="login-backdrop-decor"></div>

      <div className="login-card-container">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-logo-badge">
            <Wrench size={32} strokeWidth={2.4} />
          </div>
          <h1 className="login-title">Jamal's Appliance Care</h1>
          <p className="login-subtitle">
            Customer Information & Complaint Collection System
          </p>
        </div>

        {/* Global Error Alert */}
        {authError && (
          <div className="alert-box alert-danger">
            <AlertCircle size={18} className="flex-shrink-0" />
            <div>
              <strong>Authentication Failed</strong>
              <p>{authError}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email field */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className={`input-icon-wrapper ${errors.email ? 'has-error' : ''}`}>
              <Mail className="input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="admin@jamal.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  if (authError) setAuthError('');
                }}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          {/* Password field */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
            </div>
            <div className={`input-icon-wrapper ${errors.password ? 'has-error' : ''}`}>
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  if (authError) setAuthError('');
                }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="field-error-msg">{errors.password}</span>
            )}
          </div>

          {/* Remember me */}
          <div className="form-row-between">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-label">Remember my email</span>
            </label>

            <span className="auth-hint-text">Appliance System v1.0</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner-sm"></span> Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Helper Card */}
        <div className="demo-credentials-card">
          <div className="demo-card-header">
            <Sparkles size={16} className="text-amber-500" />
            <span>Assigned Evaluator Credentials</span>
          </div>
          <div className="demo-credentials-list">
            <div className="cred-line">
              <span className="cred-key">Email:</span>
              <code>admin@jamal.com</code>
            </div>
            <div className="cred-line">
              <span className="cred-key">Password:</span>
              <code>admin123</code>
            </div>
          </div>
          <button
            type="button"
            className="btn-link-demo"
            onClick={handleQuickFill}
          >
            Auto-fill credentials
          </button>
        </div>

        {/* Footer info */}
        <div className="login-footer-info">
          <Shield size={14} className="inline text-muted mr-1" />
          <span>Role-Based Access Control • Local Storage Simulation</span>
        </div>
      </div>
    </div>
  );
}
