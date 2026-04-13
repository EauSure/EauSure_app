import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import profileClient from '../api/profileClient';
import { useAuth } from './AuthContext'; // <-- 1. Import useAuth

const ProfileContext = createContext({});

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Grab the user state from AuthContext
  const { user, isLoading: authLoading } = useAuth(); 

  const fetchProfile = async () => {
    // 3. Block the request if there is no authenticated user
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await profileClient.get('/me');
      setProfile(res.data);
      setError(null);
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      setError("Could not load profile settings");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const oldProfile = { ...profile };
      setProfile({ ...profile, ...updates });

      const res = await profileClient.put('/me', updates);
      
      setProfile(res.data);
      return { success: true };
    } catch (err) {
      console.error("Update Profile Error:", err);
      Alert.alert("Error", "Failed to save settings");
      fetchProfile(); 
      return { success: false, error: err.message };
    }
  };

  // 4. Bind the fetch to the user state instead of mounting
  useEffect(() => {
    // Only attempt to fetch if AuthContext has finished its initial load
    if (!authLoading) {
      if (user) {
        fetchProfile();
      } else {
        // Clear profile if user logs out or session dies
        setProfile(null);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      loading, 
      error, 
      fetchProfile, 
      updateProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}