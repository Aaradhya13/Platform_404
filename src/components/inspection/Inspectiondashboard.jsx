import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Train, MapPin, AlertCircle, CheckCircle, Edit3, Search, Filter } from 'lucide-react';

import LogoutButton from '../LogoutButton.jsx';


// Mock inspection service for demo
const inspectionService = {
  getInspections: () => Promise.resolve([
    {
      id: 1,
      train_id: 12345,
      lane: 3,
      depot_name: "Central Depot",
      scheduledStart: "2025-01-20T08:00:00Z",
      scheduledEnd: "2025-01-20T12:00:00Z",
      enterd: "2025-01-20T08:15:00Z",
      exited: null
    },
    {
      id: 2,
      train_id: 67890,
      lane: 1,
      depot_name: "North Station",
      scheduledStart: "2025-01-20T14:00:00Z",
      scheduledEnd: "2025-01-20T18:00:00Z",
      enterd: "2025-01-20T14:10:00Z",
      exited: "2025-01-20T17:45:00Z"
    }
  ]),
  getJobCards: () => Promise.resolve([
    {
      id: 1,
      train: 12345,
      description: "Brake system inspection required",
      created_at: "2025-01-20T10:30:00Z",
      closed_at: null,
      photo: null
    },
    {
      id: 2,
      train: 67890,
      description: "Engine oil leak detected",
      created_at: "2025-01-19T15:20:00Z",
      closed_at: "2025-01-20T16:00:00Z",
      photo: "https://example.com/photo.jpg"
    }
  ]),
  getInspectionLanes: () => Promise.resolve([
    { id: 1, bay_number: 1, depot_name: "Central Depot" },
    { id: 2, bay_number: 2, depot_name: "Central Depot" },
    { id: 3, bay_number: 3, depot_name: "Central Depot" }
  ]),
  updateInspection: (data) => Promise.resolve(data),
  updateJobCard: (data) => Promise.resolve(data),
  closeJobCard: (id) => Promise.resolve({ id })
};

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
      case 'completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'in-progress': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'scheduled': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-[#24B6C9] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#24B6C9] rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading inspection data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Professional Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] rounded-xl shadow-md">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inspection Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">Comprehensive rail inspection management system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchAllData}
                className="bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Data</span>
              </button>

              <LogoutButton variant="header" />

            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-2 border border-slate-200">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('inspections')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'inspections'
                    ? 'bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Train className="h-4 w-4" />
                <span>Inspections</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{inspections.length}</span>
              </button>
              <button
                onClick={() => setActiveTab('jobcards')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'jobcards'
                    ? 'bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Job Cards</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{jobCards.length}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Enhanced Search and Filter */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by depot, train, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              />
            </div>
            <div className="flex items-center space-x-3 min-w-fit">
              <Filter className="h-5 w-5 text-slate-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700 bg-white min-w-36"
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
        </div>

        {/* Inspections Tab */}
        {activeTab === 'inspections' && (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-semibold text-slate-800">Inspection Entries</h2>
              <p className="text-sm text-slate-600 mt-1">Manage and monitor train inspection activities</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Train & Lane
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Depot
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Entry/Exit Times
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredInspections.map((inspection, index) => {
                    const status = getInspectionStatus(inspection);
                    return (
                      <tr key={inspection.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#24B6C9]/10 to-[#1DA1B2]/10 rounded-lg mr-4">
                              <Train className="h-5 w-5 text-[#24B6C9]" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">
                                Train {inspection.train_id}
                              </div>
                              <div className="text-sm text-slate-500">Lane {inspection.lane}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                            <span className="text-sm font-medium text-slate-700">{inspection.depot_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-emerald-500 mr-2" />
                              <span className="text-slate-700 font-medium">Start:</span>
                              <span className="text-slate-600 ml-2">{formatDateTime(inspection.scheduledStart)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-rose-500 mr-2" />
                              <span className="text-slate-700 font-medium">End:</span>
                              <span className="text-slate-600 ml-2">{formatDateTime(inspection.scheduledEnd)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize border ${getStatusColor(status)}`}>
                            {status === 'in-progress' ? 'In Progress' : status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm space-y-1">
                            <div className="flex items-center">
                              <span className="text-slate-600 font-medium w-12">Entry:</span>
                              <span className="text-slate-700">{formatDateTime(inspection.enterd)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-slate-600 font-medium w-12">Exit:</span>
                              <span className="text-slate-700">{formatDateTime(inspection.exited)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => setEditingInspection(inspection)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#24B6C9] hover:text-[#1DA1B2] bg-[#24B6C9]/10 hover:bg-[#24B6C9]/20 rounded-lg transition-all duration-200"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            {status !== 'completed' && (
                              <button
                                onClick={() => markInspectionCompleted(inspection.id)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </button>
                            )}
                          </div>
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
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-xl font-semibold text-slate-800">Job Cards</h2>
              <p className="text-sm text-slate-600 mt-1">Track maintenance and repair tasks</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Train
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Closed
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredJobCards.map((jobCard, index) => (
                    <tr key={jobCard.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#24B6C9]/10 to-[#1DA1B2]/10 rounded-lg mr-4">
                            <Train className="h-5 w-5 text-[#24B6C9]" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            Train {jobCard.train}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-slate-800 truncate">
                            {jobCard.description}
                          </div>
                          {jobCard.photo && (
                            <div className="text-xs text-[#24B6C9] mt-2 hover:text-[#1DA1B2] transition-colors">
                              <a href={jobCard.photo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                View Photo
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-slate-700 font-medium">
                          {formatDateTime(jobCard.created_at)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          jobCard.closed_at 
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}>
                          {jobCard.closed_at ? 'Completed' : 'Open'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm text-slate-700 font-medium">
                          {formatDateTime(jobCard.closed_at)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setEditingJobCard(jobCard)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#24B6C9] hover:text-[#1DA1B2] bg-[#24B6C9]/10 hover:bg-[#24B6C9]/20 rounded-lg transition-all duration-200"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          {!jobCard.closed_at && (
                            <button
                              onClick={() => handleCloseJobCard(jobCard.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </button>
                          )}
                        </div>
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white">Edit Inspection</h3>
          <p className="text-[#24B6C9]/80 text-sm mt-1">Modify inspection details and scheduling</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Lane</label>
            <select
              value={formData.lane}
              onChange={(e) => setFormData({...formData, lane: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
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
            <label className="block text-sm font-semibold text-slate-700 mb-3">Train ID</label>
            <input
              type="number"
              value={formData.train}
              onChange={(e) => setFormData({...formData, train: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Scheduled Start</label>
              <input
                type="datetime-local"
                value={formData.scheduledStart}
                onChange={(e) => setFormData({...formData, scheduledStart: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Scheduled End</label>
              <input
                type="datetime-local"
                value={formData.scheduledEnd}
                onChange={(e) => setFormData({...formData, scheduledEnd: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Entry Time</label>
              <input
                type="datetime-local"
                value={formData.enterd}
                onChange={(e) => setFormData({...formData, enterd: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Exit Time</label>
              <input
                type="datetime-local"
                value={formData.exited}
                onChange={(e) => setFormData({...formData, exited: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white">Edit Job Card</h3>
          <p className="text-[#24B6C9]/80 text-sm mt-1">Update job card information and details</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Train ID</label>
            <input
              type="number"
              value={formData.train}
              onChange={(e) => setFormData({...formData, train: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700 resize-none"
              placeholder="Describe the issue or maintenance required..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Photo URL (Optional)</label>
            <input
              type="url"
              value={formData.photo}
              onChange={(e) => setFormData({...formData, photo: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent transition-all duration-200 text-slate-700"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#24B6C9] to-[#1DA1B2] text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InspectionDashboard;