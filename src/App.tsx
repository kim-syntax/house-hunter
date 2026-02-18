import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Auth Components
import Login from './components/auth/Login';
import SignupChoice from './components/auth/SignupChoice';
import TenantSignup from './components/auth/TenantSignup';
import LandlordSignup from './components/auth/LandlordSignup';

// Pages
import TenantHome from './pages/tenant/TenantHome';
import LandlordDashboard from './pages/landlord/LandlordDashboard';

// Styles
import './App.css';

const App: React.FC = () => {
  const { token, getCurrentUser } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    if (token) {
      getCurrentUser().catch(() => {
        // Token invalid, user will be redirected to login
      });
    }
  }, [token, getCurrentUser]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupChoice />} />
        <Route path="/signup/tenant" element={<TenantSignup />} />
        <Route path="/signup/landlord" element={<LandlordSignup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes - Tenant */}
        <Route path="/tenant/home" element={<TenantHome />} />

        {/* Protected Routes - Landlord */}
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
