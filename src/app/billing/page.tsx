
"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Import Image
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign, FileText, PlusCircle, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock Data
const mockSubscription = {
  planName: "Premium Monthly",
  price: 29.99,
  currency: "USD",
  nextBillingDate: new Date(new Date().setDate(new Date().getDate() + 30)),
  status: "Active",
};

const mockPaymentMethods = [
  { id: "pm1", type: "Visa", last4: "1234", expiry: "12/2025", isDefault: true },
  { id: "pm2", type: "Mastercard", last4: "5678", expiry: "06/2026", isDefault: false },
];

const mockInvoices: any[] = [ // Set to any[] for easy toggle for testing empty state
  // { id: "inv1", date: new Date(2024, 5, 1), amount: 29.99, status: "Paid", link: "#" },
  // { id: "inv2", date: new Date(2024, 4, 1), amount: 29.99, status: "Paid", link: "#" },
  // { id: "inv3", date: new Date(2024, 3, 1), amount: 19.99, status: "Paid", link: "#" }, // Previous plan
];


export default function BillingPage() {
  const { toast } = useToast();
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [currentPaymentMethods, setCurrentPaymentMethods] = useState(mockPaymentMethods); // Use state for payment methods

  const handleAddPaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Simulate adding payment method
    const newMethod = { id: `pm${currentPaymentMethods.length + 1}`, type: "NewCard", last4: "0000", expiry: "01/2030", isDefault: false };
    setCurrentPaymentMethods(prev => [...prev, newMethod]);
    toast({
      title: "Payment Method Added (Simulated)",
      description: "Your new payment method has been successfully added.",
    });
    setShowAddPaymentMethod(false);
  };

  const handleUpgradePlan = () => {
     toast({
      title: "Plan Upgraded (Simulated)",
      description: "You have successfully upgraded your plan!",
    });
  }

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 w-full">
        <Card className="shadow-xl animate-in fade-in duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl text-primary">Billing & Subscriptions</CardTitle>
            </div>
            <CardDescription>Manage your subscription, payment methods, and view invoice history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Current Subscription */}
            <Card className="shadow-md bg-primary/5 hover:shadow-lg transition-shadow animate-in fade-in duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Plan:</strong> {mockSubscription.planName}</p>
                <p><strong>Price:</strong> ${mockSubscription.price.toFixed(2)} / month</p>
                <p><strong>Status:</strong> <span className={mockSubscription.status === "Active" ? "text-green-600" : "text-destructive"}>{mockSubscription.status}</span></p>
                <p><strong>Next Billing Date:</strong> {mockSubscription.nextBillingDate.toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Change Plan</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cancelling your subscription will remove access to premium features at the end of your current billing cycle. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => toast({ title: "Subscription Cancelled (Simulated)", variant: "default"})} 
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Confirm Cancellation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>

            {/* Payment Methods */}
            <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center justify-between">
                  <span>Payment Methods</span>
                  <Button variant="outline" size="sm" onClick={() => setShowAddPaymentMethod(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPaymentMethods.length > 0 ? (
                  <ul className="space-y-3">
                    {currentPaymentMethods.map(pm => (
                      <li key={pm.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors animate-in fade-in duration-300">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-6 w-6 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{pm.type} ending in {pm.last4}</p>
                            <p className="text-sm text-muted-foreground">Expires: {pm.expiry}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {pm.isDefault && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Default</span>}
                          {!pm.isDefault && <Button variant="ghost" size="sm" onClick={() => toast({title: "Default Set (Simulated)"})}>Set as Default</Button>}
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image 
                      src="https://placehold.co/200x150.png" 
                      alt="No payment methods" 
                      width={200} 
                      height={150} 
                      className="mx-auto mb-4 rounded-lg shadow-sm"
                      data-ai-hint="empty wallet credit card"
                    />
                    <p>No payment methods saved.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Payment Method Form (Modal or inline) */}
            {showAddPaymentMethod && (
              <Card className="p-6 shadow-lg border-primary hover:shadow-xl transition-shadow animate-in fade-in duration-300">
                <CardTitle className="text-lg mb-4 text-primary">Add New Payment Method</CardTitle>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="•••• •••• •••• ••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input id="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="•••" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardHolderName">Cardholder Name</Label>
                    <Input id="cardHolderName" placeholder="John Doe" />
                  </div>
                  <div className="flex justify-end space-x-2">
                      <Button type="button" variant="ghost" onClick={() => setShowAddPaymentMethod(false)}>Cancel</Button>
                      <Button type="submit" className="bg-accent hover:bg-accent/90">Add Card</Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Invoice History */}
            <Card className="shadow-md hover:shadow-lg transition-shadow animate-in fade-in duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center"><FileText className="mr-2 h-6 w-6"/>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInvoices.map(invoice => (
                      <TableRow key={invoice.id} className="animate-in fade-in duration-300">
                        <TableCell className="font-medium">{invoice.id.toUpperCase()}</TableCell>
                        <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${invoice.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="link" asChild size="sm">
                            <a href={invoice.link} target="_blank" rel="noopener noreferrer">View Invoice</a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {mockInvoices.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Image 
                      src="https://placehold.co/200x150.png" 
                      alt="No invoices" 
                      width={200} 
                      height={150} 
                      className="mx-auto mb-4 rounded-lg shadow-sm"
                      data-ai-hint="empty file document"
                    />
                    <p>No invoices yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
