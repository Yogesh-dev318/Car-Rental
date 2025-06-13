// src/components/admin/CarForm.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCarStore } from '../../store/carStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Loader2 } from 'lucide-react';

interface CarFormProps {
    car: any; 
    onFinished: () => void;
}

const CarForm = ({ car, onFinished }: CarFormProps) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const { createCar, updateCar, isLoading } = useCarStore();
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const availability = watch('availability', car ? car.availability : true);

    useEffect(() => {
        if (car) {
            Object.keys(car).forEach(key => {
                setValue(key, car[key]);
            });
        }
    }, [car, setValue]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setBase64Image(reader.result as string);
        };
    };

    const onSubmit = async (data: any) => {
        data.year = parseInt(data.year, 10);
        data.pricePerDay = parseFloat(data.pricePerDay);

        const payload = { ...data };
        if (base64Image) {
            payload.imageUrl = base64Image;
        }

        // Use the boolean returned from the store to decide whether to close the form
        const success = car 
            ? await updateCar(car.id, payload)
            : await createCar(payload);

        if (success) {
            onFinished();
        }
        // If not successful, the dialog stays open and the error toast is already shown.
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" {...register('make', { required: 'Make is required' })} />
                    {errors.make && <p className="text-destructive text-sm mt-1">{errors.make.message as string}</p>}
                </div>
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" {...register('model', { required: 'Model is required' })} />
                    {errors.model && <p className="text-destructive text-sm mt-1">{errors.model.message as string}</p>}
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" {...register('year', { required: 'Year is required', valueAsNumber: true })} />
                    {errors.year && <p className="text-destructive text-sm mt-1">{errors.year.message as string}</p>}
                </div>
                 <div>
                    <Label htmlFor="type">Type (e.g., Sedan, SUV)</Label>
                    <Input id="type" {...register('type', { required: 'Type is required' })} />
                    {errors.type && <p className="text-destructive text-sm mt-1">{errors.type.message as string}</p>}
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="pricePerDay">Price Per Day</Label>
                    <Input id="pricePerDay" type="number" step="0.01" {...register('pricePerDay', { required: 'Price is required', valueAsNumber: true })} />
                     {errors.pricePerDay && <p className="text-destructive text-sm mt-1">{errors.pricePerDay.message as string}</p>}
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...register('location', { required: 'Location is required' })} />
                    {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message as string}</p>}
                </div>
            </div>
            <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                {(base64Image || car?.imageUrl) && (
                     <img src={base64Image || car.imageUrl} alt="Car preview" className="mt-2 h-24 w-auto rounded border"/>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="availability" checked={availability} onCheckedChange={(checked) => setValue('availability', checked)} />
                <Label htmlFor="availability">Available for Rent</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {car ? 'Update Car' : 'Create Car'}
            </Button>
        </form>
    );
};

export default CarForm;