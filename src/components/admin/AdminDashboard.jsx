import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Train, Calendar, Wrench, Eye, Trash2, Plus, Edit, 
  Building, Save, X, Users, Briefcase, Search, Filter, RefreshCw,
  ChevronDown, Bell, LogOut, Menu, Home, AlertCircle, CheckCircle, MapPin,
  Download, Upload, MoreVertical, Archive, FileText, Camera, Map, Clock, Lightbulb, FolderOpen
} from 'lucide-react';
import { adminService } from '../../services/adminapi';
import BrandingDealsComponent from './BrandingDealsComponent';
import { Award } from 'lucide-react'; // Add Award icon
// Header Component
const Header = ({ onMenuToggle, isSidebarOpen }) => {
console.log("Sidebar isOpen:", isSidebarOpen);
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
              <p className="text-sm text-gray-500">Management Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, isOpen, onClose, onNavigate }) => {
  const navItems = [
    { id: 'users', label: 'Users', icon: User, category: 'Management' },
    { id: 'roles', label: 'Roles', icon: Settings, category: 'Management' },
    { id: 'departments', label: 'Departments', icon: Building, category: 'Management' },
    { id: 'route-map', label: 'Route Map', icon: Map, category: 'Management', isNavigation: true, route: '/map' },
    { id: 'operations', label: 'Operations', icon: Train, category: 'Operations' },
    { id: 'operation-lanes', label: 'Operation Lanes', icon: Train, category: 'Operations' },
    { id: 'timetable', label: 'Timetable', icon: Calendar, category: 'Operations' },
    { id: 'cleaning', label: 'Cleaning', icon: Wrench, category: 'Maintenance' },
    { id: 'cleaning-lanes', label: 'Cleaning Lanes', icon: Wrench, category: 'Maintenance' },
    { id: 'inspections', label: 'Inspections', icon: Eye, category: 'Quality' },
    { id: 'inspection-lanes', label: 'Inspection Lanes', icon: Eye, category: 'Quality' },
    { id: 'job-cards', label: 'Job Cards', icon: FileText, category: 'Quality' },
    { id: 'logs', label: 'Activity Logs', icon: FileText, category: 'Important Documents' },
    { id: 'maintenance', label: 'Maintenance', icon: Settings, category: 'Maintenance' },
    { id: 'maintenance-lanes', label: 'Maintenance Lanes', icon: Settings, category: 'Maintenance' },
    // Add this to your navItems array in the Sidebar component
{ id: 'branding-deals', label: 'Branding Deals', icon: Award, category: 'Operations' }
  ];

  const categories = [...new Set(navItems.map(item => item.category))];

  const handleItemClick = (item) => {
    if (item.isNavigation && item.route) {
      // Handle navigation to external route
      if (onNavigate) {
        onNavigate(item.route);
      } else {
        // Fallback to window.location if no navigation handler provided
        window.location.href = item.route;
      }
    } else {
      // Handle normal tab change
      onTabChange(item.id);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {navItems
                      .filter(item => item.category === category)
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon size={18} />
                            <span className="text-sm font-medium">{item.label}</span>
                            {item.isNavigation && (
                              <MapPin size={14} className="ml-auto text-gray-400" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
          
       <div className="p-4 border-t border-gray-200">
      <button
        onClick={() => window.location.href = "/"}
        className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
        </div>
      </aside>
    </>
  );
};

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle
  };
  
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${styles[type]} mb-6`}>
      <div className="flex items-center space-x-2">
        <Icon size={20} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
};
const JobCardsGrid = ({ data, loading, onAiSuggestion, onClose, showActions = true }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#24B6C9] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading job cards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No job cards available</p>
          <p className="text-gray-400 text-sm">Job cards will appear here when created</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getCardStatus = (jobCard) => {
    if (jobCard.closed_at === null || jobCard.closed_at === undefined) {
      return { status: 'Open', color: 'bg-red-50 text-red-600 border border-red-200' };
    }
    return { status: 'Closed', color: 'bg-green-50 text-green-600 border border-green-200' };
  };

  // Separate open and closed job cards
  const openJobCards = data.filter(jobCard => !jobCard.closed_at);
  const closedJobCards = data.filter(jobCard => jobCard.closed_at);

  const renderJobCard = (jobCard, index) => {
    const statusInfo = getCardStatus(jobCard);
    const cleanPhotoUrl = jobCard.photo ? jobCard.photo.replace(/[<>]/g, '') : null;
    
    return (
      <div 
        key={jobCard.id || index}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Photo Section */}
        <div className="relative h-48 bg-gray-100">
          {cleanPhotoUrl && cleanPhotoUrl !== 'http://example.com/photo.png' && cleanPhotoUrl !== null && cleanPhotoUrl.trim() !== '' ? (
            <img 
              src={cleanPhotoUrl} 
              alt="Job card photo" 
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => window.open(cleanPhotoUrl, '_blank')}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          <div 
            className="w-full h-full flex items-center justify-center" 
            style={{display: (cleanPhotoUrl && cleanPhotoUrl !== 'http://example.com/photo.png' && cleanPhotoUrl !== null && cleanPhotoUrl.trim() !== '') ? 'none' : 'flex'}}
          >
            <div className="text-center">
              <Camera size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No image</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>

          {/* Job Card ID Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
              #{jobCard.id}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Train size={16} className="text-[#24B6C9]" />
              <span className="font-semibold text-gray-900">Train {jobCard.train}</span>
            </div>
            <span className="text-sm text-gray-500">#{jobCard.id}</span>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{jobCard.description}</p>
          </div>

          {/* How Closed Info (only show for closed job cards) */}
          {jobCard.closed_at && jobCard.how_closed && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-start space-x-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Resolution:</p>
                  <p className="text-sm text-gray-600">{jobCard.how_closed}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-2 mb-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-2" />
              <span>Created: {formatDateTime(jobCard.created_at)}</span>
            </div>
            {jobCard.closed_at && (
              <div className="flex items-center">
                <CheckCircle size={12} className="mr-2" />
                <span>Closed: {formatDateTime(jobCard.closed_at)}</span>
              </div>
            )}
          </div>

          {/* Actions - Only show for open job cards if showActions is true */}
          {showActions && !jobCard.closed_at && (
            <div className="flex justify-end space-x-2">
              {onAiSuggestion && (
                <button
                  onClick={() => onAiSuggestion(jobCard)}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-purple-700 bg-purple-100 
                             rounded-md hover:bg-purple-200 transition-colors shadow-sm text-xs"
                  title="Get AI suggestion"
                >
                  <Lightbulb size={14} />
                  <span className="font-medium">AI Help</span>
                </button>
              )}

              {onClose && (
                <button
                  onClick={() => onClose(jobCard)}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-white bg-[#24B6C9] 
                             rounded-md hover:bg-[#1fa5b8] transition-colors shadow-sm text-xs"
                  title="Close job card"
                >
                  <CheckCircle size={14} />
                  <span className="font-medium">Close</span>
                </button>
              )}

              {/* More options button (placeholder) */}
              <button
                className="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 
                           rounded-md transition-colors"
                title="More options"
              >
                <MoreVertical size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistics Header */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <FolderOpen size={20} className="text-red-500" />
          <span className="text-sm font-medium text-gray-700">
            Open Cards: <span className="font-bold text-red-600">{openJobCards.length}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Archive size={20} className="text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            Closed Cards: <span className="font-bold text-green-600">{closedJobCards.length}</span>
          </span>
        </div>
      </div>

      {/* Open Job Cards Section */}
      {openJobCards.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <FolderOpen size={24} className="text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              Open Job Cards ({openJobCards.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {openJobCards.map((jobCard, index) => renderJobCard(jobCard, index))}
          </div>
        </div>
      )}

      {/* Closed Job Cards Section */}
      {closedJobCards.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Archive size={24} className="text-green-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              Closed Job Cards ({closedJobCards.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {closedJobCards.map((jobCard, index) => renderJobCard(jobCard, index))}
          </div>
        </div>
      )}
    </div>
  );
};

const LogsGrid = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activity logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No activity logs found</p>
          <p className="text-gray-400 text-sm">System activity will appear here</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="mr-2" size={20} />
          Activity Logs ({data.length})
        </h2>
      </div>
      
      <div className="space-y-4">
        {data.map((log, index) => (
          <div key={log.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {log.user?.username || 'Unknown User'}
                    </p>
                    {log.user?.email && (
                      <p className="text-xs text-gray-500">{log.user.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="ml-11">
                  <p className="text-gray-800 font-medium mb-2">{log.action}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  #{log.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Data Table Component
const DataTable = ({ data, onEdit, onDelete, canDelete, loading, activeTab }) => {
  // In DataTable component, add this condition at the beginning:
if (activeTab === 'logs') {
  return <LogsGrid data={data} loading={loading} />;
}
  // Use Job Cards Grid for job-cards tab
  if (activeTab === 'job-cards') {
    return <JobCardsGrid data={data} onEdit={onEdit} onDelete={onDelete} canDelete={canDelete} loading={loading} />;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg mb-2">No data available</p>
          <p className="text-gray-400 text-sm">Start by creating your first entry</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-600 bg-gray-100';
    switch (status.toLowerCase()) {
      case 'completed': case 'active': case 'online': return 'text-green-600 bg-green-100';
      case 'in-progress': case 'pending': return 'text-blue-600 bg-blue-100';
      case 'scheduled': case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderCellContent = (item, column) => {
    const value = item[column];

    // Handle train_schedule specially - extract train_id
    if (column === 'train_schedule') {
      if (value && value.train && value.train.train_id) {
        return (
          <div className="flex items-center">
            <Train className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm font-bold text-gray-900">Train {value.train.train_id}</span>
          </div>
        );
      } else {
        return <span className="text-sm font-bold text-gray-900">-</span>;
      }
    }
    
    // Handle datetime fields
    if (column.includes('time') || column.includes('date') || column.includes('Start') || column.includes('End') || column.includes('created') || column.includes('updated') || column === 'scheduledStart' || column === 'scheduledEnd' || column === 'enterd' || column === 'exited') {
      return (
        <span className="text-sm font-bold text-gray-900">
          {formatDateTime(value)}
        </span>
      );
    }
    
    // Handle status fields
    if (column.toLowerCase().includes('status') || column === 'active' || column === 'enabled') {
      const statusText = value ? (typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : String(value)) : 'Unknown';
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(statusText)}`}>
          {statusText}
        </span>
      );
    }
    
    // Handle ID fields with icons
    if (column.includes('id') || column.includes('Id') || column === 'train' || column === 'lane' || column === 'lane_number' || column === 'bay_number' || column === 'depot') {
      const icon = column.includes('train') ? <Train className="h-4 w-4 text-gray-400 mr-1" /> : 
                   (column.includes('lane') || column === 'lane_number' || column === 'bay_number') ? null :
                   column === 'depot' ? <Train className="h-4 w-4 text-gray-400 mr-1" /> :
                   <Briefcase className="h-4 w-4 text-gray-400 mr-1" />;
      return (
        <div className={icon ? "flex items-center" : ""}>
          {icon}
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle email fields
    if (column === 'email' && value) {
      return (
        <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800 text-sm">
          {value}
        </a>
      );
    }
    
    // Handle depot name specifically
    if (column === 'depot_name') {
      return (
        <div className="flex items-center">
          <Train className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle other name fields (but not depot_name)
    if ((column.includes('name') || column === 'username' || column === 'first_name' || column === 'last_name') && column !== 'depot_name') {
      return (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm font-bold text-gray-900">{value || '-'}</span>
        </div>
      );
    }
    
    // Handle object data professionally
    if (typeof value === 'object' && value !== null) {
      // If it's an array, show count
      if (Array.isArray(value)) {
        return (
          <div className="text-sm text-gray-900">
            {value.length} items
          </div>
        );
      }
      // If it's an object with a name property, show the name
      if (value.name) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.name}
          </span>
        );
      }
      // If it's an object with username property, show username
      if (value.username) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.username}
          </span>
        );
      }
      // If it's an object with id and name, show formatted
      if (value.id && value.name) {
        return (
          <span className="text-sm font-bold text-gray-900">
            {value.name} <span className="text-gray-500">(#{value.id})</span>
          </span>
        );
      }
      // For other objects, show a generic representation
      return (
        <span className="text-sm font-bold text-gray-900">
          Object data
        </span>
      );
    }
    
    return (
      <span className="text-sm font-bold text-gray-900">
        {String(value || '-')}
      </span>
    );
  };

  const columns = Object.keys(data[0]).filter(key => key !== 'id');

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{activeTab?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Entries</h2>
      </div>
      <div className="overflow-hidden">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column}
                  className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider break-words"
                >
                  {column === 'enterd' ? 'entered' : 
                   column === 'scheduledStart' ? 'scheduled start' :
                   column === 'scheduledEnd' ? 'scheduled end' :
                   column.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const isDateField = column.includes('time') || column.includes('date') || column.includes('Start') || column.includes('End') || column === 'scheduledStart' || column === 'scheduledEnd' || column === 'enterd' || column === 'exited';
                  return (
                    <td key={column} className={`px-3 py-4 ${isDateField ? 'break-words' : 'truncate'}`}>
                      {renderCellContent(item, column)}
                    </td>
                  );
                })}
                <td className="px-3 py-4 text-sm font-medium w-32">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Form Modal Component
const FormModal = ({ isOpen, onClose, title, fields, formData, onChange, onSubmit, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type}
                  required={field.required}
                  value={formData[field.key] || ''}
                  onChange={(e) => onChange({ ...formData, [field.key]: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Main Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for different entities
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [operations, setOperations] = useState([]);
  const [operationLanes, setOperationLanes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [cleaning, setCleaning] = useState([]);
  const [cleaningLanes, setCleaningLanes] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [inspectionLanes, setInspectionLanes] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [maintenanceLanes, setMaintenanceLanes] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [logs, setLogs] = useState([]);
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleError = (error) => {
    console.error('API Error:', error);
    setError(error.message || 'An error occurred');
    setTimeout(() => setError(''), 5000);
  };

  const handleSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleNavigate = (route) => {
    // Handle navigation to external routes
    // If using React Router, you would use navigate(route) here
    // For now, we'll use window.location as fallback
    window.location.href = route;
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await adminService.getUsers();
          setUsers(Array.isArray(usersData) ? usersData : []);
          break;
        case 'roles':
          const rolesData = await adminService.getRoles();
          setRoles(Array.isArray(rolesData) ? rolesData : []);
          break;
        case 'departments':
          const deptData = await adminService.getDepartments();
          setDepartments(Array.isArray(deptData) ? deptData : []);
          break;
        case 'operations':
          const opsData = await adminService.getOperations();
          setOperations(Array.isArray(opsData) ? opsData : []);
          break;
        case 'operation-lanes':
          const opLanesData = await adminService.getOperationLanes();
          setOperationLanes(Array.isArray(opLanesData) ? opLanesData : []);
          break;
        case 'timetable':
          const timetableData = await adminService.getTimetable();
          // Handle timetable data which might be an object with nested arrays
          if (timetableData && typeof timetableData === 'object') {
            const flattenedData = Object.values(timetableData).flat();
            setTimetable(Array.isArray(flattenedData) ? flattenedData : []);
          } else {
            setTimetable(Array.isArray(timetableData) ? timetableData : []);
          }
          break;
        case 'cleaning':
          const cleaningData = await adminService.getCleaningSchedules();
          setCleaning(Array.isArray(cleaningData) ? cleaningData : []);
          break;
        case 'cleaning-lanes':
          const cleanLanesData = await adminService.getCleaningLanes();
          setCleaningLanes(Array.isArray(cleanLanesData) ? cleanLanesData : []);
          break;
        case 'inspections':
          const inspectionData = await adminService.getInspections();
          setInspections(Array.isArray(inspectionData) ? inspectionData : []);
          break;
        case 'inspection-lanes':
          const inspectLanesData = await adminService.getInspectionLanes();
          setInspectionLanes(Array.isArray(inspectLanesData) ? inspectLanesData : []);
          break;
        case 'job-cards':
          const jobCardsData = await adminService.getJobCards();
          setJobCards(Array.isArray(jobCardsData) ? jobCardsData : []);
          break;
        case 'logs':
          const logsData = await adminService.getLogs();
          setLogs(Array.isArray(logsData) ? logsData : []);
          break;
        case 'maintenance':
          const maintData = await adminService.getMaintenanceEntries();
          setMaintenance(Array.isArray(maintData) ? maintData : []);
          break;
        case 'maintenance-lanes':
          const maintLanesData = await adminService.getMaintenanceLanes();
          setMaintenanceLanes(Array.isArray(maintLanesData) ? maintLanesData : []);
          break;
          // In your AdminDashboard component, add this case
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          await adminService.createUser(data);
          break;
        case 'roles':
          await adminService.createRole(data);
          break;
        case 'departments':
          await adminService.createDepartment(data);
          break;
        case 'operations':
          await adminService.createOperation(data);
          break;
        case 'operation-lanes':
          await adminService.createOperationLane(data);
          break;
        case 'timetable':
          await adminService.createTimetableEntry(data);
          break;
        case 'cleaning':
          await adminService.createCleaningEntry(data);
          break;
        case 'cleaning-lanes':
          await adminService.createCleaningLane(data);
          break;
        case 'inspections':
          await adminService.createInspectionEntry(data);
          break;
        case 'inspection-lanes':
          await adminService.createInspectionLane(data);
          break;
        case 'maintenance':
          await adminService.createMaintenanceEntry(data);
          break;
        case 'maintenance-lanes':
          await adminService.createMaintenanceLane(data);
          break;
      }
      handleSuccess('Item created successfully');
      setShowForm(false);
      setFormData({});
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          await adminService.updateUser(data);
          break;
        case 'roles':
          await adminService.updateRole(data);
          break;
        case 'departments':
          await adminService.updateDepartment(data);
          break;
        case 'operations':
          await adminService.updateOperation(data);
          break;
        case 'operation-lanes':
          await adminService.updateOperationLane(data);
          break;
        case 'timetable':
          await adminService.updateTimetableEntry(data);
          break;
        case 'cleaning':
          await adminService.updateCleaningEntry(data);
          break;
        case 'cleaning-lanes':
          await adminService.updateCleaningLane(data);
          break;
        case 'inspections':
          await adminService.updateInspectionEntry(data);
          break;
        case 'inspection-lanes':
          await adminService.updateInspectionLane(data);
          break;
        case 'maintenance':
          await adminService.updateMaintenanceEntry(data);
          break;
        case 'maintenance-lanes':
          await adminService.updateMaintenanceLane(data);
          break;
      }
      handleSuccess('Item updated successfully');
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case 'operations':
          await adminService.deleteOperation(id);
          break;
        case 'operation-lanes':
          await adminService.deleteOperationLane(id);
          break;
        case 'timetable':
          await adminService.deleteTimetableEntry(id);
          break;
        case 'cleaning':
          await adminService.deleteCleaningEntry(id);
          break;
        case 'cleaning-lanes':
          await adminService.deleteCleaningLane(id);
          break;
        case 'inspections':
          await adminService.deleteInspectionEntry(id);
          break;
        case 'inspection-lanes':
          await adminService.deleteInspectionLane(id);
          break;
        case 'maintenance':
          await adminService.deleteMaintenanceEntry(id);
          break;
        case 'maintenance-lanes':
          await adminService.deleteMaintenanceLane(id);
          break;
        default:
          throw new Error('Delete not supported for this entity');
      }
      handleSuccess('Item deleted successfully');
      loadData();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'users': return users;
      case 'roles': return roles;
      case 'departments': return departments;
      case 'operations': return operations;
      case 'operation-lanes': return operationLanes;
      case 'timetable': return timetable;
      case 'cleaning': return cleaning;
      case 'cleaning-lanes': return cleaningLanes;
      case 'inspections': return inspections;
      case 'inspection-lanes': return inspectionLanes;
      case 'job-cards': return jobCards;
      case 'logs': return logs;
      case 'maintenance': return maintenance;
      case 'maintenance-lanes': return maintenanceLanes;
      default: return [];
    }
  };

  const getFormFields = () => {
    switch (activeTab) {
      case 'users':
        return [
          { key: 'username', label: 'Username', type: 'text', required: true },
          { key: 'password', label: 'Password', type: 'password', required: !editingItem },
          { key: 'first_name', label: 'First Name', type: 'text' },
          { key: 'last_name', label: 'Last Name', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'department', label: 'Department ID', type: 'number' },
          { key: 'designation', label: 'Designation ID', type: 'number' },
          { key: 'depot', label: 'Depot ID', type: 'number' },
        ];
      case 'roles':
        return [
          { key: 'name', label: 'Role Name', type: 'text', required: true },
        ];
      case 'departments':
        return [
          { key: 'name', label: 'Department Name', type: 'text', required: true },
        ];
      case 'operations':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'operation-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'timetable':
        return [
          { key: 'date', label: 'Date', type: 'date', required: true },
          { key: 'train_number', label: 'Train Number', type: 'text' },
          { key: 'starting_point', label: 'Starting Point', type: 'text' },
          { key: 'starting_time', label: 'Starting Time', type: 'datetime-local' },
          { key: 'ending_point', label: 'Ending Point', type: 'text' },
          { key: 'ending_time', label: 'Ending Time', type: 'datetime-local' },
          { key: 'train_id', label: 'Train ID', type: 'number' },
        ];
      case 'cleaning':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'cleaning-lanes':
        return [
          { key: 'bay_number', label: 'Bay Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'inspections':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'inspection-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      case 'maintenance':
        return [
          { key: 'lane', label: 'Lane ID', type: 'number', required: true },
          { key: 'train', label: 'Train ID', type: 'number', required: true },
          { key: 'scheduledStart', label: 'Scheduled Start', type: 'datetime-local' },
          { key: 'scheduledEnd', label: 'Scheduled End', type: 'datetime-local' },
          { key: 'enterd', label: 'Entered', type: 'datetime-local' },
          { key: 'exited', label: 'Exited', type: 'datetime-local' },
        ];
      case 'maintenance-lanes':
        return [
          { key: 'lane_number', label: 'Lane Number', type: 'number', required: true },
          { key: 'depot', label: 'Depot ID', type: 'number', required: true },
        ];
      default:
        return [];
    }
  };

  const canDelete = () => {
    return ['operations', 'operation-lanes', 'timetable', 'cleaning', 'cleaning-lanes', 
            'inspections', 'inspection-lanes', 'maintenance', 'maintenance-lanes'].includes(activeTab);
  };

  const canCreate = () => {
    // Job cards are read-only, cannot be created from this interface
    // Route map is navigation-only, no data to create
    return !['job-cards', 'route-map','branding-deals'].includes(activeTab);
  };

  const canEdit = () => {
    // Job cards are read-only, cannot be edited from this interface
    // Route map is navigation-only, no data to edit
    return !['job-cards', 'route-map','branding-deals'].includes(activeTab);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdate({ ...formData, id: editingItem.id });
    } else {
      handleCreate(formData);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : {});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const getTabDisplayName = () => {
    return activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getActiveCount = (data) => {
    if (!Array.isArray(data)) return 0;
    // You can add logic here to count active items based on status fields
    return data.length;
  };

  const getLastUpdated = () => {
    return new Date().toLocaleString();
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 lg:ml-0 p-6">
          {/* Alerts */}
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError('')} 
            />
          )}
          {success && (
            <Alert 
              type="success" 
              message={success} 
              onClose={() => setSuccess('')} 
            />
          )}

          {/* Content Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getTabDisplayName()}</h2>
                <p className="text-gray-600 mt-1">Manage {activeTab.replace('-', ' ')} in your railway system</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
                
                {canCreate() && (
                  <button
                    onClick={() => openForm()}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus size={16} />
                    <span>Add New</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">{getCurrentData().length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Items</p>
                  <p className="text-2xl font-bold text-gray-900">{getActiveCount(getCurrentData())}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm font-bold text-gray-900">{getLastUpdated()}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <RefreshCw size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-green-600">Online</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Data Table */}
          {/* <DataTable 
            data={getCurrentData()}
            onEdit={openForm}
            onDelete={handleDelete}
            canDelete={canDelete()}
            loading={loading}
            activeTab={activeTab}
          /> */}
{/* Content Area - Conditional Rendering */}
          {activeTab === 'branding-deals' ? (
            <BrandingDealsComponent />
          ) : (
            <>
              {/* Stats Cards - Only show for non-branding deals tabs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Records</p>
                      <p className="text-2xl font-bold text-gray-900">{getCurrentData().length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Items</p>
                      <p className="text-2xl font-bold text-gray-900">{getActiveCount(getCurrentData())}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Updated</p>
                      <p className="text-sm font-bold text-gray-900">{getLastUpdated()}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <RefreshCw size={24} className="text-yellow-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-2xl font-bold text-green-600">Online</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <DataTable 
                data={getCurrentData()}
                onEdit={openForm}
                onDelete={handleDelete}
                canDelete={canDelete()}
                loading={loading}
                activeTab={activeTab}
              />
            </>
          )}
          {/* Form Modal */}
          {canCreate() && (
            <FormModal
              isOpen={showForm}
              onClose={closeForm}
              title={`${editingItem ? 'Edit' : 'Add'} ${getTabDisplayName()}`}
              fields={getFormFields()}
              formData={formData}
              onChange={setFormData}
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;