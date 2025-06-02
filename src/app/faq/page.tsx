
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageCircleQuestion } from 'lucide-react';

const faqData = [
  {
    question: "How do I schedule an appointment?",
    answer: "You can schedule an appointment by navigating to the 'Schedule' page from the main menu. Select your desired doctor, choose an available date and time slot, and fill in your details to confirm the booking.",
  },
  {
    question: "What types of consultations are offered?",
    answer: "We primarily offer secure video consultations. Some doctors may offer phone consultations as well, which will be indicated during the booking process if available.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take your privacy and security very seriously. All data is handled in accordance with industry best practices and relevant data protection regulations. Our platform uses encryption and secure protocols to protect your information.",
  },
  {
    question: "How do I cancel or reschedule an appointment?",
    answer: "You can manage your appointments from the 'Appointments' page. Upcoming appointments will have options to cancel. Rescheduling capabilities might depend on the clinic's policy and can be done through the appointment details or by contacting support.",
  },
  {
    question: "What if I miss my appointment?",
    answer: "If you miss your scheduled appointment, it will be marked as 'Missed' in your appointment history. Depending on the clinic's policy, a fee might be applicable. Please contact support or try to rebook if you still need a consultation.",
  },
  {
    question: "How do I join a video consultation?",
    answer: "For upcoming video consultations, a 'Join Call' button will appear on your 'Appointments' page shortly before the scheduled time. Clicking this button will take you to the secure video call.",
  },
  {
    question: "Can I get a prescription through OnDoctor?",
    answer: "Yes, if the consulting doctor deems it medically appropriate, they can issue an e-prescription. You can generate and view e-prescriptions through the 'E-Rx' section of the app.",
  }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MessageCircleQuestion className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Frequently Asked Questions</CardTitle>
            </div>
            <CardDescription>Find answers to common questions about using OnDoctor.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline text-primary font-semibold">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-5 w-5 text-primary/80" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-foreground/80">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
