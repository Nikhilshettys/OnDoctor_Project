
'use server';
/**
 * @fileOverview Generates an e-prescription text based on provided details.
 *
 * - generateEprescription - A function that handles the e-prescription generation.
 * - EprescriptionFlowInput - The input type for the generateEprescription function.
 * - EprescriptionFlowOutput - The return type for the generateEprescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { EprescriptionFlowInput, EprescriptionFlowOutput } from '@/types'; // Import shared types

const MedicationSchema = z.object({
  name: z.string().describe('Name of the medication.'),
  dosage: z.string().describe('Dosage instructions (e.g., "1 tablet", "10mg").'),
  frequency: z.string().describe('How often to take the medication (e.g., "Twice a day", "Every 6 hours").'),
  duration: z.string().describe('For how long to take the medication (e.g., "7 days", "Until finished").'),
  notes: z.string().optional().describe('Additional notes for the medication (e.g., "Take with food").'),
});

const EprescriptionInputSchema = z.object({
  patientName: z.string().describe("Patient's full name."),
  patientAge: z.number().int().positive().describe("Patient's age in years."),
  patientGender: z.enum(['Male', 'Female', 'Other']).describe("Patient's gender."),
  diagnosis: z.string().describe('Clinical diagnosis for the patient.'),
  medications: z.array(MedicationSchema).min(1).describe('List of prescribed medications.'),
  doctorName: z.string().describe("Prescribing doctor's full name."),
  doctorRegistrationNumber: z.string().describe("Prescribing doctor's medical registration number."),
  clinicName: z.string().describe('Name of the clinic or hospital.'),
  clinicAddress: z.string().describe('Full address of the clinic or hospital.'),
  clinicPhoneNumber: z.string().optional().describe('Phone number of the clinic or hospital.'),
  prescriptionDate: z.string().describe('Date the prescription is issued (e.g., "October 26, 2023").'),
});

const EprescriptionOutputSchema = z.object({
  prescriptionText: z.string().describe('The fully formatted e-prescription as a plain text string.'),
});

// This is the actual function that will be called from the frontend.
// It matches the EprescriptionFlowInput and EprescriptionFlowOutput types from @/types
export async function generateEprescription(input: EprescriptionFlowInput): Promise<EprescriptionFlowOutput> {
  // The flow itself expects input conforming to EprescriptionInputSchema.
  // The types from @/types are compatible.
  const result = await eprescriptionGenerationFlow(input);
  return result;
}

const prescriptionPrompt = ai.definePrompt({
  name: 'eprescriptionPrompt',
  input: { schema: EprescriptionInputSchema },
  output: { schema: EprescriptionOutputSchema },
  prompt: `
You are an AI assistant tasked with generating a formal e-prescription.
Please format the prescription clearly and professionally based on the provided information.

Clinic Information:
Clinic Name: {{{clinicName}}}
Address: {{{clinicAddress}}}
{{#if clinicPhoneNumber}}Phone: {{{clinicPhoneNumber}}}{{/if}}

--------------------------------------------------
E-PRESCRIPTION
--------------------------------------------------
Date: {{{prescriptionDate}}}

Patient Details:
Name: {{{patientName}}}
Age: {{{patientAge}}} years
Gender: {{{patientGender}}}

Diagnosis:
{{{diagnosis}}}

--------------------------------------------------
Rx (Medications):
--------------------------------------------------

{{#each medications}}
{{@index_1}}. {{{this.name}}}
   Dosage: {{{this.dosage}}}
   Frequency: {{{this.frequency}}}
   Duration: {{{this.duration}}}
   {{#if this.notes}}Notes: {{{this.notes}}}{{/if}}

{{/each}}
--------------------------------------------------

Prescribing Doctor:
Dr. {{{doctorName}}}
Registration No: {{{doctorRegistrationNumber}}}

(Digital Signature Placeholder / Verified via OnDoctor Platform)
--------------------------------------------------

Instructions to Patient:
- Follow the dosage and frequency instructions carefully.
- Complete the full course of medication as prescribed, even if you start feeling better.
- If you experience any adverse effects, contact your doctor or clinic immediately.
- Keep this prescription and all medications out of reach of children.
- This prescription is valid as per local regulations.

Disclaimer: This e-prescription is generated based on information provided by the healthcare professional.
`,
});

// This is the internal Genkit flow.
const eprescriptionGenerationFlow = ai.defineFlow(
  {
    name: 'eprescriptionGenerationFlow',
    inputSchema: EprescriptionInputSchema, // Zod schema for flow's direct input
    outputSchema: EprescriptionOutputSchema, // Zod schema for flow's direct output
  },
  async (input) => {
    // The input here matches EprescriptionInputSchema, which is compatible with EprescriptionFlowInput
    const { output } = await prescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate e-prescription text.');
    }
    // The output matches EprescriptionOutputSchema, compatible with EprescriptionFlowOutput
    return output;
  }
);

// Helper function to ensure the output of the prompt is correctly typed for the flow.
// This might not be strictly necessary if Zod schemas align perfectly, but good for clarity.
async function callPromptAndEnsureOutput(input: z.infer<typeof EprescriptionInputSchema>): Promise<z.infer<typeof EprescriptionOutputSchema>> {
  const response = await prescriptionPrompt(input);
  if (!response.output) {
    throw new Error("No output from prescription prompt");
  }
  return response.output; // This is already EprescriptionOutputSchema typed
}
