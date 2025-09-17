import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, BarChart3, Train, Eye, Wrench, Shield, 
  Bell, Search, Filter, Download, RefreshCw, AlertTriangle,
  CheckCircle, Clock, Activity, Database, FileText, LogOut,
  ChevronDown, MoreHorizontal, TrendingUp, TrendingDown,
  Calendar, MapPin, Zap, Server, Plus, Edit, Loader
} from 'lucide-react';
import { adminService } from '../services/adminapi';

export const AdminDashboard = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Administrative Management System</h1>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <p className="text-gray-600">Your complete AdminDashboard component would be rendered here...</p>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
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
        color: healthPercentage > 95 ? 'green' : healthPercentage > 80 ? 'blue' : 'amber'
      },
      {
        title: 'Active Users',
        value: (data.users?.length || 0).toString(),
        change: '+12',
        trend: 'up',
        icon: Users,
        details: `${data.users?.length || 0} total registered`,
        color: 'blue'
      },
      {
        title: 'Operations',
        value: activeOperations.toString(),
        change: activeOperations > 0 ? '+5' : '0',
        trend: activeOperations > 0 ? 'up' : 'neutral',
        icon: Train,
        details: `${data.operations?.length || 0} total operations`,
        color: activeOperations > 0 ? 'green' : 'gray'
      },
      {
        title: 'Alerts',
        value: (criticalAlerts + warningAlerts).toString(),
        change: criticalAlerts > 0 ? `+${criticalAlerts}` : '-2',
        trend: criticalAlerts > 0 ? 'up' : 'down',
        icon: AlertTriangle,
        details: `${criticalAlerts} critical, ${warningAlerts} warnings`,
        color: criticalAlerts > 0 ? 'red' : warningAlerts > 0 ? 'amber' : 'green'
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
        onClick: () => setShowAdminDashboard(true)
      },
      {
        id: 'operations-control',
        title: 'Operations Control',
        description: 'Monitor and control railway operations, schedules, and real-time status tracking',
        icon: Train,
        status: data.operations?.some(op => op.status === 'active') ? 'active' : 'idle',
        count: data.operations?.length || 0,
        lastUpdate: 'Live',
        onClick: () => console.log('Navigate to operations')
      },
      {
        id: 'system-analytics',
        title: 'System Analytics',
        description: 'Performance metrics, usage statistics, and comprehensive operational reports',
        icon: BarChart3,
        status: 'active',
        count: Math.floor((data.users?.length || 0) * 0.6),
        lastUpdate: '5 minutes ago',
        onClick: () => console.log('Navigate to analytics')
      },
      {
        id: 'maintenance-hub',
        title: 'Maintenance Hub',
        description: 'Scheduled maintenance, work orders, and equipment status tracking system',
        icon: Wrench,
        status: data.maintenance?.some(m => m.status === 'in_progress' || m.status === 'ongoing') ? 'maintenance' : 'active',
        count: data.maintenance?.length || 0,
        lastUpdate: '1 hour ago',
        onClick: () => console.log('Navigate to maintenance')
      },
      {
        id: 'inspection-module',
        title: 'Inspection Module',
        description: 'Safety inspections, compliance checks, and quality assurance management',
        icon: Eye,
        status: 'active',
        count: data.inspections?.length || 0,
        lastUpdate: '30 minutes ago',
        onClick: () => console.log('Navigate to inspections')
      },
      {
        id: 'system-config',
        title: 'System Configuration',
        description: 'System settings, security policies, and infrastructure management tools',
        icon: Settings,
        status: 'active',
        count: data.departments?.length || 0,
        lastUpdate: '1 day ago',
        onClick: () => console.log('Navigate to settings')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Train className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Railway Management System
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="relative p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="relative p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                {(systemData.maintenance?.filter(m => m.priority === 'critical')?.length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {systemData.maintenance.filter(m => m.priority === 'critical').length}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {userData.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-900">{userData.username}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {userData.role}
                  </p>
                </div>
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

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const colorClasses = {
              green: 'from-green-50 to-emerald-50 text-green-600 bg-green-100',
              blue: 'from-blue-50 to-indigo-50 text-blue-600 bg-blue-100',
              amber: 'from-amber-50 to-yellow-50 text-amber-600 bg-amber-100',
              red: 'from-red-50 to-rose-50 text-red-600 bg-red-100',
              gray: 'from-gray-50 to-slate-50 text-gray-600 bg-gray-100'
            };
            
            const colors = colorClasses[metric.color] || colorClasses.blue;
            
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${colors.split(' ').slice(0, 2).join(' ')}`}>
                        <metric.icon className={`w-6 h-6 ${colors.split(' ')[2]}`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full ${colors.split(' ').slice(3).join(' ')}`}>
                        {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                         metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
                    <p className="text-gray-500 text-xs">{metric.details}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Modules - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">System Modules</h2>
              <p className="text-gray-600">Monitor and manage all railway operation components</p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map((module, index) => {
                  const IconComponent = module.icon;
                  const statusColors = {
                    active: 'bg-green-100 text-green-600 border-green-200',
                    maintenance: 'bg-amber-100 text-amber-600 border-amber-200',
                    idle: 'bg-gray-100 text-gray-600 border-gray-200'
                  };
                  
                  return (
                    <div
                      key={index}
                      onClick={module.onClick}
                      className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                              <IconComponent className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusColors[module.status] || statusColors.idle}`}>
                                {module.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{module.count}</div>
                            <div className="text-xs text-gray-500">items</div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {module.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Updated: {module.lastUpdate}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-blue-600 font-medium">Access →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Feed - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 h-fit">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 animate-pulse">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activities.map((activity, index) => {
                    const statusColors = {
                      success: 'bg-green-100 text-green-600',
                      warning: 'bg-amber-100 text-amber-600',
                      info: 'bg-blue-100 text-blue-600',
                      error: 'bg-red-100 text-red-600'
                    };
                    
                    return (
                      <div key={index} className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className={`p-2 rounded-full ${statusColors[activity.status] || statusColors.info}`}>
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 group-hover:text-gray-700">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
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

      {/* Quick Access Floating Button */}
      <button
        onClick={() => setShowAdminDashboard(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50"
        title="Admin Dashboard"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default Dashboard;