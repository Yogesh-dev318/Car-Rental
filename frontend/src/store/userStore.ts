// src/store/userStore.ts
import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';
import { useAuthStore } from './authStore';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserState {
  profile: UserProfile | null;
  users: UserProfile[];
  isLoading: boolean;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (profileData: any) => Promise<void>;
  fetchAllUsers: () => Promise<void>; // For admin
  deleteUser: (id: string) => Promise<boolean>; // For admin
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  users: [],
  isLoading: false,
  fetchUserProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/users/profile');
      set({ profile: response.data, isLoading: false });
    } catch (error: any) {
       const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
       set({ isLoading: false });
       toast.error(errorMessage);
    }
  },
  updateUserProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put('/users/update-profile', profileData);
      set({ profile: response.data, isLoading: false });
      useAuthStore.setState({ user: response.data });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/users');
      set({ users: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  deleteUser: async (id: string) => {
     set({ isLoading: true });
     try {
        await axiosInstance.delete(`/users/${id}`);
        toast.success('User deleted successfully!');
        await get().fetchAllUsers();
        return true;
     } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to delete user';
        set({ isLoading: false });
        toast.error(errorMessage);
        return false;
     }
  }
}));