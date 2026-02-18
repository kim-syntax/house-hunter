import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const LandlordDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>🏢 Landlord Dashboard</h1>
          <p>Welcome, {user?.firstName}!</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            padding: '10px 20px',
            background: '#f5576c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
      <p>Manage your properties</p>
    </div>
  );
};

export default LandlordDashboard;
