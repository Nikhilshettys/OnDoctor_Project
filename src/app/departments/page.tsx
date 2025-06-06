
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid as DepartmentsIcon, BriefcaseMedical, FlaskConical, Search } from 'lucide-react'; // Replaced SearchHeart with Search
import { Button } from '@/components/ui/button';

interface DepartmentInfo {
  name: string;
  ailmentsCount: number;
  imageUrl: string;
  dataAiHint: string;
}

const departmentsData: DepartmentInfo[] = [
  { name: "General Surgery", ailmentsCount: 9, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "general surgery tools" },
  { name: "Proctology", ailmentsCount: 5, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "proctology exam" },
  { name: "Ophthalmology", ailmentsCount: 4, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "eye care equipment" },
  { name: "Urology", ailmentsCount: 12, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "urology instruments" },
  { name: "Cosmetic Surgery", ailmentsCount: 6, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "cosmetic procedure" },
  { name: "Orthopedics", ailmentsCount: 8, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "orthopedic tools bone" },
  { name: "Advanced Cosmetic Procedures", ailmentsCount: 12, imageUrl: "https://placehold.co/300x200.png", dataAiHint: "advanced beauty treatment" },
];

const DepartmentCard: React.FC<{ department: DepartmentInfo }> = ({ department }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center animate-in fade-in group hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-300">
      <CardHeader className="pb-3 pt-4 w-full">
        <div className="relative w-full h-40 mx-auto mb-3 rounded-t-md overflow-hidden">
          <Image
            src={department.imageUrl}
            alt={department.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={department.dataAiHint}
          />
        </div>
        <CardTitle className="text-lg font-semibold text-primary group-hover:text-blue-700 transition-colors duration-300 flex items-center justify-center">
            <BriefcaseMedical className="h-5 w-5 mr-2 group-hover:text-blue-600 transition-colors duration-300" />
            {department.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-sm text-muted-foreground group-hover:text-blue-600 transition-colors duration-300">
          Covers {department.ailmentsCount} ailments
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const commonHealthConcerns = [
    { name: "Fatigue & Weakness", dataAiHint: "tired person" },
    { name: "Digestive Issues", dataAiHint: "stomach ache" },
    { name: "Breathing Problems", dataAiHint: "lungs respiratory" },
    { name: "Joint Pain", dataAiHint: "knee pain" },
    { name: "Skin Conditions", dataAiHint: "skin rash" },
    { name: "Headaches & Migraines", dataAiHint: "headache" },
];

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader className="text-center">
            <DepartmentsIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl md:text-4xl text-primary">Our Departments</CardTitle>
            <CardDescription className="text-lg">
              Explore the specialized medical departments at OnDoctor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departmentsData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {departmentsData.map((dept) => (
                  <DepartmentCard key={dept.name} department={dept} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Department information will be available soon.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader className="text-center">
            <Search className="h-12 w-12 text-accent mx-auto mb-4" /> 
            <CardTitle className="text-3xl md:text-4xl text-accent">Find Tests by Health Concern</CardTitle>
            <CardDescription className="text-lg">
              Discover relevant diagnostic tests based on your symptoms or health concerns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Select a common health concern below or use our (upcoming) search feature to find specific tests.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {commonHealthConcerns.map((concern) => (
                <Button key={concern.name} variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground transition-colors duration-200">
                  {concern.name}
                </Button>
              ))}
            </div>
            <div className="mt-6">
              <Image
                src="https://placehold.co/450x280.png"
                alt="Diagnostic tests and medical examination"
                width={450}
                height={280}
                className="mx-auto rounded-lg shadow-md"
                data-ai-hint="laboratory tests medical diagnosis"
              />
            </div>
            <p className="text-xs text-muted-foreground pt-4">
                Please note: This section is for informational purposes. Always consult a doctor for diagnosis and test recommendations.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
              <CardTitle className="text-lg text-primary">Note</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-foreground/90">
                  The information on departments and tests is for general guidance. For a comprehensive list of services, specialists, and specific test details, please use our search feature (when available) or contact support.
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
