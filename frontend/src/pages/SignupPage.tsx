// src/pages/SignupPage.tsx
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isLoading } = useAuthStore();

  const onSubmit = (data: any) => {
    signup(data);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to start renting cars.</CardDescription>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                  Login
              </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;