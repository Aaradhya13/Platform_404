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
  const BarChartComponent = ({ data, title, color = "#3B82F6" }) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Inspection Analytics</h1>
              <p className="text-blue-100">Real-time analytics and performance metrics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Job Cards</p>
                <p className="text-3xl font-bold text-black">{analytics.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-black">{analytics.completed}</p>
                <p className="text-xs text-gray-500">{completionRate}% completion rate</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="text-3xl font-bold text-black">{analytics.open}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today Created</p>
                <p className="text-3xl font-bold text-black">{analytics.todayCreated}</p>
                <p className="text-xs text-blue-500">Completed: {analytics.todayCompleted}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Performance</h2>
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{analytics.todayCreated}</p>
              <p className="text-sm text-gray-600">Created Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{analytics.todayCompleted}</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{todayCompletionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Today's Progress</span>
              <span className="font-bold">{analytics.todayCompleted}/{analytics.todayCreated}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full relative"
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
                  className="text-xs font-bold text-white drop-shadow"
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
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Status Distribution</h2>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-black">{analytics.completed}</div>
              <div className="text-sm text-blue-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-black">{analytics.open}</div>
              <div className="text-sm text-blue-700">Open Issues</div>
            </div>
          </div>
        </motion.div>



        {/* Go to Job Cards Button - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-50">
          <motion.button
            onClick={onNavigateToJobCards}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span>Manage Job Cards</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default InspectionAnalytics;