// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Optionnel : Vérifier si le token est encore valide via l'API
        // const res = await client.get('/auth/me'); 
        // setUser(res.data.user);
        
        // Pour l'instant, on considère que si le token est là, on est connecté
        setUser({ token }); 
      }
    } catch (e) {
      console.error("Erreur lecture token", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Appel à votre route API existante (celle du fichier auth.js)
      const res = await client.post('/auth/login', { email, password });

      if (res.data.token) {
        await SecureStore.setItemAsync('userToken', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}