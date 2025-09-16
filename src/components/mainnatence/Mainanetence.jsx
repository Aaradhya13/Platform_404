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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Dashboard</h1>
          <p className="text-gray-600">Manage train maintenance operations and schedules</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Train className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceEntries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceEntries.filter(entry => entry.enterd && !entry.exited).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceEntries.filter(entry => entry.exited).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Lanes</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceLanes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Entries Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Entries</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Train ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Start
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled End
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exited
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.train_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Lane {entry.lane}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.depot_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(entry.scheduledStart)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(entry.scheduledEnd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(entry.enterd)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(entry.exited)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry)}`}>
                        {getStatus(entry)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {maintenanceEntries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No maintenance entries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Maintenance Lanes Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Lanes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {maintenanceLanes.map((lane) => (
              <div key={lane.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Lane {lane.bay_number}</h3>
                    <p className="text-sm text-gray-600">{lane.depot_name}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {maintenanceLanes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No maintenance lanes found.</p>
            </div>
          )}
        </div>
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