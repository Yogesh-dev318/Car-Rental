import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminSignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    // Add the admin role to the submission data
    const adminData = { ...data, role: 'admin' };
    
    // The signup function in the store returns a boolean for success
    await signup(adminData).then((success) => {
        if (success) {
            toast.success("Admin account created successfully! Navigating to dashboard.");
            navigate('/admin/dashboard');
        }
        // If not successful, the error toast is already shown by the store
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>Enter the details for the new administrator.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register('firstName', { required: 'First name is required' })} />
                    {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message as string}</p>}
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register('lastName', { required: 'Last name is required' })} />
                    {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message as string}</p>}
                </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message as string}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Admin
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
              Return to regular{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                  Login page
              </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignupPage;