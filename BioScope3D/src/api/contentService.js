import axiosClient from './axiosClient';

const contentService = {
  getSystems: async () => {
    try {
      const response = await axiosClient.get('/content/systems');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSystemOrgans: async (systemId) => {
    try {
      const response = await axiosClient.get(`/content/systems/${systemId}/organs`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getOrganById: async (organId) => {
    try {
      const response = await axiosClient.get(`/content/organs/${organId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecentLearning: async () => {
    try {
      const response = await axiosClient.get('/content/recent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logActivity: async (organId, progress = 0) => {
    try {
      const response = await axiosClient.post('/content/activity', { organ_id: organId, progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default contentService;
