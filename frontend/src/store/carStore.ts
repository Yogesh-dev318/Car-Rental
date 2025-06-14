import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  location: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl?: string;
}

interface CarState {
  cars: Car[];
  car: Car | null;
  isLoading: boolean;
  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  createCar: (carData: any) => Promise<boolean>;
  updateCar: (id: string, carData: any) => Promise<boolean>;
  deleteCar: (id: string) => Promise<boolean>;
}

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  car: null,
  isLoading: false,
  fetchCars: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/cars');
      set({ cars: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch cars';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  fetchCarById: async (id) => {
    set({ isLoading: true, car: null });
    try {
      const response = await axiosInstance.get(`/cars/${id}`);
      set({ car: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch car details';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  createCar: async (carData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/cars', carData);
      toast.success('Car created successfully!');
      await get().fetchCars(); // Refresh the list
      set({ isLoading: false });
      return true; // Return true on success
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false; // Return false on failure
    }
  },
  updateCar: async (id, carData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/cars/${id}`, carData);
      toast.success('Car updated successfully!');
      await get().fetchCars();
      set({ isLoading: false });
      return true; // Return true on success
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false; // Return false on failure
    }
  },
  deleteCar: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/cars/${id}`);
      toast.success('Car deleted successfully!');
      await get().fetchCars();
      set({ isLoading: false });
      return true; // Return true on success
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false; // Return false on failure
    }
  },
}));