import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cleaningService } from '../../services/cleaningService';
import { 
  Train, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const CleaningAnalytics = ({ onNavigateToList }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0,
    todayScheduled: 0,
    todayCompleted: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await cleaningService.getCleaningSchedules();
      setSchedules(data);
      calculateAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    const today = new Date().toDateString();
    const now = new Date();
    
    let stats = {
      total: data.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      overdue: 0,
      todayScheduled: 0,
      todayCompleted: 0,
      weeklyData: {},
      hourlyData: {},
      depotData: {},
      avgCleaningTime: 0
    };

    let totalCleaningTime = 0;
    let completedWithTime = 0;

    data.forEach(schedule => {
      const scheduledDate = new Date(schedule.scheduledStart).toDateString();
      const scheduledEnd = new Date(schedule.scheduledEnd);
      const dayOfWeek = new Date(schedule.scheduledStart).toLocaleDateString('en', { weekday: 'short' });
      const hour = new Date(schedule.scheduledStart).getHours();
      
      // Weekly distribution
      stats.weeklyData[dayOfWeek] = (stats.weeklyData[dayOfWeek] || 0) + 1;
      
      // Hourly distribution
      stats.hourlyData[hour] = (stats.hourlyData[hour] || 0) + 1;
      
      // Depot distribution
      stats.depotData[schedule.depot_name] = (stats.depotData[schedule.depot_name] || 0) + 1;
      
      
      if (schedule.enterd && schedule.exited) {
        const entryTime = new Date(schedule.enterd);
        const exitTime = new Date(schedule.exited);
        const cleaningDuration = (exitTime - entryTime) / (1000 * 60); // in minutes
        totalCleaningTime += cleaningDuration;
        completedWithTime++;
      }
      
      // Today's stats
      if (scheduledDate === today) {
        stats.todayScheduled++;
        if (schedule.exited) stats.todayCompleted++;
      }
      
      // Overall status stats
      if (schedule.exited) {
        stats.completed++;
      } else if (schedule.enterd) {
        if (now > scheduledEnd) {
          stats.overdue++;
        } else {
          stats.inProgress++;
        }
      } else {
        if (now > scheduledEnd) {
          stats.overdue++;
        } else {
          stats.pending++;
        }
      }
    });

    stats.avgCleaningTime = completedWithTime > 0 ? Math.round(totalCleaningTime / completedWithTime) : 0;
    
   
    console.log('Analytics calculated:', {
      total: stats.total,
      completed: stats.completed,
      inProgress: stats.inProgress,
      pending: stats.pending,
      overdue: stats.overdue,
      avgCleaningTime: stats.avgCleaningTime,
      completedWithTime,
      hourlyData: stats.hourlyData,
      weeklyData: stats.weeklyData
    });
    
    setAnalytics(stats);
  };

  const completionRate = analytics.total > 0 ? Math.round((analytics.completed / analytics.total) * 100) : 0;
  const todayCompletionRate = analytics.todayScheduled > 0 ? Math.round((analytics.todayCompleted / analytics.todayScheduled) * 100) : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Pie Chart Component
  const PieChartComponent = ({ data, colors }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3"/>
          {Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;
            
            return (
              <circle
                key={key}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-in-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{total}</span>
        </div>
      </div>
    );
  };

  // Bar Chart Component
  const BarChartComponent = ({ data, title, color = "#24B6C9" }) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-12">{key}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0, x: -10 }}
                  animate={{ width: `${(value / maxValue) * 100}%`, x: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    delay: 0.5,
                    ease: "easeOut"
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-8">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

 
  const SimpleBarChart = ({ data, title }) => {
    const entries = Object.entries(data).filter(([_, value]) => value > 0);
    const maxValue = Math.max(...Object.values(data), 1);
    
    if (entries.length === 0) {
      return (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700">{title}</h4>
          <p className="text-gray-500 text-center py-8">No data available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <div className="space-y-2">
          {entries
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([hour, value]) => (
            <div key={hour} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-12">{hour}:00</span>
              <div className="flex-1 bg-gray-200 rounded h-8 relative overflow-hidden">
                <motion.div
                  className="h-full rounded flex items-center justify-end pr-2"
                  style={{ background: 'linear-gradient(to right, #24B6C9, #1da4b5)' }}
                  initial={{ width: 0, x: -20 }}
                  animate={{ width: `${(value / maxValue) * 100}%`, x: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <motion.span 
                    className="text-white text-sm font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {value}
                  </motion.span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#24B6C9' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="shadow-md border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #24B6C9 0%, #1da4b5 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Cleaning Analytics Dashboard</h1>
              <p className="text-cyan-100 mt-2 font-medium">Advanced performance monitoring & insights</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <span className="text-white/90 text-sm font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Schedules</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{analytics.total}</p>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#24B6C9' }}>
                <Train className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{analytics.completed}</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">{completionRate}% completion rate</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">In Progress</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{analytics.inProgress}</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-500">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{analytics.pending}</p>
                <p className="text-sm mt-1 font-medium" style={{ color: '#24B6C9' }}>Overdue: {analytics.overdue}</p>
              </div>
              <div className="p-4 rounded-2xl bg-red-500">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Today's Performance</h2>
              <p className="text-gray-600 mt-1">Real-time daily metrics and progress tracking</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#24B6C9' }}>
              <Calendar className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-3xl font-bold text-gray-800">{analytics.todayScheduled}</p>
              <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Scheduled Today</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <p className="text-3xl font-bold text-gray-800">{analytics.todayCompleted}</p>
              <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Completed Today</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-cyan-200" style={{ background: 'linear-gradient(to br, #f0fdff, #e6fcff)' }}>
              <p className="text-3xl font-bold text-gray-800">{todayCompletionRate}%</p>
              <p className="text-sm font-semibold text-gray-600 mt-2 uppercase tracking-wide">Completion Rate</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span className="font-semibold">Today's Progress</span>
              <span className="font-bold">{analytics.todayCompleted}/{analytics.todayScheduled}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden shadow-inner">
              <motion.div 
                className="h-6 rounded-full relative"
                style={{ background: 'linear-gradient(to right, #24B6C9, #1da4b5)' }}
                initial={{ width: 0 }}
                animate={{ width: `${todayCompletionRate}%` }}
                transition={{ duration: 2, delay: 0.8, type: "spring" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-sm font-bold text-white drop-shadow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {todayCompletionRate}%
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Status Distribution</h2>
              <p className="text-gray-600 mt-1">Overview of cleaning schedule statuses</p>
            </div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: '#24B6C9' }}>
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-gray-800">{analytics.completed}</div>
              <div className="text-sm font-semibold text-green-700 mt-2 uppercase tracking-wide">Completed</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-gray-800">{analytics.inProgress}</div>
              <div className="text-sm font-semibold text-orange-700 mt-2 uppercase tracking-wide">In Progress</div>
            </div>
            <div className="text-center p-6 rounded-xl border border-cyan-200 hover:shadow-lg transition-shadow" style={{ background: 'linear-gradient(to br, #f0fdff, #e6fcff)' }}>
              <div className="text-3xl font-bold text-gray-800">{analytics.pending}</div>
              <div className="text-sm font-semibold mt-2 uppercase tracking-wide" style={{ color: '#24B6C9' }}>Pending</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-gray-800">{analytics.overdue}</div>
              <div className="text-sm font-semibold text-red-700 mt-2 uppercase tracking-wide">Overdue</div>
            </div>
          </div>
        </motion.div>

        {/* Manage Schedules Button */}
        <div className="fixed bottom-4 right-20 z-50">
          <motion.button
            onClick={onNavigateToList}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:shadow-3xl transition-all duration-300 font-semibold"
            style={{ 
              background: 'linear-gradient(135deg, #24B6C9 0%, #1da4b5 100%)',
              boxShadow: '0 20px 40px rgba(36, 182, 201, 0.3)'
            }}
          >
            <Train className="w-6 h-6" />
            <span>Manage Schedules</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CleaningAnalytics;