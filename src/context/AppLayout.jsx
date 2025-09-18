import React, { useState, createContext, useContext } from 'react';

// Translation context
const TranslationContext = createContext();

const translations = {
  en: {
    "Fontsize": "Fontsize",
    "Home": "Home",
    "Route Map": "Route Map",
    "Logout": "Logout",
  },
 
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  
  const translate = (text) => translations[language][text] || text;
  const toggleLanguage = () => setLanguage(prev => prev === "en" ? "ml" : "en");
  
  return (
    <TranslationContext.Provider value={{ language, translate, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);

import { 
  Menu, 
  X, 
  Home, 
  MapPin, 
  Clock, 
  Train,
  Route,
  Ticket,
  AlertCircle,
  LogOut
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const { translate } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const handleLogout = () => {
    // Add any logout logic here (clear tokens, user data, etc.)
    console.log('Logging out...');
    
    // Redirect to home page
    window.location.href = '/';
  };

  const menuItems = [
    { icon: Home, label: translate('Home'), href: '#', active: true },
    { icon: Route, label: translate('Route Map'), href: '/map' },
   
  ];

  const [fontSize, setFontSize] = useState("text-base");
const [highContrast, setHighContrast] = useState(false);

const toggleContrast = () => setHighContrast(prev => !prev);
const handleFontSize = (action) => {
    setFontSize((prev) => {
      if (action === "increase") {
        if (prev === "text-base") return "text-lg";
        if (prev === "text-lg") return "text-xl";
        return "text-xl"; // max
      } else if (action === "decrease") {
        if (prev === "text-xl") return "text-lg";
        if (prev === "text-lg") return "text-base";
        if (prev === "text-base") return "text-sm";
        return "text-sm"; // min
      }
      return prev;
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-10 left-6 z-50 md:hidden p-3 rounded-xl bg-white shadow-2xl border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105"
        style={{ boxShadow: '0 8px 32px rgba(36, 182, 201, 0.15)' }}
      >
        {isMobileOpen ? 
          <X size={22} className="text-gray-700" /> : 
          <Menu size={22} className="text-gray-700" />
        }
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`
        hidden md:flex flex-col bg-white shadow-2xl transition-all duration-300 relative
        ${isOpen ? 'w-80' : 'w-20'}
      `}
      style={{ boxShadow: '8px 0 32px rgba(36, 182, 201, 0.08)' }}
      >
        {/* Accent Strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#24B6C9] to-[#1ea8bb]"></div>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#24B6C9] to-[#1ea8bb] text-white">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <Train size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white tracking-tight">Metro Transit</span>
                  <p className="text-sm text-white text-opacity-80 font-medium">City Transport</p>
                </div>
              </div>
            )}
            {!isOpen && (
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Train size={24} className="text-white" />
              </div>
            )}
           
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 bg-white">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group relative font-medium border
                  ${item.active 
                    ? 'bg-gradient-to-r from-[#24B6C9] to-[#1ea8bb] text-white shadow-xl border-transparent transform scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#24B6C9] hover:from-10% hover:to-[#1ea8bb] hover:text-white border-gray-100 hover:border-transparent hover:shadow-lg hover:scale-[1.01]'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                style={item.active ? { boxShadow: '0 8px 32px rgba(36, 182, 201, 0.3)' } : {}}
              >
                <IconComponent size={20} className={item.active ? 'text-white' : ''} />
                {isOpen && <span className="text-sm tracking-wide">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-4 py-3 bg-gray-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Sidebar Footer with Logout */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group relative font-medium border
              text-white hover:opacity-90 border-transparent shadow-lg hover:scale-[1.01]
              ${!isOpen ? 'justify-center' : ''}
            `}
            style={{ backgroundColor: '#21B6C2' }}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm tracking-wide">{translate('Logout')}</span>}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-4 px-4 py-3 bg-gray-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl">
                {translate('Logout')}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-80 h-full bg-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-6 bg-gradient-to-r from-[#24B6C9] to-[#1ea8bb] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Train size={24} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">Metro Transit</span>
                <p className="text-sm text-white text-opacity-80 font-medium">City Transport</p>
              </div>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-xl text-white hover:bg-white hover:bg-opacity-20 transition-all duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-2 bg-white">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-medium border
                  ${item.active 
                    ? 'bg-gradient-to-r from-[#24B6C9] to-[#1ea8bb] text-white shadow-xl border-transparent transform scale-[1.02]' 
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-[#24B6C9] hover:from-10% hover:to-[#1ea8bb] hover:text-white border-gray-100 hover:border-transparent hover:shadow-lg hover:scale-[1.01]'
                  }
                `}
                style={item.active ? { boxShadow: '0 8px 32px rgba(36, 182, 201, 0.3)' } : {}}
                onClick={toggleMobileSidebar}
              >
                <IconComponent size={20} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile Sidebar Footer with Logout */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              handleLogout();
              toggleMobileSidebar();
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 font-medium border text-white hover:opacity-90 border-transparent shadow-lg hover:scale-[1.01]"
            style={{ backgroundColor: '#21B6C2' }}
          >
            <LogOut size={20} />
            <span className="text-sm tracking-wide">{translate('Logout')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
    

        {/* Main Content Area */}
        <main className="flex-1 p-0 overflow-auto">
          {children || (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-[#24B6C9] to-[#1ea8bb] rounded-3xl p-8 text-white shadow-2xl" 
                   style={{ boxShadow: '0 16px 48px rgba(36, 182, 201, 0.25)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Metro Transit</h2>
                    <p className="text-white text-opacity-90">Your journey starts here. Plan, book, and travel with confidence.</p>
                  </div>
                  <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Train size={32} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100" 
                     style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <AlertCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Service Status</h3>
                      <p className="text-emerald-600 font-medium">All Lines Operational</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100" 
                     style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#24B6C9] to-[#1ea8bb] rounded-2xl flex items-center justify-center">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Next Train</h3>
                      <p className="text-[#24B6C9] font-medium">Downtown - 3 min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100" 
                     style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Ticket size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Quick Buy</h3>
                      <p className="text-purple-600 font-medium">Single Journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: MapPin, label: 'Plan Journey', color: 'from-blue-500 to-blue-600' },
                  { icon: Clock, label: 'Live Times', color: 'from-green-500 to-green-600' },
                  { icon: Ticket, label: 'Buy Tickets', color: 'from-[#24B6C9] to-[#1ea8bb]' },
                  { icon: MapPin, label: 'Find Stations', color: 'from-purple-500 to-purple-600' }
                ].map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 border-0`}
                    >
                      <IconComponent size={28} className="mx-auto mb-3" />
                      <p className="font-semibold text-sm">{action.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;