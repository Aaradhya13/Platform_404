import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className = "", variant = "sidebar" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('department');
    
    // Navigate to login page
    navigate('/login');
  };

  if (variant === "sidebar") {
    return (
      <button 
        onClick={handleLogout}
        className={`w-full flex items-center space-x-3 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors ${className}`}
        style={{ backgroundColor: '#21B6C2' }}
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all shadow-sm`}
        style={{ backgroundColor: '#21B6C2' }}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-all ${className}`}
      style={{ backgroundColor: '#21B6C2' }}
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;