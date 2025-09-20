import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// IMPORTANT: Replace this with your computer's local IP address.
// On Windows, run `ipconfig` in cmd. On Mac/Linux, run `ifconfig` in terminal.
// Your phone and computer must be on the same Wi-Fi network.
const API_BASE_URL = 'https://w27zss2w-8000.inc1.devtunnels.ms/api'; // <--- CHANGE THIS

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;