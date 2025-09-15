import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Train, Settings, Users, BarChart3, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const department = localStorage.getItem('department');

  const adminModules = [
    {
      title: 'Cleaning Management',
      description: 'Manage cleaning schedules, create entries, and manage lanes',
      icon: Train,
      color: 'bg-blue-600 hover:bg-blue-700',
      path: '/cleaning'
    },
    {
      title: 'Inspection Management',
      description: 'Manage train inspections and maintenance schedules',
      icon: Settings,
      color: 'bg-green-600 hover:bg-green-700',
      path: '/inspection'
    },
    {
      title: 'Maintenance Management',
      description: 'Manage maintenance tasks and schedules',
      icon: Settings,
      color: 'bg-red-600 hover:bg-red-700',
      path: '/maintenance'
    },
    {
      title: 'Operations Management',
      description: 'Manage daily operations and schedules',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      path: '/operations'
    }
  ];

  return (
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl"
      >
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -80, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 0.8
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 8}%`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Welcome back, {username}! 🚀
              </motion.h1>
              <motion.p 
                className="text-blue-100 text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Role: <span className="font-semibold text-yellow-300">{userRole}</span> | Department: <span className="font-semibold text-yellow-300">{department}</span>
              </motion.p>
            </div>
          </motion.div>
          
          {/* Live indicator */}
          <motion.div
            className="absolute top-6 right-6 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-green-200 text-sm font-medium">System Online</span>
          </motion.div>
        </div>
      </motion.div>

      {userRole === 'admin' && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full -translate-y-20 translate-x-20 opacity-50" />
          
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            📊 Admin Control Center
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
            {adminModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  onClick={() => navigate(module.path)}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className={`w-16 h-16 ${module.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent size={28} className="text-white" />
                      </motion.div>
                      
                      <motion.h3 
                        className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {module.title}
                      </motion.h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                        {module.description}
                      </p>
                      
                      {/* Arrow indicator */}
                      <motion.div
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-lg">→</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
      >
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
            📊
          </div>
          System Overview
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-700">Active Schedules</h3>
                <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                  📅
                </div>
              </div>
              <motion.p 
                className="text-3xl font-bold text-blue-900"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              >
                -
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-green-700">Completed Today</h3>
                <div className="p-2 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
                  ✅
                </div>
              </div>
              <motion.p 
                className="text-3xl font-bold text-green-900"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2.5 }}
              >
                -
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border-2 border-yellow-200 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200/30 rounded-full -translate-y-8 translate-x-8" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-yellow-700">Pending Tasks</h3>
                <div className="p-2 bg-yellow-200 rounded-lg group-hover:bg-yellow-300 transition-colors">
                  ⏳
                </div>
              </div>
              <motion.p 
                className="text-3xl font-bold text-yellow-900"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 3 }}
              >
                -
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;