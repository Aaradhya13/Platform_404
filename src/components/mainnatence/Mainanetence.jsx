import React, { useState, useEffect } from 'react';
import { maintenanceService } from "../../services/maintenence";
import { Edit, Trash2, Plus, Calendar, Clock, MapPin, Train } from 'lucide-react';

const MaintenanceDashboard = () => {
  const [maintenanceEntries, setMaintenanceEntries] = useState([]);
  const [maintenanceLanes, setMaintenanceLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load data on component mount
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

  const handleEditEntry = (entry) => {
    setEditingEntry({
      id: entry.id,
      lane: entry.lane,
      scheduledStart: entry.scheduledStart ? entry.scheduledStart.slice(0, 16) : '',
      scheduledEnd: entry.scheduledEnd ? entry.scheduledEnd.slice(0, 16) : '',
      enterd: entry.enterd ? entry.enterd.slice(0, 16) : '',
      exited: entry.exited ? entry.exited.slice(0, 16) : ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEntry = async () => {
    try {
      const updateData = {
        ...editingEntry,
        scheduledStart: editingEntry.scheduledStart ? new Date(editingEntry.scheduledStart).toISOString() : null,
        scheduledEnd: editingEntry.scheduledEnd ? new Date(editingEntry.scheduledEnd).toISOString() : null,
        enterd: editingEntry.enterd ? new Date(editingEntry.enterd).toISOString() : null,
        exited: editingEntry.exited ? new Date(editingEntry.exited).toISOString() : null
      };

      await maintenanceService.updateMaintenanceEntry(updateData);
      setIsEditModalOpen(false);
      setEditingEntry(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (entry) => {
    if (entry.exited) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (entry.enterd) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-sky-50 text-sky-700 border-sky-200';
  };

  const getStatus = (entry) => {
    if (entry.exited) return 'Completed';
    if (entry.enterd) return 'In Progress';
    return 'Scheduled';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#24B6C9]"></div>
          <p className="text-slate-600 font-medium">Loading maintenance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-8 py-6 bg-white border-b border-slate-200">
        <button
          onClick={() => window.location.href = '/maintenance'}
          className="inline-flex items-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
        >
          <span className="mr-2">←</span>
          Back to Analytics
        </button>
      </div>

      <header className="bg-gradient-to-r from-[#24B6C9] to-[#1ea3b5] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Maintenance Operations</h1>
              <p className="text-xl text-white/90">Comprehensive train maintenance scheduling and tracking</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={loadData}
                className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-200 ease-in-out border border-white/20 hover:border-white/30"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Entries */}
        <div className="space-y-6">
          {maintenanceEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200 ease-in-out overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-[#24B6C9]/10 to-[#24B6C9]/5 px-5 py-3 rounded-xl border border-[#24B6C9]/20">
                        <Train size={24} className="text-[#24B6C9]" />
                        <div>
                          <p className="text-sm font-medium text-slate-600">Train ID</p>
                          <p className="text-lg font-bold text-slate-900">{entry.train_id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200">
                        <MapPin size={20} className="text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600">Depot</p>
                          <p className="font-semibold text-slate-900">{entry.depot_name}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-5 py-3 rounded-xl border border-slate-200">
                        <p className="text-sm font-medium text-slate-600">Maintenance Lane</p>
                        <p className="text-lg font-bold text-slate-900">{entry.lane}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-[#24B6C9]" />
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Scheduled Start</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{formatDateTime(entry.scheduledStart)}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-[#24B6C9]" />
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Scheduled End</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{formatDateTime(entry.scheduledEnd)}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-amber-600" />
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Entered</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{formatDateTime(entry.enterd)}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-emerald-600" />
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Exited</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">{formatDateTime(entry.exited)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(entry)}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${entry.exited ? 'bg-emerald-500' : entry.enterd ? 'bg-amber-500' : 'bg-sky-500'}`}></div>
                    {getStatus(entry)}
                  </div>

                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="inline-flex items-center px-6 py-3 bg-[#24B6C9] hover:bg-[#1ea3b5] text-white rounded-xl font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    title="Edit maintenance entry"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Entry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {maintenanceEntries.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Train size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Maintenance Entries</h3>
              <p className="text-slate-600">No maintenance schedules found in the system</p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#24B6C9]/10 rounded-xl">
                  <Edit size={24} className="text-[#24B6C9]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Edit Maintenance Entry</h3>
                  <p className="text-slate-600">Update maintenance schedule details</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                    Maintenance Lane
                  </label>
                  <input
                    type="number"
                    value={editingEntry.lane}
                    onChange={(e) => setEditingEntry({...editingEntry, lane: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent bg-slate-50 font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                      Scheduled Start
                    </label>
                    <input
                      type="datetime-local"
                      value={editingEntry.scheduledStart}
                      onChange={(e) => setEditingEntry({...editingEntry, scheduledStart: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent bg-slate-50 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                      Scheduled End
                    </label>
                    <input
                      type="datetime-local"
                      value={editingEntry.scheduledEnd}
                      onChange={(e) => setEditingEntry({...editingEntry, scheduledEnd: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                      Entered Time
                    </label>
                    <input
                      type="datetime-local"
                      value={editingEntry.enterd}
                      onChange={(e) => setEditingEntry({...editingEntry, enterd: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent bg-slate-50 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
                      Exited Time
                    </label>
                    <input
                      type="datetime-local"
                      value={editingEntry.exited}
                      onChange={(e) => setEditingEntry({...editingEntry, exited: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent bg-slate-50 font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingEntry(null);
                    }}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateEntry}
                    className="px-8 py-3 bg-[#24B6C9] hover:bg-[#1ea3b5] text-white rounded-xl font-semibold transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Update Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;