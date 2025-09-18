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

  RefreshCw,
  FolderOpen,
  Archive

} from 'lucide-react';

const MaintenanceJobCards = () => {
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

      // Sort by created date (newest first) within each category
      const sortedData = data.sort((a, b) => {

        return new Date(b.created_at) - new Date(a.created_at);
      });
      
      setJobCards(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Separate open and closed job cards
  const openJobCards = jobCards.filter(jobCard => !jobCard.closed_at);
  const closedJobCards = jobCards.filter(jobCard => jobCard.closed_at);

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

  const handleClose = async (jobCard) => {
    if (!window.confirm('Are you sure you want to close this job card?')) {
      return;
    }
    
    try {
      // Get current timestamp in ISO format
      const currentTimestamp = new Date().toISOString();
      
      const updateData = {
        id: jobCard.id,
        description: jobCard.description,
        closed_at: currentTimestamp  // Add the current timestamp
      };
      
      console.log('Closing job card with data:', updateData);
      const response = await jobCardService.updateJobCard(updateData);
      setSuccess(`Job card closed successfully`);
      setTimeout(() => setSuccess(''), 5000);
      
      // Update the specific job card in state with the response
      setJobCards(prevJobCards => 
        prevJobCards.map(card => 
          card.id === response.id ? response : card
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
      return { status: 'Open', color: 'bg-red-50 text-red-600 border border-red-200' };
    }
    // If closed_at has any value (timestamp), show as Closed
    return { status: 'Closed', color: 'bg-green-50 text-green-600 border border-green-200' };
  };


  const renderJobCard = (jobCard, index) => {
    const statusInfo = getCardStatus(jobCard);
    return (
      <motion.div 
        key={jobCard.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Train size={16} className="text-[#24B6C9]" />
              <span className="font-semibold text-gray-900">Train {jobCard.train}</span>
            </div>
            <span className="text-sm text-gray-500">#{jobCard.id}</span>
          </div>

          {/* Description */}
          <div className="mb-4">
            {editingId === jobCard.id ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#24B6C9] focus:border-transparent text-sm resize-none"
                rows="3"
              />
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{jobCard.description}</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="space-y-2 mb-4 text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-2" />
              <span>Created: {formatDateTime(jobCard.created_at)}</span>
            </div>
            {jobCard.closed_at && (
              <div className="flex items-center">
                <CheckCircle size={12} className="mr-2" />
                <span>Closed: {formatDateTime(jobCard.closed_at)}</span>
              </div>
            )}
          </div>

            // For MaintenanceJobCards component, replace the Actions section in renderJobCard function:

{/* Actions */}
<div className="flex justify-end space-x-2">
  {editingId === jobCard.id ? (
    <>
      <button
        onClick={handleSave}
        className="inline-flex items-center p-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        title="Save changes"
      >
        <Save size={14} />
      </button>
      <button
        onClick={handleCancel}
        className="inline-flex items-center p-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        title="Cancel editing"
      >
        <X size={14} />
      </button>
    </>
  ) : (
    <>
      {/* Only show Edit button if job card is not closed */}
      {!jobCard.closed_at && (
        <button
          onClick={() => {
            setEditingId(jobCard.id);
            setEditData(jobCard);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 
                     rounded-md hover:bg-gray-200 transition-colors shadow-sm"
          title="Edit job card"
        >
          <Edit size={16} />
          <span className="text-sm font-medium">Edit</span>
        </button>
      )}

      {!jobCard.closed_at && (
        <button
          onClick={() => handleClose(jobCard)}
          className="inline-flex items-center p-2 text-white bg-[#24B6C9] rounded-md hover:bg-[#1fa5b8] transition-colors"
          title="Close job card"
        >
          <CheckCircle size={14} />
        </button>
      )}
      
      {isAdmin && (
        <button
          onClick={() => handleDelete(jobCard.id)}
          className="inline-flex items-center p-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          title="Delete job card"
        >
          <Trash2 size={14} />
        </button>
      )}
    </>
  )}
</div>
        </div>
      </motion.div>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#24B6C9] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError('');
                fetchJobCards();
              }}
              className="w-full px-4 py-2 bg-[#24B6C9] text-white rounded-lg hover:bg-[#1fa5b8] transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => window.location.href = '/maintenance'}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Back to Analytics
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Maintenance Job Cards</h1>
                <p className="text-gray-600 mt-1">Manage and track maintenance job cards</p>
              </div>
            </div>
            
            <button 
              onClick={fetchJobCards}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#24B6C9] border border-transparent rounded-lg hover:bg-[#1fa5b8] transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>


          {/* Statistics */}
          <div className="mt-6 flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <FolderOpen size={20} className="text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                Open Cards: <span className="font-bold text-red-600">{openJobCards.length}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Archive size={20} className="text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Closed Cards: <span className="font-bold text-green-600">{closedJobCards.length}</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </motion.div>
        )}


        {/* Open Job Cards Section */}
        {openJobCards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <FolderOpen size={24} className="text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">
                Open Job Cards ({openJobCards.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {openJobCards.map((jobCard, index) => renderJobCard(jobCard, index))}
            </div>
          </div>
        )}

        {/* Closed Job Cards Section */}
        {closedJobCards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Archive size={24} className="text-green-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">
                Closed Job Cards ({closedJobCards.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {closedJobCards.map((jobCard, index) => renderJobCard(jobCard, index))}
            </div>
          </div>
        )}

        {/* No Job Cards Message */}
        {jobCards.length === 0 && (

          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job cards found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first maintenance job card.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-[#24B6C9] border border-transparent rounded-lg hover:bg-[#1fa5b8] transition-colors"
              >
                <Plus size={18} className="mr-2" />
                Create First Job Card
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceJobCards;