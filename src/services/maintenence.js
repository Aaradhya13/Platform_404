const BASE_URL = import.meta.env.VITE_BASE_URL; // from .env

export const maintenanceService = {

  // 🛠 Maintenance Entries


  getMaintenanceEntries: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance entries: ${response.status}`);
    }

    return response.json();
  },

  createMaintenanceEntry: async (maintenanceData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    if (!maintenanceData.train || !maintenanceData.lane) {
      throw new Error("Missing required fields: train and lane");
    }

    const url = `${BASE_URL}maintainance/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(maintenanceData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create maintenance entry: ${response.status} - ${errorData}`);
    }

    return response.json();
  },

  updateMaintenanceEntry: async (updateData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update maintenance entry: ${response.status}`);
    }

    return response.json();
  },

  deleteMaintenanceEntry: async (maintenanceId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: maintenanceId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete maintenance entry: ${response.status}`);
    }

    return response.json();
  },

  // =========================
  // 🛤 Maintenance Lane Operations
  // =========================

  getMaintenanceLanes: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/lanes/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance lanes: ${response.status}`);
    }

    return response.json();
  },

  createMaintenanceLane: async (laneData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    if (!laneData.lane_number || !laneData.depot) {
      throw new Error("Missing required fields: lane_number and depot");
    }

    const url = `${BASE_URL}maintainance/lanes/`;

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
      throw new Error(`Failed to create maintenance lane: ${response.status} - ${errorData}`);
    }

    return response.json();
  },

  updateMaintenanceLane: async (updateData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/lanes/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update maintenance lane: ${response.status}`);
    }

    return response.json();
  },

  deleteMaintenanceLane: async (laneId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}maintainance/lanes/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: laneId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete maintenance lane: ${response.status}`);
    }

    return response.json();
  },
};
