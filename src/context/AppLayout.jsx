import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  MapPin, 
  Clock, 
  CreditCard, 
  User, 
  Settings, 
  Info, 
  ChevronLeft,
  ChevronRight,
  Train,
  Route,
  Ticket,
  AlertCircle
} from 'lucide-react';
import { ThemeToggleButton } from '../components/ThemeButton';
import { SlidingThemeToggle } from '../components/ThemeButton';
import { useTheme } from './ThemeProvider';
const AppLayout = ({ children }) => {
  const { theme } = useTheme();
  console.log(theme)
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const menuItems = [
    { icon: Home, label: 'Home', href: '#', active: true },
    { icon: Route, label: 'Route Map', href: '#' },
    { icon: Clock, label: 'Schedules', href: '#' },
    { icon: Ticket, label: 'Tickets', href: '#' },
    { icon: CreditCard, label: 'Payments', href: '#' },
    { icon: MapPin, label: 'Stations', href: '#' },
    { icon: AlertCircle, label: 'Service Alerts', href: '#' },
    { icon: User, label: 'My Account', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
    { icon: Info, label: 'Help & Support', href: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
      >
        {isMobileOpen ? 
          <X size={20} className="text-gray-700 dark:text-gray-300" /> : 
          <Menu size={20} className="text-gray-700 dark:text-gray-300" />
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
        hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <Train size={18} className="text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Metro Transit</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">City Transport</p>
                </div>
              </div>
            )}
            {!isOpen && (
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                <Train size={18} className="text-white" />
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors group relative text-sm font-medium
                  ${item.active 
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
              >
                <IconComponent size={18} />
                {isOpen && <span>{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Guest User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Not signed in</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out md:hidden border-r border-gray-200 dark:border-gray-700
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <Train size={18} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Metro Transit</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">City Transport</p>
              </div>
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors text-sm font-medium
                  ${item.active 
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Guest User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Not signed in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="md:hidden w-8"></div> {/* Spacer for mobile */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Metro Transit System</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan your journey • Check schedules • Buy tickets</p>
              </div>
            </div>
            
            {/* Theme Toggle in Header */}
            <div className="flex items-center gap-3">
              <ThemeToggleButton />
              <SlidingThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {children || (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Service Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Train size={24} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Status</h3>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">All lines operational</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Clock size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next Train</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Downtown Line</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">3 minutes</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Ticket size={24} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Buy</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Single journey ticket</p>
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">$2.50</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Route size={24} className="mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Plan Journey</p>
                  </button>
                  <button className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Clock size={24} className="mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Live Times</p>
                  </button>
                  <button className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Ticket size={24} className="mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Buy Tickets</p>
                  </button>
                  <button className="p-4 text-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <MapPin size={24} className="mx-auto mb-2 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Find Stations</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity or Announcements */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Announcements</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Weekend Schedule Change</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Modified service hours this weekend due to maintenance work.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <AlertCircle size={16} className="text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New Mobile App</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Download our new mobile app for easier journey planning.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;