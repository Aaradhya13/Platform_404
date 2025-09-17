import React, { useState, useEffect } from 'react';
import { inspectionService } from '../../services/inspectionapi';
import { Clock, MapPin, Train, Edit, Save, X } from 'lucide-react';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button
          onClick={() => window.location.href = '/inspection'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium mb-6"
        >
          ← Back to Analytics
        </button>
      </div>

      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Inspection Schedules</h1>
              <p className="text-blue-100 mt-1">Manage and track train inspection operations</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={fetchSchedules}
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">Lane</label>
                              <select
                                value={editData.lane}
                                onChange={(e) => setEditData({...editData, lane: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                {lanes.map((lane) => (
                                  <option key={lane.id} value={lane.bay_number}>
                                    {lane.id} - Lane {lane.bay_number} - {lane.depot_name}
                                  </option>
                                ))}
                              </select>
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
                            onClick={() => setEditingId(null)}
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
            <p className="text-gray-500">No inspection schedules found</p>
          </div>
        )}


      </div>
    </div>
  );
};

export default InspectionLanes;