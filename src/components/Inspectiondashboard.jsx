import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Train, MapPin, AlertCircle, CheckCircle, Edit3, Search, Filter } from 'lucide-react';
import { inspectionService } from "../services/inspectionapi";

const InspectionDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [jobCards, setJobCards] = useState([]);
  const [lanes, setLanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inspections');
  const [editingInspection, setEditingInspection] = useState(null);
  const [editingJobCard, setEditingJobCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [inspectionsData, jobCardsData, lanesData] = await Promise.all([
        inspectionService.getInspections(),
        inspectionService.getJobCards(),
        inspectionService.getInspectionLanes()
      ]);
      
      setInspections(inspectionsData);
      setJobCards(jobCardsData);
      setLanes(lanesData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInspection = async (inspectionData) => {
    try {
      await inspectionService.updateInspection(inspectionData);
      await fetchAllData();
      setEditingInspection(null);
      setError(null);
    } catch (err) {
      setError('Failed to update inspection: ' + err.message);
    }
  };

  const handleUpdateJobCard = async (jobCardData) => {
    try {
      await inspectionService.updateJobCard(jobCardData);
      await fetchAllData();
      setEditingJobCard(null);
      setError(null);
    } catch (err) {
      setError('Failed to update job card: ' + err.message);
    }
  };

  const handleCloseJobCard = async (jobCardId) => {
    if (window.confirm('Are you sure you want to mark this job card as completed?')) {
      try {
        await inspectionService.closeJobCard(jobCardId);
        await fetchAllData();
        setError(null);
      } catch (err) {
        setError('Failed to close job card: ' + err.message);
      }
    }
  };

  const markInspectionCompleted = async (inspectionId) => {
    if (window.confirm('Are you sure you want to mark this inspection as completed?')) {
      try {
        const now = new Date().toISOString();
        await inspectionService.updateInspection({
          id: inspectionId,
          exited: now
        });
        await fetchAllData();
        setError(null);
      } catch (err) {
        setError('Failed to mark inspection as completed: ' + err.message);
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getInspectionStatus = (inspection) => {
    if (inspection.exited) return 'completed';
    if (inspection.enterd) return 'in-progress';
    return 'scheduled';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.depot_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.train_id?.toString().includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || getInspectionStatus(inspection) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredJobCards = jobCards.filter(jobCard => {
    const matchesSearch = jobCard.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobCard.train?.toString().includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'completed' && jobCard.closed_at) ||
                         (filterStatus === 'open' && !jobCard.closed_at);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inspection data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Train className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Inspection Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAllData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('inspections')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'inspections'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Inspections ({inspections.length})
              </button>
              <button
                onClick={() => setActiveTab('jobcards')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobcards'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Job Cards ({jobCards.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by depot, train, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === 'inspections' && (
                <>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </>
              )}
              {activeTab === 'jobcards' && (
                <>
                  <option value="open">Open</option>
                  <option value="completed">Completed</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Inspection Entries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Train & Lane
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Depot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry/Exit Times
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInspections.map((inspection) => {
                    const status = getInspectionStatus(inspection);
                    return (
                      <tr key={inspection.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Train className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Train {inspection.train_id}
                              </div>
                              <div className="text-sm text-gray-500">Lane {inspection.lane}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{inspection.depot_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-4 w-4 text-green-500 mr-1" />
                              Start: {formatDateTime(inspection.scheduledStart)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-red-500 mr-1" />
                              End: {formatDateTime(inspection.scheduledEnd)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div>Entry: {formatDateTime(inspection.enterd)}</div>
                            <div>Exit: {formatDateTime(inspection.exited)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => setEditingInspection(inspection)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          {status !== 'completed' && (
                            <button
                              onClick={() => markInspectionCompleted(inspection.id)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Job Cards Tab */}
        {activeTab === 'jobcards' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Job Cards</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Train
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Closed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobCards.map((jobCard) => (
                    <tr key={jobCard.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Train className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            Train {jobCard.train}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {jobCard.description}
                        </div>
                        {jobCard.photo && (
                          <div className="text-xs text-blue-600 mt-1">
                            <a href={jobCard.photo} target="_blank" rel="noopener noreferrer">
                              View Photo
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(jobCard.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          jobCard.closed_at 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }`}>
                          {jobCard.closed_at ? 'Completed' : 'Open'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(jobCard.closed_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingJobCard(jobCard)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        {!jobCard.closed_at && (
                          <button
                            onClick={() => handleCloseJobCard(jobCard.id)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Inspection Modal */}
      {editingInspection && (
        <EditInspectionModal
          inspection={editingInspection}
          lanes={lanes}
          onSave={handleUpdateInspection}
          onCancel={() => setEditingInspection(null)}
        />
      )}

      {/* Edit Job Card Modal */}
      {editingJobCard && (
        <EditJobCardModal
          jobCard={editingJobCard}
          onSave={handleUpdateJobCard}
          onCancel={() => setEditingJobCard(null)}
        />
      )}
    </div>
  );
};

// Edit Inspection Modal Component
const EditInspectionModal = ({ inspection, lanes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: inspection.id,
    lane: inspection.lane,
    train: inspection.train_id,
    scheduledStart: inspection.scheduledStart ? inspection.scheduledStart.slice(0, 16) : '',
    scheduledEnd: inspection.scheduledEnd ? inspection.scheduledEnd.slice(0, 16) : '',
    enterd: inspection.enterd ? inspection.enterd.slice(0, 16) : '',
    exited: inspection.exited ? inspection.exited.slice(0, 16) : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      scheduledStart: formData.scheduledStart ? new Date(formData.scheduledStart).toISOString() : null,
      scheduledEnd: formData.scheduledEnd ? new Date(formData.scheduledEnd).toISOString() : null,
      enterd: formData.enterd ? new Date(formData.enterd).toISOString() : null,
      exited: formData.exited ? new Date(formData.exited).toISOString() : null
    };
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Inspection</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lane</label>
              <select
                value={formData.lane}
                onChange={(e) => setFormData({...formData, lane: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Lane</option>
                {lanes.map((lane) => (
                  <option key={lane.id} value={lane.id}>
                    Lane {lane.bay_number} - {lane.depot_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Train ID</label>
              <input
                type="number"
                value={formData.train}
                onChange={(e) => setFormData({...formData, train: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Start</label>
              <input
                type="datetime-local"
                value={formData.scheduledStart}
                onChange={(e) => setFormData({...formData, scheduledStart: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled End</label>
              <input
                type="datetime-local"
                value={formData.scheduledEnd}
                onChange={(e) => setFormData({...formData, scheduledEnd: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Time</label>
              <input
                type="datetime-local"
                value={formData.enterd}
                onChange={(e) => setFormData({...formData, enterd: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exit Time</label>
              <input
                type="datetime-local"
                value={formData.exited}
                onChange={(e) => setFormData({...formData, exited: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Job Card Modal Component
const EditJobCardModal = ({ jobCard, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: jobCard.id,
    train: jobCard.train,
    description: jobCard.description,
    photo: jobCard.photo || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Job Card</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Train ID</label>
              <input
                type="number"
                value={formData.train}
                onChange={(e) => setFormData({...formData, train: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue or maintenance required..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL (Optional)</label>
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({...formData, photo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InspectionDashboard;