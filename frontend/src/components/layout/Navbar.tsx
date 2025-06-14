import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Car, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-1 transition-colors ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
    }`;
  
  // Hide navbar on the landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <nav className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <Car className="h-6 w-6" />
          <span>Rent-A-Car</span>
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink to="/cars" className={navLinkClass}>
             Cars
          </NavLink>

          {isAuthenticated ? (
            <>
              {/* <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user?.firstName}
              </span> */}
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                   <LayoutDashboard size={18} />
                   <span className="hidden md:inline">Admin</span>
                </NavLink>
              )}
              <NavLink to="/profile" className={navLinkClass}>
                   <User size={18} />
                   <span className="hidden md:inline">Profile</span>
              </NavLink>
              <NavLink to="/bookings/my" className={navLinkClass}>
                   <Car size={18} />
                   <span className="hidden md:inline">My Bookings</span>
              </NavLink>
              <Button onClick={handleLogout} variant="destructive" size="sm">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;