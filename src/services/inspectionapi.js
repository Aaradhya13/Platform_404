export const inspectionService = {
  // Get all inspection entries
  getInspections: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/', {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch inspections: ${response.status}`);
    return response.json();
  },

  // Create new inspection entry
  createInspection: async (inspectionData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    if (!inspectionData.lane || !inspectionData.train)
      throw new Error('Missing required fields: lane and train');

    const response = await fetch('https://platform-404.onrender.com/inspection/', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inspectionData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create inspection: ${response.status} - ${errorData}`);
    }

    return response.json();
  },

  // Update inspection entry
  updateInspection: async (updateData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error(`Failed to update inspection: ${response.status}`);
    return response.json();
  },

  // Update inspection entry (alias for InspectionLanes compatibility)
  updateInspectionEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error(`Failed to update inspection: ${response.status}`);
    return response.json();
  },

  // Delete inspection entry
  deleteInspection: async (inspectionId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/', {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: inspectionId }),
    });

    if (!response.ok) throw new Error(`Failed to delete inspection: ${response.status}`);
    return response.json();
  },

  // --- Inspection Lanes ---
  getInspectionLanes: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/lanes/', {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch inspection lanes: ${response.status}`);
    return response.json();
  },

  createInspectionLane: async (laneData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    if (!laneData.lane_number || !laneData.depot)
      throw new Error('Missing required fields: lane_number and depot');

    const response = await fetch('https://platform-404.onrender.com/inspection/lanes/', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(laneData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create inspection lane: ${response.status} - ${errorData}`);
    }

    return response.json();
  },

  updateInspectionLane: async (updateData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/lanes/', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error(`Failed to update inspection lane: ${response.status}`);
    return response.json();
  },

  deleteInspectionLane: async (laneId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/lanes/', {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) throw new Error(`Failed to delete inspection lane: ${response.status}`);
    return response.json();
  },

  // --- Job Cards ---
  getJobCards: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/jobcards/', {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch job cards: ${response.status}`);
    return response.json();
  },

  createJobCard: async (jobCardData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');
    if (!jobCardData.train || !jobCardData.description)
      throw new Error('Missing required fields: train and description');

    const response = await fetch('https://platform-404.onrender.com/inspection/jobcards/', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobCardData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create job card: ${response.status} - ${errorData}`);
    }

    return response.json();
  },

  updateJobCard: async (updateData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/jobcards/', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) throw new Error(`Failed to update job card: ${response.status}`);
    return response.json();
  },

  deleteJobCard: async (jobCardId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/jobcards/', {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: jobCardId }),
    });

    if (!response.ok) throw new Error(`Failed to delete job card: ${response.status}`);
    return response.json();
  },

  closeJobCard: async (jobCardId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch('https://platform-404.onrender.com/inspection/jobcards/', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: jobCardId, closed_at: new Date().toISOString() }),
    });

    if (!response.ok) throw new Error(`Failed to close job card: ${response.status}`);
    return response.json();
  },
};
