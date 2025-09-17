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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#24B6C9]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#24B6C9] to-[#1e9aaa] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Maintenance Analytics</h1>
              <p className="text-cyan-100 mt-2 text-lg font-medium">Real-time analytics and performance metrics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Entries</p>
                <p className="text-4xl font-bold text-slate-800 mt-2">{maintenanceEntries.length}</p>
              </div>
              <div className="p-4 bg-[#24B6C9]/10 rounded-xl">
                <FileText className="h-8 w-8 text-[#24B6C9]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed</p>
                <p className="text-4xl font-bold text-slate-800 mt-2">{maintenanceEntries.filter(entry => entry.exited).length}</p>
                <p className="text-sm text-emerald-600 font-medium mt-1">{maintenanceEntries.length > 0 ? Math.round((maintenanceEntries.filter(entry => entry.exited).length / maintenanceEntries.length) * 100) : 0}% completion rate</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">In Progress</p>
                <p className="text-4xl font-bold text-slate-800 mt-2">{maintenanceEntries.filter(entry => entry.enterd && !entry.exited).length}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Available Lanes</p>
                <p className="text-4xl font-bold text-slate-800 mt-2">{maintenanceLanes.length}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Performance */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Today's Performance</h2>
            <div className="p-3 bg-[#24B6C9]/10 rounded-lg">
              <Calendar className="h-6 w-6 text-[#24B6C9]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-slate-800 mb-2">{todayEntries.length}</p>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Created Today</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-slate-800 mb-2">{todayCompleted}</p>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completed Today</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-xl">
              <p className="text-4xl font-bold text-slate-800 mb-2">{todayCompletionRate}%</p>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Completion Rate</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl">
            <div className="flex justify-between text-sm font-semibold text-slate-600 mb-3">
              <span>Today's Progress</span>
              <span>{todayCompleted}/{todayEntries.length}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-[#24B6C9] to-[#1e9aaa] h-3 rounded-full transition-all duration-500" style={{width: `${todayCompletionRate}%`}}></div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Status Distribution</h2>
            <div className="p-3 bg-[#24B6C9]/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-[#24B6C9]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center p-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <p className="text-5xl font-bold text-emerald-700 mb-3">{maintenanceEntries.filter(entry => entry.exited).length}</p>
              <p className="text-lg font-semibold text-emerald-800">Completed</p>
            </div>
            <div className="text-center p-10 bg-gradient-to-br from-[#24B6C9]/10 to-[#24B6C9]/20 rounded-xl border border-[#24B6C9]/30">
              <p className="text-5xl font-bold text-[#24B6C9] mb-3">{maintenanceEntries.filter(entry => entry.enterd && !entry.exited).length}</p>
              <p className="text-lg font-semibold text-[#1e9aaa]">In Progress</p>
            </div>
          </div>
        </div>

        {/* Bottom Right Action Buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex gap-4">
          <motion.button
            onClick={() => navigate('/maintenance/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#24B6C9] to-[#1e9aaa] text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all duration-300 font-semibold"
          >
            <Train className="w-5 h-5" />
            <span>Manage Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => navigate('/maintenance/jobcards')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#24B6C9] to-[#1e9aaa] text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all duration-300 font-semibold"
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