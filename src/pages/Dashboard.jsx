// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { useNavigate } from 'react-router-dom';
// // import { Train, Settings, Users, BarChart3, Sparkles } from 'lucide-react';

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const userRole = localStorage.getItem('role');
// //   const username = localStorage.getItem('username');
// //   const department = localStorage.getItem('department');

// //   const adminModules = [
// //     {
// //       title: 'Cleaning Management',
// //       description: 'Manage cleaning schedules, create entries, and manage lanes',
// //       icon: Train,
// //       color: 'bg-blue-600 hover:bg-blue-700',
// //       path: '/cleaning'
// //     },
// //     {
// //       title: 'Inspection Management',
// //       description: 'Manage train inspections and maintenance schedules',
// //       icon: Settings,
// //       color: 'bg-green-600 hover:bg-green-700',
// //       path: '/inspection'
// //     },
// //     {
// //       title: 'Maintenance Management',
// //       description: 'Manage maintenance tasks and schedules',
// //       icon: Settings,
// //       color: 'bg-red-600 hover:bg-red-700',
// //       path: '/maintenance'
// //     },
// //     {
// //       title: 'Operations Management',
// //       description: 'Manage daily operations and schedules',
// //       icon: BarChart3,
// //       color: 'bg-purple-600 hover:bg-purple-700',
// //       path: '/operations'
// //     }
// //   ];

// //   return (
// //     <div className="space-y-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
// //       {/* Animated Welcome Section */}
// //       <motion.div 
// //         initial={{ opacity: 0, y: -30, scale: 0.95 }}
// //         animate={{ opacity: 1, y: 0, scale: 1 }}
// //         transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
// //         className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl"
// //       >
// //         {/* Floating particles */}
// //         <div className="absolute inset-0">
// //           {[...Array(8)].map((_, i) => (
// //             <motion.div
// //               key={i}
// //               className="absolute w-3 h-3 bg-white/20 rounded-full"
// //               animate={{
// //                 x: [0, 100, 0],
// //                 y: [0, -80, 0],
// //                 opacity: [0.2, 0.8, 0.2],
// //                 scale: [1, 1.5, 1]
// //               }}
// //               transition={{
// //                 duration: 6 + i,
// //                 repeat: Infinity,
// //                 delay: i * 0.8
// //               }}
// //               style={{
// //                 left: `${10 + i * 12}%`,
// //                 top: `${20 + i * 8}%`
// //               }}
// //             />
// //           ))}
// //         </div>
        
// //         <div className="relative z-10">
// //           <motion.div
// //             className="flex items-center gap-4 mb-4"
// //             initial={{ opacity: 0, x: -30 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.3, duration: 0.6 }}
// //           >
// //             <motion.div
// //               animate={{ rotate: [0, 360] }}
// //               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
// //               className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
// //             >
// //               <Sparkles className="w-8 h-8 text-yellow-300" />
// //             </motion.div>
// //             <div>
// //               <motion.h1 
// //                 className="text-4xl font-bold mb-2"
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: 0.5, duration: 0.6 }}
// //               >
// //                 Welcome back, {username}! 🚀
// //               </motion.h1>
// //               <motion.p 
// //                 className="text-blue-100 text-lg"
// //                 initial={{ opacity: 0, y: 20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 transition={{ delay: 0.7, duration: 0.6 }}
// //               >
// //                 Role: <span className="font-semibold text-yellow-300">{userRole}</span> | Department: <span className="font-semibold text-yellow-300">{department}</span>
// //               </motion.p>
// //             </div>
// //           </motion.div>
          
// //           {/* Live indicator */}
// //           <motion.div
// //             className="absolute top-6 right-6 flex items-center gap-2"
// //             initial={{ opacity: 0, scale: 0.8 }}
// //             animate={{ opacity: 1, scale: 1 }}
// //             transition={{ delay: 0.9 }}
// //           >
// //             <motion.div
// //               className="w-3 h-3 bg-green-400 rounded-full"
// //               animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
// //               transition={{ duration: 2, repeat: Infinity }}
// //             />
// //             <span className="text-green-200 text-sm font-medium">System Online</span>
// //           </motion.div>
// //         </div>
// //       </motion.div>

// //       {userRole === 'admin' && (
// //         <motion.div 
// //           initial={{ opacity: 0, y: 30 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.4, duration: 0.8 }}
// //           className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden"
// //         >
// //           {/* Background decoration */}
// //           <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -translate-y-20 translate-x-20 opacity-50" />
          
// //           <motion.h2 
// //             className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 relative z-10"
// //             initial={{ opacity: 0, x: -20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.6, duration: 0.6 }}
// //           >
// //             📊 Admin Control Center
// //           </motion.h2>
          
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
// //             {adminModules.map((module, index) => {
// //               const IconComponent = module.icon;
// //               return (
// //                 <motion.div
// //                   key={index}
// //                   initial={{ opacity: 0, y: 20, scale: 0.9 }}
// //                   animate={{ opacity: 1, y: 0, scale: 1 }}
// //                   transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
// //                   onClick={() => navigate(module.path)}
// //                   whileHover={{ 
// //                     scale: 1.05, 
// //                     y: -8,
// //                     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
// //                   }}
// //                   whileTap={{ scale: 0.98 }}
// //                   className="cursor-pointer group"
// //                 >
// //                   <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
// //                     {/* Hover gradient overlay */}
// //                     <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
// //                     <div className="relative z-10">
// //                       <motion.div 
// //                         className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
// //                         whileHover={{ rotate: 360, scale: 1.1 }}
// //                         transition={{ duration: 0.6 }}
// //                       >
// //                         <IconComponent size={28} className="text-white" />
// //                       </motion.div>
                      
// //                       <motion.h3 
// //                         className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors"
// //                         initial={{ opacity: 0.8 }}
// //                         whileHover={{ opacity: 1 }}
// //                       >
// //                         {module.title}
// //                       </motion.h3>
                      
// //                       <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
// //                         {module.description}
// //                       </p>
                      
// //                       {/* Arrow indicator */}
// //                       <motion.div
// //                         className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
// //                         initial={{ x: -10 }}
// //                         whileHover={{ x: 0 }}
// //                         transition={{ duration: 0.3 }}
// //                       >
// //                         <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
// //                           <span className="text-purple-600 text-lg">→</span>
// //                         </div>
// //                       </motion.div>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               );
// //             })}
// //           </div>
// //         </motion.div>
// //       )}
// //       <button onClick={navigate('/admin/usesr-management')} className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all">
// //         <Users className="w-6 h-6" />
// //       </button>
// //     </div>
// //   );
// // };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { 
  Train, Settings, Users, BarChart3, Sparkles, Shield, Clock, 
  Activity, TrendingUp, Calendar, Eye, Wrench, Building2,
  ChevronRight, Bell, LogOut, User, Menu, X, Plus
} from 'lucide-react';

// Admin Dashboard Component (the one we created earlier)
import AdminDashboard from "../components/AdminDashboard";

export const Dashboard = () => {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications] = useState(3);
  
  // Mock user data - replace with actual localStorage or API data
  const userRole = 'Admin';
  const username = 'John Smith';
  const department = 'Railway Operations';

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions across the system',
      icon: Users,
      color: 'from-blue-500 via-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      stats: '24 Active Users',
      action: () => setShowAdminDashboard(true)
    },
    {
      title: 'Operations Control',
      description: 'Monitor and manage daily railway operations',
      icon: Train,
      color: 'from-emerald-500 via-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      stats: '12 Active Trains',
      action: () => console.log('Navigate to operations')
    },
    {
      title: 'Maintenance Hub',
      description: 'Schedule and track maintenance activities',
      icon: Wrench,
      color: 'from-amber-500 via-orange-500 to-red-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      stats: '8 Pending Tasks',
      action: () => console.log('Navigate to maintenance')
    },
    {
      title: 'Analytics Center',
      description: 'View comprehensive reports and analytics',
      icon: BarChart3,
      color: 'from-purple-500 via-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      stats: '15 Reports',
      action: () => console.log('Navigate to analytics')
    },
    {
      title: 'Inspection Management',
      description: 'Schedule and track train inspections',
      icon: Eye,
      color: 'from-cyan-500 via-blue-500 to-indigo-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      stats: '6 Scheduled',
      action: () => console.log('Navigate to inspections')
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters and preferences',
      icon: Settings,
      color: 'from-gray-600 via-gray-700 to-gray-800',
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      stats: 'All Systems OK',
      action: () => console.log('Navigate to settings')
    }
  ];

  const quickStats = [
    { label: 'Active Trains', value: '24', change: '+12%', icon: Train, color: 'text-green-600' },
    { label: 'On-Time Performance', value: '94.2%', change: '+2.1%', icon: Clock, color: 'text-blue-600' },
    { label: 'System Health', value: '98.5%', change: '+0.3%', icon: Activity, color: 'text-emerald-600' },
    { label: 'User Satisfaction', value: '4.8/5', change: '+0.2', icon: TrendingUp, color: 'text-purple-600' }
  ];

  if (showAdminDashboard) {
    return <AdminDashboard />;
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
                  Railway Command Center
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    {userRole} • {department}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-8 h-8 text-yellow-300" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome back, {username}!
                      </h2>
                      <p className="text-blue-100 text-lg">
                        Managing railway operations with precision and excellence
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                      <span className="text-yellow-300 font-semibold">Role:</span>
                      <span className="text-white ml-2">{userRole}</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                      <span className="text-yellow-300 font-semibold">Department:</span>
                      <span className="text-white ml-2">{department}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/80" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin" style={{animationDuration: '8s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color === 'text-green-600' ? 'from-green-50 to-emerald-50' : stat.color === 'text-blue-600' ? 'from-blue-50 to-indigo-50' : stat.color === 'text-emerald-600' ? 'from-emerald-50 to-teal-50' : 'from-purple-50 to-pink-50'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold ${stat.color} bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Modules */}
      {userRole === 'Admin' && (
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Administrative Control Panel</h2>
            <p className="text-gray-600">Manage all aspects of your railway operations system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={index}
                  onClick={module.action}
                  className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 ${module.bgColor} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <IconComponent className={`w-8 h-8 ${module.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-500">{module.stats}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-blue-600 font-semibold text-sm">Access →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Access Floating Button */}
      <button
        onClick={() => setShowAdminDashboard(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};

// export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { 
//   Users, Settings, BarChart3, Train, Eye, Wrench, Shield, 
//   Bell, Search, Filter, Download, RefreshCw, AlertTriangle,
//   CheckCircle, Clock, Activity, Database, FileText, LogOut,
//   ChevronDown, MoreHorizontal, TrendingUp, TrendingDown,
//   Calendar, MapPin, Zap, Server, Plus, Edit
// } from 'lucide-react';

// // Admin Dashboard Component (Import your existing one)
// const AdminDashboard = ({ onBack }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-8">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-2xl font-semibold text-gray-900">Administrative Management System</h1>
//             <button 
//               onClick={onBack}
//               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//           <p className="text-gray-600">Your complete AdminDashboard component would be rendered here...</p>
//           {/* Your existing AdminDashboard component content goes here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [showAdminDashboard, setShowAdminDashboard] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [activeTab, setActiveTab] = useState('overview');
//   const [systemData, setSystemData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Get user data from localStorage or props
//   const userData = {
//     role: localStorage.getItem('userRole') || 'System Administrator',
//     username: localStorage.getItem('username') || 'John Smith',
//     department: localStorage.getItem('department') || 'Railway Operations Control',
//     avatar: localStorage.getItem('userAvatar') || null
//   };

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Simulate API call for system data
//   useEffect(() => {
//     const fetchSystemData = async () => {
//       setLoading(true);
//       try {
//         // Replace with actual API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         setSystemData({
//           metrics: [
//             {
//               title: 'System Health',
//               value: '99.2%',
//               change: '+0.1%',
//               trend: 'up',
//               icon: Activity,
//               details: 'All systems operational',
//               color: 'green'
//             },
//             {
//               title: 'Active Users',
//               value: '247',
//               change: '+12',
//               trend: 'up',
//               icon: Users,
//               details: '247 of 300 licenses used',
//               color: 'blue'
//             },
//             {
//               title: 'Train Operations',
//               value: '34',
//               change: '+5',
//               trend: 'up',
//               icon: Train,
//               details: 'Currently in service',
//               color: 'blue'
//             },
//             {
//               title: 'Critical Alerts',
//               value: '3',
//               change: '-2',
//               trend: 'down',
//               icon: AlertTriangle,
//               details: '2 critical, 1 warning',
//               color: 'amber'
//             }
//           ],
//           modules: [
//             {
//               id: 'user-management',
//               title: 'User Management',
//               description: 'Manage user accounts, roles, permissions, and access controls across the system',
//               icon: Users,
//               status: 'active',
//               users: 247,
//               lastUpdate: '2 minutes ago'
//             },
//             {
//               id: 'operations-control',
//               title: 'Operations Control',
//               description: 'Monitor and control railway operations, schedules, and real-time status tracking',
//               icon: Train,
//               status: 'active',
//               users: 34,
//               lastUpdate: 'Live'
//             },
//             {
//               id: 'system-analytics',
//               title: 'System Analytics',
//               description: 'Performance metrics, usage statistics, and comprehensive operational reports',
//               icon: BarChart3,
//               status: 'active',
//               users: 15,
//               lastUpdate: '5 minutes ago'
//             },
//             {
//               id: 'maintenance-hub',
//               title: 'Maintenance Hub',
//               description: 'Scheduled maintenance, work orders, and equipment status tracking system',
//               icon: Wrench,
//               status: 'maintenance',
//               users: 8,
//               lastUpdate: '1 hour ago'
//             },
//             {
//               id: 'inspection-module',
//               title: 'Inspection Module',
//               description: 'Safety inspections, compliance checks, and quality assurance management',
//               icon: Eye,
//               status: 'active',
//               users: 12,
//               lastUpdate: '30 minutes ago'
//             },
//             {
//               id: 'system-config',
//               title: 'System Configuration',
//               description: 'System settings, security policies, and infrastructure management tools',
//               icon: Settings,
//               status: 'active',
//               users: 3,
//               lastUpdate: '1 day ago'
//             }
//           ],
//           activities: [
//             { type: 'user', message: 'New user registration: Maria Rodriguez', time: '2 min ago', status: 'info' },
//             { type: 'system', message: 'System backup completed successfully', time: '15 min ago', status: 'success' },
//             { type: 'alert', message: 'Train #402 delayed - maintenance required', time: '23 min ago', status: 'warning' },
//             { type: 'security', message: 'Failed login attempts detected from IP 192.168.1.45', time: '1 hour ago', status: 'error' },
//             { type: 'update', message: 'Software update deployed to production', time: '2 hours ago', status: 'success' }
//           ]
//         });
//       } catch (error) {
//         console.error('Failed to fetch system data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSystemData();
//   }, []);

//   const handleModuleClick = (moduleId) => {
//     switch (moduleId) {
//       case 'user-management':
//         setShowAdminDashboard(true);
//         break;
//       case 'operations-control':
//         // Navigate to operations
//         console.log('Navigate to operations control');
//         break;
//       case 'system-analytics':
//         // Navigate to analytics
//         console.log('Navigate to analytics');
//         break;
//       case 'maintenance-hub':
//         // Navigate to maintenance
//         console.log('Navigate to maintenance');
//         break;
//       case 'inspection-module':
//         // Navigate to inspections
//         console.log('Navigate to inspections');
//         break;
//       case 'system-config':
//         // Navigate to settings
//         console.log('Navigate to system configuration');
//         break;
//       default:
//         console.log(`Navigate to ${moduleId}`);
//     }
//   };

//   const refreshData = async () => {
//     setLoading(true);
//     // Simulate refresh
//     await new Promise(resolve => setTimeout(resolve, 500));
//     setLoading(false);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'text-green-600 bg-green-50 border-green-200';
//       case 'maintenance': return 'text-orange-600 bg-orange-50 border-orange-200';
//       case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
//       case 'error': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'user': return Users;
//       case 'system': return Server;
//       case 'alert': return AlertTriangle;
//       case 'security': return Shield;
//       case 'update': return Download;
//       default: return Activity;
//     }
//   };

//   const getMetricColor = (color) => {
//     switch (color) {
//       case 'green': return 'text-green-600 bg-green-50 border-green-200';
//       case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
//       case 'amber': return 'text-amber-600 bg-amber-50 border-amber-200';
//       case 'red': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-gray-600 bg-gray-50 border-gray-200';
//     }
//   };

//   if (showAdminDashboard) {
//     return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
//   }

//   if (loading && !systemData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Professional Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-6">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <Train className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-semibold text-gray-900">Railway Management System</h1>
//                   <p className="text-sm text-gray-500">Administrator Dashboard</p>
//                 </div>
//               </div>
              
//               <nav className="hidden md:flex space-x-1">
//                 {['overview', 'operations', 'analytics', 'maintenance'].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
//                       activeTab === tab
//                         ? 'bg-blue-50 text-blue-600 border border-blue-200'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }`}
//                   >
//                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
              
//               <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
              
//               <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
//                 <div>
//                   <p className="text-sm font-medium text-gray-900">{userData.username}</p>
//                   <p className="text-xs text-gray-500">{userData.role}</p>
//                 </div>
//                 <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                   {userData.avatar ? (
//                     <img src={userData.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
//                   ) : (
//                     <span className="text-sm font-medium text-gray-700">
//                       {userData.username.split(' ').map(n => n[0]).join('')}
//                     </span>
//                   )}
//                 </div>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="px-6 py-6">
//         {/* Status Bar */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-900">System Overview</h2>
//             <p className="text-gray-600">
//               {currentTime.toLocaleDateString('en-US', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })} • {currentTime.toLocaleTimeString()}
//             </p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button 
//               onClick={refreshData}
//               disabled={loading}
//               className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span>Refresh</span>
//             </button>
//             <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
//               <Download className="w-4 h-4" />
//               <span>Export Report</span>
//             </button>
//           </div>
//         </div>

//         {/* System Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {systemData?.metrics.map((metric, index) => (
//             <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-2 rounded-lg ${getMetricColor(metric.color)}`}>
//                   <metric.icon className="w-5 h-5" />
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   {metric.trend === 'up' ? (
//                     <TrendingUp className="w-4 h-4 text-green-600" />
//                   ) : (
//                     <TrendingDown className="w-4 h-4 text-red-600" />
//                   )}
//                   <span className={`text-sm font-medium ${
//                     metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     {metric.change}
//                   </span>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
//                 <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
//                 <p className="text-xs text-gray-500">{metric.details}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Admin Modules */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">Administrative Modules</h3>
//                 <div className="flex items-center space-x-2">
//                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
//                     <Filter className="w-4 h-4" />
//                   </button>
//                   <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
//                     <MoreHorizontal className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 {systemData?.modules.map((module, index) => (
//                   <div 
//                     key={module.id} 
//                     onClick={() => handleModuleClick(module.id)}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <div className={`p-2 rounded-lg ${getStatusColor(module.status)}`}>
//                         <module.icon className="w-5 h-5" />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="font-medium text-gray-900">{module.title}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{module.description}</p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="flex items-center space-x-2 mb-1">
//                         <Users className="w-3 h-3 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-900">{module.users}</span>
//                       </div>
//                       <p className="text-xs text-gray-500">{module.lastUpdate}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Recent Activities */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
            
//             <div className="space-y-4">
//               {systemData?.activities.map((activity, index) => {
//                 const IconComponent = getActivityIcon(activity.type);
//                 return (
//                   <div key={index} className="flex items-start space-x-3">
//                     <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
//                       <IconComponent className="w-3 h-3" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm text-gray-900">{activity.message}</p>
//                       <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
//               View all activities
//             </button>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {[
//               { label: 'Add User', icon: Users, action: () => setShowAdminDashboard(true) },
//               { label: 'Schedule Maintenance', icon: Wrench, action: () => console.log('Schedule maintenance') },
//               { label: 'Generate Report', icon: FileText, action: () => console.log('Generate report') },
//               { label: 'System Backup', icon: Database, action: () => console.log('System backup') },
//               { label: 'Security Audit', icon: Shield, action: () => console.log('Security audit') },
//               { label: 'Update Settings', icon: Settings, action: () => console.log('Update settings') }
//             ].map((action, index) => (
//               <button
//                 key={index}
//                 onClick={action.action}
//                 className="flex flex-col items-center p-4 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
//               >
//                 <action.icon className="w-6 h-6 mb-2" />
//                 {action.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;