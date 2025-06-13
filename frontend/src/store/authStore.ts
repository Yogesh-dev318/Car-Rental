// src/store/authStore.ts
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as true to check auth status on load
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      toast.success('Logged in successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/signup', userData);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      toast.success('Signed up successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to sign up';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/auth/logout');
      set({ user: null, isAuthenticated: false, isLoading: false });
      toast.success('Logged out successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/auth/check');
      if (response.data.isAuthenticated) {
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));