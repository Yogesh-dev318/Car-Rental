import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, MapPin, Tag, Car as CarIcon } from 'lucide-react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  location: string;
  pricePerDay: number;
  imageUrl?: string;
}

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <img 
            src={car.imageUrl || 'https://placehold.co/600x400/F1F5F9/94A3B8?text=No+Image'} 
            alt={`${car.make} ${car.model}`}
            className="rounded-t-lg h-48 w-full object-cover"
        />
      </CardHeader>
      <div className="p-6 flex flex-col flex-grow">
        <CardTitle className="mb-2">{car.make} {car.model}</CardTitle>
        <CardContent className="p-0 flex-grow space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {car.year}</div>
            <div className="flex items-center"><CarIcon className="w-4 h-4 mr-2" /> {car.type}</div>
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {car.location}</div>
            <div className="flex items-center text-lg font-semibold text-foreground pt-2">
                <Tag className="w-4 h-4 mr-2 text-primary"/> ${car.pricePerDay}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ day</span>
            </div>
        </CardContent>
        <CardFooter className="p-0 pt-6">
            <Button asChild className="w-full">
                <Link to={`/cars/${car.id}`}>View Details & Book</Link>
            </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default CarCard;