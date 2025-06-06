
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { MedicineAlarm } from '@/types';
import { AlarmClock, Trash2, BellPlus, ListChecks, PlusCircle, Loader2, Info, Music2, Phone } from 'lucide-react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const alarmSounds = [
  { name: "Default Beep", file: "alarm-sound.mp3" },
  { name: "Chime", file: "chime.mp3" },
  { name: "Digital Beep", file: "digital-beep.mp3" },
];

const alarmFormSchema = z.object({
  medicineName: z.string().min(1, { message: "Medicine name is required." }),
  timePart: z.string().regex(/^(0?[1-9]|1[0-2]):([0-5]\d)$/, { 
    message: "Enter time in HH:MM format (e.g., 09:30 or 01:00).",
  }),
  period: z.enum(['AM', 'PM'], { required_error: "Please select AM or PM." }),
  soundFile: z.string().optional(),
  mobileNumber: z.string()
    .regex(/^(\+?[1-9]\d{1,14}|\s*)$/, "Enter a valid phone number (e.g., +1234567890) or leave blank.")
    .optional()
    .transform(val => val?.trim() === '' ? undefined : val), // Treat empty string as undefined
}).transform((data) => {
  let [hoursStr, minutesStr] = data.timePart.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (data.period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (data.period === 'AM' && hours === 12) { // Midnight case: 12 AM is 00 hours
    hours = 0;
  }

  return {
    medicineName: data.medicineName,
    time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    displayTime: `${data.timePart} ${data.period}`,
    soundFile: data.soundFile || alarmSounds[0].file,
    mobileNumber: data.mobileNumber,
  };
});

type AlarmFormOutput = z.infer<typeof alarmFormSchema>;
interface AlarmFormInputValues {
  medicineName: string;
  timePart: string;
  period: 'AM' | 'PM' | '';
  soundFile: string;
  mobileNumber?: string;
}

function formatToAmPm(time24: string): string {
  if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) return time24;
  let [hoursStr, minutesStr] = time24.split(':');
  let H = parseInt(hoursStr, 10);
  const ampm = H >= 12 ? 'PM' : 'AM';
  H = H % 12;
  H = H ? H : 12;
  return `${String(H).padStart(2, '0')}:${minutesStr} ${ampm}`;
}

export default function MedicineAlarmsPage() {
  const { toast } = useToast();
  const [alarms, setAlarms] = useState<MedicineAlarm[]>([]);
  const [isClient, setIsClient] = useState(false);
  const triggeredAlarmsThisMinuteRef = useRef(new Set<string>());

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedAlarms = localStorage.getItem('ondoctor-medicine-alarms');
      if (storedAlarms) {
        try {
          const parsedAlarms: MedicineAlarm[] = JSON.parse(storedAlarms);
          if (Array.isArray(parsedAlarms)) {
            setAlarms(parsedAlarms);
          } else {
            localStorage.removeItem('ondoctor-medicine-alarms');
          }
        } catch (error) {
          console.error("Failed to parse alarms from localStorage", error);
          localStorage.removeItem('ondoctor-medicine-alarms');
        }
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('ondoctor-medicine-alarms', JSON.stringify(alarms));
    }
  }, [alarms, isClient]);

  useEffect(() => {
    if (!isClient || alarms.length === 0) return;

    const checkAlarms = () => {
      const now = new Date();
      const currentTimeHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      alarms.forEach(alarm => {
        if (alarm.time === currentTimeHHMM) {
          if (!triggeredAlarmsThisMinuteRef.current.has(alarm.id)) {
            toast({
              title: "Medicine Reminder!",
              description: `Time to take your ${alarm.medicineName}.`,
              variant: "default",
              duration: 30000,
            });
            
            const soundToPlay = alarm.soundFile || alarmSounds[0].file;
            const audio = new Audio(`/sounds/${soundToPlay}`);
            audio.play().catch(error => {
              console.warn("Audio play failed (possibly due to browser policy):", error);
              toast({
                  title: "Enable Sound",
                  description: "Click anywhere on the page to enable alarm sounds if you don't hear them.",
                  variant: "default",
                  duration: 7000
              });
            });

            if (alarm.mobileNumber) {
              toast({
                title: "Simulated SMS Sent",
                description: `SMS notification (simulated) sent to ${alarm.mobileNumber} for ${alarm.medicineName}.`,
                variant: "default",
                duration: 10000,
              });
            }
            triggeredAlarmsThisMinuteRef.current.add(alarm.id);
          }
        }
      });
    };

    const clearTriggeredSetInterval = setInterval(() => {
      triggeredAlarmsThisMinuteRef.current.clear();
    }, 60 * 1000); 

    const alarmCheckInterval = setInterval(checkAlarms, 5000); 

    return () => {
      clearInterval(alarmCheckInterval);
      clearInterval(clearTriggeredSetInterval);
    };
  }, [isClient, alarms, toast]);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AlarmFormInputValues>({
    resolver: zodResolver(alarmFormSchema),
    defaultValues: {
      medicineName: "",
      timePart: "",
      period: "" as any,
      soundFile: alarmSounds[0].file,
      mobileNumber: "",
    },
  });

  const handleAddAlarm = (data: AlarmFormOutput) => {
    const newAlarm: MedicineAlarm = {
      id: Date.now().toString(),
      medicineName: data.medicineName,
      time: data.time,
      soundFile: data.soundFile,
      mobileNumber: data.mobileNumber,
    };
    setAlarms(prevAlarms => [newAlarm, ...prevAlarms].sort((a, b) => a.time.localeCompare(b.time)));
    
    let description = `${data.medicineName} alarm set for ${data.displayTime}. Sound: ${alarmSounds.find(s => s.file === data.soundFile)?.name || 'Default'}.`;
    if (data.mobileNumber) {
      description += ` SMS (simulated) to: ${data.mobileNumber}.`;
    }

    toast({
      title: "Alarm Added",
      description: description,
      variant: "default"
    });
    reset();
  };

  const handleDeleteAlarm = (alarmId: string) => {
    setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== alarmId));
    toast({
      title: "Alarm Deleted",
      description: "The medicine alarm has been removed.",
      variant: "default"
    });
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlarmClock className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Medicine Alarms</CardTitle>
            </div>
            <CardDescription>Set and manage your medicine reminders. Alarms will show a notification and play a sound if this page is open.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="p-6 shadow-md bg-primary/5 hover:shadow-lg transition-shadow animate-in fade-in duration-300">
              <CardTitle className="text-xl mb-4 text-primary flex items-center"><BellPlus className="mr-2 h-6 w-6"/>Add New Alarm</CardTitle>
              <form onSubmit={handleSubmit(handleAddAlarm)} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Controller
                    name="medicineName"
                    control={control}
                    render={({ field }) => <Input id="medicineName" placeholder="e.g., Paracetamol" {...field} />}
                  />
                  {errors.medicineName && <p className="text-sm text-destructive mt-1">{errors.medicineName.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="timePart">Time (HH:MM)</Label>
                    <Controller
                      name="timePart"
                      control={control}
                      render={({ field }) => <Input id="timePart" placeholder="e.g., 09:30" {...field} />}
                    />
                    {errors.timePart && <p className="text-sm text-destructive mt-1">{errors.timePart.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="period">AM/PM</Label>
                    <Controller
                      name="period"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="period">
                            <SelectValue placeholder="AM/PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.period && <p className="text-sm text-destructive mt-1">{errors.period.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="soundFile">Alarm Sound</Label>
                  <Controller
                    name="soundFile"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || alarmSounds[0].file}>
                        <SelectTrigger id="soundFile">
                          <SelectValue placeholder="Select sound" />
                        </SelectTrigger>
                        <SelectContent>
                          {alarmSounds.map(sound => (
                            <SelectItem key={sound.file} value={sound.file}>
                              <div className="flex items-center">
                                <Music2 className="mr-2 h-4 w-4 text-muted-foreground" />
                                {sound.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.soundFile && <p className="text-sm text-destructive mt-1">{errors.soundFile.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="mobileNumber">Mobile Number (Optional - for simulated SMS)</Label>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => <Input id="mobileNumber" placeholder="e.g., +1234567890" {...field} />}
                  />
                  {errors.mobileNumber && <p className="text-sm text-destructive mt-1">{errors.mobileNumber.message}</p>}
                </div>


                {errors.root && <p className="text-sm text-destructive mt-1">{errors.root.message}</p>}

                <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                  {isSubmitting ? "Adding..." : "Add Alarm"}
                </Button>
              </form>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary flex items-center"><ListChecks className="mr-2 h-7 w-7"/>Your Alarms</h2>
              {alarms.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-card rounded-lg shadow-sm animate-in fade-in duration-300">
                  <Image 
                    src="https://placehold.co/300x200.png" 
                    alt="No alarms set" 
                    width={300} 
                    height={200} 
                    className="mx-auto mb-6 rounded-lg shadow-md"
                    data-ai-hint="empty clock alarm"
                  />
                  <p className="text-lg mb-1">No medicine alarms set yet.</p>
                  <p className="text-sm">Use the form above to add your first reminder!</p>
                </div>
              ) : (
                <ul className="space-y-4 flex flex-col items-center">
                  {alarms.map(alarm => (
                    <li key={alarm.id} className="w-full max-w-lg">
                      <AlarmItem alarm={alarm} onDelete={handleDeleteAlarm} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-xl animate-in fade-in duration-300 mt-8">
          <CardHeader>
              <div className="flex items-center space-x-3">
                  <Info className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg text-primary">How Alarms Work</CardTitle>
              </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Alarms are stored in your browser and will persist if you reload the page.</li>
              <li>A toast notification will appear and a sound will play if this page is open when an alarm time is reached.</li>
              <li>Ensure your device volume is on. You might need to interact with the page (e.g., click a button) once for sounds to enable due to browser policies.</li>
              <li>This feature does not provide background notifications or sounds if the app/tab is closed.</li>
              <li>Make sure you have sound files like `chime.mp3` and `digital-beep.mp3` in your `public/sounds/` folder for the sound options to work correctly.</li>
              <li>SMS notifications to mobile numbers are **simulated** with a toast message and require a backend service and SMS gateway for real functionality.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface AlarmItemProps {
  alarm: MedicineAlarm;
  onDelete: (id: string) => void;
}

function AlarmItem({ alarm, onDelete }: AlarmItemProps) {
  const soundName = alarmSounds.find(s => s.file === alarm.soundFile)?.name || alarmSounds[0].name;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in duration-300 w-full">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlarmClock className="h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold text-lg text-foreground">{alarm.medicineName}</p>
            <p className="text-muted-foreground">Time: {formatToAmPm(alarm.time)}</p>
            <p className="text-xs text-muted-foreground/80 flex items-center">
              <Music2 className="mr-1 h-3 w-3" /> Sound: {soundName}
            </p>
            {alarm.mobileNumber && (
              <p className="text-xs text-muted-foreground/80 flex items-center">
                <Phone className="mr-1 h-3 w-3" /> Sim. SMS: {alarm.mobileNumber}
              </p>
            )}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 transform transition-transform duration-150 ease-out hover:scale-105 active:scale-95">
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete alarm</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the alarm for {alarm.medicineName} at {formatToAmPm(alarm.time)}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(alarm.id)} className="bg-destructive hover:bg-destructive/90">
                Delete Alarm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
