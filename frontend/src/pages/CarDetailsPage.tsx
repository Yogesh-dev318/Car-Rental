import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCarStore } from '../store/carStore';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar as CalendarIcon, Loader2, MapPin, Tag, Car as CarIcon } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import type { DateRange } from 'react-day-picker';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { car, fetchCarById, isLoading: carLoading } = useCarStore();
  const { createBooking, isLoading: bookingLoading } = useBookingStore();
  const { isAuthenticated, user } = useAuthStore();

  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    if (id) {
      fetchCarById(id);
    }
  }, [id, fetchCarById]);

  const handleBooking = async () => {
      if (!isAuthenticated) {
          toast.error("You must be logged in to book a car.");
          navigate('/login');
          return;
      }
      if (user?.role === 'admin') {
          toast.error("Admins cannot book cars.");
          return;
      }
      if (!date?.from || !date?.to) {
          toast.error("Please select a start and end date.");
          return;
      }
      if (!id) return;
       
      const success = await createBooking({
        carId: id,
        startDate: date.from,
        endDate: date.to,
      });

      if (success) {
        navigate('/bookings/my');
      }
  };
  
  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = days > 0 && car ? days * car.pricePerDay : 0;

  if (carLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!car) {
    return <div className="text-center text-xl mt-10">Car not found.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img 
            src={car.imageUrl || 'https://placehold.co/600x400/F1F5F9/94A3B8?text=No+Image'} 
            alt={`${car.make} ${car.model}`}
            className="rounded-lg w-full h-auto object-cover border"
        />
        <Card className="mt-6">
            <CardHeader><CardTitle>Car Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <p className="flex items-center"><CarIcon className="w-5 h-5 mr-3 text-primary"/> {car.make} {car.model} ({car.year})</p>
                <p className="flex items-center"><CarIcon className="w-5 h-5 mr-3 text-primary"/> Type: {car.type}</p>
                <p className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-primary"/> Location: {car.location}</p>
                <p className="flex items-center text-xl font-bold"><Tag className="w-5 h-5 mr-3 text-primary"/> ${car.pricePerDay} / day</p>
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Book this Car</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Booking Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (<>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>) : (format(date.from, "LLL dd, y"))
                    ) : (<span>Pick a date range</span>)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2}
                    disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))} />
                </PopoverContent>
              </Popover>
            </div>

            {totalPrice > 0 && (
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">For {days} day(s)</p>
                </div>
            )}

            {!car.availability ? (
                <p className="text-center font-semibold text-destructive">This car is currently unavailable for booking.</p>
            ) : (
                 <Button onClick={handleBooking} className="w-full" disabled={bookingLoading || !date?.from || !date?.to}>
                    {bookingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Book Now
                </Button>
            )}

            {!isAuthenticated && (
                <p className="text-center text-sm">
                    Please <Link to="/login" className="text-primary underline">login</Link> or <Link to="/signup" className="text-primary underline">signup</Link> to book.
                </p>
            )}
             {isAuthenticated && user?.role === 'admin' && (
                <p className="text-center text-sm text-yellow-600">
                    Admins cannot book cars.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarDetailsPage;