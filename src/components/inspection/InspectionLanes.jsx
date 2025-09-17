import React, { useState, useEffect } from 'react';
import { inspectionService } from '../../services/inspectionapi';
import { Clock, MapPin, Train, Edit, Save, X, RefreshCw, AlertCircle } from 'lucide-react';

const InspectionLanes = () => {
  const [schedules, setSchedules] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editingLaneId, setEditingLaneId] = useState(null);
  const [editLaneData, setEditLaneData] = useState({});

  useEffect(() => {
    fetchSchedules();
    fetchLanes();
  }, []);

  const fetchLanes = async () => {
    try {
      const data = await inspectionService.getInspectionLanes();
      setLanes(data);
    } catch (err) {
      setError('Failed to fetch lanes: ' + err.message);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await inspectionService.getInspections();
      
      const sortedData = data.sort((a, b) => {
        const today = new Date().toDateString();
        const aDate = new Date(a.scheduledStart).toDateString();
        const bDate = new Date(b.scheduledStart).toDateString();
        
        if (aDate === today && bDate !== today) return -1;
        if (bDate === today && aDate !== today) return 1;
        
        return new Date(a.scheduledStart) - new Date(b.scheduledStart);
      });
      
      setSchedules(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        lane: editData.lane || 1,
        scheduledStart: formatForAPI(editData.scheduledStart),
        scheduledEnd: formatForAPI(editData.scheduledEnd),
        enterd: formatForAPI(editData.enterd),
        exited: formatForAPI(editData.exited)
      };
      
      // Remove null values
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === null || apiData[key] === undefined || apiData[key] === '') {
          delete apiData[key];
        }
      });
      
      const response = await inspectionService.updateInspectionEntry(apiData);
      setEditingId(null);
      setSuccess('Entry updated successfully');
      setTimeout(() => setSuccess(''), 5000);
      
      setSchedules(prevSchedules => 
        prevSchedules.map(schedule => 
          schedule.id === response.updated_entry.id ? response.updated_entry : schedule
        )
      );
    } catch (err) {
      setError(err.message);
    }
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

  const getScheduleStatus = (schedule) => {
    const now = new Date();
    const scheduledEnd = new Date(schedule.scheduledEnd);
    
    if (schedule.exited) {
      return { status: 'Completed', color: 'bg-green-50 text-green-700 border border-green-200' };
    }
    
    if (schedule.enterd) {
      if (now > scheduledEnd) {
        return { status: 'Overdue', color: 'bg-red-50 text-red-700 border border-red-200' };
      }
      return { status: 'In Progress', color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' };
    }
    
    if (now > scheduledEnd) {
      return { status: 'Missed', color: 'bg-red-50 text-red-700 border border-red-200' };
    }
    
    return { status: 'Pending', color: 'bg-gray-50 text-gray-700 border border-gray-200' };
  };

  const handleEditLane = (lane) => {
    setEditingLaneId(lane.id);
    setEditLaneData({
      id: lane.id,
      lane_number: lane.bay_number,
      depot: lane.depot || 1
    });
  };

  const handleSaveLane = async () => {
    try {
      const apiData = {
        id: editLaneData.id,
        lane_number: editLaneData.lane_number,
        depot: editLaneData.depot
      };
      
      const response = await inspectionService.updateInspectionLane(apiData);
      setEditingLaneId(null);
      setSuccess(response.message);
      setTimeout(() => setSuccess(''), 3000);
      setLanes(lanes.map(lane => lane.id === response.lane.id ? response.lane : lane));
    } catch (err) {
      setError(err.message);
    }
  };

  const getLaneInfo = (laneNumber) => {
    const lane = lanes.find(l => l.bay_number === laneNumber);
    return lane ? `${lane.id} - Lane ${lane.bay_number} - ${lane.depot_name}` : `Lane ${laneNumber}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-[#24B6C9]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading inspection schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => window.location.href = '/inspection'}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#24B6C9] font-medium transition-colors"
          >
            ← Back to Analytics
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inspection Schedules</h1>
              <p className="text-gray-600">Monitor and manage train inspection operations across all lanes</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={fetchSchedules}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Schedules List */}
        <div className="space-y-4">
          {schedules.map((schedule) => {
            const statusInfo = getScheduleStatus(schedule);
            return (
              <div 
                key={schedule.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header Info */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 bg-[#24B6C9] bg-opacity-10 px-3 py-2 rounded-lg">
                        <Train size={18} className="text-[#24B6C9]" />
                        <span className="font-semibold text-gray-900">Train {schedule.train_id}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">{schedule.depot_name}</span>
                      </div>
                      
                      <div className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                        {getLaneInfo(schedule.lane)}
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusInfo.color}`}>
                      {statusInfo.status}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  {editingId === schedule.id ? (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="p-1 bg-[#24B6C9] bg-opacity-10 rounded">
                          <Edit className="w-4 h-4 text-[#24B6C9]" />
                        </div>
                        Edit Schedule Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Start</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledStart}
                            onChange={(e) => setEditData({...editData, scheduledStart: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled End</label>
                          <input
                            type="datetime-local"
                            value={editData.scheduledEnd}
                            onChange={(e) => setEditData({...editData, scheduledEnd: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Lane Assignment</label>
                          <select
                            value={editData.lane}
                            onChange={(e) => setEditData({...editData, lane: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                          >
                            {lanes.map((lane) => (
                              <option key={lane.id} value={lane.bay_number}>
                                {lane.id} - Lane {lane.bay_number} - {lane.depot_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Time</label>
                          <input
                            type="datetime-local"
                            value={editData.enterd}
                            onChange={(e) => setEditData({...editData, enterd: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Exit Time</label>
                          <input
                            type="datetime-local"
                            value={editData.exited}
                            onChange={(e) => setEditData({...editData, exited: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1e9db0] transition-colors font-medium"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600">Scheduled Start</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDisplayDateTime(schedule.scheduledStart)}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600">Scheduled End</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDisplayDateTime(schedule.scheduledEnd)}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-gray-600">Entry Time</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDisplayDateTime(schedule.enterd)}</p>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-gray-600">Exit Time</span>
                          </div>
                          <p className="font-semibold text-gray-900">{formatDisplayDateTime(schedule.exited)}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1e9db0] transition-colors font-medium"
                        >
                          <Edit size={16} />
                          Edit Schedule
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {schedules.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedules found</h3>
                <p className="text-gray-600">There are currently no inspection schedules to display</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionLanes;