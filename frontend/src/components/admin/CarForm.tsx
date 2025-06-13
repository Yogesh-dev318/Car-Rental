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
    car: any; // Can be more specific if you have a Car type
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

        try {
            if (car) {
                await updateCar(car.id, payload);
            } else {
                await createCar(payload);
            }
            onFinished();
        } catch (error) {
            // Error is already toasted in the store
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" {...register('make', { required: 'Make is required' })} />
                    {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make.message as string}</p>}
                </div>
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" {...register('model', { required: 'Model is required' })} />
                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message as string}</p>}
                </div>
            </div>
            {/* ... other fields */}
            <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                {(base64Image || car?.imageUrl) && (
                     <img src={base64Image || car.imageUrl} alt="Car preview" className="mt-2 h-24 w-auto rounded"/>
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