
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { HealthDevice } from '@/types';
import { HeartPulse, Wifi, WifiOff, RefreshCw, Gauge, Fingerprint, FlaskConical, Scale, Activity } from 'lucide-react'; 
import { formatDistanceToNow } from 'date-fns';

const initialMockDevices: HealthDevice[] = [
  {
    id: 'dev1',
    name: 'Smart BP Monitor X1000',
    type: 'Blood Pressure Monitor',
    status: 'Connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    imageUrl: 'https://placehold.co/150x100.png',
    dataAiHint: "blood pressure monitor",
  },
  {
    id: 'dev2',
    name: 'OxiLink Pro',
    type: 'Pulse Oximeter',
    status: 'Disconnected',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    imageUrl: 'https://placehold.co/150x100.png',
    dataAiHint: "pulse oximeter",
  },
  {
    id: 'dev3',
    name: 'GlucoTrack Advanced',
    type: 'Glucose Meter',
    status: 'Syncing...',
    lastSync: new Date(Date.now() - 1000 * 30), // 30 seconds ago
    imageUrl: 'https://placehold.co/150x100.png',
    dataAiHint: "glucose meter",
  },
  {
    id: 'dev4',
    name: 'BodyComp Smart Scale',
    type: 'Smart Scale',
    status: 'Connected',
    lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    imageUrl: 'https://placehold.co/150x100.png',
    dataAiHint: "smart scale",
  },
];

const DeviceIcon: React.FC<{ type: HealthDevice['type'], className?: string }> = ({ type, className }) => {
  const commonClass = cn("h-6 w-6", className);
  switch (type) {
    case 'Blood Pressure Monitor': return <Gauge className={commonClass} />;
    case 'Pulse Oximeter': return <Fingerprint className={commonClass} />; 
    case 'Glucose Meter': return <FlaskConical className={commonClass} />;
    case 'Smart Scale': return <Scale className={commonClass} />;
    case 'Fitness Tracker': return <Activity className={commonClass} />;
    default: return <HeartPulse className={commonClass} />;
  }
};

export default function MyHealthDevicesPage() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<HealthDevice[]>([]); // Start with empty to show empty state
  const [isLoading, setIsLoading] = useState(true); // Start loading

  useEffect(() => {
    // Simulate fetching devices
    setTimeout(() => {
      // setDevices(initialMockDevices); // Uncomment to test with devices
      setDevices([]); // Keep empty to test empty state by default
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleRefreshStatus = (deviceId?: string) => {
    setIsLoading(true);
    toast({
      title: "Refreshing Status...",
      description: deviceId ? `Checking status for ${devices.find(d => d.id === deviceId)?.name}...` : "Checking all device statuses...",
    });

    setTimeout(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (deviceId && device.id !== deviceId) return device;
          const randomStatus = ['Connected', 'Disconnected', 'Error', 'Syncing...'][Math.floor(Math.random() * 4)] as HealthDevice['status'];
          return {
            ...device,
            status: randomStatus,
            lastSync: randomStatus === 'Syncing...' ? new Date() : device.lastSync, 
          };
        })
      );
      setIsLoading(false);
      toast({
        title: "Status Updated",
        description: "Device statuses have been refreshed (simulated).",
      });
    }, 1500);
  };
  
  const getStatusBadgeVariant = (status: HealthDevice['status']): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'Connected': return 'default'; 
      case 'Syncing...': return 'secondary';
      case 'Disconnected': return 'outline';
      case 'Error': return 'destructive';
      default: return 'outline';
    }
  };


  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <HeartPulse className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl text-primary">My Health Devices</CardTitle>
              </div>
              <CardDescription>View and manage your connected IoT medical devices.</CardDescription>
            </div>
            <Button onClick={() => handleRefreshStatus()} disabled={isLoading}>
              <RefreshCw className={cn("mr-2 h-5 w-5", isLoading && "animate-spin")} />
              {isLoading ? "Refreshing..." : "Refresh All"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center py-10 text-muted-foreground">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                  <p>Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground bg-card rounded-lg shadow-sm animate-in fade-in duration-300">
                <Image 
                  src="https://placehold.co/300x200.png" 
                  alt="No health devices connected" 
                  width={300} 
                  height={200} 
                  className="mx-auto mb-6 rounded-lg shadow-md"
                  data-ai-hint="empty medical devices"
                />
                <p className="text-lg mb-1">No health devices connected yet.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={() => toast({title: "Simulated Action", description: "Navigating to add device page..."})}>Connect a new device</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                  <Card key={device.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col animate-in fade-in duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <DeviceIcon type={device.type} className="text-primary" />
                          </div>
                          <CardTitle className="text-xl text-primary">{device.name}</CardTitle>
                        </div>
                        <Badge variant={getStatusBadgeVariant(device.status)} className="capitalize">
                          {device.status === 'Connected' && <Wifi className="mr-1.5 h-3 w-3" />}
                          {device.status === 'Disconnected' && <WifiOff className="mr-1.5 h-3 w-3" />}
                          {device.status === 'Syncing...' && <RefreshCw className="mr-1.5 h-3 w-3 animate-spin" />}
                          {device.status}
                        </Badge>
                      </div>
                      <CardDescription>{device.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      {device.imageUrl && (
                        <Image 
                            src={device.imageUrl} 
                            alt={device.name} 
                            width={150} 
                            height={100} 
                            className="rounded-md object-cover mx-auto shadow-sm"
                            data-ai-hint={device.dataAiHint || device.type.toLowerCase().replace(' ', '')} 
                          />
                      )}
                      <p className="text-sm text-muted-foreground">
                        Last sync: {typeof device.lastSync === 'string' ? device.lastSync : formatDistanceToNow(new Date(device.lastSync), { addSuffix: true })}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-4">
                      <Button variant="outline" size="sm" onClick={() => toast({title: "Navigate (Simulated)", description: `Viewing data for ${device.name}`})}>
                        View Data
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRefreshStatus(device.id)} disabled={isLoading && devices.find(d=>d.id === device.id)?.status === 'Syncing...'}>
                        <RefreshCw className={cn("mr-1.5 h-4 w-4", (isLoading && devices.find(d=>d.id === device.id)?.status === 'Syncing...') && "animate-spin")} />
                        Sync
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                  // Simulate adding a new device
                  const newDevice: HealthDevice = {
                      id: `dev${devices.length + 5}`, // ensure unique ID
                      name: 'New Fitness Band',
                      type: 'Fitness Tracker',
                      status: 'Disconnected',
                      lastSync: new Date(),
                      imageUrl: 'https://placehold.co/150x100.png',
                      dataAiHint: "fitness tracker",
                  };
                  setDevices(prev => [...prev, newDevice]);
                  toast({title: "New Device Added (Simulated)", description: `${newDevice.name} is ready to connect.`});
              }}>
                  <HeartPulse className="mr-2 h-5 w-5" />
                  Connect New Device
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg mt-8 hover:shadow-xl transition-shadow animate-in fade-in duration-300">
          <CardHeader>
              <CardTitle className="text-xl text-primary">Important Note</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">
                  This page is a <strong className="text-foreground">simulation</strong> of IoT medical device integration. 
                  Actual device connectivity, data synchronization, and secure data handling for medical purposes 
                  require complex backend systems, hardware-specific integrations (e.g., Bluetooth/API communication), 
                  and adherence to strict privacy and security regulations (like HIPAA). 
                  The functionality shown here is for demonstration and prototyping purposes only.
              </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}
