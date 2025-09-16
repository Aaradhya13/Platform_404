export const jobCardService = {
  // Get all job cards
  getJobCards: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/jobcards/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job cards: ${response.status}`);
    }

    return response.json();
  },

  // Create new job card
  createJobCard: async (jobCardData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!jobCardData.train) {
      throw new Error('Missing required field: train');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/jobcards/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobCardData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create job card: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create job card error:', error);
      throw error;
    }
  },

  // Update job card
  updateJobCard: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/jobcards/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update job card: ${response.status}`);
    }

    return response.json();
  },

  // Delete job card
  deleteJobCard: async (jobCardId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/jobcards/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: jobCardId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete job card: ${response.status}`);
    }

    return response.json();
  },

  // Upload image to Pinata
  uploadImageToPinata: async (file) => {
    console.log('Starting image upload to Pinata...');
    if (!file) {
      console.warn('No file provided for upload');
      return null;
    }
    const PINATA_JWT = `${import.meta.env.REACT_APP_PINATA_JWT}`;
    console.log('Using Pinata JWT:', PINATA_JWT);
    const formData = new FormData();
    formData.append('file', file);
    console.log('FormData prepared for upload:', formData);
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Failed to upload image to Pinata: ${response.status}`);
      }

      const result = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
      console.error('Pinata upload error:', error);
      // Fallback to a placeholder URL if Pinata upload fails
      return 'http://example.com/photo.png';
    }
  }
};