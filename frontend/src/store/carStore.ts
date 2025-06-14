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

interface CarFilters {
  searchTerm: string;
  maxPrice: number | '';
  location: string;
}

interface CarState {
  cars: Car[];
  filteredCars: Car[];
  filters: CarFilters;
  car: Car | null;
  isLoading: boolean;
  fetchCars: () => Promise<void>;
  fetchCarById: (id: string) => Promise<void>;
  setFilters: (newFilters: Partial<CarFilters>) => void;
  createCar: (carData: any) => Promise<boolean>;
  updateCar: (id: string, carData: any) => Promise<boolean>;
  deleteCar: (id: string) => Promise<boolean>;
}

const applyFilters = (cars: Car[], filters: CarFilters): Car[] => {
  return cars.filter(car => {
    const searchTermMatch =
      filters.searchTerm === '' ||
      car.make.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const priceMatch =
      filters.maxPrice === '' ||
      car.pricePerDay <= Number(filters.maxPrice);
    
    const locationMatch =
      filters.location === '' ||
      car.location.toLowerCase().includes(filters.location.toLowerCase());

    return searchTermMatch && priceMatch && locationMatch;
  });
};

export const useCarStore = create<CarState>((set, get) => ({
  cars: [],
  filteredCars: [],
  filters: {
    searchTerm: '',
    maxPrice: '',
    location: '',
  },
  car: null,
  isLoading: false,

  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    const filtered = applyFilters(get().cars, updatedFilters);
    set({ filters: updatedFilters, filteredCars: filtered });
  },

  fetchCars: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/cars');
      const cars = response.data;
      const filteredCars = applyFilters(cars, get().filters);
      set({ cars, filteredCars, isLoading: false });
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
      await get().fetchCars();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },
  
  updateCar: async (id, carData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/cars/${id}`, carData);
      toast.success('Car updated successfully!');
      await get().fetchCars();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  deleteCar: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/cars/${id}`);
      toast.success('Car deleted successfully!');
      await get().fetchCars();
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete car';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },
}));