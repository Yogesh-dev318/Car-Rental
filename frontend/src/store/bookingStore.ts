import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'sonner';

interface Booking {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  car: {
    make: string;
    model: string;
    year: number;
    imageUrl?: string;
  };
  user?: {
      firstName: string;
      lastName: string;
  }
}

interface BookingState {
  bookings: Booking[];
  myBookings: Booking[];
  isLoading: boolean;
  createBooking: (bookingData: any) => Promise<boolean>;
  fetchAllBookings: () => Promise<void>; // For admin
  fetchMyBookings: () => Promise<void>; // For customer
  updateBookingStatus: (id: string, status: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  myBookings: [],
  isLoading: false,
  createBooking: async (bookingData) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/bookings', bookingData);
      toast.success('Booking created successfully!');
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      set({ isLoading: false });
      toast.error(errorMessage);
      return false;
    }
  },
  fetchAllBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/bookings');
      set({ bookings: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch bookings';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  fetchMyBookings: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/bookings/my');
      set({ myBookings: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch your bookings';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
  updateBookingStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      await get().fetchAllBookings(); // Refresh admin list
    } catch (error: any) {
       const errorMessage = error.response?.data?.message || 'Failed to update booking status';
      set({ isLoading: false });
      toast.error(errorMessage);
    }
  },
}));