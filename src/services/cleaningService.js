const BASE_URL = import.meta.env.VITE_BASE_URL;

export const cleaningService = {
  // Get all cleaning schedules
  getCleaningSchedules: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cleaning schedules: ${response.status}`);
    }

    return response.json();
  },

  // Create new cleaning entry
  createCleaningEntry: async (entryData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");
    if (!entryData.train) throw new Error("Missing required field: train");

    const url = `${BASE_URL}cleaning/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error(`Failed to create cleaning entry: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error("Create cleaning entry error:", error);
      throw error;
    }
  },

  // Update cleaning entry
  updateCleaningEntry: async (updateData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update cleaning entry: ${response.status}`);
    }

    return response.json();
  },

  // Delete cleaning entry
  deleteCleaningEntry: async (entryId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: entryId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete cleaning entry: ${response.status}`);
    }

    return response.json();
  },

  // Get all cleaning lanes
  getCleaningLanes: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/lanes/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cleaning lanes: ${response.status}`);
    }

    return response.json();
  },

  // Create new cleaning lane
  createCleaningLane: async (laneData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/lanes/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(laneData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Backend error:", errorData);
        throw new Error(`Failed to create cleaning lane: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error("Create cleaning lane error:", error);
      throw error;
    }
  },

  // Update cleaning lane
  updateCleaningLane: async (updateData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/lanes/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update cleaning lane: ${response.status}`);
    }

    return response.json();
  },

  // Delete cleaning lane
  deleteCleaningLane: async (laneId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}cleaning/lanes/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete cleaning lane: ${response.status}`);
    }

    return response.json();
  },
};
