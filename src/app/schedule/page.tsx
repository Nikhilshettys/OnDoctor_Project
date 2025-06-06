
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockDoctors, getAvailableTimeSlots, addMockAppointment } from '@/lib/mock-data';
import type { Doctor, TimeSlot, SchedulingFormData } from '@/types';
import { format, isValid, setHours, setMinutes, setSeconds, startOfDay } from 'date-fns';
import { AlertCircle, CheckCircle, Loader2, CalendarOff } from 'lucide-react'; // Added CalendarOff
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

const scheduleFormSchema = z.object({
  patientName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  patientEmail: z.string().email({ message: "Please enter a valid email." }),
  reason: z.string().min(10, { message: "Reason must be at least 10 characters." }),
});


export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(mockDoctors[0].id);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>(undefined);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SchedulingFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (selectedDate && selectedDoctorId) {
      setIsLoadingSlots(true);
      setAvailableSlots([]); // Clear previous slots immediately
      setTimeout(() => {
        const slots = getAvailableTimeSlots(selectedDate, selectedDoctorId);
        setAvailableSlots(slots);
        setSelectedSlot(undefined); 
        setIsLoadingSlots(false);
      }, 500);
    }
  }, [selectedDate, selectedDoctorId]);

  const handleDateSelect = (date?: Date) => {
    if (date && isValid(date)) {
        const now = new Date();
        const newSelectedDate = setSeconds(setMinutes(setHours(date, now.getHours()), now.getMinutes()), now.getSeconds());
        setSelectedDate(newSelectedDate);
    } else {
        setSelectedDate(undefined);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const onSubmit = async (data: SchedulingFormData) => {
    if (!selectedSlot || !selectedDate || !selectedDoctorId) {
      toast({
        title: "Error",
        description: "Please select a date, time slot, and doctor.",
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentDateTime = selectedSlot.startTime;
      addMockAppointment({
        ...data,
        doctorId: selectedDoctorId,
        dateTime: appointmentDateTime,
        appointmentType: 'Video', 
      });

      toast({
        title: "Appointment Scheduled!",
        description: (
          <div className="flex flex-col">
            <span>Doctor: {mockDoctors.find(d => d.id === selectedDoctorId)?.name}</span>
            <span>Date: {format(appointmentDateTime, "PPPp")}</span>
            <span>Thank you, {data.patientName}!</span>
          </div>
        ),
        action: <CheckCircle className="text-green-500" />,
      });
      
      reset();
      setSelectedSlot(undefined);
      if (selectedDate && selectedDoctorId) {
        setIsLoadingSlots(true);
        setTimeout(() => {
          const slots = getAvailableTimeSlots(selectedDate, selectedDoctorId);
          setAvailableSlots(slots);
          setIsLoadingSlots(false);
        }, 100); 
      }

    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const selectedDoctor = mockDoctors.find(d => d.id === selectedDoctorId);

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Schedule a Consultation</CardTitle>
            <CardDescription>Choose a doctor, date, and time for your appointment.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="doctor-select" className="text-lg font-medium mb-2 block">Select Doctor</Label>
                <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                  <SelectTrigger id="doctor-select" className="w-full">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDoctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center">
                <Label className="text-lg font-medium mb-2 block self-start">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border self-center shadow-sm"
                  disabled={(date) => date < startOfDay(new Date())} 
                />
              </div>

              {selectedDate && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Available Slots for {format(selectedDate, "PPP")}</h3>
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center h-24">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="ml-2">Loading slots...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map(slot => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                          className={`w-full ${!slot.isAvailable ? "bg-muted text-muted-foreground line-through cursor-not-allowed" : ""}`}
                        >
                          {format(slot.startTime, "p")}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Image 
                        src="https://placehold.co/200x150.png" 
                        alt="No slots available" 
                        width={200} 
                        height={150} 
                        className="mx-auto mb-4 rounded-lg shadow-sm"
                        data-ai-hint="empty calendar timeslot"
                      />
                      <p>No available slots for this day or doctor.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedSlot && selectedDoctor ? (
              <Card className="bg-primary/5 p-6 rounded-lg shadow-inner">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-primary">Confirm Your Appointment</CardTitle>
                  <CardDescription>
                    With: {selectedDoctor.name} ({selectedDoctor.specialty}) <br />
                    On: {format(selectedSlot.startTime, "PPPp")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="patientName">Full Name</Label>
                      <Controller
                        name="patientName"
                        control={control}
                        render={({ field }) => <Input id="patientName" placeholder="Your full name" {...field} />}
                      />
                      {errors.patientName && <p className="text-sm text-destructive mt-1">{errors.patientName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="patientEmail">Email</Label>
                      <Controller
                        name="patientEmail"
                        control={control}
                        render={({ field }) => <Input id="patientEmail" type="email" placeholder="your.email@example.com" {...field} />}
                      />
                      {errors.patientEmail && <p className="text-sm text-destructive mt-1">{errors.patientEmail.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Controller
                        name="reason"
                        control={control}
                        render={({ field }) => <Textarea id="reason" placeholder="Briefly describe the reason for your consultation" {...field} />}
                      />
                      {errors.reason && <p className="text-sm text-destructive mt-1">{errors.reason.message}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Book Appointment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/50 p-6 rounded-lg text-center">
                  <Image 
                    src="https://placehold.co/250x180.png" 
                    alt="Select a slot" 
                    width={250} 
                    height={180} 
                    className="mx-auto mb-6 rounded-lg shadow-md"
                    data-ai-hint="calendar selection appointment"
                  />
                  <p className="text-muted-foreground">Please select a doctor, date, and an available time slot to proceed with booking.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
