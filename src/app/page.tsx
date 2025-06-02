
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Video, CalendarCheck, MessageSquareHeart, FileSignature, Utensils, AlarmClock, HeartPulse, UserCircle, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg animate-in fade-in duration-500">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Welcome to OnDoctor
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Access quality healthcare from the comfort of your home. Schedule video consultations, manage prescriptions, get meal plans, and more with experienced doctors at your convenience.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
              <Link href="/schedule">Schedule a Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 shadow-md hover:shadow-lg transition-shadow">
              <Link href="/appointments">View Appointments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center mb-10 text-foreground/90">Discover OnDoctor's Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Video className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Easy Video Consultations"
            description="Connect with doctors through secure, high-quality video calls."
            href="/schedule"
          />
          <FeatureCard
            icon={<CalendarCheck className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Flexible Scheduling"
            description="Find and book appointment slots that fit your busy lifestyle."
            href="/schedule"
          />
          <FeatureCard
            icon={<MessageSquareHeart className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Expert Medical Advice"
            description="Receive professional guidance and care from certified medical practitioners."
            href="/faq"
          />
          <FeatureCard
            icon={<FileSignature className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Secure E-Prescriptions"
            description="Generate, view, and manage your digital prescriptions seamlessly."
            href="/eprescription"
          />
          <FeatureCard
            icon={<Utensils className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Personalized Meal Plans"
            description="Get AI-powered dietary suggestions tailored to your needs."
            href="/meal-planner"
          />
          <FeatureCard
            icon={<AlarmClock className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Medicine Reminders"
            description="Never miss a dose with our easy-to-set medicine alarms."
            href="/medicine-alarms"
          />
          <FeatureCard
            icon={<HeartPulse className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Health Device Sync (Simulated)"
            description="Monitor your IoT health devices and share data with your doctor."
            href="/my-health-devices"
          />
          <FeatureCard
            icon={<UserCircle className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Account Management"
            description="Manage your profile, preferences, and view your history with ease."
            href="/account"
          />
           <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-primary group-hover:text-pink-700 transition-colors duration-300" />}
            title="Billing & Subscriptions"
            description="(Simulated) Manage your payment methods and view invoice history."
            href="/billing"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-card rounded-xl shadow-lg animate-in fade-in duration-500">
        <h2 className="text-3xl font-semibold text-center mb-10 text-card-foreground/90">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 px-6">
          <StepItem number="1" title="Sign Up & Find a Doctor" description="Create your account and browse specialists or choose your preferred doctor." />
          <StepItem number="2" title="Book & Prepare" description="Select an available time slot, confirm your booking, and explore features like the meal planner or set medicine reminders." />
          <StepItem number="3" title="Consult & Follow Up" description="Join the video call. After, manage e-prescriptions or view synced device data (simulated)." />
        </div>
      </section>
      
      {/* Placeholder Image Section */}
      <section className="py-12">
         <div className="container mx-auto">
            <Card className="overflow-hidden shadow-lg animate-in fade-in duration-500">
              <CardContent className="p-0">
                <Image
                  src="https://placehold.co/1200x400.png"
                  alt="Telemedicine consultation with diverse features"
                  data-ai-hint="telemedicine doctor patient diverse features"
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </CardContent>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Your Health, Connected and Simplified</CardTitle>
                <CardDescription>OnDoctor brings comprehensive healthcare services to your fingertips.</CardDescription>
              </CardHeader>
            </Card>
         </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const cardContent = (
    <Card className="group text-center shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer h-full animate-in fade-in hover:-translate-y-1 hover:bg-gradient-to-br hover:from-pink-200 hover:to-pink-400">
      <CardHeader className="flex-grow">
        <div className="mx-auto bg-primary/10 group-hover:bg-pink-50/80 transition-colors duration-300 p-4 rounded-full w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-primary group-hover:text-pink-700 transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/70 group-hover:text-pink-600 transition-colors duration-300">{description}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="block h-full no-underline hover:no-underline focus:outline-none">
          {cardContent}
        </a>
      </Link>
    );
  }

  return cardContent;
}

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 animate-in fade-in duration-300">
      <div className="bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mb-4 shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-card-foreground/90">{title}</h3>
      <p className="text-sm text-card-foreground/70">{description}</p>
    </div>
  );
}
