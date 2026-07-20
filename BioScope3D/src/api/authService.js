import axiosClient from './axiosClient';

const authService = {
  // Request OTP for new signup
  requestSignupOtp: async (userData) => {
    try {
      const response = await axiosClient.post('/auth/request-signup-otp', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify OTP and Register user
  verifyAndRegister: async (data) => {
    try {
      const response = await axiosClient.post('/auth/verify-and-register', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login existing user
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request password reset OTP
  requestPasswordReset: async (email) => {
    try {
      const response = await axiosClient.post('/auth/request-password-reset', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify OTP and reset password
  resetPassword: async (data) => {
    try {
      const response = await axiosClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Google Login
  googleLogin: async (idToken) => {
    try {
      const response = await axiosClient.post('/auth/google', { idToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
