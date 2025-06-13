// src/pages/ProfilePage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { profile, fetchUserProfile, updateUserProfile, isLoading } = useUserStore();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    
    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    useEffect(() => {
        if(profile) {
            setValue('firstName', profile.firstName);
            setValue('lastName', profile.lastName);
            setValue('email', profile.email);
        }
    }, [profile, setValue]);

    const onSubmit = (data: any) => {
        const updateData = { ...data };
        if (!updateData.password) {
            delete updateData.password;
        }
        updateUserProfile(updateData);
    };

    if (isLoading && !profile) {
        return (
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
    }
    
    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>View and update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" {...register('firstName', { required: 'First name is required' })} />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message as string}</p>}
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" {...register('lastName', { required: 'Last name is required' })} />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message as string}</p>}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">New Password</Label>
                            <Input id="password" type="password" {...register('password')} placeholder="Leave blank to keep current password" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;