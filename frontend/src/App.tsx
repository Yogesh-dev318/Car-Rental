import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from './store/authStore';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AdminSignupPage = lazy(() => import('./pages/admin/AdminSignupPage'));
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const CarManagementPage = lazy(() => import('./pages/admin/CarManagementPage'));
const BookingManagementPage = lazy(() => import('./pages/admin/BookingManagementPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const InvoicePage = lazy(() => import('./pages/InvoicePage'));

const App = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4 pt-20">
        <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-80px)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/cars" element={<HomePage />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/cars" /> : <LoginPage />} />
                <Route path="/signup" element={isAuthenticated ? <Navigate to="/cars" /> : <SignupPage />} />
                <Route path="/cars/:id" element={<CarDetailsPage />} />

                {/* Protected Routes (Customer & Admin) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/bookings/my" element={<MyBookingsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/invoice/:bookingId" element={<InvoicePage />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin/signup" element={<AdminSignupPage />} /> {/* Moved Here */}
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/cars" element={<CarManagementPage />} />
                    <Route path="/admin/bookings" element={<BookingManagementPage />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />
                </Route>
                
                {/* Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
      </main>
      <Toaster richColors />
    </Router>
  );
};

export default App;