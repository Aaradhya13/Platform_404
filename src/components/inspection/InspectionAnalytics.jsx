import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobCardService } from '../../services/jobCardService';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Train
} from 'lucide-react';

const InspectionAnalytics = ({ onNavigateToJobCards }) => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    open: 0,
    todayCreated: 0,
    todayCompleted: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await jobCardService.getJobCards();
      setJobCards(data);
      calculateAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    const today = new Date().toDateString();
    
    let stats = {
      total: data.length,
      completed: 0,
      open: 0,
      todayCreated: 0,
      todayCompleted: 0,
      weeklyData: {},
      trainData: {}
    };

    data.forEach(jobCard => {
      const createdDate = new Date(jobCard.created_at).toDateString();
      const dayOfWeek = new Date(jobCard.created_at).toLocaleDateString('en', { weekday: 'short' });
      
      // Weekly distribution
      stats.weeklyData[dayOfWeek] = (stats.weeklyData[dayOfWeek] || 0) + 1;
      
      // Train distribution
      stats.trainData[`Train ${jobCard.train}`] = (stats.trainData[`Train ${jobCard.train}`] || 0) + 1;
      
      // Today's stats
      if (createdDate === today) {
        stats.todayCreated++;
        if (jobCard.closed_at) stats.todayCompleted++;
      }
      
      // Overall status stats
      if (jobCard.closed_at) {
        stats.completed++;
      } else {
        stats.open++;
      }
    });
    
    setAnalytics(stats);
  };

  const completionRate = analytics.total > 0 ? Math.round((analytics.completed / analytics.total) * 100) : 0;
  const todayCompletionRate = analytics.todayCreated > 0 ? Math.round((analytics.todayCompleted / analytics.todayCreated) * 100) : 0;

  // Bar Chart Component
  const BarChartComponent = ({ data, title, color = "#24B6C9" }) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-700 text-lg">{title}</h4>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-600 w-16">{key}</span>
              <div className="flex-1 bg-slate-200 rounded-full h-3 relative overflow-hidden">
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
              <span className="text-sm font-semibold text-slate-700 w-8">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-teal-400"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">Inspection Analytics</h1>
              <p className="text-slate-600 font-medium">Comprehensive performance metrics and operational insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-400" />
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                TOTAL
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">{analytics.total}</p>
              <p className="text-sm text-slate-500 font-medium">Job Cards</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                {completionRate}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">{analytics.completed}</p>
              <p className="text-sm text-slate-500 font-medium">Completed</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                PENDING
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">{analytics.open}</p>
              <p className="text-sm text-slate-500 font-medium">Open Issues</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                TODAY
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">{analytics.todayCreated}</p>
              <p className="text-sm text-slate-500 font-medium">Created Today</p>
              <p className="text-xs text-blue-600 font-semibold">Completed: {analytics.todayCompleted}</p>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Today's Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Today's Performance</h2>
              <p className="text-slate-600">Real-time daily metrics and completion tracking</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-teal-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-3xl font-bold text-slate-900 mb-2">{analytics.todayCreated}</p>
              <p className="text-sm text-slate-600 font-semibold">Created Today</p>
            </div>
            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-3xl font-bold text-slate-900 mb-2">{analytics.todayCompleted}</p>
              <p className="text-sm text-emerald-700 font-semibold">Completed Today</p>
            </div>
            <div className="text-center p-6 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-3xl font-bold text-slate-900 mb-2">{todayCompletionRate}%</p>
              <p className="text-sm text-teal-700 font-semibold">Completion Rate</p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Daily Progress Tracking</span>
              <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                {analytics.todayCompleted}/{analytics.todayCreated}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-6 relative overflow-hidden shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-teal-400 to-teal-500 h-6 rounded-full relative shadow-sm"
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
                  className="text-sm font-bold text-white drop-shadow-sm"
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

        {/* Enhanced Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Status Distribution</h2>
              <p className="text-slate-600">Overview of job card completion status</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-teal-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-8 bg-emerald-50 rounded-xl border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{analytics.completed}</div>
              <div className="text-sm font-semibold text-emerald-700">Completed</div>
            </div>
            <div className="text-center p-8 bg-amber-50 rounded-xl border border-amber-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">{analytics.open}</div>
              <div className="text-sm font-semibold text-amber-700">Open Issues</div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <div className="fixed bottom-5 right-20 z-50 flex flex-col gap-3">
          <motion.button
            onClick={() => window.location.href = '/inspection/lanes'}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-slate-700 px-6 py-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <Train className="w-5 h-5 text-teal-600" />
            </div>
            <span className="font-semibold">Manage Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={onNavigateToJobCards}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-teal-400 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 hover:bg-teal-500 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Manage Job Cards</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default InspectionAnalytics;