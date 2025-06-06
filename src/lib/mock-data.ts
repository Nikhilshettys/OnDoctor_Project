
import type { Appointment, Doctor, TimeSlot } from '@/types';
import { addHours, format, setHours, setMinutes, startOfDay, isPast, addDays, subDays, setSeconds } from 'date-fns';

export const mockDoctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. Alice Smith', specialty: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Bob Johnson', specialty: 'Pediatrics' },
  { id: 'doc3', name: 'Dr. Carol Williams', specialty: 'Dermatology' },
];

// Function to generate available time slots for a given day and doctor
// For simplicity, let's assume doctors are available from 9 AM to 5 PM with 30-minute slots
export const getAvailableTimeSlots = (date: Date, doctorId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayStart = startOfDay(date);
  // Make slots unique per day and doctor
  const uniqueSeed = doctorId.charCodeAt(0) + date.getDate();


  for (let i = 0; i < 16; i++) { // 8 hours * 2 slots per hour = 16 slots
    const slotHour = 9 + Math.floor(i / 2);
    const slotMinute = (i % 2) * 30;
    
    const startTime = setSeconds(setMinutes(setHours(dayStart, slotHour), slotMinute),0);
    const endTime = addHours(startTime, 0.5); // 30 minute slots

    // Simulate some slots being unavailable based on a pseudo-random pattern
    // Also ensure slots are in the future
    const isSlotInPast = isPast(startTime);
    const isAvailable = !isSlotInPast && ( (i + uniqueSeed) % ( (date.getDate() % 3) + 2 ) !== 0) ; // Pseudo-random availability

    slots.push({
      id: `slot-${format(startTime, 'yyyyMMddHHmm')}-${doctorId}`,
      startTime,
      endTime,
      isAvailable,
    });
  }
  return slots.filter(slot => !isPast(slot.startTime)); // Ensure only future slots are returned if today
};

const today = new Date();
const tomorrow = addDays(today, 1);
const yesterday = subDays(today,1);

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    patientName: 'John Doe',
    patientEmail: 'john.doe@example.com',
    doctor: mockDoctors[0],
    dateTime: setMinutes(setHours(today, 10),0), // Today at 10:00 AM
    reason: 'Chest pain follow-up',
    status: isPast(setMinutes(setHours(today, 10),0)) ? 'Past' : 'Upcoming',
    appointmentType: 'Video',
    videoLink: 'https://meet.example.com/apt1',
  },
  {
    id: 'apt2',
    patientName: 'Jane Roe',
    patientEmail: 'jane.roe@example.com',
    doctor: mockDoctors[1],
    dateTime: setMinutes(setHours(tomorrow, 14),30), // Tomorrow at 2:30 PM
    reason: 'Child regular checkup',
    status: 'Upcoming',
    appointmentType: 'Video',
    videoLink: 'https://meet.example.com/apt2',
  },
  {
    id: 'apt3',
    patientName: 'Peter Pan',
    patientEmail: 'peter.pan@example.com',
    doctor: mockDoctors[2],
    dateTime: setMinutes(setHours(yesterday, 11),0), // Yesterday at 11:00 AM
    reason: 'Skin rash',
    status: 'Past',
    appointmentType: 'Video',
  },
   {
    id: 'apt4',
    patientName: 'Alice Wonderland',
    patientEmail: 'alice.wonderland@example.com',
    doctor: mockDoctors[0],
    dateTime: setMinutes(setHours(addDays(today, 3), 16),0), // 3 days from now at 4:00 PM
    reason: 'Annual heart checkup',
    status: 'Upcoming',
    appointmentType: 'Video',
    videoLink: 'https://meet.example.com/apt4',
  },
  {
    id: 'apt5',
    patientName: 'Cancelled Appointment',
    patientEmail: 'test@example.com',
    doctor: mockDoctors[1],
    dateTime: setMinutes(setHours(subDays(today, 2), 9),0), // 2 days ago
    reason: 'Routine check',
    status: 'Cancelled',
    appointmentType: 'Video',
  }
];

// Function to add a new appointment (simulates backend)
export const addMockAppointment = (newAppointment: Omit<Appointment, 'id' | 'status' | 'doctor'> & { doctorId: string; }): Appointment => {
  const doctor = mockDoctors.find(d => d.id === newAppointment.doctorId);
  if (!doctor) throw new Error("Doctor not found");

  const appointment: Appointment = {
    ...newAppointment,
    id: `apt${mockAppointments.length + 1}`,
    doctor: doctor,
    status: isPast(newAppointment.dateTime) ? 'Past' : 'Upcoming', // Auto-determine status
  };
  mockAppointments.push(appointment);
  // In a real app, you'd also update the availability of the timeslot
  return appointment;
};
