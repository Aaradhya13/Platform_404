export const adminService = {
  // Check user role
  checkRole: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/check-role/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check role: ${response.status}`);
    }

    return response.json();
  },
  // Get all users
  getUsers: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/users/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return response.json();
  },

  // Create new user
  createUser: async (userData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/users/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create user: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/users/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update user: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // ===========================================
  // ROLES MANAGEMENT
  // ===========================================
  
  // Get all roles
  getRoles: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/roles/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }

    return response.json();
  },

  // Create new role
  createRole: async (roleData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/roles/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create role: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  },

  // Update role
  updateRole: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/roles/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update role: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update role error:', error);
      throw error;
    }
  },
  
  // Get all departments
  getDepartments: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/departments/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch departments: ${response.status}`);
    }

    return response.json();
  },

  // Create new department
  createDepartment: async (departmentData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/departments/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create department: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create department error:', error);
      throw error;
    }
  },

  // Update department
  updateDepartment: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/rail-admin/departments/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update department: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update department error:', error);
      throw error;
    }
  },


  // Get all operations
  getOperations: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch operations: ${response.status}`);
    }

    return response.json();
  },

  // Create new operation entry
  createOperation: async (operationData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
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
        throw new Error(`Failed to create operation: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create operation error:', error);
      throw error;
    }
  },

  // Update operation entry
  updateOperation: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update operation: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update operation error:', error);
      throw error;
    }
  },

  // Delete operation entry
  deleteOperation: async (operationId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: operationId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete operation: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete operation error:', error);
      throw error;
    }
  },
  // Get all operation lanes
  getOperationLanes: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch operation lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new operation lane
  createOperationLane: async (laneData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
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
        throw new Error(`Failed to create operation lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create operation lane error:', error);
      throw error;
    }
  },

  // Update operation lane
  updateOperationLane: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update operation lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update operation lane error:', error);
      throw error;
    }
  },

  // Delete operation lane
  deleteOperationLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: laneId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete operation lane: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete operation lane error:', error);
      throw error;
    }
  },

  // Get timetable
  getTimetable: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch timetable: ${response.status}`);
    }

    return response.json();
  },

  // Create new timetable entry
  createTimetableEntry: async (timetableData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
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
        throw new Error(`Failed to create timetable entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create timetable entry error:', error);
      throw error;
    }
  },

  // Update timetable entry
  updateTimetableEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update timetable entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update timetable entry error:', error);
      throw error;
    }
  },

  // Delete timetable entry
  deleteTimetableEntry: async (entryId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/operations/timetable/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: entryId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete timetable entry: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete timetable entry error:', error);
      throw error;
    }
  },

  // Get all cleaning schedules
  getCleaningSchedules: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cleaning schedules: ${response.status}`);
    }

    return response.json();
  },

  // Create new cleaning entry
  createCleaningEntry: async (entryData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create cleaning entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create cleaning entry error:', error);
      throw error;
    }
  },

  // Update cleaning entry
  updateCleaningEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update cleaning entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update cleaning entry error:', error);
      throw error;
    }
  },

  // Delete cleaning entry
  deleteCleaningEntry: async (entryId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: entryId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete cleaning entry: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete cleaning entry error:', error);
      throw error;
    }
  },
  
  // Get all cleaning lanes
  getCleaningLanes: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/lanes/';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cleaning lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new cleaning lane
  createCleaningLane: async (laneData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/lanes/';
    
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
        throw new Error(`Failed to create cleaning lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create cleaning lane error:', error);
      throw error;
    }
  },

  // Update cleaning lane
  updateCleaningLane: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update cleaning lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update cleaning lane error:', error);
      throw error;
    }
  },

  // Delete cleaning lane
  deleteCleaningLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/cleaning/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: laneId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete cleaning lane: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete cleaning lane error:', error);
      throw error;
    }
  },

  // ===========================================
  // INSPECTION MANAGEMENT
  // ===========================================
  
  // Get all inspections
  getInspections: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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

  // Create new inspection entry
  createInspectionEntry: async (entryData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to create inspection entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Create inspection entry error:', error);
      throw error;
    }
  },

  // Update inspection entry
  updateInspectionEntry: async (updateData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update inspection entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update inspection entry error:', error);
      throw error;
    }
  },

  // Delete inspection entry
  deleteInspectionEntry: async (entryId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: entryId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete inspection entry: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete inspection entry error:', error);
      throw error;
    }
  },

  // Get all inspection lanes
  getInspectionLanes: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update inspection lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update inspection lane error:', error);
      throw error;
    }
  },

  // Delete inspection lane
  deleteInspectionLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/inspection/lanes/';
    
    try {
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
    } catch (error) {
      console.error('Delete inspection lane error:', error);
      throw error;
    }
  },

  // Get all job cards
  getJobCards: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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

  // Get all maintenance entries
  getMaintenanceEntries: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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
  createMaintenanceEntry: async (entryData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
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
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update maintenance entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update maintenance entry error:', error);
      throw error;
    }
  },

  // Delete maintenance entry
  deleteMaintenanceEntry: async (entryId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: entryId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete maintenance entry: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete maintenance entry error:', error);
      throw error;
    }
  },
  // Get all maintenance lanes
  getMaintenanceLanes: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error:', errorData);
        throw new Error(`Failed to update maintenance lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Update maintenance lane error:', error);
      throw error;
    }
  },

  // Delete maintenance lane
  deleteMaintenanceLane: async (laneId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const url = 'https://platform-404.onrender.com/maintainance/lanes/';
    
    try {
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
    } catch (error) {
      console.error('Delete maintenance lane error:', error);
      throw error;
    }
  },

  // Get activity logs
getLogs: async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const url = 'https://platform-404.onrender.com/rail-admin/logs/';
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity logs: ${response.status}`);
  }

  return response.json();
},
  // Logout function
  logout: () => {
    localStorage.removeItem('token');
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Generic API call wrapper for future extensions
  makeApiCall: async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const url = `https://platform-404.onrender.com${endpoint}`;
    
    const config = {
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API call failed: ${response.status} - ${errorData}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  },
  
};