import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  useEffect(() => {
    console.log('AuthContext State Change:');
    console.log('  User:', user);
    console.log('  Token exists:', !!token);
    console.log('  Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('  Loading:', loading);
  }, [user, token, loading]);

  const loadAuthData = async () => {
    try {
      console.log('Loading auth data from storage...');
      const savedUser = await AsyncStorage.getItem('user');
      const savedToken = await AsyncStorage.getItem('token');
      
      console.log('Saved user exists:', !!savedUser);
      console.log('Saved token exists:', !!savedToken);
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setToken(savedToken);
        console.log('Auth data loaded successfully');
      } else {
        console.log('No saved auth data found');
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, authToken) => {
    try {
      console.log('Login called with:');
      console.log('  User data:', userData);
      console.log('  Token exists:', !!authToken);
      
      setUser(userData);
      setToken(authToken);
      
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', authToken);
      
      console.log('Login successful - data saved to storage');
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('Logout called');
      
      setUser(null);
      setToken(null);
      
  
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      console.log('Logout successful - data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  console.log('AuthProvider rendering with value:', {
    hasUser: !!value.user,
    hasToken: !!value.token,
    loading: value.loading,
    isAuthenticated: value.isAuthenticated,
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };