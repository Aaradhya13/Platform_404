import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, AlertCircle, Clock, Calendar, BarChart3, ArrowRight, Train } from 'lucide-react'
import { motion } from 'framer-motion'
import { maintenanceService } from '../../services/maintenence'

export default function Mainnantence() {
  const navigate = useNavigate();
  const [maintenanceEntries, setMaintenanceEntries] = useState([]);
  const [maintenanceLanes, setMaintenanceLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entries, lanes] = await Promise.all([
        maintenanceService.getMaintenanceEntries(),
        maintenanceService.getMaintenanceLanes()
      ]);
      setMaintenanceEntries(entries);
      setMaintenanceLanes(lanes);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate today's data
  const today = new Date().toDateString();
  const todayEntries = maintenanceEntries.filter(entry => 
    new Date(entry.scheduledStart).toDateString() === today
  );
  const todayCompleted = todayEntries.filter(entry => entry.exited).length;
  const todayCompletionRate = todayEntries.length > 0 ? Math.round((todayCompleted / todayEntries.length) * 100) : 0;

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
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Maintenance Analytics</h1>
              <p className="text-blue-100 mt-1">Real-time analytics and performance metrics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900">{maintenanceEntries.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{maintenanceEntries.filter(entry => entry.exited).length}</p>
                <p className="text-xs text-gray-500">{maintenanceEntries.length > 0 ? Math.round((maintenanceEntries.filter(entry => entry.exited).length / maintenanceEntries.length) * 100) : 0}% completion rate</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{maintenanceEntries.filter(entry => entry.enterd && !entry.exited).length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Lanes</p>
                <p className="text-3xl font-bold text-gray-900">{maintenanceLanes.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Performance</h2>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{todayEntries.length}</p>
              <p className="text-sm text-gray-600">Created Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{todayCompleted}</p>
              <p className="text-sm text-gray-600">Completed Today</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{todayCompletionRate}%</p>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Today's Progress</span>
              <span>{todayCompleted}/{todayEntries.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: `${todayCompletionRate}%`}}></div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Status Distribution</h2>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-8 bg-green-50 rounded-lg">
              <p className="text-4xl font-bold text-green-600">{maintenanceEntries.filter(entry => entry.exited).length}</p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
            <div className="text-center p-8 bg-blue-50 rounded-lg">
              <p className="text-4xl font-bold text-blue-600">{maintenanceEntries.filter(entry => entry.enterd && !entry.exited).length}</p>
              <p className="text-sm text-blue-700">In Progress</p>
            </div>
          </div>
        </div>

        {/* Bottom Right Action Buttons */}
        <div className="fixed bottom-4 right-4 z-50 flex gap-3">
          <motion.button
            onClick={() => navigate('/maintenance/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Train className="w-5 h-5" />
            <span>Manage Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => navigate('/maintenance/jobcards')}
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
  )
}
