import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${API_CONFIG.BASE_URL}/bookmarks`;

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const bookmarkService = {
  addBookmark: async (item_type, item_id, title) => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.post(
        API_URL,
        { item_type, item_id, title },
        config
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeBookmark: async (item_type, item_id) => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.delete(
        `${API_URL}/${item_type}/${item_id}`,
        config
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserBookmarks: async () => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default bookmarkService;
