import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobCardService } from '../../services/jobCardService';
import { 
  FileText, 
  Camera, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Upload,
  Clock,
  Train,
  AlertCircle,
  ImageIcon,
  RefreshCw,
  FolderOpen,
  Archive
} from 'lucide-react';

const JobCards = () => {
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Create states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    train: '',
    description: '',
    photo: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Filter states
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'closed', or 'all'

  useEffect(() => {
    fetchJobCards();
  }, []);

  const fetchJobCards = async () => {
    try {
      setLoading(true);
      const data = await jobCardService.getJobCards();
      
      // Sort job cards: open cards first, then by created date (newest first)
      const sortedData = data.sort((a, b) => {
        // Prioritize open cards (closed_at is null)
        if (!a.closed_at && b.closed_at) return -1;
        if (a.closed_at && !b.closed_at) return 1;
        
        // Then sort by created date (newest first)
        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setJobCards(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Separate job cards into open and closed
  const openJobCards = jobCards.filter(card => !card.closed_at);
  const closedJobCards = jobCards.filter(card => card.closed_at);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
  try {
    setUploading(true);
    setError(''); // Clear previous errors
    
    let photoUrl = null;
    
    // Upload image to Pinata if file is selected
    if (imageFile) {
      console.log('Uploading image to Pinata...');
      photoUrl = await jobCardService.uploadImageToPinata(imageFile);
      console.log('Uploaded image URL:', photoUrl);
    }
    
    // Validate required fields
    const trainNumber = parseInt(createData.train);
    if (isNaN(trainNumber)) {
      throw new Error('Please enter a valid train number');
    }
    
    if (!createData.description?.trim()) {
      throw new Error('Description is required');
    }
    
    const apiData = {
      train: trainNumber,
      photo: photoUrl || 'http://example.com/photo.png', // Use placeholder if no photo
      description: createData.description.trim()
    };
    
    console.log('Creating job card with data:', apiData);
    const response = await jobCardService.createJobCard(apiData);
    console.log('Job card created successfully:', response);
    
    // Reset form only after success
    setShowCreateForm(false);
    setCreateData({ train: '', description: '', photo: null });
    setImageFile(null);
    setImagePreview(null);
    
    setSuccess(`Job card created successfully - ID: ${response.id}`);
    setTimeout(() => setSuccess(''), 5000);
    
    setJobCards(prevJobCards => [response, ...prevJobCards]);
    
  } catch (err) {
    console.error('Error in handleCreate:', err);
    setError(err.message || 'Failed to create job card. Please try again.');
  } finally {
    setUploading(false);
  }
};

  const handleEdit = (jobCard) => {
    setEditingId(jobCard.id);
    setEditData({
      id: jobCard.id,
      description: jobCard.description
    });
  };

  const handleSave = async () => {
    try {
      const response = await jobCardService.updateJobCard(editData);
      setEditingId(null);
      setSuccess(`Job card updated successfully`);
      setTimeout(() => setSuccess(''), 5000);
      
      setJobCards(prevJobCards => 
        prevJobCards.map(jobCard => 
          jobCard.id === response.id ? response : jobCard
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (jobCardId) => {
    if (!window.confirm('Are you sure you want to delete this job card?')) {
      return;
    }
    
    try {
      await jobCardService.deleteJobCard(jobCardId);
      setSuccess('Job card deleted successfully');
      setTimeout(() => setSuccess(''), 5000);
      
      setJobCards(prevJobCards => 
        prevJobCards.filter(jobCard => jobCard.id !== jobCardId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleMarkAsFixed = async (jobCardId) => {
    try {
      const response = await jobCardService.updateJobCard({
        id: jobCardId,
        closed_at: new Date().toISOString()
      });
      setSuccess('Job card marked as fixed successfully');
      setTimeout(() => setSuccess(''), 5000);
      
      setJobCards(prevJobCards => 
        prevJobCards.map(jobCard => 
          jobCard.id === response.id ? response : jobCard
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setCreateData({ train: '', description: '', photo: null });
    setImageFile(null);
    setImagePreview(null);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getCardStatus = (jobCard) => {
    // If closed_at is null or undefined, show as Open
    if (jobCard.closed_at === null || jobCard.closed_at === undefined) {
      return { status: 'Open', color: 'bg-red-50 text-red-700 border border-red-200' };
    }
    // If closed_at has any value (timestamp), show as Closed
    return { status: 'Closed', color: 'bg-green-50 text-green-700 border border-green-200' };
  };

  const renderJobCardGrid = (cards, title, emptyMessage, icon) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm">{cards.length} {cards.length === 1 ? 'card' : 'cards'}</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-2">{icon}</div>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((jobCard) => {
            const statusInfo = getCardStatus(jobCard);
            return (
              <div 
                key={jobCard.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Photo Section */}
                <div className="relative h-48 bg-gray-100">
                  {jobCard.photo && jobCard.photo !== 'http://example.com/photo.png' && jobCard.photo !== null && jobCard.photo.trim() !== '' ? (
                    <img 
                      src={jobCard.photo} 
                      alt="Job card photo" 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => window.open(jobCard.photo, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={32} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                      {statusInfo.status}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Train size={16} className="text-[#24B6C9]" />
                      <span className="font-semibold text-gray-900">Train {jobCard.train}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FileText size={14} />
                      <span className="text-sm font-medium">#{jobCard.id}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    {editingId === jobCard.id ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({...editData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors text-sm resize-none"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{jobCard.description}</p>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock size={12} />
                      <span>Created: {formatDateTime(jobCard.created_at)}</span>
                    </div>
                    {jobCard.closed_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} />
                        <span>Closed: {formatDateTime(jobCard.closed_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    {/* Mark as Fixed button for open cards */}
                    {!jobCard.closed_at && (
                      <button
                        onClick={() => handleMarkAsFixed(jobCard.id)}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        Mark as Fixed
                      </button>
                    )}
                    
                    <div className="flex gap-2 ml-auto">
                      {editingId === jobCard.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            title="Save changes"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            title="Cancel editing"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                         <button
  onClick={() => handleEdit(jobCard)}
  className="flex items-center gap-2 px-3 py-2 bg-[#24B6C9] text-white rounded-lg 
             hover:bg-[#1e9db0] transition-colors shadow-md"
  title="Edit description"
>
  <Edit size={16} />
  <span className="font-medium">Edit</span>
</button>

                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(jobCard.id)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              title="Delete job card"
                            >
                              <Trash2 size={14} />
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
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-[#24B6C9]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading job cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Error</h3>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError('');
              fetchJobCards();
            }}
            className="w-full px-4 py-2 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1e9db0] transition-colors font-medium"
          >
            Try Again
          </button>
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
        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Cards Management</h1>
              <p className="text-gray-600">Create and manage inspection job cards efficiently</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></div>
                  <span>{openJobCards.length} Open Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></div>
                  <span>{closedJobCards.length} Closed Cards</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1e9db0] transition-colors font-medium"
              >
                <Plus size={16} /> New Job Card
              </button>
              <button 
                onClick={fetchJobCards}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-[#24B6C9] bg-opacity-10 rounded-lg">
                <Plus className="w-5 h-5 text-[#24B6C9]" />
              </div>
              Create New Job Card
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Train ID</label>
                <select
                  value={createData.train}
                  onChange={(e) => setCreateData({...createData, train: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors"
                  required
                >
                  <option value="">Select train ID</option>
                  {Array.from({length: 25}, (_, i) => i + 1).map(id => (
                    <option key={id} value={id}>Train {id}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Photo Upload</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label 
                    htmlFor="photo-upload"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {imageFile ? imageFile.name : 'Choose image file'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={createData.description}
                  onChange={(e) => setCreateData({...createData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#24B6C9] focus:ring-1 focus:ring-[#24B6C9] transition-colors resize-none"
                  rows="4"
                  required
                  placeholder="Describe the issue or inspection finding"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 max-w-xs">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={uploading}
                className={`inline-flex items-center gap-2 px-6 py-2.5 bg-[#24B6C9] text-white rounded-lg font-medium transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1e9db0]'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Create Job Card
                  </>
                )}
              </button>
              <button
                onClick={handleCancelCreate}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Job Cards Sections */}
        {jobCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job cards found</h3>
                <p className="text-gray-600">Get started by creating your first job card</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1e9db0] transition-colors font-medium"
              >
                <Plus size={18} />
                Create Job Card
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Open Job Cards Section */}
            {renderJobCardGrid(
              openJobCards,
              "Open Job Cards",
              "No open job cards. All issues have been resolved!",
              <FolderOpen size={20} className="text-red-600" />
            )}

            {/* Closed Job Cards Section */}
            {renderJobCardGrid(
              closedJobCards,
              "Closed Job Cards",
              "No closed job cards yet.",
              <Archive size={20} className="text-green-600" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCards;