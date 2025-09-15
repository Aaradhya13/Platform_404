import React, { useState, useEffect } from 'react';
import { cleaningService } from '../../services/cleaningService';
import { Clock, MapPin, Train, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

const Cleaning = () => {
  const [schedules, setSchedules] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      setSchedules(data);
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
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cleaning Schedules</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={16} /> New Entry
          </button>
          <button 
            onClick={() => setShowCreateLaneForm(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={16} /> New Lane
          </button>
          <button 
            onClick={fetchCleaningSchedules}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Cleaning Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Train</label>
              <input
                type="text"
                value={createData.train}
                onChange={(e) => setCreateData({...createData, train: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Enter train ID"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Lane</label>
              <select
                value={createData.lane}
                onChange={(e) => setCreateData({...createData, lane: e.target.value})}
                className="w-full px-3 py-2 border rounded"
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
              <label className="block text-sm text-gray-600 mb-1">Scheduled Start</label>
              <input
                type="datetime-local"
                value={createData.scheduledStart}
                onChange={(e) => setCreateData({...createData, scheduledStart: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Scheduled End</label>
              <input
                type="datetime-local"
                value={createData.scheduledEnd}
                onChange={(e) => setCreateData({...createData, scheduledEnd: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Entered (Optional)</label>
              <input
                type="datetime-local"
                value={createData.enterd}
                onChange={(e) => setCreateData({...createData, enterd: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create
            </button>
            <button
              onClick={handleCancelCreate}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create Lane Form */}
      {showCreateLaneForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Cleaning Lane</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Depot ID</label>
              <input
                type="number"
                value={createLaneData.depot}
                onChange={(e) => setCreateLaneData({...createLaneData, depot: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Enter depot ID"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Bay Number</label>
              <input
                type="number"
                value={createLaneData.bay_number}
                onChange={(e) => setCreateLaneData({...createLaneData, bay_number: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
                placeholder="Enter bay number"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateLane}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create Lane
            </button>
            <button
              onClick={handleCancelCreateLane}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Lanes List */}
      {lanes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Cleaning Lanes</h2>
          <div className="grid gap-2">
            {lanes.map((lane) => (
              <div key={lane.id} className="flex items-center justify-between p-3 border rounded">
                {editingLaneId === lane.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="number"
                      value={editLaneData.depot}
                      onChange={(e) => setEditLaneData({...editLaneData, depot: parseInt(e.target.value)})}
                      className="w-20 px-2 py-1 border rounded"
                      placeholder="Depot"
                    />
                    <input
                      type="number"
                      value={editLaneData.lane_number}
                      onChange={(e) => setEditLaneData({...editLaneData, lane_number: parseInt(e.target.value)})}
                      className="w-20 px-2 py-1 border rounded"
                      placeholder="Bay"
                    />
                  </div>
                ) : (
                  <span>Bay {lane.bay_number} - {lane.depot_name}</span>
                )}
                
                <div className="flex gap-2">
                  {editingLaneId === lane.id ? (
                    <>
                      <button
                        onClick={handleSaveLane}
                        className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                        title="Save changes"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={handleCancelEditLane}
                        className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        title="Cancel editing"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditLane(lane)}
                        className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Edit lane"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLane(lane.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
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

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Train size={20} className="text-blue-600" />
                    <span className="font-semibold">Train {schedule.train_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-green-600" />
                    <span>{schedule.depot_name}</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
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
                    <>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Scheduled Start</label>
                        <input
                          type="datetime-local"
                          value={editData.scheduledStart}
                          onChange={(e) => setEditData({...editData, scheduledStart: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Scheduled End</label>
                        <input
                          type="datetime-local"
                          value={editData.scheduledEnd}
                          onChange={(e) => setEditData({...editData, scheduledEnd: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Entered</label>
                        <input
                          type="datetime-local"
                          value={editData.enterd}
                          onChange={(e) => setEditData({...editData, enterd: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Exited</label>
                        <input
                          type="datetime-local"
                          value={editData.exited}
                          onChange={(e) => setEditData({...editData, exited: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </>
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

              <div className="ml-4 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  schedule.exited ? 'bg-green-100 text-green-800' :
                  schedule.enterd ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.exited ? 'Completed' :
                   schedule.enterd ? 'In Progress' :
                   'Pending'}
                </div>

                {editingId === schedule.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                      title="Save changes"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      title="Cancel editing"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      title="Edit entry"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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