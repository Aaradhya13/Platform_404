import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CleaningAnalytics from './CleaningAnalytics';
import Cleaning from './Cleaning';

const CleaningDashboard = () => {
  const [currentView, setCurrentView] = useState('analytics');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  
  
  if (userRole === 'admin') {
    return <Cleaning />;
  }
  
 
  return (
    <div>
      {currentView === 'analytics' ? (
        <CleaningAnalytics onNavigateToList={() => setCurrentView('list')} />
      ) : (
        <div>
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => setCurrentView('analytics')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Analytics
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🏠 Dashboard
            </button>
          </div>
          <Cleaning />
        </div>
      )}
    </div>
  );
};

export default CleaningDashboard;