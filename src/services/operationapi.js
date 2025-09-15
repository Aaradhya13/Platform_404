export const operationsService = {
  // Parking Operations
  // Get all parking operations
  getParkingOperations: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch parking operations: ${response.status}`);
    }

    return response.json();
  },

  // Create new parking operation
  createParkingOperation: async (operationData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!operationData.train || !operationData.lane) {
      throw new Error('Missing required fields: train and lane');
    }
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create parking operation: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create parking operation error:', error);
      throw error;
    }
  },

  // Update parking operation
  updateParkingOperation: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update parking operation: ${response.status}`);
    }

    return response.json();
  },

  // Delete parking operation
  deleteParkingOperation: async (operationId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: operationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete parking operation: ${response.status}`);
    }

    return response.json();
  },

  // Timetable Operations
  // Get timetables
  getTimetables: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch timetables: ${response.status}`);
    }

    return response.json();
  },

  // Create new timetable
  createTimetable: async (timetableData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!timetableData.timetable || !timetableData.train_schedule) {
      throw new Error('Missing required fields: timetable and train_schedule');
    }
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timetableData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create timetable: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create timetable error:', error);
      throw error;
    }
  },

  // Update timetable
  updateTimetable: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update timetable: ${response.status}`);
    }

    return response.json();
  },

  // Delete timetable
  deleteTimetable: async (timetableId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: timetableId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete timetable: ${response.status}`);
    }

    return response.json();
  },

  // Lane Operations
  // Get all lanes
  getLanes: async () => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new lane
  createLane: async (laneData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (!laneData.lane_number || !laneData.depot) {
      throw new Error('Missing required fields: lane_number and depot');
    }
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
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
        throw new Error(`Failed to create lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create lane error:', error);
      throw error;
    }
  },

  // Update lane
  updateLane: async (updateData) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lane: ${response.status}`);
    }

    return response.json();
  },

  // Delete lane
  deleteLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete lane: ${response.status}`);
    }

    return response.json();
  },
};