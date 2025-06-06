
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  // Availability could be represented as a list of available TimeSlot objects
  // or a more complex structure mapping dates to time arrays.
  // For mock data, we'll generate slots dynamically.
}

export interface TimeSlot {
  id: string; // Unique ID for the time slot
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface Appointment {
  id:string;
  patientName: string;
  patientEmail: string;
  doctor: {
    name: string;
    specialty: string;
  };
  dateTime: Date;
  reason: string;
  status: 'Upcoming' | 'Past' | 'Cancelled';
  appointmentType: 'Video' | 'Phone'; // Simplified for telemedicine
  videoLink?: string; // Optional: link for video consultation
}

// This type is for the form data when scheduling an appointment
export interface SchedulingFormData {
  patientName: string;
  patientEmail:string;
  reason: string;
  // selectedDate and selectedTimeSlot will be handled by component state before forming an Appointment object
}

export interface MedicineAlarm {
  id: string;
  medicineName: string;
  time: string; // HH:MM 24-hour format stored, displayed as AM/PM
  soundFile?: string; // e.g., "chime.mp3", "beep.mp3"
  mobileNumber?: string; // Optional mobile number for simulated SMS
}

// E-prescription Types
export interface MedicationInputItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface EprescriptionRequestFormData {
  patientName: string;
  patientAge: string; // Keep as string for form input, convert to number in handler
  patientGender: 'Male' | 'Female' | 'Other' | '';
  diagnosis: string;
  medications: MedicationInputItem[];
  doctorName: string;
  doctorRegistrationNumber: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhoneNumber?: string;
}

// Types for Genkit Flow (matches flow schema)
export type EprescriptionFlowInput = {
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  doctorName: string;
  doctorRegistrationNumber: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhoneNumber?: string;
  prescriptionDate: string; // e.g., "October 26, 2023"
};

export type EprescriptionFlowOutput = {
  prescriptionText: string;
};

// Meal Planner Types
export interface MealPlannerFormData {
  age: string; // Keep as string for form input, convert to number in handler
  gender: 'Male' | 'Female' | 'Other' | '';
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian' | '';
}

export interface MealSuggestionItem {
  mealType: string; // e.g., "Breakfast", "Lunch", "Dinner"
  description: string;
}

export type MealPlannerFlowInput = {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian';
};

export type MealPlannerFlowOutput = {
  mealPlan: MealSuggestionItem[];
  generalAdvice?: string;
};

// Health Device Types
export interface HealthDevice {
  id: string;
  name: string;
  type: 'Blood Pressure Monitor' | 'Pulse Oximeter' | 'Glucose Meter' | 'Smart Scale' | 'Fitness Tracker';
  status: 'Connected' | 'Disconnected' | 'Syncing...' | 'Error';
  lastSync: Date | string; // Could be a Date object or a string like "Just now"
  imageUrl?: string; // Optional image for the device
  dataAiHint?: string; // For placeholder image generation
  readings?: Array<{ date: Date; value: string; unit: string }>; // Example of how readings might be stored
}

// AI Assistant Chat Types
export interface AiAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type AiAssistantChatFlowInput = {
  userMessage: string;
  // chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>; // Optional for context
};

export type AiAssistantChatFlowOutput = {
  assistantResponse: string;
};
