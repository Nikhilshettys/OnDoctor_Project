
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Heart, Activity, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Direct import from recharts

// Mock data for charts
const bpData = [
  { date: 'Jul 1', systolic: 120, diastolic: 80 },
  { date: 'Jul 8', systolic: 122, diastolic: 78 },
  { date: 'Jul 15', systolic: 118, diastolic: 75 },
  { date: 'Jul 22', systolic: 125, diastolic: 82 },
  { date: 'Jul 29', systolic: 123, diastolic: 80 },
];

const heartRateData = [
  { date: 'Jul 1', rate: 70 },
  { date: 'Jul 8', rate: 72 },
  { date: 'Jul 15', rate: 68 },
  { date: 'Jul 22', rate: 75 },
  { date: 'Jul 29', rate: 73 },
];

const weightData = [
  { date: 'Jul 1', weight: 70 },
  { date: 'Jul 8', weight: 69.5 },
  { date: 'Jul 15', weight: 69 },
  { date: 'Jul 22', weight: 69.2 },
  { date: 'Jul 29', weight: 68.5 },
];

// Helper component for individual chart cards
interface HealthChartCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  lines: { dataKey: string; stroke: string; name?: string }[];
  yAxisLabel?: string;
}

const HealthChartCard: React.FC<HealthChartCardProps> = ({ title, icon, data, lines, yAxisLabel }) => {
  // Determine Y-axis domain dynamically based on data to provide some padding
  const allValues = data.flatMap(d => lines.map(line => d[line.dataKey])).filter(v => typeof v === 'number');
  let yMin = Math.min(...allValues);
  let yMax = Math.max(...allValues);
  const padding = (yMax - yMin) * 0.1 || 5; // 10% padding or 5 units if range is 0
  yMin = Math.max(0, Math.floor(yMin - padding)); // Ensure min is not less than 0
  yMax = Math.ceil(yMax + padding);


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in duration-300">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl text-primary">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              domain={[yMin, yMax]}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' } : undefined}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
            {lines.map((line, index) => (
              <Line 
                key={index} 
                type="monotone" 
                dataKey={line.dataKey} 
                stroke={line.stroke}
                strokeWidth={2}
                name={line.name || line.dataKey}
                dot={{ r: 4, fill: line.stroke }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};


export default function HealthProgressPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Health Progress</CardTitle>
            </div>
            <CardDescription>Visualize your health data and track your progress over time (simulated data).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthChartCard
                title="Blood Pressure Trend"
                icon={<Heart className="h-6 w-6" />}
                data={bpData}
                lines={[
                  { dataKey: 'systolic', stroke: 'hsl(var(--chart-1))', name: 'Systolic (mmHg)' },
                  { dataKey: 'diastolic', stroke: 'hsl(var(--chart-2))', name: 'Diastolic (mmHg)' },
                ]}
                yAxisLabel="mmHg"
              />
              <HealthChartCard
                title="Heart Rate Trend"
                icon={<Activity className="h-6 w-6" />}
                data={heartRateData}
                lines={[{ dataKey: 'rate', stroke: 'hsl(var(--chart-3))', name: 'Heart Rate (bpm)' }]}
                yAxisLabel="bpm"
              />
              <HealthChartCard
                title="Weight Trend"
                icon={<Scale className="h-6 w-6" />}
                data={weightData}
                lines={[{ dataKey: 'weight', stroke: 'hsl(var(--chart-4))', name: 'Weight (kg)' }]}
                yAxisLabel="kg"
              />
              {/* Add more charts here if needed, e.g., Sleep, Activity Levels */}
              <Card className="shadow-md hover:shadow-lg transition-shadow flex items-center justify-center bg-muted/30 min-h-[300px] lg:col-span-1 animate-in fade-in duration-300">
                  <CardContent className="text-center">
                      <CardTitle className="text-xl text-primary mb-2">More Coming Soon</CardTitle>
                      <CardDescription>Additional health metrics will be available here.</CardDescription>
                  </CardContent>
              </Card>
            </div>
            <Card className="mt-8 bg-primary/5 border-primary/20 shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-300">
              <CardHeader>
                  <CardTitle className="text-lg text-primary">Simulation Note</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-foreground/90">
                      The data shown here is for demonstration purposes only and is not real health data. 
                      Actual health progress tracking requires integration with medical devices or manual data input, 
                      secure data storage, and professional medical interpretation.
                  </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
