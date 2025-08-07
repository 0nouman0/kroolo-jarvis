import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/neondb';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and get user profile
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token and get user profile
          const userData = await authAPI.getProfile();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      const response = await authAPI.signUp(email, password, metadata);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
      }
      
      return { data: response, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('already exists')) {
        return { 
          data: null, 
          error: { message: 'An account with this email already exists. Please try signing in instead.' }
        };
      }
      
      return { data: null, error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.signIn(email, password);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
      }
      
      return { data: response, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid credentials') || error.message?.includes('not found')) {
        return { 
          data: null, 
          error: { message: 'Invalid email or password. Please check your credentials and try again.' }
        };
      }
      
      return { data: null, error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authAPI.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await authAPI.resetPassword(email);
      return { data: response, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { data: null, error: { message: error.message } };
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(updates);
      setUser(response.user);
      return { data: response, error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { data: null, error: { message: error.message } };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
