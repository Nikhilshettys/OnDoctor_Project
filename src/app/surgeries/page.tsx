
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Eye,
  Scissors,
  Shield,
  User,
  Move,
  Sparkles,
  XCircle,
  HeartPulse // Fallback icon
} from 'lucide-react';

interface Ailment {
  name: string;
  icon: React.ElementType;
  dataAiHint: string;
}

const popularSurgeries: Ailment[] = [
  { name: "Piles", icon: Activity, dataAiHint: "piles treatment" },
  { name: "Hernia Treatment", icon: Shield, dataAiHint: "hernia repair" },
  { name: "Kidney Stone", icon: Activity, dataAiHint: "kidney stone removal" }, // Using Activity as Diamond is not available
  { name: "Cataract", icon: Eye, dataAiHint: "cataract surgery" },
  { name: "Circumcision", icon: Shield, dataAiHint: "circumcision procedure" }, // Using Shield for neutrality
  { name: "Lasik", icon: Eye, dataAiHint: "lasik eye surgery" },
  { name: "Varicose Veins", icon: Activity, dataAiHint: "varicose veins treatment" },
  { name: "Gallstone", icon: Activity, dataAiHint: "gallstone removal" },
  { name: "Anal Fistula", icon: Activity, dataAiHint: "anal fistula surgery" },
  { name: "Gynaecomastia", icon: User, dataAiHint: "gynaecomastia surgery" },
  { name: "Anal Fissure", icon: Activity, dataAiHint: "anal fissure treatment" },
  { name: "Lipoma Removal", icon: XCircle, dataAiHint: "lipoma removal" },
  { name: "Sebaceous Cyst", icon: XCircle, dataAiHint: "sebaceous cyst removal" },
  { name: "Pilonidal Sinus", icon: Activity, dataAiHint: "pilonidal sinus treatment" },
  { name: "Lump in Breast", icon: Activity, dataAiHint: "breast lump surgery" }, // Generic icon for sensitivity
  { name: "TURP", icon: Activity, dataAiHint: "turp procedure" },
  { name: "Hydrocele", icon: Activity, dataAiHint: "hydrocele surgery" },
  { name: "Knee Replacement", icon: Move, dataAiHint: "knee replacement" },
  { name: "Hair Transplant", icon: Sparkles, dataAiHint: "hair transplant" },
];

const AilmentCard: React.FC<{ ailment: Ailment }> = ({ ailment }) => {
  const IconComponent = ailment.icon || HeartPulse;
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center animate-in fade-in group hover:bg-gradient-to-br hover:from-sky-100 hover:to-sky-300">
      <CardHeader className="pb-2 pt-4">
        <div className="mx-auto bg-primary/10 group-hover:bg-sky-50/80 transition-colors duration-300 p-3 rounded-full w-fit mb-2">
          <IconComponent className="h-8 w-8 text-primary group-hover:text-sky-700 transition-colors duration-300" aria-label={`${ailment.name} icon`} />
        </div>
        <CardTitle className="text-md font-semibold text-primary group-hover:text-sky-700 transition-colors duration-300">{ailment.name}</CardTitle>
      </CardHeader>
      {/* <CardContent className="p-2">
        <Button variant="link" size="sm" className="text-xs group-hover:text-sky-600">Learn More</Button>
      </CardContent> */}
    </Card>
  );
};

export default function SurgeriesPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader className="text-center">
            <Scissors className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl md:text-4xl text-primary">Surgical Solutions</CardTitle>
            <CardDescription className="text-lg">
              We are experts in surgical solutions for 50+ ailments. Explore some of our popular surgeries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold text-center mb-6 text-foreground/90">Popular Surgeries</h2>
            {popularSurgeries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {popularSurgeries.map((ailment) => (
                  <AilmentCard key={ailment.name} ailment={ailment} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Information on popular surgeries will be available soon.</p>
            )}
          </CardContent>
        </Card>
        <Card className="mt-8 bg-primary/5 border-primary/20 shadow-sm animate-in fade-in duration-300">
          <CardHeader>
              <CardTitle className="text-lg text-primary">Important Note</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-foreground/90">
                  This information is for general awareness. Always consult with a qualified medical professional for diagnosis and treatment options.
                  The availability of specific surgeries may vary.
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
