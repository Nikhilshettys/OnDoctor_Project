
"use client"; // Required because we use hooks like usePathname

import type React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Settings, HelpCircle, LayoutDashboard, CalendarDays, UserCircle, LogIn, UserPlus, AlarmClock, FileSignature, Utensils, MessageCircleQuestion, HeartPulse, Headset, TrendingUp, Bot, Scissors, LayoutGrid, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface MainLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/schedule', label: 'Schedule', icon: <CalendarDays className="h-5 w-5" /> },
  { href: '/appointments', label: 'Appointments', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/surgeries', label: 'Surgeries', icon: <Scissors className="h-5 w-5" /> },
  { href: '/departments', label: 'Departments', icon: <LayoutGrid className="h-5 w-5" /> },
  { href: '/meal-planner', label: 'Meal Plan', icon: <Utensils className="h-5 w-5" /> },
  { href: '/medicine-alarms', label: 'Alarms', icon: <AlarmClock className="h-5 w-5" /> },
  { href: '/eprescription', label: 'E-Rx', icon: <FileSignature className="h-5 w-5" /> },
  { href: '/my-health-devices', label: 'Devices', icon: <HeartPulse className="h-5 w-5" /> },
  { href: '/health-progress', label: 'Progress', icon: <TrendingUp className="h-5 w-5" /> },
  { href: '/ai-assistant', label: 'AI Assistant', icon: <Bot className="h-5 w-5" /> },
];

const utilityLinks = [
  { href: '/faq', label: 'FAQs', icon: <MessageCircleQuestion className="h-5 w-5" /> },
  { href: '/customer-support', label: 'Support', icon: <Headset className="h-5 w-5" /> },
  { href: '/account', label: 'Account', icon: <UserCircle className="h-5 w-5" /> },
]

const authLinks = [
  { href: '/login', label: 'Login', icon: <LogIn className="h-5 w-5" /> },
  { href: '/signup', label: 'Sign Up', icon: <UserPlus className="h-5 w-5" /> },
];


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar side="left" collapsible="icon" className="border-r bg-card">
            <SidebarHeader className="p-2 flex flex-col justify-center items-center pt-8 group-data-[collapsible=icon]:py-2">
              {/* Logo and text removed */}
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu className="p-2 space-y-1">
                {navLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        asChild
                        tooltip={{ children: link.label, side: "right", align: "center" }}
                        className={cn("group-data-[collapsible=icon]:justify-center", pathname === link.href && "bg-primary/10 text-primary")}
                        isActive={pathname === link.href}
                      >
                        <a>
                          {link.icon}
                          <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <Separator className="my-2" />
               <SidebarMenu className="p-2 space-y-1">
                {utilityLinks.map((link) => (
                  <SidebarMenuItem key={link.href}>
                    <Link href={link.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        asChild
                        tooltip={{ children: link.label, side: "right", align: "center" }}
                        className={cn("group-data-[collapsible=icon]:justify-center", pathname === link.href && "bg-primary/10 text-primary")}
                        isActive={pathname === link.href}
                      >
                        <a>
                          {link.icon}
                          <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <Separator className="my-2" />
              <SidebarMenu className="p-2 space-y-1">
                {authLinks.map((link) => (
                   <SidebarMenuItem key={link.href}>
                    <Link href={link.href} passHref legacyBehavior>
                      <SidebarMenuButton
                        asChild
                        tooltip={{ children: link.label, side: "right", align: "center" }}
                        className={cn("group-data-[collapsible=icon]:justify-center", pathname === link.href && "bg-primary/10 text-primary")}
                        isActive={pathname === link.href}
                      >
                        <a>
                          {link.icon}
                          <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2 flex group-data-[collapsible=icon]:justify-center">
               {/* ThemeToggleDropdown removed */}
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1">
            <main className="flex-grow py-8"> {/* MODIFIED: Removed container, mx-auto, px-4, flex, items-center */}
                {children}
            </main>
          </div>
        </div>
        <footer className="bg-muted text-muted-foreground py-6 text-center">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} OnDoctor. All rights reserved.</p>
            <p className="text-sm">Your Health, Connected.</p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
