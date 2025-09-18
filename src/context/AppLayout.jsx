import React, { useState, createContext, useContext } from 'react';

// Translation context
const TranslationContext = createContext();

const translations = {
  en: {
    "Fontsize": "Fontsize",
    "Home": "Home",
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
    { icon: Home, label: translate('Home'), href: '#', active: true }
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
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
      >
        {isMobileOpen ? 
          <X size={20} className="text-gray-600" /> : 
          <Menu size={20} className="text-gray-600" />
        }
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <div className={`
        hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-30
        ${isOpen ? 'w-64' : 'w-16'}
      `}>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded" />
                <div>
                  <span className="text-lg font-semibold text-gray-800">Metro Transit</span>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </div>
            )}
            {!isOpen && (
              <div className="flex items-center justify-center mx-auto">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded" />
              </div>
            )}
           
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 bg-white">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 font-medium text-sm
                  ${item.active 
                    ? 'bg-cyan-50 text-cyan-700 border-l-4 border-cyan-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
              >
                <IconComponent size={18} />
                {isOpen && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>


        {/* Desktop Sidebar Footer with Logout */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 font-medium text-sm
              text-red-600 hover:bg-red-50
              ${!isOpen ? 'justify-center' : ''}
            `}
          >
            <LogOut size={18} />
            {isOpen && <span>{translate('Logout')}</span>}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {translate('Logout')}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white transform transition-transform duration-300 ease-in-out md:hidden border-r border-gray-200
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded" />
              <div>
                <span className="text-lg font-semibold text-gray-800">Metro Transit</span>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-1 rounded text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-3 space-y-1 bg-white">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 font-medium text-sm
                  ${item.active 
                    ? 'bg-cyan-50 text-cyan-700 border-l-4 border-cyan-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={toggleMobileSidebar}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>


        {/* Mobile Sidebar Footer with Logout */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              handleLogout();
              toggleMobileSidebar();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 font-medium text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>{translate('Logout')}</span>
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? 'md:ml-64' : 'md:ml-16'}`}>
    

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children || (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Welcome Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">Metro Transit Dashboard</h2>
                    <p className="text-gray-600 text-sm">Monitor and manage your transit operations efficiently</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#E0F8FB'}}>
                    <Train size={24} style={{color: '#24B6C9'}} />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <AlertCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Service Status</h3>
                      <p className="text-green-600 font-semibold text-sm">Operational</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: '#E0F8FB'}}>
                      <Clock size={20} style={{color: '#24B6C9'}} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Next Departure</h3>
                      <p className="font-semibold text-sm" style={{color: '#24B6C9'}}>Downtown - 3 min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Ticket size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Active Tickets</h3>
                      <p className="text-purple-600 font-semibold text-sm">1,247</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: MapPin, label: 'Plan Journey', color: '#24B6C9' },
                  { icon: Clock, label: 'Live Times', color: 'green' },
                  { icon: Ticket, label: 'Manage Tickets', color: 'purple' },
                  { icon: MapPin, label: 'Station Finder', color: 'orange' }
                ].map((action, index) => {
                  const IconComponent = action.icon;
                  const colorClasses = {
                    '#24B6C9': 'text-white',
                    green: 'bg-green-600 hover:bg-green-700',
                    purple: 'bg-purple-600 hover:bg-purple-700',
                    orange: 'bg-orange-600 hover:bg-orange-700'
                  };
                  const buttonStyle = action.color === '#24B6C9' ? {
                    backgroundColor: '#24B6C9'
                  } : {};
                  return (
                    <button
                      key={index}
                      className={`${action.color === '#24B6C9' ? 'text-white hover:opacity-90' : colorClasses[action.color]} p-4 rounded-lg transition-all duration-150 hover:shadow-md`}
                      style={buttonStyle}
                    >
                      <IconComponent size={20} className="mx-auto mb-2" />
                      <p className="font-medium text-xs">{action.label}</p>
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