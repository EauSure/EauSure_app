import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your deployed URL or localhost
const BASE_URL = 'https://eau-sure-app-profile.vercel.app/api'; 

const profileClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token to every request
profileClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default profileClient;