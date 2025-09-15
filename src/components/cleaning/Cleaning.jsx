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
      console.log('Fetched lanes:', data);
      setLanes(data);
    } catch (err) {
      console.error('Failed to fetch lanes:', err.message);
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
      console.log('Edit data before formatting:', editData);
      const apiData = {
        id: editData.id,
        lane: editData.lane,
        scheduledStart: formatForAPI(editData.scheduledStart),
        scheduledEnd: formatForAPI(editData.scheduledEnd),
        enterd: formatForAPI(editData.enterd),
        exited: formatForAPI(editData.exited)
      };
      console.log('Sending to backend:', apiData);
      const response = await cleaningService.updateCleaningEntry(apiData);
      console.log('Backend response:', response);
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
        train: parseInt(createData.train),
        lane: parseInt(createData.lane),
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
        depot: parseInt(createLaneData.depot),
        bay_number: parseInt(createLaneData.bay_number)
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
    <div className="space-y-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Success Message */}
      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
            </motion.div>
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        </motion.div>
      )}

      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              🚆 Cleaning Schedules
            </motion.h1>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Manage and track train cleaning operations
            </motion.p>
          </div>
          
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isAdmin && (
              <>
                <motion.button 
                  onClick={() => setShowCreateForm(true)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} /> New Entry
                </motion.button>
                <motion.button 
                  onClick={() => setShowCreateLaneForm(true)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Plus size={18} /> New Lane
                </motion.button>
              </>
            )}
            <motion.button 
              onClick={fetchCleaningSchedules}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
              >
                🔄
              </motion.div>
              Refresh
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Create Form */}
      {isAdmin && showCreateForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-12 translate-x-12 opacity-60" />
          
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-green-100 rounded-xl">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            Create New Cleaning Entry
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-blue-700 mb-2">🚆 Train ID</label>
              <input
                type="text"
                value={createData.train}
                onChange={(e) => setCreateData({...createData, train: e.target.value})}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                required
                placeholder="Enter train ID"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-purple-700 mb-2">🛤️ Lane</label>
              <select
                value={createData.lane}
                onChange={(e) => setCreateData({...createData, lane: e.target.value})}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                required
              >
                <option value="">Select Lane</option>
                {lanes.map((lane) => (
                  <option key={lane.id} value={lane.bay_number}>
                    Bay {lane.bay_number} - {lane.depot_name}
                  </option>
                ))}
              </select>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-green-700 mb-2">📅 Scheduled Start</label>
              <input
                type="datetime-local"
                value={createData.scheduledStart}
                onChange={(e) => setCreateData({...createData, scheduledStart: e.target.value})}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white shadow-sm"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-orange-700 mb-2">🏁 Scheduled End</label>
              <input
                type="datetime-local"
                value={createData.scheduledEnd}
                onChange={(e) => setCreateData({...createData, scheduledEnd: e.target.value})}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white shadow-sm"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2 md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-indigo-700 mb-2">🚪 Entry Time (Optional)</label>
              <input
                type="datetime-local"
                value={createData.enterd}
                onChange={(e) => setCreateData({...createData, enterd: e.target.value})}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm"
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="flex gap-4 mt-8 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              onClick={handleCreate}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Create Entry
            </motion.button>
            <motion.button
              onClick={handleCancelCreate}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Create Lane Form */}
      {isAdmin && showCreateLaneForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-12 translate-x-12 opacity-60" />
          
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-purple-100 rounded-xl">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            Create New Cleaning Lane
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-blue-700 mb-2">🏢 Depot ID</label>
              <input
                type="number"
                value={createLaneData.depot}
                onChange={(e) => setCreateLaneData({...createLaneData, depot: e.target.value})}
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                required
                placeholder="Enter depot ID"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-purple-700 mb-2">🛤️ Bay Number</label>
              <input
                type="number"
                value={createLaneData.bay_number}
                onChange={(e) => setCreateLaneData({...createLaneData, bay_number: e.target.value})}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                required
                placeholder="Enter bay number"
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="flex gap-4 mt-8 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleCreateLane}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Create Lane
            </motion.button>
            <motion.button
              onClick={handleCancelCreateLane}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Lanes List */}
      {isAdmin && lanes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full -translate-y-12 translate-x-12 opacity-60" />
          
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-2 bg-indigo-100 rounded-xl">
              🛤️
            </div>
            Cleaning Lanes Management
          </motion.h2>
          
          <div className="grid gap-4 relative z-10">
            {lanes.map((lane, index) => (
              <motion.div 
                key={lane.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
              >
                {editingLaneId === lane.id ? (
                  <motion.div 
                    className="flex items-center gap-4 flex-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-blue-600">Depot</label>
                      <input
                        type="number"
                        value={editLaneData.depot}
                        onChange={(e) => setEditLaneData({...editLaneData, depot: parseInt(e.target.value)})}
                        className="w-24 px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-colors"
                        placeholder="Depot"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-purple-600">Bay</label>
                      <input
                        type="number"
                        value={editLaneData.lane_number}
                        onChange={(e) => setEditLaneData({...editLaneData, lane_number: parseInt(e.target.value)})}
                        className="w-24 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 transition-colors"
                        placeholder="Bay"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      🏢
                    </div>
                    <span className="font-semibold text-gray-800">Bay {lane.bay_number} - {lane.depot_name}</span>
                  </div>
                )}
                
                <div className="flex gap-3">
                  {editingLaneId === lane.id ? (
                    <>
                      <motion.button
                        onClick={handleSaveLane}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                        title="Save changes"
                      >
                        <Save size={16} />
                      </motion.button>
                      <motion.button
                        onClick={handleCancelEditLane}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                        title="Cancel editing"
                      >
                        <X size={16} />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => handleEditLane(lane)}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                        title="Edit lane"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteLane(lane.id)}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                        title="Delete lane"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-6">
        {schedules.map((schedule, index) => {
          const statusInfo = getScheduleStatus(schedule);
          return (
            <motion.div 
              key={schedule.id} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                scale: 1.02
              }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <motion.div 
                    className="flex items-center gap-6 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Train size={24} className="text-blue-600" />
                      </motion.div>
                      <span className="font-bold text-lg text-blue-900">Train {schedule.train_id}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl">
                      <MapPin size={20} className="text-green-600" />
                      <span className="font-medium text-green-800">{schedule.depot_name}</span>
                    </div>
                    
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 rounded-xl text-sm font-medium">
                      {getLaneInfo(schedule.lane)}
                    </div>
                  </motion.div>

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
                    <motion.div 
                      className="col-span-full bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-600" />
                        Edit Schedule Times
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-semibold text-blue-700 mb-2">📅 Scheduled Start</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledStart}
                            onChange={(e) => setEditData({...editData, scheduledStart: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-semibold text-blue-700 mb-2">🏁 Scheduled End</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledEnd}
                            onChange={(e) => setEditData({...editData, scheduledEnd: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-semibold text-green-700 mb-2">🚪 Entry Time</label>
                          <input
                            type="datetime-local"
                            value={editData.enterd}
                            onChange={(e) => setEditData({...editData, enterd: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white shadow-sm"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.02 }}
                        >
                          <label className="block text-sm font-semibold text-purple-700 mb-2">🚪 Exit Time</label>
                          <input
                            type="datetime-local"
                            value={editData.exited}
                            onChange={(e) => setEditData({...editData, exited: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white shadow-sm"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
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

              <div className="ml-6 flex items-center gap-4">
                <motion.div 
                  className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${statusInfo.color}`}
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: statusInfo.status === 'In Progress' ? 
                      ["0 0 0 0 rgba(251, 191, 36, 0.4)", "0 0 0 10px rgba(251, 191, 36, 0)"] : 
                      "0 4px 15px 0 rgba(0, 0, 0, 0.1)"
                  }}
                  transition={{ 
                    boxShadow: { duration: 1.5, repeat: statusInfo.status === 'In Progress' ? Infinity : 0 }
                  }}
                >
                  {statusInfo.status}
                </motion.div>

                {editingId === schedule.id ? (
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.button
                      onClick={handleSave}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                      title="Save changes"
                    >
                      <Save size={18} />
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                      title="Cancel editing"
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <motion.button
                      onClick={() => handleEdit(schedule)}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                      title="Edit entry"
                    >
                      <Edit size={18} />
                    </motion.button>
                    {isAdmin && (
                      <motion.button
                        onClick={() => handleDelete(schedule.id)}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                        title="Delete entry"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cleaning schedules found</p>
        </div>
      )}
    </div>
  );
};

export default Cleaning;