import axiosClient from './axiosClient';

const userService = {
  getProfile: async () => {
    try {
      const response = await axiosClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateStudyTime: async (minutes) => {
    try {
      const response = await axiosClient.post('/users/study-time', { minutes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  uploadProfileImage: async (uri, fileName, type) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri,
        name: fileName || 'profile.jpg',
        type: type || 'image/jpeg',
      });

      const response = await axiosClient.post('/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getLastActivity: async () => {
    try {
      const response = await axiosClient.get('/users/last-activity');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userService;
