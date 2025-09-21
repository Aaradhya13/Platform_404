import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, BarChart3, Train, Eye, Wrench, Shield, 
  Bell, Search, Filter, Download, RefreshCw, AlertTriangle,
  CheckCircle, Clock, Activity, Database, FileText, LogOut,
  ChevronDown, MoreHorizontal, TrendingUp, TrendingDown,
  Calendar, MapPin, Zap, Server, Plus, Edit, Loader
} from 'lucide-react';
import { adminService } from '../services/adminapi';

import LogoutButton from '../components/LogoutButton.jsx';
export const Dashboard = () => {
  const nav=useNavigate();
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [systemData, setSystemData] = useState({
    users: [],
    operations: [],
    maintenance: [],
    inspections: [],
    cleaning: [],
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user data from localStorage
  const userData = {
    role: localStorage.getItem('userRole') || 'System Administrator',
    username: localStorage.getItem('username') || 'John Smith',
    department: localStorage.getItem('department') || 'Railway Operations Control',
    avatar: localStorage.getItem('userAvatar') || null
  };

  // Navigation function to redirect to admin routes
  const navigateToAdmin = (route) => {
    window.location.href = `/admin/${route}`;
  };

  // Fetch all system data
  const fetchSystemData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        usersResponse,
        operationsResponse,
        maintenanceResponse,
        inspectionsResponse,
        cleaningResponse,
        departmentsResponse
      ] = await Promise.allSettled([
        adminService.getUsers(),
        adminService.getOperations?.() || Promise.resolve([]),
        adminService.getMaintenance?.() || Promise.resolve([]),
        adminService.getInspections?.() || Promise.resolve([]),
        adminService.getCleaning?.() || Promise.resolve([]),
        adminService.getDepartments?.() || Promise.resolve([])
      ]);

      setSystemData({
        users: usersResponse.status === 'fulfilled' ? usersResponse.value : [],
        operations: operationsResponse.status === 'fulfilled' ? operationsResponse.value : [],
        maintenance: maintenanceResponse.status === 'fulfilled' ? maintenanceResponse.value : [],
        inspections: inspectionsResponse.status === 'fulfilled' ? inspectionsResponse.value : [],
        cleaning: cleaningResponse.status === 'fulfilled' ? cleaningResponse.value : [],
        departments: departmentsResponse.status === 'fulfilled' ? departmentsResponse.value : []
      });

      // Log any failed requests
      if (usersResponse.status === 'rejected') {
        console.warn('Failed to fetch users:', usersResponse.reason);
      }
      if (operationsResponse.status === 'rejected') {
        console.warn('Failed to fetch operations:', operationsResponse.reason);
      }
      if (maintenanceResponse.status === 'rejected') {
        console.warn('Failed to fetch maintenance:', maintenanceResponse.reason);
      }

    } catch (err) {
      console.error('Error fetching system data:', err);
      setError('Failed to load system data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchSystemData();
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchSystemData();
  }, []);

  // Calculate metrics from API data
  const calculateMetrics = (data) => {
    const activeOperations = data.operations?.filter(op => 
      op.status === 'active' || op.status === 'running' || op.status === 'operational'
    )?.length || 0;
    
    const criticalAlerts = data.maintenance?.filter(m => 
      m.priority === 'critical' || m.status === 'critical' || m.urgency === 'high'
    )?.length || 0;
    
    const warningAlerts = data.maintenance?.filter(m => 
      m.priority === 'warning' || m.status === 'warning' || m.urgency === 'medium'
    )?.length || 0;
    
    // Calculate system health based on operational status and critical issues
    const totalSystems = 6;
    const healthReduction = criticalAlerts * 5; // Each critical issue reduces health by 5%
    const baseHealth = Math.max(85, 100 - healthReduction);
    const healthPercentage = baseHealth.toFixed(1);

    return [
      {
        title: 'System Health',
        value: `${healthPercentage}%`,
        change: criticalAlerts === 0 ? '+0.1%' : '-2.3%',
        trend: criticalAlerts === 0 ? 'up' : 'down',
        icon: Activity,
        details: criticalAlerts === 0 ? 'All systems operational' : `${criticalAlerts} critical issues`,
        color: healthPercentage > 95 ? 'success' : healthPercentage > 80 ? 'primary' : 'warning'
      },
      {
        title: 'Active Users',
        value: (data.users?.length || 0).toString(),
        change: '+12',
        trend: 'up',
        icon: Users,
        details: `${data.users?.length || 0} total registered`,
        color: 'primary'
      },
      {
        title: 'Operations',
        value: activeOperations.toString(),
        change: activeOperations > 0 ? '+5' : '0',
        trend: activeOperations > 0 ? 'up' : 'neutral',
        icon: Train,
        details: `${data.operations?.length || 0} total operations`,
        color: activeOperations > 0 ? 'success' : 'neutral'
      },
      {
        title: 'Alerts',
        value: (criticalAlerts + warningAlerts).toString(),
        change: criticalAlerts > 0 ? `+${criticalAlerts}` : '-2',
        trend: criticalAlerts > 0 ? 'up' : 'down',
        icon: AlertTriangle,
        details: `${criticalAlerts} critical, ${warningAlerts} warnings`,
        color: criticalAlerts > 0 ? 'danger' : warningAlerts > 0 ? 'warning' : 'success'
      }
    ];
  };

  // Generate modules with real data counts
  const generateModules = (data) => {
    const now = new Date();
    return [
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Manage user accounts, roles, permissions, and access controls across the system',
        icon: Users,
        status: 'active',
        count: data.users?.length || 0,
        lastUpdate: '2 minutes ago',
        onClick: () => navigateToAdmin('usesr-management')
      },
      {
        id: 'operations-control',
        title: 'Operations Control',
        description: 'Monitor and control railway operations, schedules, and real-time status tracking',
        icon: Train,
        status: data.operations?.some(op => op.status === 'active') ? 'active' : 'idle',
        count: data.operations?.length || 0,
        lastUpdate: 'Live',
        onClick: () => navigateToAdmin('usesr-management')
      },
      {
        id: 'system-analytics',
        title: 'System Analytics',
        description: 'Performance metrics, usage statistics, and comprehensive operational reports',
        icon: BarChart3,
        status: 'active',
        count: Math.floor((data.users?.length || 0) * 0.6),
        lastUpdate: '5 minutes ago',
        onClick: () => navigateToAdmin('usesr-management')
      },
      {
        id: 'maintenance-hub',
        title: 'Maintenance Hub',
        description: 'Scheduled maintenance, work orders, and equipment status tracking system',
        icon: Wrench,
        status: data.maintenance?.some(m => m.status === 'in_progress' || m.status === 'ongoing') ? 'maintenance' : 'active',
        count: data.maintenance?.length || 0,
        lastUpdate: '1 hour ago',
        onClick: () => navigateToAdmin('usesr-management')
      },
      {
        id: 'inspection-module',
        title: 'Inspection Module',
        description: 'Safety inspections, compliance checks, and quality assurance management',
        icon: Eye,
        status: 'active',
        count: data.inspections?.length || 0,
        lastUpdate: '30 minutes ago',
        onClick: () => navigateToAdmin('usesr-management')
      },
      {
        id: 'system-config',
        title: 'System Configuration',
        description: 'System settings, security policies, and infrastructure management tools',
        icon: Settings,
        status: 'active',
        count: data.departments?.length || 0,
        lastUpdate: '1 day ago',
        onClick: () => navigateToAdmin('usesr-management')
      }
    ];
  };

  // Generate activities from recent data
  const generateActivities = (data) => {
    const activities = [];
    const now = new Date();
    
    // Add user-related activities
    if (data.users?.length > 0) {
      activities.push({
        type: 'user',
        message: `${data.users.length} users registered in system`,
        time: '2 min ago',
        status: 'info',
        icon: Users
      });
    }

    // Add operation activities
    if (data.operations?.length > 0) {
      const activeOps = data.operations.filter(op => 
        op.status === 'active' || op.status === 'running' || op.status === 'operational'
      );
      activities.push({
        type: 'system',
        message: `${activeOps.length} of ${data.operations.length} operations are active`,
        time: '5 min ago',
        status: 'success',
        icon: Train
      });
    }

    // Add maintenance alerts
    if (data.maintenance?.length > 0) {
      const criticalMaint = data.maintenance.filter(m => 
        m.priority === 'critical' || m.status === 'critical' || m.urgency === 'high'
      );
      if (criticalMaint.length > 0) {
        activities.push({
          type: 'alert',
          message: `${criticalMaint.length} critical maintenance items require immediate attention`,
          time: '12 min ago',
          status: 'warning',
          icon: AlertTriangle
        });
      } else {
        activities.push({
          type: 'maintenance',
          message: `${data.maintenance.length} maintenance items tracked`,
          time: '15 min ago',
          status: 'success',
          icon: Wrench
        });
      }
    }

    // Add inspection activities
    if (data.inspections?.length > 0) {
      activities.push({
        type: 'security',
        message: `${data.inspections.length} inspections scheduled and monitored`,
        time: '45 min ago',
        status: 'info',
        icon: Eye
      });
    }

    // Add cleaning activities  
    if (data.cleaning?.length > 0) {
      activities.push({
        type: 'update',
        message: `${data.cleaning.length} cleaning schedules are active`,
        time: '1 hour ago',
        status: 'success',
        icon: RefreshCw
      });
    }

    // Add department info
    if (data.departments?.length > 0) {
      activities.push({
        type: 'info',
        message: `${data.departments.length} departments configured in system`,
        time: '2 hours ago',
        status: 'info',
        icon: Database
      });
    }

    // Fallback activities if no data
    if (activities.length === 0) {
      activities.push(
        { 
          type: 'system', 
          message: 'System initialized and ready for operation', 
          time: '1 min ago', 
          status: 'success',
          icon: CheckCircle
        },
        { 
          type: 'info', 
          message: 'Loading system data from API services...', 
          time: '2 min ago', 
          status: 'info',
          icon: Database
        }
      );
    }

    return activities.slice(0, 6); // Limit to 6 activities
  };

  const metrics = calculateMetrics(systemData);
  const modules = generateModules(systemData);
  const activities = generateActivities(systemData);

  if (showAdminDashboard) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#24B6C9' }}
                >
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Railway Management System</h1>
                  <p className="text-sm text-gray-600">
                    {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                style={{ hover: { color: '#24B6C9' } }}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                style={{ hover: { color: '#24B6C9' } }}
              >
                <Bell className="w-5 h-5" />
                {(systemData.maintenance?.filter(m => m.priority === 'critical')?.length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {systemData.maintenance.filter(m => m.priority === 'critical').length}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3 pl-3 ml-3 border-l border-gray-200">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: '#24B6C9' }}
                >
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    userData.username.split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{userData.username}</p>
                  <p className="text-gray-500 text-xs">{userData.role}</p>
                </div>
                <LogoutButton variant="header" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <button 
                onClick={handleRefresh}
                className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const getColorStyles = (color) => {
              switch (color) {
                case 'success':
                  return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconText: 'text-green-600',
                    badge: 'bg-green-100 text-green-800'
                  };
                case 'primary':
                  return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconText: 'text-blue-600',
                    badge: 'bg-blue-100 text-blue-800'
                  };
                case 'warning':
                  return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconText: 'text-yellow-600',
                    badge: 'bg-yellow-100 text-yellow-800'
                  };
                case 'danger':
                  return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconText: 'text-red-600',
                    badge: 'bg-red-100 text-red-800'
                  };
                default:
                  return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    iconBg: 'bg-gray-100',
                    iconText: 'text-gray-600',
                    badge: 'bg-gray-100 text-gray-800'
                  };
              }
            };
            
            const colors = getColorStyles(metric.color);
            
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-6 transition-all hover:shadow-md`}>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${colors.iconBg} p-2 rounded-lg`}>
                        <metric.icon className={`w-5 h-5 ${colors.iconText}`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                         metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div className="mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                      <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                    </div>
                    <p className="text-xs text-gray-500">{metric.details}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* System Modules - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Modules</h2>
                <p className="text-sm text-gray-600 mt-1">Monitor and manage all railway operation components</p>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules.map((module, index) => {
                      const IconComponent = module.icon;
                      const getStatusStyles = (status) => {
                        switch (status) {
                          case 'active':
                            return 'bg-green-100 text-green-800 border-green-200';
                          case 'maintenance':
                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          case 'idle':
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                          default:
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };
                      
                      return (
                        <div
                          key={index}
                          onClick={module.onClick}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                              style={{ backgroundColor: '#24B6C9' }}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{module.count}</div>
                              <div className="text-xs text-gray-500">items</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#24B6C9] transition-colors">
                              {module.title}
                            </h3>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(module.status)}`}>
                              {module.status}
                            </span>
                            <span className="text-xs text-gray-500">Updated: {module.lastUpdate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 h-fit">
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => {
                      const getStatusStyles = (status) => {
                        switch (status) {
                          case 'success':
                            return 'bg-green-100 text-green-600';
                          case 'warning':
                            return 'bg-yellow-100 text-yellow-600';
                          case 'info':
                            return 'text-white';
                          case 'error':
                            return 'bg-red-100 text-red-600';
                          default:
                            return 'text-white';
                        }
                      };
                      
                      return (
                        <div key={index} className="flex items-start space-x-3 py-2 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                          <div 
                            className={`p-1.5 rounded-full ${activity.status === 'info' ? '' : getStatusStyles(activity.status)}`}
                            style={activity.status === 'info' ? { backgroundColor: '#24B6C9' } : {}}
                          >
                            <activity.icon className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-tight">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Floating Action Button */}
      <button
        onClick={() => navigateToAdmin('usesr-management')}
        className="fixed bottom-6 right-20 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center px-4 py-3 font-medium"
        style={{ backgroundColor: '#24B6C9' }}
        title="Admin Management"
      >
        <Users className="w-5 h-5 mr-2" />
        <span>Admin Panel</span>
      </button>
       <button
        onClick={() => nav("/shunting")}
        className="fixed bottom-20 right-19 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center px-4 py-3 font-medium"
        style={{ backgroundColor: '#24B6C9' }}
        title="Admin Management"
      >
        <Users className="w-5 h-5 mr-2" />
        <span>shunting simulation</span>
      </button>
    </div>
  );
};

export default Dashboard;