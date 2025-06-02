
"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Import Image
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { generateMealPlan } from '@/ai/flows/generate-meal-plan-flow';
import type { MealPlannerFormData, MealPlannerFlowInput, MealPlannerFlowOutput, MealSuggestionItem } from '@/types';
import { Utensils, Apple, Leaf, Drumstick, Loader2, Lightbulb, Info } from 'lucide-react';

const mealPlannerFormSchema = z.object({
  age: z.string().regex(/^\d+$/, "Age must be a number.").min(1, "Age is required."),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Gender is required." }),
  dietaryPreference: z.enum(['Vegetarian', 'Non-Vegetarian'], { required_error: "Dietary preference is required." }),
});

export default function MealPlannerPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlanResult, setMealPlanResult] = useState<MealPlannerFlowOutput | null>(null);

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<MealPlannerFormData>({
    resolver: zodResolver(mealPlannerFormSchema),
    defaultValues: {
      age: "",
      gender: "" as any,
      dietaryPreference: "" as any,
    },
  });

  const onSubmit = async (data: MealPlannerFormData) => {
    setIsGenerating(true);
    setMealPlanResult(null);

    const flowInput: MealPlannerFlowInput = {
      age: parseInt(data.age, 10),
      gender: data.gender as 'Male' | 'Female' | 'Other',
      dietaryPreference: data.dietaryPreference as 'Vegetarian' | 'Non-Vegetarian',
    };

    try {
      const result = await generateMealPlan(flowInput);
      setMealPlanResult(result);
      toast({
        title: "Meal Plan Generated",
        description: "Your personalized meal suggestions are ready!",
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error Generating Plan",
        description: "Could not generate meal suggestions. " + (error instanceof Error ? error.message : String(error)),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Utensils className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Personalized Meal Planner</CardTitle>
            </div>
            <CardDescription>Get AI-powered meal suggestions tailored to your age, gender, and dietary preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <fieldset className="grid md:grid-cols-3 gap-6 border p-4 rounded-md animate-in fade-in duration-300">
                <legend className="text-lg font-semibold text-primary px-1">Your Details</legend>
                <div>
                  <Label htmlFor="age">Age (Years)</Label>
                  <Input id="age" type="number" {...register("age")} placeholder="e.g., 30" />
                  {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="gender">
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
                  {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                  <Controller
                    name="dietaryPreference"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="dietaryPreference">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetarian">
                            <div className="flex items-center"><Leaf className="mr-2 h-4 w-4 text-green-600" />Vegetarian</div>
                          </SelectItem>
                          <SelectItem value="Non-Vegetarian">
                            <div className="flex items-center"><Drumstick className="mr-2 h-4 w-4 text-orange-600" />Non-Vegetarian</div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.dietaryPreference && <p className="text-sm text-destructive mt-1">{errors.dietaryPreference.message}</p>}
                </div>
              </fieldset>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Apple className="mr-2 h-5 w-5" />}
                  {isGenerating ? 'Generating Plan...' : 'Generate Meal Plan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { reset(); setMealPlanResult(null); }}>
                  Reset Form
                </Button>
              </div>
            </form>

            {isGenerating && (
              <div className="mt-8 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-2 text-muted-foreground">Crafting your meal plan...</p>
              </div>
            )}

            {mealPlanResult && !isGenerating && (
              <Card className="mt-8 shadow-lg hover:shadow-xl transition-shadow animate-in fade-in duration-500">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Your Meal Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {mealPlanResult.mealPlan.map((meal, index) => (
                      <Card key={index} className="bg-card hover:shadow-md transition-shadow animate-in fade-in duration-300">
                        <CardHeader>
                          <CardTitle className="text-xl text-primary flex items-center">
                            {meal.mealType === "Breakfast" && <Utensils className="mr-2 h-5 w-5"/>}
                            {meal.mealType === "Lunch" && <Utensils className="mr-2 h-5 w-5"/>}
                            {meal.mealType === "Dinner" && <Utensils className="mr-2 h-5 w-5"/>}
                            {meal.mealType}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-foreground/80">{meal.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {mealPlanResult.generalAdvice && (
                    <Card className="bg-primary/5 border-primary/20 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary flex items-center">
                          <Lightbulb className="mr-2 h-5 w-5" /> General Dietary Advice
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/90">{mealPlanResult.generalAdvice}</p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}

            {!isGenerating && !mealPlanResult && (
              <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center text-muted-foreground animate-in fade-in duration-300">
                  <Image 
                    src="https://placehold.co/300x200.png" 
                    alt="Meal planner intro" 
                    width={300} 
                    height={200} 
                    className="mx-auto mb-6 rounded-lg shadow-md"
                    data-ai-hint="healthy food planning"
                  />
                  <p className="text-lg">Fill in your details above and click "Generate Meal Plan" to get personalized suggestions.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
