
"use client";

import Link from 'next/link';
import { PanelLeft, X, Stethoscope, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggleDropdown } from '@/components/theme-toggle-dropdown';
import { useToast } from '@/hooks/use-toast';
<<<<<<< HEAD
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74

const Navbar: React.FC = () => {
  const { openMobile: isSidebarOpenOnMobile, setOpenMobile: setSidebarOpenOnMobile } = useSidebar();
  const { toast } = useToast();
<<<<<<< HEAD
  const router = useRouter(); // Initialize router
  const pathname = usePathname(); // Get current path
  const isAuthPage = pathname === '/login' || pathname === '/signup';
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out (simulated).",
      variant: "default",
    });
    // In a real app, you would clear auth state and redirect
<<<<<<< HEAD
    router.push('/login'); // Redirect to login page
=======
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-2">
<<<<<<< HEAD
            {!isAuthPage && (
              <div className="hidden md:flex">
                <SidebarTrigger />
              </div>
            )}
=======
            <div className="hidden md:flex">
              <SidebarTrigger />
            </div>
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
            {/* Brand Link */}
            <Link href="/" legacyBehavior passHref>
              <a className="flex items-center space-x-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
                <Stethoscope className="h-8 w-8" />
                <span>OnDoctor</span>
              </a>
            </Link>
          </div>

<<<<<<< HEAD
          {/* Right side */}
          <div className="flex items-center space-x-2">
            {!isAuthPage && (
              <>
                {/* Account Icon Link */}
                <Link href="/account" legacyBehavior passHref>
                  <a className="text-sm font-medium text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-colors p-2 hidden md:flex" title="Account">
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </a>
                </Link>
              </>
            )}
            <ThemeToggleDropdown />
            {!isAuthPage && (
               <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 md:h-9 md:w-9" title="Logout">
                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Logout</span>
              </Button>
            )}
            {/* Mobile Navigation Trigger for Left Sidebar */}
            {!isAuthPage && (
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpenOnMobile(!isSidebarOpenOnMobile)}>
                  {isSidebarOpenOnMobile ? <X className="h-6 w-6" /> : <PanelLeft className="h-6 w-6" />}
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </div>
            )}
=======
          {/* Middle section for Home link - visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" legacyBehavior passHref>
              <a className="text-sm font-medium text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-colors">
                Home
              </a>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Account Icon Link - Moved to the right */}
            <Link href="/account" legacyBehavior passHref>
              <a className="text-sm font-medium text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-colors p-2 hidden md:flex" title="Account">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </a>
            </Link>
            <ThemeToggleDropdown />
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 md:h-9 md:w-9" title="Logout">
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Logout</span>
            </Button>
            {/* Mobile Navigation Trigger for Left Sidebar */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpenOnMobile(!isSidebarOpenOnMobile)}>
                {isSidebarOpenOnMobile ? <X className="h-6 w-6" /> : <PanelLeft className="h-6 w-6" />}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </div>
>>>>>>> 8114eb7daf1f0662f29907bfaf501e9cbb413a74
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
