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
  RefreshCw
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
    return { status: 'Open', color: 'bg-red-100 text-red-800' };
  }
  // If closed_at has any value (timestamp), show as Closed
  return { status: 'Closed', color: 'bg-green-100 text-green-800' };
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
            fetchJobCards();
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
      <div className="p-6">
        <button
          onClick={() => window.location.href = '/inspection'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium mb-6"
        >
          ← Back to Analytics
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-6">
      {/* Success Message */}
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

        {/* Header */}
        <header className="bg-blue-600 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Job Cards</h1>
                <p className="text-blue-100">Create and manage inspection job cards</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium border border-white/20"
                >
                  <Plus size={16} /> New Job Card
                </button>
                <button 
                  onClick={fetchJobCards}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium border border-white/20"
                >
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Create Form */}
      {showCreateForm && (
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
            Create New Job Card
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
                type="number"
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
              <label className="block text-sm font-semibold text-purple-700 mb-2">📸 Photo Upload</label>
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
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus-within:border-purple-500 transition-all duration-200 bg-white shadow-sm cursor-pointer flex items-center gap-2 hover:bg-purple-50"
                >
                  <Camera size={18} className="text-purple-600" />
                  <span className="text-gray-600">
                    {imageFile ? imageFile.name : 'Choose image'}
                  </span>
                </label>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2 md:col-span-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <label className="block text-sm font-semibold text-orange-700 mb-2">📝 Description</label>
              <textarea
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white shadow-sm resize-none"
                rows="4"
                required
                placeholder="Describe the issue or inspection finding"
              />
            </motion.div>

            {/* Image Preview */}
            {imagePreview && (
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-indigo-700 mb-2">📷 Image Preview</label>
                <div className="relative rounded-xl overflow-hidden border-2 border-indigo-200 max-w-xs">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="flex gap-4 mt-8 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleCreate}
              disabled={uploading}
              whileHover={!uploading ? { scale: 1.05, y: -2 } : {}}
              whileTap={!uploading ? { scale: 0.95 } : {}}
              className={`px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Job Card
                </>
              )}
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

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobCards.map((jobCard, index) => {
          const statusInfo = getCardStatus(jobCard);
          return (
            <div 
              key={jobCard.id} 
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer"
            >
              {/* Photo Section */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                {jobCard.photo && jobCard.photo !== 'http://example.com/photo.png' && jobCard.photo !== null && jobCard.photo.trim() !== '' ? (
                  <img 
                    src={jobCard.photo} 
                    alt="Job card photo" 
                    className="w-full h-full object-cover"
                    onClick={() => window.open(jobCard.photo, '_blank')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No photo available</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${statusInfo.color}`}>
                    {statusInfo.status}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                    <Train size={16} className="text-blue-600" />
                    <span className="font-bold text-blue-900">Train {jobCard.train}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg">
                    <FileText size={14} className="text-purple-600" />
                    <span className="font-medium text-purple-800 text-sm">#{jobCard.id}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  {editingId === jobCard.id ? (
                    <motion.textarea
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 transition-all duration-200 text-sm resize-none"
                      rows="3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    />
                  ) : (
                    <p className="text-gray-700 text-sm overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{jobCard.description}</p>
                  )}
                </div>

                {/* Timestamps */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>Created: {formatDateTime(jobCard.created_at)}</span>
                  </div>
                  {jobCard.closed_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle size={12} />
                      <span>Closed: {formatDateTime(jobCard.closed_at)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  {editingId === jobCard.id ? (
                    <motion.div 
                      className="flex gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <motion.button
                        onClick={handleSave}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Save changes"
                      >
                        <Save size={14} />
                      </motion.button>
                      <motion.button
                        onClick={handleCancel}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        title="Cancel editing"
                      >
                        <X size={14} />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex gap-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <motion.button
                        onClick={() => handleEdit(jobCard)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Edit description"
                      >
                        <Edit size={14} />
                      </motion.button>
                      
                      
                      {isAdmin && (
                        <motion.button
                          onClick={() => handleDelete(jobCard.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Delete job card"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {jobCards.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 bg-gray-100 rounded-full">
              <FileText size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No job cards found</p>
            <motion.button
              onClick={() => setShowCreateForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Your First Job Card
            </motion.button>
          </div>
        </motion.div>
      )}
        </div>
      </div>
    </div>
  );
};

export default JobCards;