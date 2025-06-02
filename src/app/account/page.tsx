
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit3, Shield, CreditCard, LogOut, Mail, Calendar as CalendarIcon, ListChecks, AlarmClock, Utensils, HeartPulse, Headset, TrendingUp } from 'lucide-react'; // Added Headset, TrendingUp
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Mock user data - replace with actual data when auth is implemented
const mockUser = {
  name: "Demo User",
  email: "demo.user@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  joinDate: new Date(2024, 0, 15), // January 15, 2024
};

export default function AccountPage() {
  const { toast } = useToast();

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out (simulated).",
      variant: "default",
    });
    // In a real app, redirect to login or home page
  };

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20 shadow-md" data-ai-hint="profile picture">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl text-primary">{mockUser.name}</CardTitle>
            <CardDescription className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{mockUser.email}</span>
            </CardDescription>
            <CardDescription className="flex items-center justify-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Joined: {mockUser.joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AccountActionCard
                icon={<Edit3 className="h-6 w-6 text-primary" />}
                title="Edit Profile"
                description="Update your personal information."
                actionText="Go to Profile Settings"
                onAction={() => toast({ title: "Navigate", description: "To Profile Settings (simulated)"})}
              />
              <AccountActionCard
                icon={<Shield className="h-6 w-6 text-primary" />}
                title="Security"
                description="Change your password and manage security settings."
                actionText="Manage Security"
                onAction={() => toast({ title: "Navigate", description: "To Security Settings (simulated)"})}
              />
              <AccountActionCard
                icon={<CreditCard className="h-6 w-6 text-primary" />}
                title="Billing & Subscriptions"
                description="Manage your payment methods and subscriptions."
                actionText="View Billing"
                href="/billing"
              />
              <AccountActionCard
                icon={<ListChecks className="h-6 w-6 text-primary" />} 
                title="Appointment History"
                description="View your past and upcoming appointments."
                actionText="View Appointments"
                href="/appointments" 
              />
              <AccountActionCard
                icon={<AlarmClock className="h-6 w-6 text-primary" />}
                title="Medicine Alarms"
                description="Manage your medicine reminders."
                actionText="Set Alarms"
                href="/medicine-alarms"
              />
              <AccountActionCard
                icon={<Utensils className="h-6 w-6 text-primary" />}
                title="Meal Planner"
                description="Get personalized meal suggestions."
                actionText="Open Meal Planner"
                href="/meal-planner"
              />
              <AccountActionCard
                icon={<HeartPulse className="h-6 w-6 text-primary" />}
                title="My Health Devices"
                description="Manage connected medical devices."
                actionText="View Devices"
                href="/my-health-devices"
              />
              <AccountActionCard
                icon={<TrendingUp className="h-6 w-6 text-primary" />}
                title="Health Progress"
                description="Track your health metrics over time."
                actionText="View Progress"
                href="/health-progress"
              />
              <AccountActionCard
                icon={<Headset className="h-6 w-6 text-primary" />}
                title="Customer Support"
                description="Get help and support."
                actionText="Contact Support"
                href="/customer-support"
              />
            </div>
            
            <Separator className="my-8" />

            <div className="text-center">
              <Button variant="destructive" onClick={handleLogout} className="w-full md:w-auto">
                <LogOut className="mr-2 h-5 w-5" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface AccountActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  onAction?: () => void;
  href?: string;
}

function AccountActionCard({ icon, title, description, actionText, onAction, href }: AccountActionCardProps) {
  const content = (
    <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl text-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5" onClick={onAction}>
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );

  if (href) {
    return <a href={href} className="block no-underline hover:no-underline focus:outline-none" tabIndex={-1}>{content}</a>;
  }
  return content;
}
