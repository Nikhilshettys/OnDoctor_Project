
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link
import Image from 'next/image'; // Import Image
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAppointments } from '@/lib/mock-data';
import type { Appointment } from '@/types';
import { format, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Video, Phone, CalendarX, CalendarCheck, Info, History, User, Stethoscope as DoctorIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const AppointmentCard: React.FC<{ appointment: Appointment; onCancel: (id: string) => void }> = ({ appointment, onCancel }) => {
  const isUpcoming = appointment.status === 'Upcoming' && !isPast(appointment.dateTime);
  const { toast } = useToast();

  const handleCancel = () => {
    // Simulate API call for cancellation
    onCancel(appointment.id);
    toast({
      title: "Appointment Cancelled",
      description: `Your appointment with ${appointment.doctor.name} on ${format(appointment.dateTime, "PPPp")} has been cancelled.`,
      variant: "default", // Or destructive if preferred for cancellations
    });
  };
  
  const getStatusColor = () => {
    switch (appointment.status) {
      case 'Upcoming': return isPast(appointment.dateTime) ? 'text-gray-500' : 'text-primary'; // Handle upcoming but past due
      case 'Past': return 'text-green-600';
      case 'Cancelled': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  const getStatusText = () => {
    if (appointment.status === 'Upcoming' && isPast(appointment.dateTime)) {
      return 'Missed';
    }
    return appointment.status;
  }

  const getStatusIcon = () => {
    if (appointment.status === 'Upcoming' && isPast(appointment.dateTime)) {
      return <CalendarX className="h-5 w-5" />; // Icon for missed
    }
    switch (appointment.status) {
      case 'Upcoming': return <CalendarCheck className="h-5 w-5" />;
      case 'Past': return <History className="h-5 w-5" />;
      case 'Cancelled': return <CalendarX className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };
  
  const statusText = getStatusText();
  const statusColorClass = getStatusColor();
  const statusIcon = getStatusIcon();


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-primary">{format(appointment.dateTime, "PPP")}</CardTitle>
            <CardDescription>{format(appointment.dateTime, "p")}</CardDescription>
          </div>
          <div className={`flex items-center space-x-2 text-sm font-medium p-2 rounded-md ${statusColorClass} bg-opacity-10 ${
            statusText === 'Upcoming' ? 'bg-primary/10' : 
            statusText === 'Past' ? 'bg-green-500/10' : 
            statusText === 'Cancelled' || statusText === 'Missed' ? 'bg-destructive/10' : 'bg-gray-500/10'
          }`}>
            {statusIcon}
            <span>{statusText}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-foreground/80">
          <DoctorIcon className="h-5 w-5 text-primary" />
          <span>Dr. {appointment.doctor.name} ({appointment.doctor.specialty})</span>
        </div>
        <div className="flex items-center space-x-2 text-foreground/80">
          <User className="h-5 w-5 text-primary" />
          <span>Patient: {appointment.patientName}</span>
        </div>
        <div className="flex items-center space-x-2 text-foreground/80">
          {appointment.appointmentType === 'Video' ? <Video className="h-5 w-5 text-primary" /> : <Phone className="h-5 w-5 text-primary" />}
          <span>Type: {appointment.appointmentType} Consultation</span>
        </div>
        <p className="text-sm text-foreground/70 pt-1">
          <strong className="text-foreground/90">Reason:</strong> {appointment.reason}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-4">
        {isUpcoming && appointment.videoLink && (
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <a href={appointment.videoLink} target="_blank" rel="noopener noreferrer">
              <Video className="mr-2 h-4 w-4" /> Join Call
            </a>
          </Button>
        )}
        {isUpcoming && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                <CalendarX className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently cancel your appointment with Dr. {appointment.doctor.name} on {format(appointment.dateTime, "PPPp")}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} className="bg-destructive hover:bg-destructive/90">
                  Confirm Cancellation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
         {(statusText === 'Past' || statusText === 'Missed' || statusText === 'Cancelled') && (
           <Button variant="ghost" className="text-muted-foreground hover:text-primary">
             View Details
           </Button>
         )}
      </CardFooter>
    </Card>
  );
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    // Simulate fetching appointments
    // In a real app, this would be an API call
    setAppointments(mockAppointments.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
  }, []);

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status: 'Cancelled' } : app
      )
    );
    // In a real app, also update mockAppointments or call an API
    const index = mockAppointments.findIndex(app => app.id === appointmentId);
    if (index !== -1) {
      mockAppointments[index].status = 'Cancelled';
    }
  };

  const upcomingAppointments = appointments.filter(app => app.status === 'Upcoming' && !isPast(app.dateTime));
  const pastAppointments = appointments.filter(app => {
    if (app.status === 'Past' || app.status === 'Cancelled') return true;
    if (app.status === 'Upcoming' && isPast(app.dateTime)) return true; // Missed appointments
    return false;
  });


  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Your Appointments</CardTitle>
            <CardDescription>View your upcoming and past consultations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcomingAppointments.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingAppointments.map(app => (
                      <AppointmentCard key={app.id} appointment={app} onCancel={handleCancelAppointment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Image 
                      src="https://placehold.co/300x200.png" 
                      alt="No upcoming appointments" 
                      width={300} 
                      height={200} 
                      className="mx-auto mb-6 rounded-lg shadow-md"
                      data-ai-hint="empty calendar schedule"
                    />
                    <p className="text-lg mb-2">No upcoming appointments.</p>
                    <Button asChild variant="link" className="mt-2 text-primary">
                      <Link href="/schedule">Schedule a new one?</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past">
                {pastAppointments.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {pastAppointments.map(app => (
                      <AppointmentCard key={app.id} appointment={app} onCancel={handleCancelAppointment} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <Image 
                      src="https://placehold.co/300x200.png" 
                      alt="No past appointments" 
                      width={300} 
                      height={200} 
                      className="mx-auto mb-6 rounded-lg shadow-md"
                      data-ai-hint="history archive"
                    />
                    <p className="text-lg">No past appointments found.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
