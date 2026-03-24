// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {   
    const loadAuthData = async () => {  
      try {
        // 🔐 Token from Keychain
        const credentials = await Keychain.getGenericPassword();
// console.log(credentials)
        // 👤 User from AsyncStorage
        const storedUser = await AsyncStorage.getItem('USER_DATA');
// console.log(credentials,storedUser,"check data")
        if (credentials && storedUser) {
          // console.log(credentials.password,"password")
          setToken(credentials.password);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (userData, userToken) => {
    // 🔐 Save token securely
    await Keychain.setGenericPassword("userToken", userToken);

    // 👤 Save user data (non-sensitive)
    await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);
  };

  const logout = async () => {
    // 🔐 Remove token
    await Keychain.resetGenericPassword();

    // 👤 Remove user data
    await AsyncStorage.removeItem('USER_DATA');

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};