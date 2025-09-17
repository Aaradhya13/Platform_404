const BASE_URL = import.meta.env.VITE_BASE_URL; // from .env

export const jobCardService = {

  // 📝 Job Cards


  getJobCards: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}inspection/jobcards/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job cards: ${response.status}`);
    }

    return response.json();
  },

  createJobCard: async (jobCardData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    if (!jobCardData.train) {
      throw new Error("Missing required field: train");
    }

    const url = `${BASE_URL}inspection/jobcards/`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
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
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}inspection/jobcards/`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update job card: ${response.status}`);
    }

    return response.json();
  },

  deleteJobCard: async (jobCardId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const url = `${BASE_URL}inspection/jobcards/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: jobCardId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete job card: ${response.status}`);
    }

    return response.json();
  },

  // 📸 Upload image to Pinata

  uploadImageToPinata: async (file) => {
    if (!file) {
      console.warn("No file provided for upload");
      return null;
    }

    const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image to Pinata: ${response.status}`);
      }

      const result = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
      console.error("Pinata upload error:", error);
      // Fallback URL if upload fails
      return "http://example.com/photo.png";
    }
  },
};
