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
      await loginWithToken(token);
    }

  } catch (e) {
    console.log("Token invalid → logout");
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);

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
        await loginWithToken(res.data.token);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        msg: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };
  const register = async (email, password, name) => {
  try {
    await client.post('/auth/register', { email, password, name });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      msg: error.response?.data?.message || "Erreur lors de l'inscription"
    };
  }
};
const loginWithToken = async (token) => {
  try {
    await SecureStore.setItemAsync('userToken', token);

    const res = await client.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser({ token, ...res.data.user });
  } catch (e) {
    console.log("Token login error:", e);
    setUser({ token });
  }
};


  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, register, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}