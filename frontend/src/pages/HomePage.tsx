import { useEffect } from 'react';
import { useCarStore } from '../store/carStore';
import CarCard from '../components/CarCard';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const { cars, fetchCars, isLoading } = useCarStore();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  if (isLoading && cars.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const availableCars = cars.filter(c => c.availability);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Cars for Rent</h1>
      {availableCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableCars.map((car) => (
            <CarCard key={car.id} car={car} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-xl font-semibold">No Cars Available</h2>
            <p className="text-muted-foreground mt-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;