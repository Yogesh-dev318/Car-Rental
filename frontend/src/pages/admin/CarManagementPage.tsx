import { useEffect, useState } from 'react';
import { useCarStore } from '../../store/carStore';
import { Button } from '../../components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '../../components/ui/dialog';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import CarForm from '../../components/admin/CarForm';

const CarManagementPage = () => {
    const { cars, fetchCars, deleteCar, isLoading } = useCarStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState<any>(null);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const handleEdit = (car: any) => {
        setSelectedCar(car);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setSelectedCar(null);
        setIsFormOpen(true);
    };
    
    const handleDeleteClick = (car: any) => {
        setCarToDelete(car);
        setIsConfirmOpen(true);
    };
    
    const confirmDelete = async () => {
        if (carToDelete) {
            const success = await deleteCar(carToDelete.id);
            if (success) {
                setIsConfirmOpen(false);
                setCarToDelete(null);
            }
            // If not successful, dialog stays open and toast is shown by the store
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Car Management</h1>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Car</Button>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{selectedCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
                    </DialogHeader>
                    <CarForm car={selectedCar} onFinished={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the
                            "{carToDelete?.make} {carToDelete?.model}".
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                         <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {isLoading && cars.length === 0 ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Make & Model</TableHead>
                                <TableHead>Price/Day</TableHead>
                                <TableHead>Availability</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cars.map(car => (
                                <TableRow key={car.id}>
                                    <TableCell>
                                        <img src={car.imageUrl || 'https://placehold.co/100x60'} alt={car.make} className="w-24 h-16 object-cover rounded border"/>
                                    </TableCell>
                                    <TableCell>{car.make} {car.model} ({car.year})</TableCell>
                                    <TableCell>${car.pricePerDay}</TableCell>
                                    <TableCell>{car.availability ? 'Available' : 'Booked'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => handleEdit(car)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                         <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(car)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default CarManagementPage;