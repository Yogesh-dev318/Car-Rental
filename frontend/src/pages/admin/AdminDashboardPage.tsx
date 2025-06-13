// src/pages/admin/AdminDashboardPage.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Car, BookCopy, Users } from 'lucide-react';

const AdminDashboardPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/admin/cars">
                    <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Car Management</CardTitle>
                             <Car className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Manage Cars</div>
                            <p className="text-xs text-muted-foreground">Add, edit, and delete car listings.</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link to="/admin/bookings">
                    <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Booking Management</CardTitle>
                             <BookCopy className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Manage Bookings</div>
                            <p className="text-xs text-muted-foreground">View and update booking statuses.</p>
                        </CardContent>
                    </Card>
                </Link>
                 <Link to="/admin/users">
                    <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Management</CardTitle>
                             <Users className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Manage Users</div>
                            <p className="text-xs text-muted-foreground">View and manage user accounts.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;