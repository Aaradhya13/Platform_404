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
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-end pr-2"
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     
      <motion.div 
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-xl p-8 text-white relative overflow-hidden"
      >
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>
        
        <motion.h1 
          className="text-4xl font-bold mb-3 relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          🚇 Cleaning Operations Dashboard
        </motion.h1>
        <motion.p 
          className="text-blue-100 text-lg relative z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Real-time analytics and performance metrics
        </motion.p>
        
        {/* Animated pulse effect */}
        <motion.div
          className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="absolute top-3 right-10 text-sm text-green-200">Live</span>
      </motion.div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            y: -5
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.p 
                className="text-sm text-gray-600"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                Total Schedules
              </motion.p>
              <motion.p 
                className="text-3xl font-bold text-gray-900"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                {analytics.total}
              </motion.p>
            </div>
            <motion.div 
              className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Train className="w-6 h-6 text-blue-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.2)",
            y: -5
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <motion.p 
                className="text-3xl font-bold text-green-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
              >
                {analytics.completed}
              </motion.p>
              <motion.p 
                className="text-xs text-gray-500"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {completionRate}% completion rate
              </motion.p>
            </div>
            <motion.div 
              className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{analytics.inProgress}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-600">{analytics.pending}</p>
              <p className="text-xs text-red-500">Overdue: {analytics.overdue}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </motion.div>
      </div>

    
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
            <p className="text-2xl font-bold text-blue-600">{analytics.todayScheduled}</p>
            <p className="text-sm text-gray-600">Scheduled Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{analytics.todayCompleted}</p>
            <p className="text-sm text-gray-600">Completed Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{todayCompletionRate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>

       
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Today's Progress</span>
            <span className="font-bold">{analytics.todayCompleted}/{analytics.todayScheduled}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full relative"
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.completed}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{analytics.inProgress}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{analytics.pending}</div>
            <div className="text-sm text-gray-700">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{analytics.overdue}</div>
            <div className="text-sm text-red-700">Overdue</div>
          </div>
        </div>
      </motion.div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Status Distribution</h2>
            <PieChart className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex items-center justify-between">
            <PieChartComponent 
              data={{
                Completed: analytics.completed,
                'In Progress': analytics.inProgress,
                Pending: analytics.pending,
                Overdue: analytics.overdue
              }}
              colors={['#10B981', '#F59E0B', '#6B7280', '#EF4444']}
            />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed ({analytics.completed})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">In Progress ({analytics.inProgress})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Pending ({analytics.pending})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Overdue ({analytics.overdue})</span>
              </div>
            </div>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <BarChartComponent 
            data={analytics.weeklyData}
            title="Weekly Schedule Distribution"
            color="#8B5CF6"
          />
        </motion.div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <SimpleBarChart 
            data={analytics.hourlyData}
            title="Hourly Schedule Distribution"
          />
        </motion.div>

      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-700">Avg Cleaning Time</span>
                <span className="text-lg font-bold text-blue-900">{analytics.avgCleaningTime} min</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Based on completed entries with entry & exit times</p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Completion Rate</span>
                <span className="text-lg font-bold text-green-900">{completionRate}%</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{analytics.completed} of {analytics.total} schedules completed</p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-700">Active Depots</span>
                <span className="text-lg font-bold text-purple-900">{Object.keys(analytics.depotData).length}</span>
              </div>
              <p className="text-xs text-purple-600 mt-1">Depots with scheduled cleaning</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Depot Distribution</h4>
              <div className="space-y-1">
                {Object.entries(analytics.depotData).map(([depot, count]) => (
                  <div key={depot} className="flex justify-between text-sm">
                    <span className="text-gray-600">{depot}</span>
                    <span className="font-semibold text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", bounce: 0.6 }}
        className="text-center"
      >
        <motion.button
          onClick={onNavigateToList}
          whileHover={{ 
            scale: 1.08,
            boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
            background: "linear-gradient(45deg, #3B82F6, #8B5CF6, #3B82F6)",
            backgroundSize: "200% 200%"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{
            backgroundPosition: { duration: 3, repeat: Infinity },
            default: { duration: 0.3 }
          }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-4 mx-auto relative overflow-hidden group"
          style={{ backgroundSize: "200% 200%" }}
        >
         
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
          />
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Train className="w-7 h-7" />
          </motion.div>
          
          <span className="relative z-10">Manage Cleaning Schedules</span>
          
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-7 h-7" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CleaningAnalytics;