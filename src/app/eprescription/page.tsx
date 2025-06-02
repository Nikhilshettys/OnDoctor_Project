
"use client";

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateEprescription } from '@/ai/flows/generate-eprescription-flow';
import type { EprescriptionRequestFormData, MedicationInputItem, EprescriptionFlowInput, EprescriptionFlowOutput } from '@/types';
import { FileSignature, PlusCircle, Trash2, Loader2, Download } from 'lucide-react';
import { format } from 'date-fns';

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required."),
  dosage: z.string().min(1, "Dosage is required."),
  frequency: z.string().min(1, "Frequency is required."),
  duration: z.string().min(1, "Duration is required."),
  notes: z.string().optional(),
});

const eprescriptionFormSchema = z.object({
  patientName: z.string().min(2, "Patient name is required."),
  patientAge: z.string().regex(/^\d+$/, "Age must be a number.").min(1, "Age is required."),
  patientGender: z.enum(['Male', 'Female', 'Other'], { required_error: "Gender is required." }),
  diagnosis: z.string().min(5, "Diagnosis is required."),
  medications: z.array(medicationSchema).min(1, "At least one medication is required."),
  doctorName: z.string().min(2, "Doctor's name is required."),
  doctorRegistrationNumber: z.string().min(3, "Doctor's registration number is required."),
  clinicName: z.string().min(2, "Clinic name is required."),
  clinicAddress: z.string().min(5, "Clinic address is required."),
  clinicPhoneNumber: z.string().optional(),
});


export default function EprescriptionPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState<string | null>(null);

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<EprescriptionRequestFormData>({
    resolver: zodResolver(eprescriptionFormSchema),
    defaultValues: {
      patientName: "",
      patientAge: "",
      patientGender: "" as any, // zodResolver will pick this up
      diagnosis: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "", notes: "" }],
      doctorName: "",
      doctorRegistrationNumber: "",
      clinicName: "",
      clinicAddress: "",
      clinicPhoneNumber: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const onSubmit = async (data: EprescriptionRequestFormData) => {
    setIsGenerating(true);
    setGeneratedPrescription(null);

    const flowInput: EprescriptionFlowInput = {
      ...data,
      patientAge: parseInt(data.patientAge, 10),
      patientGender: data.patientGender as 'Male' | 'Female' | 'Other', // Already validated by Zod
      prescriptionDate: format(new Date(), "MMMM dd, yyyy"),
    };

    try {
      const result: EprescriptionFlowOutput = await generateEprescription(flowInput);
      setGeneratedPrescription(result.prescriptionText);
      toast({
        title: "E-prescription Generated",
        description: "The e-prescription has been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating e-prescription:", error);
      toast({
        title: "Error",
        description: "Failed to generate e-prescription. " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadTxt = () => {
    if (!generatedPrescription) return;
    const element = document.createElement("a");
    const file = new Blob([generatedPrescription], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `eprescription-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <FileSignature className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Generate E-Prescription</CardTitle>
            </div>
            <CardDescription>Fill in the details below to generate an e-prescription.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <fieldset className="grid md:grid-cols-2 gap-6 border p-4 rounded-md animate-in fade-in duration-300">
                <legend className="text-lg font-semibold text-primary px-1">Patient Information</legend>
                <div>
                  <Label htmlFor="patientName">Patient Full Name</Label>
                  <Input id="patientName" {...register("patientName")} />
                  {errors.patientName && <p className="text-sm text-destructive mt-1">{errors.patientName.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientAge">Age (Years)</Label>
                    <Input id="patientAge" type="number" {...register("patientAge")} />
                    {errors.patientAge && <p className="text-sm text-destructive mt-1">{errors.patientAge.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="patientGender">Gender</Label>
                    <Controller
                      name="patientGender"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="patientGender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.patientGender && <p className="text-sm text-destructive mt-1">{errors.patientGender.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea id="diagnosis" {...register("diagnosis")} placeholder="Enter clinical diagnosis..."/>
                  {errors.diagnosis && <p className="text-sm text-destructive mt-1">{errors.diagnosis.message}</p>}
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded-md space-y-4 animate-in fade-in duration-300">
                <legend className="text-lg font-semibold text-primary px-1">Medication Details (Rx)</legend>
                {fields.map((item, index) => (
                  <Card key={item.id} className="p-4 space-y-3 bg-muted/30 relative shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300">
                    <Label className="text-md font-medium">Medication #{index + 1}</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medications.${index}.name`}>Name</Label>
                        <Input id={`medications.${index}.name`} {...register(`medications.${index}.name`)} placeholder="e.g., Amoxicillin 500mg"/>
                        {errors.medications?.[index]?.name && <p className="text-sm text-destructive mt-1">{errors.medications[index]?.name?.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor={`medications.${index}.dosage`}>Dosage</Label>
                        <Input id={`medications.${index}.dosage`} {...register(`medications.${index}.dosage`)} placeholder="e.g., 1 tablet, 10ml" />
                        {errors.medications?.[index]?.dosage && <p className="text-sm text-destructive mt-1">{errors.medications[index]?.dosage?.message}</p>}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`medications.${index}.frequency`}>Frequency</Label>
                        <Input id={`medications.${index}.frequency`} {...register(`medications.${index}.frequency`)} placeholder="e.g., Twice a day (BD)"/>
                        {errors.medications?.[index]?.frequency && <p className="text-sm text-destructive mt-1">{errors.medications[index]?.frequency?.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor={`medications.${index}.duration`}>Duration</Label>
                        <Input id={`medications.${index}.duration`} {...register(`medications.${index}.duration`)} placeholder="e.g., For 7 days"/>
                        {errors.medications?.[index]?.duration && <p className="text-sm text-destructive mt-1">{errors.medications[index]?.duration?.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`medications.${index}.notes`}>Additional Notes (Optional)</Label>
                      <Input id={`medications.${index}.notes`} {...register(`medications.${index}.notes`)} placeholder="e.g., Take after meals"/>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", dosage: "", frequency: "", duration: "", notes: "" })}
                  className="border-dashed border-primary text-primary hover:bg-primary/5"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </fieldset>

              <fieldset className="grid md:grid-cols-2 gap-6 border p-4 rounded-md animate-in fade-in duration-300">
                <legend className="text-lg font-semibold text-primary px-1">Prescriber & Clinic Information</legend>
                <div>
                  <Label htmlFor="doctorName">Doctor's Full Name</Label>
                  <Input id="doctorName" {...register("doctorName")} placeholder="Dr. Jane Doe"/>
                  {errors.doctorName && <p className="text-sm text-destructive mt-1">{errors.doctorName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="doctorRegistrationNumber">Doctor's Registration Number</Label>
                  <Input id="doctorRegistrationNumber" {...register("doctorRegistrationNumber")} placeholder="e.g., GMC123456"/>
                  {errors.doctorRegistrationNumber && <p className="text-sm text-destructive mt-1">{errors.doctorRegistrationNumber.message}</p>}
                </div>
                <div>
                  <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                  <Input id="clinicName" {...register("clinicName")} placeholder="e.g., City General Hospital"/>
                  {errors.clinicName && <p className="text-sm text-destructive mt-1">{errors.clinicName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="clinicAddress">Clinic Address</Label>
                  <Input id="clinicAddress" {...register("clinicAddress")} placeholder="123 Health St, Anytown"/>
                  {errors.clinicAddress && <p className="text-sm text-destructive mt-1">{errors.clinicAddress.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="clinicPhoneNumber">Clinic Phone Number (Optional)</Label>
                  <Input id="clinicPhoneNumber" {...register("clinicPhoneNumber")} placeholder="+1-555-0100"/>
                </div>
              </fieldset>

              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileSignature className="mr-2 h-5 w-5" />}
                {isGenerating ? 'Generating...' : 'Generate E-Prescription'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setGeneratedPrescription(null);}} className="ml-2">
                  Reset Form
              </Button>
            </form>

            {generatedPrescription && (
              <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow animate-in fade-in duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Generated E-Prescription</CardTitle>
                  <Button onClick={handleDownloadTxt} variant="outline" size="sm" className="mt-2 md:mt-0 md:ml-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download .txt
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md text-sm font-mono overflow-x-auto">
                    {generatedPrescription}
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
