import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Train, Calendar, MapPin } from 'lucide-react';

import { operationsService } from '../../services/operationapi';

const OperationsManager = () => {
  const [activeTab, setActiveTab] = useState('parking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for each operation type
  const [parkingOps, setParkingOps] = useState([]);
  const [timetables, setTimetables] = useState({});
  const [lanes, setLanes] = useState([]);

  // Form states
  const [showParkingForm, setShowParkingForm] = useState(false);
  const [showTimetableForm, setShowTimetableForm] = useState(false);
  const [showLaneForm, setShowLaneForm] = useState(false);

  // Edit states
  const [editingParking, setEditingParking] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [editingLane, setEditingLane] = useState(null);

  // Form data matching API structure
  const [parkingFormData, setParkingFormData] = useState({
    lane: '',
    train: '',
    scheduledStart: '',
    scheduledEnd: '',
    enterd: '',
    exited: ''
  });

  const [timetableFormData, setTimetableFormData] = useState({
    timetable: {
      date: '',
      day: '',
      train_number: '',
      starting_point: '',
      starting_time: '',
      ending_point: '',
      ending_time: ''
    },
    train_schedule: {
      train: ''
    }
  });

  const [laneFormData, setLaneFormData] = useState({
    lane_number: '',
    depot: ''
  });

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      switch (activeTab) {
        case 'parking':
          const parkingData = await operationsService.getParkingOperations();
          setParkingOps(parkingData);
          break;
        case 'timetables':
          const timetableData = await operationsService.getTimetables();
          setTimetables(timetableData);
          break;
        case 'lanes':
          const laneData = await operationsService.getLanes();
          setLanes(laneData);
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  // Format datetime for input fields
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Parking Operations
  const handleCreateParkingOperation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.createParkingOperation(parkingFormData);
      showMessage(result.message || 'Parking operation created successfully!');
      setShowParkingForm(false);
      setParkingFormData({ lane: '', train: '', scheduledStart: '', scheduledEnd: '', enterd: '', exited: '' });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParkingOperation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.updateParkingOperation({ 
        id: editingParking.id, 
        ...parkingFormData 
      });
      showMessage(result.message || 'Parking operation updated successfully!');
      setEditingParking(null);
      setParkingFormData({ lane: '', train: '', scheduledStart: '', scheduledEnd: '', enterd: '', exited: '' });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParkingOperation = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking operation?')) {
      setLoading(true);
      try {
        const result = await operationsService.deleteParkingOperation(id);
        showMessage(result.message || 'Parking operation deleted successfully!');
        loadData();
      } catch (err) {
        showMessage(err.message, true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Timetable Operations
  const handleCreateTimetable = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.createTimetable(timetableFormData);
      showMessage(result.message || 'Timetable created successfully!');
      setShowTimetableForm(false);
      setTimetableFormData({
        timetable: { date: '', day: '', train_number: '', starting_point: '', starting_time: '', ending_point: '', ending_time: '' },
        train_schedule: { train: '' }
      });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTimetable = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.updateTimetable({
        timetable: { id: editingTimetable.id, ...timetableFormData.timetable },
        train_schedule: timetableFormData.train_schedule
      });
      showMessage(result.message || 'Timetable updated successfully!');
      setEditingTimetable(null);
      setTimetableFormData({
        timetable: { date: '', day: '', train_number: '', starting_point: '', starting_time: '', ending_point: '', ending_time: '' },
        train_schedule: { train: '' }
      });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      setLoading(true);
      try {
        const result = await operationsService.deleteTimetable(id);
        showMessage(result.message || 'Timetable deleted successfully!');
        loadData();
      } catch (err) {
        showMessage(err.message, true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Lane Operations
  const handleCreateLane = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.createLane(laneFormData);
      showMessage(result.message || 'Lane created successfully!');
      setShowLaneForm(false);
      setLaneFormData({ lane_number: '', depot: '' });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLane = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await operationsService.updateLane({ 
        id: editingLane.id, 
        ...laneFormData 
      });
      showMessage(result.message || 'Lane updated successfully!');
      setEditingLane(null);
      setLaneFormData({ lane_number: '', depot: '' });
      loadData();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLane = async (id) => {
    if (window.confirm('Are you sure you want to delete this lane?')) {
      setLoading(true);
      try {
        const result = await operationsService.deleteLane(id);
        showMessage(result.message || 'Lane deleted successfully!');
        loadData();
      } catch (err) {
        showMessage(err.message, true);
      } finally {
        setLoading(false);
      }
    }
  };

  const startEdit = (type, item) => {
    switch (type) {
      case 'parking':
        setEditingParking(item);
        setParkingFormData({
          lane: item.lane || '',
          train: item.train_id || '',
          scheduledStart: formatDateTimeLocal(item.scheduledStart) || '',
          scheduledEnd: formatDateTimeLocal(item.scheduledEnd) || '',
          enterd: formatDateTimeLocal(item.enterd) || '',
          exited: formatDateTimeLocal(item.exited) || ''
        });
        break;
      case 'timetable':
        setEditingTimetable(item);
        setTimetableFormData({
          timetable: {
            date: item.date ? item.date.split('T')[0] : '',
            day: item.day || '',
            train_number: item.train_number || '',
            starting_point: item.starting_point || '',
            starting_time: formatDateTimeLocal(item.starting_time) || '',
            ending_point: item.ending_point || '',
            ending_time: formatDateTimeLocal(item.ending_time) || ''
          },
          train_schedule: {
            train: item.train_schedule?.train?.train_id || ''
          }
        });
        break;
      case 'lane':
        setEditingLane(item);
        setLaneFormData({
          lane_number: item.lane_number || '',
          depot: item.depot || ''
        });
        break;
    }
  };

  const cancelEdit = (type) => {
    switch (type) {
      case 'parking':
        setEditingParking(null);
        setParkingFormData({ lane: '', train: '', scheduledStart: '', scheduledEnd: '', enterd: '', exited: '' });
        break;
      case 'timetable':
        setEditingTimetable(null);
        setTimetableFormData({
          timetable: { date: '', day: '', train_number: '', starting_point: '', starting_time: '', ending_point: '', ending_time: '' },
          train_schedule: { train: '' }
        });
        break;
      case 'lane':
        setEditingLane(null);
        setLaneFormData({ lane_number: '', depot: '' });
        break;
    }
  };

  // Get flattened timetable array for display
  const getTimetableArray = () => {
    const timetableArray = [];
    Object.keys(timetables).forEach(date => {
      if (Array.isArray(timetables[date])) {
        timetables[date].forEach(item => {
          timetableArray.push({ ...item, dateKey: date });
        });
      }
    });
    return timetableArray;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Operations Manager</h1>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-200 p-1 rounded-lg">
          {[
            { id: 'parking', label: 'Parking Operations', icon: Train },
            { id: 'timetables', label: 'Timetables', icon: Calendar },
            { id: 'lanes', label: 'Lanes', icon: MapPin }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Parking Operations Tab */}
        {activeTab === 'parking' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Parking Operations</h2>
              <button
                onClick={() => setShowParkingForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Parking Operation</span>
              </button>
            </div>

            {/* Parking Form */}
            {(showParkingForm || editingParking) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">
                  {editingParking ? 'Edit Parking Operation' : 'Create Parking Operation'}
                </h3>
                <form onSubmit={editingParking ? handleUpdateParkingOperation : handleCreateParkingOperation}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Train ID *</label>
                      <input
                        type="number"
                        required
                        value={parkingFormData.train}
                        onChange={(e) => setParkingFormData({...parkingFormData, train: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lane *</label>
                      <input
                        type="number"
                        required
                        value={parkingFormData.lane}
                        onChange={(e) => setParkingFormData({...parkingFormData, lane: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Start *</label>
                      <input
                        type="datetime-local"
                        required
                        value={parkingFormData.scheduledStart}
                        onChange={(e) => setParkingFormData({...parkingFormData, scheduledStart: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled End *</label>
                      <input
                        type="datetime-local"
                        required
                        value={parkingFormData.scheduledEnd}
                        onChange={(e) => setParkingFormData({...parkingFormData, scheduledEnd: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Entered Time</label>
                      <input
                        type="datetime-local"
                        value={parkingFormData.enterd}
                        onChange={(e) => setParkingFormData({...parkingFormData, enterd: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Exited Time</label>
                      <input
                        type="datetime-local"
                        value={parkingFormData.exited}
                        onChange={(e) => setParkingFormData({...parkingFormData, exited: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{editingParking ? 'Update' : 'Create'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowParkingForm(false);
                        cancelEdit('parking');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Parking Operations List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depot</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Start</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled End</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entered</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exited</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parkingOps.map((op, index) => (
                        <tr key={op.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.train_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.lane}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{op.depot_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(op.scheduledStart).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(op.scheduledEnd).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {op.enterd ? new Date(op.enterd).toLocaleString() : 'Not entered'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {op.exited ? new Date(op.exited).toLocaleString() : 'Not exited'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => startEdit('parking', op)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteParkingOperation(op.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timetables Tab */}
        {activeTab === 'timetables' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Timetables</h2>
              <button
                onClick={() => setShowTimetableForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Timetable</span>
              </button>
            </div>

            {/* Timetables List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Train ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Point</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ending Point</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ending Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getTimetableArray().map((timetable, index) => (
                        <tr key={timetable.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timetable.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(timetable.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timetable.train_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {timetable.train_schedule?.train?.train_id || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timetable.starting_point}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(timetable.starting_time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timetable.ending_point}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(timetable.ending_time).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => startEdit('timetable', timetable)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimetable(timetable.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lanes Tab */}
        {activeTab === 'lanes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lanes</h2>
              <button
                onClick={() => setShowLaneForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Lane</span>
              </button>
            </div>

            {/* Lane Form */}
            {(showLaneForm || editingLane) && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">
                  {editingLane ? 'Edit Lane' : 'Create Lane'}
                </h3>
                <form onSubmit={editingLane ? handleUpdateLane : handleCreateLane}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lane Number *</label>
                      <input
                        type="number"
                        required
                        value={laneFormData.lane_number}
                        onChange={(e) => setLaneFormData({...laneFormData, lane_number: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Depot ID *</label>
                      <input
                        type="number"
                        required
                        value={laneFormData.depot}
                        onChange={(e) => setLaneFormData({...laneFormData, depot: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      <span>{editingLane ? 'Update' : 'Create'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLaneForm(false);
                        cancelEdit('lane');
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lanes List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depot Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lanes.map((lane, index) => (
                        <tr key={lane.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lane.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lane.lane_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lane.depot_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => startEdit('lane', lane)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteLane(lane.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsManager;