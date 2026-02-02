import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import profileClient from '../api/profileClient';

const ProfileContext = createContext({});

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Profile Data
  const fetchProfile = async () => {
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

  // 2. Update Profile Data
  // You can pass a partial object, e.g., updateProfile({ bio: "New Bio" })
  // Or nested: updateProfile({ preferences: { ...profile.preferences, language: 'fr' } })
  const updateProfile = async (updates) => {
    try {
      // Optimistic Update (update UI immediately)
      const oldProfile = { ...profile };
      setProfile({ ...profile, ...updates });

      const res = await profileClient.put('/me', updates);
      
      // Confirm with server data
      setProfile(res.data);
      return { success: true };
    } catch (err) {
      console.error("Update Profile Error:", err);
      Alert.alert("Error", "Failed to save settings");
      // Revert if needed
      fetchProfile(); 
      return { success: false, error: err.message };
    }
  };

  // Initial load
  useEffect(() => {
    fetchProfile();
  }, []);

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