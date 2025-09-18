import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = 'https://platform-404.onrender.com';

export const useApi = () => {
  const authContext = useContext(AuthContext);
  
  console.log('useApi - AuthContext:', authContext);
  console.log('useApi - Token exists:', !!authContext?.token);
  console.log('useApi - Token value:', authContext?.token?.substring(0, 20) + '...' || 'No token');

  const { token } = authContext || {};

  const makeRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    const isFormData = options.body instanceof FormData;
    
    const config = {
      ...options,
      headers: {
        ...(token && { 'Authorization': `token ${token}` }),
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    };

    console.log('Making API request:');
    console.log('  URL:', url);
    console.log('  Method:', config.method || 'GET');
    console.log('  Headers:', config.headers);
    console.log('  Has Authorization:', !!config.headers.Authorization);
    
    if (config.body && !isFormData) {
      console.log('  Request Body:', config.body);
    } else if (isFormData) {
      console.log('  Request Body: FormData (image upload)');
    }

    try {
      const response = await fetch(url, config);
      
      console.log('API Response:');
      console.log('  Status:', response.status);
      console.log('  Status Text:', response.statusText);
      console.log('  OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('  Error Response Body:', errorText);
        throw new Error(`API call failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      let data;
      
  
      const responseText = await response.text();
      console.log('  Raw response text:', responseText);
      
      if (responseText.trim() === '') {
        
        console.log('  Empty response received');
        data = { success: true, message: 'Operation completed successfully' };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.log('  JSON parse failed, returning as text:', parseError.message);
          data = responseText;
        }
      } else {
        data = responseText;
      }
      
      console.log('  Data received:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint) => makeRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data, options = {}) => {
      const isFormData = data instanceof FormData;
      return makeRequest(endpoint, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data),
        ...options
      });
    },
    put: (endpoint, data, options = {}) => {
      console.log('PUT request - endpoint:', endpoint, 'data:', data);
      return makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options
      });
    },
    
    delete: (endpoint, data, options = {}) => {
      console.log('DELETE request - endpoint:', endpoint, 'data:', data);
      return makeRequest(endpoint, {
        method: 'DELETE',
        body: JSON.stringify(data),
        ...options
      });
    },

    testConnection: async () => {
      try {
        console.log('Testing API connection...');
        const response = await makeRequest('/inspection/jobcards/', { method: 'GET' });
        console.log('✅ API connection successful');
        return response;
      } catch (error) {
        console.log('❌ API connection failed:', error.message);
        throw error;
      }
    },

  
    checkEndpoints: async () => {
      const endpointsToCheck = [
        '/inspection/jobcards/',
        '/inspection/jobcard/', 
        '/jobcards/',
        '/api/inspection/jobcards/',
        '/api/jobcards/',
      ];

      console.log('Checking available endpoints...');
      
      for (const endpoint of endpointsToCheck) {
        try {
          const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'OPTIONS', 
            headers: {
              'Authorization': `token ${token}`,
            },
          });
          console.log(`${endpoint}: ${response.status} ${response.statusText}`);
        } catch (error) {
          console.log(`${endpoint}: Error - ${error.message}`);
        }
      }
    },
  };
};


export const useJobCardService = () => {
  const api = useApi();

  return {
    
    getAllJobCards: async () => {
      try {
        console.log('Fetching all job cards...');
        const jobCards = await api.get('/inspection/jobcards/');
        console.log('Job cards fetched:', jobCards?.length || 0, 'items');
        return jobCards;
      } catch (error) {
        console.error('Failed to fetch job cards:', error);
        throw error;
      }
    },

    createJobCard: async (jobCardData) => {
      try {
        console.log('Creating job card with data:', jobCardData);
        
        if (!jobCardData.train) {
          throw new Error('Train ID is required');
        }
        if (!jobCardData.description) {
          throw new Error('Description is required');
        }

        const newJobCard = await api.post('/inspection/jobcards/', jobCardData);
        console.log('Job card created successfully:', newJobCard);
        return newJobCard;
      } catch (error) {
        console.error('Failed to create job card:', error);
        throw error;
      }
    },

    updateJobCard: async (id, description) => {
      try {
        console.log('Updating job card:', id, 'with description:', description);
        
        if (!id) {
          throw new Error('Job card ID is required');
        }
        if (!description || !description.trim()) {
          throw new Error('Description is required');
        }

        const updatedJobCard = await api.put('/inspection/jobcards/', {
          id: id,
          description: description.trim()
        });
        
        console.log('Job card updated successfully:', updatedJobCard);
        return updatedJobCard;
      } catch (error) {
        console.error('Failed to update job card:', error);
        throw error;
      }
    },
    deleteJobCard: async (id) => {
      try {
        console.log('Deleting job card:', id);
        
        if (!id) {
          throw new Error('Job card ID is required');
        }

        const result = await api.delete('/inspection/jobcards/', { id: id });
        console.log('Job card deleted successfully:', result);
        return result;
      } catch (error) {
        console.error('Failed to delete job card:', error);
        throw error;
      }
    },
  };
};

const api = {
  post: async (endpoint, data) => {
    const url = `${BASE_URL}${endpoint}`;
    
    console.log('Login API request:');
    console.log('  URL:', url);
    console.log('  Data:', data);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Login Response:');
      console.log('  Status:', response.status);
      console.log('  OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('  Error Response:', errorText);
        throw new Error(`Login failed: ${response.status}. ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('  Login data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },
};

export default api;