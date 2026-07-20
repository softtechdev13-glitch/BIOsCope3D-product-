import axiosClient from './axiosClient';

const quizService = {
  getQuizzes: async () => {
    try {
      const response = await axiosClient.get('/quizzes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuizById: async (id) => {
    try {
      const response = await axiosClient.get(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getQuizQuestions: async (quizId) => {
    try {
      const response = await axiosClient.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSystemQuiz: async (systemName) => {
    try {
      const response = await axiosClient.get(`/quizzes/system/${encodeURIComponent(systemName)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitProgress: async (quizId, score) => {
    try {
      const response = await axiosClient.post('/quizzes/progress', { quiz_id: quizId, score });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getHistory: async () => {
    try {
      const response = await axiosClient.get('/quizzes/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  downloadHistoryPdf: async () => {
    try {
      // In a real mobile app, you might use RNFS or Linking to handle file downloads.
      // For now, we just return the URL or initiate the download.
      // Since axios returns blob/json depending on config, we might want to just open the URL.
      // The API endpoint is /api/quizzes/history/pdf
      return '/api/quizzes/history/pdf'; 
    } catch (error) {
      throw error;
    }
  }
};

export default quizService;
