import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetchData = async (fileName: string) => {
  try {
    const response = await api.get(`/${fileName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${fileName} kernel:`, error);
    // Fallback to local data is not handled here but could be
    throw error;
  }
};

export default api;
