import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    userType: null,
    userId: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      const userType = await SecureStore.getItemAsync('userType');
      const userId = await SecureStore.getItemAsync('userId');

      if (token && userType && userId) {
        setAuthState({
          token,
          userType,
          userId,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({ ...authState, isLoading: false });
      }
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user_type, user_id } = response.data;
      
      setAuthState({
        token: access_token,
        userType: user_type,
        userId: user_id,
        isAuthenticated: true,
        isLoading: false,
      });

      await SecureStore.setItemAsync('userToken', access_token);
      await SecureStore.setItemAsync('userType', user_type);
      await SecureStore.setItemAsync('userId', String(user_id));

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.response?.data?.detail || error.message);
      return { success: false, error: error.response?.data?.detail || "Login failed" };
    }
  };
  
  const register = async (userData) => {
      try {
          await api.post('/auth/register', userData);
          return { success: true };
      } catch (error) {
          console.error("Registration failed:", error.response?.data?.detail || error.message);
          return { success: false, error: error.response?.data?.detail || "Registration failed" };
      }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userType');
    await SecureStore.deleteItemAsync('userId');
    setAuthState({
      token: null,
      userType: null,
      userId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};