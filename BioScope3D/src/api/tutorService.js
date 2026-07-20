import axiosClient from './axiosClient';

const tutorService = {
  chat: async (message) => {
    try {
      const response = await axiosClient.post('/tutor/chat', { message });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default tutorService;
