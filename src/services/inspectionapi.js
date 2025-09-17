export const inspectionService = {
  // Inspection Operations
  // Get all inspection entries
  getInspections: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspections: ${response.status}`);
    }

    return response.json();
  },

  // Get all inspection schedules (alias for getInspections)
  getInspectionSchedules: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspections: ${response.status}`);
    }

    return response.json();
  },

  // Update inspection entry (alias for updateInspection)
  updateInspectionEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update inspection: ${response.status}`);
    }

    return response.json();
  },

  // Create new inspection entry
  createInspection: async (inspectionData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!inspectionData.lane || !inspectionData.train) {
      throw new Error('Missing required fields: lane and train');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inspectionData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create inspection: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create inspection error:', error);
      throw error;
    }
  },

  // Update inspection entry
  updateInspection: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update inspection: ${response.status}`);
    }

    return response.json();
  },

  // Delete inspection entry
  deleteInspection: async (inspectionId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: inspectionId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete inspection: ${response.status}`);
    }

    return response.json();
  },

  // Inspection Lanes Operations
  // Get all inspection lanes
  getInspectionLanes: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inspection lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new inspection lane
  createInspectionLane: async (laneData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!laneData.lane_number || !laneData.depot) {
      throw new Error('Missing required fields: lane_number and depot');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(laneData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create inspection lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create inspection lane error:', error);
      throw error;
    }
  },

  // Update inspection lane
  updateInspectionLane: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update inspection lane: ${response.status}`);
    }

    return response.json();
  },

  // Delete inspection lane
  deleteInspectionLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete inspection lane: ${response.status}`);
    }

    return response.json();
  },

  // Job Cards Operations
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
    
    if (!jobCardData.train || !jobCardData.description) {
      throw new Error('Missing required fields: train and description');
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

  // Close job card (mark as completed)
  closeJobCard: async (jobCardId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/inspection/jobcards/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: jobCardId,
        closed_at: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to close job card: ${response.status}`);
    }

    return response.json();
  },
};