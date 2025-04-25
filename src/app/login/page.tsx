'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Shield, Mail } from "lucide-react";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Define login form schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
        setIsLoading(false);
        return;
      }

      toast.success('Welcome back!');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

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
            Welcome back to our community-driven platform for safer neighborhoods
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center space-x-3 group transform transition-all duration-300 hover:translate-x-2">
              <Shield className="text-blue-300 group-hover:text-blue-200" size={24} />
              <span className="group-hover:text-white">Secure access to your reports</span>
            </div>
          </div>

          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-all duration-300 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <Mail size={18} />
            <span>Sign In</span>
          </button>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your CrimeReport account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
                  <AlertCircle size={16} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(errors.password && 'ring-2 ring-red-500')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-primary hover:underline">
                  Create account
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}



