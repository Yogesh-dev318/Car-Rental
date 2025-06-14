import { useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const MyBookingsPage = () => {
    const { myBookings, fetchMyBookings, isLoading } = useBookingStore();

    useEffect(() => {
        fetchMyBookings();
    }, [fetchMyBookings]);
    
    const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
        switch (status) {
            case 'confirmed': return 'default'; // Using 'default' for success-like state in shadcn
            case 'pending': return 'secondary';
            case 'cancelled': return 'destructive';
            case 'completed': return 'outline';
            default: return 'secondary';
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            {myBookings.length === 0 ? (
                <p>You have no bookings yet.</p>
            ) : (
                <div className="space-y-4">
                    {myBookings.map(booking => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{booking.car.make} {booking.car.model} ({booking.car.year})</CardTitle>
                                        <CardDescription className="pt-1">
                                            From {format(new Date(booking.startDate), 'PPP')} to {format(new Date(booking.endDate), 'PPP')}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusVariant(booking.status)} className="capitalize">{booking.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <img
                                    src={booking.car.imageUrl || 'https://placehold.co/150x100/F1F5F9/94A3B8?text=No+Image'}
                                    alt={`${booking.car.make} ${booking.car.model}`}
                                    className="w-40 h-24 object-cover rounded-md border"
                                />
                                <div className="text-lg font-semibold">
                                    Total Price: ${booking.totalPrice.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyBookingsPage;