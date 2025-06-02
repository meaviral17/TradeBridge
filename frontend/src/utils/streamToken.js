import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export const getStreamToken = async (jwtToken) => {
  if (!jwtToken) {
    throw new Error("JWT token is missing");
  }

  try {
    const res = await axios.get(`${API_BASE}/api/stream/token`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return res.data; // { token, userId }
  } catch (error) {
    console.error("❌ Failed to fetch Stream token:", error);
    throw error;
  }
};
