import { useEffect } from 'react';
import { useCarStore } from '../store/carStore';
import CarCard from '../components/CarCard';
import { Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const CarFilters = () => {
  const { filters, setFilters } = useCarStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filter Cars</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="searchTerm">Car Name / Model</Label>
            <Input
              id="searchTerm"
              name="searchTerm"
              placeholder="e.g., Toyota Camry"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., New York"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price / Day</Label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="e.g., 100"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const { filteredCars, fetchCars, isLoading } = useCarStore();

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const availableFilteredCars = filteredCars.filter(c => c.availability);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Available Cars for Rent</h1>
      <p className="text-muted-foreground mb-6">Find and book the perfect car for your next trip.</p>
      
      <CarFilters />

      {isLoading && availableFilteredCars.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : availableFilteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableFilteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">No Cars Match Your Criteria</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;