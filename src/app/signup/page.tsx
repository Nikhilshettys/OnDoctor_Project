
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
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase'; // Import Firebase auth
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth'; // Import GoogleAuthProvider and signInWithPopup


const signupFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export default function SignupPage() {
  const { toast } = useToast();
  const { control, handleSubmit, formState: { errors, isSubmitting: isEmailSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);


  const onEmailSubmit = async (data: SignupFormValues) => {
    // Simulate API call for email/password signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Signup data:", data);
    toast({
      title: "Signup Successful!",
      description: "Your account has been created with email/password (simulated).",
      variant: "default",
    });
    // Reset form or redirect user
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-Up successful, user:", user);
      toast({
        title: "Google Sign-Up Successful!",
        description: `Welcome, ${user.displayName || user.email}! Your account is ready (Simulated).`,
        variant: "default",
      });
      // In a real app, you might create a user document in your database here
      // then redirect or update auth state
    } catch (error: any) {
      console.error("Google Sign-Up error:", error);
      toast({
        title: "Google Sign-Up Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl text-primary">Create Your Account</CardTitle>
          <CardDescription>Join OnDoctor to manage your health online.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input id="fullName" placeholder="Your full name" className="pl-10" {...field} />
                  )}
                />
              </div>
              {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
            </div>
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
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" {...field} />
                  )}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isEmailSubmitting || isGoogleSubmitting}>
              {isEmailSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
            disabled={isGoogleSubmitting || isEmailSubmitting}
          >
            {isGoogleSubmitting ? (
              "Signing Up with Google..."
            ) : (
               <>
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 2.03-4.66 2.03-3.86 0-6.99-3.02-6.99-6.76s3.13-6.76 6.99-6.76c1.89 0 3.25.78 4.14 1.62l2.58-2.47C17.99 3.19 15.61 2 12.48 2 7.46 2 3.55 5.63 3.55 10.61s3.91 8.61 8.93 8.61c3.44 0 6.04-1.16 7.97-3.05 2.01-1.95 2.62-4.9 2.62-7.17 0-.6-.05-1.18-.15-1.71H12.48z"></path></svg>
                Sign up with Google
              </>
            )}
          </Button>


        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="text-primary p-0 h-auto">
              <Link href="/login">Sign in</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
