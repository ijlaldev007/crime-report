'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RegisterFormData, registerSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn, getPasswordStrength } from '@/lib/utils';
import { AlertCircle, Bell, Shield, Mail, Check, X } from "lucide-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  // Watch password field for real-time updates
  const watchPassword = watch('password');
  const passwordStrength = getPasswordStrength(watchPassword || '');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration Failed');
      }

      toast.success('Registration successful! Please sign in.');
      router.push('/login');
    }
    catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  // Password requirements check
  const passwordRequirements = [
    { label: 'At least 8 characters', met: (watchPassword?.length || 0) >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(watchPassword || '') },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(watchPassword || '') },
    { label: 'Contains number', met: /[0-9]/.test(watchPassword || '') },
  ];

  return (
    <div className="flex h-screen">
      {/* Left Column - Gradient Background */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-900 via-red-900 to-blue-900">
        <div className="space-y-8 text-white">
          <h1 className="text-5xl font-bold tracking-tight">
            <span className="inline-block transform transition-transform duration-300 hover:scale-105">Crime</span>
            <span className="inline-block transform transition-transform duration-300 hover:scale-105">Report</span>
          </h1>

          <p className="text-xl max-w-md text-gray-100 transition-all duration-300 hover:text-white">
            Join our community-driven platform to help make our neighborhoods safer
          </p>

          <div className="space-y-5 text-gray-300">
            <div className="flex items-center space-x-3 group transform transition-all duration-300 hover:translate-x-2">
              <AlertCircle className="text-blue-300 group-hover:text-blue-200" size={24} />
              <span className="group-hover:text-white">Real-time incident reporting</span>
            </div>

            <div className="flex items-center space-x-3 group transform transition-all duration-300 hover:translate-x-2">
              <Bell className="text-blue-300 group-hover:text-blue-200" size={24} />
              <span className="group-hover:text-white">Community alerts and updates</span>
            </div>

            <div className="flex items-center space-x-3 group transform transition-all duration-300 hover:translate-x-2">
              <Shield className="text-blue-300 group-hover:text-blue-200" size={24} />
              <span className="group-hover:text-white">Direct communication with law enforcement</span>
            </div>
          </div>

          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-all duration-300 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <Mail size={18} />
            <span>Join Today</span>
          </button>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Join CrimeReport to contribute to community safety and stay informed about your neighborhood
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={cn(errors.name && 'ring-2 ring-red-500')}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register('email')}
                  className={cn(errors.email && 'ring-2 ring-red-500')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(errors.password && 'ring-2 ring-red-500')}
                />
                
                {/* Password Strength Meter */}
                {watchPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground min-w-[80px]">
                        {passwordStrength.message}
                      </span>
                    </div>
                    
                    {/* Password Requirements Checklist */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-destructive" />
                          )}
                          <span className={req.met ? 'text-muted-foreground' : 'text-destructive'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="min-h-[20px]">
                  {errors.password && (
                    <div className="px-3 py-1 bg-destructive/10 text-destructive text-sm rounded-md">
                      {errors.password.message}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline">
                  Sign in
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}




