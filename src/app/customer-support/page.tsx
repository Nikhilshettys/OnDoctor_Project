
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Headset, Mail, Phone, MessageSquare, HelpCircle, Loader2, Send } from 'lucide-react';

const supportFormSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function CustomerSupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Support Request Data:", data);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly. (Simulated)",
      variant: "default",
    });
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Headset className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Customer Support</CardTitle>
            </div>
            <CardDescription>We're here to help! Reach out to us with any questions or concerns.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="shadow-md bg-primary/5 hover:shadow-lg transition-shadow animate-in fade-in duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary/80" />
                    <span className="text-foreground/90">support@ondoctor.example.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary/80" />
                    <span className="text-foreground/90">+1 (555) 123-4567 (Mon-Fri, 9am-5pm)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-primary/80" />
                    <Button variant="link" asChild className="p-0 h-auto text-foreground/90 hover:text-primary">
                      <Link href="/faq">Check our FAQs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="text-center md:text-left animate-in fade-in duration-300">
                  <Image
                    src="https://placehold.co/400x300.png"
                    alt="Customer support illustration"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-md mx-auto md:mx-0"
                    data-ai-hint="support team helpdesk"
                  />
              </div>
            </div>

            <Card className="p-6 shadow-md border-primary/20 hover:shadow-lg transition-shadow animate-in fade-in duration-300">
              <CardTitle className="text-xl mb-4 text-primary flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" /> Send us a Message
              </CardTitle>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <Input id="name" placeholder="John Doe" {...field} />}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input id="email" type="email" placeholder="you@example.com" {...field} />}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => <Input id="subject" placeholder="Regarding my appointment..." {...field} />}
                  />
                  {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => <Textarea id="message" placeholder="Please describe your issue or question..." rows={5} {...field} />}
                  />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
