export const maintenanceService = {
  getMaintenanceEntries: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance entries: ${response.status}`);
    }

    return response.json();
  },

  // Create new maintenance entry
  createMaintenanceEntry: async (maintenanceData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!maintenanceData.train || !maintenanceData.lane) {
      throw new Error('Missing required fields: train and lane');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create maintenance entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create maintenance entry error:', error);
      throw error;
    }
  },

  // Update maintenance entry
  updateMaintenanceEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update maintenance entry: ${response.status}`);
    }

    return response.json();
  },

  // Delete maintenance entry
  deleteMaintenanceEntry: async (maintenanceId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: maintenanceId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete maintenance entry: ${response.status}`);
    }

    return response.json();
  },

  // Maintenance Lane Operations
  // Get all maintenance lanes
  getMaintenanceLanes: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new maintenance lane
  createMaintenanceLane: async (laneData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!laneData.lane_number || !laneData.depot) {
      throw new Error('Missing required fields: lane_number and depot');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
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
        throw new Error(`Failed to create maintenance lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create maintenance lane error:', error);
      throw error;
    }
  },

  // Update maintenance lane
  updateMaintenanceLane: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update maintenance lane: ${response.status}`);
    }

    return response.json();
  },

  // Delete maintenance lane
  deleteMaintenanceLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete maintenance lane: ${response.status}`);
    }

    return response.json();
  },
};