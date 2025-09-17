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
    if (entry.exited) return 'bg-green-100 text-green-800';
    if (entry.enterd) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatus = (entry) => {
    if (entry.exited) return 'Completed';
    if (entry.enterd) return 'In Progress';
    return 'Scheduled';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button
          onClick={() => window.location.href = '/maintenance'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium mb-6"
        >
          ← Back to Analytics
        </button>
      </div>

      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Maintenance Schedules</h1>
              <p className="text-blue-100 mt-1">Manage and track train maintenance operations</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={loadData}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Maintenance Entries */}
        <div className="space-y-4">
          {maintenanceEntries.map((entry) => (
            <div 
              key={entry.id} 
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Train size={20} className="text-blue-600" />
                      <span className="font-semibold text-blue-900">Train {entry.train_id}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <MapPin size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-700">{entry.depot_name}</span>
                    </div>
                    
                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      Lane {entry.lane}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Start</p>
                      <p className="font-medium">{formatDateTime(entry.scheduledStart)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Scheduled End</p>
                      <p className="font-medium">{formatDateTime(entry.scheduledEnd)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Entered</p>
                      <p className="font-medium">{formatDateTime(entry.enterd)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exited</p>
                      <p className="font-medium">{formatDateTime(entry.exited)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(entry)}`}>
                    {getStatus(entry)}
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      title="Edit entry"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {maintenanceEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No maintenance entries found</p>
          </div>
        )}


      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingEntry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Maintenance Entry</h3>
              
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lane
                  </label>
                  <input
                    type="number"
                    value={editingEntry.lane}
                    onChange={(e) => setEditingEntry({...editingEntry, lane: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Start
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEntry.scheduledStart}
                    onChange={(e) => setEditingEntry({...editingEntry, scheduledStart: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled End
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEntry.scheduledEnd}
                    onChange={(e) => setEditingEntry({...editingEntry, scheduledEnd: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entered
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEntry.enterd}
                    onChange={(e) => setEditingEntry({...editingEntry, enterd: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exited
                  </label>
                  <input
                    type="datetime-local"
                    value={editingEntry.exited}
                    onChange={(e) => setEditingEntry({...editingEntry, exited: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingEntry(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update
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