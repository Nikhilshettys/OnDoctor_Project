
"use client";

import React from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase'; // Import Firebase auth
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth'; // Import GoogleAuthProvider and signInWithPopup
<<<<<<< HEAD
import { useRouter } from 'next/navigation'; // Import useRouter
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { toast } = useToast();
<<<<<<< HEAD
  const router = useRouter(); // Initialize router
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
  const { control, handleSubmit, formState: { errors, isSubmitting: isEmailSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);

  const onEmailSubmit = async (data: LoginFormValues) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Login data:", data);
    toast({
      title: "Login Attempted",
      description: "In a real app, you would now be logged in with email/password!",
      variant: "default",
    });
<<<<<<< HEAD
    router.push('/'); // Redirect to homepage
=======
    // Reset form or redirect user
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In successful, user:", user);
      toast({
        title: "Google Sign-In Successful!",
        description: `Welcome, ${user.displayName || user.email}! (Simulated)`,
        variant: "default",
      });
<<<<<<< HEAD
      router.push('/'); // Redirect to homepage
=======
      // In a real app, redirect or update auth state
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({
        title: "Google Sign-In Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="w-full h-full flex justify-center items-center p-4">
      <Card className="w-full max-w-xl shadow-xl">
=======
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl text-primary">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your OnDoctor account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10" {...field} />
                  )}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...field} />
                  )}
                />
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isEmailSubmitting || isGoogleSubmitting}>
              {isEmailSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isEmailSubmitting}
          >
            {isGoogleSubmitting ? (
              "Signing In with Google..."
            ) : (
              <>
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.02-6.99-6.76s3.13-6.76 6.99-6.76c1.89 0 3.25.78 4.14 1.62l2.58-2.47C17.99 3.19 15.61 2 12.48 2 7.46 2 3.55 5.63 3.55 10.61s3.91 8.61 8.93 8.61c3.44 0 6.04-1.16 7.97-3.05 2.01-1.95 2.62-4.9 2.62-7.17 0-.6-.05-1.18-.15-1.71H12.48z"></path></svg>
                Sign in with Google
              </>
            )}
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" asChild className="text-primary p-0 h-auto">
              <Link href="/signup">Sign up here</Link>
            </Button>
          </p>
           <Button variant="link" asChild className="text-sm text-muted-foreground p-0 h-auto">
              <Link href="#">Forgot password?</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
