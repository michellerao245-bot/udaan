import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    const token = localStorage.getItem('udaan_token');
    const savedUser = localStorage.getItem('udaan_user');

    if (token && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('udaan_token');
        localStorage.removeItem('udaan_user');
      }
    }

    setLoading(false);
  }, []);

  // ==================== LOGIN ====================
  const login = async (userId, password) => {
    try {
      const response = await authService.login(userId, password);

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Save to localStorage
        localStorage.setItem('udaan_token', token);
        localStorage.setItem('udaan_user', JSON.stringify(user));

        setCurrentUser(user);

        toast.success(`Welcome, ${user.name}!`);
        return { success: true, user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success('Logged out');
  };

  // ==================== ROLE CHECKS ====================
  const isSalesman = currentUser?.role === 'SALESMAN';
  const isDistributor = currentUser?.role === 'DISTRIBUTOR';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        isSalesman,
        isDistributor,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;