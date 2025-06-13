// src/pages/admin/BookingManagementPage.tsx
import { useEffect } from 'react';
import { useBookingStore } from '../../store/bookingStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../../components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';

const BookingManagementPage = () => {
    const { bookings, fetchAllBookings, updateBookingStatus, isLoading } = useBookingStore();

    useEffect(() => {
        fetchAllBookings();
    }, [fetchAllBookings]);
    
    const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
        switch (status) {
            case 'confirmed': return 'default';
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            case 'completed': return 'outline';
            default: return 'secondary';
        }
    }
    
    const handleStatusChange = (id: string, status: string) => {
        updateBookingStatus(id, status);
    }

    if (isLoading && bookings.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
         <div>
            <h1 className="text-3xl font-bold mb-6">Booking Management</h1>
             <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Car</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Total Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.car.make} {booking.car.model}</TableCell>
                                <TableCell>{booking.user?.firstName} {booking.user?.lastName}</TableCell>
                                <TableCell>{format(new Date(booking.startDate), 'P')} - {format(new Date(booking.endDate), 'P')}</TableCell>
                                <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" disabled={isLoading}>Update Status</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'pending')}>Pending</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>Confirmed</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>Completed</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>Cancelled</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
        </div>
    );
};

export default BookingManagementPage;