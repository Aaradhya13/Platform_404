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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentView === 'analytics' ? (
        <CleaningAnalytics onNavigateToList={() => setCurrentView('list')} />
      ) : (
        <div>
          {/* Professional Navigation Header */}
          <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentView('analytics')}
                    className="inline-flex items-center px-6 py-3 bg-[#24B6C9] text-white font-medium rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Analytics Dashboard
                  </button>
                  
                  {/* Breadcrumb Navigation */}
                  <nav className="flex items-center space-x-2 text-sm">
                    <button 
                      onClick={() => setCurrentView('analytics')}
                      className="text-[#24B6C9] hover:text-[#1fa3b5] font-medium transition-colors duration-200"
                    >
                      Analytics
                    </button>
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-600 font-medium">Schedule Management</span>
                  </nav>
                </div>

                {/* Optional additional controls */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-700 font-medium text-sm">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Section */}
          <div className="relative">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#24B6C9] to-transparent opacity-5"></div>
            <div className="relative">
              <Cleaning />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningDashboard;