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
      return { status: 'Completed', color: 'bg-green-100 text-green-800' };
    }
    
    if (schedule.enterd) {
      if (now > scheduledEnd) {
        return { status: 'Overdue', color: 'bg-red-100 text-red-800' };
      }
      return { status: 'In Progress', color: 'bg-yellow-100 text-yellow-800' };
    }
    
    if (now > scheduledEnd) {
      return { status: 'Missed', color: 'bg-red-100 text-red-800' };
    }
    
    return { status: 'Pending', color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => {
            setError('');
            fetchCleaningSchedules();
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
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
              <h1 className="text-2xl font-bold">Cleaning Schedules</h1>
              <p className="text-blue-100 mt-1">Manage and track train cleaning operations</p>
            </div>
            
            <div className="flex gap-3">
              {isAdmin && (
                <>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    <Plus size={16} />
                    <span>Add Entry</span>
                  </button>
                  <button 
                    onClick={() => setShowCreateLaneForm(true)}
                    className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    <Plus size={16} />
                    <span>Add Lane</span>
                  </button>
                </>
              )}
              <button 
                onClick={fetchCleaningSchedules}
                className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Create Entry Modal */}
        {isAdmin && showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Cleaning Entry</h3>
                    <button
                      type="button"
                      onClick={handleCancelCreate}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Train ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={createData.train}
                      onChange={(e) => setCreateData({...createData, train: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                      placeholder="Enter train ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lane <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={createData.lane}
                      onChange={(e) => setCreateData({...createData, lane: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select Lane</option>
                      {lanes.map((lane) => (
                        <option key={lane.id} value={lane.bay_number}>
                          Bay {lane.bay_number} - {lane.depot_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Start
                    </label>
                    <input
                      type="datetime-local"
                      value={createData.scheduledStart}
                      onChange={(e) => setCreateData({...createData, scheduledStart: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled End
                    </label>
                    <input
                      type="datetime-local"
                      value={createData.scheduledEnd}
                      onChange={(e) => setCreateData({...createData, scheduledEnd: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={createData.enterd}
                      onChange={(e) => setCreateData({...createData, enterd: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>Create</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Lane Modal */}
        {isAdmin && showCreateLaneForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateLane(); }}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Cleaning Lane</h3>
                    <button
                      type="button"
                      onClick={handleCancelCreateLane}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depot ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={createLaneData.depot}
                      onChange={(e) => setCreateLaneData({...createLaneData, depot: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                      placeholder="Enter depot ID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bay Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={createLaneData.bay_number}
                      onChange={(e) => setCreateLaneData({...createLaneData, bay_number: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                      placeholder="Enter bay number"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelCreateLane}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>Create</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Enhanced Lanes List */}
      {isAdmin && lanes.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Cleaning Lanes Management
          </h2>
          
          <div className="space-y-3">
            {lanes.map((lane) => (
              <div 
                key={lane.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {editingLaneId === lane.id ? (
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Depot</label>
                      <input
                        type="number"
                        value={editLaneData.depot}
                        onChange={(e) => setEditLaneData({...editLaneData, depot: parseInt(e.target.value, 10)})}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Depot"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Bay</label>
                      <input
                        type="number"
                        value={editLaneData.lane_number}
                        onChange={(e) => setEditLaneData({...editLaneData, lane_number: parseInt(e.target.value, 10)})}
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Bay"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="font-medium text-gray-900">Bay {lane.bay_number} - {lane.depot_name}</span>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {editingLaneId === lane.id ? (
                    <>
                      <button
                        onClick={handleSaveLane}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        title="Save changes"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEditLane}
                        className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        title="Cancel editing"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditLane(lane)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit lane"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLane(lane.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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

      <div className="space-y-4">
        {schedules.map((schedule) => {
          const statusInfo = getScheduleStatus(schedule);
          return (
            <div 
              key={schedule.id} 
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <Train size={20} className="text-blue-600" />
                      <span className="font-semibold text-blue-900">Train {schedule.train_id}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <MapPin size={16} className="text-blue-600" />
                      <span className="font-medium text-blue-700">{schedule.depot_name}</span>
                    </div>
                    
                    <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {getLaneInfo(schedule.lane)}
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Start</p>
                    <p className="font-medium">{formatDisplayDateTime(schedule.scheduledStart)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled End</p>
                    <p className="font-medium">{formatDisplayDateTime(schedule.scheduledEnd)}</p>
                  </div>
                  
                  {editingId === schedule.id ? (
                    <div className="col-span-full bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-600" />
                        Edit Schedule Times
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Start</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledStart}
                            onChange={(e) => setEditData({...editData, scheduledStart: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled End</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledEnd}
                            onChange={(e) => setEditData({...editData, scheduledEnd: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Time</label>
                          <input
                            type="datetime-local"
                            value={editData.enterd}
                            onChange={(e) => setEditData({...editData, enterd: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Exit Time</label>
                          <input
                            type="datetime-local"
                            value={editData.exited}
                            onChange={(e) => setEditData({...editData, exited: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">Entered</p>
                        <p className="font-medium">{formatDisplayDateTime(schedule.enterd)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Exited</p>
                        <p className="font-medium">{formatDisplayDateTime(schedule.exited)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.status}
                </div>

                <div className="ml-6">
                  {editingId === schedule.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Save changes"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        title="Cancel editing"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit entry"
                      >
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
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

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cleaning schedules found</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Cleaning;