import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getGoogleUser } from './google_oauth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'dark' | 'light';
    fontSize: 'small' | 'medium' | 'large';
  };
  profilePicture?: string; // Add this property
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);

      if (!user || user.password !== password) {
        return { success: false, message: 'Incorrect email or password' };
      }

      // Create session
      const sessionUser: User = {
        id: user.id,
        name: user.username,
        email: user.email,
        preferences: { theme: 'dark' as const, fontSize: 'medium' },
        profilePicture: user.profilePicture || '' // Ensure profilePicture is included
      };

      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      setIsAuthenticated(true);

      // Refresh the page
      setTimeout(() => window.location.reload(), 0);

      return { success: true, message: 'Login successfully completed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((user: any) => user.email === email)) {
        return { success: false, message: 'The account is already registered' };
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      return { success: true, message: 'Signup successfully completed' };
    } catch (error) {
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);

    // Refresh the page
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};