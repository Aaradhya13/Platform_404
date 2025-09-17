import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cleaningService } from '../../services/cleaningService';
import { Clock, MapPin, Train, Edit, Save, X, Plus, Trash2, CheckCircle } from 'lucide-react';

const Cleaning = () => {
  const [schedules, setSchedules] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateLaneForm, setShowCreateLaneForm] = useState(false);
  const [createLaneData, setCreateLaneData] = useState({
    depot: '',
    bay_number: ''
  });
  const [editingLaneId, setEditingLaneId] = useState(null);
  const [editLaneData, setEditLaneData] = useState({});
  const [createData, setCreateData] = useState({
    train: '',
    lane: '',
    scheduledStart: '',
    scheduledEnd: '',
    enterd: ''
  });

  useEffect(() => {
    fetchCleaningSchedules();
    fetchCleaningLanes();
  }, []);

  const fetchCleaningSchedules = async () => {
    try {
      setLoading(true);
      const data = await cleaningService.getCleaningSchedules();
      
      // Sort schedules: today's schedules first, then by scheduled start time
      const sortedData = data.sort((a, b) => {
        const today = new Date().toDateString();
        const aDate = new Date(a.scheduledStart).toDateString();
        const bDate = new Date(b.scheduledStart).toDateString();
        
        // If one is today and other is not, prioritize today
        if (aDate === today && bDate !== today) return -1;
        if (bDate === today && aDate !== today) return 1;
        
        // Otherwise sort by scheduled start time
        return new Date(a.scheduledStart) - new Date(b.scheduledStart);
      });
      
      setSchedules(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCleaningLanes = async () => {
    try {
      const data = await cleaningService.getCleaningLanes();
      setLanes(data);
    } catch (err) {
      setError('Failed to fetch lanes: ' + err.message);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setEditData({
      id: schedule.id,
      lane: schedule.lane,
      scheduledStart: formatDateTime(schedule.scheduledStart),
      scheduledEnd: formatDateTime(schedule.scheduledEnd),
      enterd: formatDateTime(schedule.enterd),
      exited: formatDateTime(schedule.exited)
    });
  };

  const handleSave = async () => {
    try {
      const apiData = {
        id: editData.id,
        lane: editData.lane,
        scheduledStart: formatForAPI(editData.scheduledStart),
        scheduledEnd: formatForAPI(editData.scheduledEnd),
        enterd: formatForAPI(editData.enterd),
        exited: formatForAPI(editData.exited)
      };
      const response = await cleaningService.updateCleaningEntry(apiData);
      setEditingId(null);
      setSuccess(`${response.message} - Train ${response.updated_entry.train_id} updated`);
      setTimeout(() => setSuccess(''), 5000);
      
      setSchedules(prevSchedules => 
        prevSchedules.map(schedule => 
          schedule.id === response.updated_entry.id 
            ? response.updated_entry 
            : schedule
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      const apiData = {
        train: parseInt(createData.train, 10),
        lane: parseInt(createData.lane, 10),
        scheduledStart: formatForAPI(createData.scheduledStart),
        scheduledEnd: formatForAPI(createData.scheduledEnd),
        enterd: formatForAPI(createData.enterd)
      };
      const response = await cleaningService.createCleaningEntry(apiData);
      setShowCreateForm(false);
      setCreateData({ train: '', lane: '', scheduledStart: '', scheduledEnd: '', enterd: '' });
      setSuccess(`${response.message} - Entry ID: ${response.created_entry.id} created`);
      setTimeout(() => setSuccess(''), 5000);
      
      setSchedules(prevSchedules => [response.created_entry, ...prevSchedules]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this cleaning entry?')) {
      return;
    }
    
    try {
      const response = await cleaningService.deleteCleaningEntry(scheduleId);
      setSuccess(`${response.message}`);
      setTimeout(() => setSuccess(''), 5000);
      
      setSchedules(prevSchedules => 
        prevSchedules.filter(schedule => schedule.id !== scheduleId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setCreateData({ train: '', lane: '', scheduledStart: '', scheduledEnd: '', enterd: '' });
  };

  const handleCreateLane = async () => {
    try {
      const apiData = {
        depot: parseInt(createLaneData.depot, 10),
        bay_number: parseInt(createLaneData.bay_number, 10)
      };
      const response = await cleaningService.createCleaningLane(apiData);
      setShowCreateLaneForm(false);
      setCreateLaneData({ depot: '', bay_number: '' });
      setSuccess(`${response.message} - Lane ID: ${response.lane.id} created`);
      setTimeout(() => setSuccess(''), 5000);
      
      setLanes(prevLanes => [...prevLanes, response.lane]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelCreateLane = () => {
    setShowCreateLaneForm(false);
    setCreateLaneData({ depot: '', bay_number: '' });
  };

  const handleDeleteLane = async (laneId) => {
    if (!window.confirm('Are you sure you want to delete this cleaning lane?')) {
      return;
    }
    
    try {
      const response = await cleaningService.deleteCleaningLane(laneId);
      setSuccess(`${response.message}`);
      setTimeout(() => setSuccess(''), 5000);
      
      setLanes(prevLanes => 
        prevLanes.filter(lane => lane.id !== laneId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditLane = (lane) => {
    setEditingLaneId(lane.id);
    setEditLaneData({
      id: lane.id,
      depot: lane.depot || 1,
      lane_number: lane.bay_number
    });
  };

  const handleSaveLane = async () => {
    try {
      const response = await cleaningService.updateCleaningLane(editLaneData);
      setEditingLaneId(null);
      setSuccess(`${response.message}`);
      setTimeout(() => setSuccess(''), 5000);
      
      setLanes(prevLanes => 
        prevLanes.map(lane => 
          lane.id === response.lane.id ? response.lane : lane
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEditLane = () => {
    setEditingLaneId(null);
    setEditLaneData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatForAPI = (datetimeLocal) => {
    if (!datetimeLocal) return null;
    return datetimeLocal + ':00+05:30';
  };

  const formatDisplayDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getLaneInfo = (laneNumber) => {
    const lane = lanes.find(l => l.bay_number === laneNumber);
    return lane ? `Bay ${lane.bay_number} - ${lane.depot_name}` : `Lane ${laneNumber}`;
  };

  const getScheduleStatus = (schedule) => {
    const now = new Date();
    const scheduledEnd = new Date(schedule.scheduledEnd);
    
    if (schedule.exited) {
      return { status: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    
    if (schedule.enterd) {
      if (now > scheduledEnd) {
        return { status: 'Overdue', color: 'bg-red-50 text-red-700 border-red-200' };
      }
      return { status: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    
    if (now > scheduledEnd) {
      return { status: 'Missed', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    
    return { status: 'Pending', color: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-[#24B6C9]"></div>
          <p className="text-slate-600 font-medium">Loading cleaning schedules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Data</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button 
                onClick={() => {
                  setError('');
                  fetchCleaningSchedules();
                }}
                className="inline-flex items-center px-6 py-3 bg-[#24B6C9] text-white font-medium rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cleaning Operations Center</h1>
              <p className="text-slate-600 text-lg">Monitor and manage train cleaning schedules across all depots</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-5 py-3 bg-[#24B6C9] text-white font-medium rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} className="mr-2" />
                    New Entry
                  </button>
                  <button 
                    onClick={() => setShowCreateLaneForm(true)}
                    className="inline-flex items-center px-5 py-3 bg-slate-600 text-white font-medium rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Plus size={18} className="mr-2" />
                    New Lane
                  </button>
                </>
              )}
              <button 
                onClick={fetchCleaningSchedules}
                className="inline-flex items-center px-5 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-xl shadow-md">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <X className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl shadow-md">
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="ml-3">
                <p className="text-emerald-800 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Create Entry Modal */}
        {isAdmin && showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-[#24B6C9] to-[#1fa3b5] rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Create New Cleaning Entry</h3>
                      <p className="text-cyan-100 text-sm mt-1">Schedule a new train for cleaning</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelCreate}
                      className="p-2 text-cyan-100 hover:text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Train ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createData.train}
                      onChange={(e) => setCreateData({...createData, train: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      required
                      placeholder="Enter train identification number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Cleaning Lane <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={createData.lane}
                      onChange={(e) => setCreateData({...createData, lane: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      required
                    >
                      <option value="">Select cleaning lane</option>
                      {lanes.map((lane) => (
                        <option key={lane.id} value={lane.bay_number}>
                          Bay {lane.bay_number} - {lane.depot_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Scheduled Start
                      </label>
                      <input
                        type="datetime-local"
                        value={createData.scheduledStart}
                        onChange={(e) => setCreateData({...createData, scheduledStart: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Scheduled End
                      </label>
                      <input
                        type="datetime-local"
                        value={createData.scheduledEnd}
                        onChange={(e) => setCreateData({...createData, scheduledEnd: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Actual Entry Time <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={createData.enterd}
                      onChange={(e) => setCreateData({...createData, enterd: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 px-8 py-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-[#24B6C9] text-white px-6 py-3 rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
                  >
                    <Save size={18} />
                    <span>Create Entry</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Create Lane Modal */}
        {isAdmin && showCreateLaneForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateLane(); }}>
                <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-600 to-slate-700 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Create New Cleaning Lane</h3>
                      <p className="text-slate-300 text-sm mt-1">Add a new bay to depot</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelCreateLane}
                      className="p-2 text-slate-300 hover:text-white hover:bg-white hover:bg-opacity-20 rounded-xl transition-all duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Depot ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={createLaneData.depot}
                      onChange={(e) => setCreateLaneData({...createLaneData, depot: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      required
                      placeholder="Enter depot identification"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bay Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={createLaneData.bay_number}
                      onChange={(e) => setCreateLaneData({...createLaneData, bay_number: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                      required
                      placeholder="Enter bay number"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 px-8 py-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                  <button
                    type="button"
                    onClick={handleCancelCreateLane}
                    className="px-6 py-3 text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-md hover:shadow-lg"
                  >
                    <Save size={18} />
                    <span>Create Lane</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Enhanced Lanes Management Section */}
        {isAdmin && lanes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#24B6C9] bg-opacity-10 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-[#24B6C9]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Lane Management</h2>
                  <p className="text-slate-600">Manage cleaning bays and depot assignments</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {lanes.map((lane) => (
                <div 
                  key={lane.id} 
                  className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200"
                >
                  {editingLaneId === lane.id ? (
                    <div className="flex items-center gap-6 flex-1">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Depot ID</label>
                        <input
                          type="number"
                          value={editLaneData.depot}
                          onChange={(e) => setEditLaneData({...editLaneData, depot: parseInt(e.target.value, 10)})}
                          className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200"
                          placeholder="Depot"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-2">Bay Number</label>
                        <input
                          type="number"
                          value={editLaneData.lane_number}
                          onChange={(e) => setEditLaneData({...editLaneData, lane_number: parseInt(e.target.value, 10)})}
                          className="w-24 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200"
                          placeholder="Bay"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#24B6C9] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-[#24B6C9]" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 text-lg">Bay {lane.bay_number}</span>
                        <p className="text-slate-600 text-sm">{lane.depot_name}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {editingLaneId === lane.id ? (
                      <>
                        <button
                          onClick={handleSaveLane}
                          className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          title="Save changes"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEditLane}
                          className="p-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          title="Cancel editing"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditLane(lane)}
                          className="p-3 bg-[#24B6C9] text-white rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          title="Edit lane"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLane(lane.id)}
                          className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          title="Delete lane"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Schedule Cards */}
        <div className="space-y-6">
          {schedules.map((schedule) => {
            const statusInfo = getScheduleStatus(schedule);
            return (
              <div 
                key={schedule.id} 
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header Section with Train and Location Info */}
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-[#24B6C9] to-[#1fa3b5] px-4 py-3 rounded-xl shadow-md">
                          <Train size={20} className="text-white" />
                          <span className="font-bold text-white text-lg">Train {schedule.train_id}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-slate-100 px-4 py-3 rounded-xl">
                          <MapPin size={18} className="text-slate-600" />
                          <span className="font-semibold text-slate-800">{schedule.depot_name}</span>
                        </div>
                        
                        <div className="bg-slate-100 px-4 py-3 rounded-xl">
                          <span className="text-slate-700 font-medium">{getLaneInfo(schedule.lane)}</span>
                        </div>

                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${statusInfo.color}`}>
                          {statusInfo.status}
                        </div>
                      </div>

                      {/* Schedule Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#24B6C9]" />
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Scheduled Start</p>
                          </div>
                          <p className="font-bold text-slate-900 text-lg">{formatDisplayDateTime(schedule.scheduledStart)}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[#24B6C9]" />
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Scheduled End</p>
                          </div>
                          <p className="font-bold text-slate-900 text-lg">{formatDisplayDateTime(schedule.scheduledEnd)}</p>
                        </div>
                        
                        {editingId === schedule.id ? (
                          <div className="col-span-full bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 mt-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#24B6C9] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Edit size={18} className="text-[#24B6C9]" />
                              </div>
                              Edit Schedule Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled Start</label>
                                <input
                                  type="datetime-local"
                                  value={editData.scheduledStart}
                                  onChange={(e) => setEditData({...editData, scheduledStart: e.target.value})}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Scheduled End</label>
                                <input
                                  type="datetime-local"
                                  value={editData.scheduledEnd}
                                  onChange={(e) => setEditData({...editData, scheduledEnd: e.target.value})}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Actual Entry Time</label>
                                <input
                                  type="datetime-local"
                                  value={editData.enterd}
                                  onChange={(e) => setEditData({...editData, enterd: e.target.value})}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Actual Exit Time</label>
                                <input
                                  type="datetime-local"
                                  value={editData.exited}
                                  onChange={(e) => setEditData({...editData, exited: e.target.value})}
                                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Actual Entry</p>
                              </div>
                              <p className="font-bold text-slate-900 text-lg">{formatDisplayDateTime(schedule.enterd)}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Actual Exit</p>
                              </div>
                              <p className="font-bold text-slate-900 text-lg">{formatDisplayDateTime(schedule.exited)}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-6">
                      {editingId === schedule.id ? (
                        <div className="flex gap-3">
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                            title="Save changes"
                          >
                            <Save size={18} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                            title="Cancel editing"
                          >
                            <X size={18} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#24B6C9] text-white rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                            title="Edit entry"
                          >
                            <Edit size={18} />
                            <span>Edit</span>
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                              title="Delete entry"
                            >
                              <Trash2 size={18} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Train size={32} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No Cleaning Schedules</h3>
              <p className="text-slate-600 text-lg mb-6">There are currently no cleaning schedules to display. Create a new entry to get started.</p>
              {isAdmin && (
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-[#24B6C9] text-white font-medium rounded-xl hover:bg-[#1fa3b5] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Plus size={18} className="mr-2" />
                  Create First Entry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cleaning;