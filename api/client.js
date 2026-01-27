import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 👇 C'est ici que la magie opère. Remplacez l'IP locale par votre domaine Vercel.
// Mettez "https" (Vercel le gère automatiquement, c'est plus sécurisé).
const API_URL = 'https://eau-sure-front.vercel.app/lib/api'; 

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Intercepteur : Ajoute automatiquement le token à chaque requête si on l'a
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;